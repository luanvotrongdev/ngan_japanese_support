# Agent guide

`README.md` is the single source of documentation: features, architecture, data model,
routes, localization, testing, and backlog. Read it before making changes and update it in
the same change whenever behavior, data, or routes change.

- Runtime and package manager: Bun. Use `bun run <script>`.
- Server-only code stays under `src/lib/server/`; every query must go through the ownership
  checks in `src/lib/server/study-sessions/shared.ts`.
- All UI strings go through `src/lib/i18n/dictionaries.ts` (Vietnamese and English);
  learner-authored content is never translated.
- After changing `src/lib/server/db/schema.ts`, run `bun run db:generate` and commit the new
  migration in `drizzle/`.
- Run `bun run check` and `bun run test` before finishing.
