import { Hono, type Context } from 'hono'
import type { NippoEnv } from './NippoEnv.js'
import type { BlankInput } from 'hono/types'

export const nippoRoute = new Hono<NippoEnv>()
  .get('/', async (c) => {
    const repo = getRepository(c)
    const results = await repo.findAll()
    return c.json(results)
  })

  .get('/:id', async (c) => {
    const repo = getRepository(c)
    const id = Number(c.req.param('id'))
    const results = await repo.findById(id)
    return c.json(results)
  })

function getRepository(c: Context<NippoEnv, '/', BlankInput>) {
  return c.get('repository') || c.env.repository
}
