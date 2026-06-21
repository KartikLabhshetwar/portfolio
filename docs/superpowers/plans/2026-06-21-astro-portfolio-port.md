# Astro Portfolio Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Next.js 15 portfolio as a minimal Astro site on Cloudflare with a Keystatic-backed blog, live GitHub sponsors, text-only project cards (live stars), an embedded Buttondown newsletter, and a kept Upstash visitor counter.

**Architecture:** Static-first Astro (almost all pages prerender to HTML). React is present only for Keystatic's admin UI; our own components are `.astro` + tiny vanilla scripts. GitHub stars and sponsors are fetched at **build time** via `fetch` and baked into HTML. The only request-time route is `/api/visitors` (Upstash). Deployed on Cloudflare via `@astrojs/cloudflare`.

**Tech Stack:** Astro 6.x, Tailwind v4 (`@tailwindcss/vite`), TypeScript, `@astrojs/react` + `@astrojs/markdoc` + `@keystatic/core`/`@keystatic/astro` (blog CMS), `@astrojs/cloudflare` adapter, `@upstash/redis`, `@fontsource` fonts, Vitest. Plain `fetch` for GitHub (no Octokit). Buttondown for newsletter (embed form, no SDK).

## Global Constraints

- Astro `output` stays **static** (default); only `/api/visitors` sets `export const prerender = false`. Keystatic injects its own routes.
- Tailwind via **`@tailwindcss/vite`** only — never `@astrojs/tailwind` (deprecated for v4).
- **No** framer-motion / motion, **no** `next-*`, **no** Mux / next-video, **no** Octokit. Use native `fetch`.
- React is used **only** by Keystatic. Our interactivity (theme, visitor count) is vanilla `<script>`.
- Keystatic uses the **Markdoc** path: `fields.markdoc` → `.mdoc` files → `@astrojs/markdoc` + glob loader.
- Keystatic `storage` is `{ kind: 'local' }` for now; GitHub mode is deferred (documented, not built).
- Project cards display **only**: name, `users` (if set), live GitHub stars, description. Nothing else (no tags/images/video/tweets).
- Sponsor cards display **only**: avatar, name, GitHub link. No `$` amount, no Twitter.
- Secrets: `GITHUB_TOKEN` (build-time, classic PAT scope `read:user`); `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (runtime). Buttondown username is public, hardcoded.
- Preserve the existing visual identity: port CSS design tokens from `legacy/app/globals.css`.
- Commit after every task. Tests via `npx vitest run`.
- When a step says "verify against current docs," use Context7 (`/withastro/docs`, `/thinkmill/keystatic`) or the linked doc before writing config — framework APIs move fast.

---

## File Structure (target)

```
astro.config.mjs            # integrations + tailwind vite plugin + cloudflare adapter
keystatic.config.ts         # blog collection (local storage, markdoc)
wrangler.jsonc              # Cloudflare worker config (generated/adjusted)
tsconfig.json              # Astro strict
package.json               # Astro deps/scripts
vitest.config.ts           # test runner
src/
  styles/global.css        # @import tailwindcss + dark variant + ported tokens + fonts
  layouts/Base.astro       # <html>, head (meta/fonts/theme script/analytics), footer, slot
  components/
    Nav.astro
    ThemeToggle.astro
    ProjectCard.astro
    SponsorCard.astro
    BlogCard.astro
    NewsletterForm.astro
    VisitorCount.astro
  lib/
    github.ts              # parseRepo, fetchRepoStars, fetchSponsors  (build-time)
    visitors.ts           # generateVisitorId, trackVisit, getVisitorStats  (runtime)
  data/
    profile.ts            # name, bio, socials, links
    projects.ts           # trimmed Project[]
    experience.ts         # experience entries
  content.config.ts        # blog collection (glob loader)
  content/blog/*.mdoc      # Keystatic-managed posts
  pages/
    index.astro
    projects.astro
    sponsors.astro
    blog/index.astro
    blog/[slug].astro
    api/visitors.ts        # prerender = false
tests/
  github.test.ts
  visitors.test.ts
public/                    # favicon, og image, robots.txt, profile photo(s)
legacy/                    # old Next.js src + configs (reference; deleted in Task 10)
```

---

## Task 1: Scaffold Astro + Tailwind v4 + Base layout + theme

**Files:**
- Move: `src/` → `legacy/` ; `next.config.ts`, `next-env.d.ts`, `video.d.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json` → `legacy/`
- Delete: `videos/`, `public/images/`, `public/tech-icons/`, `public/sponsers/`, `public/oneko.gif`, `public/oneko (1).gif`, `.next/`
- Create: `package.json` (rewrite), `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/Nav.astro`, `src/components/ThemeToggle.astro`, `src/pages/index.astro`, `public/favicon.png`

**Interfaces:**
- Produces: `Base.astro` (props: `title?: string`, `description?: string`) wrapping all pages; `src/styles/global.css` imported once in `Base.astro`; a working `.dark` class theme toggle.

- [ ] **Step 1: Preserve old code, remove Next infra**

```bash
cd /Users/kartiklabhshetwar/Projects/portfolio
mkdir -p legacy
git mv src legacy/src
git mv next.config.ts next-env.d.ts video.d.ts eslint.config.mjs postcss.config.mjs components.json legacy/ 2>/dev/null || true
rm -rf .next videos public/images public/tech-icons public/sponsers "public/oneko.gif" "public/oneko (1).gif"
```

- [ ] **Step 2: Rewrite `package.json`**

```json
{
  "name": "portfolio",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^6.0.0",
    "@fontsource-variable/hanken-grotesk": "^5.0.0",
    "@fontsource/instrument-serif": "^5.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 3: Create `astro.config.mjs`** (adapter/integrations added in later tasks)

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://kartikk.tech',
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist", "legacy"]
}
```

- [ ] **Step 5: Create `src/styles/global.css`** — Tailwind v4 import, class-based dark variant, fonts. Then **port the design tokens**: open `legacy/src/app/globals.css` and copy its `:root` and dark-mode CSS custom properties (colors, radii) into the marked block below, dropping any `@tailwind`/v3 directives and `tw-animate-css` import.

```css
@import "tailwindcss";
@import "@fontsource-variable/hanken-grotesk";
@import "@fontsource/instrument-serif";

/* class-based dark mode (Tailwind v4 defaults to prefers-color-scheme) */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --font-hk-grotesk: "Hanken Grotesk Variable", system-ui, sans-serif;
  --font-instrument-serif: "Instrument Serif", serif;
  /* PORT: paste :root tokens from legacy/src/app/globals.css here */
}
.dark {
  /* PORT: paste .dark tokens from legacy/src/app/globals.css here */
}
html { font-family: var(--font-hk-grotesk); }
```

- [ ] **Step 6: Create `src/components/ThemeToggle.astro`**

```astro
<button id="theme-toggle" type="button" aria-label="Toggle theme"
  class="rounded-md p-2 text-sm hover:bg-black/5 dark:hover:bg-white/10">
  <span class="dark:hidden">🌙</span>
  <span class="hidden dark:inline">☀️</span>
