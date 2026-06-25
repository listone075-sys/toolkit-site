/**
 * Convert an image file to a Base64 data URL string.
 * Useful for embedding images directly in HTML, CSS, or JSON.
 */
export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Get the MIME type and size info from a base64 data URL.
 */
export function parseBase64Image(dataUrl: string): {
  mimeType: string;
  sizeBytes: number;
  base64: string;
} | null {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return null;

  const base64 = match[2];
  // Base64 size: each 4 chars = 3 bytes
  const sizeBytes = Math.floor((base64.length * 3) / 4);

  return {
    mimeType: match[1],
    sizeBytes,
    base64,
  };
}
