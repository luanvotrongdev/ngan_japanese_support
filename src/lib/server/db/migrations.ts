import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { db } from './client';

export function applyMigrations(migrationsFolder: string) {
	migrate(db, { migrationsFolder });
}