</button>
<script>
  const btn = document.getElementById('theme-toggle');
  btn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
</script>
```

- [ ] **Step 7: Create `src/components/Nav.astro`**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/sponsors', label: 'Sponsors' },
];
---
<nav class="flex items-center justify-between py-6">
  <a href="/" class="font-semibold">Kartik</a>
  <div class="flex items-center gap-4 text-sm">
    {links.map((l) => <a href={l.href} class="hover:underline">{l.label}</a>)}
    <ThemeToggle />
  </div>
</nav>
```

- [ ] **Step 8: Create `src/layouts/Base.astro`** — head, pre-paint theme script (avoids flash), analytics, Nav, footer.

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
const { title = 'Kartik Labhshetwar', description = 'Developer, builder.' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.png" />
    <script is:inline>
      const t = localStorage.getItem('theme');
      const dark = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', dark);
    </script>
    <script defer src="https://cdn.databuddy.cc/databuddy.js"></script>
  </head>
  <body class="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
    <main class="mx-auto max-w-2xl px-4">
      <Nav />
      <slot />
      <footer class="mt-20 border-t border-black/10 py-8 text-sm text-zinc-500 dark:border-white/10">
        © {new Date().getFullYear()} Kartik Labhshetwar
      </footer>
    </main>
  </body>
</html>
```

- [ ] **Step 9: Create `src/pages/index.astro`** (placeholder; filled in Task 8)

```astro
---
import Base from '../layouts/Base.astro';
---
<Base>
  <h1 class="text-3xl font-semibold">Kartik Labhshetwar</h1>
  <p class="mt-2 text-zinc-600 dark:text-zinc-400">Rebuilding in Astro…</p>
</Base>
```

- [ ] **Step 10: Provide favicon** — copy the old icon: `cp legacy/src/app/icon.png public/favicon.png`

- [ ] **Step 11: Install and verify build + dev**

```bash
rm -rf node_modules bun.lock package-lock.json
npm install
npm run build
```
Expected: build succeeds, `dist/` produced. Then `npm run dev`, open `http://localhost:4321`, confirm the home placeholder renders and the theme toggle flips light/dark and persists on reload.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro + Tailwind v4 base layout, remove Next.js"
```

---

## Task 2: Content data (profile, projects, experience)

**Files:**
- Create: `src/data/profile.ts`, `src/data/projects.ts`, `src/data/experience.ts`
- Reference: `legacy/src/data/projects.ts`, `legacy/src/components/ExperienceContent.tsx`, `legacy/src/components/ProfileHeader.tsx`, `legacy/src/components/HomeContent.tsx`

**Interfaces:**
- Produces:
  - `export type Project = { id: string; title: string; description: string; users?: string; liveLink?: string; githubLink?: string }`
  - `export const projects: Project[]`
  - `export const profile: { name; role; bio; location; socials: {label;href}[]; resumeUrl? }`
  - `export const experience: { company; role; period; points: string[] }[]`

- [ ] **Step 1: Create `src/data/projects.ts`** — copy each entry from `legacy/src/data/projects.ts`, keeping only `id`, `title`, `description`, `liveLink`, `githubLink`; **drop** `video`, `image`, `longDescription`, `tags`, `tweetUrl`. Add an optional `users` string where you know one (e.g. a flagship product); omit otherwise.

```ts
export type Project = {
  id: string;
  title: string;
  description: string;
  users?: string;
  liveLink?: string;
  githubLink?: string;
};

export const projects: Project[] = [
  {
    id: 'bettershot',
    title: 'BetterShot',
    description: 'An open-source alternative to CleanShot X for macOS. Capture, edit, and enhance your screenshots.',
    liveLink: 'https://www.bettershot.site',
    githubLink: 'https://github.com/KartikLabhshetwar/better-shot',
  },
  // … port the remaining entries the same way (trimmed fields only)
];
```

- [ ] **Step 2: Create `src/data/profile.ts`** — extract name/bio/socials/links from `legacy/src/components/ProfileHeader.tsx` and `HomeContent.tsx`.

```ts
export const profile = {
  name: 'Kartik Labhshetwar',
  role: 'Software Engineer @ Mem0',
  bio: 'I build products and write about what I learn.', // refine from legacy copy
  location: 'India',
  resumeUrl: '', // fill if present in legacy
  socials: [
    { label: 'GitHub', href: 'https://github.com/KartikLabhshetwar' },
    { label: 'X', href: 'https://x.com/code_kartik' },
    // … port the rest from legacy
  ],
};
```

- [ ] **Step 3: Create `src/data/experience.ts`** — extract entries (incl. the recent Mem0 entries) from `legacy/src/components/ExperienceContent.tsx`.

```ts
export const experience = [
  {
    company: 'Mem0',
    role: 'Software Engineer',
    period: '2025 — present',
    points: [
      // … port bullet text from legacy ExperienceContent
    ],
  },
];
```

- [ ] **Step 4: Verify types**

```bash
npx astro check
```
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/data && git commit -m "feat: port content data (profile, projects, experience)"
```

---

## Task 3: GitHub library (build-time stars + sponsors) + Vitest

**Files:**
- Create: `src/lib/github.ts`, `tests/github.test.ts`, `vitest.config.ts`

**Interfaces:**
- Produces:
  - `parseRepo(url: string): { owner: string; repo: string } | null`
  - `fetchRepoStars(owner: string, repo: string): Promise<number>` (0 on failure)
  - `type Sponsor = { login: string; name: string; url: string; avatarUrl: string }`
  - `fetchSponsors(): Promise<Sponsor[]>` (`[]` if no token / on failure)

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node' } });
```

- [ ] **Step 2: Write failing tests `tests/github.test.ts`**

```ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseRepo, fetchRepoStars, fetchSponsors } from '../src/lib/github';

