import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { studySessions } from '$lib/server/db/schema';

type Executor = Pick<typeof db, 'update'>;

export function requireOwnedSession(userId: string, sessionId: string) {
  const session = db.select().from(studySessions)
    .where(and(eq(studySessions.id, sessionId), eq(studySessions.userId, userId))).get();

  // Error messages are i18n keys; src/routes/+error.svelte translates them.
  if (!session) error(404, 'notFound.session');
  return session;
}

export function touchSession(sessionId: string, executor: Executor = db) {
  executor.update(studySessions).set({ updatedAt: new Date() }).where(eq(studySessions.id, sessionId)).run();
}
