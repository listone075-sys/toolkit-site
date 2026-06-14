import { PDFDocument, PageSizes, type ImageAlignment } from "pdf-lib";

export interface ImageToPdfOptions {
  /** Page size preset or custom [width, height] in points */
  pageSize?: keyof typeof PageSizes | [number, number];
  /** How images fit on the page */
  fitMode?: "fit" | "fill" | "actual";
  /** Margin in points */
  margin?: number;
}

/**
 * Convert one or more images to a single PDF file
 */
export async function imagesToPdf(
  files: File[],
  options: ImageToPdfOptions = {},
): Promise<Uint8Array> {
  const { pageSize = "A4", fitMode = "fit", margin = 20 } = options;

  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let image;

    if (file.type === "image/png") {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else {
      // Try to embed as PNG — pdf-lib supports PNG and JPEG
      try {
        image = await pdfDoc.embedPng(arrayBuffer);
      } catch {
        throw new Error(`Unsupported image format: ${file.type}. Use PNG or JPEG.`);
      }
    }

    const pageDims = typeof pageSize === "string" ? PageSizes[pageSize] : pageSize;
    const [pageWidth, pageHeight] = pageDims;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const imgWidth = image.width;
    const imgHeight = image.height;

    // Calculate dimensions to fit within margins
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;

    let drawW: number, drawH: number;

    if (fitMode === "actual") {
      drawW = imgWidth;
      drawH = imgHeight;
    } else if (fitMode === "fill") {
      const scale = Math.max(maxW / imgWidth, maxH / imgHeight);
      drawW = imgWidth * scale;
      drawH = imgHeight * scale;
    } else {
      // fit: scale to fit within page while maintaining aspect ratio
      const scale = Math.min(maxW / imgWidth, maxH / imgHeight);
      drawW = imgWidth * scale;
      drawH = imgHeight * scale;
    }

    // Center on page
    const x = (pageWidth - drawW) / 2;
    const y = (pageHeight - drawH) / 2;

    page.drawImage(image, { x, y, width: drawW, height: drawH });
  }

  return await pdfDoc.save();
}
