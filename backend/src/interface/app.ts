import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { nippoRoute } from './route.js'
import type { NippoEnv } from './NippoEnv.js'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { SqliteNippoRepository } from '../infrastructure/sqliteNippoRepository.js'

export const createApp = (db: BetterSQLite3Database<any>) => {
  const repo = new SqliteNippoRepository(db)

  return new Hono<NippoEnv>()
    .use('*', cors())
    .use('*', async (c, next) => {
      c.set('repository', repo)
      await next()
    })
    .route('/nippo', nippoRoute)
}

export type AppType = ReturnType<typeof createApp>
