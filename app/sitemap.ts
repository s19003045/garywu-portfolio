import { MetadataRoute } from 'next';
import {
  getAllPosts,
  getAllCaseStudies,
  getAllTags,
  getAllCategories,
} from '@/lib/mdx';
import { siteConfig } from '@/lib/site';
import { SERIES_KEYS } from '@/lib/taxonomy';

const BASE_URL = siteConfig.url;
const locales = siteConfig.locales;

type ChangeFreq = 'weekly' | 'monthly';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: '', freq: 'weekly' as ChangeFreq, priority: 1 },
    { path: '/about', freq: 'monthly' as ChangeFreq, priority: 0.8 },
    { path: '/experience', freq: 'monthly' as ChangeFreq, priority: 0.8 },
    { path: '/case-studies', freq: 'monthly' as ChangeFreq, priority: 0.9 },
    { path: '/projects', freq: 'monthly' as ChangeFreq, priority: 0.8 },
    { path: '/lab', freq: 'monthly' as ChangeFreq, priority: 0.7 },
    { path: '/blog', freq: 'weekly' as ChangeFreq, priority: 0.8 },
    { path: '/blog/archive', freq: 'weekly' as ChangeFreq, priority: 0.5 },
    { path: '/resume', freq: 'monthly' as ChangeFreq, priority: 0.7 },
    { path: '/connect', freq: 'monthly' as ChangeFreq, priority: 0.7 },
  ];

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map(({ path, freq, priority }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
    }))
  );

  const blogEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.7,
    }))
  );

  const caseStudyEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllCaseStudies(locale).map((cs) => ({
      url: `${BASE_URL}/${locale}/case-studies/${cs.slug}`,
      lastModified: new Date(cs.date),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.9,
    }))
  );

  const categoryEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllCategories(locale).map(({ key }) => ({
      url: `${BASE_URL}/${locale}/blog/category/${key}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.6,
    }))
  );

  const tagEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllTags(locale).map(({ tag }) => ({
      url: `${BASE_URL}/${locale}/blog/tag/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.5,
    }))
  );

  const seriesEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    SERIES_KEYS.map((key) => ({
      url: `${BASE_URL}/${locale}/blog/series/${key}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as ChangeFreq,
      priority: 0.6,
    }))
  );

  return [
    ...staticEntries,
    ...blogEntries,
    ...caseStudyEntries,
    ...categoryEntries,
    ...seriesEntries,
    ...tagEntries,
  ];
}
