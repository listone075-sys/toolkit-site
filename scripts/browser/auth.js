/**
 * Browser Auth Helper — v3: Lightweight cookie import from system Chrome.
 *
 * Strategy:
 *   1. Check saved session (~/.toolcraft-browser/<platform>/).
 *   2. If expired, import cookies from your system Chrome profile.
 *      (Chrome must be CLOSED for 30 seconds while we read cookies.)
 *   3. Fall back: open Chrome for manual login.
 *
 * Usage:
 *   node scripts/browser/auth.js <twitter|pinterest>
 *   node scripts/browser/auth.js <platform> --import   (skip prompt, force import)
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const SESSION_DIR = path.join(
  process.env.HOME || process.env.USERPROFILE || ".",
  ".toolcraft-browser",
);

// ── Chrome profile paths ───────────────────────────────────────────────

function getChromeProfiles() {
  const base = process.platform === "win32"
    ? path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "User Data")
    : process.platform === "darwin"
      ? path.join(process.env.HOME || "", "Library", "Application Support", "Google", "Chrome")
      : path.join(process.env.HOME || "", ".config", "google-chrome");

  if (!fs.existsSync(base)) return [];

  return fs.readdirSync(base, { withFileTypes: true })
    .filter(e => e.isDirectory() && (e.name === "Default" || e.name.startsWith("Profile ")))
    .map(e => ({ name: e.name, dir: path.join(base, e.name) }));
}

function isChromeRunning() {
  try {
    const base = process.platform === "win32"
      ? path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "User Data")
      : path.join(process.env.HOME || "", ".config", "google-chrome");
    const lockFile = path.join(base, "SingletonLock");
    if (!fs.existsSync(lockFile)) return false;
    const fd = fs.openSync(lockFile, "r+");
    fs.closeSync(fd);
    return false;
  } catch {
    return true;
  }
}

async function waitForChromeClose() {
  let dots = 0;
  for (let i = 0; i < 60; i++) {
    if (!isChromeRunning()) return true;
    process.stdout.write(`\r   Waiting for Chrome to close${".".repeat(dots + 1)}   `);
    dots = (dots + 1) % 3;
    await new Promise(r => setTimeout(r, 1000));
  }
  process.stdout.write("\n");
  return false;
}

// ── Session check ───────────────────────────────────────────────────────

async function checkSession(userDataDir, platform) {
  if (!fs.existsSync(userDataDir)) return false;
  try {
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: "chrome",
      headless: true,
      args: ["--disable-blink-features=AutomationControlled"],
    });
    const page = await context.newPage();
    if (platform === "twitter") {
      await page.goto("https://x.com/home", { waitUntil: "domcontentloaded", timeout: 15000 });
      const ok = !page.url().includes("login");
      await context.close();
      return ok;
    }
    if (platform === "pinterest") {
      await page.goto("https://www.pinterest.com/", { waitUntil: "domcontentloaded", timeout: 15000 });
      const ok = !page.url().includes("login");
      await context.close();
      return ok;
    }
    await context.close();
    return false;
  } catch {
    return false;
  }
}

// ── Cookie import from system Chrome ────────────────────────────────────

async function importCookies(platform) {
  const profiles = getChromeProfiles();
  if (profiles.length === 0) {
    console.log("   ❌ No Chrome profiles found.\n");
    return false;
  }

  console.log(`   Found ${profiles.length} Chrome profile(s): ${profiles.map(p => p.name).join(", ")}`);

  if (isChromeRunning()) {
    console.log("\n   ⚠️  Chrome is running — its cookie file is locked.");
    console.log("   Please CLOSE all Chrome windows, then press Enter.");
    await new Promise(resolve => process.stdin.once("data", () => resolve()));
    console.log("");

    if (!await waitForChromeClose()) {
      console.log("   ⚠️  Chrome didn't close in time. Skipping import.\n");
      return false;
    }
    // Give Windows a moment to release the file lock
    await new Promise(r => setTimeout(r, 2000));
  }

  for (const profile of profiles) {
    console.log(`\n   Trying "${profile.name}"...`);

    try {
      // Open the Chrome profile with Playwright (Chrome is closed so no lock)
      const context = await chromium.launchPersistentContext(profile.dir, {
        channel: "chrome",
        headless: true,
        args: ["--disable-blink-features=AutomationControlled"],
      });

      const page = await context.newPage();

      let loggedIn = false;

      if (platform === "twitter") {
        await page.goto("https://x.com/home", { waitUntil: "domcontentloaded", timeout: 15000 });
        loggedIn = !page.url().includes("login");
      } else if (platform === "pinterest") {
        await page.goto("https://www.pinterest.com/", { waitUntil: "domcontentloaded", timeout: 15000 });
        loggedIn = !page.url().includes("login");
      }

      if (loggedIn) {
        // Export cookies to lightweight storage state
        const storageFile = path.join(SESSION_DIR, `${platform}.json`);
        await context.storageState({ path: storageFile });
        await context.close();
        console.log(`   ✅ Imported session from "${profile.name}"!`);
        console.log(`   Saved to: ${storageFile}`);
        console.log("   You can reopen Chrome now.");
        return true;
      }

      await context.close();
      console.log(`   ✗ "${profile.name}" is not logged into ${platform}.`);
    } catch (err) {
      console.log(`   Error: ${err.message}`);
    }
  }

  console.log(`\n   ❌ No Chrome profile has a valid ${platform} session.\n`);
  return false;
}

// ── Load session from storageState JSON ──────────────────────────────────

async function loadSession(platform) {
  const storageFile = path.join(SESSION_DIR, `${platform}.json`);
  if (!fs.existsSync(storageFile)) return null;

  try {
    // Fire up a headless check to verify the cookies still work
    const context = await chromium.launchPersistentContext(
      path.join(SESSION_DIR, platform),
      {
        channel: "chrome",
        headless: true,
        args: ["--disable-blink-features=AutomationControlled"],
      },
    );
    const page = await context.newPage();

    let ok = false;
    if (platform === "twitter") {
      await page.goto("https://x.com/home", { waitUntil: "domcontentloaded", timeout: 15000 });
      ok = !page.url().includes("login");
    } else if (platform === "pinterest") {
      await page.goto("https://www.pinterest.com/", { waitUntil: "domcontentloaded", timeout: 15000 });
      ok = !page.url().includes("login");
    }

    if (ok) {
      // Refresh the storage state
      await context.storageState({ path: storageFile });
    }
    await context.close();

    return ok ? storageFile : null;
  } catch {
    return null;
  }
}

// ── Manual login ────────────────────────────────────────────────────────

async function manualLogin(platform) {
  const userDataDir = path.join(SESSION_DIR, platform);
  if (fs.existsSync(userDataDir)) {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }

  console.log(`🔐 Opening ${platform} for manual login...\n`);

  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: "chrome",
    headless: false,
    viewport: { width: 1280, height: 800 },
    args: ["--disable-blink-features=AutomationControlled"],
    ignoreDefaultArgs: ["--enable-automation"],
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  if (platform === "twitter") {
    await page.goto("https://x.com/login", { waitUntil: "domcontentloaded" });
  } else if (platform === "pinterest") {
    await page.goto("https://www.pinterest.com/login/", { waitUntil: "domcontentloaded" });
  }

  console.log("✅ Login page loaded. Log in, then close the browser.\n");
  await new Promise(() => {});
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  const platform = process.argv[2];
  const forceImport = process.argv.includes("--import");

  if (!platform) {
    console.error("Usage: node scripts/browser/auth.js <twitter|pinterest> [--import]");
    process.exit(1);
  }

  console.log(`\n🔍 ToolCraft Browser Auth — ${platform}\n`);

  // Step 1: Check existing session
  console.log("1️⃣  Checking saved session...");
  const existing = await loadSession(platform);
  if (existing) {
    console.log(`   ✅ Already logged in! (${existing})\n`);
    return;
  }
  console.log("   No valid session.\n");

  // Step 2: Try importing from system Chrome
  if (forceImport) {
    console.log("2️⃣  Importing cookies from your Chrome...");
    const ok = await importCookies(platform);
    if (ok) {
      console.log("\n✅ Ready!\n");
      return;
    }
  }

  // Step 3: Ask
  console.log("How to authenticate?");
  console.log("  [1] Import from my Chrome  (close Chrome → import cookies → reopen)");
  console.log("  [2] Open browser & log in manually");
  console.log("  [3] Exit");
  process.stdout.write("\nChoose (1/2/3): ");

  const choice = await new Promise(r => process.stdin.once("data", d => r(d.toString().trim())));
  console.log("");

  if (choice === "1") {
    const ok = await importCookies(platform);
    if (ok) {
      return console.log("✅ Ready!\n");
    }
    console.log("Falling back to manual login...\n");
    await manualLogin(platform);
  } else if (choice === "2") {
    await manualLogin(platform);
  } else {
    console.log("Cancelled.");
  }
}

main().catch(err => { console.error("Error:", err.message); process.exit(1); });
