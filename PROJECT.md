# SmartLib — Project Constitution

Smart electronic library platform for students, researchers, and administrators.
Tagline: "Search. Learn. Discover."

## Stack (locked, do not change without discussion)

- Next.js 16 (App Router, Turbopack, TypeScript, Tailwind v4) — `create-next-app@latest --yes`
- No ORM, no external database driver: **in-memory store** (`lib/store.ts`), seeded
  deterministically at process start from `lib/seed-data.ts` (fixed PRNG seed = 42).
  This is the T0 tier. Restarting the dev server resets demo data to the same seed.
- No component library, no icon package: hand-written Tailwind components in
  `components/ui.tsx`, inline SVG icons and hand-drawn SVG charts.
- Auth: cookie-based sessions. Passwords hashed with Node's built-in `scrypt`
  (`lib/auth.ts`), session token = base64 payload + HMAC-SHA256 signature signed
  with `SESSION_SECRET` (`.env.local`). No third-party auth package.
- All demo accounts share the password `Password123` (see `APP-SPEC.md`).

## Deviations from the standard single-table workshop scaffold

This brief specifies 9 real entities (Users, Resources, Authors, Categories,
Favorites, ReadingHistory, ReadingLists, ReadingListItems, Reviews) plus a
lightweight internal `Downloads` log added to support the "Total downloads" /
"Downloads" analytics the brief asks for but doesn't model as its own entity.
That is intentionally more than the workshop's default "one table" rule — the
brief's own database section requires it, so the multi-entity in-memory store is
the deviation, logged here per the decision engine's instruction to log and move on.

## Scope decisions

- **Language/RTL**: default UI is English/LTR. The library's demo catalog
  includes Arabic-language resources (titles, descriptions) which render
  correctly via the browser's bidi algorithm. A full site-wide Arabic UI
  translation + RTL layout toggle was scoped **out of V1** — it would roughly
  double the styling and copy surface for a training-scale app. Logged as a
  non-goal; the architecture (isolated string usage, semantic HTML) does not
  block adding it later.
- **Registration roles**: only Student and Researcher are self-registerable.
  Administrator accounts are seed-only / promoted by an existing admin via
  Manage Users — self-service admin signup would be a privilege-escalation bug.
- **Resource deletion**: hard delete (admin-only, behind a confirmation dialog).
  Acceptable because all data is synthetic and reseeds on restart anyway.
- **Reader**: reads a placeholder generated document (no real copyrighted file
  content is bundled), matching the brief's copyright rules.
- **Charts**: hand-written inline SVG bar/line charts, no charting library.
- **Authors/Categories management**: the brief's admin permissions mention managing
  authors and categories, but the page list only specifies Manage Resources / Users
  / Reports as dedicated screens. `POST /api/authors` and `POST /api/categories`
  exist and are used when adding a resource (select existing or the resource form
  covers the common case); standalone list/edit/delete screens for authors and
  categories were left out of V1 as a scope cut, not an oversight.

## Roles

- `student`, `researcher` — browse, search, read, favorite, review, reading lists.
- `admin` — everything above, plus `/admin/*` management and analytics.

## Where things live

```
app/                     pages + app/api/** route handlers
components/              presentational, mostly server components
lib/types.ts             shared entity types
lib/store.ts             in-memory DB + seeding + query helpers
lib/seed-data.ts         source content for the demo catalog
lib/auth.ts, session.ts  password hashing, session tokens, getCurrentUser()
lib/validate.ts          hand-written validators
lib/api-helpers.ts       requireUser/requireAdmin guards, error responses
```

## Decisions log

- 2026-08-19: multi-entity in-memory store instead of one table (see above).
- 2026-08-19: added `Downloads` log entity, not in the original brief, to back
  the "Total downloads" / download-count analytics the brief requests.
- 2026-08-19: Arabic UI translation + RTL toggle deferred to a post-V1 pass.
