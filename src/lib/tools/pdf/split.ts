import { PDFDocument } from "pdf-lib";

export interface SplitResult {
  /** Page number (1-based) */
  pageNumber: number;
  /** PDF blob for this single page */
  blob: Blob;
}

/**
 * Split a PDF into individual pages.
 * Each page becomes a separate PDF Blob.
 */
export async function splitPdf(file: File): Promise<SplitResult[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const pageCount = pdfDoc.getPageCount();
  const results: SplitResult[] = [];

  for (let i = 0; i < pageCount; i++) {
    const newDoc = await PDFDocument.create();
    const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
    newDoc.addPage(copiedPage);

    const bytes = await newDoc.save();
    results.push({
      pageNumber: i + 1,
      blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    });
  }

  return results;
}

/**
 * Extract a range of pages from a PDF.
 * @param startPage 1-based inclusive start page
 * @param endPage 1-based inclusive end page
 */
export async function extractPages(
  file: File,
  startPage: number,
  endPage: number,
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const totalPages = pdfDoc.getPageCount();
  const start = Math.max(1, startPage) - 1;
  const end = Math.min(endPage, totalPages);

  const newDoc = await PDFDocument.create();
  const indices = Array.from({ length: end - start }, (_, i) => start + i);
  const pages = await newDoc.copyPages(pdfDoc, indices);
  for (const page of pages) {
    newDoc.addPage(page);
  }

  const bytes = await newDoc.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
