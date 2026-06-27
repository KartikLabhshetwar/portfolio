import type { APIRoute } from 'astro';

export const prerender = false;

// Buttondown API key lives in the runtime env. On Cloudflare it's a Worker
// secret read via `cloudflare:workers` (same as GITHUB_TOKEN / UPSTASH); fall
// back to process.env for plain Node (dev / tests).
async function resolveApiKey(): Promise<string | undefined> {
  try {
    const m: any = await import('cloudflare:workers' as any);
    return m.env?.BUTTONDOWN_API_KEY ?? process.env.BUTTONDOWN_API_KEY;
  } catch {
    return process.env.BUTTONDOWN_API_KEY;
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

export const POST: APIRoute = async ({ request }) => {
  const email = (await readEmail(request))?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: 'Enter a valid email address.' }, { status: 400 });
  }

  const apiKey = await resolveApiKey();
  if (!apiKey) {
    return Response.json({ ok: false, error: 'Newsletter is not configured.' }, { status: 503 });
  }

  let res: Response;
  try {
    res = await fetch('https://api.buttondown.com/v1/subscribers', {
      method: 'POST',
      headers: { Authorization: `Token ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_address: email, tags: ['newsletter'] }),
    });
  } catch {
    return Response.json({ ok: false, error: 'Could not reach the newsletter service. Try again.' }, { status: 502 });
  }

  if (res.ok) return Response.json({ ok: true });

  // A duplicate isn't really an error to the visitor — say so kindly. Buttondown
  // returns 400 with a JSON { code, detail } body for this.
  const detail = (await res.json().catch(() => ({}))) as { code?: string; detail?: string };
  const blob = `${detail.code ?? ''} ${detail.detail ?? ''}`.toLowerCase();
  if (res.status === 400 && /already|exists|subscrib/.test(blob)) {
    return Response.json({ ok: true, already: true });
  }

  return Response.json({ ok: false, error: detail.detail || 'Subscription failed. Try again later.' }, { status: res.status });
};
