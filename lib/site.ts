/**
 * Central site configuration.
 * Single source of truth for domain, profile links, and contact info.
 */

export const siteConfig = {
  name: 'Gary Wu',
  url: 'https://garywudev.deepwaterslife.com',
  domain: 'garywudev.deepwaterslife.com',
  title: 'Gary Wu — Senior Full-Stack Engineer',
  description:
    '資深全端工程師，運用 AI 與現代技術優化工業系統與工作流程。Senior Full-Stack Engineer applying AI and modern technology to industrial systems, edge-to-cloud architecture, and cross-system integration.',
  jobTitle: 'Senior Full-Stack Engineer',
  links: {
    linkedin: 'https://www.linkedin.com/in/chen-hsien-wu/',
    github: 'https://github.com/s19003045',
    medium: 'https://medium.com/coding-with-fun-favor',
  },
  email: 's19003045@gmail.com',
  locales: ['zh', 'en'] as const,
  defaultLocale: 'zh' as const,
} as const;

export type SiteConfig = typeof siteConfig;
