# Ngan Japanese Support

A SvelteKit application for organizing Japanese study sessions and their vocabulary,
kanji, and grammar notes.

## Setup

```sh
bun install
cp .env.example .env
bun run db:migrate
bun run dev
```

## Checks

```sh
bun run check
bun run test
bun run build
bun run test:e2e
```

The application currently uses the fixed `local-user` identity. It is deliberately
isolated in `src/hooks.server.ts` and must be replaced by supported authentication before
multi-user or public deployment. SQLite deployment requires one application instance and
a persistent `data/` volume.
