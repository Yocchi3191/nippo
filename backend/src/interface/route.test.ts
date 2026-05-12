import { describe, expect, it, beforeEach } from 'vitest'
import { app } from './app.js'
import { SqliteNippoRepository } from '../infrastructure/sqliteNippoRepository.js'
import Database from 'better-sqlite3'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { nippos } from '../infrastructure/schema.js'

describe('ルーティングのテスト', () => {
  let repository: SqliteNippoRepository

  beforeEach(() => {
    const sqlite = Database(':memory:')
    const db = drizzle(sqlite)
    migrate(db, { migrationsFolder: './drizzle' })
    seed(db)
    repository = new SqliteNippoRepository(db)
  })

  it('全件取得', async () => {
    const res = await app.request('/nippo', {}, { repository })
    expect(res.status).toBe(200)
    const rows = await res.json()
    expect(rows).toHaveLength(2)
  })

  it('id検索 正常系', async () => {
    const res = await app.request('/nippo/1', {}, { repository })
    expect(res.status).toBe(200)
    const row = await res.json()
    expect(row.title).toBe(testData[0].title)
  })

  it('id検索 異常系', async () => {
    const res = await app.request('/nippo/999', {}, { repository })
    expect(res.status).toBe(404)
  })
})

const testData = [
  { title: 'テスト日報1', content: '今日やったこと1' },
  { title: 'テスト日報2', content: '今日やったこと2' },
]
function seed(
  db: BetterSQLite3Database<Record<string, never>> & {
    $client: Database.Database
  },
) {
  db.insert(nippos).values(testData).run()
}
