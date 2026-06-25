/**
 * URL encode a string using encodeURIComponent.
 */
export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

/**
 * URL decode a string using decodeURIComponent.
 * Returns error message string on failure.
 */
export function urlDecode(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return "Error: Invalid URL-encoded string";
  }
}
