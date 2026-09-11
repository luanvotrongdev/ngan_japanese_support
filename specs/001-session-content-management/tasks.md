# Tasks: Session Content Management

**Input**: Design documents from `specs/001-session-content-management/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Repository integration tests and browser e2e journeys are included for each user
story because the project constitution (`.specify/memory/constitution.md`, Principle V)
mandates automated tests for ownership boundaries, persistence, and the primary CRUD
journeys, and `quickstart.md` validates `bun run test` and `bun run test:e2e`. The
localization phase adds dictionary unit tests and a language-toggle e2e journey for SC-006.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story under the single master-detail page architecture.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Scaffold SvelteKit and TypeScript configuration in `package.json`, `svelte.config.js`, `vite.config.ts`, and `tsconfig.json`
- [x] T002 Add application, database, check, and test scripts to `package.json`
- [x] T003 [P] Configure ignored runtime artifacts in `.gitignore` and `.prettierignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Configure environment and Drizzle in `.env.example`, `drizzle.config.ts`, and `src/lib/server/config.ts`
- [x] T005 Implement SQLite initialization in `src/lib/server/db/client.ts`
- [x] T006 Define the relational schema in `src/lib/server/db/schema.ts`
- [x] T007 Add the initial migration and migration runner in `drizzle/0000_initial.sql` and `src/lib/server/db/migrate.ts`
- [x] T008 [P] Define session validation in `src/lib/schemas/study-session.ts`
- [x] T009 [P] Define content validation in `src/lib/schemas/learning-content.ts`
- [x] T010 Implement temporary local identity in `src/hooks.server.ts` and `src/app.d.ts`
- [x] T011 Implement ownership-safe shared queries in `src/lib/server/study-sessions/shared.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Manage Study Sessions (Priority: P1) 🎯 MVP

**Goal**: Deliver the session CRUD boundary plus the flat master-detail page shell that
combines vocabulary, kanji, and grammar into one type-badged list with an inline
detail/edit panel (spec: Screen Hierarchy, Error Handling).

**Independent Test**: Create a session, edit it, reopen it, then delete it after confirmation.

### Tests for User Story 1 ⚠️

> **NOTE**: Tests are written for the repository boundary; the session detail page and e2e
> journeys are covered in Phase 7 because they span all content types.

- [x] T012 [P] [US1] Add session repository tests in `tests/integration/sessions.test.ts`

### Implementation for User Story 1

- [x] T013 [US1] Implement session repository operations in `src/lib/server/study-sessions/sessions.ts` (depends on T012)
- [x] T014 [US1] Implement session list/create actions in `src/routes/sessions/+page.server.ts`
- [x] T015 [US1] Build the session list/create UI in `src/routes/sessions/+page.svelte`
- [x] T016 [US1] Implement session detail/update/delete actions in `src/routes/sessions/[sessionId]/+page.server.ts`
- [x] T017 [US1] Build the session detail page shell in `src/routes/sessions/[sessionId]/+page.svelte` with the master-detail layout and inline error, empty, and loading states
- [x] T018 [P] [US1] Build the combined master list in `src/lib/components/ContentList.svelte` showing vocabulary, kanji, and grammar entries with a type badge on each entry (based on `data-model.md`)
- [x] T019 [P] [US1] Build the detail/edit panel in `src/lib/components/EntryDetail.svelte` that renders the fields for the selected entry type

**Checkpoint**: Sessions are fully CRUD-functional and the master-detail page renders with
an empty list and inline empty state.

---

## Phase 4: User Story 2 - Manage Vocabulary (Priority: P2)

**Goal**: Manage vocabulary entries (term, reading, meaning, nuance, ordered examples)
entirely from the session detail page.

**Independent Test**: Add, edit, reopen, and delete a vocabulary entry in an owned session.

### Tests for User Story 2 ⚠️

- [x] T020 [P] [US2] Add vocabulary repository tests in `tests/integration/vocabulary.test.ts`

### Implementation for User Story 2

- [x] T021 [P] [US2] Implement vocabulary operations in `src/lib/server/study-sessions/vocabulary.ts` (depends on T020)
- [x] T022 [P] [US2] Build vocabulary fields in `src/lib/components/VocabularyFields.svelte`
- [x] T023 [US2] Wire vocabulary create/update/delete actions in `src/routes/sessions/[sessionId]/+page.server.ts` (per `contracts/form-actions.md`)
- [x] T024 [US2] Render vocabulary entries in `ContentList.svelte` with the vocabulary type badge

**Checkpoint**: At this point, Vocabulary can be created, edited, and deleted from the
master-detail page while sessions remain unaffected.

---

## Phase 5: User Story 3 - Manage Kanji (Priority: P3)

**Goal**: Manage kanji entries (kanji, onyomi, kunyomi, meaning, related vocabulary,
ordered examples) entirely from the session detail page.

**Independent Test**: Add, edit, reopen, and delete a kanji entry with list fields.

### Tests for User Story 3 ⚠️

- [x] T025 [P] [US3] Add kanji repository tests in `tests/integration/kanji.test.ts`

### Implementation for User Story 3

- [x] T026 [P] [US3] Implement kanji operations in `src/lib/server/study-sessions/kanji.ts` (depends on T025)
- [x] T027 [P] [US3] Build kanji fields in `src/lib/components/KanjiFields.svelte`
- [x] T028 [US3] Wire kanji create/update/delete actions in `src/routes/sessions/[sessionId]/+page.server.ts` (per `contracts/form-actions.md`)
- [x] T029 [US3] Render kanji entries in `ContentList.svelte` with the kanji type badge

**Checkpoint**: Kanji shares the master list and detail panel with vocabulary without
breaking vocabulary behavior.

---

## Phase 6: User Story 4 - Manage Grammar (Priority: P4)

**Goal**: Manage grammar entries (grammar, usage, meaning, nuance, ordered examples)
entirely from the session detail page.

**Independent Test**: Add, edit, reopen, and delete a grammar entry.

### Tests for User Story 4 ⚠️

- [x] T030 [P] [US4] Add grammar repository tests in `tests/integration/grammar.test.ts`

### Implementation for User Story 4

- [x] T031 [P] [US4] Implement grammar operations in `src/lib/server/study-sessions/grammar.ts` (depends on T030)
- [x] T032 [P] [US4] Build grammar fields in `src/lib/components/GrammarFields.svelte`
- [x] T033 [US4] Wire grammar create/update/delete actions in `src/routes/sessions/[sessionId]/+page.server.ts` (per `contracts/form-actions.md`)
- [x] T034 [US4] Render grammar entries in `ContentList.svelte` with the grammar type badge

**Checkpoint**: All content types are manageable from the single master-detail page and are
independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T035 Add responsive, accessible presentation and keyboard-safe master-detail navigation in `src/app.css` and `src/routes/+layout.svelte`
- [x] T036 Add browser CRUD coverage in `e2e/session-content.spec.ts`
- [x] T037 Document setup and temporary identity limitations in `README.md`
- [x] T038 Validate all checks and record results in `specs/001-session-content-management/quickstart.md`

---

## Phase 8: Localization (Cross-Cutting Concerns)

**Goal**: Localize the whole application UI into Vietnamese (default) and English with a
manual header toggle, locale-aware timestamps, and localized server validation/confirmation
messages, while learner-authored content stays as typed (spec FR-011 to FR-015, SC-006).

**Independent Test**: Load the app and confirm Vietnamese is the default; toggle to English
and back; confirm UI strings, validation messages, delete confirmations, and timestamps
switch language while stored content values remain unchanged.

### Tests for Localization ⚠️

> **NOTE**: Write these tests FIRST, ensure they FAIL before the implementation exists.

- [x] T039 [P] Add i18n unit tests in `tests/unit/i18n.test.ts` for full key coverage in
  both languages, English fallback for untranslated keys, and cookie-based locale resolution

### Implementation for Localization

- [x] T040 [P] Create the shared Vietnamese and English dictionaries in `src/lib/i18n/dictionaries.ts`
  covering every UI string (layout, sessions, master list, detail panel, field labels, buttons, confirms, validation messages)
- [x] T041 [P] Add typed i18n helpers and cookie-based locale resolution in `src/lib/i18n/index.ts`
  (safe on client and server, English fallback per FR-013)
- [x] T042 [P] Build the manual language toggle in `src/lib/components/LanguageToggle.svelte`
  (posts `lang` to `/set-language`, reflects the active language)
- [x] T043 Implement the `set-language` action on the dedicated `src/routes/set-language/+page.server.ts`
  route setting the `lang` cookie (per `contracts/form-actions.md`; SvelteKit disallows form
  actions in layout server files, so the action lives on its own route)
- [x] T044 Wire the active locale through the root layout and render `LanguageToggle.svelte` in `src/routes/+layout.svelte` and `src/routes/+layout.server.ts`
- [x] T045 Localize the session list/create page and its server messages in `src/routes/sessions/+page.svelte` and `src/routes/sessions/+page.server.ts`
- [x] T046 Localize master-detail components `src/lib/components/ContentList.svelte`, `EntryDetail.svelte`,
  `VocabularyFields.svelte`, `KanjiFields.svelte`, `GrammarFields.svelte`, and the session detail page `src/routes/sessions/[sessionId]/+page.svelte`
- [x] T047 Localize server form-action validation/confirmation messages in `src/routes/sessions/[sessionId]/+page.server.ts`
  and the session delete confirmation flow (shared dictionary, FR-013)
- [x] T048 Render created/updated timestamps with `Intl.DateTimeFormat` for the active locale in
  `src/routes/sessions/+page.svelte` and `src/routes/sessions/[sessionId]/+page.svelte` (FR-014)
- [x] T049 Add the localization browser journey in `e2e/localization.spec.ts` (Vietnamese default,
  toggle to English, localized validation/confirmation, locale-aware timestamps, content preserved)
- [x] T050 Update `README.md` and `specs/001-session-content-management/quickstart.md` and record
  re-run validation results for the localization build

**Checkpoint**: The full UI is localized; SC-006 (zero raw-key fallbacks) and FR-011 to FR-015 pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion.
  - US1 builds the page shell and combined master list; US2-US4 extend it in priority order.
- **Polish (Phase 7)**: Depends on all user stories being complete.
- **Localization (Phase 8)**: Depends on all user stories being complete; touches no data-model
  or persistence, so it can be delivered atop the finished master-detail app.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). Delivers the
  master-detail shell plus `ContentList.svelte` and `EntryDetail.svelte` that US2-US4 fill
  in.
- **User Story 2 (P2)**: Can start after Foundational plus US1 components exist; adds
  vocabulary to `ContentList` and its actions to `[sessionId]/+page.server.ts`.
- **User Story 3 (P3)**: Can start after Foundational plus US1 components exist; adds kanji
  to the same master list and server file.
- **User Story 4 (P4)**: Can start after Foundational plus US1 components exist; adds grammar
  to the same master list and server file.

### Within Each User Story

- Tests MUST be written first and pass only after implementation exists.
- Repository operations before UI wiring (service first, then form actions, then rendering).
- Each story's server action tasks share `[sessionId]/+page.server.ts`; implement them by
  appending new actions, never overwriting sibling actions.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- All Foundational tasks marked [P] can run in parallel (within Phase 2).
- US1's `ContentList.svelte` and `EntryDetail.svelte` tasks (T018, T019) run in parallel.
- Once US1 components exist, US2, US3, and US4 service/component tasks (T021/T022, T026/T027
  T031/T032) run in parallel; action-wiring tasks (T023, T028, T033) are separate files of
  work by appending to the same server file.
- Localization dictionary, helpers, toggle, and unit-test tasks (T039-T042) run in parallel on
  separate files; the layout action (T043) depends on the toggle, and server-message tasks
  (T045, T047) and component tasks (T044, T046, T048) depend on the dictionary and helpers
  (T040, T041).

---

## Parallel Example: User Story 3

```bash
# Launch the kanji repository test bearer:
Task: "Add kanji repository tests in tests/integration/kanji.test.ts"
# Then in parallel once tests exist (different files):
Task: "Implement kanji operations in src/lib/server/study-sessions/kanji.ts"
Task: "Build kanji fields in src/lib/components/KanjiFields.svelte"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories).
3. Complete Phase 3: User Story 1 including the master-detail page shell with a combined,
   type-badged `ContentList` and `EntryDetail` panel.
4. **STOP and VALIDATE**: Create, edit, reopen, and delete a session; confirm the empty
   states and layout render.
5. Deploy/demo if ready.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready.
2. Add User Story 1 → Test independently → Deploy/Demo (MVP: session page + shared layout).
3. Add User Story 2 → vocabulary appears in the same master list → Test independently.
4. Add User Story 3 → kanji joins the list → Test independently.
5. Add User Story 4 → grammar joins the list → Test independently.
6. Polish (Phase 7) → responsive/accessible presentation, e2e coverage, README, validation.
7. Localize (Phase 8) → Vietnamese default, English toggle, localized messages, locale-aware timestamps.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once US1's master-detail components exist:
   - Developer A: User Story 2 (vocabulary)
   - Developer B: User Story 3 (kanji)
   - Developer C: User Story 4 (grammar)
3. Each developer appends their form actions to the shared session detail server file
   without overwriting siblings, then integrates into the shared master list.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps task to specific user story for traceability.
- Each user story is independently completable and testable on the single master-detail page.
- Verify tests fail before implementing the corresponding operations.
- Commit after each task or logical group.
- Stop at any checkpoint to validate a story independently.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence.