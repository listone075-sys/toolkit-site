/**
 * Convert text to UPPERCASE
 */
export function toUpperCase(input: string): string {
  return input.toUpperCase();
}

/**
 * Convert text to lowercase
 */
export function toLowerCase(input: string): string {
  return input.toLowerCase();
}

/**
 * Convert text to Title Case (Each Word Capitalized)
 */
export function toTitleCase(input: string): string {
  return input.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}

/**
 * Convert text to Sentence case (First letter of each sentence capitalized)
 */
export function toSentenceCase(input: string): string {
  return input.replace(
    /(^\s*\w|[.!?]\s+\w)/g,
    (match) => match.toUpperCase(),
  );
}

/**
 * Convert text to camelCase
 */
export function toCamelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_match, chr: string) => chr.toUpperCase());
}

/**
 * Convert text to kebab-case
 */
export function toKebabCase(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Invert case: uppercase → lowercase, lowercase → uppercase
 */
export function toInvertCase(input: string): string {
  return input
    .split("")
    .map((char) =>
      char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase(),
    )
    .join("");
}
