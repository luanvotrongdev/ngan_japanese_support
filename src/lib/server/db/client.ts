import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { databasePath } from '../config';
import * as schema from './schema';

mkdirSync(dirname(databasePath), { recursive: true });

export const sqlite = new Database(databasePath, { create: true });
sqlite.run('PRAGMA foreign_keys = ON');
sqlite.run('PRAGMA journal_mode = WAL');
sqlite.run('PRAGMA busy_timeout = 5000');

export const db = drizzle(sqlite, { schema });
