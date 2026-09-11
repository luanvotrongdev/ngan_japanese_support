import { beforeEach } from 'vitest';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { db } from '../src/lib/server/db/client';
import { grammar, kanji, studySessions, users, vocabulary } from '../src/lib/server/db/schema';

migrate(db, { migrationsFolder: 'drizzle' });

beforeEach(() => {
  db.delete(grammar).run();
  db.delete(kanji).run();
  db.delete(vocabulary).run();
  db.delete(studySessions).run();
  db.delete(users).run();
  db.insert(users).values([
    { id: 'owner', displayName: 'Owner' },
    { id: 'other', displayName: 'Other' }
  ]).run();
});
