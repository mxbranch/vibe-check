import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const test = pgTable('test', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  value: varchar({ length: 255 }).notNull(),
})
