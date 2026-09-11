import { and, desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db/client';
import { grammar, kanji, studySessions, vocabulary } from '$lib/server/db/schema';
import type { StudySessionInput } from '$lib/schemas/study-session';
import { requireOwnedSession } from './shared';

export function listSessions(userId: string) {
  return db.select().from(studySessions).where(eq(studySessions.userId, userId))
    .orderBy(desc(studySessions.updatedAt)).all();
}

export function createSession(userId: string, input: StudySessionInput) {
  const now = new Date();
  const session = { id: crypto.randomUUID(), userId, ...input, createdAt: now, updatedAt: now };
  db.insert(studySessions).values(session).run();
  return session;
}

export function getSession(userId: string, sessionId: string) {
  return requireOwnedSession(userId, sessionId);
}

export function getSessionContent(userId: string, sessionId: string) {
  const session = requireOwnedSession(userId, sessionId);
  return {
    session,
    vocabulary: db.select().from(vocabulary).where(eq(vocabulary.studySessionId, sessionId)).all(),
    kanji: db.select().from(kanji).where(eq(kanji.studySessionId, sessionId)).all(),
    grammar: db.select().from(grammar).where(eq(grammar.studySessionId, sessionId)).all()
  };
}

export function updateSession(userId: string, sessionId: string, input: StudySessionInput) {
  requireOwnedSession(userId, sessionId);
  db.update(studySessions).set({ ...input, updatedAt: new Date() })
    .where(and(eq(studySessions.id, sessionId), eq(studySessions.userId, userId))).run();
}

export function deleteSession(userId: string, sessionId: string) {
  requireOwnedSession(userId, sessionId);
  db.delete(studySessions)
    .where(and(eq(studySessions.id, sessionId), eq(studySessions.userId, userId))).run();
}
