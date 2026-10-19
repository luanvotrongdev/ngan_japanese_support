# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Workflow

- Use Plan Mode before new features, significant design tradeoffs, and bugs that survive the
  first attempted fix. (The default model is `opusplan`: Opus plans in Plan Mode, Sonnet implements.)

## Commands

- `bun run dev`: dev server (port 5173); `bun run check`: svelte-kit sync + svelte-check
- `bun run test`: all Vitest suites, serially, against `data/test.db`
- Single file: `bun run test tests/integration/kanji.test.ts`; single test: `bun run test -t "<name>"`
- `bun run test:e2e`: Playwright on port 4173 with `data/e2e.db` (needs `bunx playwright install` once)
- `bun run db:generate` after editing `schema.ts`; `bun run db:migrate` to apply

## Architecture

- SvelteKit (Svelte 5 runes, adapter-node) with server form actions; SQLite via `bun:sqlite`
  + Drizzle. Zod schemas in `src/lib/schemas/` validate at the server boundary and emit tokens
  like `required:title`, which `localizeErrors()` turns into vi/en text.
- Request flow: `src/hooks.server.ts` sets a fixed `local-user` (the auth boundary) →
  `src/routes/sessions/[sessionId]/+page.server.ts` holds all `{type}/create|update|delete`
  actions → `src/lib/server/study-sessions/*` repository functions, each gated by
  `requireOwnedSession()` (missing and unowned both 404 with an i18n key).
- Content writes and the parent session's `updated_at` bump share one `db.transaction`.
  List fields are JSON string arrays; session delete relies on `ON DELETE CASCADE`.
- Session page UI state lives in the URL (`?entry=<type>:<id>`, `?new=<type>`); the locale
  lives in the `lang` cookie, set via the POST-only `/set-language` route.
- `tests/setup.ts` migrates and resets the test DB with `owner`/`other` users before each test.
- Desktop: `desktop/` + `src-tauri/` run the built app as a Bun-compiled sidecar inside a
  Tauri 2 window; build steps and known gaps are in README "Desktop shell (experimental)".
- Bun is canonical; ignore `package-lock.json`.
