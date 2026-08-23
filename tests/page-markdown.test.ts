import { describe, it, expect } from 'vitest';
import { notFoundMarkdown, pageMarkdown, type MarkdownSite } from '../src/lib/page-markdown';

const base = 'https://kartiklabhshetwar.com';

const site: MarkdownSite = {
  base,
  profile: {
    name: 'Kartik Labhshetwar',
    role: 'Software Engineer',
    bio: 'I build from zero.',
    location: 'India',
    socials: [
      { label: 'GitHub', href: 'https://github.com/KartikLabhshetwar' },
      { label: 'X', href: 'https://x.com/code_kartik' },
    ],
  },
  projects: [
    { id: 'alpha', title: 'Alpha', description: 'Does alpha things.', impact: '10k downloads', liveLink: `${base}/a`, githubLink: 'https://github.com/x/alpha' },
    { id: 'beta', title: 'Beta', description: 'Does beta things.' },
  ],
  featuredIds: ['alpha'],
  experience: [
    {
      companyName: 'Mem0',
      companyWebsite: 'https://mem0.ai',
      positions: [
        { title: 'Software Engineer', employmentPeriod: { start: 'Jan 2025' }, description: 'Built memory infrastructure.' },
      ],
    },
  ],
  posts: [
    { slug: 'first', title: 'First', description: 'About first.', pubDate: new Date('2026-01-02T00:00:00Z'), body: '## Body\n\nText.' },
    { slug: 'second', title: 'Second', description: 'About second.', pubDate: new Date('2025-12-01T00:00:00Z'), body: 'More.' },
  ],
};

describe('pageMarkdown', () => {
  it('renders the home page with identity, experience, projects, and writing', () => {
    const md = pageMarkdown('/', site)!;
    expect(md).toContain('# Kartik Labhshetwar');
    expect(md).toContain('> Software Engineer. I build from zero.');
    expect(md).toContain('- GitHub: https://github.com/KartikLabhshetwar');
    expect(md).toContain('## Experience');
    expect(md).toContain('### Software Engineer · [Mem0](https://mem0.ai) (Jan 2025–present)');
    expect(md).toContain('Built memory infrastructure.');
    expect(md).toContain('## Projects');
    expect(md).toContain('### Alpha — 10k downloads');
    expect(md).toContain('## Writing');
    expect(md).toContain(`- [First](${base}/blog/first) — 2026-01-02: About first.`);
    expect(md).toContain('/api/subscribe');
  });

  it('only lists featured projects on the home page', () => {
    const md = pageMarkdown('/', site)!;
    expect(md).toContain('### Alpha');
    expect(md).not.toContain('### Beta');
  });

  it('lists every project on the projects page', () => {
    const md = pageMarkdown('/projects', site)!;
    expect(md).toContain('# Projects');
    expect(md).toContain('### Alpha');
    expect(md).toContain('### Beta');
    expect(md).toContain('[Live](https://kartiklabhshetwar.com/a) · [GitHub](https://github.com/x/alpha)');
  });

  it('lists every post on the blog index', () => {
    const md = pageMarkdown('/blog', site)!;
    expect(md).toContain('# Blog');
    expect(md).toContain(`${base}/blog/first`);
    expect(md).toContain(`${base}/blog/second`);
  });

  it('renders a blog post with its full body', () => {
    const md = pageMarkdown('/blog/first', site)!;
    expect(md).toContain('# First');
    expect(md).toContain('> About first.');
    expect(md).toContain('2026-01-02');
    expect(md).toContain('## Body');
  });

  it('renders the sponsors page', () => {
    const md = pageMarkdown('/sponsors', site)!;
    expect(md).toContain('# Sponsors');
    expect(md).toContain('https://github.com/sponsors/KartikLabhshetwar');
  });

  it('ignores trailing slashes', () => {
    expect(pageMarkdown('/projects/', site)).toBe(pageMarkdown('/projects', site));
    expect(pageMarkdown('', site)).toBe(pageMarkdown('/', site));
  });

  it('returns null for paths with no markdown representation', () => {
    expect(pageMarkdown('/blog/nope', site)).toBeNull();
    expect(pageMarkdown('/nope', site)).toBeNull();
    expect(pageMarkdown('/api/visitors', site)).toBeNull();
  });
});

describe('notFoundMarkdown', () => {
  it('points agents at every recovery entry point', () => {
    const md = notFoundMarkdown(base);
    expect(md).toContain('# 404');
    expect(md).toContain('## Where to look next');
    for (const path of ['/', '/projects', '/blog', '/sponsors', '/llms.txt', '/llms-full.txt', '/sitemap-index.xml']) {
      expect(md).toContain(`${base}${path}`);
    }
    expect(md).toContain('Accept: text/markdown');
  });
});
