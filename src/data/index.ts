import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, asc, desc, eq, getTableColumns, inArray, isNotNull, isNull, not } from 'drizzle-orm'
import * as v from 'valibot'

import db from '@/db'
import { room, submission, prompt, user as userTable, session, account } from '@/db/schema'
import { auth } from '@/lib/auth'
import { sqids } from '@/lib/sqids'

// Auth Logic
export const getMe = createServerFn({
  method: 'GET',
}).handler(async () => {
  const request = getRequest()
  const getSessionResponse = await auth.api.getSession({
    headers: request.headers,
  })

  if (!getSessionResponse) {
    return null
  }

  return {
    id: getSessionResponse.user.id,
    image: getSessionResponse.user.image,
    username: getSessionResponse.user.name,
    banned: getSessionResponse.user.banned,
    role: getSessionResponse.user.role,
  }
})

export const getUser = createServerFn({
  method: 'GET',
})
  .inputValidator(v.nullable(v.pipe(v.string(), v.trim())))
  .handler(async ({ data }) => {
    if (!data) return null
    // Auth
    const user = await getMe()
    const allowed = user && !user.banned
    if (!allowed) return 'unauthorized'

    const userResult = await db.select().from(userTable).where(eq(userTable.id, data))
    const userData = userResult[0]

    if (!userData) {
      return null
    }

    return {
      id: userData.id,
      image: userData.image,
      username: userData.name,
      banned: userData.banned,
      role: userData.role,
    }
  })

export const deleteMe = createServerFn({
  method: 'POST',
}).handler(async () => {
  const user = await getMe()
  if (!user) return 'no user session found'

  await db.transaction(async (tx) => {
    // Delete submissions first
    await tx.delete(submission).where(eq(submission.owner, user.id))

    // Get rooms owned by the user
    const rooms = await tx.select({ id: room.id }).from(room).where(eq(room.owner, user.id))
    // If there are any rooms, remove any related submissions and then remove the rooms
    if (rooms.length > 0) {
      const roomIds = rooms.map((room) => room.id)
      await tx.delete(submission).where(inArray(submission.room, roomIds))
      await tx.delete(room).where(inArray(room.id, roomIds))
    }

    // Delete the user
    await tx.delete(session).where(eq(session.userId, user.id))
    await tx.delete(account).where(eq(account.userId, user.id))
    await tx.delete(userTable).where(eq(userTable.id, user.id))
  })
})

// Room Logic
export const validateRoomCode = createServerFn({
  method: 'GET',
})
  .inputValidator(v.pipe(v.string(), v.trim()))
  .handler(async ({ data }) => {
    const roomId = sqids.decode(data)
    const roomCount = await db.$count(room, and(inArray(room.id, roomId), isNull(room.gameEnded)))
    return roomCount > 0
  })

export const createRoom = createServerFn({
  method: 'POST',
}).handler(async () => {
  // Auth
  const user = await getMe()
  const allowed = user?.role === 'admin' && !user.banned
  if (!allowed) return 'unauthorized'

  // If previous room(s) exists, close
  const updatedRooms = await db
    .update(room)
    .set({
      gameEnded: new Date(),
    })
    .where(and(eq(room.owner, user.id), isNull(room.gameEnded)))
    .returning({ id: room.id })
  // Update submissions for existing room(s)
  const now = new Date()
  for (const updatedRoom of updatedRooms) {
    await db
      .update(submission)
      .set({
        used: {
          timestamp: now.toISOString(),
          result: 'skipped',
          guess: undefined,
        },
      })
      .where(and(eq(submission.room, updatedRoom.id)))
  }

  // Create new room
  const newRoom = await db
    .insert(room)
    .values({
      owner: user.id,
    })
    .returning({ id: room.id })
  const newRoomCode = sqids.encode([newRoom[0].id])
  return {
    code: newRoomCode,
  }
})

export const getRoom = createServerFn({
  method: 'GET',
})
  .inputValidator(v.pipe(v.string(), v.trim()))
  .handler(async ({ data }) => {
    const roomId = sqids.decode(data)
    const roomData = await db
      .select()
      .from(room)
      .where(and(inArray(room.id, roomId), isNull(room.gameEnded)))
    const selectedRoom = roomData[0]
    if (!selectedRoom) return null
    return selectedRoom
  })

