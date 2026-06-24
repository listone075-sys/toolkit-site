import { Marked } from "marked";

/**
 * Shared pre-configured Marked instance.
 *
 * Uses GFM (GitHub Flavored Markdown) + line-break support.
 * The HTML renderer is overridden to escape raw HTML, preventing XSS
 * when the output is rendered via dangerouslySetInnerHTML.
 */
const md = new Marked({
  gfm: true,
  breaks: true,
});

// Override the HTML renderer to escape raw HTML blocks (XSS prevention).
// Marked v18 does NOT sanitize output — raw HTML in the markdown source
// would otherwise pass through verbatim and execute in the browser.
md.use({
  renderer: {
    html(token: { text: string }): string {
      return escapeHtml(token.text);
    },
  },
});

/**
 * Convert a Markdown string to an HTML fragment.
 *
 * Raw HTML embedded in the markdown source is escaped to prevent XSS.
 * Returns an empty string for blank input.
 *
 * @example
 *   markdownToHtml("# Hello\n\n**bold**")  // "<h1>Hello</h1>\n<p><strong>bold</strong></p>"
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) return "";
  try {
    return md.parse(markdown) as string;
  } catch {
    return `<p style="color:red">Error parsing Markdown</p>`;
  }
}

/**
 * Convert a Markdown string to a complete, self-contained HTML document.
 *
 * Includes embedded CSS for code blocks, tables, blockquotes, and typography
 * so the downloaded file renders nicely without external stylesheets.
 *
 * @param markdown — the markdown source text
 * @param title    — HTML document title (embedded as plain text; HTML-escaped)
 */
export function markdownToHtmlDocument(markdown: string, title = "Document"): string {
  const body = markdownToHtml(markdown);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
    }
    pre { background: #f4f4f5; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    code { background: #f4f4f5; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #f4f4f5; }
    img { max-width: 100%; }
    blockquote { border-left: 4px solid #3b82f6; margin: 0; padding-left: 1rem; color: #666; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

// ── Helpers ──────────────────────────────────────────────────────

/**
 * Escape HTML special characters so they render as visible text
 * rather than being parsed as HTML.
 */
function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char] ?? char;
  });
}

/**
 * The shared marked instance — exported so that `md-to-docx` and
 * `md-to-pptx` can reuse the same configuration instead of calling
 * `marked.setOptions()` separately.
 */
export { md };
