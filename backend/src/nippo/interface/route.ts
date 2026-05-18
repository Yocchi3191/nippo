import { Hono, type Context } from 'hono'
import type { NippoEnv } from './NippoEnv.js'
import type { BlankInput } from 'hono/types'
import { NippoNotFoundError } from '../infrastructure/nippoNotFoundError.js'
import { zValidator } from '@hono/zod-validator'
import { NippoCreateFailedError } from '../infrastructure/NippoCreateFailedError.js'
import { nippoEntrySchema } from './nippoEntrySchema.js'
import type { NippoEntry } from '../domain/NippoEntry.js'

export const nippoRoute = new Hono<NippoEnv>()
  .get('/', async (c) => {
    const repo = getRepository(c)
    const results = await repo.findAll()
    return c.json(results)
  })

  .get('/:id', async (c) => {
    const repo = getRepository(c)
    const id = getIdFromRquest(c)
    try {
      const results = await repo.findById(id)
      return c.json(results)
    } catch (e) {
      if (e instanceof NippoNotFoundError) {
        return c.json({ message: e.message }, 404)
      } else {
        return c.json({ message: '不明なエラーが発生しました' }, 500)
      }
    }
  })

  .post('/', zValidator('json', nippoEntrySchema), async (c) => {
    const repo = getRepository(c)
    const body = getValidRquestBody(c)
    try {
      const result = await repo.create(body)
      return c.json(result, 201)
    } catch (e) {
      if (e instanceof NippoCreateFailedError) {
        return c.json({ message: e.message }, 400)
      } else {
        return c.json({ message: '不明なエラーが発生しました' }, 500)
      }
    }
  })
  .patch('/:id', zValidator('json', nippoEntrySchema), async (c) => {
    const repo = getRepository(c)
    const id = getIdFromRquest(c)
    const entry = getValidRquestBody(c)
    try {
      const result = await repo.update(id, entry)
      return c.json(result)
    } catch (e) {
      if (e instanceof NippoNotFoundError) {
        return c.json({ message: e.message }, 404)
      } else {
        return c.json({ message: '不明なエラーが発生しました' }, 500)
      }
    }
  })
  .delete('/:id', async (c) => {
    const repo = getRepository(c)
    const id = getIdFromRquest(c)
    try {
      await repo.delete(id)
      return c.body(null, 204)
    } catch (e) {
      if (e instanceof NippoNotFoundError) {
        return c.json({ message: e.message }, 404)
      } else {
        return c.json({ message: '不明なエラーが発生しました' }, 500)
      }
    }
  })

function getValidRquestBody(
  c: Context<
    NippoEnv,
    '/',
    { in: { json?: unknown }; out: { json: NippoEntry } }
  >,
) {
  return c.req.valid('json')
}

function getIdFromRquest(
  c: Context<
    NippoEnv,
    '/:id',
    { in: { json?: unknown }; out: { json: NippoEntry } }
  >,
) {
  return Number(c.req.param('id'))
}

function getRepository(c: Context<NippoEnv, '/', BlankInput>) {
  return c.get('repository')
}
