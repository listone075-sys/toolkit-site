/**
 * IndexNow submission script — notifies Bing & Yandex of new/updated pages.
 *
 * Usage:
 *   INDEXNOW_KEY=xxx npx tsx scripts/submit-indexnow.ts
 *   INDEXNOW_KEY=xxx SITE_URL=https://toolcraftbox.com npx tsx scripts/submit-indexnow.ts
 *
 * The IndexNow key must be served as a text file at the site root, e.g.
 * https://toolcraftbox.com/xxx.txt → contains "xxx"
 * This is configured via a rewrite in next.config.ts.
 *
 * See: https://www.indexnow.org/documentation
 */

// Load .env.local for standalone execution (Next.js autoloads it, npx tsx does not)
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  } catch {
    // .env.local not found — proceed with existing env
  }
}
loadEnvLocal();

const SITE_URL = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "";

// High-priority pages to submit (in addition to sitemap discovery)
const KEY_URLS = [
  "",
  "/en",
  "/zh",
  "/en/blog",
  "/zh/blog",
  "/en/tools/image-compressor",
  "/en/tools/pdf-to-jpg",
  "/en/tools/markdown-editor",
  "/en/tools/json-formatter",
  "/en/tools/heic-to-jpg",
  "/en/tools/webp-to-jpg",
  "/en/tools/jpg-to-pdf",
  "/en/tools/merge-pdf",
  "/en/tools/markdown-to-html",
  "/en/tools/markdown-table-generator",
  "/en/tools/base64-encode-decode",
  "/en/tools/uuid-generator",
];

function getHost(url: string): string {
  return new URL(url).host;
}

async function submitIndexNow(urls: string[]) {
  const host = getHost(SITE_URL);

  console.log(`[IndexNow] Submitting ${urls.length} URLs for ${host}...`);

  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      console.log(`[IndexNow] ✅ Successfully submitted ${urls.length} URLs.`);
    } else {
      const text = await res.text();
      console.error(`[IndexNow] ❌ API error ${res.status}: ${text}`);
      process.exitCode = 1;
    }
  } catch (err) {
    console.error(`[IndexNow] ❌ Network error: ${(err as Error).message}`);
    process.exitCode = 1;
  }
}

async function main() {
  if (!INDEXNOW_KEY) {
    console.log("[IndexNow] No INDEXNOW_KEY set — skipping submission.");
    console.log("[IndexNow] Generate a key at https://www.bing.com/indexnow/getstarted");
    return;
  }

  const urls = KEY_URLS.map((path) => `${SITE_URL}${path}`);
  await submitIndexNow(urls);
}

main();
