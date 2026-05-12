import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import type { NippoRepository } from '../domain/nippoRepository.js'
import type { Nippo } from '../domain/Nippo.js'
import { nippos } from './schema.js'
import { eq } from 'drizzle-orm'
import { NippoNotFoundError } from './nippoNotFoundError.js'

export class SqliteNippoRepository implements NippoRepository {
  constructor(readonly db: BetterSQLite3Database<any>) {}

  async findById(id: number): Promise<Nippo> {
    const rows = await this.db.select().from(nippos).where(eq(nippos.id, id))
    if (rows.length < 1) throw new NippoNotFoundError(id)
    return this.toEntity(rows[0])
  }

  public async findAll(): Promise<Nippo[]> {
    const rows = await this.db.select().from(nippos)
    return rows.map(this.toEntity)
  }

  private toEntity(row: NippoRow): Nippo {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: new Date(row.createdAt),
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
    }
  }
}

export type NippoRow = {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string | null
}
