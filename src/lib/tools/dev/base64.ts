/**
 * Encode a UTF-8 string to Base64
 */
export function encodeBase64(input: string): string {
  try {
    // Use TextEncoder for proper UTF-8 handling
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    let binary = "";
    bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
    return btoa(binary);
  } catch {
    throw new Error("Failed to encode to Base64");
  }
}

/**
 * Decode a Base64 string to UTF-8 text
 */
export function decodeBase64(input: string): string {
  try {
    const binary = atob(input.trim());
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch {
    throw new Error("Invalid Base64 string");
  }
}

/**
 * Check if a string looks like Base64
 */
export function isBase64(input: string): boolean {
  return /^[A-Za-z0-9+/]*={0,2}$/.test(input.trim()) && input.trim().length % 4 === 0;
}
