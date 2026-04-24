import { Hono } from 'hono'
import { nippoRoute } from './nippo/presentation/route.js'

export const app = new Hono()

app.route('/nippo', nippoRoute)
