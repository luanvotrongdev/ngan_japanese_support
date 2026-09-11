import { z } from 'zod';

const required = (label: string) => z.string().trim().min(1, `${label} is required`).max(2000);
const optional = z.string().trim().max(4000).transform((value) => value || null);
const list = z.string().transform((value) => value.split('\n').map((item) => item.trim()).filter(Boolean));

export const vocabularySchema = z.object({
  vocabulary: required('Vocabulary'),
  reading: required('Reading'),
  meaning: required('Meaning'),
  nuance: optional,
  examples: list
});

export const kanjiSchema = z.object({
  kanji: required('Kanji'),
  onyomi: list,
  kunyomi: list,
  meaning: required('Meaning'),
  relatedVocabulary: list,
  examples: list
});

export const grammarSchema = z.object({
  grammar: required('Grammar'),
  usage: required('Usage'),
  meaning: required('Meaning'),
  nuance: optional,
  examples: list
});

export const toLines = (items: string[]) => items.join('\n');
