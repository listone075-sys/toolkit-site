import { marked } from "marked";

// Configure marked for GitHub Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Convert Markdown string to HTML
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown.trim()) return "";
  try {
    return marked.parse(markdown) as string;
  } catch {
    return `<p style="color:red">Error parsing Markdown</p>`;
  }
}

/**
 * Get a full HTML document from Markdown
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

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    };
    return map[char] ?? char;
  });
}
