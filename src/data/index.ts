import { createServerFn } from '@tanstack/react-start'
import { desc, inArray } from 'drizzle-orm'
import * as v from 'valibot'

import db from '@/db'
import { test, room } from '@/db/schema'
import { sqids } from '@/lib/sqids'

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
