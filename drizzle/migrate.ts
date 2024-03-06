import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { db, sqlite } from '../src/lib/server/db';

(async () => {
  migrate(db, { migrationsFolder: 'drizzle' });
  sqlite.close();
})();
