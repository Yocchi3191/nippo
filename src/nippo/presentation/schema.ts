import { z } from 'zod'

export const entryNippoSchema = z.object({
  title: z.string().min(1, 'タイトルは1文字以上で入力してください'),
  content: z.string().min(1, '内容は1文字以上で入力してください'),
})

export const createBulkNippoSchema = z.array(entryNippoSchema)

export const bulkIdsSchema = z.object({
  ids: z.array(z.number()),
})
