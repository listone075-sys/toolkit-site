import { readFileAsDataURL } from "@/lib/utils/file";

export interface CompressOptions {
  quality: number; // 0.1 to 1.0
  maxWidth?: number;
  maxHeight?: number;
  format?: string; // default keeps original format
}

export interface CompressResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  savingsPercent: number;
}

/**
 * Compress an image file using Canvas API
 */
export async function compressImage(file: File, options: CompressOptions): Promise<CompressResult> {
  const { quality, maxWidth, maxHeight, format } = options;

  // Load image
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  // Calculate target dimensions
  let { width, height } = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight,
    maxWidth,
    maxHeight,
  );

  // Draw to canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");
  ctx.drawImage(img, 0, 0, width, height);

  // Determine output format
  const outputFormat = format ?? file.type ?? "image/jpeg";

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
          return;
        }
        resolve({
          blob,
          originalSize: file.size,
          compressedSize: blob.size,
          width,
          height,
          savingsPercent: Math.round(((file.size - blob.size) / file.size) * 100),
        });
      },
      outputFormat,
      quality,
    );
  });
}

/**
 * Calculate new dimensions maintaining aspect ratio
 */
function calculateDimensions(
  origW: number,
  origH: number,
  maxW?: number,
  maxH?: number,
): { width: number; height: number } {
  let w = origW;
  let h = origH;

  if (maxW && w > maxW) {
    h = Math.round((h * maxW) / w);
    w = maxW;
  }
  if (maxH && h > maxH) {
    w = Math.round((w * maxH) / h);
    h = maxH;
  }

  return { width: w, height: h };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
