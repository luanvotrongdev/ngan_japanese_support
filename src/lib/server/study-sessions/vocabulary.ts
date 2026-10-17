import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { vocabulary } from '$lib/server/db/schema';
import type { z } from 'zod';
import type { vocabularySchema } from '$lib/schemas/learning-content';
import { requireOwnedSession, touchSession } from './shared';

type Input = z.infer<typeof vocabularySchema>;

export function createVocabulary(userId: string, sessionId: string, input: Input) {
  requireOwnedSession(userId, sessionId);
  const now = new Date();
  const id = crypto.randomUUID();
  db.transaction((tx) => {
    tx.insert(vocabulary).values({ id, studySessionId: sessionId, ...input, createdAt: now, updatedAt: now }).run();
    touchSession(sessionId, tx);
  });
  return id;
}

export function getVocabulary(userId: string, sessionId: string, id: string) {
  requireOwnedSession(userId, sessionId);
  const entry = db.select().from(vocabulary).where(and(eq(vocabulary.id, id), eq(vocabulary.studySessionId, sessionId))).get();
  if (!entry) error(404, 'notFound.vocabulary');
  return entry;
}

export function updateVocabulary(userId: string, sessionId: string, id: string, input: Input) {
  getVocabulary(userId, sessionId, id);
  db.transaction((tx) => {
    tx.update(vocabulary).set({ ...input, updatedAt: new Date() }).where(eq(vocabulary.id, id)).run();
    touchSession(sessionId, tx);
  });
}

export function deleteVocabulary(userId: string, sessionId: string, id: string) {
  getVocabulary(userId, sessionId, id);
  db.transaction((tx) => {
    tx.delete(vocabulary).where(eq(vocabulary.id, id)).run();
    touchSession(sessionId, tx);
  });
}
