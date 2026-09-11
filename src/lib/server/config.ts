import { resolve } from 'node:path';

export const databasePath = resolve(process.env.DATABASE_URL ?? 'data/japanese-support.db');
