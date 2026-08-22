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
  const result = await subscribe(env, { email, referrer }).catch(() => null);

  if (!result) {
    return Response.json(
      { ok: false, error: 'Could not reach the newsletter service. Try again.' },
      { status: 502 },
    );
  }
  if (result.ok) return Response.json({ ok: true });

  return Response.json({ ok: false, error: result.error }, { status: result.status });
};
