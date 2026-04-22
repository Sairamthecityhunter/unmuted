# Unmuted

Next.js app for **Unmuted** — a dark, accessibility-minded site for sharing and browsing first-person stories about work and society. **Community posts** from the Share form are saved and shown in the feed for everyone who visits that deployment (no login). Seed stories stay in code; new posts are stored in a JSON file locally or in **Upstash Redis** on Vercel (see below).

## Prerequisites

- **Node.js** 20.x or newer (LTS recommended)
- **npm** 10+ (ships with Node)

## Setup

From the repository root:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command        | Purpose                          |
| -------------- | -------------------------------- |
| `npm run dev`  | Development server (Turbopack) |
| `npm run build` | Production build               |
| `npm run start` | Serve production build locally |
| `npm run lint`  | ESLint                         |

## Folder structure

```
./
├── public/                 # Static assets (favicons, SVGs)
├── src/
│   ├── app/                # App Router: routes, layouts, global CSS
│   │   ├── layout.tsx      # Root layout, fonts, SiteShell
│   │   ├── globals.css     # Theme tokens, a11y baselines, reduced motion
│   │   ├── page.tsx        # Home
│   │   ├── api/stories/    # POST publish, GET list (merged with mocks)
│   │   ├── feed/           # Story list + filters
│   │   ├── categories/
│   │   ├── submit/
│   │   ├── guidelines/     # Community rules copy
│   │   ├── disclaimer/
│   │   ├── about/
│   │   ├── stories/[id]/   # Story detail
│   │   └── admin/moderation/  # Demo moderation queue (no auth)
│   ├── components/         # UI and feature components
│   │   ├── layout/         # SiteShell, header, footer, skip link, page header
│   │   ├── home/           # Landing sections
│   │   ├── story/          # Cards, detail, reactions, report UI
│   │   ├── feed/
│   │   ├── submit/
│   │   ├── legal/
│   │   └── ui/             # Container, Button, Card, Badge, etc.
│   ├── domain/             # Shared domain types and enums (DTOs)
│   ├── lib/
│   │   ├── mock/           # MOCK_STORIES, comments, moderation rows
│   │   ├── stories-data.ts # Merge mocks + community posts; Redis or JSON file
│   │   ├── taxonomy/       # Categories and tags
│   │   ├── constants/      # Nav, report reasons
│   │   ├── content/        # Long-form copy (e.g. disclaimer sections)
│   │   └── utils/          # className helpers
│   └── types/              # App-level types (e.g. Story)
├── data/                   # `community-stories.json` (gitignored) when not using Redis
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

HTML prototypes at the repo root (`share-story-form.html`, `community-rules.html`, etc.) are reference only; the live UI is under `src/`.

## Community publishing (world-visible posts)

- **Share** (`/submit`) sends `POST /api/stories`. Valid posts get an id like `cu-…` and appear on **Home**, **Stories**, and **/stories/[id]** for all visitors to that deployment.
- **Local / VPS / Docker:** posts append to `data/community-stories.json` (created automatically; listed in `.gitignore`).
- **Vercel:** serverless disks are not writable for long-term JSON. Add an **Upstash Redis** integration from the [Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=redis). Vercel will inject `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Redeploy; publishing then uses Redis key `unmuted:community-stories`.
- **API:** `GET /api/stories` returns merged mock + community lists (JSON). Use this if you build a separate client later.
- **Comments:** `POST /api/stories/[id]/comments` saves replies and returns a one-time `deleteToken` (stored in `localStorage` under `unmuted:commentDelete:<id>`). `DELETE` to the same URL with `{ commentId, deleteToken }` removes only that row if the hash matches (seed/mock comments have no token and cannot be deleted via the API).
- **Reactions:** `POST /api/stories/[id]/reactions` with `{ "type": "support" | "relate" | "important" }` persists taps to `data/reaction-deltas.json` or Redis `unmuted:reaction-deltas`. Merged counts are what you see on stories and feeds.
- **Events / meetings:** When a story’s **Support** total (base + deltas) reaches **`MIN_SUPPORT_TO_HOST_MEETING`** in `src/lib/constants/meeting-host.ts`, a host form appears on the story. `POST /api/meetings` saves links to `data/community-meetings.json` or Redis `unmuted:community-meetings`; they list on `/events`.

This is intentionally minimal: there is no spam filtering, rate limiting, or legal review—add those before a public launch.

## UX, layout, and accessibility notes

- **Skip link** — First tab stop jumps to `#main-content` (see `SkipLink` + `SiteShell`).
- **Containers** — `Container` supports `maxWidth` presets (`sm` … `2xl`) so page widths stay consistent without scattering `max-w-*` classes.
- **Motion** — `prefers-reduced-motion: reduce` short-circuits transitions/animations in `globals.css`.
- **Tables** — Moderation desktop table uses `scope="col"` on headers.
- **Mobile menu** — Marked as `role="dialog"` / `aria-modal` when open; backdrop closes on click or `Escape`.

## Future improvements

- **Persistence** — Move community posts from Redis/JSON to Postgres (search, backups, moderation joins).
- **Auth** — Sessions for submitters and moderators; lock `/admin/*` behind roles.
- **Reporting** — Wire `StoryReportButton` to an API; store reports and notify moderators.
- **Moderation** — Real resolve/dismiss flows, audit log, and appeal workflow.
- **Search & filters** — Server-backed category/tag search and pagination.
- **Focus management** — Trap focus inside the mobile menu while open and return focus to the menu button on close.
- **Testing** — Add Playwright or Cypress for critical flows (submit, feed, report dialog).

## Deploying to Vercel

1. Push the project to a Git host (GitHub, GitLab, or Bitbucket).
2. In [Vercel](https://vercel.com), **Add New Project** and import that repository.
3. Leave **Root Directory** at `.` (repository root is the Next.js app). Framework preset: **Next.js** (auto-detected). Build: `npm run build`; output: default (`.next`). Install: `npm install` (default).

If you previously set Root Directory to `web`, clear it to `.` and redeploy—otherwise deployments 404.

### Environment variables

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `UPSTASH_REDIS_REST_URL` | On Vercel for live posts | Upstash REST URL (from Redis integration) |
| `UPSTASH_REDIS_REST_TOKEN` | On Vercel for live posts | Upstash token |

For local development, omit both to use `data/community-stories.json`. When you add a database or auth, also set e.g. `DATABASE_URL`, `AUTH_SECRET` in **Vercel → Project → Settings → Environment Variables**.

### Preview and production

Each git branch gets preview deployments by default. Assign your production domain under **Project → Settings → Domains**.

Official reference: [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs).

## License

Private / unlicensed unless you add a `LICENSE` file at the repo root.
