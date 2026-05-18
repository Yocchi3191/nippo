import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import type { NippoRepository } from '../domain/nippoRepository.js'
import type { Nippo } from '../domain/Nippo.js'
import { nippos } from './schema.js'
import { desc, eq } from 'drizzle-orm'
import { NippoNotFoundError } from './nippoNotFoundError.js'
import type { NippoEntry } from '../domain/NippoEntry.js'
import { NippoCreateFailedError } from './NippoCreateFailedError.js'

export class SqliteNippoRepository implements NippoRepository {
  constructor(readonly db: BetterSQLite3Database<any>) {}

  async delete(id: number): Promise<void> {
    const result = await this.db
      .delete(nippos)
      .where(eq(nippos.id, id))
      .returning()

    if (result.length < 1) {
      throw new NippoNotFoundError(id)
    }
  }

  async update(id: number, entry: NippoEntry): Promise<Nippo> {
    const result = await this.db
      .update(nippos)
      .set(entry)
      .where(eq(nippos.id, id))
      .returning()
    if (result.length < 1) throw new NippoNotFoundError(id)
    return this.toEntity(result[0])
  }

  async create(body: NippoEntry): Promise<Nippo> {
    const result = await this.db.insert(nippos).values(body).returning()
    if (result.length < 1) {
      throw new NippoCreateFailedError(body)
    }
    return this.toEntity(result[0])
  }

  async findById(id: number): Promise<Nippo> {
    const rows = await this.db.select().from(nippos).where(eq(nippos.id, id))
    if (rows.length < 1) throw new NippoNotFoundError(id)
    return this.toEntity(rows[0])
  }

  public async findAll(): Promise<Nippo[]> {
    const rows = await this.db
      .select()
      .from(nippos)
      .orderBy(desc(nippos.createdAt))
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
