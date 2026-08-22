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
