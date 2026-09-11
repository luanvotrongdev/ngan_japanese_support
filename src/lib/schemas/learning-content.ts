import { z } from 'zod';

const required = (field: string) => z.string().trim().min(1, `required:${field}`).max(2000, `tooLong:${field}`);
const optional = (field: string) => z.string().trim().max(4000, `tooLong:${field}`).transform((value) => value || null);
const list = z.string().transform((value) => value.split('\n').map((item) => item.trim()).filter(Boolean));

export const vocabularySchema = z.object({
  vocabulary: required('vocabulary'),
  reading: required('reading'),
  meaning: required('meaning'),
  nuance: optional('nuance'),
  examples: list
});

export const kanjiSchema = z.object({
  kanji: required('kanji'),
  onyomi: list,
  kunyomi: list,
  meaning: required('meaning'),
  relatedVocabulary: list,
  examples: list
});

export const grammarSchema = z.object({
  grammar: required('grammar'),
  usage: required('usage'),
  meaning: required('meaning'),
  nuance: optional('nuance'),
  examples: list
});

export const toLines = (items: string[]) => items.join('\n');