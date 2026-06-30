/**
 * Twitter/X Posting Script — v11: Chrome Extension approach.
 *
 * REQUIRES (one-time setup):
 *   1. In Chrome, go to chrome://extensions
 *   2. Enable "Developer mode" (top-right toggle)
 *   3. Click "Load unpacked"
 *   4. Select: scripts/browser/extension/
 *
 * This approach uses a Chrome Extension that:
 *   - Runs in YOUR browser (all your logins persist)
 *   - Listens for commands via a local server
 *   - No killing Chrome, no CDP, no profile issues
 *
 * USE:
 *   node scripts/browser/post-twitter.js --text "Hello world"
 *   node scripts/browser/post-twitter.js --file tweet.txt
 *   echo "Hello" | node scripts/browser/post-twitter.js
 *
 * HOW IT WORKS:
 *   1. This script starts a local HTTP server (localhost:19876)
 *   2. Opens a trigger URL in Chrome
 *   3. The ToolCraft extension intercepts the URL
 *   4. Extension opens x.com/compose/post, fills text, clicks Post
 *   5. Extension signals back to the server → this script reports done
 */

const { execSync } = require("child_process");
const { start, stop, waitForResult } = require("./server");
const path = require("path");
const fs = require("fs");

function parseArgs() {
  const a = { text: "", file: "" };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--text" && argv[i + 1]) a.text = argv[++i];
    else if (argv[i] === "--file" && argv[i + 1]) a.file = argv[++i];
  }
  return a;
}

async function getText(args) {
  if (args.file) return fs.readFileSync(args.file, "utf-8").trim();
  if (args.text) return args.text;
  let d = "";
  return new Promise((r) => {
    process.stdin.on("data", (c) => (d += c));
    process.stdin.on("end", () => r(d.trim()));
    if (process.stdin.isTTY) {
      console.error("Usage: node scripts/browser/post-twitter.js --text <tweet>");
      console.error("       node scripts/browser/post-twitter.js --file <file.txt>");
      console.error("       echo 'hello' | node scripts/browser/post-twitter.js");
      process.exit(1);
    }
  });
}

function findChrome() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return "chrome"; // fallback to PATH
}

function checkExtensionInstalled() {
  // Check if the extension directory exists
  const extDir = path.join(__dirname, "extension");
  if (!fs.existsSync(extDir)) return false;
  if (!fs.existsSync(path.join(extDir, "manifest.json"))) return false;
  if (!fs.existsSync(path.join(extDir, "background.js"))) return false;
  return true;
}

async function main() {
  const args = parseArgs();
  const tweet = await getText(args);
  if (!tweet) {
    console.error("❌ Empty tweet.");
    process.exit(1);
  }
  if (tweet.length > 280) {
    console.warn(`⚠️  ${tweet.length} chars (limit 280). Twitter may truncate.`);
  }

  // Check extension files exist
  if (!checkExtensionInstalled()) {
    console.error("❌ Extension files missing!");
    console.error("   Expected: scripts/browser/extension/manifest.json");
    console.error("             scripts/browser/extension/background.js");
    process.exit(1);
  }

  console.log("🐦 Posting tweet via Chrome Extension...\n");
  console.log(`   📝 "${tweet.substring(0, 60)}${tweet.length > 60 ? "..." : ""}"\n`);

  // Start local coordination server
  await start();

  // Build trigger URL
  const triggerUrl = `http://localhost:19876/?action=postTweet&text=${encodeURIComponent(tweet)}`;

  // Open in Chrome
  console.log("   🚀 Opening Chrome...");
  const chromePath = findChrome();
  execSync(`start "" "${chromePath}" "${triggerUrl}"`, { stdio: "ignore" });
  console.log("   🔗 Trigger URL opened in Chrome.");
  console.log("   ⏳ Waiting for extension to post...\n");

  try {
    const result = await waitForResult();
    if (result.success) {
      console.log("✅ Tweet posted!\n");
    } else {
      console.error(`❌ Failed: ${result.error}\n`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ ${err.message}\n`);
    console.error("   💡 Make sure the ToolCraft Publisher extension is installed:");
    console.error("      1. Go to chrome://extensions");
    console.error("      2. Enable 'Developer mode' (top-right)");
    console.error("      3. Click 'Load unpacked'");
    console.error(`      4. Select: ${path.join(__dirname, "extension")}`);
    console.error("");
    process.exit(1);
  } finally {
    await stop();
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
