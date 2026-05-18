import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

const sqlite = Database('./nippo.db')
export const db = drizzle(sqlite)
