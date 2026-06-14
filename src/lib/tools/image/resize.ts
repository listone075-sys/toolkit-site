import { readFileAsDataURL } from "@/lib/utils/file";

export interface ResizeOptions {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  format?: string;
  quality?: number;
}

export interface ResizeResult {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

/**
 * Resize an image using Canvas API
 */
export async function resizeImage(file: File, options: ResizeOptions): Promise<ResizeResult> {
  const { width: targetW, height: targetH, maintainAspectRatio = true, format = "image/jpeg", quality = 0.92 } = options;

  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  const origW = img.naturalWidth;
  const origH = img.naturalHeight;

  let w = targetW ?? origW;
  let h = targetH ?? origH;

  if (maintainAspectRatio && targetW && !targetH) {
    h = Math.round((origH * targetW) / origW);
  } else if (maintainAspectRatio && targetH && !targetW) {
    w = Math.round((origW * targetH) / origH);
  } else if (maintainAspectRatio && targetW && targetH) {
    // Fit within box
    const scale = Math.min(targetW / origW, targetH / origH);
    w = Math.round(origW * scale);
    h = Math.round(origH * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");
  ctx.drawImage(img, 0, 0, w, h);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { reject(new Error("Failed to resize")); return; }
        resolve({ blob, width: w, height: h, originalWidth: origW, originalHeight: origH });
      },
      format,
      quality,
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
