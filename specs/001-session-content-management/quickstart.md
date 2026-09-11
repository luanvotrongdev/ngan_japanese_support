# Quickstart: Session Content Management

1. Run `bun install`.
2. Copy `.env.example` to `.env` and keep the default local database path.
3. Run `bun run db:migrate`.
4. Run `bun run dev` and open the displayed local URL.
5. Create and edit a session, then add one entry of each content type from the single master-detail page.
6. Restart the app and confirm all content remains unchanged.
7. Delete one entry from the type-badged master list and confirm its siblings remain.
8. Delete the session and confirm its content is removed.
9. Run `bun run check`, `bun run test`, and `bun run test:e2e`.

## Validation Results

- `bun run db:migrate`: passed
- `bun run check`: passed with zero errors and warnings
- `bun run test`: passed all database integration tests
- `bun run build`: passed using the Bun-hosted Vite command
- `bun run test:e2e`: passed the session plus vocabulary, kanji, and grammar journey on the master-detail page

Results re-verified after refactoring content management onto the single master-detail page.
