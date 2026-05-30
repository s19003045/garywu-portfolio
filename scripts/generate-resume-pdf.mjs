/**
 * Generate downloadable résumé PDFs from the live /resume pages.
 *
 * Usage:
 *   1. Build & start the server:  npm run build && npm run start
 *   2. In another shell:          npm run resume:pdf
 *
 * Outputs (served as static files):
 *   public/resume.pdf      ← /zh/resume
 *   public/resume.en.pdf   ← /en/resume
 *
 * Re-run whenever résumé content changes. BASE_URL overrides the target host.
 */
import puppeteer from 'puppeteer';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

const targets = [
  { url: `${BASE}/zh/resume`, out: 'public/resume.pdf' },
  { url: `${BASE}/en/resume`, out: 'public/resume.en.pdf' },
];

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  for (const { url, out } of targets) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.emulateMediaType('print');
    // Wait for webfonts to settle so text isn't measured with fallback metrics.
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: out,
      printBackground: true,
      preferCSSPageSize: true, // honour @page { size: A4; margin } from globals.css
    });
    await page.close();
    console.log(`✓ wrote ${out}  (${url})`);
  }
} finally {
  await browser.close();
}
