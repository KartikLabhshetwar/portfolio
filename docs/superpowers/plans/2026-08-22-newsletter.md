# Newsletter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture emails on the site and send blog posts as Kit broadcasts, with the repo's `.mdoc` as the single source of truth.

**Architecture:** Shell/core split. Three pure, unit-tested core modules (`env`, `kit`, `post-email`) with zero Astro or Cloudflare imports, consumed by two thin I/O shells: an Astro API route for subscribing and a Node CLI for drafting broadcasts. Broadcasts are always created as drafts, so sending stays a human action in Kit's UI.

**Tech Stack:** Astro 6 (Cloudflare adapter), Kit v4 REST API, `@markdoc/markdoc` (already in tree), `yaml` (already in tree), vitest, Node 26 native type stripping.

**Spec:** `docs/superpowers/specs/2026-08-22-newsletter-design.md`

## Global Constraints

- Package manager is **pnpm**. Never run `npm install` or `bun install`.
- **No new third-party dependencies.** `@markdoc/markdoc` and `yaml` are already in the tree and get promoted to direct deps only because we import them directly.
- **No code comments explaining what code does** (user global rule). Comments are permitted only to explain *why* a non-obvious choice was made, matching the existing style in `src/lib/visitors.ts`.
- **No em-dashes** in code or prose.
- **No `console.*` in `src/`.** The CLI script in `scripts/` is exempt, it is a CLI and must print.
- Never log secret values. Log `Boolean(value)` if a secret must be debugged.
- Commits are conventional (`feat:`, `fix:`, `refactor:`), no AI attribution footer.
- Every optional feature degrades gracefully when its env vars are absent.
- Kit auth header is exactly `X-Kit-Api-Key`. Kit API base is `https://api.kit.com/v4`.
- `pnpm check` must pass at the end of every task.

---

### Task 1: Shared runtime env resolver

Extracts the Cloudflare-vs-Node env dance that is currently duplicated in `src/pages/api/visitors.ts` and was duplicated again in the deleted `src/pages/api/subscribe.ts`. Task 4 needs a third copy, which is what justifies extracting it now.

**Files:**
- Create: `src/lib/env.ts`
- Modify: `src/pages/api/visitors.ts:8-16` (replace local `resolveEnv` with the import)

**Interfaces:**
- Consumes: nothing
- Produces: `resolveEnv<T>(): Promise<T>` from `src/lib/env.ts`

- [ ] **Step 1: Create the module**

```ts
// src/lib/env.ts

// On Cloudflare, runtime secrets live in the `cloudflare:workers` env module
// (prod and dev-via-workerd alike) rather than process.env. Plain Node has no
// such module, so scripts and vitest fall back to process.env.
export async function resolveEnv<T>(): Promise<T> {
  try {
    const m: any = await import('cloudflare:workers' as any);
    return m.env as T;
  } catch {
    return (typeof process !== 'undefined' ? process.env : {}) as T;
  }
}
```

- [ ] **Step 2: Migrate the existing caller**

In `src/pages/api/visitors.ts`, delete the local `resolveEnv` function and its comment block, then add the import:

```ts
import { resolveEnv } from '../../lib/env';
```

Change both call sites from `await resolveEnv()` to `await resolveEnv<RedisEnv>()`.

- [ ] **Step 3: Verify nothing broke**

Run: `pnpm test && pnpm check`
Expected: all existing tests pass, no type errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/env.ts src/pages/api/visitors.ts
git commit -m "refactor: extract shared runtime env resolver"
```

---

### Task 2: Kit API client

Pure transport. No Astro, no Cloudflare, no env reads of its own, so it is testable with a fake `fetch` and reusable by both the HTTP route (Task 4) and the CLI (Task 5).

Note on duplicates: Kit's `POST /v4/subscribers` is an **upsert**, so resubscribing is a 200, not an error. Unlike the old Buttondown code there is no duplicate branch to detect and no `already` flag to return. Kit also suppresses repeat confirmation emails for subscribers already on the form.

**Files:**
- Create: `src/lib/kit.ts`
- Test: `tests/kit.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type KitEnv = { KIT_API_KEY?: string; KIT_FORM_ID?: string }`
  - `subscribe(env: KitEnv, input: { email: string; referrer?: string; ip?: string }): Promise<KitResult>`
  - `createBroadcastDraft(env: KitEnv, input: { subject: string; previewText: string; html: string; publishedAt?: string }): Promise<KitResult & { id?: number; url?: string }>`
  - `type KitResult = { ok: true } | { ok: false; error: string; status: number }`

- [ ] **Step 1: Write the failing test**

```ts
// tests/kit.test.ts
import { describe, it, expect, vi } from 'vitest';
import { subscribe, createBroadcastDraft } from '../src/lib/kit';

