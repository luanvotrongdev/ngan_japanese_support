# Tasks: Session Content Management

**Input**: Design documents from `specs/001-session-content-management/`

## Phase 1: Setup

- [ ] T001 Scaffold SvelteKit and TypeScript configuration in `package.json`, `svelte.config.js`, `vite.config.ts`, and `tsconfig.json`
- [ ] T002 Add application, database, check, and test scripts to `package.json`
- [ ] T003 [P] Configure ignored runtime artifacts in `.gitignore` and `.prettierignore`

## Phase 2: Foundational

- [ ] T004 Configure environment and Drizzle in `.env.example`, `drizzle.config.ts`, and `src/lib/server/config.ts`
- [ ] T005 Implement SQLite initialization in `src/lib/server/db/client.ts`
- [ ] T006 Define the relational schema in `src/lib/server/db/schema.ts`
- [ ] T007 Add the initial migration and migration runner in `drizzle/0000_initial.sql` and `src/lib/server/db/migrate.ts`
- [ ] T008 [P] Define session validation in `src/lib/schemas/study-session.ts`
- [ ] T009 [P] Define content validation in `src/lib/schemas/learning-content.ts`
- [ ] T010 Implement temporary local identity in `src/hooks.server.ts` and `src/app.d.ts`
- [ ] T011 Implement ownership-safe shared queries in `src/lib/server/study-sessions/shared.ts`

## Phase 3: User Story 1 - Manage Sessions

- [ ] T012 [P] [US1] Add session repository tests in `tests/integration/sessions.test.ts`
- [ ] T013 [US1] Implement session repository operations in `src/lib/server/study-sessions/sessions.ts`
- [ ] T014 [US1] Implement session list/create actions in `src/routes/sessions/+page.server.ts`
- [ ] T015 [US1] Build the session list/create UI in `src/routes/sessions/+page.svelte`
- [ ] T016 [US1] Implement session detail/update/delete actions in `src/routes/sessions/[sessionId]/+page.server.ts`
- [ ] T017 [US1] Build the session detail UI in `src/routes/sessions/[sessionId]/+page.svelte`

## Phase 4: User Story 2 - Manage Vocabulary

- [ ] T018 [P] [US2] Add vocabulary repository tests in `tests/integration/vocabulary.test.ts`
- [ ] T019 [P] [US2] Implement vocabulary operations in `src/lib/server/study-sessions/vocabulary.ts`
- [ ] T020 [P] [US2] Build vocabulary fields in `src/lib/components/VocabularyForm.svelte`
- [ ] T021 [US2] Implement vocabulary create/edit routes under `src/routes/sessions/[sessionId]/vocabulary/`
- [ ] T022 [US2] Render vocabulary content in `src/lib/components/VocabularySection.svelte`

## Phase 5: User Story 3 - Manage Kanji

- [ ] T023 [P] [US3] Add kanji repository tests in `tests/integration/kanji.test.ts`
- [ ] T024 [P] [US3] Implement kanji operations in `src/lib/server/study-sessions/kanji.ts`
- [ ] T025 [P] [US3] Build kanji fields in `src/lib/components/KanjiForm.svelte`
- [ ] T026 [US3] Implement kanji create/edit routes under `src/routes/sessions/[sessionId]/kanji/`
- [ ] T027 [US3] Render kanji content in `src/lib/components/KanjiSection.svelte`

## Phase 6: User Story 4 - Manage Grammar

- [ ] T028 [P] [US4] Add grammar repository tests in `tests/integration/grammar.test.ts`
- [ ] T029 [P] [US4] Implement grammar operations in `src/lib/server/study-sessions/grammar.ts`
- [ ] T030 [P] [US4] Build grammar fields in `src/lib/components/GrammarForm.svelte`
- [ ] T031 [US4] Implement grammar create/edit routes under `src/routes/sessions/[sessionId]/grammar/`
- [ ] T032 [US4] Render grammar content in `src/lib/components/GrammarSection.svelte`

## Phase 7: Polish and Validation

- [ ] T033 Add responsive accessible presentation in `src/app.css` and `src/routes/+layout.svelte`
- [ ] T034 Add browser CRUD coverage in `e2e/session-content.spec.ts`
- [ ] T035 Document setup and temporary identity limitations in `README.md`
- [ ] T036 Validate all checks and record results in `specs/001-session-content-management/quickstart.md`

## Dependencies

Setup precedes foundational work. Foundational work precedes every story. US1 precedes
US2-US4 because content requires a parent session. US2, US3, and US4 can proceed in
parallel except for integration into the shared detail page.

## Implementation Strategy

The MVP is Phase 1 through US1. Add each content type as an independently testable
increment, then complete browser validation and documentation.
