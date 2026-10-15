import { readFile, writeFile } from 'node:fs/promises';
import { loadEnv } from 'vite';
import { normalizePublicData } from '../src/data/normalize-public.js';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const api = env.PUBLIC_CONTENT_API_URL || env.VITE_API_URL;
const snapshotFile = new URL('../src/data/public-content.json', import.meta.url);
const snapshot = JSON.parse(await readFile(snapshotFile, 'utf8'));

// Local/offline builds use the checked-in public snapshot. Production refreshes
// it before either bundle is compiled, keeping source and browser content equal.
if (api && /^https?:\/\//.test(api)) {
  const results = await Promise.allSettled(Object.keys(snapshot).map(async (key) => {
    const response = await fetch(`${api.replace(/\/$/, '')}/${key}${key === 'gallery' ? '?limit=8' : ''}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`${key}: HTTP ${response.status}`);
    const body = await response.json();
    if (!body.success || (key === 'content' ? !body.data || Array.isArray(body.data) : !Array.isArray(body.data))) {
      throw new Error(`${key}: invalid public content response`);
    }
    return [key, body.data];
  }));
  for (const result of results) {
    if (result.status === 'fulfilled') snapshot[result.value[0]] = normalizePublicData(result.value[0], result.value[1], snapshot);
    else console.warn(`Keeping last published content: ${result.reason.message}`);
  }
  await writeFile(snapshotFile, `${JSON.stringify(snapshot, null, 2)}\n`);
} else {
  console.log('Using the approved public content snapshot (no absolute content API configured).');
}
