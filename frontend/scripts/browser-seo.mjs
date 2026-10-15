import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { chromium, devices, expect } from '@playwright/test';
import { createPreviewServer } from './serve-built.mjs';
import { PAGE_SEO, SITE_URL } from '../src/constants/seo.js';
import { GUIDES, guidePath } from '../src/data/guides.js';

const snapshot = JSON.parse(await readFile(new URL('../src/data/public-content.json', import.meta.url)));
const chrome = process.env.CHROME_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const server = await createPreviewServer();
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const base = 'http://127.0.0.1:4173';
const results = [];
const pages = [...Object.values(PAGE_SEO), ...GUIDES.map((guide) => ({ path: guidePath(guide), title: `${guide.title} | This Magic Moment`, h1: guide.title, description: guide.description }))];
await mkdir(new URL('../seo-reports/', import.meta.url), { recursive: true });

try {
  for (const [pathname, destination] of [['/index.html', '/'], ['/djservices', '/services'], ['/affordable-dj-nj-special-savings/', '/#offers']]) {
    const response = await fetch(base + pathname, { redirect: 'manual' });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), destination);
  }
  for (const pathname of ['/not-a-real-page', '/post/not-a-real-article']) assert.equal((await fetch(base + pathname)).status, 404);
  for (const pathname of ['/robots.txt', '/llms.txt', '/sitemap.xml']) {
    const response = await fetch(base + pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), pathname.endsWith('.xml') ? /xml/ : /text\/plain/);
  }
  for (const pathname of ['/admin/login', '/admin/dashboard']) {
    const response = await fetch(base + pathname);
    assert.match(response.headers.get('x-robots-tag'), /noindex/);
    assert.match(await response.text(), /name="robots" content="noindex/);
  }
  for (const [device, options] of [['desktop', { viewport: { width: 1440, height: 1000 } }], ['mobile', devices['iPhone 13']]].filter(([name]) => !process.env.SEO_DEVICE || process.env.SEO_DEVICE === name)) {
    const context = await browser.newContext(options);
    await context.route('**/api/**', async (route) => {
      const key = new URL(route.request().url()).pathname.split('/').pop();
      await route.fulfill({ json: { success: true, data: snapshot[key] || [] } });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error' && /Minified React error|hydration/i.test(message.text())) errors.push(message.text()); });
    for (const config of pages) {
      await Promise.all([
        page.waitForResponse((response) => response.url().endsWith('/api/content')),
        page.goto(base + config.path, { waitUntil: 'domcontentloaded' }),
      ]);
      await expect(page).toHaveTitle(config.title);
      await expect(page.locator('h1')).toHaveText(config.h1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), SITE_URL + config.path);
      assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), config.description);
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), SITE_URL + config.path);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${device} ${config.path}: no horizontal overflow`);
      assert.deepEqual(errors, [], `${device} ${config.path}: no hydration/runtime exceptions`);
      results.push({ device, path: config.path, status: 'passed' });
    }
    await page.goto(base + '/');
    if (device === 'mobile') await page.getByRole('button', { name: 'Toggle menu' }).click();
    await page.locator('header a[href="/about"]').filter({ visible: true }).first().click();
    await expect(page).toHaveTitle(PAGE_SEO.about.title);
    if (device === 'mobile') await page.getByRole('button', { name: 'Toggle menu' }).click();
    await page.locator('header a[href="/services"]').filter({ visible: true }).first().click();
    await expect(page).toHaveTitle(PAGE_SEO.services.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), SITE_URL + '/services');
    await page.goto(base + '/contact#event-inquiry');
    await expect(page.locator('#event-inquiry')).toBeVisible();
    const questions = page.locator('button[aria-expanded]').filter({ hasText: '?' });
    await questions.nth(1).click();
    assert.equal(await questions.nth(1).getAttribute('aria-expanded'), 'true');
    // Exercise the inquiry UI with an intercepted API, without creating a real lead or sending email.
    let inquiry;
    await page.route('**/api/leads', async (route) => {
      inquiry = route.request().postDataJSON();
      await route.fulfill({ json: { success: true, message: 'Test inquiry accepted.' } });
    });
    await page.locator('#name').fill('SEO UI Test');
    await page.locator('#phone').fill('7325550123');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#eventType').selectOption({ label: 'Wedding' });
    await page.locator('#message').fill('Intercepted local UI test only.');
    await page.getByRole('button', { name: 'Send My Inquiry' }).click();
    await expect(page.getByText('Test inquiry accepted.')).toBeVisible();
    assert.equal(inquiry.eventType, 'Wedding');
    await page.screenshot({ path: new URL(`../seo-reports/contact-${device}.png`, import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'), fullPage: true });
    await page.goto(base + '/');
    await page.screenshot({ path: new URL(`../seo-reports/home-${device}.png`, import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'), fullPage: true });
    assert.deepEqual(errors, [], `${device}: no JavaScript exceptions`);
    await context.close();
    console.log(`${device}: ${pages.length} pages, navigation, canonical updates, FAQs and intercepted inquiry passed.`);
  }
  await writeFile(new URL('../seo-reports/browser.json', import.meta.url), JSON.stringify({ results, forms: 'Mocked API only; live email delivery not tested', routing: 'Tracked Vercel policy simulated locally' }, null, 2));
} finally {
  await browser.close();
  server.close();
}
