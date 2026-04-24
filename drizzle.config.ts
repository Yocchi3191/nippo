import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/nippo/schema/nippos.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