describe('parseRepo', () => {
  it('parses owner/repo from a github url', () => {
    expect(parseRepo('https://github.com/KartikLabhshetwar/better-shot')).toEqual({
      owner: 'KartikLabhshetwar', repo: 'better-shot',
    });
  });
  it('strips trailing slash and .git', () => {
    expect(parseRepo('https://github.com/a/b.git/')).toEqual({ owner: 'a', repo: 'b' });
  });
  it('returns null for non-repo urls', () => {
    expect(parseRepo('https://github.com/KartikLabhshetwar')).toBeNull();
  });
});

afterEach(() => vi.unstubAllGlobals());

describe('fetchRepoStars', () => {
  it('returns stargazers_count', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ stargazers_count: 42 }),
    }));
    expect(await fetchRepoStars('a', 'b')).toBe(42);
  });
  it('returns 0 on error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    expect(await fetchRepoStars('a', 'b')).toBe(0);
  });
});

describe('fetchSponsors', () => {
  it('maps graphql nodes to sponsors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { viewer: { sponsors: { nodes: [
        { login: 'octocat', name: 'The Octocat', url: 'https://github.com/octocat', avatarUrl: 'https://x/y.png' },
      ] } } } }),
    }));
    process.env.GITHUB_TOKEN = 'tok';
    const s = await fetchSponsors();
    expect(s).toEqual([{ login: 'octocat', name: 'The Octocat', url: 'https://github.com/octocat', avatarUrl: 'https://x/y.png' }]);
  });
  it('returns [] when no token', async () => {
    delete process.env.GITHUB_TOKEN;
    expect(await fetchSponsors()).toEqual([]);
  });
});
```

- [ ] **Step 3: Run tests — verify they fail**

```bash
npx vitest run tests/github.test.ts
```
Expected: FAIL (module not found / functions undefined).

- [ ] **Step 4: Implement `src/lib/github.ts`**

```ts
export type Sponsor = { login: string; name: string; url: string; avatarUrl: string };

export function parseRepo(url: string): { owner: string; repo: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!m) return null;
  const owner = m[1];
  const repo = m[2].replace(/\.git$/, '');
  if (!owner || !repo) return null;
  return { owner, repo };
}

export async function fetchRepoStars(owner: string, repo: string): Promise<number> {
  const headers: Record<string, string> = { 'User-Agent': 'portfolio' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

export async function fetchSponsors(): Promise<Sponsor[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];
  const query = `query {
    viewer { sponsors(first: 100) { nodes {
      __typename
      ... on User { login name url avatarUrl }
      ... on Organization { login name url avatarUrl }
    } } }
  }`;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'portfolio' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return [];
    const json = await res.json();
    const nodes = json?.data?.viewer?.sponsors?.nodes ?? [];
    return nodes
      .filter((n: any) => n && n.login)
      .map((n: any) => ({ login: n.login, name: n.name ?? n.login, url: n.url, avatarUrl: n.avatarUrl }));
  } catch {
    return [];
  }
}
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
npx vitest run tests/github.test.ts
```
Expected: PASS (8 assertions).

- [ ] **Step 6: Commit**

```bash
git add src/lib/github.ts tests/github.test.ts vitest.config.ts
git commit -m "feat: github lib for build-time stars and live sponsors"
```

---

## Task 4: Projects page (text cards + live stars)

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/pages/projects.astro`
- Consumes: `src/data/projects.ts`, `parseRepo`/`fetchRepoStars` from `src/lib/github.ts`

