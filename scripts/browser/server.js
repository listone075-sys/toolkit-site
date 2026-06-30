/**
 * Local coordination server for the ToolCraft Publisher Chrome Extension.
 *
 * How it works:
 *   1. This server starts on localhost:19876
 *   2. post-twitter.js opens a trigger URL in Chrome
 *   3. The extension intercepts the URL, does the work
 *   4. Extension opens a result URL → server captures it, shuts down
 *
 * One-time setup:
 *   In Chrome, go to chrome://extensions, enable "Developer mode",
 *   click "Load unpacked", select scripts/browser/extension/
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 19876;
const TIMEOUT = 120000; // 2 min max wait

let resolveResult;
let resultPromise = new Promise((r) => (resolveResult = r));

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
  const action = reqUrl.searchParams.get("action");
  const result = reqUrl.searchParams.get("ok");
  const error = reqUrl.searchParams.get("error");

  // Result URL from extension
  if (result === "1") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<html><body><h1>✅ Done!</h1><p>You can close this tab.</p></body></html>");
    resolveResult({ success: true });
    return;
  }

  if (error) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<html><body><h1>❌ Error</h1><p>${error}</p></body></html>`);
    resolveResult({ success: false, error });
    return;
  }

  // Trigger page — shown briefly before extension intercepts
  if (action) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<html><head><title>ToolCraft Publisher</title></head>
<body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;background:#f5f5f5;">
  <div style="text-align:center">
    <div style="font-size:48px;margin-bottom:16px">🚀</div>
    <h2>Publishing...</h2>
    <p style="color:#666">The ToolCraft extension is handling this.</p>
    <p style="color:#666">This tab will close automatically.</p>
  </div>
</body></html>`);
    return;
  }

  // Default: status page
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<html><body><h1>ToolCraft Publisher Server</h1><p>Running.</p></body></html>");
});

function start() {
  return new Promise((resolve) => {
    server.listen(PORT, "127.0.0.1", () => {
      console.log(`   🌐 Server: http://localhost:${PORT}`);
      resolve();
    });
  });
}

function stop() {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

function waitForResult(timeoutMs = TIMEOUT) {
  return Promise.race([
    resultPromise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout waiting for extension")), timeoutMs),
    ),
  ]);
}

module.exports = { start, stop, waitForResult, PORT };
