import { readFileAsDataURL } from "@/lib/utils/file";

/**
 * Convert a HEIC file to JPEG using Canvas API via heic2any.
 * Falls back to basic image conversion if heic2any is unavailable.
 */
export async function heicToJpg(file: File, quality = 0.92): Promise<Blob> {
  try {
    const { default: heic2any } = await import("heic2any");
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality,
    });

    const blob = Array.isArray(result) ? result[0] : result;
    return blob as Blob;
  } catch {
    // Fallback: try reading HEIC through browser decoder
    return await convertImage(file, "image/jpeg", quality);
  }
}

/**
 * Convert a WebP image to JPEG
 */
export async function webpToJpg(file: File, quality = 0.92): Promise<Blob> {
  return await convertImage(file, "image/jpeg", quality);
}

/**
 * Generic image format conversion using Canvas API
 */
export async function convertImage(
  file: File,
  targetType: string,
  quality = 0.92,
): Promise<Blob> {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
        } else {
          resolve(blob);
        }
      },
      targetType,
      quality,
    );
  });
}

/**
 * Convert a PNG image to JPEG
 */
export async function pngToJpg(file: File, quality = 0.92): Promise<Blob> {
  return await convertImage(file, "image/jpeg", quality);
}

/**
 * Convert image to PNG format
 */
export async function imageToPng(file: File): Promise<Blob> {
  return await convertImage(file, "image/png");
}

/**
 * Load an image from a data URL
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from ${src.substring(0, 50)}...`));
    img.src = src;
  });
}

/**
 * Get the output filename with new extension
 */
export function getOutputFileName(inputName: string, newExt: string): string {
  const dotIndex = inputName.lastIndexOf(".");
  const baseName = dotIndex > 0 ? inputName.substring(0, dotIndex) : inputName;
  return `${baseName}.${newExt}`;
}
