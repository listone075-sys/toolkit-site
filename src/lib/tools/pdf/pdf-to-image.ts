import * as pdfjsLib from "pdfjs-dist";

// Set up the worker — use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export interface PdfToImageOptions {
  /** Page number (1-based) to convert, or all pages */
  page?: number;
  /** Output format */
  format?: "image/jpeg" | "image/png";
  /** JPEG quality 0.1-1.0 (only for JPEG) */
  quality?: number;
  /** Scale factor for rendering (higher = better quality but larger) */
  scale?: number;
}

export interface PdfPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  blob: Blob;
  dataUrl: string;
}

/**
 * Convert PDF pages to images
 */
export async function pdfToImages(
  file: File,
  options: PdfToImageOptions = {},
): Promise<PdfPageInfo[]> {
  const { page: targetPage, format = "image/png", quality = 0.95, scale = 2 } = options;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  const pagesToRender = targetPage ? [targetPage] : Array.from({ length: totalPages }, (_, i) => i + 1);
  const results: PdfPageInfo[] = [];

  for (const pageNum of pagesToRender) {
    if (pageNum < 1 || pageNum > totalPages) continue;

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    await page.render({ canvas, canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
        format,
        quality,
      );
    });

    const dataUrl = canvas.toDataURL(format, quality);

    results.push({
      pageNumber: pageNum,
      width: viewport.width,
      height: viewport.height,
      blob,
      dataUrl,
    });
  }

  return results;
}

/**
 * Get PDF page count from a file
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
}
