import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { PAGE_SEO, SITE_URL, SITE_NAME } from '../src/constants/seo.js';
import { GUIDES, guidePath } from '../src/data/guides.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const serverDir = path.join(root, '.prerender');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--seo-body-->')) throw new Error('Missing static-rendering placeholders');

await build({
  root,
  configFile: false,
  plugins: [react()],
  ssr: { noExternal: ['react-helmet-async'] },
  build: { ssr: 'src/entry-server.jsx', outDir: serverDir, emptyOutDir: true, rollupOptions: { output: { manualChunks: undefined } } },
});

try {
  const { render } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href);
  const write = async (file, { head, body }) => {
    const output = path.join(dist, file);
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, template.replace(/<title>[\s\S]*?<\/title>/, '')
      .replace('<div id="root">', body ? '<div id="root" data-prerendered="true">' : '<div id="root">')
      .replace('<!--seo-head-->', head).replace('<!--seo-schema-->', '').replace('<!--seo-body-->', body));
    console.log(`Rendered complete page: ${file}`);
  };
  const paths = [...Object.values(PAGE_SEO).map((page) => page.path), ...GUIDES.map(guidePath)];
  for (const pathname of paths) {
    await write(pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`, render(pathname));
  }
  await write('404.html', render('/__not_found__'));
  await write('app-shell.html', {
    head: `<title>${SITE_NAME} Admin</title><meta name="robots" content="noindex, nofollow" />`,
    body: '',
  });
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((pathname) => `  <url><loc>${SITE_URL}${pathname}</loc></url>`).join('\n')}\n</urlset>\n`);
} finally {
  if (path.dirname(serverDir) !== root || path.basename(serverDir) !== '.prerender') throw new Error('Unexpected temporary bundle path');
  await rm(serverDir, { recursive: true, force: true });
}
