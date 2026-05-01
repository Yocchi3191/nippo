import { and, eq, inArray, isNotNull, isNull } from 'drizzle-orm'
import { db } from '../../db.js'
import { Nippo } from '../domain/Nippo.js'
import { nippos } from '../schema/nippos.js'

type NippoRow = typeof nippos.$inferSelect

function toNippo(row: NippoRow): Nippo {
  return new Nippo(
    row.id,
    row.title,
    row.content,
    row.createdAt,
    row.updatedAt,
    row.deletedAt,
  )
}

export class NippoRepository {
  async findAll(): Promise<Nippo[]> {
    const rows = await db.select().from(nippos).where(isNull(nippos.deletedAt))
    return rows.map(toNippo)
  }

  async findById(id: number): Promise<Nippo | null> {
    const rows = await db
      .select()
      .from(nippos)
      .where(and(eq(nippos.id, id), isNull(nippos.deletedAt)))
    return rows[0] ? toNippo(rows[0]) : null
  }

  async create(data: { title: string; content: string }): Promise<Nippo> {
    const rows = await db.insert(nippos).values(data).returning()
    return toNippo(rows[0])
  }

  async createBulk(data: { title: string; content: string }[]): Promise<Nippo[]> {
    const rows = await db.insert(nippos).values(data).returning()
    return rows.map(toNippo)
  }

  async update(id: number, data: { title: string; content: string }): Promise<Nippo | null> {
    const rows = await db
      .update(nippos)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(nippos.id, id), isNull(nippos.deletedAt)))
      .returning()
    return rows[0] ? toNippo(rows[0]) : null
  }

  async softDelete(id: number): Promise<Nippo | null> {
    const rows = await db
      .update(nippos)
      .set({ deletedAt: new Date() })
      .where(and(eq(nippos.id, id), isNull(nippos.deletedAt)))
      .returning()
    return rows[0] ? toNippo(rows[0]) : null
  }

  async softDeleteBulk(ids: number[]): Promise<Nippo[]> {
    const rows = await db
      .update(nippos)
      .set({ deletedAt: new Date() })
      .where(and(inArray(nippos.id, ids), isNull(nippos.deletedAt)))
      .returning()
    return rows.map(toNippo)
  }

  async restore(id: number): Promise<Nippo | null> {
    const rows = await db
      .update(nippos)
      .set({ deletedAt: null })
      .where(and(eq(nippos.id, id), isNotNull(nippos.deletedAt)))
      .returning()
    return rows[0] ? toNippo(rows[0]) : null
  }

  async restoreBulk(ids: number[]): Promise<Nippo[]> {
    const rows = await db
      .update(nippos)
      .set({ deletedAt: null })
      .where(and(inArray(nippos.id, ids), isNotNull(nippos.deletedAt)))
      .returning()
    return rows.map(toNippo)
  }
}
