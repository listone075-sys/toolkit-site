/**
 * ToolCraft Publisher — Chrome Extension Service Worker
 *
 * Listens for trigger URLs opened on localhost:19876 and
 * executes posting actions in the browser.
 *
 * Trigger format:
 *   http://localhost:19876/?action=postTweet&text=Hello+world
 */

const POST_SERVER = "http://localhost:19876";

// ── API: Post Tweet ──────────────────────────────────────────────────────

async function postTweet(text) {
  console.log("[ToolCraft] Posting tweet:", text.substring(0, 50));

  // Open compose page
  const tab = await chrome.tabs.create({
    url: "https://x.com/compose/post",
    active: true,
  });

  const tabId = tab.id;
  if (!tabId) {
    notifyDone("error=no_tab_id");
    return;
  }

  // Wait for page load
  await waitForTabLoad(tabId, 15000);
  // Extra wait for React to render the editor
  await sleep(2000);

  // Try injection
  try {
    const result = await injectAndPost(tabId, text);
    console.log("[ToolCraft] Result:", JSON.stringify(result));

    if (result?.success) {
      // Close the compose tab after successful post
      setTimeout(() => chrome.tabs.remove(tabId).catch(() => {}), 1500);
      notifyDone("ok=1");
    } else {
      console.error("[ToolCraft] Failed:", result?.error);
      notifyDone("error=" + encodeURIComponent(result?.error || "unknown"));
    }
  } catch (err) {
    console.error("[ToolCraft] Error:", err.message);
    notifyDone("error=" + encodeURIComponent(err.message));
  }
}

// ── Injection ─────────────────────────────────────────────────────────────

async function injectAndPost(tabId, text) {
  // Step 1: Find editor and type text
  const step1 = await chrome.scripting.executeScript({
    target: { tabId },
    func: fillEditor,
    args: [text],
  });
  if (!step1[0]?.result?.found) {
    return { success: false, error: step1[0]?.result?.error || "Editor not found" };
  }

  // Step 2: Wait for button to enable, then click
  await sleep(1500);
  const step2 = await chrome.scripting.executeScript({
    target: { tabId },
    func: clickPost,
    args: [text],
  });
  return step2[0]?.result || { success: false, error: "No result from click" };
}

// ── Injected functions (must be standalone, no closures) ───────────────────

function fillEditor(tweetText) {
  // Find the editor element — after pressing 'n', it's a dialog with a textbox
  let editor =
    document.querySelector('[data-testid="tweetTextarea_0"]') ||
    document.querySelector('div[role="textbox"]') ||
    document.querySelector('[contenteditable="true"]');

  if (!editor) {
    return { found: false, error: "Editor element not found on page" };
  }

  // Focus is critical — Draft.js only listens when the editor is focused
  editor.click();
  editor.focus();

  // Select any existing content and delete it
  editor.dispatchEvent(new FocusEvent("focus", { bubbles: true }));
  document.execCommand("selectAll", false, null);
  document.execCommand("delete", false, null);

  // Insert character by character using execCommand —
  // this is what Draft.js needs to update internal state and enable the Post button
  let inserted = 0;
  for (let i = 0; i < tweetText.length; i++) {
    const char = tweetText[i];

    // Simulate beforeinput (Draft.js intercepts this)
    editor.dispatchEvent(new InputEvent("beforeinput", {
      bubbles: true,
      cancelable: true,
      data: char,
      inputType: "insertText",
    }));

    // Actually insert the character
    const ok = document.execCommand("insertText", false, char);

    // Simulate input event
    editor.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      cancelable: false,
      data: char,
      inputType: "insertText",
    }));

    if (ok) inserted++;
  }

  return {
    found: true,
    textSet: editor.textContent?.length || 0,
    inserted,
    expected: tweetText.length,
  };
}

function clickPost(tweetText) {
  // Verify text is still there
  const editor =
    document.querySelector('[data-testid="tweetTextarea_0"]') ||
    document.querySelector('div[role="textbox"]');
  const currentText = editor?.textContent || editor?.innerText || "";

  if (currentText.length < tweetText.length * 0.5) {
    return { success: false, error: `Text mismatch: "${currentText.substring(0, 30)}..." vs "${tweetText.substring(0, 30)}..."` };
  }

  // Find Post button
  const postBtn =
    document.querySelector('[data-testid="tweetButton"]') ||
    document.querySelector('[data-testid="tweetButtonInline"]') ||
    document.querySelector('button[data-testid*="tweetButton"]');

  if (!postBtn) {
    return { success: false, error: "Post button not found. Text was set." };
  }

  const isDisabled =
    postBtn.disabled ||
    postBtn.getAttribute("aria-disabled") === "true" ||
    postBtn.hasAttribute("disabled");

  if (isDisabled) {
    return { success: false, error: "Post button is disabled. Text: " + currentText.substring(0, 30) };
  }

  postBtn.click();
  return { success: true };
}

// ── Helpers ───────────────────────────────────────────────────────────────

function waitForTabLoad(tabId, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Tab load timeout")), timeoutMs);
    const listener = (updatedTabId, changeInfo) => {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        clearTimeout(timer);
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function notifyDone(params) {
  chrome.tabs.create({
    url: `${POST_SERVER}/?${params}`,
    active: false,
  });
}

// ── URL Watcher ───────────────────────────────────────────────────────────

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;

  const url = tab.url;
  if (!url || !url.startsWith(POST_SERVER + "/")) return;

  try {
    const parsed = new URL(url);
    const action = parsed.searchParams.get("action");

    if (action === "postTweet") {
      const text = parsed.searchParams.get("text");
      if (!text) {
        chrome.tabs.remove(tabId);
        notifyDone("error=missing_text");
        return;
      }
      // Close trigger tab
      chrome.tabs.remove(tabId);
      // Execute
      postTweet(decodeURIComponent(text));
    }
  } catch (e) {
    console.error("[ToolCraft] URL parse error:", e.message);
  }
});

console.log("[ToolCraft] Service worker started — listening on", POST_SERVER);
