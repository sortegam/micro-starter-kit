import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../../../../drizzle/schema';

export const sqlite = new Database('./data/dev.sqlite', {
  readonly: false,
});
export const db = drizzle(sqlite, { schema });