const env = { KIT_API_KEY: 'k123', KIT_FORM_ID: '99' };

// Queue of responses, one per fetch call, in order.
const fakeFetch = (...responses: Array<{ status: number; body: unknown }>) => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fn = vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const r = responses.shift() ?? { status: 200, body: {} };
    return new Response(JSON.stringify(r.body), { status: r.status });
  });
  return { fn, calls };
};

const bodyOf = (init: RequestInit) => JSON.parse(init.body as string);

describe('subscribe', () => {
  it('creates the subscriber then adds them to the form', async () => {
    const { fn, calls } = fakeFetch(
      { status: 200, body: { subscriber: { id: 1 } } },
      { status: 200, body: { subscriber: { id: 1 } } },
    );
    const res = await subscribe(env, { email: 'a@b.com', referrer: 'https://site/x', ip: '1.2.3.4' }, fn as any);

    expect(res).toEqual({ ok: true });
    expect(calls).toHaveLength(2);
    expect(calls[0].url).toBe('https://api.kit.com/v4/subscribers');
    expect((calls[0].init.headers as any)['X-Kit-Api-Key']).toBe('k123');
    expect(bodyOf(calls[0].init).email_address).toBe('a@b.com');
    expect(calls[1].url).toBe('https://api.kit.com/v4/forms/99/subscribers');
    expect(bodyOf(calls[1].init).referrer).toBe('https://site/x');
  });

  it('treats a resubscribe as success because Kit upserts', async () => {
    const { fn } = fakeFetch(
      { status: 200, body: { subscriber: { id: 1 } } },
      { status: 200, body: { subscriber: { id: 1 } } },
    );
    expect(await subscribe(env, { email: 'a@b.com' }, fn as any)).toEqual({ ok: true });
  });

  it('surfaces a Kit error message', async () => {
    const { fn } = fakeFetch({ status: 401, body: { errors: ['Invalid API key'] } });
    expect(await subscribe(env, { email: 'a@b.com' }, fn as any)).toEqual({
      ok: false, error: 'Invalid API key', status: 401,
    });
  });

  it('reports missing configuration without calling the network', async () => {
    const { fn, calls } = fakeFetch();
    const res = await subscribe({}, { email: 'a@b.com' }, fn as any);
    expect(res).toEqual({ ok: false, error: 'Newsletter is not configured.', status: 503 });
    expect(calls).toHaveLength(0);
  });
});

