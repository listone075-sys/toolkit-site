import mammoth from "mammoth";
import { htmlToMarkdown } from "./html-to-md";

/**
 * Convert a DOCX file to a Markdown string.
 * Uses mammoth (DOCX → HTML) + turndown (HTML → Markdown).
 */
export async function docxToMarkdown(file: File): Promise<string> {
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Convert DOCX to HTML via mammoth
  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      // Inline style mapping for cleaner output
      styleMap: [
        "p[style-name='Heading 1'] => h1",
        "p[style-name='Heading 2'] => h2",
        "p[style-name='Heading 3'] => h3",
        "p[style-name='Heading 4'] => h4",
        "p[style-name='Quote'] => blockquote",
        "r[style-name='Strong'] => strong",
        "r[style-name='Emphasis'] => em",
      ],
    },
  );

  if (!result.value || !result.value.trim()) {
    throw new Error(
      "No content found in the document. The file may be empty or in an unsupported format.",
    );
  }

  // Collect any warnings for debugging
  const warnings = result.messages
    .filter((m) => m.type === "warning")
    .map((m) => m.message);

  // Convert HTML to Markdown via existing turndown utility
  let markdown = htmlToMarkdown(result.value);

  // Prepend warnings as HTML comments (if any)
  if (warnings.length > 0) {
    const comment = warnings.map((w) => `<!-- mammoth: ${w} -->`).join("\n");
    markdown = `${comment}\n\n${markdown}`;
  }

  return markdown;
}
