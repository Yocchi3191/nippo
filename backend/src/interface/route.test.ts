import { describe, expect, it, beforeEach } from 'vitest'
import { join } from 'path'
import { createApp, type AppType } from './app.js'
import Database from 'better-sqlite3'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { nippos } from '../infrastructure/schema.js'

describe('ルーティングのテスト', () => {
  let app: AppType

  beforeEach(() => {
    const sqlite = Database(':memory:')
    const db = drizzle(sqlite)
    seed(db)
    app = createApp(db)
  })

  it('全件取得', async () => {
    const res = await app.request('/nippo')
    expect(res.status).toBe(200)
    const rows = await res.json()
    expect(rows).toHaveLength(2)
  })

  it('id検索 正常系', async () => {
    const res = await app.request('/nippo/1')
    expect(res.status).toBe(200)
    const row = await res.json()
    expect(row.title).toBe(testData[0].title)
  })

  it('id検索 異常系', async () => {
    const res = await app.request('/nippo/999')
    expect(res.status).toBe(404)
  })

  it('にっぽー作成 正常系', async () => {
    const testData = {
      title: 'ほげほげ',
      content: 'ふがふが',
    }

    const res = await app.request('/nippo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    })

    expect(res.status).toBe(201)
    const result = await res.json()
    expect(result.title).toBe(testData.title)
    expect(result.content).toBe(testData.content)
  })

  it('にっぽー作成 異常系', async () => {
    const badData = {
      title: null,
      content: '',
    }

    const res = await app.request('/nippo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(badData),
    })

    expect(res.status).toBe(400)
  })

  it('にっぽー更新 正常系', async () => {
    const updateData = {
      title: 'テスト日報1-1',
      content: '今日やったこと1-1',
    }

    const res = await app.request('/nippo/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    expect(res.status).toBe(200)
    const result = await res.json()
    expect(result.title).toBe(updateData.title)
    expect(result.content).toBe(updateData.content)
  })

  it('にっぽー更新 異常系 更新対象が見つからない', async () => {
    const updateData = {
      title: 'テスト日報1-1',
      content: '今日やったこと1-1',
    }

    const res = await app.request('/nippo/999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    expect(res.status).toBe(404)
  })

  it('にっぽー更新 異常系 不正エントリー', async () => {
    const badData = {
      title: null,
      content: '',
    }
    const res = await app.request('/nippo/999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(badData),
    })

    expect(res.status).toBe(400)
  })

  it('にっぽー削除 正常系', async () => {
    const res = await app.request('/nippo/1', {
      method: 'DELETE',
    })

    expect(res.status).toBe(204)
  })

  it('にっぽー削除 異常系', async () => {
    const res = await app.request('/nippo/999', {
      method: 'DELETE',
    })

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
  const drizzlePath = join(__dirname, '../../drizzle')
  migrate(db, { migrationsFolder: drizzlePath })
  db.insert(nippos).values(testData).run()
}
