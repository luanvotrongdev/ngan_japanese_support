import { expect, test } from 'vitest';
import { createGrammar, deleteGrammar, getGrammar, updateGrammar } from '../../src/lib/server/study-sessions/grammar';
import { getSessionContent } from '../../src/lib/server/study-sessions/sessions';
import { makeSession } from '../helpers';

test('creates, updates, and deletes grammar without affecting its session', () => {
  const session = makeSession();
  const input = { grammar: '〜たい', usage: 'verb stem + たい', meaning: 'want to', nuance: null, examples: ['日本へ行きたい。'] };
  createGrammar('owner', session.id, input);
  const entry = getSessionContent('owner', session.id).grammar[0];
  updateGrammar('owner', session.id, entry.id, { ...input, nuance: 'Personal desire' });
  expect(getGrammar('owner', session.id, entry.id).nuance).toBe('Personal desire');
  deleteGrammar('owner', session.id, entry.id);
  expect(getSessionContent('owner', session.id).session.id).toBe(session.id);
  expect(getSessionContent('owner', session.id).grammar).toHaveLength(0);
});
