import type { InferRequestType } from 'hono/client'
import type { client } from '../client'

export type CreateNippoInput = InferRequestType<
  typeof client.nippo.$post
>['json']
