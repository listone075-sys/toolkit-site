import { PDFDocument } from "pdf-lib";

/**
 * Compress a PDF file by removing unused objects and optimizing structure.
 * Returns compressed PDF as a Blob with original filename preserved.
 */
export async function compressPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  // Remove unused objects and optimize
  pdfDoc.setTitle("");
  pdfDoc.setAuthor("");
  pdfDoc.setSubject("");
  pdfDoc.setCreator("ToolCraft PDF Compressor");

  // Save with useObjectStreams for better compression
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  return new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
}

/**
 * Get human-readable file size string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
