import type { APIRoute } from 'astro';
import { getRedis, type RedisEnv } from '../../lib/visitors';
import { rateLimited } from '../../lib/ratelimit';

export const prerender = false;

// Runtime env. On Cloudflare these are Worker secrets read via
// `cloudflare:workers` (same as GITHUB_TOKEN / UPSTASH); fall back to
// process.env for plain Node (dev / tests). Carries the Buttondown key plus the
// Upstash creds (shared with the visitor counter) used to rate-limit.
type Env = RedisEnv & { BUTTONDOWN_API_KEY?: string };
async function resolveEnv(): Promise<Env> {
  try {
    const m: any = await import('cloudflare:workers' as any);
    return m.env as Env;
  } catch {
    return (typeof process !== 'undefined' ? process.env : {}) as Env;
  }
}

// Linear, no catastrophic backtracking. Just rejects obvious junk before we
// spend an API call — Buttondown does the authoritative validation.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accept JSON (the fetch path) or form-encoded (no-JS form POST fallback).
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
  const env = await resolveEnv();

  // Abuse brake: cap subscribe attempts per IP so a script can't burn Buttondown
  // API calls or spam signups. Reuses the visitor-counter Redis; when it's
  // absent (local/dev) we simply don't limit. CF-Connecting-IP is the fallback
  // when Astro's clientAddress isn't populated.
  const redis = getRedis(env);
  const ip = clientAddress || request.headers.get('cf-connecting-ip');
  if (redis && ip && (await rateLimited(redis, `sub:${ip}`))) {
    return Response.json({ ok: false, error: 'Too many sign-up attempts — try again in a few minutes.' }, { status: 429 });
  }

  const email = (await readEmail(request))?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: 'Enter a valid email address.' }, { status: 400 });
  }

  const apiKey = env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: false, error: 'Newsletter is not configured.' }, { status: 503 });
  }

  let res: Response;
  try {
    // type: 'regular' opts this subscriber out of Buttondown's double opt-in, so
    // they're added immediately with no confirmation email (Buttondown's own docs
    // call this the per-subscriber way to skip opt-in). The address was typed
    // into our own form, so consent is already explicit.
    res = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: { Authorization: `Token ${apiKey}`, 'Content-Type': 'application/json' },
      // Pass the visitor's IP so Buttondown's firewall judges *them*, not our
      // Cloudflare Worker's datacenter egress IP (which firewalls tend to block).
      body: JSON.stringify({ email_address: email, tags: ['newsletter'], type: 'regular', ...(ip ? { ip_address: ip } : {}) }),
    });
  } catch {
    return Response.json({ ok: false, error: 'Could not reach the newsletter service. Try again.' }, { status: 502 });
  }

  if (res.ok) return Response.json({ ok: true });

  // Buttondown returns 400 with a JSON { code, detail } body on failure. A
  // duplicate (`email_already_exists`) isn't an error to the visitor — say so
  // kindly. Match it NARROWLY: the old /subscrib/ test also matched
  // `subscriber_blocked` (firewall rejections), reporting blocks as fake
  // successes so the signup silently vanished. Every other code is a real
  // failure — surface `detail` (e.g. "This subscriber was blocked by your firewall").
  const detail = (await res.json().catch(() => ({}))) as { code?: string; detail?: string };
  const isDuplicate =
    detail.code === 'email_already_exists' || (detail.detail ?? '').toLowerCase().includes('already');
  if (isDuplicate) {
    return Response.json({ ok: true, already: true });
  }

  return Response.json({ ok: false, error: detail.detail || 'Subscription failed. Try again later.' }, { status: res.status });
};
