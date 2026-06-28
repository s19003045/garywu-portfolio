import type { ComponentPropsWithoutRef } from 'react';
import { blogPostStatus } from '@/lib/mdx';

// Internal blog links in MDX content carry a locale prefix, e.g. `/zh/blog/some-slug`.
const BLOG_LINK = /^\/(zh|en)\/blog\/([^/#?]+)/;

/**
 * MDX `<a>` replacement (server component — `blogPostStatus` reads the filesystem).
 *
 * An internal link to a blog post that exists but hasn't reached its publish
 * date would 404, so it is rendered as plain, non-clickable text instead.
 * Published posts, unknown slugs, and external links all render as normal anchors.
 */
export function MdxLink({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (typeof href === 'string') {
    const match = BLOG_LINK.exec(href);
    if (match && blogPostStatus(match[2], match[1]) === 'unpublished') {
      return <span className="text-[var(--fg-subtle)]">{children}</span>;
    }
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

/** Component map passed to `<MDXRemote components={...} />`. */
export const mdxComponents = { a: MdxLink };
