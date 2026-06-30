/**
 * Start Chrome in remote debugging mode.
 * Handles VPN interference by binding to 127.0.0.1 explicitly.
 *
 * Usage:
 *   node scripts/browser/chrome-debug.js
 *
 * This will:
 *   1. Kill ALL Chrome processes
 *   2. Start Chrome bound to 127.0.0.1:9222 (VPN-proof)
 *   3. Verify the debug port is working
 */

const { execSync } = require("child_process");
const net = require("http");
const path = require("path");
const fs = require("fs");

const PORT = 9222;
const HOST = "127.0.0.1";

function findChrome() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return null;
}

function killChrome() {
  try {
    execSync('taskkill /F /IM chrome.exe 2>nul', { stdio: "ignore" });
  } catch { /* ok if no chrome running */ }
}

async function checkPort() {
  return new Promise((resolve) => {
    const req = net.get(`http://${HOST}:${PORT}/json/version`, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({ ok: true, version: json.Browser });
        } catch {
          resolve({ ok: true, version: "unknown" });
        }
      });
    });
    req.on("error", () => resolve({ ok: false }));
    req.setTimeout(2000, () => { req.destroy(); resolve({ ok: false }); });
  });
}

async function main() {
  console.log("🔧 Chrome Remote Debugging Setup\n");

  // Check if already working
  const existing = await checkPort();
  if (existing.ok) {
    console.log(`✅ Chrome debug already active (Chrome ${existing.version})`);
    console.log("   You can now post tweets directly from your browser.\n");
    return;
  }

  const chromePath = findChrome();
  if (!chromePath) {
    console.error("❌ Chrome not found. Please install Chrome.");
    process.exit(1);
  }

  console.log("Killing all Chrome processes...");
  killChrome();
  await new Promise((r) => setTimeout(r, 3000));

  console.log("Starting Chrome with remote debugging...");
  console.log(`  Path: ${chromePath}`);
  console.log(`  Debug: ${HOST}:${PORT}\n`);

  // Use start to detach from terminal
  const cmd = `start "ChromeDebug" "${chromePath}" --remote-debugging-port=${PORT} --remote-debugging-address=${HOST} --remote-allow-origins=* --no-first-run --no-default-browser-check`;
  execSync(cmd, { stdio: "ignore" });

  // Wait for port
  console.log("Waiting for Chrome to start...");
  for (let i = 1; i <= 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const result = await checkPort();
    if (result.ok) {
      console.log(`\n✅ Chrome started with debug mode! (${result.version})`);
      console.log(`   Debug endpoint: http://${HOST}:${PORT}`);
      console.log("");
      console.log("Now you can post tweets. Try:");
      console.log('  node scripts/browser/post-twitter.js --text "Hello world"');
      console.log("");
      console.log("💡 Keep this Chrome running. Close it and you'll need to re-run this script.\n");
      return;
    }
    if (i % 5 === 0) process.stdout.write(`   ${i}s...`);
  }

  console.error("\n❌ Chrome debug mode failed to start.");
  console.error("   This may be caused by:");
  console.error("   - VPN/proxy software intercepting connections");
  console.error("   - Antivirus blocking the debug port");
  console.error("   - Chrome enterprise policies");
  console.error("");
  console.error("   Try manually:");
  console.error(`     Close all Chrome, then run:`);
  console.error(`     "${chromePath}" --remote-debugging-port=${PORT} --remote-debugging-address=${HOST}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
