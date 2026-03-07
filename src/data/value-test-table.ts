import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'
import db from '@/db'
import { test } from '@/db/schema'
import { desc } from 'drizzle-orm'

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
