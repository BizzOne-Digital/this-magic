import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';
import { createPreviewServer } from './serve-built.mjs';

const reports = new URL('../seo-reports/', import.meta.url);
await mkdir(reports, { recursive: true });
const server = process.env.SEO_BASE_URL ? null : await createPreviewServer(4174);
const base = process.env.SEO_BASE_URL || 'http://127.0.0.1:4174';
const chromePath = process.env.CHROME_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check'] });
const results = [];
try {
  for (const device of ['mobile', 'desktop']) {
    for (const pathname of ['/', '/about', '/services', '/testimonials', '/contact']) {
      const slug = pathname.slice(1) || 'home';
      const result = await lighthouse(base + pathname, {
        port: chrome.port, output: 'json', logLevel: 'error',
        onlyCategories: ['performance', 'seo', 'accessibility', 'best-practices'],
        maxWaitForLoad: 45000,
      }, device === 'desktop' ? desktopConfig : undefined);
      if (!result?.lhr || result.lhr.runtimeError) throw new Error(result?.lhr?.runtimeError?.message || 'No Lighthouse result');
      await writeFile(new URL(`${slug}-${device}.json`, reports), result.report);
      const { lhr } = result;
      const metrics = {
        device, path: pathname,
        performance: Math.round(lhr.categories.performance.score * 100),
        seo: Math.round(lhr.categories.seo.score * 100),
        accessibility: Math.round(lhr.categories.accessibility.score * 100),
        lcpMs: Math.round(lhr.audits['largest-contentful-paint'].numericValue),
        tbtMs: Math.round(lhr.audits['total-blocking-time'].numericValue),
        cls: lhr.audits['cumulative-layout-shift'].numericValue,
      };
      results.push(metrics);
      console.log(JSON.stringify(metrics));
      await writeFile(new URL('performance-summary.json', reports), JSON.stringify({ base, environment: 'Lighthouse lab measurements; field INP and Search Console require owner access', results }, null, 2));
    }
  }
} finally {
  await chrome.kill();
  server?.close();
}
