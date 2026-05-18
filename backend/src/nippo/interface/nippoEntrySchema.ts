import z from 'zod'
import type { NippoEntry } from '../domain/NippoEntry.js'

export const nippoEntrySchema: z.ZodType<NippoEntry> = z.object({
  title: z.string().min(1, 'タイトルは必須'),
  content: z.string().min(1, '内容は必須'),
})
