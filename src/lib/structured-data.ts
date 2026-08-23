// schema.org JSON-LD for the pages. One @graph per page: the Person and WebSite
// identity every page shares, plus the page's own node.

export type SchemaProfile = {
  name: string;
  role: string;
  bio: string;
  location: string;
  socials: { label: string; href: string }[];
};

type GraphNode = Record<string, unknown>;

export type PageSchema = {
  url: string;
  title: string;
  description: string;
  image: string;
  type?: 'WebPage' | 'CollectionPage' | 'BlogPosting';
  datePublished?: string;
};

export function structuredData(site: string, profile: SchemaProfile, page: PageSchema) {
  const base = site.replace(/\/$/, '');
  const personId = `${base}/#person`;
  const siteId = `${base}/#website`;

  const person: GraphNode = {
    '@type': 'Person',
    '@id': personId,
    name: profile.name,
    url: `${base}/`,
    jobTitle: profile.role,
    description: profile.bio,
    image: `${base}/kartik.png`,
    address: { '@type': 'PostalAddress', addressCountry: profile.location },
    sameAs: profile.socials.map((s) => s.href),
  };

  const website: GraphNode = {
    '@type': 'WebSite',
    '@id': siteId,
    name: profile.name,
    url: `${base}/`,
    description: profile.bio,
    inLanguage: 'en',
    author: { '@id': personId },
    publisher: { '@id': personId },
  };

  const type = page.type ?? 'WebPage';
  const node: GraphNode = {
    '@type': type,
    '@id': page.url,
    url: page.url,
    name: page.title,
    headline: page.title,
    description: page.description,
    image: page.image,
    inLanguage: 'en',
    isPartOf: { '@id': siteId },
    author: { '@id': personId },
  };
  if (type === 'BlogPosting') {
    node.publisher = { '@id': personId };
    node.mainEntityOfPage = { '@id': page.url };
  } else {
    node.about = { '@id': personId };
  }
  if (page.datePublished) {
    node.datePublished = page.datePublished;
    node.dateModified = page.datePublished;
  }

  return { '@context': 'https://schema.org', '@graph': [person, website, node] };
}

/** JSON safe to drop inside a <script> tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
