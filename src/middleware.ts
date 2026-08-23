import { defineMiddleware } from 'astro:middleware';
import { getCollection } from 'astro:content';
import { negotiate } from './lib/accept';
import {
  MARKDOWN_CONTENT_TYPE,
  notFoundMarkdown,
  pageMarkdown,
  type MarkdownPost,
  type MarkdownSite,
} from './lib/page-markdown';
import { profile } from './data/profile';
import { featuredIds, projects } from './data/projects';
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
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .map((p) => ({
      slug: p.id.replace(/\/index$/, ''),
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      body: p.body ?? '',
    }));
  return { base, profile, projects, featuredIds, experience, posts };
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (SKIP.test(ctx.url.pathname)) return next();

  const chosen = negotiate(ctx.request.headers.get('accept'), PRODUCES);
  const base = (ctx.site?.toString() ?? ctx.url.origin).replace(/\/$/, '');

  if (!chosen) {
    return new Response(
      `This resource is available in:\n- text/html\n- text/markdown\n\nYou requested: ${ctx.request.headers.get('accept')}\n`,
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
  if (response.status === 404 && chosen === 'text/markdown') return markdown(notFoundMarkdown(base), 404);
  withVaryAccept(response.headers);
  return response;
});
