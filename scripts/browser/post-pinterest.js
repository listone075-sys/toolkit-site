/**
 * Pinterest Pin Creation Script — v3: Connects to YOUR running Chrome via CDP.
 *
 * Requires Chrome in debug mode (one-time):
 *   node scripts/browser/chrome-debug.js
 *
 * Usage:
 *   node scripts/browser/post-pinterest.js --image ./pin.png --title "..." --link "https://..."
 *   node scripts/browser/post-pinterest.js --batch ./pins.json
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const CDP_URL = "http://localhost:9222";

function parseArgs() {
  const args = {
    image: "", title: "", description: "",
    link: "", board: "Free Online Tools", batch: "", dryRun: false,
  };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") args.dryRun = true;
    else if (argv[i] === "--image" && argv[i + 1]) args.image = argv[++i];
    else if (argv[i] === "--title" && argv[i + 1]) args.title = argv[++i];
    else if (argv[i] === "--description" && argv[i + 1]) args.description = argv[++i];
    else if (argv[i] === "--link" && argv[i + 1]) args.link = argv[++i];
    else if (argv[i] === "--board" && argv[i + 1]) args.board = argv[++i];
    else if (argv[i] === "--batch" && argv[i + 1]) args.batch = argv[++i];
  }
  return args;
}

async function connectToChrome() {
  try {
    const browser = await chromium.connectOverCDP(CDP_URL);
    console.log("✅ Connected to your Chrome.");
    return browser;
  } catch {
    console.error("❌ Cannot connect to Chrome at", CDP_URL);
    console.error("   Start Chrome in debug mode: node scripts/browser/chrome-debug.js");
    process.exit(1);
  }
}

async function createPin(browser, { image, title, description, link, board, dryRun }) {
  console.log(`\n📌 "${title}"`);

  if (!fs.existsSync(image)) {
    console.error(`❌ Image not found: ${image}`);
    return false;
  }
  if (dryRun) {
    console.log("   [DRY RUN] Would create pin.");
    return true;
  }

  const page = await browser.newPage();

  try {
    await page.goto("https://www.pinterest.com/pin-builder/", {
      waitUntil: "domcontentloaded", timeout: 20000,
    });
    await page.waitForTimeout(3000);

    // Upload image
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.waitFor({ state: "attached", timeout: 15000 });
    await fileInput.setInputFiles(image);
    console.log("   ✅ Image uploaded");
    await page.waitForTimeout(3000);

    // Title
    const titleField = page.locator('[id*="title"], [data-test-id*="title"]').or(
      page.locator('input[placeholder*="title"], textarea[placeholder*="title"]').first(),
    );
    if (await titleField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await titleField.fill(title);
      console.log("   ✅ Title set");
    }

    // Description
    if (description) {
      const descField = page.locator('[data-test-id*="description"]').or(
        page.locator('textarea[placeholder*="description"], div[contenteditable="true"]').first(),
      );
      if (await descField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await descField.fill(description);
        console.log("   ✅ Description set");
      }
    }

    // Link
    const linkField = page.locator('[data-test-id*="link"]').or(
      page.locator('input[placeholder*="link"], input[placeholder*="url"], input[placeholder*="website"]').first(),
    );
    if (await linkField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await linkField.fill(link);
      console.log("   ✅ Link set");
    }

    // Board
    const boardBtn = page.locator('button:has-text("Board"), [data-test-id*="board"]').first();
    if (await boardBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await boardBtn.click();
      await page.waitForTimeout(1000);
      const boardOption = page.locator(`text="${board}"`).first();
      if (await boardOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await boardOption.click();
        console.log(`   ✅ Board "${board}"`);
      }
    }

    console.log("   Review in browser. Press Enter to publish...");
    await new Promise(r => process.stdin.once("data", () => r()));

    const saveBtn = page.locator('button:has-text("Save"), button:has-text("Publish")').first();
    if (await saveBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await saveBtn.click();
      await page.waitForTimeout(3000);
      console.log("   ✅ Published!");
    } else {
      console.log("   ⚠️  Couldn't find Save button. Check browser.");
      await page.screenshot({ path: "debug-pinterest.png" }).catch(() => {});
    }

    await page.close();
    return true;
  } catch (err) {
    console.error(`❌ ${err.message}`);
    await page.screenshot({ path: "debug-pinterest.png" }).catch(() => {});
    await page.close();
    return false;
  }
}

async function main() {
  const args = parseArgs();

  const pins = [];
  if (args.batch) {
    pins.push(...JSON.parse(fs.readFileSync(args.batch, "utf-8")));
  } else {
    if (!args.image || !args.title) {
      console.error("Usage: node scripts/browser/post-pinterest.js --image <file> --title <text> [--link <url>]");
      console.error("       node scripts/browser/post-pinterest.js --batch pins.json");
      process.exit(1);
    }
    pins.push({
      image: args.image,
      title: args.title,
      description: args.description || args.title,
      link: args.link || "https://toolcraftbox.com",
      board: args.board,
    });
  }

  console.log(`📌 Creating ${pins.length} pin(s)...`);
  const browser = await connectToChrome();

  let success = 0;
  for (const pin of pins) {
    if (await createPin(browser, { ...pin, dryRun: args.dryRun })) {
      success++;
    }
    if (pins.length > 1) await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n✅ ${success}/${pins.length} pins created.\n`);
}

main().catch(err => { console.error("Error:", err.message); process.exit(1); });
