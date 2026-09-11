# Data Model: Session Content Management

## User
- `id`: text primary key; temporary local identity for this feature

## Study Session
- `id`: text primary key
- `userId`: required owner reference
- `title`: required trimmed text
- `notes`: optional text
- `createdAt`, `updatedAt`: required timestamps
- Index by owner and updated time; delete cascades to content.

## Vocabulary
- `id`, `studySessionId`, `vocabulary`, `reading`, `meaning`
- Optional `nuance`; ordered JSON string array `examples`; timestamps

## Kanji
- `id`, `studySessionId`, `kanji`, `meaning`
- Ordered JSON string arrays `onyomi`, `kunyomi`, `relatedVocabulary`, `examples`; timestamps

## Grammar
- `id`, `studySessionId`, `grammar`, `usage`, `meaning`
- Optional `nuance`; ordered JSON string array `examples`; timestamps

Every content row belongs to exactly one study session. Ownership is established through
the parent session and checked in every query. Writes use transactions where an operation
touches multiple rows. Timestamps transition on creation and successful update only.

## UI Preferences
- The active UI language is a client preference, not relational data: it is stored in a
  `lang` cookie (`vi` default, `en` override) and read by server actions, SSR, and the
  client to select dictionary values. No language columns exist on any entity because
  localization covers UI strings only; learner content is stored and rendered as typed.
