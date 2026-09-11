# Implementation Plan: Session Content Management

**Branch**: `main` | **Date**: 2026-09-11 | **Spec**: [spec.md](spec.md)

## Summary

Build a full-stack SvelteKit application for private CRUD management of lesson-like study
sessions and their vocabulary, kanji, and grammar. Use Bun, strict TypeScript, Drizzle,
and SQLite on one server with persistent storage. A flat master-detail page inside each
session shows one combined list of vocabulary, kanji, and grammar entries (each carrying a
type badge) on the left and an inline detail/edit form on the right, so all content types
are managed and viewed in the same screen (spec: Screen Hierarchy). The application UI is
localized into Vietnamese (default) and English with a manual header toggle; learner-authored
content stays as typed and is never translated (spec: Localization).

## Technical Context

**Language/Version**: TypeScript 5.x on Bun 1.2.12

**Primary Dependencies**: SvelteKit, Svelte, Drizzle ORM, Drizzle Kit, Zod

**Storage**: SQLite through `bun:sqlite`; WAL, foreign keys, and persistent volume required

**Testing**: Vitest for unit/integration tests; Playwright for browser journeys

**Target Platform**: Modern desktop/mobile browsers; single Bun server with persistent disk

**Project Type**: Full-stack web application

**Performance Goals**: User-visible CRUD completion under two seconds for normal local-server load

**Localization**: Vietnamese (default) and English; manual header toggle with no automatic
detection; key-based dictionary shared by client components and server form actions with
English fallback for untranslated keys; locale-aware timestamps via `Intl.DateTimeFormat`

**Constraints**: One application instance; server-side ownership checks; Unicode-safe content;
temporary local user isolated behind an auth boundary; learner-authored content never translated

**Scale/Scope**: Personal/small-group use; hundreds of sessions and thousands of entries

## Constitution Check

*GATE: Passed before research and re-checked after design.*

- Learning value: PASS - content is explicitly organized for Japanese study.
- Linguistic integrity: PASS - all supplied fields and ordered Japanese text are preserved;
  localization never alters learner-authored content (spec: Localization).
- AI safety: PASS - no AI behavior exists in this feature.
- Privacy/security: PASS - all database access is scoped through the owning user.
- Accessibility/testing/simplicity: PASS - single master-detail page with a combined,
  type-badged content list and inline error, empty, and loading states keeps every content
  type reachable on one screen (spec: Screen Hierarchy, Error Handling); forms are
  progressive and keyboard-safe; automated ownership, persistence, CRUD, and localization
  toggle tests are planned.

## Project Structure

### Documentation

```text
specs/001-session-content-management/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/form-actions.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code

```text
src/
├── app.css
├── app.d.ts
├── hooks.server.ts
├── lib/
│   ├── components/
│   │   ├── ContentList.svelte
│   │   ├── EntryDetail.svelte
│   │   ├── VocabularyFields.svelte
│   │   ├── KanjiFields.svelte
│   │   ├── GrammarFields.svelte
│   │   └── LanguageToggle.svelte
│   ├── i18n/
│   │   ├── dictionaries.ts
│   │   └── index.ts
│   ├── schemas/
│   └── server/
│       ├── db/
│       └── study-sessions/
└── routes/
    └── sessions/
        └── [sessionId]/
tests/
├── integration/
└── unit/
e2e/
drizzle/
```

**Structure Decision**: One SvelteKit project keeps server actions, pages, validation, and
database code together while `$lib/server` prevents private code from entering browser bundles.
The shared `lib/i18n` module is safe for both server form actions and client components; the
active language is resolved once per request/server and once client-side from the language
cookie, keeping dictionary lookups synchronous and free of browser-only globals on the server.

## Localization Design

- **Engine**: A shared key-based dictionary (`lib/i18n/dictionaries.ts`) with Vietnamese keys
  and English fallback. No i18n framework dependency; meets spec (FR-011, FR-013, SC-006).
- **Selection**: Manual toggle (`LanguageToggle.svelte`) in the header; defaults to Vietnamese;
  no auto-detection (FR-012). Choice persisted in a `lang` cookie so server form actions and
  SSR resolve the same active language.
- **Server messages**: Validation/confirmation messages from form actions look up keys through
  the same shared dictionary using the cookie locale (FR-013).
- **Timestamps**: Session created/updated times formatted with `Intl.DateTimeFormat` for the
  active locale (`vi`/`en`) (FR-014).
- **Content untouched**: Learner-authored titles, notes, and meaning fields are rendered as
  stored and never translated or normalized by the localization layer (FR-015).

## Complexity Tracking

No constitution violations require justification.
