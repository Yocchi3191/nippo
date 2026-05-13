import type { NippoEntry } from '../domain/NippoEntry.js'

export class NippoCreateFailedError extends Error {
  constructor(entry: NippoEntry) {
    const message = `にっぽーの作成に失敗しました タイトル: ${entry.title}, 内容: ${entry.content}`
    super(message)
    this.name = 'NippoCreateFailedError'
  }
}
