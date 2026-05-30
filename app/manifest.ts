import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: 'Gary Wu',
    description: siteConfig.description,
    start_url: '/zh',
    display: 'standalone',
    background_color: '#0D1117',
    theme_color: '#0D1117',
    icons: [
      {
        src: '/garywu.webp',
        sizes: 'any',
        type: 'image/webp',
      },
    ],
  };
}
