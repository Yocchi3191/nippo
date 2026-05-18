import type { Nippo } from './Nippo.js'
import type { NippoEntry } from './NippoEntry.js'

export type NippoRepository = {
  delete(id: number): void
  update(id: number, entry: NippoEntry): Promise<Nippo>
  create(body: NippoEntry): Promise<Nippo>
  findById(id: number): Promise<Nippo>
  findAll(): Promise<Nippo[]>
}
