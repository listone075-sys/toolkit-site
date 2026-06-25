import { marked } from "marked";

/**
 * Convert Markdown to a standalone, print-ready HTML document.
 *
 * @param markdown - Raw markdown string
 * @param title - Document title (used in <title> and as visible h1)
 * @returns Complete HTML document string ready for print or download
 */
export function markdownToHtmlDocument(markdown: string, title = "Document"): string {
  const bodyContent = marked.parse(markdown, { async: false }) as string;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.7;
      color: #1a1a2e;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 24px;
      background: #fff;
    }
    h1 { font-size: 2em; margin: 0 0 0.5em; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; margin: 1.5em 0 0.5em; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.2em; }
    h3 { font-size: 1.25em; margin: 1.2em 0 0.4em; }
    h4, h5, h6 { font-size: 1.1em; margin: 1em 0 0.3em; }
    p { margin: 0.8em 0; }
    ul, ol { margin: 0.6em 0; padding-left: 1.8em; }
    li { margin: 0.3em 0; }
    code {
      background: #f1f5f9;
      padding: 0.15em 0.4em;
      border-radius: 4px;
      font-family: "SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace;
      font-size: 0.9em;
    }
    pre {
      background: #1e293b;
      color: #e2e8f0;
      padding: 16px 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1em 0;
    }
    pre code { background: none; padding: 0; color: inherit; }
    blockquote {
      border-left: 4px solid #3b82f6;
      padding: 0.5em 1em;
      margin: 1em 0;
      color: #64748b;
      background: #f8fafc;
      border-radius: 0 6px 6px 0;
    }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; font-weight: 600; }
    img { max-width: 100%; height: auto; border-radius: 6px; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 2em 0; }
    @media print {
      body { padding: 20px 0; max-width: 100%; }
      pre { background: #f1f5f9 !important; color: #1a1a2e !important; border: 1px solid #e5e7eb; }
      @page { margin: 1.5cm; }
    }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

/**
 * Convert Markdown to a downloadable HTML Blob.
 */
export function markdownToPdfHtmlBlob(markdown: string, title?: string): Blob {
  const html = markdownToHtmlDocument(markdown, title);
  return new Blob([html], { type: "text/html" });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
