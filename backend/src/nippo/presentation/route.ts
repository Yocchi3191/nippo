import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { NippoRepository } from '../repository/NippoRepository.js'
import { bulkIdsSchema, createBulkNippoSchema, entryNippoSchema } from './schema.js'

const nippoRoute = new Hono()
const repo = new NippoRepository()

// 一覧取得
nippoRoute.get('/', async (c) => {
  const nippos = await repo.findAll()
  return c.json(nippos)
})

// 一括復元
nippoRoute.post('/bulk/restore', zValidator('json', bulkIdsSchema), async (c) => {
  const { ids } = c.req.valid('json')
  const nippos = await repo.restoreBulk(ids)
  return c.json(nippos)
})

// 一括追加
nippoRoute.post('/bulk', zValidator('json', createBulkNippoSchema), async (c) => {
  const data = c.req.valid('json')
  const nippos = await repo.createBulk(data)
  return c.json(nippos, 201)
})

// 一括削除
nippoRoute.delete('/bulk', zValidator('json', bulkIdsSchema), async (c) => {
  const { ids } = c.req.valid('json')
  const nippos = await repo.softDeleteBulk(ids)
  return c.json(nippos)
})

// 詳細取得
nippoRoute.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const nippo = await repo.findById(id)
  if (!nippo) return c.json({ error: 'Not found' }, 404)

  return c.json(nippo)
})

// 追加
nippoRoute.post('/', zValidator('json', entryNippoSchema), async (c) => {
  const data = c.req.valid('json')
  const nippo = await repo.create(data)
  return c.json(nippo, 201)
})

// 更新
nippoRoute.put('/:id', zValidator('json', entryNippoSchema), async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const data = c.req.valid('json')
  const nippo = await repo.update(id, data)
  if (!nippo) return c.json({ error: 'Not found' }, 404)

  return c.json(nippo)
})

// 削除
nippoRoute.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const nippo = await repo.softDelete(id)
  if (!nippo) return c.json({ error: 'Not found' }, 404)

  return c.json(nippo)
})

// 復元
nippoRoute.post('/:id/restore', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400)

  const nippo = await repo.restore(id)
  if (!nippo) return c.json({ error: 'Not found' }, 404)

  return c.json(nippo)
})

export { nippoRoute }
