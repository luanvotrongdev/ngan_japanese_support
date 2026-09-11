import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
};

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  displayName: text('display_name').notNull()
});

export const studySessions = sqliteTable(
  'study_sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    title: text('title').notNull(),
    notes: text('notes'),
    ...timestamps
  },
  (table) => [index('study_sessions_owner_updated_idx').on(table.userId, table.updatedAt)]
);

export const vocabulary = sqliteTable(
  'vocabulary',
  {
    id: text('id').primaryKey(),
    studySessionId: text('study_session_id').notNull().references(() => studySessions.id, { onDelete: 'cascade' }),
    vocabulary: text('vocabulary').notNull(),
    reading: text('reading').notNull(),
    meaning: text('meaning').notNull(),
    nuance: text('nuance'),
    examples: text('examples', { mode: 'json' }).$type<string[]>().notNull(),
    ...timestamps
  },
  (table) => [index('vocabulary_session_idx').on(table.studySessionId)]
);

export const kanji = sqliteTable(
  'kanji',
  {
    id: text('id').primaryKey(),
    studySessionId: text('study_session_id').notNull().references(() => studySessions.id, { onDelete: 'cascade' }),
    kanji: text('kanji').notNull(),
    onyomi: text('onyomi', { mode: 'json' }).$type<string[]>().notNull(),
    kunyomi: text('kunyomi', { mode: 'json' }).$type<string[]>().notNull(),
    meaning: text('meaning').notNull(),
    relatedVocabulary: text('related_vocabulary', { mode: 'json' }).$type<string[]>().notNull(),
    examples: text('examples', { mode: 'json' }).$type<string[]>().notNull(),
    ...timestamps
  },
  (table) => [index('kanji_session_idx').on(table.studySessionId)]
);

export const grammar = sqliteTable(
  'grammar',
  {
    id: text('id').primaryKey(),
    studySessionId: text('study_session_id').notNull().references(() => studySessions.id, { onDelete: 'cascade' }),
    grammar: text('grammar').notNull(),
    usage: text('usage').notNull(),
    meaning: text('meaning').notNull(),
    nuance: text('nuance'),
    examples: text('examples', { mode: 'json' }).$type<string[]>().notNull(),
    ...timestamps
  },
  (table) => [index('grammar_session_idx').on(table.studySessionId)]
);
