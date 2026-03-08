import { integer, json, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { user } from './auth'

export const room = pgTable('room', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  owner: text()
    .references(() => user.id)
    .notNull(),
  timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  gameEnded: timestamp({ withTimezone: true, mode: 'date' }),
})

export const submission = pgTable('submission', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  room: integer()
    .references(() => room.id)
    .notNull(),
  owner: text()
    .references(() => user.id)
    .notNull(),
  prompt: integer()
    .references(() => prompt.id)
    .notNull(),
  target: numeric({ scale: 2, precision: 3 }).notNull(),
  hint: text(),
  timestamp: timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  used: json().$type<{
    timestamp: string
    result: 'played' | 'skipped' | 'banned'
    guess: number | undefined
  }>(),
})

export const prompt = pgTable('prompt', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  from: text().notNull(),
  to: text().notNull(),
  deactivated: timestamp({ withTimezone: true, mode: 'date' }),
})
