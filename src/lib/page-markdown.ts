// Markdown representations of the HTML pages, served from the same URLs via
// Accept negotiation (https://acceptmarkdown.com). Pure: the middleware hands in
// the same data the pages render, so the two can't drift.

export type MarkdownProject = {
  id: string;
  title: string;
  description: string;
  impact?: string;
  liveLink?: string;
  githubLink?: string;
};

export type MarkdownPosition = {
  title: string;
  summary?: string;
  employmentType?: string;
  employmentPeriod: { start: string; end?: string };
  description?: string;
};

export type MarkdownCompany = { companyName: string; companyWebsite?: string; positions: MarkdownPosition[] };

export type MarkdownPost = { slug: string; title: string; description: string; pubDate: Date; body: string };

export type MarkdownProfile = {
  name: string;
  role: string;
  bio: string;
  location: string;
  socials: { label: string; href: string }[];
};

export type MarkdownSite = {
  base: string;
  profile: MarkdownProfile;
  projects: MarkdownProject[];
  experience: MarkdownCompany[];
  posts: MarkdownPost[];
};

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

// Mirrors the date shown on /privacy; both move only when the practices change.
const PRIVACY_UPDATED = '5 September 2026';

function normalize(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function projectLine(p: MarkdownProject): string {
  const links = [p.liveLink && `[Live](${p.liveLink})`, p.githubLink && `[GitHub](${p.githubLink})`]
    .filter(Boolean)
    .join(' · ');
  const impact = p.impact ? `: ${p.impact}` : '';
  return `### ${p.title}${impact}\n\n${p.description}${links ? `\n\n${links}` : ''}`;
}

function postLine(base: string, p: MarkdownPost): string {
  return `- [${p.title}](${base}/blog/${p.slug}): ${p.pubDate.toISOString().slice(0, 10)}: ${p.description}`;
}

function identity(site: MarkdownSite): string {
  const links = site.profile.socials.map((s) => `- ${s.label}: ${s.href}`).join('\n');
  return `# ${site.profile.name}

> ${site.profile.role}. ${site.profile.bio}

- Location: ${site.profile.location}
${links}`;
}

function home(site: MarkdownSite): string {
  const writing = site.posts.slice(0, 4).map((p) => postLine(site.base, p)).join('\n');
  return `${identity(site)}

[Work history](${site.base}/work)

## Writing

${writing}

[All posts](${site.base}/blog)
`;
}

function workPage(site: MarkdownSite): string {
  const companies = site.experience.map((company) => {
    const roles = company.positions.map((position) => {
      const end = position.employmentPeriod.end ?? 'Present';
      return `- **${position.title}** (${position.employmentPeriod.start} to ${end})${position.summary ? `: ${position.summary}` : ''}`;
    }).join('\n');
    const name = company.companyWebsite ? `[${company.companyName}](${company.companyWebsite})` : company.companyName;
    return `## ${name}\n\n${roles}`;
  }).join('\n\n');

  return `# Work

Where ${site.profile.name} has worked and what he has shipped.

${companies}

## Projects

${site.projects.map(projectLine).join('\n\n')}
`;
}

function blogIndex(site: MarkdownSite): string {
  return `# Writing

Field notes from building AI systems and developer tools. Full text of every post in one file: ${site.base}/llms-full.txt

${site.posts.map((p) => postLine(site.base, p)).join('\n')}
`;
}

function blogPost(site: MarkdownSite, post: MarkdownPost): string {
  return `# ${post.title}

> ${post.description}

${post.pubDate.toISOString().slice(0, 10)} · ${site.base}/blog/${post.slug} · by ${site.profile.name}

${post.body.trim()}
`;
}

function aboutPage(site: MarkdownSite): string {
  const current = site.experience[0];
  const title = current?.positions[0]?.title ?? site.profile.role;
  return `# About

${site.profile.name} is a software engineer based in ${site.profile.location}, currently ${title} at ${current?.companyName ?? 'Mem0'}.

## What I work on

Memory infrastructure for AI agents at ${current?.companyName ?? 'Mem0'}: the Python and TypeScript SDKs, the self-hosted server, vector-store integrations, editor plugins, and the CLI. In practice that means making retrieval return the right memories instead of the closest ones, cutting search latency, hardening a server other teams run in production, and closing security holes in the vector stores underneath. Most of it is open source, so the work happens in public: reviewing community pull requests, triaging the backlog, keeping SDK releases moving. Before that, software engineering intern at Turbo ML on scheduling, messaging integrations, and real-time scraping over Next.js, Supabase, and Cloudflare Workers.

## What I've built

${site.projects.length} projects shipped. The ones with real usage behind them: Screenshot Studio (20k+ monthly users), BetterShot, an open-source CleanShot X alternative for macOS (15k+ downloads), Lazy Commit, a CLI that writes git commit messages (195k+ downloads on npm), and OneURL, a self-hostable Linktree alternative. Full list: ${site.base}/work#projects

## What I write

Experience reports rather than tutorials: what retrieval-augmented generation is and where it breaks, running text-to-speech for 25,000 users without melting a server, a working guide to SSH, and how to choose problems worth solving. All posts: ${site.base}/blog

## Elsewhere

${site.profile.socials.map((s) => `- ${s.label}: ${s.href}`).join('\n')}

Contact: ${site.base}/contact
`;
}

function contactPage(site: MarkdownSite): string {
  const social = (label: string) => site.profile.socials.find((s) => s.label === label)?.href ?? '';
  return `# Contact

Ways to reach ${site.profile.name}. Say what you are building and what you want in the first two lines and you will hear back faster.

## Where to reach me

- **Email**: ${social('Email')}: best for roles, collaborations, and anything that benefits from context.
- **Book a 15-minute call**: ${social('Book a call')}: best for anything worth a conversation: hiring, collaboration, or advice on a project.
- **X (Twitter)**: ${social('X')}: DMs are open. Quickest for short questions.
- **LinkedIn**: ${social('LinkedIn')}: for roles, contracts, and anything that needs a paper trail.
- **GitHub**: ${social('GitHub')}: for bugs, feature requests, and contributions, open an issue on the repository rather than messaging.

## Working together

The day job is ${site.profile.role}, so time outside it is limited and replies are selective. Always worth asking about: agent memory and retrieval, feedback on something you are building in that space, and helping people earlier in their career work out what to build next.

## Stay in touch

New posts by email, nothing else. Subscribe at ${site.base}/contact, or POST \`{"email":"you@example.com"}\` to ${site.base}/api/subscribe.
`;
}

function privacyPage(site: MarkdownSite): string {
  return `# Privacy

A personal site with no accounts, no ads, and nothing for sale. Everything it collects, and every third party that sees any of it, is below. Last updated ${PRIVACY_UPDATED}.

## Newsletter

Subscribing sends your email address to Kit (formerly ConvertKit), which stores it and delivers the emails. Kit sends a confirmation email first, so nothing arrives unless you click the link in it. The address is used only to announce new posts. It is never sold, rented, or shared, and every email carries a one-click unsubscribe link.

## Analytics

Page analytics run through Databuddy, loaded from cdn.databuddy.cc: page views, outbound link clicks, interactions, and web vitals. Blocking the script breaks nothing on this site.

## Article views

Each article shows a unique view count stored in Upstash Redis. A random first-party reader cookie prevents repeat visits from increasing the count. It contains no personal information, is not used for advertising, and expires after one year.

## GitHub activity

The homepage loads public contribution history and recent GitHub events through this site's Cloudflare server, which caches successful responses. Your browser does not contact the contribution API directly. Repository avatars still load from GitHub, which receives standard request metadata such as your IP address and user agent for those images. The rest of the site works if activity data is unavailable.

## Hosting and storage on your device

The site runs on Cloudflare Workers, so Cloudflare handles every request and keeps its own standard request logs. Your light or dark theme choice stays in your browser's local storage.

## Your choices

Unsubscribe from any email to be removed. Block the analytics script to opt out of analytics. To ask what is held about you, or to have it deleted, get in touch at ${site.base}/contact.
`;
}

/** Markdown for a page path, or null when that path has no Markdown representation. */
export function pageMarkdown(pathname: string, site: MarkdownSite): string | null {
  const path = normalize(pathname);
  if (path === '/') return home(site);
  if (path === '/work') return workPage(site);
  if (path === '/blog') return blogIndex(site);
  if (path === '/about') return aboutPage(site);
  if (path === '/contact') return contactPage(site);
  if (path === '/privacy') return privacyPage(site);
  const slug = path.startsWith('/blog/') ? path.slice('/blog/'.length) : null;
  if (slug) {
    const post = site.posts.find((p) => p.slug === slug);
    return post ? blogPost(site, post) : null;
  }
  return null;
}

/** Body of a 404: tells an agent where to look instead. */
export function notFoundMarkdown(base: string): string {
  return `# 404: Page not found

There is nothing at this URL on ${base}.

## Where to look next

- [Home](${base}/): profile and latest posts
- [Work](${base}/work): companies, roles, and shipped projects
- [About](${base}/about): who runs this site, and what they work on
- [Blog](${base}/blog): all posts
- [Contact](${base}/contact): how to get in touch
- [Privacy](${base}/privacy): what this site collects
- [llms.txt](${base}/llms.txt): structured index of this site, plus when to use it
- [llms-full.txt](${base}/llms-full.txt): every page and full post text in one Markdown file
- [Sitemap](${base}/sitemap-index.xml): every canonical URL

Any page URL also serves Markdown when you send \`Accept: text/markdown\`.
`;
}
