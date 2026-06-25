import { PDFDocument, degrees } from "pdf-lib";

export type RotationAngle = 90 | 180 | 270;

/**
 * Rotate all pages in a PDF by the specified angle (clockwise).
 */
export async function rotatePdf(file: File, angle: RotationAngle): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + angle) % 360));
  }

  const bytes = await pdfDoc.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

/**
 * Rotate a specific page in a PDF.
 * @param pageNumber 1-based page number
 */
export async function rotatePdfPage(
  file: File,
  pageNumber: number,
  angle: RotationAngle,
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const pageIndex = pageNumber - 1;
  if (pageIndex >= 0 && pageIndex < pdfDoc.getPageCount()) {
    const page = pdfDoc.getPage(pageIndex);
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + angle) % 360));
  }

  const bytes = await pdfDoc.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}
