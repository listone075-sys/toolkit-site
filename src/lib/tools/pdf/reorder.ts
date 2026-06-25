import { PDFDocument } from "pdf-lib";

/**
 * Reorder PDF pages according to the given order array.
 * @param file PDF file to reorder
 * @param order Array of 0-based page indices in the desired order
 */
export async function reorderPdfPages(file: File, order: number[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const totalPages = pdfDoc.getPageCount();

  // Validate all indices are within bounds
  for (const idx of order) {
    if (idx < 0 || idx >= totalPages) {
      throw new Error(`Invalid page index: ${idx + 1}. PDF has ${totalPages} pages.`);
    }
  }

  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(pdfDoc, order);
  for (const page of pages) {
    newDoc.addPage(page);
  }

  const bytes = await newDoc.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

/**
 * Reverse the page order of a PDF.
 */
export async function reversePdfPages(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const totalPages = pdfDoc.getPageCount();
  const reversedOrder = Array.from({ length: totalPages }, (_, i) => totalPages - 1 - i);

  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(pdfDoc, reversedOrder);
  for (const page of pages) {
    newDoc.addPage(page);
  }

  const bytes = await newDoc.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
