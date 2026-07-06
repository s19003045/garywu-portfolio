import type { Options } from 'rehype-pretty-code';

/**
 * Shared rehype-pretty-code config for blog + case-study MDX rendering.
 * `keepBackground: false` drops Shiki's own background so the surrounding
 * `prose-pre:bg-[var(--bg-subtle)]` utility (see globals.css code-block rules)
 * stays the single source of truth for the block background in both themes.
 */
export const prettyCodeOptions: Partial<Options> = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
};
