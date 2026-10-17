# Ngan Japanese Support

A web app for organizing Japanese study sessions and their vocabulary, kanji, and grammar
notes. Each session opens on a single master-detail page: one combined, type-badged list of
entries on the left and an inline detail/edit form on the right. The interface is localized
into Vietnamese (default) and English with a manual header toggle; learner-authored content
is always shown exactly as typed and never translated.

This README is the project's single source of documentation. Update it whenever behavior,
data, or routes change.

> **Platform scope**: the long-term goal is Web, macOS, Windows, Android, and iOS. The current
> build is a server-rendered web app only (SvelteKit + `adapter-node`); no desktop or mobile
> shell exists yet.

## Contents

1. [Getting started](#getting-started)
2. [Principles](#principles)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Data model](#data-model)
6. [Routes and form actions](#routes-and-form-actions)
7. [Localization](#localization)
8. [Testing](#testing)
9. [Design decisions](#design-decisions)
10. [Limitations and backlog](#limitations-and-backlog)

## Getting started

Requires [Bun](https://bun.sh) 1.2+; every script, including tests, runs through Bun.

```sh
bun install
cp .env.example .env
bun run db:migrate
bun run dev
```

`DATABASE_URL` (default `data/japanese-support.db`) sets the SQLite file; the `data/`
directory is created automatically.

| Command | Purpose |
|---|---|
| `bun run dev` | Start the dev server |
| `bun run build` / `bun run preview` | Production build / preview |
| `bun run check` | `svelte-kit sync` + `svelte-check` type checking |
| `bun run test` | Vitest suites against `data/test.db` (run serially) |
| `bun run test:e2e` | Playwright journeys; migrates and serves `data/e2e.db` on port 4173 |
| `bun run db:generate` | Generate a Drizzle migration after editing `schema.ts` |
| `bun run db:migrate` | Apply migrations in `drizzle/` |

### Manual smoke test

1. Open the app and confirm the UI is in Vietnamese (no auto-detection).
2. Toggle to English and back; UI strings, validation messages, and delete confirmations switch language.
3. Create and edit a session, then add one vocabulary, kanji, and grammar entry from the session page.
4. Restart the app; all content is unchanged and the UI still defaults to Vietnamese.
5. Delete one entry; its siblings remain. Delete the session; all its content is removed.

## Principles

1. **Learning outcomes first** — every feature serves a defined Japanese-learning outcome;
   content is organized so learners can understand and revisit it.
2. **Linguistic accuracy** — kanji, kana, readings, meanings, nuance, and examples are
   preserved without corruption; context-dependent language is not presented as a universal rule.
3. **Responsible AI** (for future AI features) — AI output is labeled as generated, treated
   as untrusted, validated, and has defined timeout/refusal/malformed/retry/unavailable
   behavior. API credentials (e.g. OpenAI) stay server-side; cost-affecting choices are documented.
4. **Privacy and security by default** — users only access their own data; secrets never
   reach source control, logs, client bundles, or error messages; stored data has a defined
   purpose and deletion behavior.
5. **Accessible, tested, simple** — primary journeys work on desktop and mobile with keyboard
   support and clear loading/validation/empty/error states; ownership, persistence, and
   external-service boundaries have automated tests; prefer the simplest design that works.

## Features

### Study sessions
- List, create, view, update, and delete sessions. A session has a required title, optional
  notes, and automatic created/updated timestamps.
- The session list is sorted by most recently updated; adding or editing content also
  bumps the session's updated time. Session cards show the created and updated dates; the
  session page shows both as date and time.
- Session-form validation errors appear under each field; create, save, and delete buttons
  are disabled while the form submits.
- Deleting a session requires confirmation and removes all its content atomically.

### Content types

| Type | Required | Optional / list fields |
|---|---|---|
| Vocabulary | vocabulary, reading, meaning | nuance; examples (list) |
| Kanji | kanji, meaning | onyomi, kunyomi, related vocabulary, examples (lists) |
| Grammar | grammar, usage, meaning | nuance; examples (list) |

- List fields keep the user's order; blank lines are discarded.
- Duplicate entries are allowed (context and meaning may differ).
- Japanese and other Unicode text is stored and displayed unchanged.

### Session page (master-detail)
- One combined list of all entries, each with a type badge, sorted by type (vocabulary,
  kanji, grammar) then title. Kanji rows show onyomi/kunyomi as the subtitle.
- Selecting an entry opens its edit form on the right; "Add vocabulary / kanji / grammar"
  buttons open an empty create form.
- Validation errors appear inline under each field; empty states show a prompt to add the
  first entry; entry-form buttons are disabled while saving.

### Out of scope (for now)
Authentication, quiz generation, grading, AI content generation, progress tracking, and
native desktop/mobile packaging.

## Architecture

- **Runtime**: Bun 1.2+, strict TypeScript.
- **Framework**: SvelteKit (Svelte 5 runes) with `@sveltejs/adapter-node`; server form
  actions with progressive enhancement.
- **Storage**: SQLite via `bun:sqlite` + Drizzle ORM/Kit, with WAL, foreign keys, and a
  5-second busy timeout. Requires a single app instance and a persistent `data/` volume.
- **Validation**: Zod schemas at the server boundary.
- **Identity**: a fixed `local-user` set in `src/hooks.server.ts` (upserted on every request).
  This is the auth boundary to replace before multi-user or public deployment.

```text
src/
├── hooks.server.ts            # temporary local-user identity (auth boundary)
├── lib/
│   ├── components/            # ContentList, EntryDetail, SessionFields, *Fields, LanguageToggle
│   ├── i18n/                  # vi/en dictionary, translate(), localizeErrors()
│   ├── schemas/               # Zod schemas for sessions and content
│   └── server/                # never bundled to the browser
│       ├── db/                # SQLite client, Drizzle schema, migration runner
│       └── study-sessions/    # ownership-checked repository functions
└── routes/
    ├── sessions/              # session list + create
    ├── sessions/[sessionId]/  # master-detail page + all content form actions
    └── set-language/          # POST-only language toggle endpoint
tests/   # Vitest: integration (DB) + unit (i18n)
e2e/     # Playwright journeys
drizzle/ # generated SQL migrations
```

Every query goes through `requireOwnedSession()` in `src/lib/server/study-sessions/shared.ts`;
missing and unowned resources both return 404, so nothing leaks about other users' data.

## Data model

| Table | Columns |
|---|---|
| `users` | `id` (PK), `display_name` |
| `study_sessions` | `id`, `user_id` → users, `title`, `notes?`, `created_at`, `updated_at`; index on (`user_id`, `updated_at`) |
| `vocabulary` | `id`, `study_session_id` → sessions (cascade), `vocabulary`, `reading`, `meaning`, `nuance?`, `examples` (JSON), timestamps |
| `kanji` | `id`, `study_session_id` → sessions (cascade), `kanji`, `onyomi`, `kunyomi` (JSON), `meaning`, `related_vocabulary`, `examples` (JSON), timestamps |
| `grammar` | `id`, `study_session_id` → sessions (cascade), `grammar`, `usage`, `meaning`, `nuance?`, `examples` (JSON), timestamps |

- IDs come from `crypto.randomUUID()`; timestamps are epoch milliseconds.
- List fields are JSON string arrays: edited and displayed as a unit, so no child tables.
- Session deletion is one `DELETE` relying on `ON DELETE CASCADE`.
- Each content write and the parent session's `updated_at` bump run in one `db.transaction`.
- The UI language is not stored in the database; it lives in a cookie.

### Validation rules
- Required text is trimmed and must be non-empty.
- Session title ≤ 120 characters; notes optional, ≤ 4000.
- Required content fields ≤ 2000 characters; optional `nuance` ≤ 4000 (blank → `null`).
- List fields are newline-separated text, normalized to trimmed, non-empty, ordered arrays.

After changing `src/lib/server/db/schema.ts`, run `bun run db:generate` and commit the new
migration in `drizzle/`.

## Routes and form actions

All actions require `locals.user`, validate with the shared Zod schemas, and redirect with
HTTP 303 on success.

| Route | Action | Inputs | Success redirect |
|---|---|---|---|
| `/` | — | — | 307 → `/sessions` |
| `/sessions` | default | `title`, `notes` | `/sessions/{id}` |
| `/sessions/{id}` | update | `title`, `notes` | `/sessions/{id}` |
| `/sessions/{id}` | delete | `confirmation=delete` | `/sessions` |
| `/sessions/{id}` | `{type}/create` | type fields | `/sessions/{id}?entry={type}:{entryId}` |
| `/sessions/{id}` | `{type}/update` | `entryId`, type fields | `/sessions/{id}?entry={type}:{entryId}` |
| `/sessions/{id}` | `{type}/delete` | `entryId`, `confirmation=delete` | `/sessions/{id}` |
| `/set-language` | default | `lang` (`vi`\|`en`), `from` | sets cookie, redirects to `from` |

`{type}` is `vocabulary`, `kanji`, or `grammar`. Field names: vocabulary — `vocabulary`,
`reading`, `meaning`, `nuance`, `examples`; kanji — `kanji`, `onyomi`, `kunyomi`, `meaning`,
`relatedVocabulary`, `examples`; grammar — `grammar`, `usage`, `meaning`, `nuance`, `examples`.

**Failures**
- Validation → HTTP 400 `{ action, entryId?, values, errors }` (the `/sessions` create
  action omits `action`). `errors` maps fields to localized messages.
- Missing delete confirmation → HTTP 400 `{ action, entryId?, message }`.
- Missing or unowned resource → HTTP 404. The error message is an i18n key
  (`notFound.session`, `notFound.vocabulary`, `notFound.kanji`, `notFound.grammar`) that
  `src/routes/+error.svelte` translates.

**Page state**: the session page keeps UI state in the URL. `?entry=<type>:<id>` opens an
existing entry (ignored if not found in the session); `?new=<type>` opens an empty create form.

**Language toggle**: lives on its own route because SvelteKit does not allow form actions in
layout server files. Any `lang` other than `en` resolves to `vi`. The cookie is `path=/`,
`SameSite=Lax`, one year. `from` is honored only for same-origin paths (starts with `/`, not
`//`), otherwise it redirects to `/sessions`. A GET redirects (307) to `/sessions`.

## Localization

- **Scope**: UI strings only (navigation, buttons, headings, empty/error/loading messages,
  confirmations). Learner content (titles, notes, meanings, examples) is never translated.
- **Languages**: Vietnamese (default) and English. Switched manually from the header; no
  browser-language detection.
- **Dictionary**: `src/lib/i18n/dictionaries.ts` holds every key in both languages.
  `translate()` falls back to English when a Vietnamese value is missing and returns the key
  itself if the key does not exist (unit tests ensure full coverage).
- **Locale flow**: `src/routes/+layout.server.ts` reads the `lang` cookie and exposes
  `page.data.locale`; components read it from there. Form actions read the cookie from the request.
- **Validation messages**: Zod emits tokens such as `required:title` / `tooLong:notes`;
  `localizeErrors()` turns them into localized text using the `field.<name>` label.
- **Server errors**: repository `error()` calls pass dictionary keys as messages; the root
  error page translates them (unknown messages are shown unchanged).
- **Timestamps**: formatted with `Intl.DateTimeFormat` in the active locale.
- **Adding a string**: add the key with both `vi` and `en` values to `dictionaries.ts` and use
  `translate(locale, key, params)` (placeholders use `{name}`).

## Testing

| Suite | Location | Covers |
|---|---|---|
| Integration (Vitest) | `tests/integration/` | session CRUD and cascade delete, ownership checks, ordered lists for each content type, session bump on content writes, localizable 404 keys |
| Unit (Vitest) | `tests/unit/i18n.test.ts` | dictionary coverage, locale resolution, fallback, interpolation, error localization, not-found keys |
| Browser (Playwright) | `e2e/` | full CRUD journey on one session page; Vietnamese default and English toggle; localized validation; localized session delete confirmation |

`tests/setup.ts` migrates the test database and resets it with `owner`/`other` users before
each test.

Last full validation (2026-10-17): `db:migrate`, `check` (0 errors/warnings), `test`
(19 passed), and `build` succeeded; the session list/detail, per-field validation, and the
localized 404 page were smoke-tested in a browser. `test:e2e` starts its server but needs
`bunx playwright install` on a fresh machine before the browsers can run.

## Design decisions

- **SvelteKit full-stack** over Svelte + separate API: routing, server trust boundaries, and
  progressive forms in one deployable app.
- **Drizzle + SQLite on Bun** over raw SQL: typed schema and generated migrations, still one file database.
- **JSON columns for ordered lists** over child tables: lists are always edited as a whole.
- **Vitest + Playwright** over `bun test`: better Svelte integration; still invoked through Bun.
- **In-repo dictionary** over Paraglide or svelte-i18n: tiny surface, synchronous on both server
  and client, no build step. An external translation API was rejected because it would
  translate learner content.
- **Single master-detail page** over separate pages per content type: everything for a session
  is visible and editable in one place.

## Limitations and backlog

- [x] Localize repository "not found" errors.
- [x] Show the session created time alongside the updated time.
- [x] Show session-form validation errors under each field.
- [x] Disable session create/edit/delete buttons while submitting.
- [x] Wrap content writes and the parent `updated_at` bump in one `db.transaction`.
- [x] Pin dependency versions in `package.json` (exact versions from `bun.lock`).
- [x] Add a `.gitattributes` line-ending policy (`* text=auto eol=lf`). Existing checkouts
  may need `git add --renormalize .` once.
- [ ] Replace the fixed `local-user` identity with real authentication.
- [ ] Plan the desktop/mobile packaging for macOS, Windows, Android, and iOS.
