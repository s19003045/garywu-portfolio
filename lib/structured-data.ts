import { siteConfig } from './site';

/** Person schema — establishes identity for Google Knowledge Panel. */
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Gary Wu',
    alternateName: '吳振銜',
    url: siteConfig.url,
    image: `${siteConfig.url}/garywu.webp`,
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
    email: `mailto:${siteConfig.email}`,
    knowsAbout: [
      'Industrial System Integration',
      'Edge-to-Cloud Architecture',
      'SCADA',
      'PLC Communication (OPC UA)',
      'IPC Application Development',
      'AI Engineering',
      'Full-Stack Development',
      'Next.js',
      'TypeScript',
    ],
    sameAs: [
      siteConfig.links.linkedin,
      siteConfig.links.github,
      siteConfig.links.medium,
    ],
  };
}

/** WebSite schema — enables sitelinks search box eligibility. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: ['zh-TW', 'en'],
    author: { '@type': 'Person', name: 'Gary Wu' },
  };
}

/** Article schema for blog posts. */
export function articleSchema(opts: {
  title: string;
  description: string;
  date: string;
  locale: string;
  slug: string;
  tags: string[];
  image?: string;
}) {
  const url = `${siteConfig.url}/${opts.locale}/blog/${opts.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    ...(opts.image ? { image: opts.image } : {}),
    datePublished: opts.date,
    dateModified: opts.date,
    inLanguage: opts.locale === 'zh' ? 'zh-TW' : 'en',
    keywords: opts.tags.join(', '),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Person',
      name: 'Gary Wu',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: 'Gary Wu',
      url: siteConfig.url,
    },
  };
}

/** TechArticle schema for case studies (more technical signal). */
export function caseStudySchema(opts: {
  title: string;
  description: string;
  date: string;
  locale: string;
  slug: string;
  tags: string[];
  image?: string;
}) {
  const url = `${siteConfig.url}/${opts.locale}/case-studies/${opts.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: opts.title,
    description: opts.description,
    ...(opts.image ? { image: opts.image } : {}),
    datePublished: opts.date,
    inLanguage: opts.locale === 'zh' ? 'zh-TW' : 'en',
    keywords: opts.tags.join(', '),
    url,
    author: { '@type': 'Person', name: 'Gary Wu', url: siteConfig.url },
  };
}

/** BreadcrumbList schema. */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
