# Portfolio — guide for Claude

Personal portfolio. Astro 6 (static prerender + Cloudflare Workers SSR), Tailwind v4, React 19 islands, Keystatic CMS. Canonical domain: **kartiklabhshetwar.com** (set once in `astro.config.mjs` → `site`; `robots.txt`, the sitemap, and `/llms.txt` all derive from it).

## Package manager: pnpm — NOT npm or bun

The lockfile is `pnpm-lock.yaml` and the version is pinned in `package.json` → `packageManager`. Never run `npm install` or `bun install` here (it creates a competing lockfile and confuses Cloudflare's deploy detection).

- Install — `pnpm install`
- Dev (site + `/keystatic`) — `pnpm dev` (<http://localhost:4321>)
- Build — `pnpm build`
- Test (vitest) — `pnpm test`
- Type-check — `pnpm check`
- Deploy to Cloudflare — `pnpm exec wrangler deploy` (or `make deploy`)

`make help` lists everything. pnpm v10 skips dependency build scripts by default — the ones this project needs (`workerd`, `esbuild`, `sharp`, `@tailwindcss/oxide`) are allow-listed in `package.json` → `pnpm.onlyBuiltDependencies`. `workerd` runs the Cloudflare prerender during `astro build`, so don't remove it.

## Stack & layout

- `src/data/*.ts` — profile, experience, projects (plain TS, not content collections).
- `src/content/blog/<slug>/index.mdoc` — blog posts (Markdoc collection), editable via Keystatic at `/keystatic`.
- `src/lib/github.ts` — build-time GitHub fetches (stars + sponsors).
- `src/lib/visitors.ts` + `src/pages/api/visitors.ts` — Upstash Redis visitor counter (footer count only).
- `src/pages/llms.txt.ts` — **generated** `/llms.txt`; edit the data, not the output.

## Conventions

- **Type:** JetBrains Mono for UI / headings / code; serif (`ui-serif`) for blog body (`.prose` in `global.css`). Keep this split.
- **Projects:** action-led, verb-first descriptions + an optional `impact` metric (downloads/DAU/"Latest"). Stars render live from the build-time fetch — don't hardcode them.
- **Newsletter:** subscribing posts to `/api/subscribe` (server route → Buttondown v1 API with `BUTTONDOWN_API_KEY`), so the exact typed email is used. The public archive handle stays hardcoded in `NewsletterForm.astro`.
- **Commits:** conventional style (`feat:`, `fix:`…), no AI attribution footer. Default branch is `main`; work happens on feature branches.

## Env vars (`.env` locally, Cloudflare dashboard in prod — see `.env.example`)

- `GITHUB_TOKEN` — classic PAT, build-time. Scopes: `repo` + `read:user` for stars, **plus `read:org`** for sponsors (the `sponsorshipsAsMaintainer` query returns `INSUFFICIENT_SCOPES` without it).
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — visitor counter (runtime, via `cloudflare:workers` env).
- `BUTTONDOWN_API_KEY` — newsletter subscribes (runtime, via `cloudflare:workers` env). Powers `/api/subscribe`; without it the form replies "not configured".
- `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` — in `.env` but **unused by any code** (leftover). Safe to delete unless a Mux feature is planned.

Never log secret values. There are currently no `console.*` statements in the codebase — keep it that way; if you must debug a secret, log only `Boolean(value)` and remove it before committing.

## Don't commit

`.env`, `.agents/`, `.claude/`, `skills-lock.json` (all gitignored — agent tooling, not project files).
