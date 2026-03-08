import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, desc, eq, inArray, isNull } from 'drizzle-orm'
import * as v from 'valibot'

import db from '@/db'
import { test, room } from '@/db/schema'
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

// Test Server Fns
export const getValues = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db.select().from(test).limit(5).orderBy(desc(test.id))
})

export const setValue = createServerFn({ method: 'POST' })
  .inputValidator(v.pipe(v.string(), v.trim()))
  .handler(async ({ data }) => {
    await db.insert(test).values({
      value: data,
    })
    return { success: true }
  })
