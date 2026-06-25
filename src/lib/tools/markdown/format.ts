/**
 * Markdown formatter / beautifier.
 * Normalizes common Markdown formatting issues without external dependencies.
 */
export interface FormatOptions {
  /** Ensure blank lines around headings */
  headingSpacing?: boolean;
  /** Normalize list indentation to 2 spaces */
  fixListIndent?: boolean;
  /** Ensure blank line before lists */
  listSpacing?: boolean;
  /** Remove trailing whitespace */
  trimTrailing?: boolean;
  /** Ensure fenced code blocks use ``` */
  normalizeCodeFences?: boolean;
}

/**
 * Format/beautify Markdown text.
 */
export function formatMarkdown(md: string, options: FormatOptions = {}): string {
  const {
    headingSpacing = true,
    fixListIndent = true,
    listSpacing = true,
    trimTrailing = true,
    normalizeCodeFences = true,
  } = options;

  let result = md;

  // 1. Remove trailing whitespace
  if (trimTrailing) {
    result = result
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");
  }

  // 2. Normalize code fences: ~~~ → ```
  if (normalizeCodeFences) {
    result = result.replace(/^~~~/gm, "```");
  }

  // 3. Ensure blank lines around headings
  if (headingSpacing) {
    // Heading preceded by non-blank line
    result = result.replace(/([^\n])\n(#{1,6}\s)/g, "$1\n\n$2");
    // Heading followed by non-blank line
    result = result.replace(/(#{1,6}\s[^\n]+)\n([^\n#])/g, "$1\n\n$2");
  }

  // 4. Ensure blank line before lists
  if (listSpacing) {
    // Unordered list preceded by non-blank, non-list line
    result = result.replace(/([^\n])\n([-*+]\s)/g, "$1\n\n$2");
    // Ordered list preceded by non-blank, non-list line
    result = result.replace(/([^\n])\n(\d+\.\s)/g, "$1\n\n$2");
  }

  // 5. Normalize list indentation
  if (fixListIndent) {
    result = result.replace(/^(\s{4,})([-*+])/gm, "  $2");
    result = result.replace(/^(\s{4,})\d+\./gm, "  1.");
  }

  // 6. Remove excessive blank lines (3+ → 2)
  result = result.replace(/\n{4,}/g, "\n\n\n");

  // 7. Ensure trailing newline
  if (result.length > 0 && !result.endsWith("\n")) {
    result += "\n";
  }

  return result;
}
