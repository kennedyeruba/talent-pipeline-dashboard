# Talent Pipeline Dashboard

A recruiter dashboard for tracking candidates through four hiring stages: Sourced, Screening, Interview and Hired.

Demo video: _link to be added_

<!-- ![Screenshot](docs/screenshot.png) -->

## Features

- **View candidates** with name, role and current stage in an accessible table.
- **Search by name**, debounced and handled by the API.
- **Filter by stage** using the count tiles above the table. The counts always cover every stage for the current search.
- **Change a candidate's stage** from a dropdown. The change shows immediately, saves through the API, and rolls back with an error message if saving fails.
- **Validation and clear states**: loading skeletons, empty results (with a "Clear filters" button), an empty database hint, and a retryable error.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run setup   # create the local database and load sample candidates
npm run dev     # http://localhost:3000
```

Other commands:

```bash
npm test             # API tests against a temporary database
npm run db:reset     # restore the sample candidates
npm run typecheck && npm run lint && npm run build
```

The database lives at `./data/talent.db`. Set `DATABASE_URL` (for example `file:./other.db`) to use a different one.

## Tech stack

Next.js 15 (App Router) and React 19, TypeScript, Tailwind CSS v4, SQLite through libSQL with Drizzle ORM, Zod v4 for validation, and Vitest.

## Project structure

```
src/
  app/            Pages and API route handlers
  components/     UI components (states/ holds loading, empty and error views)
  hooks/          useCandidates (fetching, optimistic updates) and useDebouncedValue
  db/             Schema, client, migrations runner, seed data and queries
  lib/            Stages, validation schemas, shared types, API client and HTTP helpers
drizzle/          Generated SQL migrations
scripts/          CLI wrappers for migrating and seeding
tests/            API tests and test database setup
```

## API

Every error response has the shape `{ "error": "message" }`.

### `GET /api/candidates?q=&stage=`

`q` matches names (case-insensitive, partial). `stage` is one of the four stages. Results are sorted by name. `counts` applies `q` but ignores `stage`.

```json
{
  "candidates": [
    { "id": 1, "name": "Ama Owusu", "role": "Frontend Engineer", "stage": "Interview", "updatedAt": "2026-10-27T09:00:00.000Z" }
  ],
  "counts": { "Sourced": 3, "Screening": 3, "Interview": 3, "Hired": 1 }
}
```

An unknown stage returns `400`.

### `PATCH /api/candidates/:id`

```bash
curl -X PATCH localhost:3000/api/candidates/1 \
  -H 'Content-Type: application/json' -d '{"stage":"Hired"}'
```

Returns the updated candidate. Returns `400` for an invalid id, body or stage, and `404` for an unknown id.

## Key decisions and trade-offs

- **SQLite via libSQL instead of Postgres.** Reviewers need no setup, and the same Drizzle schema works against Postgres with a dialect and driver change, or against Turso with a URL change.
- **Table with stage selects plus count tiles, instead of kanban.** It covers every requirement, is accessible by default, and keeps the scope focused.
- **Server-side search and filtering** with validated query params.
- **Optimistic updates with rollback**, followed by a silent refetch to reconcile counts and filtered rows.
- **Plain `fetch` and `AbortController`** instead of a data-fetching library.
- **One `STAGES` constant** drives the database constraint, validation, types and UI.

## Assumptions

- Candidates can move to any stage, including backwards.
- Search matches names only.
- There is a single recruiter and no authentication.
- Sample data is restored with `npm run db:reset`.

## Limitations

- No pagination, so the whole candidate list loads at once.
- Stage counts update after the server confirms a change, not at the moment of the optimistic update.
- Concurrent edits by several recruiters are not detected; the last write wins.
- No UI tests; only the API is covered.

## With more time

Postgres or Supabase, auth and roles, kanban drag-and-drop, stage history and audit log, candidate create/edit/delete, pagination and sorting, React Query, Playwright end-to-end tests, and a hosted demo (Vercel and Turso).