export const getUserCurrentRoom = createServerFn({
  method: 'GET',
}).handler(async () => {
  // Auth
  const user = await getMe()
  if (!user || user.banned) return 'unauthorized'

  const rooms = await db
    .select()
    .from(room)
    .where(and(isNull(room.gameEnded), eq(room.owner, user.id)))
    .orderBy(desc(room.id))
    .limit(1)
  if (rooms.length === 0) {
    return null
  }
  return sqids.encode([rooms[0].id])
})

export const getValidSubmission = createServerFn({ method: 'GET' })
  .inputValidator(
    v.object({
      roomId: v.pipe(v.number(), v.integer()),
    }),
  )
  .handler(async ({ data }) => {
    const { roomId } = data
    // Auth
    const user = await getMe()
    if (!user || user.banned) return 'unauthorized'

    // Check that room exists and is open
    const roomCount = await db.$count(room, and(eq(room.id, roomId), isNull(room.gameEnded)))
    if (roomCount === 0) {
      return 'room-closed'
    }

    // Check whether a valid submission exists
    const submissionWhereClause = and(
      eq(submission.owner, user.id),
      eq(submission.room, roomId),
      isNull(submission.used),
    )
    const validSubmissionCount = await db.$count(submission, submissionWhereClause)
    if (validSubmissionCount === 0) {
      const usedPrompts = await db
        .select({ prompt: submission.prompt })
        .from(submission)
        .where(eq(submission.room, roomId))
      const usedPromptIds = usedPrompts.map(({ prompt }) => prompt)

      const prompts = await db
        .select()
        .from(prompt)
        .where(and(isNull(prompt.deactivated), not(inArray(prompt.id, usedPromptIds))))
      if (prompts.length === 0) {
        return 'out-of-prompts'
      }
      const index = Math.floor(Math.random() * prompts.length)
      const submissionPrompt = prompts[index]
      const target = Math.random()
      await db.insert(submission).values({
        room: roomId,
        owner: user.id,
        prompt: submissionPrompt.id,
        target,
      })
    }

    const validSubmissions = await db
      .select({
        ...getTableColumns(submission),
        from: prompt.from,
        to: prompt.to,
        roomOwner: room.owner,
      })
      .from(submission)
      .leftJoin(prompt, eq(submission.prompt, prompt.id))
      .leftJoin(room, eq(submission.room, room.id))
      .where(submissionWhereClause)
      .orderBy(desc(submission.id))
      .limit(1)
    const validSubmission = validSubmissions[0]
    return {
      id: validSubmission.id,
      from: validSubmission.from,
      to: validSubmission.to,
      target: validSubmission.target,
      hint: validSubmission.hint,
      used: validSubmission.used,
      roomOwner: validSubmission.roomOwner,
    }
  })

export const postSubmissionSchema = v.object({
  hint: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(140)),
  submissionId: v.pipe(v.number(), v.integer()),
})
export type PostSubmissionSchema = v.InferInput<typeof postSubmissionSchema>

export const postSubmission = createServerFn({ method: 'POST' })
  .inputValidator(postSubmissionSchema)
  .handler(async ({ data }) => {
    // Auth
    const user = await getMe()
    if (!user || user.banned) return 'unauthorized'

    // Update submission if the user is allowed to
    const now = new Date()
    await db
      .update(submission)
      .set({
        hint: data.hint,
        timestamp: now,
      })
      .where(and(eq(submission.id, data.submissionId), eq(submission.owner, user.id)))
  })

