import { describe, expect, test } from 'vitest';
import { createSession, deleteSession, getSession, listSessions, updateSession } from '../../src/lib/server/study-sessions/sessions';
import { createVocabulary } from '../../src/lib/server/study-sessions/vocabulary';
import { db } from '../../src/lib/server/db/client';
import { eq } from 'drizzle-orm';
import { vocabulary } from '../../src/lib/server/db/schema';

describe('study sessions', () => {
  test('creates, updates, lists, and deletes an owned session', () => {
    const session = createSession('owner', { title: 'Greetings', notes: null });
    expect(listSessions('owner')).toHaveLength(1);
    expect(listSessions('other')).toHaveLength(0);
    updateSession('owner', session.id, { title: 'Formal greetings', notes: 'Review tomorrow' });
    expect(getSession('owner', session.id).title).toBe('Formal greetings');
    expect(() => getSession('other', session.id)).toThrow();
    deleteSession('owner', session.id);
    expect(listSessions('owner')).toHaveLength(0);
  });

  test('cascades session deletion to contained content', () => {
    const session = createSession('owner', { title: 'Cascade', notes: null });
    createVocabulary('owner', session.id, {
      vocabulary: '本', reading: 'ほん', meaning: 'book', nuance: null, examples: []
    });
    deleteSession('owner', session.id);
    expect(db.select().from(vocabulary).where(eq(vocabulary.studySessionId, session.id)).all()).toHaveLength(0);
  });
});
