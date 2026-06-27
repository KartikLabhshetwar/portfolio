# Design: Port portfolio from Next.js to Astro (minimal, Cloudflare, CMS, live sponsors, newsletter)

Date: 2026-06-21
Status: Proposed — awaiting review

## 1. Goal

Rebuild the existing Next.js 15 portfolio as a **minimal Astro site on Cloudflare**, with:
- A self-hosted blog backed by a **CMS** (Keystatic) instead of Medium links.
- **Live GitHub sponsors** (no more hard-coded list).
- **Text-only project cards** — name, users, live GitHub stars, what it does. No images/videos.
- An **embedded Buttondown newsletter**.
- Far less JS/weight than today (drop 554 MB of video, ~93 MB of images, most framer-motion, oneko cat, contributions calendar, tech marquee).

## 2. Locked decisions

| Topic | Decision |
|---|---|
| Port style | **Lean Astro-native rebuild** — mostly `.astro` pages; React present only for Keystatic's admin UI. Our own interactivity is tiny vanilla scripts. |
| Blog CMS | **Keystatic** (git-based; MDX in repo; read via Astro content collections). |
| Project "users" metric | **Manual `users` field** per project; stars fetched live. |
| Kept extras | **Visitor counter only.** Dropped: contributions calendar, scroll/hover animations, oneko cat, tech-stack marquee. |
| Newsletter | **Embedded Buttondown** — subscribe form on-site (plain HTML POST), archive + sending hosted by Buttondown. |
| Host | **Cloudflare** via `@astrojs/cloudflare` adapter. |

## 3. Target architecture

**Stack:** Astro 5, Tailwind v4 (via `@tailwindcss/vite`), TypeScript, `@astrojs/react` (for Keystatic only), `@astrojs/mdx`, `@keystatic/core` + `@keystatic/astro`, `@astrojs/cloudflare` adapter, `@upstash/redis`, `@octokit/graphql`/`rest`.

**Rendering model:** `output: 'static'` (Astro default) + Cloudflare adapter. Almost every page prerenders to static HTML. Only routes that *must* run at request time set `export const prerender = false`:
- `/api/visitors` — the visitor counter (Upstash read/write).
- Keystatic admin routes (`/keystatic` + `/api/keystatic/...`) — **only if** GitHub-mode deployed editing is enabled. Local-mode authoring needs no deployed server.

**Data freshness:** Sponsors and stars are fetched **at build time** and baked into HTML. They refresh on each deploy. Optional: a Cloudflare scheduled deploy-hook to rebuild daily (deferred — see §10).

**Deployment:** `@astrojs/cloudflare` adapter; `wrangler.jsonc` with `compatibility_flags: ["nodejs_compat"]`; build `astro build`, deploy via Cloudflare's Git integration (connect the repo) or `wrangler deploy`. Secrets in the Cloudflare dashboard.

## 4. Content model

