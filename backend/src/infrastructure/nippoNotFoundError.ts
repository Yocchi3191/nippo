export class NippoNotFoundError extends Error {
  constructor(id: number) {
    const message = `にっぽーが見つからなかったよ。ID: ${id}`
    super(message)
  }
}
