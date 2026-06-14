import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
});

/**
 * Convert HTML string to Markdown
 */
export function htmlToMarkdown(html: string): string {
  if (!html.trim()) return "";
  try {
    return turndown.turndown(html);
  } catch {
    return "Error converting HTML to Markdown";
  }
}
