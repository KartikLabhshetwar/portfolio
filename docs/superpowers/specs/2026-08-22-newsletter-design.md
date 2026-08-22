# Newsletter — design

Date: 2026-08-22
Status: approved for planning

## Goal

Capture emails on `kartiklabhshetwar.com`, send blog posts as email, keep the
site as the canonical home for every post. One source of truth: the `.mdoc`
already in this repo.

## What already exists (do not rebuild)

- **Keystatic CMS** — `keystatic.config.ts`, served at `/keystatic`. Blog
  collection writes `src/content/blog/<slug>/index.mdoc`.
- **Blog rendering** — `src/pages/blog/index.astro`, `blog/[slug].astro`.
- **Rate limiter** — `src/lib/ratelimit.ts` (fixed window, Upstash).
- **Redis client factory** — `getRedis()` in `src/lib/visitors.ts`.
- **A prior subscribe route** — deleted in `ddb027b`, recoverable from git.
  Its shape (validation, rate limiting, JSON+form parsing, graceful degrade) is
  sound and gets reused; only the provider call changes.

## Decisions

**Provider: Kit (ConvertKit) v4.** Free to 10,000 subscribers, which covers the
whole stated goal. Auth is a `X-Kit-Api-Key` header. Limit 120 req/60s — our
per-IP brake (5 per 10 min) keeps us orders of magnitude under.

**Broadcasts are created as drafts** (`send_at: null`). You review in Kit and
press send. This is the single most important decision in the design:

- It is the human gate before 10,000 inboxes.
- It makes double-sends structurally impossible, so there is no "already sent"
  ledger, no idempotency key, no dedup table. Running the script twice leaves
  two drafts; you delete one.

**Opt-in policy is not encoded in code.** Kit's *form* owns whether
confirmation is single or double. The route posts to a form either way, so
flipping the policy is a toggle in Kit's dashboard, not a deploy.

**`public: true` on every broadcast.** Publishes it to the Kit Creator Profile
feed, which is what feeds Creator Network recommendations. Free growth, same
API call.

**No new dependencies.** `@markdoc/markdoc` and `yaml` are already in the tree
via `@astrojs/markdoc` / `astro`. Both get promoted to direct dependencies
because we import them directly and pnpm's strict layout should not be relied
on to keep hoisting transitive packages.

**Substack is removed.** It is three lines in `NewsletterForm.astro` and
nothing else references it.

## Architecture

Shell/core split. Everything with I/O is a thin shell; all logic is pure and
unit-testable without a network.

```
core (pure, tested)                shells (I/O)
───────────────────                ────────────
src/lib/post-email.ts   ◄────────  scripts/send-newsletter.ts   (CLI)
src/lib/kit.ts          ◄────────  src/pages/api/subscribe.ts   (HTTP)
src/lib/env.ts          ◄────────  src/pages/api/visitors.ts    (existing)
```

### `src/lib/env.ts` (new)

```ts
resolveEnv<T>(): Promise<T>
```

The `try { import('cloudflare:workers') } catch { process.env }` dance is
currently copy-pasted in `api/visitors.ts` and was copy-pasted again in the
deleted `subscribe.ts`. A third copy justifies extracting it. `visitors.ts` is
migrated to use it so there is exactly one definition.

### `src/lib/kit.ts` (new)

Pure transport over `fetch`. No Astro, no Cloudflare imports, no env reads of
its own — the caller passes credentials in.

```ts
type KitEnv = { KIT_API_KEY?: string; KIT_FORM_ID?: string }

subscribe(env, { email, referrer?, ip? })
  → { ok: true } | { ok: true, already: true } | { ok: false, error, status }

createBroadcastDraft(env, { subject, previewText, html, publishedAt })
  → { ok: true, id, url } | { ok: false, error }
```

`subscribe` is two calls, because Kit requires it: `POST /v4/subscribers`
upserts the person, then `POST /v4/forms/{form_id}/subscribers` associates them
with the form and triggers confirmation when the form is double opt-in.

`createBroadcastDraft` posts to `POST /v4/broadcasts` with `send_at: null` and
`public: true`.

### `src/lib/post-email.ts` (new)

Pure function, zero I/O. The riskiest logic in the system — a bug here is
invisible until it is in 10,000 inboxes — so it is isolated and tested.

```ts
postToEmail({ title, description, body, slug }, baseUrl)
  → { subject, previewText, html }
```

- `subject` ← post title. `previewText` ← post description.
- Body markdoc → HTML via `Markdoc.renderers.html(Markdoc.transform(parse(body)))`.
  Kit wraps this in its own email template, so we emit clean semantic HTML and
  build no template and inline no CSS.
- **Relative URLs are rewritten to absolute.** `/blog/x` and `./img.png` are
  fine on the web and broken in email. This is the one transform that must not
  be skipped.
- Appends a "Read this on the web →" link to the canonical post URL. This is
  the "redirected to a website" half of the requirement.

### `src/pages/api/subscribe.ts` (restored, retargeted)

Recovered from `ddb027b^` and edited: Buttondown call swapped for
`kit.subscribe`, env resolution swapped for `lib/env`. Everything else — the
linear email regex, JSON-or-form-encoded body reading, per-IP rate limiting via
the existing Upstash client, graceful 503 when unconfigured — is kept as-is.

### `scripts/send-newsletter.ts` (new)

```
pnpm newsletter <slug>
```

Reads `src/content/blog/<slug>/index.mdoc` directly from disk (a plain Node
script cannot use `astro:content`), splits frontmatter with markdoc's parser,
parses it with `yaml`, calls `postToEmail`, calls `createBroadcastDraft`, prints
the Kit URL to open.

Refuses to run when `draft: true`.

### `src/components/NewsletterForm.astro` (rewritten)

Form restored from `ddb027b^` — email input, progressive-enhancement script,
`aria-live` status line, works without JS via a plain form POST. Substack link
deleted. Both call sites (`index.astro:64`, `blog/[slug].astro:54`) keep their
existing props.

## Env vars

| Var | Where | Purpose |
|---|---|---|
| `KIT_API_KEY` | runtime + script | Kit v4 auth |
| `KIT_FORM_ID` | runtime | Which Kit form new subscribers join |

Added to `.env.example`. Absent → the route returns a graceful "not configured"
503 rather than throwing, matching how every other optional feature here
degrades.

## Testing

Following the existing style in `tests/` — fake objects passed in, no module
mocking.

- `tests/post-email.test.ts` — markdoc renders expected HTML; relative links
  and images become absolute; absolute URLs are left alone; subject/preview
  come from frontmatter; the read-on-web link is present.
- `tests/kit.test.ts` — fake `fetch`. Subscribe sends the right header and
  body; a duplicate is reported as success-already, not as an error; a real
  failure surfaces its message. Broadcast payload carries `send_at: null` and
  `public: true`.

`pnpm check` must stay clean.

## Deliberately not built

- **Auto-send on merge.** The draft gate is the point. Revisit after ~20 issues
  of muscle memory.
- **Notion sync.** A Notion→markdoc converter (callouts, toggles, nested lists,
  image re-hosting) is more code than everything above combined, and it buys one
  copy-paste per post. Purely additive later — it drops in front of this
  pipeline without changing it.
- **A sent-posts ledger.** Draft-first makes it unnecessary.
- **A custom email template.** Kit's template does it.

## Open question, resolved live

Kit's `POST /v4/subscribers` defaults to `state: active`. Whether the
subsequent double-opt-in form association correctly gates activation needs one
real test against the account rather than trust in the docs. If it does not
gate, the fix is creating with `state: 'inactive'`. Verified during
implementation, not assumed.
