import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

export const prerender = true;

// Generated from the same data the site renders, so /llms.txt never drifts.
// Format follows https://llmstxt.org: H1 + blockquote summary + link sections.
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? 'https://kartikk.tech/').replace(/\/$/, '');
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

## Projects

${projectLines}

## Writing

${postLines}

## Pages

- [Home](${base}/): About, experience, featured projects, and writing
- [Projects](${base}/projects): Full list of projects
- [Blog](${base}/blog): All posts
- [Sponsors](${base}/sponsors): GitHub sponsors
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
