import { describe, it, expect } from 'vitest';
import { postToEmail } from '../src/lib/post-email';

const base = 'https://kartiklabhshetwar.com';
const post = (body: string) => ({ title: 'My Post', description: 'A short description.', body, slug: 'my-post' });

describe('postToEmail', () => {
  it('takes subject and preview text from the frontmatter fields', () => {
    const email = postToEmail(post('Hello.'), base);
    expect(email.subject).toBe('My Post');
    expect(email.previewText).toBe('A short description.');
  });

  it('renders markdoc to semantic html', () => {
    const email = postToEmail(post('## Heading\n\nSome **bold** text.\n\n- one\n- two'), base);
    expect(email.html).toContain('<h2>Heading</h2>');
    expect(email.html).toContain('<strong>bold</strong>');
    expect(email.html).toContain('<li>one</li>');
  });

  it('rewrites root-relative links to absolute so they work in email', () => {
    const email = postToEmail(post('See [my other post](/blog/other).'), base);
    expect(email.html).toContain(`href="${base}/blog/other"`);
  });

  it('rewrites root-relative image sources', () => {
    const email = postToEmail(post('![alt](/images/diagram.png)'), base);
    expect(email.html).toContain(`src="${base}/images/diagram.png"`);
  });

  it('leaves absolute and protocol-relative urls alone', () => {
    const email = postToEmail(post('[x](https://example.com/a) and [y](//cdn.example.com/b)'), base);
    expect(email.html).toContain('href="https://example.com/a"');
    expect(email.html).toContain('href="//cdn.example.com/b"');
    expect(email.html).not.toContain(`href="${base}//cdn`);
  });

  it('appends a link back to the canonical post url', () => {
    const email = postToEmail(post('Body.'), base);
    expect(email.html).toContain(`href="${base}/blog/my-post"`);
    expect(email.html).toContain('Read this on the web');
  });

  it('tolerates a trailing slash on the base url', () => {
    const email = postToEmail(post('[x](/blog/other)'), 'https://kartiklabhshetwar.com/');
    expect(email.html).toContain(`href="${base}/blog/other"`);
    expect(email.html).not.toContain('.com//');
  });
});
