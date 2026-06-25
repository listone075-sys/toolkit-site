import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
});

export interface UrlToMdResult {
  markdown: string;
  title: string;
  url: string;
}

/**
 * Fetch a webpage and convert its main content to Markdown.
 *
 * Uses the fetch API to get the HTML, extracts the <body> content,
 * and converts it to Markdown via turndown.
 *
 * NOTE: May fail for cross-origin URLs due to CORS restrictions.
 * In that case, suggest pasting the HTML source directly.
 *
 * @param url - The webpage URL to convert
 * @returns Converted markdown with metadata
 */
export async function urlToMarkdown(url: string): Promise<UrlToMdResult> {
  let normalizedUrl = url.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  const response = await fetch(normalizedUrl, {
    headers: {
      Accept: "text/html",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : normalizedUrl;

  // Extract main content: prefer <main>, <article>, or fallback to <body>
  let contentHtml = html;
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  if (mainMatch) {
    contentHtml = mainMatch[1];
  } else if (articleMatch) {
    contentHtml = articleMatch[1];
  } else if (bodyMatch) {
    contentHtml = bodyMatch[1];
  }

  // Remove script and style tags
  contentHtml = contentHtml
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");

  const markdown = turndown.turndown(contentHtml);

  return {
    markdown: markdown.trim(),
    title,
    url: normalizedUrl,
  };
}
