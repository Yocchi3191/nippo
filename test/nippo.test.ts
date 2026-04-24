import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app.js'
import { client, db } from '../src/db.js'
import { nippos } from '../src/nippo/schema/nippos.js'

beforeEach(async () => {
  await db.delete(nippos)
})

afterAll(async () => {
  await client.end()
})

// リクエストヘルパー
const get = (path: string) => app.request(`http://localhost${path}`)

const post = (path: string, body?: unknown) =>
  app.request(`http://localhost${path}`, {
    method: 'POST',
    ...(body !== undefined && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })

const put = (path: string, body: unknown) =>
  app.request(`http://localhost${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

const del = (path: string, body?: unknown) =>
  app.request(`http://localhost${path}`, {
    method: 'DELETE',
    ...(body !== undefined && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })

// テストデータ作成ヘルパー
const createNippo = async (title = 'テストタイトル', content = 'テスト内容') => {
  const res = await post('/nippo', { title, content })
  return res.json() as Promise<{ id: number; title: string; content: string; deletedAt: string | null }>
}

describe('POST /nippo - 追加', () => {
  it('201 + 作成した日報を返す', async () => {
    const res = await post('/nippo', { title: '今日の日報', content: '今日はAPIを作りました' })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.title).toBe('今日の日報')
    expect(body.content).toBe('今日はAPIを作りました')
    expect(body.deletedAt).toBeNull()
  })

  it('400 - titleが空', async () => {
    const res = await post('/nippo', { title: '', content: '内容' })
    expect(res.status).toBe(400)
  })

  it('400 - contentが空', async () => {
    const res = await post('/nippo', { title: 'タイトル', content: '' })
    expect(res.status).toBe(400)
  })
})

describe('POST /nippo/bulk - 一括追加', () => {
  it('201 + 作成した日報一覧を返す', async () => {
    const res = await post('/nippo/bulk', [
      { title: '日報1', content: '内容1' },
      { title: '日報2', content: '内容2' },
    ])
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body).toHaveLength(2)
    expect(body[0].title).toBe('日報1')
    expect(body[1].title).toBe('日報2')
  })

  it('400 - 1件でもtitleが空なら弾く', async () => {
    const res = await post('/nippo/bulk', [
      { title: '', content: '内容1' },
      { title: '日報2', content: '内容2' },
    ])
    expect(res.status).toBe(400)
  })
})

describe('GET /nippo - 一覧取得', () => {
  it('200 + 削除済みを除く一覧を返す', async () => {
    const n1 = await createNippo('日報1', '内容1')
    await createNippo('日報2', '内容2')
    await del(`/nippo/${n1.id}`)

    const res = await get('/nippo')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(1)
    expect(body[0].title).toBe('日報2')
  })

  it('200 + 0件のとき空配列を返す', async () => {
    const res = await get('/nippo')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })
})

describe('GET /nippo/:id - 詳細取得', () => {
  it('200 + 日報を返す', async () => {
    const created = await createNippo()
    const res = await get(`/nippo/${created.id}`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe(created.id)
  })

  it('404 - 存在しないid', async () => {
    const res = await get('/nippo/9999')
    expect(res.status).toBe(404)
  })

  it('404 - 削除済みの日報', async () => {
    const created = await createNippo()
    await del(`/nippo/${created.id}`)
    const res = await get(`/nippo/${created.id}`)
    expect(res.status).toBe(404)
  })
})

describe('PUT /nippo/:id - 更新', () => {
  it('200 + 更新後の日報を返す', async () => {
    const created = await createNippo('元タイトル', '元内容')
    const res = await put(`/nippo/${created.id}`, { title: '新タイトル', content: '新内容' })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.title).toBe('新タイトル')
    expect(body.content).toBe('新内容')
  })

  it('404 - 存在しないid', async () => {
    const res = await put('/nippo/9999', { title: 'タイトル', content: '内容' })
    expect(res.status).toBe(404)
  })

  it('404 - 削除済みの日報', async () => {
    const created = await createNippo()
    await del(`/nippo/${created.id}`)
    const res = await put(`/nippo/${created.id}`, { title: '新タイトル', content: '新内容' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /nippo/:id - 削除', () => {
  it('200 + deletedAtが設定される', async () => {
    const created = await createNippo()
    const res = await del(`/nippo/${created.id}`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.deletedAt).not.toBeNull()
  })

  it('404 - 存在しないid', async () => {
    const res = await del('/nippo/9999')
    expect(res.status).toBe(404)
  })

  it('404 - 削除済みの日報を再削除', async () => {
    const created = await createNippo()
    await del(`/nippo/${created.id}`)
    const res = await del(`/nippo/${created.id}`)
    expect(res.status).toBe(404)
  })
})

describe('DELETE /nippo/bulk - 一括削除', () => {
  it('200 + 削除した日報一覧を返す', async () => {
    const n1 = await createNippo('日報1', '内容1')
    const n2 = await createNippo('日報2', '内容2')
    const res = await del('/nippo/bulk', { ids: [n1.id, n2.id] })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(2)
    expect(body[0].deletedAt).not.toBeNull()
  })
})

describe('POST /nippo/:id/restore - 復元', () => {
  it('200 + deletedAtがnullになる', async () => {
    const created = await createNippo()
    await del(`/nippo/${created.id}`)
    const res = await post(`/nippo/${created.id}/restore`)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.deletedAt).toBeNull()
  })

  it('404 - 削除されていない日報は復元できない', async () => {
    const created = await createNippo()
    const res = await post(`/nippo/${created.id}/restore`)
    expect(res.status).toBe(404)
  })
})

describe('POST /nippo/bulk/restore - 一括復元', () => {
  it('200 + deletedAtがnullになる', async () => {
    const n1 = await createNippo('日報1', '内容1')
    const n2 = await createNippo('日報2', '内容2')
    await del('/nippo/bulk', { ids: [n1.id, n2.id] })
    const res = await post('/nippo/bulk/restore', { ids: [n1.id, n2.id] })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(2)
    expect(body[0].deletedAt).toBeNull()
  })
})
