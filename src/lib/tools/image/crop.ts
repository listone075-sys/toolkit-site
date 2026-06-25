/**
 * Crop an image file to the specified rectangle.
 * All processing happens in the browser via Canvas API.
 */
export async function cropImage(
  file: File,
  x: number,
  y: number,
  width: number,
  height: number,
  outputFormat: string = "image/jpeg",
  quality = 0.92,
): Promise<Blob> {
  const img = await loadImageFromFile(file);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("Canvas toBlob failed"));
        else resolve(blob);
      },
      outputFormat,
      quality,
    );
  });
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}
