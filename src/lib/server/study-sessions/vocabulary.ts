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
  db.insert(vocabulary).values({ id: crypto.randomUUID(), studySessionId: sessionId, ...input, createdAt: now, updatedAt: now }).run();
  touchSession(sessionId);
}

export function getVocabulary(userId: string, sessionId: string, id: string) {
  requireOwnedSession(userId, sessionId);
  const entry = db.select().from(vocabulary).where(and(eq(vocabulary.id, id), eq(vocabulary.studySessionId, sessionId))).get();
  if (!entry) error(404, 'Vocabulary not found');
  return entry;
}

export function updateVocabulary(userId: string, sessionId: string, id: string, input: Input) {
  getVocabulary(userId, sessionId, id);
  db.update(vocabulary).set({ ...input, updatedAt: new Date() }).where(eq(vocabulary.id, id)).run();
  touchSession(sessionId);
}

export function deleteVocabulary(userId: string, sessionId: string, id: string) {
  getVocabulary(userId, sessionId, id);
  db.delete(vocabulary).where(eq(vocabulary.id, id)).run();
  touchSession(sessionId);
}
