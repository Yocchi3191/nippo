import type { InferResponseType } from 'hono'
import type { client } from './client'

export type Nippo = InferResponseType<typeof client.nippo.$get>[number]
