import { PDFDocument } from "pdf-lib";

/**
 * Merge multiple PDF files into a single PDF
 */
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Please select at least 2 PDF files to merge.");
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Split a PDF — extract specific pages
 */
export async function splitPdf(
  file: File,
  pageRanges: number[][],
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const totalPages = sourcePdf.getPageCount();

  const resultPdf = await PDFDocument.create();

  for (const range of pageRanges) {
    const [start, end] = range.length === 2 ? [range[0], range[1]] : [range[0], range[0]];
    const from = Math.max(1, start);
    const to = Math.min(totalPages, end ?? start);

    for (let i = from; i <= to; i++) {
      const [copiedPage] = await resultPdf.copyPages(sourcePdf, [i - 1]);
      resultPdf.addPage(copiedPage);
    }
  }

  return await resultPdf.save();
}
