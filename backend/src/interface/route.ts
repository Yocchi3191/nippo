import { Hono, type Context } from 'hono'
import type { NippoEnv } from './NippoEnv.js'
import type { BlankInput } from 'hono/types'
import { NippoNotFoundError } from '../infrastructure/nippoNotFoundError.js'

export const nippoRoute = new Hono<NippoEnv>()
  .get('/', async (c) => {
    const repo = getRepository(c)
    const results = await repo.findAll()
    return c.json(results)
  })

  .get('/:id', async (c) => {
    const repo = getRepository(c)
    const id = Number(c.req.param('id'))
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

function getRepository(c: Context<NippoEnv, '/', BlankInput>) {
  return c.get('repository') || c.env.repository
}
