import { expect, test } from 'vitest';
import { createKanji, deleteKanji, getKanji, updateKanji } from '../../src/lib/server/study-sessions/kanji';
import { getSessionContent } from '../../src/lib/server/study-sessions/sessions';
import { makeSession } from '../helpers';

test('persists and updates ordered kanji lists', () => {
  const session = makeSession();
  const input = { kanji: '食', onyomi: ['ショク'], kunyomi: ['た.べる'], meaning: 'eat', relatedVocabulary: ['食事'], examples: ['食べる'] };
  createKanji('owner', session.id, input);
  const entry = getSessionContent('owner', session.id).kanji[0];
  expect(entry.onyomi).toEqual(['ショク']);
  updateKanji('owner', session.id, entry.id, { ...input, relatedVocabulary: ['食事', '食品'] });
  expect(getKanji('owner', session.id, entry.id).relatedVocabulary).toHaveLength(2);
  deleteKanji('owner', session.id, entry.id);
  expect(getSessionContent('owner', session.id).kanji).toHaveLength(0);
});
