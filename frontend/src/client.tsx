import { hc } from 'hono/client'
import type { AppType } from '../../backend/src/interface/app'

export const client = hc<AppType>('http://localhost:3000')
