import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const config = JSON.parse(await readFile(path.join(root, 'vercel.json')));
const types = { '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
const matches = (source, pathname) => source.endsWith('/(.*)') ? pathname.startsWith(source.slice(0, -4)) : source === pathname;

// Local acceptance server applies the tracked Vercel redirect/header policy.
// Production HTTP behavior is checked separately after the Git deployment.
export function createPreviewServer(port = 4173) {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      for (const rule of config.headers) if (matches(rule.source, pathname)) for (const header of rule.headers) response.setHeader(header.key, header.value);
      const redirect = config.redirects.find((rule) => rule.source === pathname);
      if (redirect) {
        response.writeHead(308, { Location: redirect.destination });
        return response.end();
      }
      if (config.trailingSlash === false && pathname !== '/' && pathname.endsWith('/')) {
        response.writeHead(308, { Location: pathname.slice(0, -1) + url.search });
        return response.end();
      }
      let target = config.rewrites.find((rule) => matches(rule.source, pathname))?.destination || pathname;
      if (target === '/') target = '/index.html';
      else if (!path.extname(target)) target += '.html';
      const file = path.resolve(dist, `.${target}`);
      if (!file.startsWith(`${dist}${path.sep}`)) throw new Error('Invalid path');
      let content;
      try {
        if (!(await stat(file)).isFile()) throw new Error('Not a file');
        content = await readFile(file);
        response.statusCode = 200;
      } catch {
        content = await readFile(path.join(dist, '404.html'));
        response.statusCode = 404;
        response.setHeader('Content-Type', types['.html']);
      }
      if (!response.hasHeader('Content-Type')) response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch (error) {
      response.statusCode = 500;
      response.end(error.message);
    }
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await createPreviewServer(Number(process.env.PORT || 4173));
  console.log(`Built site: http://127.0.0.1:${process.env.PORT || 4173}`);
}
