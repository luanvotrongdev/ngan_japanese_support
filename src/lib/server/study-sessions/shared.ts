import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { studySessions } from '$lib/server/db/schema';

export function requireOwnedSession(userId: string, sessionId: string) {
  const session = db.select().from(studySessions)
    .where(and(eq(studySessions.id, sessionId), eq(studySessions.userId, userId))).get();

  if (!session) error(404, 'Study session not found');
  return session;
}

export function touchSession(sessionId: string) {
  db.update(studySessions).set({ updatedAt: new Date() }).where(eq(studySessions.id, sessionId)).run();
}
