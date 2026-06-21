# Portfolio

Personal portfolio site for Kartik Labhshetwar — built with Astro 6, Tailwind v4, Keystatic CMS, and deployed on Cloudflare Workers.

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6 (hybrid output: static prerender + CF Workers SSR) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` (pinned 4.1.8) |
| CMS | Keystatic (local mode in dev; GitHub mode in production — see below) |
| Deploy | Cloudflare Workers + Assets |
| Visitor counter | Upstash Redis (REST API, accessed at runtime via CF env) |
| Newsletter | Buttondown embed form |
| Stars / Sponsors | Fetched from GitHub API at build time |

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
# CMS (local mode): http://localhost:4321/keystatic
```

Keystatic in local mode reads and writes directly to `src/content/blog/`. Each new post creates a `src/content/blog/<slug>/index.mdoc` file that you can commit to git.

### Buttondown username

The newsletter form is in `src/components/NewsletterForm.astro`. Set the `USERNAME` constant at the top of that file to your Buttondown account username:

```js
const USERNAME = 'your-buttondown-username';
```

## Environment variables

### Build-time (set in Cloudflare dashboard under "Environment variables" for the Workers & Pages project)

| Variable | Description |
|---|---|
| `GITHUB_TOKEN` | Classic Personal Access Token with `read:user` scope. Used at build time to fetch live sponsors and repository star counts. |

### Runtime (set in Cloudflare dashboard under "Settings → Variables and Secrets" — mark as encrypted secrets)

| Variable | Description |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL (from Upstash console). |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token. |

Runtime secrets are accessed through `locals.runtime.env` (Cloudflare Workers binding), not `process.env`. They must be set in the Cloudflare dashboard; they are not read from `.env` files in production.

For local development, create a `.dev.vars` file in the project root (gitignored):

```
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

## Deploy to Cloudflare Workers

### Via Cloudflare dashboard (recommended)

1. Push this repo to GitHub.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com/), go to **Workers & Pages → Create**.
3. Connect your GitHub account and select this repository.
4. Set the build command to `npm run build` and leave the output directory blank (wrangler handles it).
5. Add the environment variables listed above under **Settings → Variables and Secrets**.
6. Deploy. Cloudflare will build and publish on every push to `main`.

### Via Wrangler CLI

```bash
npx wrangler deploy
```

Requires `wrangler login` first. The `wrangler.jsonc` at the project root contains the full configuration.

## Sponsors and stars freshness

GitHub sponsors and repository star counts are fetched at **build time** and baked into the static HTML. They are refreshed on every deploy.

To keep them fresh without code changes: add a **Cloudflare Deploy Hook** (under Workers & Pages → Settings → Build → Deploy Hooks) and trigger it via a daily cron job or GitHub Actions schedule.

## Blog CMS in production (Keystatic GitHub mode — deferred)

By default, Keystatic runs in local mode (edits write directly to the filesystem). To enable the live `/keystatic` admin UI on the deployed site:

1. Switch `keystatic.config.ts` storage to GitHub mode:
   ```ts
   storage: { kind: 'github', repo: { owner: 'your-github-handle', name: 'portfolio' } }
   ```
2. Create a GitHub App and configure OAuth credentials.
3. Add these secrets in the Cloudflare dashboard:
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET` (random 32+ char string)

Full guide: https://keystatic.com/docs/github-mode

## Local build note

Running `astro check`, `astro dev`, and `astro build` back-to-back can leave a stale Vite SSR dep cache that causes a `virtual:keystatic-config` resolution error. Clear it before a clean build:

```bash
rm -rf node_modules/.vite && npm run build
```

CI is unaffected (starts with a clean cache each run).
