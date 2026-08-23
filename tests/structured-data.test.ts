import { describe, it, expect } from 'vitest';
import { serializeJsonLd, structuredData, type SchemaProfile } from '../src/lib/structured-data';

const base = 'https://kartiklabhshetwar.com';

const profile: SchemaProfile = {
  name: 'Kartik Labhshetwar',
  role: 'Software Engineer',
  bio: 'I build from zero.',
  location: 'India',
  socials: [
    { label: 'GitHub', href: 'https://github.com/KartikLabhshetwar' },
    { label: 'X', href: 'https://x.com/code_kartik' },
  ],
};

const page = {
  url: `${base}/`,
  title: 'Kartik Labhshetwar · Software Engineer',
  description: 'I build from zero.',
  image: `${base}/og.png`,
};

const nodeOf = (graph: any[], type: string) => graph.find((n) => n['@type'] === type);

describe('structuredData', () => {
  it('emits a schema.org graph with person, website, and page nodes', () => {
    const data = structuredData(base, profile, page);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@graph'].map((n: any) => n['@type'])).toEqual(['Person', 'WebSite', 'WebPage']);
  });

  it('describes the person with name, url, description, and every social profile', () => {
    const person = nodeOf(structuredData(base, profile, page)['@graph'], 'Person') as any;
    expect(person.name).toBe(profile.name);
    expect(person.url).toBe(`${base}/`);
    expect(person.jobTitle).toBe(profile.role);
    expect(person.description).toBe(profile.bio);
    expect(person.sameAs).toEqual(profile.socials.map((s) => s.href));
    expect(person.address.addressCountry).toBe('India');
  });

  it('links the page node to the shared identity nodes', () => {
    const graph = structuredData(base, profile, page)['@graph'];
    const node = nodeOf(graph, 'WebPage') as any;
    expect(node['@id']).toBe(page.url);
    expect(node.isPartOf['@id']).toBe(`${base}/#website`);
    expect(node.author['@id']).toBe(`${base}/#person`);
    expect(node.about['@id']).toBe(`${base}/#person`);
  });

  it('marks blog posts as BlogPosting with dates and a publisher', () => {
    const data = structuredData(base, profile, {
      ...page,
      url: `${base}/blog/first`,
      type: 'BlogPosting',
      datePublished: '2026-01-02T00:00:00.000Z',
    });
    const node = nodeOf(data['@graph'], 'BlogPosting') as any;
    expect(node.datePublished).toBe('2026-01-02T00:00:00.000Z');
    expect(node.dateModified).toBe('2026-01-02T00:00:00.000Z');
    expect(node.publisher['@id']).toBe(`${base}/#person`);
    expect(node.mainEntityOfPage['@id']).toBe(`${base}/blog/first`);
    expect(node.about).toBeUndefined();
  });

  it('supports collection pages', () => {
    const data = structuredData(base, profile, { ...page, url: `${base}/projects`, type: 'CollectionPage' });
    expect(nodeOf(data['@graph'], 'CollectionPage')).toBeTruthy();
  });

  it('names the employer and topics when the profile carries them', () => {
    const withEmployer = { ...profile, employer: { name: 'Mem0', url: 'https://mem0.ai' }, knowsAbout: ['AI agents'] };
    const person = nodeOf(structuredData(base, withEmployer, page)['@graph'], 'Person') as any;
    expect(person.worksFor).toEqual({ '@type': 'Organization', name: 'Mem0', url: 'https://mem0.ai' });
    expect(person.knowsAbout).toEqual(['AI agents']);
  });

  it('omits worksFor and knowsAbout when the profile has neither', () => {
    const person = nodeOf(structuredData(base, profile, page)['@graph'], 'Person') as any;
    expect(person.worksFor).toBeUndefined();
    expect(person.knowsAbout).toBeUndefined();
  });

  it('ties a profile page to the person through mainEntity', () => {
    const data = structuredData(base, profile, { ...page, url: `${base}/about`, type: 'ProfilePage' });
    const node = nodeOf(data['@graph'], 'ProfilePage') as any;
    expect(node.mainEntity['@id']).toBe(`${base}/#person`);
    expect(node.about['@id']).toBe(`${base}/#person`);
  });

  it('leaves mainEntity off pages that are not about the person', () => {
    const data = structuredData(base, profile, { ...page, url: `${base}/contact`, type: 'ContactPage' });
    const node = nodeOf(data['@graph'], 'ContactPage') as any;
    expect(node.mainEntity).toBeUndefined();
    expect(node.isPartOf['@id']).toBe(`${base}/#website`);
  });

  it('tolerates a trailing slash on the site url', () => {
    const person = nodeOf(structuredData(`${base}/`, profile, page)['@graph'], 'Person') as any;
    expect(person['@id']).toBe(`${base}/#person`);
    expect(person.url).toBe(`${base}/`);
  });
});

describe('serializeJsonLd', () => {
  it('escapes < so the payload cannot close the script tag', () => {
    const json = serializeJsonLd({ name: '</script><img src=x>' });
    expect(json).not.toContain('</script>');
    expect(json).toContain('\\u003c');
    expect(JSON.parse(json).name).toBe('</script><img src=x>');
  });
});
