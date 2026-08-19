# SmartLib — Search. Learn. Discover.

A full-stack smart electronic library platform for students, researchers, and
administrators. Discover, search, read, save, review, and manage digital academic
resources, with analytics and management tools for administrators.

Built as an LTT AI training project.

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

### Demo accounts

All seeded accounts use the password `Password123`:

| Email | Role |
|---|---|
| `admin@smartlib.edu` | Administrator |
| `mona.researcher@smartlib.edu` | Researcher |
| `sara.student@smartlib.edu` | Student |

Registration is open for Student and Researcher accounts. Administrator accounts
are seed-only or promoted by an existing admin from **Admin → Users**.

## What's in it

**For readers**
- Home page with featured, popular, and new-arrival resources
- Library with keyword search (title, author, description, ISBN, category, type)
  plus filters for category, resource type, author, year, language, and access
  type, sorting, and pagination
- Resource detail pages with ratings, reviews, and related resources
- In-browser reader: page navigation, zoom, search within the document,
  bookmarking, and reading-progress tracking
- My Library: currently reading, favorites, reading lists, and reading history
- Rule-based recommendations from your favorites, reading history, and field
- Profile with reading statistics and account settings

**For administrators**
- Dashboard with totals, monthly reading activity, category breakdown, most
  popular resources, most active users, and recent activity
- Full resource CRUD, including featured flags and access types
- User management: search, filter, change role, activate/deactivate
- Reports: reading activity, downloads, popular categories, resource type
  distribution, top resources, and user activity

**Access control**
- Cookie-based sessions; passwords hashed with Node's built-in `scrypt`
- Role-based authorization enforced server-side in every route handler
- Restricted resources are gated for students at the API level, not just in the UI

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4

No ORM, no component library, no charting library, and no external auth package.
Data lives in a deterministic in-memory store seeded at process start, so the
project runs with zero setup and reseeds identically on every restart.

See [PROJECT.md](PROJECT.md) for architecture notes, the reasoning behind each
choice, and the decisions log.

## Scripts

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run lint
```

```bash
npx tsc --noEmit
```

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|---|---|
| `SESSION_SECRET` | Signs session cookies. Set a long random value in any deployed environment. |

## Data and copyright

All catalog content is fictional or open-access demo material written for this
project — no copyrighted works are included or distributed. The reader serves a
generated placeholder document, and downloads produce a plain-text placeholder
file. Every resource is labelled with its access type (Open Access, Licensed,
Restricted, or Demo).

Because the store is in-memory, **data resets on every server restart.** That is
intentional for a training and demo project; swapping in a real database is the
natural next step and is isolated to `lib/store.ts`.
