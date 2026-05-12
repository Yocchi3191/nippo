import type { Nippo } from './Nippo.js'

export type NippoRepository = {
  findById(id: number): Promise<Nippo>
  findAll(): Promise<Nippo[]>
}
