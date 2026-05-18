import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const nippos = sqliteTable('nippos', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  content: text().notNull(),
  createdAt: text()
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
})