- [ ] **Step 1: Create `src/components/ProjectCard.astro`**

```astro
---
interface Props { title: string; description: string; users?: string; stars?: number; liveLink?: string; githubLink?: string; }
const { title, description, users, stars, liveLink, githubLink } = Astro.props;
---
<div class="border-b border-black/10 py-5 dark:border-white/10">
  <div class="flex items-baseline justify-between gap-3">
    <h3 class="font-semibold">{title}</h3>
    <div class="flex shrink-0 gap-3 text-xs text-zinc-500">
      {users && <span>{users} users</span>}
      {typeof stars === 'number' && stars > 0 && <span>★ {stars}</span>}
    </div>
  </div>
  <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
  <div class="mt-2 flex gap-4 text-xs">
    {liveLink && <a href={liveLink} target="_blank" rel="noopener" class="hover:underline">Live ↗</a>}
    {githubLink && <a href={githubLink} target="_blank" rel="noopener" class="hover:underline">GitHub ↗</a>}
  </div>
</div>
```

- [ ] **Step 2: Create `src/pages/projects.astro`** — fetch stars at build for all projects in parallel.

```astro
---
import Base from '../layouts/Base.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { projects } from '../data/projects';
import { parseRepo, fetchRepoStars } from '../lib/github';

const withStars = await Promise.all(projects.map(async (p) => {
  const r = p.githubLink ? parseRepo(p.githubLink) : null;
  const stars = r ? await fetchRepoStars(r.owner, r.repo) : 0;
  return { ...p, stars };
}));
---
<Base title="Projects — Kartik Labhshetwar">
  <h1 class="text-2xl font-semibold">Projects</h1>
  <div class="mt-6">
    {withStars.map((p) => <ProjectCard {...p} />)}
  </div>
</Base>
```

- [ ] **Step 3: Verify build + render**

```bash
GITHUB_TOKEN=$GITHUB_TOKEN npm run build && npm run preview
```
Open `/projects`. Expected: every project lists as a text card; star counts appear for repos (0/absent without a token — acceptable, they fill in once `GITHUB_TOKEN` is set). No images/videos/tags anywhere.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/projects.astro
git commit -m "feat: text-only projects page with build-time live stars"
```

---

## Task 5: Sponsors page (live)

**Files:**
- Create: `src/components/SponsorCard.astro`, `src/pages/sponsors.astro`
- Consumes: `fetchSponsors` from `src/lib/github.ts`

- [ ] **Step 1: Create `src/components/SponsorCard.astro`**

```astro
---
interface Props { name: string; login: string; url: string; avatarUrl: string; }
const { name, login, url, avatarUrl } = Astro.props;
---
<a href={url} target="_blank" rel="noopener"
   class="flex items-center gap-3 rounded-lg border border-black/10 p-3 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
  <img src={avatarUrl} alt={name} width="40" height="40" loading="lazy" class="h-10 w-10 rounded-full" />
  <div class="min-w-0">
    <div class="truncate text-sm font-medium">{name}</div>
    <div class="truncate text-xs text-zinc-500">@{login}</div>
  </div>
