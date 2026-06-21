import { useTranslations } from 'next-intl';
import { Tag } from '@/components/ui/Tag';
import { tagHref, isBroadTag } from '@/lib/tags';

/**
 * Quick-access chips for the most-used tags — a secondary filter axis below the
 * categories. Broad tags (those on a large share of posts) are dropped via
 * {@link isBroadTag} so the list surfaces tags that actually narrow a search.
 */
export function PopularTags({
  tags,
  limit = 12,
}: {
  tags: Array<{ tag: string; count: number }>;
  limit?: number;
}) {
  const t = useTranslations('blog');
  const top = tags.filter(({ tag }) => !isBroadTag(tag)).slice(0, limit);
  if (top.length === 0) return null;

  return (
    <div className="mb-12">
      <p className="text-xs font-mono text-[var(--fg-subtle)] mb-3">{t('popular_tags')}</p>
      <div className="flex flex-wrap gap-2">
        {top.map(({ tag }) => (
          <Tag key={tag} label={tag} href={tagHref(tag)} />
        ))}
      </div>
    </div>
  );
}
