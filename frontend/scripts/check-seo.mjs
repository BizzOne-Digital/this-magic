import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PAGE_SEO, SITE_URL, DEFAULT_OG_IMAGE } from '../src/constants/seo.js';
import { GUIDES, guidePath } from '../src/data/guides.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const hosting = JSON.parse(await readFile(path.join(root, 'vercel.json')));
const pages = [...Object.values(PAGE_SEO), ...GUIDES.map((guide) => ({ path: guidePath(guide), title: `${guide.title} | This Magic Moment`, description: guide.description, h1: guide.title }))];
const decode = (text) => text.replace(/&amp;/g, '&').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], decode(match[2])]));
const documents = new Map();
for (const page of pages) {
  const html = await readFile(path.join(dist, page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`), 'utf8');
  documents.set(page.path, html);
  const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/g)].map((match) => attributes(match[0]));
  const meta = (name) => tags.filter((tag) => tag.name === name || tag.property === name);
  const canonicals = tags.filter((tag) => tag.rel === 'canonical');
  assert.equal((html.match(/<title\b/g) || []).length, 1, `${page.path}: one title`);
  assert.equal(decode(html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1]), page.title, `${page.path}: exact title`);
  assert.equal(meta('description').length, 1, `${page.path}: one description`);
  assert.equal(meta('description')[0].content, page.description, `${page.path}: description`);
  assert.equal(canonicals.length, 1, `${page.path}: one canonical`);
  assert.equal(canonicals[0].href, `${SITE_URL}${page.path}`, `${page.path}: canonical`);
  assert.equal(meta('og:url')[0]?.content, `${SITE_URL}${page.path}`, `${page.path}: social URL`);
  assert.equal(meta('og:image')[0]?.content, DEFAULT_OG_IMAGE.url);
  assert.equal(meta('twitter:image')[0]?.content, DEFAULT_OG_IMAGE.url);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page.path}: one H1`);
  assert.equal(decode(html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]), page.h1, `${page.path}: H1 matches metadata`);
  assert.ok(!meta('robots').some((tag) => /noindex/.test(tag.content)), `${page.path}: indexable`);
  assert.ok(html.includes('<nav') && html.includes('<main'), `${page.path}: real page navigation and content`);
  assert.ok(!html.includes('<!--seo-'), `${page.path}: all placeholders rendered`);
  assert.ok(!html.includes('href="/admin/login"'), `${page.path}: no customer-facing admin link`);
  assert.ok(!/href="https?:\/\/(?:www\.)?facebook.com\/?"/.test(html), `${page.path}: no placeholder Facebook`);
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) {
    const schema = JSON.parse(match[1]);
    assert.ok(schema['@context']);
    assert.ok(!/AggregateRating/.test(match[1]), 'No self-serving aggregate review stars');
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const image = attributes(match[0]);
    assert.ok('alt' in image, `${page.path}: image alt`);
    assert.ok(Number(image.width) > 0 && Number(image.height) > 0, `${page.path}: intrinsic dimensions for ${image.src}`);
    if (image.src.startsWith('/')) await access(path.join(dist, image.src));
    if (image.src.includes('cloudinary')) assert.ok(image.srcSet || image.srcset, `${page.path}: responsive CMS photo`);
  }
}
// Check every internal link against a real public page and a real fragment ID.
for (const [pathname, html] of documents) {
  for (const match of html.matchAll(/<a\b[^>]*>/g)) {
    const { href } = attributes(match[0]);
    if (!href || /^(?:https?:|tel:|mailto:)/.test(href)) continue;
    const url = new URL(href, `${SITE_URL}${pathname}`);
    const target = documents.get(url.pathname);
    assert.ok(target, `${pathname}: linked page exists: ${href}`);
    if (url.hash) assert.ok(target.includes(`id="${url.hash.slice(1)}"`), `${pathname}: linked fragment exists: ${href}`);
  }
}
const home = documents.get('/');
assert.equal((home.match(/<figure\b/g) || []).length, 8, 'All eight gallery photos');
assert.ok(!/<(?:figcaption|img)[^>]*(?:669a0515|c843e591|76d78614|c11896a0|42b5e8bc|c571b6c5|4408769f|92ef1705)/.test(home), 'No gallery UUID text');
assert.ok(home.includes('loading="eager"') && home.includes('fetchPriority="high"'), 'Eager primary hero');
assert.ok(!home.includes('/public1.png'), 'Optimized portrait delivered');
assert.ok(documents.get('/services').includes('Plan the sound and flow of your wedding'), 'Full service content in original HTML');
assert.ok(documents.get('/testimonials').includes('Client feedback shared by email'), 'Truthful review provenance');
assert.ok(documents.get('/contact').includes('event-inquiry'), 'Stable inquiry anchor');
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
assert.ok(sitemap.startsWith('<?xml') && sitemap.includes('http://www.sitemaps.org/schemas/sitemap/0.9'));
const listed = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(listed.sort(), pages.map((page) => `${SITE_URL}${page.path}`).sort(), 'Sitemap contains exactly the indexable pages');
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
assert.ok(robots.includes('User-agent: *') && robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`) && !robots.includes('<html'));
for (const file of ['app-shell.html', '404.html']) assert.match(await readFile(path.join(dist, file), 'utf8'), /name="robots" content="noindex/);
assert.ok(!hosting.rewrites.some((rule) => rule.source === '/(.*)' || rule.source === '/:path*'), 'No SPA catch-all that masks 404s');
assert.equal(hosting.cleanUrls, true, 'Clean URLs serve the generated HTML files');
for (const source of ['/index.html', '/djservices', '/affordable-dj-nj-special-savings/']) {
  assert.ok(hosting.redirects.some((rule) => rule.source === source && rule.permanent), `Permanent legacy redirect: ${source}`);
}
for (const pathname of ['/admin', '/admin/(.*)']) assert.ok(hosting.headers.some((rule) => rule.source === pathname && rule.headers.some((header) => header.key === 'X-Robots-Tag' && /noindex/.test(header.value))));
await access(path.join(dist, new URL(DEFAULT_OG_IMAGE.url).pathname));
console.log(`SEO acceptance checks passed for ${pages.length} complete public pages, all eight legacy URLs, crawl files, images, links and utility shells.`);

assert.equal(hosting.trailingSlash, undefined, 'Explicit slash redirects allow legacy offers to redirect directly');
for (const page of pages.filter((page) => page.path !== '/')) assert.ok(hosting.redirects.some((rule) => rule.source === page.path + '/' && rule.destination === page.path && rule.permanent), 'Canonical slash policy: ' + page.path);
