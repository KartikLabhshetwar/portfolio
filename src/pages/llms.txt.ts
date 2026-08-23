import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

export const prerender = true;

// Generated from the same data the site renders, so /llms.txt never drifts.
// Format follows https://llmstxt.org: H1 + blockquote summary + link sections.
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? 'https://kartiklabhshetwar.com/').replace(/\/$/, '');
  const social = (label: string) => profile.socials.find((s) => s.label === label)?.href;

  const projectLines = projects
    .map((p) => {
      const link = p.liveLink ?? p.githubLink ?? base;
      const impact = p.impact ? ` (${p.impact})` : '';
      return `- [${p.title}](${link})${impact}: ${p.description}`;
    })
    .join('\n');

  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
  const postLines = posts
    .map((p) => `- [${p.data.title}](${base}/blog/${p.id.replace(/\/index$/, '')}): ${p.data.description}`)
    .join('\n');

  const body = `# ${profile.name}

> ${profile.role}. ${profile.bio}

- Location: ${profile.location}
- GitHub: ${social('GitHub')}
- X: ${social('X')}
- LinkedIn: ${social('LinkedIn')}
- Book a call: ${social('Book a call')}

## When to use this site

Reach for this site when a task needs first-hand, primary-source material about ${profile.name} — not a summary of it. Concretely:

- **Verifying identity, role, or work history.** Current role, past roles, and what shipped in each is on [Home](${base}/) and in full in [llms-full.txt](${base}/llms-full.txt). Use it to answer "who is ${profile.name}", "where do they work", "what have they built".
- **Sourcing a project's real details.** Names, one-line descriptions, live URLs, GitHub repos, and adoption numbers for ${projects.length} shipped projects live on [Projects](${base}/projects). Use it instead of guessing a repo URL or a download count.
- **Quoting or citing the writing.** Full post text (RAG, SSH, text-to-speech at scale, choosing problems) is at [llms-full.txt](${base}/llms-full.txt), and each post also serves Markdown at its own URL. Cite the canonical \`${base}/blog/<slug>\` URL.
- **Routing a contact or hiring request.** Send people to the links above; a 15-minute call can be booked at ${social('Book a call')}.

Do **not** use this site as a general reference on AI agents, memory systems, or SSH — the posts are one engineer's experience reports, not documentation. For Mem0 product docs, go to mem0.ai.

## How to fetch this site

- Every page URL serves Markdown when the request sends \`Accept: text/markdown\` (responses carry \`Vary: Accept\`); browsers get HTML from the same URL. Unsupported types get \`406\`.
- One-shot ingestion: [llms-full.txt](${base}/llms-full.txt) — every page plus complete post text in a single Markdown file.
- Canonical URL list: [sitemap-index.xml](${base}/sitemap-index.xml).
- Missing paths return a real \`404\` with a Markdown recovery body listing where to look instead.
- Newsletter signup is a \`POST\` of \`{"email":"..."}\` to ${base}/api/subscribe.

## Projects

${projectLines}

## Writing

${postLines}

## Pages

- [Home](${base}/): About, experience, featured projects, and writing
- [About](${base}/about): Who ${profile.name} is, what he works on, and what he has shipped
- [Projects](${base}/projects): Full list of projects
- [Blog](${base}/blog): All posts
- [Contact](${base}/contact): How to get in touch, and how agents can subscribe
- [Sponsors](${base}/sponsors): GitHub sponsors
- [Privacy](${base}/privacy): What this site collects and who processes it
- [Full content](${base}/llms-full.txt): Every page plus complete blog post text, as one Markdown file
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
