export interface UpscaleOptions {
  /** Scale factor: 2, 3, or 4 */
  scale?: number;
  /** Output format */
  format?: "image/png" | "image/jpeg" | "image/webp";
  /** Output quality (0-1), JPEG/WebP only */
  quality?: number;
  /** Apply sharpening after upscale (0 = none, 1 = default) */
  sharpen?: number;
}

export interface UpscaleResult {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  scale: number;
}

/**
 * Upscale an image using high-quality Canvas interpolation (Lanczos/bicubic).
 *
 * Uses the browser's native image smoothing (typically Lanczos3 or bicubic)
 * for high-quality upscaling. Optional sharpening pass enhances edges.
 *
 * @param file Input image file
 * @param options Upscale configuration
 */
export async function upscaleImage(
  file: File,
  options: UpscaleOptions = {},
): Promise<UpscaleResult> {
  const { scale = 2, format = "image/png", quality = 0.9, sharpen = 0 } = options;

  if (scale < 1 || scale > 4) {
    throw new Error("Scale must be between 1 and 4.");
  }

  // Load image
  const img = await loadImageFromFile(file);
  const origW = img.naturalWidth;
  const origH = img.naturalHeight;
  const targetW = Math.round(origW * scale);
  const targetH = Math.round(origH * scale);

  // Step 1: Upscale using Canvas with high-quality smoothing
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  // Step 2: Apply unsharp mask if sharpen > 0
  if (sharpen > 0) {
    const imageData = ctx.getImageData(0, 0, targetW, targetH);
    const sharpened = unsharpMask(imageData, targetW, targetH, sharpen);
    ctx.putImageData(sharpened, 0, 0);
  }

  // Step 3: Export to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Canvas export failed."));
      },
      format,
      quality,
    );
  });

  return {
    blob,
    width: targetW,
    height: targetH,
    originalWidth: origW,
    originalHeight: origH,
    scale,
  };
}

/**
 * Apply unsharp mask for edge enhancement.
 * Formula: sharpened = original + amount * (original - blurred)
 */
function unsharpMask(
  imageData: ImageData,
  width: number,
  height: number,
  amount: number,
): ImageData {
  // Clamp amount to [0, 2], default feeling is ~0.6
  const amt = Math.max(0, Math.min(2, amount)) * 0.6;

  // Create a blurred copy (simple 3x3 box blur for performance)
  const blurred = boxBlur(imageData, width, height, 1);

  const src = imageData.data;
  const blur = blurred.data;
  const len = src.length;

  for (let i = 0; i < len; i += 4) {
    for (let c = 0; c < 3; c++) {
      const original = src[i + c];
      const diff = original - blur[i + c];
      src[i + c] = Math.max(0, Math.min(255, original + amt * diff));
    }
    // Alpha channel unchanged
  }

  return imageData;
}

/**
 * Simple N×N box blur (separable approximation for performance).
 */
function boxBlur(
  imageData: ImageData,
  width: number,
  height: number,
  radius: number,
): ImageData {
  const copy = new Uint8ClampedArray(imageData.data);
  const result = new Uint8ClampedArray(copy.length);

  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        if (nx >= 0 && nx < width) {
          const idx = (y * width + nx) * 4;
          r += copy[idx];
          g += copy[idx + 1];
          b += copy[idx + 2];
          count++;
        }
      }
      const idx = (y * width + x) * 4;
      result[idx] = r / count;
      result[idx + 1] = g / count;
      result[idx + 2] = b / count;
      result[idx + 3] = copy[idx + 3]; // alpha
    }
  }

  // Vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny >= 0 && ny < height) {
          const idx = (ny * width + x) * 4;
          r += result[idx];
          g += result[idx + 1];
          b += result[idx + 2];
          count++;
        }
      }
      const idx = (y * width + x) * 4;
      copy[idx] = r / count;
      copy[idx + 1] = g / count;
      copy[idx + 2] = b / count;
      // alpha already set
    }
  }

  return new ImageData(copy, width, height);
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}
