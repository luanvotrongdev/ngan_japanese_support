# Research: Session Content Management

## Full-stack framework
**Decision**: SvelteKit with strict TypeScript and stable server form actions.
**Rationale**: It provides routing, server trust boundaries, validation responses, and progressive enhancement in one app.
**Alternatives considered**: Bare Svelte plus a separate API adds unnecessary deployment and contract overhead.

## Persistence
**Decision**: Drizzle ORM and Drizzle Kit over Bun's SQLite driver, deployed on one persistent server.
**Rationale**: Typed schema and migrations reduce handwritten mapping while retaining SQLite simplicity.
**Alternatives considered**: Direct SQL is smaller but creates avoidable migration and mapping work.

## Ordered lists
**Decision**: Store non-queryable ordered string lists as JSON text columns.
**Rationale**: Examples and readings are edited and displayed as a unit and need no independent relational queries.
**Alternatives considered**: Child tables add joins and CRUD complexity without current user value.

## Testing
**Decision**: Vitest for domain/database integration and Playwright for browser flows, invoked by Bun scripts.
**Rationale**: This follows Svelte tooling while preserving Bun as package manager and runtime.
**Alternatives considered**: Bun test has strong TypeScript support but less direct Svelte component integration.
