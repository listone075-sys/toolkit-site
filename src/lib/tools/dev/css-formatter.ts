/**
 * Format/minify CSS styles. Simple string-based formatter.
 */

/**
 * Minify CSS by removing comments, whitespace, and unnecessary characters.
 */
export function minifyCss(css: string): string {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // Remove whitespace around selectors and braces
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*;\s*/g, ";")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s*,\s*/g, ",")
    // Collapse multiple spaces
    .replace(/\s+/g, " ")
    // Remove spaces around special characters
    .replace(/\s*([{};:,>+~])\s*/g, "$1")
    // Remove last semicolon before closing brace
    .replace(/;\s*}/g, "}")
    // Trim
    .trim();
}

/**
 * Beautify CSS with proper indentation.
 */
export function beautifyCss(css: string, indentSize = 2): string {
  const indent = " ".repeat(indentSize);
  let output = "";
  let level = 0;
  let inComment = false;
  let inString = false;
  let stringChar = "";

  // First minify to normalize
  css = minifyCss(css);

  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    const prevChar = i > 0 ? css[i - 1] : "";

    // Track strings
    if (!inComment && (char === '"' || char === "'") && prevChar !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }

    if (inString) {
      output += char;
      continue;
    }

    switch (char) {
      case "{":
        output += " {\n";
        level++;
        output += indent.repeat(level);
        break;
      case "}":
        level--;
        output = output.trimEnd() + "\n";
        output += indent.repeat(level) + "}\n";
        if (level > 0) output += indent.repeat(level);
        break;
      case ";":
        output += ";\n" + indent.repeat(level);
        break;
      default:
        output += char;
    }
  }

  return output.trim();
}
