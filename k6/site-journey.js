// 模擬真實訪客瀏覽路徑的負載測試：先讀 /sitemap.xml 找出真實存在的頁面
// （文章、案例研究、分類/標籤/系列頁），再依照大致的瀏覽權重隨機走訪，
// 而不是打固定寫死的幾條 URL。新增文章、案例不需要改這支腳本。
//
// 不包含 /api/contact —— 那是會寄出真實 email 的端點，見 README 說明。
import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { discoverPages, pickRandom } from './lib/discover.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const VUS = Number(__ENV.VUS || 10);
const RAMP_TIME = __ENV.RAMP_TIME || '30s';
const DURATION = __ENV.DURATION || '2m';

export const options = {
  scenarios: {
    site_journey: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: RAMP_TIME, target: VUS },
        { duration: DURATION, target: VUS },
        { duration: RAMP_TIME, target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.02'],
  },
};

export function setup() {
  const pages = discoverPages(BASE_URL);
  return { pages };
}

function visit(path, name) {
  if (!path) return null;
  const res = http.get(`${BASE_URL}${path}`, { tags: { name } });
  check(res, { [`${name}: status 200`]: (r) => r.status === 200 });
  return res;
}

function visitRandom(paths, name) {
  return visit(pickRandom(paths), name);
}

function thinkTime(min = 1, max = 3) {
  sleep(min + Math.random() * (max - min));
}

export default function ({ pages }) {
  // ~50/50 語系分佈；沒有實際流量資料可參考,先假設對半。
  const locale = Math.random() < 0.5 ? 'zh' : 'en';
  const p = pages[locale];

  group('landing', () => {
    visitRandom(p.home.length ? p.home : [`/${locale}`], 'home');
    thinkTime();
  });

  // 大部分訪客會晃到一個靜態頁面(about/experience/projects/lab/resume/connect)。
  if (Math.random() < 0.6) {
    group('static pages', () => {
      visitRandom(p.staticPage, 'static-page');
      thinkTime();
    });
  }

  group('blog', () => {
    visitRandom(p.blogList.length ? p.blogList : [`/${locale}/blog`], 'blog-list');
    thinkTime();

    if (p.blogPost.length && Math.random() < 0.8) {
      visitRandom(p.blogPost, 'blog-post');
      thinkTime();
      // 讀完一篇之後,有些人會再點一篇(模擬 related posts / 系列導覽的點擊)。
      if (Math.random() < 0.3) {
        visitRandom(p.blogPost, 'blog-post');
        thinkTime();
      }
    }
    if (Math.random() < 0.25) visitRandom(p.blogCategory, 'blog-category');
    if (Math.random() < 0.2) visitRandom(p.blogTag, 'blog-tag');
    if (Math.random() < 0.15) visitRandom(p.blogSeries, 'blog-series');
    if (Math.random() < 0.1) {
      visitRandom(p.blogArchive.length ? p.blogArchive : [`/${locale}/blog/archive`], 'blog-archive');
    }
  });

  if (Math.random() < 0.4) {
    group('case studies', () => {
      visitRandom(
        p.caseStudyList.length ? p.caseStudyList : [`/${locale}/case-studies`],
        'case-study-list',
      );
      thinkTime();
      if (p.caseStudy.length) {
        visitRandom(p.caseStudy, 'case-study-detail');
        thinkTime();
      }
    });
  }

  // 頁面 <head> 裡的 OG image 之類 metadata image 平常是瀏覽器自動抓的,
  // 這裡用低機率模擬,不必每次都打。
  if (Math.random() < 0.2) {
    visit('/opengraph-image', 'opengraph-image');
  }

  // 爬蟲 / RSS reader 流量,量很小但真實存在。
  if (Math.random() < 0.05) {
    group('crawlers and feeds', () => {
      visit('/sitemap.xml', 'sitemap');
      visit('/robots.txt', 'robots');
      visit('/feed.xml', 'feed');
    });
  }

  thinkTime(2, 5);
}