</a>
```

- [ ] **Step 2: Create `src/pages/sponsors.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import SponsorCard from '../components/SponsorCard.astro';
import { fetchSponsors } from '../lib/github';
const sponsors = await fetchSponsors();
const sponsorUrl = 'https://github.com/sponsors/KartikLabhshetwar';
---
<Base title="Sponsors — Kartik Labhshetwar">
  <h1 class="text-2xl font-semibold">Sponsors</h1>
  <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
    Thank you to everyone who supports my work. <a href={sponsorUrl} class="underline">Become a sponsor ↗</a>
  </p>
  {sponsors.length === 0
    ? <p class="mt-6 text-sm text-zinc-500">Be the first to sponsor.</p>
    : <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">{sponsors.map((s) => <SponsorCard {...s} />)}</div>}
</Base>
```

- [ ] **Step 3: Verify build**

```bash
GITHUB_TOKEN=$GITHUB_TOKEN npm run build && npm run preview
```
Open `/sponsors`. Expected: with a valid token, live sponsors render with avatars; without a token, the "Be the first" empty state shows. No `$` amounts, no Twitter.

- [ ] **Step 4: Commit**

```bash
git add src/components/SponsorCard.astro src/pages/sponsors.astro
git commit -m "feat: live sponsors page from GitHub Sponsors API"
```

---

## Task 6: Blog via Keystatic (Markdoc) + Cloudflare adapter

**Files:**
- Create: `keystatic.config.ts`, `src/content.config.ts`, `src/content/blog/hello-world.mdoc`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/components/BlogCard.astro`
- Modify: `astro.config.mjs`, `package.json`

> Before writing config, verify against `/thinkmill/keystatic` (Astro setup) and `/withastro/docs` (content collections + Cloudflare adapter). The shapes below match those docs as of this plan.

- [ ] **Step 1: Install deps**

```bash
npm install @keystatic/core @keystatic/astro @astrojs/react @astrojs/markdoc react react-dom
npx astro add cloudflare --yes
```

- [ ] **Step 2: Update `astro.config.mjs`** (adapter added by `astro add`; add integrations)

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://kartikk.tech',
  adapter: cloudflare(),
  integrations: [react(), markdoc(), keystatic()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Create `keystatic.config.ts`**

```ts
import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' }, // GitHub mode deferred (see Task 10 docs)
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        pubDate: fields.date({ label: 'Publish date', defaultValue: { kind: 'today' } }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
});
```

- [ ] **Step 4: Create `src/content.config.ts`** — glob loader over Keystatic's output.

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 5: Seed a post `src/content/blog/hello-world.mdoc`**

```markdown
---
title: Hello World
description: First post on my own blog.
pubDate: 2026-06-21
draft: false
---

# Hello

This blog now lives on my own site, written in Keystatic.
```

- [ ] **Step 6: Create `src/components/BlogCard.astro`**

```astro
---
interface Props { title: string; description: string; pubDate: Date; slug: string; }
const { title, description, pubDate, slug } = Astro.props;
---
<a href={`/blog/${slug}`} class="block border-b border-black/10 py-4 dark:border-white/10">
  <div class="flex items-baseline justify-between gap-3">
    <h3 class="font-medium">{title}</h3>
    <time class="shrink-0 text-xs text-zinc-500">{pubDate.toLocaleDateString()}</time>
  </div>
  <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
</a>
```

- [ ] **Step 7: Create `src/pages/blog/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import BlogCard from '../../components/BlogCard.astro';
import { getCollection } from 'astro:content';
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
---
<Base title="Blog — Kartik Labhshetwar">
  <h1 class="text-2xl font-semibold">Blog</h1>
  <div class="mt-6">
    {posts.map((p) => <BlogCard title={p.data.title} description={p.data.description} pubDate={p.data.pubDate} slug={p.id} />)}
  </div>
</Base>
```

- [ ] **Step 8: Create `src/pages/blog/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}
const { post } = Astro.props;
const { Content } = await render(post);
---
<Base title={`${post.data.title} — Kartik Labhshetwar`} description={post.data.description}>
  <article class="prose dark:prose-invert mt-6 max-w-none">
    <h1>{post.data.title}</h1>
    <Content />
  </article>
</Base>
```

- [ ] **Step 9: Verify CMS + blog render**

```bash
npm run dev
```
Open `http://localhost:4321/keystatic` → the admin UI loads and lists the Blog collection; edit a field and confirm it writes to `src/content/blog/`. Open `/blog` → "Hello World" listed; open the post → body renders. Then:
```bash
npm run build
```
Expected: build succeeds (markdoc page renders; Cloudflare worker output produced). If `render()` fails on `.mdoc`, confirm `@astrojs/markdoc` is in `integrations` and the glob `pattern` includes `mdoc`.

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: Keystatic blog (markdoc) + Cloudflare adapter"
```

---

## Task 7: Newsletter (embedded Buttondown)

**Files:**
- Create: `src/components/NewsletterForm.astro`
- Note: replace `BUTTONDOWN_USERNAME` with the user's real Buttondown username before deploy.

- [ ] **Step 1: Create `src/components/NewsletterForm.astro`** — plain HTML form POST (no JS, no CORS). Verify the endpoint/hidden-field against https://docs.buttondown.com/embedding before shipping.

```astro
---
const USERNAME = 'BUTTONDOWN_USERNAME'; // TODO: set real username
const action = `https://buttondown.com/api/emails/embed-subscribe/${USERNAME}`;
const archiveUrl = `https://buttondown.com/${USERNAME}/archive/`;
---
<section class="mt-12 rounded-lg border border-black/10 p-5 dark:border-white/10">
  <h2 class="font-semibold">Newsletter</h2>
  <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
    I share what I learn. <a href={archiveUrl} target="_blank" rel="noopener" class="underline">Read past issues ↗</a>
  </p>
  <form action={action} method="post" target="_blank" class="mt-3 flex gap-2">
    <input type="hidden" name="embed" value="1" />
    <input type="email" name="email" required placeholder="you@example.com"
      class="flex-1 rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/15" />
    <button type="submit" class="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-zinc-900">
      Subscribe
    </button>
  </form>
</section>
```

- [ ] **Step 2: Verify render**

```bash
npm run build && npm run preview
```
Expected: the form renders and validates email client-side. (Live subscription is verified after the real username is set + deploy.)

- [ ] **Step 3: Commit**

```bash
git add src/components/NewsletterForm.astro
git commit -m "feat: embedded Buttondown newsletter form"
```

---

## Task 8: Home page composition

**Files:**
- Modify: `src/pages/index.astro`
- Consumes: profile/projects/experience data, `parseRepo`/`fetchRepoStars`, `fetchSponsors`, `getCollection('blog')`, `ProjectCard`, `SponsorCard`, `BlogCard`, `NewsletterForm`, `VisitorCount` (added in Task 9 — leave its import commented until then or do Task 9 first).

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import ProjectCard from '../components/ProjectCard.astro';
import SponsorCard from '../components/SponsorCard.astro';
import BlogCard from '../components/BlogCard.astro';
import NewsletterForm from '../components/NewsletterForm.astro';
import { profile } from '../data/profile';
import { experience } from '../data/experience';
import { projects } from '../data/projects';
import { parseRepo, fetchRepoStars, fetchSponsors } from '../lib/github';
import { getCollection } from 'astro:content';

const featured = await Promise.all(projects.slice(0, 4).map(async (p) => {
  const r = p.githubLink ? parseRepo(p.githubLink) : null;
  return { ...p, stars: r ? await fetchRepoStars(r.owner, r.repo) : 0 };
}));
const sponsors = await fetchSponsors();
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()).slice(0, 3);
---
<Base>
  <section class="py-6">
    <h1 class="text-3xl font-semibold">{profile.name}</h1>
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">{profile.role}</p>
    <p class="mt-3 text-sm">{profile.bio}</p>
    <div class="mt-3 flex gap-4 text-sm">
      {profile.socials.map((s) => <a href={s.href} target="_blank" rel="noopener" class="hover:underline">{s.label}</a>)}
    </div>
  </section>

  <section class="mt-10">
    <h2 class="text-sm font-semibold uppercase tracking-wide text-zinc-500">Experience</h2>
    {experience.map((e) => (
      <div class="mt-3">
        <div class="flex items-baseline justify-between"><span class="font-medium">{e.role} · {e.company}</span><span class="text-xs text-zinc-500">{e.period}</span></div>
        <ul class="mt-1 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400">{e.points.map((pt) => <li>{pt}</li>)}</ul>
      </div>
    ))}
  </section>

  <section class="mt-10">
    <div class="flex items-baseline justify-between"><h2 class="text-sm font-semibold uppercase tracking-wide text-zinc-500">Projects</h2><a href="/projects" class="text-xs hover:underline">All →</a></div>
    <div class="mt-3">{featured.map((p) => <ProjectCard {...p} />)}</div>
  </section>

  <section class="mt-10">
    <div class="flex items-baseline justify-between"><h2 class="text-sm font-semibold uppercase tracking-wide text-zinc-500">Writing</h2><a href="/blog" class="text-xs hover:underline">All →</a></div>
    <div class="mt-3">{posts.map((p) => <BlogCard title={p.data.title} description={p.data.description} pubDate={p.data.pubDate} slug={p.id} />)}</div>
  </section>

  {sponsors.length > 0 && (
    <section class="mt-10">
      <div class="flex items-baseline justify-between"><h2 class="text-sm font-semibold uppercase tracking-wide text-zinc-500">Sponsors</h2><a href="/sponsors" class="text-xs hover:underline">All →</a></div>
      <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">{sponsors.slice(0, 4).map((s) => <SponsorCard {...s} />)}</div>
    </section>
  )}

  <NewsletterForm />
</Base>
```

- [ ] **Step 2: Verify build + render**

```bash
GITHUB_TOKEN=$GITHUB_TOKEN npm run build && npm run preview
```
Open `/`. Expected: hero, experience, 4 featured projects (with stars), latest posts, sponsors (if token), newsletter — all rendering, minimal styling, no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro && git commit -m "feat: compose minimal home page"
```

---

## Task 9: Visitor counter (Upstash) + endpoint

**Files:**
- Create: `src/lib/visitors.ts`, `src/pages/api/visitors.ts`, `src/components/VisitorCount.astro`, `tests/visitors.test.ts`
- Modify: `src/layouts/Base.astro` (show count in footer)
- Reference: `legacy/src/lib/visitors.ts`, `legacy/src/lib/fingerprint.ts`

**Interfaces:**
- Produces:
  - `type RedisEnv = { UPSTASH_REDIS_REST_URL?: string; UPSTASH_REDIS_REST_TOKEN?: string }`
  - `generateVisitorId(ip: string | null, userAgent: string | null, fingerprint?: string): string` (pure)
  - `getRedis(env: RedisEnv): Redis | null` (null when creds missing)
  - `trackVisit(redis: Redis, visitorId: string): Promise<{ uniqueVisitors: number }>`
  - `getVisitorStats(redis: Redis): Promise<{ uniqueVisitors: number }>`
  - Endpoint `GET /api/visitors` → `{ uniqueVisitors }`; `POST /api/visitors` (body `{ fingerprint? }`) → `{ uniqueVisitors }`. Reads Upstash creds from `locals.runtime.env` (Cloudflare runtime) with a `process.env` fallback (local dev/node) — `process.env` is NOT reliably populated at request time on Cloudflare.

- [ ] **Step 1: Install Upstash**

```bash
npm install @upstash/redis
```

- [ ] **Step 2: Write failing tests `tests/visitors.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest';
import { generateVisitorId, getRedis, trackVisit, getVisitorStats } from '../src/lib/visitors';

describe('generateVisitorId', () => {
  it('is stable for the same inputs', () => {
    expect(generateVisitorId('1.2.3.4', 'UA', 'fp')).toBe(generateVisitorId('1.2.3.4', 'UA', 'fp'));
  });
  it('differs for different inputs', () => {
    expect(generateVisitorId('1.1.1.1', 'UA')).not.toBe(generateVisitorId('2.2.2.2', 'UA'));
  });
});

describe('getRedis', () => {
  it('returns null when creds are missing', () => {
    expect(getRedis({})).toBeNull();
  });
  it('returns a client when creds are present', () => {
    expect(getRedis({ UPSTASH_REDIS_REST_URL: 'https://x', UPSTASH_REDIS_REST_TOKEN: 't' })).not.toBeNull();
  });
});

describe('visitor stats', () => {
  // Pass a fake redis instance — no need to mock the module.
  const redis = { sadd: vi.fn().mockResolvedValue(1), scard: vi.fn().mockResolvedValue(7) } as any;
  it('trackVisit adds the id and returns uniqueVisitors from scard', async () => {
    expect(await trackVisit(redis, 'id')).toEqual({ uniqueVisitors: 7 });
    expect(redis.sadd).toHaveBeenCalledWith('unique_visitors', 'id');
  });
  it('getVisitorStats returns uniqueVisitors', async () => {
    expect(await getVisitorStats(redis)).toEqual({ uniqueVisitors: 7 });
  });
});
```

- [ ] **Step 3: Run tests — verify they fail**

```bash
npx vitest run tests/visitors.test.ts
```
Expected: FAIL (module not found).

- [ ] **Step 4: Implement `src/lib/visitors.ts`**

```ts
import { Redis } from '@upstash/redis';

const KEY = 'unique_visitors';

export type RedisEnv = {
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
};

export function generateVisitorId(ip: string | null, userAgent: string | null, fingerprint?: string): string {
  const raw = `${ip ?? 'noip'}|${userAgent ?? 'noua'}|${fingerprint ?? 'nofp'}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) { h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0; }
  return `v_${(h >>> 0).toString(36)}`;
}

// Construct the Upstash client from request-time env. On Cloudflare, runtime
// secrets live on locals.runtime.env (NOT process.env), so the caller resolves
// the env and passes it in. Returns null when creds are absent so the endpoint
// can degrade gracefully instead of throwing at module load.
export function getRedis(env: RedisEnv): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN });
}

export async function trackVisit(redis: Redis, visitorId: string): Promise<{ uniqueVisitors: number }> {
  await redis.sadd(KEY, visitorId);
  const uniqueVisitors = await redis.scard(KEY);
  return { uniqueVisitors };
}

export async function getVisitorStats(redis: Redis): Promise<{ uniqueVisitors: number }> {
  const uniqueVisitors = await redis.scard(KEY);
  return { uniqueVisitors };
}
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
npx vitest run tests/visitors.test.ts
```
Expected: PASS.

- [ ] **Step 6: Create `src/pages/api/visitors.ts`** (the only request-time route)

```ts
import type { APIRoute } from 'astro';
import { generateVisitorId, getRedis, trackVisit, getVisitorStats, type RedisEnv } from '../../lib/visitors';

export const prerender = false;

// Cloudflare exposes runtime secrets on locals.runtime.env; fall back to
// process.env for local `astro dev` / node.
function resolveEnv(locals: App.Locals): RedisEnv {
  const runtimeEnv = (locals as { runtime?: { env?: RedisEnv } })?.runtime?.env;
  return runtimeEnv ?? (typeof process !== 'undefined' ? (process.env as RedisEnv) : {});
}

export const GET: APIRoute = async ({ locals }) => {
  const redis = getRedis(resolveEnv(locals));
  if (!redis) return Response.json({ success: false, uniqueVisitors: 0 });
  try {
    return Response.json({ success: true, ...(await getVisitorStats(redis)) });
  } catch {
    return Response.json({ success: false, uniqueVisitors: 0 }, { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals, clientAddress }) => {
  const redis = getRedis(resolveEnv(locals));
  if (!redis) return Response.json({ success: false, uniqueVisitors: 0 });
  try {
    const body = await request.json().catch(() => ({}));
    const ua = request.headers.get('user-agent');
    const id = generateVisitorId(clientAddress ?? null, ua, body.fingerprint);
    return Response.json({ success: true, ...(await trackVisit(redis, id)) });
  } catch {
    return Response.json({ success: false, uniqueVisitors: 0 }, { status: 500 });
  }
};
```

- [ ] **Step 7: Create `src/components/VisitorCount.astro`** (vanilla fetch, no React)

```astro
<span class="text-xs text-zinc-500">👀 <span id="visitor-count">—</span> visitors</span>
<script>
  (async () => {
    const el = document.getElementById('visitor-count');
    try {
      const res = await fetch('/api/visitors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await res.json();
      if (el && typeof data.uniqueVisitors === 'number') el.textContent = data.uniqueVisitors.toLocaleString();
    } catch {}
  })();
</script>
```

- [ ] **Step 8: Add `VisitorCount` to the footer in `src/layouts/Base.astro`**

Replace the footer line with:
```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import VisitorCount from '../components/VisitorCount.astro';
const { title = 'Kartik Labhshetwar', description = 'Developer, builder.' } = Astro.props;
---
```
and inside `<footer>`:
```astro
      <footer class="mt-20 flex items-center justify-between border-t border-black/10 py-8 text-sm text-zinc-500 dark:border-white/10">
        <span>© {new Date().getFullYear()} Kartik Labhshetwar</span>
        <VisitorCount />
      </footer>
```

- [ ] **Step 9: Verify tests + endpoint + build**

Run `npx vitest run tests/visitors.test.ts` → expect PASS (6 tests).

The repo `.env` already has `UPSTASH_REDIS_REST_URL`/`_TOKEN`; the Cloudflare adapter's dev platform proxy surfaces them on `locals.runtime.env`. Start `npm run dev` IN THE BACKGROUND (never foreground), wait ~3s, then:
```bash
curl -s -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:4321/api/visitors
```
Expect `{"success":true,"uniqueVisitors":N}` (a real Upstash hit — adds one test id, harmless). KILL the dev server. Then `npm run build` is the final gate (if it errors with `.vite/deps_ssr/chunk... does not exist`, run `rm -rf node_modules/.vite` and rebuild; the endpoint is the only on-demand route).

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: Upstash visitor counter endpoint + footer display"
```

---

## Task 10: Deploy config, cleanup, docs

**Files:**
- Modify/verify: `wrangler.jsonc` (created by `astro add cloudflare`), `.gitignore`
- Create: `README.md` (deploy + env + CMS docs)
- Delete: `legacy/`, leftover `tsconfig.tsbuildinfo`, `fonts/`, unused `public/` assets

- [ ] **Step 1: Verify `wrangler.jsonc`** has `nodejs_compat` and the assets binding (see https://docs.astro.build/en/guides/deploy/cloudflare/). Example shape:

```jsonc
{
  "name": "portfolio",
  "main": "./dist/_worker.js/index.js",
  "compatibility_date": "2026-06-21",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "binding": "ASSETS", "directory": "./dist" }
}
```

- [ ] **Step 2: Update `.gitignore`** — ensure `dist`, `.astro`, `node_modules`, `.env`, `.wrangler` are ignored.

- [ ] **Step 3: Delete legacy + unused assets**

```bash
rm -rf legacy fonts tsconfig.tsbuildinfo
# review public/ and remove any leftover unused images (keep favicon, og image, robots.txt, profile photo)
```

- [ ] **Step 4: Write `README.md`** with these sections (fill the bracketed values):
  - **Stack:** Astro + Tailwind v4 + Keystatic + Cloudflare.
  - **Develop:** `npm install`, `npm run dev`; CMS at `/keystatic` (local mode → edits commit to `src/content/blog/`).
  - **Env vars:** build-time `GITHUB_TOKEN` (classic PAT, `read:user`); runtime `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. Set Buttondown username in `src/components/NewsletterForm.astro`.
  - **Deploy (Cloudflare):** connect the GitHub repo in Cloudflare → Workers & Pages; build command `npm run build`; set the env vars in the dashboard (mark `GITHUB_TOKEN` as available at build, Upstash as runtime secrets). Or `npx wrangler deploy`.
  - **Sponsors/stars freshness:** baked at build → refresh on each deploy. (Optional later: a daily Cloudflare deploy hook.)
  - **CMS on the deployed site (deferred):** switch `keystatic.config.ts` storage to `{ kind: 'github', repo: { owner, name } }`, create a GitHub App, add `KEYSTATIC_GITHUB_CLIENT_ID/SECRET` + `KEYSTATIC_SECRET`. See https://keystatic.com/docs/github-mode.

- [ ] **Step 5: Final full build + tests**

```bash
GITHUB_TOKEN=$GITHUB_TOKEN npm run build && npx vitest run
npx wrangler deploy --dry-run --outdir dist-dryrun 2>/dev/null || echo "dry-run optional (needs wrangler login)"
```
Expected: build succeeds; all tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: Cloudflare deploy config, docs, remove legacy"
```

---

## Self-Review

**Spec coverage:**
- Port Next→Astro → Tasks 1–9. ✓
- Deploy on Cloudflare → Tasks 6 (adapter) + 10 (wrangler/docs). ✓
- Blog CMS (Keystatic) → Task 6. ✓
- Live sponsors → Tasks 3 + 5. ✓
- Text-only project cards (name/users/stars/desc) → Tasks 2 + 4. ✓
- Manual `users` field → Task 2 type + Task 4 display. ✓
- Keep visitor counter only → Task 9; others intentionally not ported. ✓
- Newsletter (embedded Buttondown) → Task 7. ✓
- Minimal (drop video/images/animations/oneko/marquee/calendar) → Task 1 deletions + lean components throughout. ✓
- Secrets (GITHUB_TOKEN build, Upstash runtime, Buttondown username) → Task 10 docs + used in Tasks 3/9/7. ✓

**Type consistency:** `Project`, `Sponsor`, `parseRepo`/`fetchRepoStars`/`fetchSponsors`, `generateVisitorId`/`trackVisit`/`getVisitorStats` names + signatures match across tasks. Blog entry `id` used as slug consistently (`getStaticPaths` + `BlogCard`). ✓

**Open verifications (flagged inline, not blockers):** Keystatic markdoc `render()` over `.mdoc` (Task 6 Step 9 fallback), exact Buttondown hidden-field/endpoint (Task 7 Step 1), `wrangler.jsonc` shape from current Astro docs (Task 10 Step 1).
