import { expect, test } from 'vitest';
import { createVocabulary, deleteVocabulary, getVocabulary, updateVocabulary } from '../../src/lib/server/study-sessions/vocabulary';
import { getSessionContent } from '../../src/lib/server/study-sessions/sessions';
import { makeSession } from '../helpers';

test('persists ordered vocabulary examples and enforces ownership', () => {
  const session = makeSession();
  const input = { vocabulary: '食べる', reading: 'たべる', meaning: 'to eat', nuance: null, examples: ['寿司を食べる。', '朝ご飯を食べます。'] };
  createVocabulary('owner', session.id, input);
  const entry = getSessionContent('owner', session.id).vocabulary[0];
  expect(entry.examples).toEqual(input.examples);
  expect(() => getVocabulary('other', session.id, entry.id)).toThrow();
  updateVocabulary('owner', session.id, entry.id, { ...input, meaning: 'eat' });
  expect(getVocabulary('owner', session.id, entry.id).meaning).toBe('eat');
  deleteVocabulary('owner', session.id, entry.id);
  expect(getSessionContent('owner', session.id).vocabulary).toHaveLength(0);
});
