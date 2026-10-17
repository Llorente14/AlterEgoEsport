// Checks every external link the site shows (data/links.json) and reports which ones are broken.
// Run by hand or in CI: `npm run check:links`. Not part of `build`, so a slow or blocking third-party site
// never fails a deploy. Exit code 1 only when a link is truly broken (404/410, DNS failure, timeout, 5xx).
// Shopee, Tokopedia and social sites often answer bots with 403/429/999: those are reported as "blocked",
// to be checked by hand in a browser.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const TIMEOUT_MS = 10_000;
const CONCURRENCY = 4;
const USER_AGENT = 'AlterEgoWeb-linkcheck/1.0';

/**
 * Every external URL from the links file, in display order, each once.
 * @param {object} links parsed data/links.json
 * @returns {{ label: string; url: string }[]}
 */
export function collectExternalUrls(links) {
  const entries = [
    ...links.shopee.map((s) => ({ label: s.label, url: s.url })),
    { label: links.tokopedia.label, url: links.tokopedia.url },
    { label: links.whatsapp.label, url: links.whatsapp.url },
    { label: `Maps · ${links.offlineStore.name}`, url: links.offlineStore.mapsUrl },
    ...Object.values(links.social)
      .flat()
      .map((s) => ({ label: `${s.platform} ${s.handle}`, url: s.url })),
    { label: 'Linktree', url: links.linktree },
  ];

  const seen = new Set();
  const unique = [];
  for (const entry of entries) {
    if (!/^https?:\/\/\S+$/.test(entry.url)) {
      throw new Error(`Link tidak valid (harus http/https absolut): ${entry.label} → ${entry.url}`);
    }
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    unique.push(entry);
  }
  return unique;
}

/**
 * Verdict for one result: `{ status }` from an HTTP response or `{ error }` from the network.
 * @param {{ status?: number; error?: string }} result
 * @returns {'ok' | 'blocked' | 'broken'}
 */
export function classify(result) {
  if (result.error !== undefined) return 'broken';
  const { status } = result;
  if (status >= 200 && status < 400) return 'ok';
  if (status === 403 || status === 429 || status === 999) return 'blocked';
  return 'broken';
}

/** One request: HEAD first (cheap), GET when the server does not accept HEAD. */
async function probe(url) {
  const attempt = async (method) => {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    await res.body?.cancel();
    return { status: res.status };
  };
  try {
    const head = await attempt('HEAD');
    if (classify(head) === 'ok') return head;
    return await attempt('GET');
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}

async function checkAll(entries) {
  const results = new Array(entries.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < entries.length) {
        const index = next++;
        const result = await probe(entries[index].url);
        results[index] = { ...entries[index], result, verdict: classify(result) };
      }
    }),
  );
  return results;
}

function detail(result) {
  return result.error !== undefined ? result.error : `HTTP ${result.status}`;
}

async function main() {
  const file = join(fileURLToPath(new URL('../../..', import.meta.url)), 'data', 'links.json');
  const entries = collectExternalUrls(JSON.parse(readFileSync(file, 'utf-8')));
  const results = await checkAll(entries);

  for (const r of results) {
    const mark = { ok: 'OK     ', blocked: 'BLOCKED', broken: 'BROKEN ' }[r.verdict];
    console.log(`${mark}  ${detail(r.result).padEnd(12)}  ${r.label}  ${r.url}`);
  }
  const count = (v) => results.filter((r) => r.verdict === v).length;
  console.log(
    `\n${results.length} link: ${count('ok')} ok, ${count('blocked')} diblokir (cek manual di browser), ${count('broken')} rusak`,
  );
  if (count('broken') > 0) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main();
}
