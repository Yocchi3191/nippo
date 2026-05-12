import Database from 'better-sqlite3'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { beforeEach, describe, expect, it } from 'vitest'
import { SqliteNippoRepository } from './sqliteNippoRepository.js'
import { NippoNotFoundError } from './nippoNotFoundError.js'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { nippos } from './schema.js'

describe('SqliteNippoRepositoryのテスト', async () => {
  let repo: SqliteNippoRepository
  beforeEach(async () => {
    const sqlite = Database(':memory:')
    const db = drizzle(sqlite)
    migrate(db, { migrationsFolder: './drizzle' })
    seed(db)
    repo = new SqliteNippoRepository(db)
  })
  it('findAll', async () => {
    const results = await repo.findAll()
    expect(results).toHaveLength(2)
  })
  it('findById 正常系', async () => {
    const result = await repo.findById(1)
    expect(result.id).toBe(1)
  })
  it('findById 異常系', async () => {
    await expect(repo.findById(999)).rejects.toThrow(NippoNotFoundError)
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
