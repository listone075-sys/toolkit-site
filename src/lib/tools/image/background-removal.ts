import { removeBackground } from "@imgly/background-removal";
import type { Config } from "@imgly/background-removal";

export interface BgRemovalOptions {
  /** Model to use for segmentation. isnet = balanced, isnet_fp16 = faster GPU, isnet_quint8 = smaller download */
  model?: "isnet" | "isnet_fp16" | "isnet_quint8";
  /** Output image format */
  format?: "image/png" | "image/jpeg" | "image/webp";
  /** Output quality (0-1), only for jpeg/webp */
  quality?: number;
  /** Progress callback: (step, current, total) => void */
  onProgress?: (step: string, current: number, total: number) => void;
}

/**
 * Remove the background from an image using AI (client-side only).
 *
 * Uses @imgly/background-removal which runs ONNX models in the browser
 * via WebAssembly/WebGPU. No image data ever leaves the client.
 *
 * @param file - Input image file
 * @param options - Configuration options
 * @returns Blob of the background-removed image
 */
export async function removeImageBackground(
  file: File,
  options: BgRemovalOptions = {},
): Promise<Blob> {
  const config: Config = {
    model: options.model ?? "isnet",
    output: {
      format: options.format ?? "image/png",
      quality: options.quality ?? 0.8,
    },
    progress: options.onProgress,
  };

  try {
    const blob = await removeBackground(file, config);
    return blob;
  } catch (error) {
    throw new Error(
      `Background removal failed: ${(error as Error).message || "Unknown error"}`,
    );
  }
}

/**
 * Preload the background removal model so the first inference is faster.
 * Call this early (e.g., on component mount) to download the model.
 *
 * The model (~40-80MB) is cached by the browser after the first download.
 */
export async function preloadBgRemovalModel(
  onProgress?: (step: string, current: number, total: number) => void,
): Promise<void> {
  const { preload } = await import("@imgly/background-removal");
  await preload({
    model: "isnet",
    progress: onProgress,
  });
}
