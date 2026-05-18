import { serve } from '@hono/node-server'
import { createApp } from './nippo/interface/app.js'
import { db } from './db.js'

const app = createApp(db)

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
