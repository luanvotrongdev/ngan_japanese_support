import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { grammar } from '$lib/server/db/schema';
import type { z } from 'zod';
import type { grammarSchema } from '$lib/schemas/learning-content';
import { requireOwnedSession, touchSession } from './shared';

type Input = z.infer<typeof grammarSchema>;

export function createGrammar(userId: string, sessionId: string, input: Input) {
  requireOwnedSession(userId, sessionId);
  const now = new Date();
  const id = crypto.randomUUID();
  db.insert(grammar).values({ id, studySessionId: sessionId, ...input, createdAt: now, updatedAt: now }).run();
  touchSession(sessionId);
  return id;
}

export function getGrammar(userId: string, sessionId: string, id: string) {
  requireOwnedSession(userId, sessionId);
  const entry = db.select().from(grammar).where(and(eq(grammar.id, id), eq(grammar.studySessionId, sessionId))).get();
  if (!entry) error(404, 'Grammar not found');
  return entry;
}

export function updateGrammar(userId: string, sessionId: string, id: string, input: Input) {
  getGrammar(userId, sessionId, id);
  db.update(grammar).set({ ...input, updatedAt: new Date() }).where(eq(grammar.id, id)).run();
  touchSession(sessionId);
}

export function deleteGrammar(userId: string, sessionId: string, id: string) {
  getGrammar(userId, sessionId, id);
  db.delete(grammar).where(eq(grammar.id, id)).run();
  touchSession(sessionId);
}
