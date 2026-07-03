// Smoke test：快速驗證網站主要路由都活著，適合接進 CI 或
// k6-observability-stack 的 `make smoke` 之類流程。不模擬真實流量分佈，
// 也不觸碰 /api/contact（會實際觸發寄信 / Gmail API，見 README）。
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  vus: 3,
  duration: '20s',
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

const CHECKS = [
  { path: '/zh', name: 'home-zh' },
  { path: '/en', name: 'home-en' },
  { path: '/zh/blog', name: 'blog-list-zh' },
  { path: '/zh/case-studies', name: 'case-studies-list-zh' },
  { path: '/zh/resume', name: 'resume-zh' },
  { path: '/sitemap.xml', name: 'sitemap' },
  { path: '/robots.txt', name: 'robots' },
  { path: '/feed.xml', name: 'feed' },
  { path: '/opengraph-image', name: 'opengraph-image' },
];

export default function () {
  for (const { path, name } of CHECKS) {
    const res = http.get(`${BASE_URL}${path}`, { tags: { name } });
    check(res, { [`${name} returns 200`]: (r) => r.status === 200 });
  }
  sleep(1);
}
