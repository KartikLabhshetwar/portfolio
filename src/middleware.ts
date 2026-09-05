import { defineMiddleware } from 'astro:middleware';
import { getCollection } from 'astro:content';
import { namesExplicitly, negotiate } from './lib/accept';
import {
  MARKDOWN_CONTENT_TYPE,
  notFoundMarkdown,
  pageMarkdown,
  type MarkdownPost,
  type MarkdownSite,
} from './lib/page-markdown';
import { profile } from './data/profile';
import { projects } from './data/projects';
import { experience } from './data/experience';

// HTML first: a missing or `*/*` Accept header gets the browser representation.
const PRODUCES = ['text/html', 'text/markdown'] as const;
// Endpoints, the CMS, and Astro's internal routes negotiate their own types.
const SKIP = /^\/(api\/|keystatic|_)/;

function withVaryAccept(headers: Headers): Headers {
  const existing = headers.get('Vary');
  const tokens = existing ? existing.split(',').map((s) => s.trim().toLowerCase()) : [];
  if (!tokens.includes('accept')) headers.set('Vary', existing ? `${existing}, Accept` : 'Accept');
  return headers;
}

function markdown(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { 'Content-Type': MARKDOWN_CONTENT_TYPE, Vary: 'Accept' },
  });
}

async function loadSite(base: string): Promise<MarkdownSite> {
  const posts: MarkdownPost[] = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime() || a.data.title.localeCompare(b.data.title))
    .map((p) => ({
      slug: p.id.replace(/\/index$/, ''),
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      body: p.body ?? '',
    }));
  return { base, profile, projects, experience, posts };
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (SKIP.test(ctx.url.pathname)) return next();

  const accept = ctx.request.headers.get('accept');
  const chosen = negotiate(accept, PRODUCES);
  const base = (ctx.site?.toString() ?? ctx.url.origin).replace(/\/$/, '');

  if (!chosen) {
    return new Response(
      `This resource is available in:\n- text/html\n- text/markdown\n\nYou requested: ${accept}\n`,
      {
        status: 406,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', Vary: 'Accept', 'Cache-Control': 'no-store' },
      },
    );
  }

  if (chosen === 'text/markdown') {
    const body = pageMarkdown(ctx.url.pathname, await loadSite(base));
    if (body) return markdown(body);
  }

  const response = await next();
  // A 404 is where an agent most needs a machine-readable way back in, and a
  // client that never named text/html (curl, crawlers, fetch defaults) has no
  // use for the styled page. Browsers always name it, so they keep it.
  if (response.status === 404 && !namesExplicitly(accept, 'text/html')) {
    return markdown(notFoundMarkdown(base), 404);
  }
  withVaryAccept(response.headers);
  return response;
});
