import { createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, desc, eq, inArray, isNull } from 'drizzle-orm'
import * as v from 'valibot'

import db from '@/db'
import { room, submission } from '@/db/schema'
import { auth } from '@/lib/auth'
import { sqids } from '@/lib/sqids'

import options from './options.json'

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

// Room Logic
export const validateRoomCode = createServerFn({
  method: 'GET',
})
  .inputValidator(v.pipe(v.string(), v.trim()))
  .handler(async ({ data }) => {
    const roomId = sqids.decode(data)
    const roomCount = await db.$count(room, inArray(room.id, roomId))
    return roomCount > 0
  })

export const createRoom = createServerFn({
  method: 'POST',
}).handler(async () => {
  // Auth
  const user = await getMe()
  const allowed = user?.role === 'admin'
  if (!allowed) return 'unauthorized'

  // If previous room exists, close
  await db
    .update(room)
    .set({
      gameEnded: new Date(),
    })
    .where(and(eq(room.owner, user.id), isNull(room.gameEnded)))

  // Create new rooms
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

const getPrompt = createServerOnlyFn(async () => {
  const index = Math.floor(Math.random() * options.length)
  return options[index]
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
    if (!user) return 'unauthorized'

    // Check whether a valid submission exists
    const submissionWhereClause = and(
      eq(submission.owner, user.id),
      eq(submission.room, roomId),
      isNull(submission.used),
    )
    const validSubmissionCount = await db.$count(submission, submissionWhereClause)
    if (validSubmissionCount === 0) {
      const prompt = await getPrompt()
      await db.insert(submission).values({
        room: roomId,
        owner: user.id,
        from: prompt[0] ?? '',
        to: prompt[1] ?? '',
        target: Math.random().toPrecision(2),
      })
    }

    const validSubmissions = await db
      .select()
      .from(submission)
      .where(submissionWhereClause)
      .orderBy(desc(submission.id))
      .limit(1)
    const validSubmission = validSubmissions[0]
    return {
      id: validSubmission.id,
      from: validSubmission.from,
      to: validSubmission.to,
      target: validSubmission.target,
    }
  })