describe('createBroadcastDraft', () => {
  it('posts a draft that is public and unscheduled', async () => {
    const { fn, calls } = fakeFetch({
      status: 201,
      body: { broadcast: { id: 64, public_url: 'https://kit.com/posts/64' } },
    });
    const res = await createBroadcastDraft(env, {
      subject: 'Hello', previewText: 'Preview', html: '<p>Hi</p>', publishedAt: '2026-01-01T00:00:00Z',
    }, fn as any);

    expect(res).toEqual({ ok: true, id: 64, url: 'https://kit.com/posts/64' });
    const sent = bodyOf(calls[0].init);
    expect(sent.send_at).toBeNull();
    expect(sent.public).toBe(true);
    expect(sent.subject).toBe('Hello');
    expect(sent.content).toBe('<p>Hi</p>');
  });

  it('surfaces a failure', async () => {
    const { fn } = fakeFetch({ status: 422, body: { errors: ['Subject required'] } });
    const res = await createBroadcastDraft(env, { subject: '', previewText: '', html: '' }, fn as any);
    expect(res).toEqual({ ok: false, error: 'Subject required', status: 422 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/kit.test.ts`
Expected: FAIL, cannot resolve `../src/lib/kit`.

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/kit.ts

const API = 'https://api.kit.com/v4';

export type KitEnv = { KIT_API_KEY?: string; KIT_FORM_ID?: string };

export type KitResult = { ok: true } | { ok: false; error: string; status: number };

type Fetch = typeof fetch;

const NOT_CONFIGURED = { ok: false, error: 'Newsletter is not configured.', status: 503 } as const;

function headers(apiKey: string) {
  return { 'X-Kit-Api-Key': apiKey, 'Content-Type': 'application/json' };
}

// Kit v4 returns { errors: [...] } on failure. Fall back to the status text so a
// gateway error or an HTML error page still produces something readable.
async function errorFrom(res: Response): Promise<{ ok: false; error: string; status: number }> {
  const body = (await res.json().catch(() => ({}))) as { errors?: string[] };
  return { ok: false, error: body.errors?.[0] ?? `Kit request failed (${res.status})`, status: res.status };
}

export async function subscribe(
  env: KitEnv,
  input: { email: string; referrer?: string; ip?: string },
  doFetch: Fetch = fetch,
): Promise<KitResult> {
  if (!env.KIT_API_KEY || !env.KIT_FORM_ID) return NOT_CONFIGURED;

  // Two calls because Kit requires it: the form endpoint only accepts subscribers
  // that already exist. Whether the second call sends a confirmation email is a
  // property of the form in Kit's dashboard, not of this request, so single vs
  // double opt-in is a toggle there rather than a deploy here.
  const created = await doFetch(`${API}/subscribers`, {
    method: 'POST',
    headers: headers(env.KIT_API_KEY),
    body: JSON.stringify({ email_address: input.email }),
  });
  if (!created.ok) return errorFrom(created);

  const added = await doFetch(`${API}/forms/${env.KIT_FORM_ID}/subscribers`, {
    method: 'POST',
    headers: headers(env.KIT_API_KEY),
    body: JSON.stringify({ email_address: input.email, ...(input.referrer ? { referrer: input.referrer } : {}) }),
  });
  if (!added.ok) return errorFrom(added);

  return { ok: true };
}

export async function createBroadcastDraft(
  env: KitEnv,
  input: { subject: string; previewText: string; html: string; publishedAt?: string },
  doFetch: Fetch = fetch,
): Promise<KitResult & { id?: number; url?: string }> {
  if (!env.KIT_API_KEY) return NOT_CONFIGURED;

  // send_at: null makes this a draft. That is the human gate before the list gets
  // mailed, and it is why nothing here needs an idempotency key: running twice
  // leaves two drafts, not two sends. public: true also posts it to the Kit
  // Creator Profile feed, which is what feeds Creator Network recommendations.
  const res = await doFetch(`${API}/broadcasts`, {
    method: 'POST',
    headers: headers(env.KIT_API_KEY),
    body: JSON.stringify({
      subject: input.subject,
      preview_text: input.previewText,
      content: input.html,
      public: true,
      send_at: null,
      ...(input.publishedAt ? { published_at: input.publishedAt } : {}),
    }),
  });
  if (!res.ok) return errorFrom(res);

  const body = (await res.json().catch(() => ({}))) as { broadcast?: { id: number; public_url: string } };
  return { ok: true, id: body.broadcast?.id, url: body.broadcast?.public_url };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm vitest run tests/kit.test.ts && pnpm check`
Expected: PASS, no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kit.ts tests/kit.test.ts
git commit -m "feat: add Kit API client for subscribes and broadcast drafts"
```

---

### Task 3: Post to email conversion

The riskiest logic in the system. A bug here is invisible until it is in thousands of inboxes, so it is a pure function with no I/O and it is tested hard.

**Files:**
- Create: `src/lib/post-email.ts`
- Test: `tests/post-email.test.ts`
- Modify: `package.json` (add `@markdoc/markdoc` to `dependencies`)

**Interfaces:**
- Consumes: nothing
- Produces:
  - `type PostInput = { title: string; description: string; body: string; slug: string }`
  - `type PostEmail = { subject: string; previewText: string; html: string }`
  - `postToEmail(post: PostInput, baseUrl: string): PostEmail`

- [ ] **Step 1: Declare the direct dependency**

`@markdoc/markdoc` currently resolves only because pnpm happens to surface it from `@astrojs/markdoc`. We import it directly, so declare it directly.

Run: `pnpm add @markdoc/markdoc`

- [ ] **Step 2: Write the failing test**

```ts
// tests/post-email.test.ts
import { describe, it, expect } from 'vitest';
import { postToEmail } from '../src/lib/post-email';

const base = 'https://kartiklabhshetwar.com';
const post = (body: string) => ({ title: 'My Post', description: 'A short description.', body, slug: 'my-post' });

describe('postToEmail', () => {
  it('takes subject and preview text from the frontmatter fields', () => {
    const email = postToEmail(post('Hello.'), base);
    expect(email.subject).toBe('My Post');
    expect(email.previewText).toBe('A short description.');
  });

  it('renders markdoc to semantic html', () => {
    const email = postToEmail(post('## Heading\n\nSome **bold** text.\n\n- one\n- two'), base);
    expect(email.html).toContain('<h2>Heading</h2>');
    expect(email.html).toContain('<strong>bold</strong>');
    expect(email.html).toContain('<li>one</li>');
  });

  it('rewrites root-relative links to absolute so they work in email', () => {
    const email = postToEmail(post('See [my other post](/blog/other).'), base);
    expect(email.html).toContain(`href="${base}/blog/other"`);
  });

  it('rewrites root-relative image sources', () => {
    const email = postToEmail(post('![alt](/images/diagram.png)'), base);
    expect(email.html).toContain(`src="${base}/images/diagram.png"`);
  });

  it('leaves absolute and protocol-relative urls alone', () => {
    const email = postToEmail(post('[x](https://example.com/a) and [y](//cdn.example.com/b)'), base);
    expect(email.html).toContain('href="https://example.com/a"');
    expect(email.html).toContain('href="//cdn.example.com/b"');
    expect(email.html).not.toContain(`href="${base}//cdn`);
  });

  it('appends a link back to the canonical post url', () => {
    const email = postToEmail(post('Body.'), base);
    expect(email.html).toContain(`href="${base}/blog/my-post"`);
    expect(email.html).toContain('Read this on the web');
  });

  it('tolerates a trailing slash on the base url', () => {
    const email = postToEmail(post('[x](/blog/other)'), 'https://kartiklabhshetwar.com/');
    expect(email.html).toContain(`href="${base}/blog/other"`);
    expect(email.html).not.toContain('.com//');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm vitest run tests/post-email.test.ts`
Expected: FAIL, cannot resolve `../src/lib/post-email`.

- [ ] **Step 4: Write the implementation**

```ts
// src/lib/post-email.ts
import Markdoc from '@markdoc/markdoc';

export type PostInput = { title: string; description: string; body: string; slug: string };
export type PostEmail = { subject: string; previewText: string; html: string };

// Root-relative only, and `(?!\/)` keeps protocol-relative `//cdn.example.com`
// out of it.
//
// ponytail: post-local relative paths (`./diagram.png`) are not rewritten,
// because resolving them means knowing where Astro's asset pipeline will emit
// them and this script reads the raw .mdoc instead. Use root-relative or
// absolute URLs for images in posts. Revisit if that ever bites.
const RELATIVE_URL = /\b(href|src)="\/(?!\/)([^"]*)"/g;

function absolutize(html: string, base: string): string {
  return html.replace(RELATIVE_URL, (_m, attr, path) => `${attr}="${base}/${path}"`);
}

export function postToEmail(post: PostInput, baseUrl: string): PostEmail {
  const base = baseUrl.replace(/\/$/, '');
  const url = `${base}/blog/${post.slug}`;

  // Kit wraps this in its own email template, so plain semantic HTML is all we
  // owe it. No template to build, no CSS to inline.
  const rendered = Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(post.body)));

  return {
    subject: post.title,
    previewText: post.description,
    html: `${absolutize(rendered, base)}\n<p><a href="${url}">Read this on the web →</a></p>`,
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm vitest run tests/post-email.test.ts && pnpm check`
Expected: PASS, no type errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/post-email.ts tests/post-email.test.ts package.json pnpm-lock.yaml
git commit -m "feat: convert blog posts to email-ready html"
```

---

### Task 4: Subscribe route and form

Restores the route deleted in `ddb027b` and retargets it at Kit. Recover the original with `git show ddb027b^:src/pages/api/subscribe.ts` and keep its structure: the linear email regex, the JSON-or-form-encoded body reader, the per-IP rate limit through the existing Upstash client, the graceful 503. Only the provider call and the env resolution change.

Removes Substack, which is only `src/components/NewsletterForm.astro:4,13,18` and nothing else.

**Files:**
- Create: `src/pages/api/subscribe.ts`
- Rewrite: `src/components/NewsletterForm.astro`
- Reference (do not modify): `src/pages/index.astro:64`, `src/pages/blog/[slug].astro:54` already render `<NewsletterForm />` with the right props.

**Interfaces:**
- Consumes: `resolveEnv<T>()` from Task 1, `subscribe()` and `KitEnv` from Task 2, existing `getRedis()`/`RedisEnv` from `src/lib/visitors`, existing `rateLimited()` from `src/lib/ratelimit`
- Produces: `POST /api/subscribe` accepting `{ email }` as JSON or form-encoded, replying `{ ok: true }` or `{ ok: false, error }`

- [ ] **Step 1: Write the route**

```ts
// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';
import { resolveEnv } from '../../lib/env';
import { getRedis, type RedisEnv } from '../../lib/visitors';
import { rateLimited } from '../../lib/ratelimit';
import { subscribe, type KitEnv } from '../../lib/kit';

export const prerender = false;

type Env = RedisEnv & KitEnv;

// Linear, no catastrophic backtracking. Rejects obvious junk before we spend an
// API call; Kit does the authoritative validation.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accept JSON (the fetch path) or form-encoded (the no-JS fallback).
async function readEmail(request: Request): Promise<string | undefined> {
  const ct = request.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    const b = (await request.json().catch(() => ({}))) as { email?: string };
    return b.email;
  }
  const f = await request.formData().catch(() => null);
  return f?.get('email')?.toString();
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const env = await resolveEnv<Env>();

  // Abuse brake so a script cannot burn our Kit quota or spam signups. Reuses
  // the visitor-counter Redis; with no creds we simply do not limit.
  const redis = getRedis(env);
  const ip = clientAddress || request.headers.get('cf-connecting-ip') || undefined;
  if (redis && ip && (await rateLimited(redis, `sub:${ip}`))) {
    return Response.json(
      { ok: false, error: 'Too many sign-up attempts, try again in a few minutes.' },
      { status: 429 },
    );
  }

  const email = (await readEmail(request))?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: 'Enter a valid email address.' }, { status: 400 });
  }

  const referrer = request.headers.get('referer') ?? undefined;
  const result = await subscribe(env, { email, referrer, ip }).catch(() => null);

  if (!result) {
    return Response.json(
      { ok: false, error: 'Could not reach the newsletter service. Try again.' },
      { status: 502 },
    );
  }
  if (result.ok) return Response.json({ ok: true });

  return Response.json({ ok: false, error: result.error }, { status: result.status });
};
```

- [ ] **Step 2: Rewrite the form component**

Recover the pre-Substack markup with `git show ddb027b^:src/components/NewsletterForm.astro` and write this, which is that file with the Buttondown archive link dropped and the success copy retargeted at Kit:

```astro
---
interface Props { title?: string; blurb?: string; }
const { title = 'Newsletter', blurb = 'I share what I learn.' } = Astro.props;
---
<section class="mt-12 w-full max-w-xl rounded-lg border border-black/10 p-5 dark:border-white/10">
  <h2 class="font-semibold">{title}</h2>
  <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{blurb}</p>
  <form data-newsletter action="/api/subscribe" method="post" class="mt-3 flex gap-2">
    <input type="email" name="email" required autocomplete="email" placeholder="you@example.com"
      class="min-w-0 flex-1 rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/15" />
    <button type="submit"
      class="shrink-0 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white transition-opacity disabled:opacity-60 dark:bg-white dark:text-zinc-900">
      Subscribe
    </button>
  </form>
  <p data-newsletter-status role="status" aria-live="polite"
    class="mt-2 text-sm text-zinc-600 empty:hidden dark:text-zinc-400"></p>
</section>

<script>
  document.querySelectorAll<HTMLFormElement>('form[data-newsletter]').forEach((form) => {
    const input = form.querySelector<HTMLInputElement>('input[name="email"]')!;
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const status = form.parentElement!.querySelector<HTMLElement>('[data-newsletter-status]')!;
    const setStatus = (msg: string, tone: 'ok' | 'err' | 'muted') => {
      const color =
        tone === 'ok' ? 'text-emerald-600 dark:text-emerald-400'
        : tone === 'err' ? 'text-red-600 dark:text-red-400'
        : 'text-zinc-600 dark:text-zinc-400';
      status.className = `mt-2 text-sm empty:hidden ${color}`;
      status.textContent = msg;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!email) return;

      const label = button.textContent;
      button.disabled = true;
      button.textContent = 'Subscribing…';
      setStatus('', 'muted');

      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (data.ok) {
          form.reset();
          setStatus('Thanks for joining, check your inbox.', 'ok');
        } else {
          setStatus(data.error || 'Something went wrong. Try again.', 'err');
        }
      } catch {
        setStatus('Network error. Try again.', 'err');
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    });
  });
</script>
```

- [ ] **Step 3: Verify Substack is gone and types are clean**

Run: `grep -rni substack src/ ; pnpm check && pnpm test`
Expected: grep finds nothing, no type errors, all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/subscribe.ts src/components/NewsletterForm.astro
git commit -m "feat: subscribe via Kit, drop Substack link"
```

---

### Task 5: Send CLI, env docs, and project docs

Node 26 strips TypeScript natively, so this runs as `node scripts/send-newsletter.ts` with no flag, no `tsx`, and no build step. Imports from `src/` need explicit `.ts` extensions because Node's resolver, unlike Vite's, does not guess them.

A plain Node script cannot use `astro:content`, so it reads the `.mdoc` from disk and parses frontmatter with markdoc's own parser plus `yaml`.

**Files:**
- Create: `scripts/send-newsletter.ts`
- Modify: `package.json` (add `newsletter` script, add `yaml` to `dependencies`)
- Modify: `.env.example` (document `KIT_API_KEY`, `KIT_FORM_ID`)
- Modify: `Makefile` (add a `newsletter` target)
- Modify: `CLAUDE.md` (the Newsletter and Env vars sections are stale, they still describe the removed Buttondown route)

**Interfaces:**
- Consumes: `postToEmail()` from Task 3, `createBroadcastDraft()` from Task 2
- Produces: `pnpm newsletter <slug>`

- [ ] **Step 1: Declare the direct dependency**

Run: `pnpm add yaml`

- [ ] **Step 2: Write the script**

```ts
// scripts/send-newsletter.ts
import { readFileSync, existsSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import Markdoc from '@markdoc/markdoc';
import { postToEmail } from '../src/lib/post-email.ts';
import { createBroadcastDraft } from '../src/lib/kit.ts';

const SITE = 'https://kartiklabhshetwar.com';

type Frontmatter = { title: string; description: string; pubDate: string; draft?: boolean };

function die(message: string): never {
  console.error(message);
  process.exit(1);
}

const slug = process.argv[2];
if (!slug) die('Usage: pnpm newsletter <slug>');

const path = `src/content/blog/${slug}/index.mdoc`;
if (!existsSync(path)) die(`No post at ${path}`);

const raw = readFileSync(path, 'utf8');
const ast = Markdoc.parse(raw);
const frontmatter = parseYaml(ast.attributes.frontmatter ?? '') as Frontmatter | null;
if (!frontmatter?.title) die(`${path} has no title in its frontmatter`);
if (frontmatter.draft) die(`${slug} is still marked draft: true. Publish it first.`);

const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
const email = postToEmail(
  { title: frontmatter.title, description: frontmatter.description, body, slug },
  SITE,
);

const result = await createBroadcastDraft(
  { KIT_API_KEY: process.env.KIT_API_KEY },
  {
    subject: email.subject,
    previewText: email.previewText,
    html: email.html,
    publishedAt: new Date(frontmatter.pubDate).toISOString(),
  },
);

if (!result.ok) die(`Kit rejected the broadcast: ${result.error}`);

console.log(`Draft created for "${email.subject}".`);
console.log('Review it in Kit, then press send:');
console.log('  https://app.kit.com/broadcasts');
if (result.url) console.log(`  public url: ${result.url}`);
```

- [ ] **Step 3: Wire up the entry points**

In `package.json` `scripts`, add:

```json
"newsletter": "node --env-file-if-exists=.env scripts/send-newsletter.ts"
```

In `Makefile`, add `newsletter` to the `.PHONY` line and append this target:

```make
newsletter: ## Draft a blog post as a Kit broadcast — `make newsletter SLUG=my-post`
	pnpm newsletter $(SLUG)
```

- [ ] **Step 4: Document the env vars**

Append to `.env.example`:

```
# --- Newsletter (Kit) -------------------------------------------------------
# Kit v4 API key, used by /api/subscribe (runtime) and `pnpm newsletter` (local).
# Create one: https://app.kit.com/account_settings/developer_settings
KIT_API_KEY=
# The Kit form new subscribers are added to. Its opt-in setting (single or
# double) is configured in Kit, not here. Find the id in the form's URL.
KIT_FORM_ID=
```

- [ ] **Step 5: Fix the stale project docs**

In `CLAUDE.md`, replace the `**Newsletter:**` bullet under Conventions with:

```markdown
- **Newsletter:** subscribing posts to `/api/subscribe` (server route → Kit v4 API with `KIT_API_KEY` + `KIT_FORM_ID`). Sending a post as email is `pnpm newsletter <slug>`, which creates a **draft** broadcast in Kit that you review and send by hand. Single vs double opt-in is a setting on the Kit form, not in this code.
```

In the Env vars section, delete the `BUTTONDOWN_API_KEY` bullet and add:

```markdown
- `KIT_API_KEY` / `KIT_FORM_ID` — newsletter (runtime for `/api/subscribe` via `cloudflare:workers` env; `KIT_API_KEY` also read from `.env` by `pnpm newsletter`). Without them the form replies "not configured".
```

- [ ] **Step 6: Verify end to end**

Run: `pnpm test && pnpm check && pnpm build`
Expected: tests pass, no type errors, build succeeds.

Run: `pnpm newsletter no-such-post`
Expected: exits 1 with `No post at src/content/blog/no-such-post/index.mdoc`.

Run: `pnpm newsletter what-is-rag`
Expected without a key: exits 1 with `Kit rejected the broadcast: Newsletter is not configured.`

- [ ] **Step 7: Commit**

```bash
git add scripts/send-newsletter.ts package.json pnpm-lock.yaml .env.example Makefile CLAUDE.md
git commit -m "feat: draft blog posts as Kit broadcasts from the CLI"
```

---

### Task 6: Live verification against the real Kit account

Cannot run until the user supplies `KIT_API_KEY` and `KIT_FORM_ID`. Everything above ships and degrades gracefully without them, so this task is the last gate rather than a blocker.

The spec's one open question: Kit's `POST /v4/subscribers` defaults to `state: active`, and the docs do not make clear whether a later double-opt-in form association still gates activation. This is checked against reality, not assumed.

- [ ] **Step 1: Confirm the key works**

```bash
curl -s https://api.kit.com/v4/account -H "X-Kit-Api-Key: $KIT_API_KEY"
```
Expected: JSON account details, not a 401.

- [ ] **Step 2: Subscribe a real address through the running site**

Run `pnpm dev`, submit a personal address in the form, then read back:

```bash
curl -s "https://api.kit.com/v4/subscribers?email_address=YOU@example.com" -H "X-Kit-Api-Key: $KIT_API_KEY"
```

- [ ] **Step 3: Judge the opt-in behaviour**

If the Kit form is set to double opt-in and the subscriber comes back `state: "active"` before the confirmation link was clicked, then opt-in is not being gated. Fix by adding `state: 'inactive'` to the `POST /v4/subscribers` body in `src/lib/kit.ts`, and add a test asserting that field is sent.

If the subscriber comes back `inactive` until confirmed, no change is needed. Record which happened.

- [ ] **Step 4: Draft a real broadcast and inspect it**

```bash
pnpm newsletter what-is-rag
```
Open the draft in Kit. Check headings, lists, code blocks, and that links resolve to `kartiklabhshetwar.com`. Send a test to yourself from Kit's UI. Do not send to the list.

- [ ] **Step 5: Commit any fix**

```bash
git add src/lib/kit.ts tests/kit.test.ts
git commit -m "fix: gate Kit subscribers on double opt-in confirmation"
```

---

## Self-Review

**Spec coverage:** `lib/env.ts` Task 1. `lib/kit.ts` Task 2. `lib/post-email.ts` Task 3. `api/subscribe.ts` and the Substack removal Task 4. `scripts/send-newsletter.ts`, env vars, docs Task 5. The open opt-in question Task 6. Tests are inside the task that creates the code they cover. Every "deliberately not built" item stays unbuilt.

**Placeholder scan:** No TBD or TODO. Every code step carries the code. Task 6 is conditional on a live result rather than unspecified, and both branches state exactly what to do.

**Type consistency:** `KitEnv`, `KitResult`, `subscribe`, `createBroadcastDraft` are defined in Task 2 and used with those names in Tasks 4 and 5. `PostInput`, `PostEmail`, `postToEmail` are defined in Task 3 and used in Task 5. `resolveEnv<T>()` is defined in Task 1 and used in Task 4. `subscribe` and `createBroadcastDraft` both take an injectable final `doFetch` parameter that defaults to `fetch`, which is what makes the Task 2 tests work without module mocking, and callers in Tasks 4 and 5 correctly omit it.
