import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { nippoRoute } from './route.js'
import type { NippoEnv } from './NippoEnv.js'

export const app = new Hono<NippoEnv>()
app.use(cors({ origin: 'http://localhost:5173' }))

const routes = app.route('/nippo', nippoRoute)

export type AppType = typeof routes