export const getRoomCurrentSubmission = createServerFn({ method: 'GET' })
  .inputValidator(
    v.object({
      roomId: v.pipe(v.number(), v.integer()),
    }),
  )
  .handler(async ({ data }) => {
    // Auth
    const user = await getMe()
    const allowed = user?.role === 'admin' && !user.banned
    if (!allowed) return 'unauthorized'

    // Get first unused submission for this room
    const submissionResult = await db
      .select({
        ...getTableColumns(submission),
        from: prompt.from,
        to: prompt.to,
      })
      .from(submission)
      .leftJoin(room, eq(room.id, submission.room))
      .leftJoin(prompt, eq(prompt.id, submission.prompt))
      .where(
        and(
          eq(submission.room, data.roomId),
          eq(room.owner, user.id),
          isNull(submission.used),
          isNotNull(submission.hint),
          isNotNull(submission.timestamp),
        ),
      )
      .limit(1)
      .orderBy(asc(submission.timestamp))

    const activeSubmission = submissionResult[0]

    if (!activeSubmission) {
      return null
    }

    return {
      id: activeSubmission.id,
      owner: activeSubmission.owner,
      from: activeSubmission.from,
      to: activeSubmission.to,
      target: activeSubmission.target,
      hint: activeSubmission.hint,
    }
  })

export const getRoomNextSubmission = createServerFn({ method: 'GET' })
  .inputValidator(
    v.object({
      roomId: v.pipe(v.number(), v.integer()),
    }),
  )
  .handler(async ({ data }) => {
    // Auth
    const user = await getMe()
    const allowed = user?.role === 'admin' && !user.banned
    if (!allowed) return 'unauthorized'

    // Get second unused submission for this room
    const submissionResult = await db
      .select({
        ...getTableColumns(submission),
        from: prompt.from,
        to: prompt.to,
      })
      .from(submission)
      .leftJoin(room, eq(room.id, submission.room))
      .leftJoin(prompt, eq(prompt.id, submission.prompt))
      .where(
        and(
          eq(submission.room, data.roomId),
          eq(room.owner, user.id),
          isNull(submission.used),
          isNotNull(submission.hint),
          isNotNull(submission.timestamp),
        ),
      )
      .offset(1) // Second!
      .limit(1)
      .orderBy(asc(submission.timestamp))

    const activeSubmission = submissionResult[0]

    if (!activeSubmission) {
      return null
    }

    return {
      id: activeSubmission.id,
      owner: activeSubmission.owner,
      from: activeSubmission.from,
      to: activeSubmission.to,
      target: activeSubmission.target,
      hint: activeSubmission.hint,
    }
  })

export const markSubmissionUsed = createServerFn({ method: 'POST' })
  .inputValidator(
    v.object({
      roomId: v.pipe(v.number(), v.integer()),
      submissionId: v.pipe(v.number(), v.integer()),
      guess: v.pipe(v.number()),
      result: v.optional(
        v.union([v.literal('played'), v.literal('banned'), v.literal('skipped')]),
        'played',
      ),
    }),
  )
  .handler(async ({ data }) => {
    // Auth
    const user = await getMe()
    const allowed = user?.role === 'admin' && !user.banned
    if (!allowed) return 'unauthorized'

    const now = new Date()
    const updatedSubmission = await db
      .update(submission)
      .set({
        used: {
          timestamp: now.toISOString(),
          result: data.result,
          guess: data.guess,
        },
      })
      .where(and(eq(submission.room, data.roomId), eq(submission.id, data.submissionId)))
      .returning({ owner: submission.owner })
    if (data.result === 'banned') {
      const { owner } = updatedSubmission[0]
      const request = getRequest()
      await auth.api.banUser({
        body: {
          userId: owner,
        },
        headers: request.headers,
      })
    }
  })

export const closeRoom = createServerFn({ method: 'POST' })
  .inputValidator(
    v.object({
      roomId: v.pipe(v.number(), v.integer()),
    }),
  )
  .handler(async ({ data }) => {
    // Auth
    const user = await getMe()
    const allowed = user?.role === 'admin' && !user.banned
    if (!allowed) return 'unauthorized'

    // Update room
    const now = new Date()
    await db
      .update(room)
      .set({
        gameEnded: now,
      })
      .where(and(eq(room.id, data.roomId)))

    // Update submissions
    await db
      .update(submission)
      .set({
        used: {
          timestamp: now.toISOString(),
          result: 'skipped',
          guess: undefined,
        },
      })
      .where(and(eq(submission.room, data.roomId)))
  })
