# Implementation Plan: Session Content Management

**Branch**: `main` | **Date**: 2026-09-11 | **Spec**: [spec.md](spec.md)

## Summary

Build a full-stack SvelteKit application for private CRUD management of lesson-like study
sessions and their vocabulary, kanji, and grammar. Use Bun, strict TypeScript, Drizzle,
and SQLite on one server with persistent storage.

## Technical Context

**Language/Version**: TypeScript 5.x on Bun 1.2.12

**Primary Dependencies**: SvelteKit, Svelte, Drizzle ORM, Drizzle Kit, Zod

**Storage**: SQLite through `bun:sqlite`; WAL, foreign keys, and persistent volume required

**Testing**: Vitest for unit/integration tests; Playwright for browser journeys

**Target Platform**: Modern desktop/mobile browsers; single Bun server with persistent disk

**Project Type**: Full-stack web application

**Performance Goals**: User-visible CRUD completion under two seconds for normal local-server load

**Constraints**: One application instance; server-side ownership checks; Unicode-safe content;
temporary local user isolated behind an auth boundary

**Scale/Scope**: Personal/small-group use; hundreds of sessions and thousands of entries

## Constitution Check

*GATE: Passed before research and re-checked after design.*

- Learning value: PASS - content is explicitly organized for Japanese study.
- Linguistic integrity: PASS - all supplied fields and ordered Japanese text are preserved.
- AI safety: PASS - no AI behavior exists in this feature.
- Privacy/security: PASS - all database access is scoped through the owning user.
- Accessibility/testing/simplicity: PASS - progressive forms, keyboard-safe controls, and
  automated ownership, persistence, and CRUD tests are planned.

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
│   ├── schemas/
│   └── server/
│       ├── db/
│       └── study-sessions/
└── routes/
    └── sessions/
tests/
├── integration/
└── unit/
e2e/
drizzle/
```

**Structure Decision**: One SvelteKit project keeps server actions, pages, validation, and
database code together while `$lib/server` prevents private code from entering browser bundles.

## Complexity Tracking

No constitution violations require justification.