### Blog — Keystatic collection
- Stored as MDX under `src/content/blog/*` (or `src/data/blog/*`), managed by Keystatic.
- Schema: `title`, `description`, `publishDate`, `tags[]`, `draft`, `body`. Body format (MDX vs Markdoc) confirmed during implementation against the current `@keystatic/astro` guide; default MDX.
- Read at build via Astro content collections (`getCollection('blog')`).
- The 4 existing Medium posts become external-link entries or are migrated as full posts (user's choice during migration — default: keep them as link-out cards, write new posts natively).

### Projects — typed data file (`src/data/projects.ts`)
- **Not** in Keystatic (YAGNI — no UI requested for projects; promote later if wanted).
- Trim the `Project` type to: `id`, `title`, `description`, `users?` (string, e.g. "25k"), `liveLink?`, `githubLink?`. **Remove `video`, `image`, `tags`, `longDescription`, `tweetUrl`** from card display.
- Card shows exactly: **name · users (if set) · live stars · description.** Nothing else.
- Stars derived by parsing `owner/repo` from `githubLink` and fetching `stargazers_count` at build.

### Sponsors — live, no data file
- Fetched at build from GitHub GraphQL `viewer.sponsors(first:100)` → `{ name, login, url, avatarUrl, websiteUrl }`.
- Card shows: avatar + name + GitHub link. (Twitter + $ amount dropped — not reliably in the API and not "minimal".)
- `src/data/sponsors.ts` and `public/sponsers/` logos are deleted.

### Experience — static
- Keep the existing experience content (Mem0 entries etc.) as a small static `.astro` section / data file.

## 5. Feature-by-feature port map

| Current feature | Action |
|---|---|
| Home (`page.tsx` + HomeContent) | Rebuild as `index.astro`: hero/profile, experience, projects preview, blog preview, sponsors, newsletter, footer. |
| Projects list + `[id]` detail | List → text cards. **Drop per-project detail pages**; cards link to live + GitHub. |
| Blog list + `[id]` | Rebuild from Keystatic collection: `/blog` list, `/blog/[slug]` MDX render. |
| Sponsors page | Keep a `/sponsors` page (full live list) **and** show a sponsors preview section on home. |
| Visitor counter (`/api/visitors`, Upstash) | **Keep.** On-demand endpoint + tiny vanilla fetch script to display the count. |
| Theme toggle (next-themes) | Replace with inline `<head>` script (set `dark` class pre-paint) + a button + Tailwind `dark:`. No React. |
| GitHub stars (`/api/github-stars`, PortfolioStars) | Move to **build-time** fetch; bake into project cards. |
| Contributions calendar + merged-PR list | **Drop.** |
| Tech-stack marquee | **Drop.** |
| Oneko cat | **Drop.** |
| framer-motion / motion animations | **Drop**; use light CSS transitions only. |
| next-video / Mux (`videos/`, 554 MB) | **Delete.** |
| Project screenshots (`public/images/`, ~93 MB) | **Delete.** |
| Fonts (Hanken Grotesk, Instrument Serif) | Self-host via `@fontsource` or `@font-face`. |
| DataBuddy analytics | Keep as a `<script>` in the layout `<head>`. |
| Newsletter | **New:** embedded Buttondown subscribe form + archive link. |

## 6. Integrations & secrets

| Name | Where | When | Notes |
|---|---|---|---|
| `GITHUB_TOKEN` | sponsors + stars | **build** | Classic PAT, scope `read:user`. Sponsors require it; stars fall back to unauthenticated if absent. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | visitor counter | **runtime** | Existing Upstash project. |
| Buttondown | subscribe form | n/a | Plain HTML POST to Buttondown's embed endpoint; no secret needed for the embed. Archive linked out. |
| Keystatic GitHub mode (optional) | deployed admin | runtime | Needs a GitHub App (`KEYSTATIC_GITHUB_CLIENT_ID/SECRET`, `KEYSTATIC_SECRET`). **Deferred** — start in local mode. |

## 7. Route inventory (target)

- `/` — home (static)
- `/projects` — text-only project cards (static, build-time stars)
- `/blog` — post list from Keystatic (static)
- `/blog/[slug]` — MDX post (static)
- `/sponsors` — live sponsor cards (static, build-time)
- `/api/visitors` — visitor counter (on-demand, `prerender=false`)
- `/keystatic`, `/api/keystatic/*` — admin (local mode in dev; deployed only if GitHub mode enabled later)

## 8. Migration approach

- **Same repo, new branch.** Rebuild rather than mechanically convert components (it's a lean rebuild).
- Remove Next.js (`src/app`, `next.config.ts`, next deps, `videos/`, `public/images/`, oneko/tech-icon/sponsor assets).
- Keep & adapt: design tokens from `globals.css`, content/copy, profile assets, project/experience data.
- Phased build (detailed in the implementation plan): scaffold Astro+Tailwind+Cloudflare → layout/theme/fonts → home + static sections → projects (build-time stars) → sponsors (live) → Keystatic blog → visitor counter endpoint → Buttondown newsletter → deploy config + docs.
- Each phase ends with a runnable check (build passes / page renders / endpoint returns).

## 9. Risks & to-verify-during-implementation

- **Exact Buttondown embed endpoint + archive URL** — confirm from current Buttondown docs.
- **Keystatic ↔ Cloudflare GitHub-mode runtime** — only relevant if/when deployed admin is enabled; local mode avoids it. Confirm before enabling GitHub mode.
- **Astro 5 `prerender=false` + Cloudflare adapter** for the single visitor endpoint — confirm config.
- **GitHub Sponsors GraphQL** exact field set + private-sponsor handling — confirm; private sponsors render anonymized or are skipped.
- **Tailwind v4 in Astro** via `@tailwindcss/vite` — confirm plugin wiring.

## 10. Out of scope / deferred

- Keystatic GitHub-mode deployed admin (start local mode).
- Scheduled daily rebuild for stars/sponsors freshness (build-on-deploy is enough initially).
- Projects-as-CMS, per-project detail pages, tweet embeds, contributions calendar, animations.
- Migrating old Medium posts as full native content (default: keep as link-outs).
