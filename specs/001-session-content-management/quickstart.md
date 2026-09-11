# Quickstart: Session Content Management

1. Run `bun install`.
2. Copy `.env.example` to `.env` and keep the default local database path.
3. Run `bun run db:migrate`.
4. Run `bun run dev` and open the displayed local URL.
5. Confirm the UI renders in Vietnamese by default (no auto-detection).
6. Use the header language toggle to switch to English and back; confirm all UI strings,
   form validation messages, and delete confirmations switch language.
7. Create and edit a session, then add one entry of each content type from the single master-detail page.
8. Restart the app and confirm all content remains unchanged and the UI still defaults to Vietnamese.
9. Delete one entry from the type-badged master list and confirm its siblings remain.
10. Delete the session and confirm its content is removed.
11. Run `bun run check`, `bun run test`, and `bun run test:e2e`.

## Validation Results

- `bun run db:migrate`: passed
- `bun run check`: passed with zero errors and warnings
- `bun run test`: passed all 16 database integration and i18n unit tests
- `bun run build`: passed using the Bun-hosted Vite command
- `bun run test:e2e`: passed 4 journeys - the session plus vocabulary, kanji, and grammar
  CRUD flow, Vietnamese default and English toggle with stored content preserved, localized
  validation messages, and the localized session delete confirmation

Results were re-verified for the localization build on 2026-09-11, including the new
`tests/unit/i18n.test.ts` unit suite and the `e2e/localization.spec.ts` browser journey.
