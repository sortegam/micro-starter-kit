import type { Config } from 'drizzle-kit';
export default {
  schema: './drizzle/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
} satisfies Config;
