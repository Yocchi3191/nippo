import type { NippoRepository } from '../domain/nippoRepository.js'

export type NippoEnv = {
  Variables: {
    repository: NippoRepository
  }
}
