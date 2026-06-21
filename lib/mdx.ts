import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  /** Optional ordering among posts with the same date (ascending; lower = earlier). */
  order?: number;
  /** Pin to the top of the case-study list. */
  featured?: boolean;
  /** Manual ordering among featured items (ascending; lower = first). */
}

export interface Post extends PostMeta {
  content: string;
}

const contentRoot = path.join(process.cwd(), 'content');

function shouldIncludeFuturePosts() {
  if (process.env.SHOW_FUTURE_POSTS === 'true') return true;
  if (process.env.SHOW_FUTURE_POSTS === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

function isPublished(date: string) {
  if (shouldIncludeFuturePosts()) return true;
  if (!date) return true;

  const publishedAt = new Date(`${date}T23:59:59.999Z`);
  if (Number.isNaN(publishedAt.getTime())) return true;

  return publishedAt.getTime() <= Date.now();
}

function getDir(type: 'blog' | 'case-studies', locale: string) {
  return path.join(contentRoot, type, locale);
}

export function getAllPosts(locale: string): PostMeta[] {
  const dir = getDir('blog', locale);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        description: data.description ?? '',
        tags: data.tags ?? [],
        order: typeof data.order === 'number' ? data.order : undefined,
      };
    })
    .filter((post) => isPublished(post.date))
    .sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      const ao = a.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.order ?? Number.MAX_SAFE_INTEGER;
      return bo - ao;
    });
}

export function getPost(slug: string, locale: string): Post | null {
  const filePath = path.join(getDir('blog', locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  if (!isPublished(data.date ?? '')) return null;
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    order: typeof data.order === 'number' ? data.order : undefined,
    content,
  };
}

export function getAllCaseStudies(locale: string): PostMeta[] {
  const dir = getDir('case-studies', locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? '',
        description: data.description ?? '',
        tags: data.tags ?? [],
        featured: data.featured ?? false,
        order: typeof data.order === 'number' ? data.order : undefined,
      };
    })
    .sort((a, b) => {
      // 1. Featured items come first.
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      // 2. Among featured, honour manual `order` (ascending).
      if (a.featured && b.featured) {
        const ao = a.order ?? Number.MAX_SAFE_INTEGER;
        const bo = b.order ?? Number.MAX_SAFE_INTEGER;
        if (ao !== bo) return ao - bo;
      }
      // 3. Fallback: newest first by date.
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getCaseStudy(slug: string, locale: string): Post | null {
  const filePath = path.join(getDir('case-studies', locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    content,
  };
}
