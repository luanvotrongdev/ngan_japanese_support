import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db/client';
import { kanji } from '$lib/server/db/schema';
import type { z } from 'zod';
import type { kanjiSchema } from '$lib/schemas/learning-content';
import { requireOwnedSession, touchSession } from './shared';

type Input = z.infer<typeof kanjiSchema>;

export function createKanji(userId: string, sessionId: string, input: Input) {
  requireOwnedSession(userId, sessionId);
  const now = new Date();
  const id = crypto.randomUUID();
  db.insert(kanji).values({ id, studySessionId: sessionId, ...input, createdAt: now, updatedAt: now }).run();
  touchSession(sessionId);
  return id;
}

export function getKanji(userId: string, sessionId: string, id: string) {
  requireOwnedSession(userId, sessionId);
  const entry = db.select().from(kanji).where(and(eq(kanji.id, id), eq(kanji.studySessionId, sessionId))).get();
  if (!entry) error(404, 'Kanji not found');
  return entry;
}

export function updateKanji(userId: string, sessionId: string, id: string, input: Input) {
  getKanji(userId, sessionId, id);
  db.update(kanji).set({ ...input, updatedAt: new Date() }).where(eq(kanji.id, id)).run();
  touchSession(sessionId);
}

export function deleteKanji(userId: string, sessionId: string, id: string) {
  getKanji(userId, sessionId, id);
  db.delete(kanji).where(eq(kanji.id, id)).run();
  touchSession(sessionId);
}
