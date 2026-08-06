import * as pdfjsLib from "pdfjs-dist";

// Set up the worker — use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export interface PdfToMarkdownOptions {
  /** Include page number markers in output (e.g. "--- Page 1 ---") */
  pageMarkers?: boolean;
}

export interface PdfToMarkdownResult {
  markdown: string;
  pageCount: number;
  /** Per-page markdown content */
  pages: string[];
}

interface TextItem {
  str: string;
  dir?: string;
  transform: number[];
  width: number;
  height: number;
  fontName?: string;
}

/**
 * Extract text from a PDF and convert it to Markdown.
 * Uses pdfjs-dist text extraction with heuristics to detect
 * headings (by font size), paragraphs, and lists.
 */
export async function pdfToMarkdown(
  file: File,
  options: PdfToMarkdownOptions = {},
): Promise<PdfToMarkdownResult> {
  const { pageMarkers = true } = options;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  const pages: string[] = [];

  try {
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const items = textContent.items as unknown as TextItem[];
      const markdown = textItemsToMarkdown(items);

      if (pageMarkers && totalPages > 1) {
        pages.push(`## Page ${pageNum}\n\n${markdown}`);
      } else {
        pages.push(markdown);
      }
    }
  } finally {
    pdf.cleanup();
  }

  const markdown = pages.join("\n\n---\n\n");

  return {
    markdown,
    pageCount: totalPages,
    pages,
  };
}

/**
 * Get PDF page count without extracting text.
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  try {
    return pdf.numPages;
  } finally {
    pdf.cleanup();
  }
}

// ── Internal helpers ──────────────────────────────────────────

interface LineGroup {
  text: string;
  fontSize: number;
  y: number;
}

/**
 * Convert raw PDF text items into Markdown using position-aware heuristics.
 */
function textItemsToMarkdown(items: TextItem[]): string {
  if (items.length === 0) return "";

  // Step 1: Group items by their Y position (same line)
  const lines = groupItemsByLine(items);

  // Step 2: Detect the "body" font size (most common non-heading size)
  const bodySize = detectBodyFontSize(lines);

  // Step 3: Convert lines to Markdown with heading detection
  return linesToMarkdown(lines, bodySize);
}

/**
 * Group text items into lines based on their Y coordinate.
 * Items on the same Y line are concatenated in X order.
 */
function groupItemsByLine(items: TextItem[]): LineGroup[] {
  // Sort by Y (descending — PDF coordinates have origin at bottom-left),
  // then by X (ascending — left to right)
  const sorted = [...items].sort((a, b) => {
    const yDiff = b.transform[5] - a.transform[5];
    if (Math.abs(yDiff) > 2) return yDiff;
    return a.transform[4] - b.transform[4];
  });

  const lines: LineGroup[] = [];
  const Y_THRESHOLD = 3; // px — items within this Y range are on the same line

  for (const item of sorted) {
    const fontSize = Math.abs(item.transform[3]) || 12;
    const y = item.transform[5];

    // Clean the text — PDF text often has artifacts
    let text = item.str;
    if (!text || text.trim().length === 0) continue;

    const lastLine = lines[lines.length - 1];
    if (lastLine && Math.abs(lastLine.y - y) < Y_THRESHOLD) {
      // Same line — append with appropriate spacing
      const gap = lastLine.text.length > 0 ? " " : "";
      lastLine.text += gap + text;
      // Keep the larger font size
      if (fontSize > lastLine.fontSize) {
        lastLine.fontSize = fontSize;
      }
    } else {
      lines.push({ text, fontSize, y });
    }
  }

  return lines;
}

/**
 * Detect the body font size — the most common font size,
 * excluding the largest sizes which are likely headings.
 */
function detectBodyFontSize(lines: LineGroup[]): number {
  const sizes = lines.map((l) => Math.round(l.fontSize));
  const freq = new Map<number, number>();
  for (const s of sizes) {
    freq.set(s, (freq.get(s) ?? 0) + 1);
  }

  // Sort by frequency descending
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);

  // If there's a clear dominant size, use it
  if (sorted.length > 0 && sorted[0][1] > lines.length * 0.3) {
    return sorted[0][0];
  }

  // Fallback: median size
  const sortedSizes = sizes.sort((a, b) => a - b);
  return sortedSizes[Math.floor(sortedSizes.length / 2)] || 12;
}

/**
 * Convert grouped lines to Markdown, detecting headings and paragraphs.
 */
function linesToMarkdown(lines: LineGroup[], bodySize: number): string {
  const result: string[] = [];
  let prevWasBlank = true; // Treat start as blank line

  for (const line of lines) {
    const trimmed = line.text.trim();
    if (!trimmed) {
      result.push("");
      prevWasBlank = true;
      continue;
    }

    const fontSize = Math.round(line.fontSize);

    // Detect heading by font size relative to body
    const headingLevel = detectHeadingLevel(fontSize, bodySize, trimmed);

    let formatted: string;
    if (headingLevel > 0) {
      const prefix = "#".repeat(headingLevel);
      // Strip any existing Markdown heading markers to avoid double-prefix
      const clean = trimmed.replace(/^#{1,6}\s*/, "");
      formatted = `${prefix} ${clean}`;
    } else {
      formatted = trimmed;
    }

    // Add blank line before headings (but not before the first line)
    if (!prevWasBlank && headingLevel > 0) {
      result.push("");
    }

    result.push(formatted);
    prevWasBlank = false;
  }

  return result.join("\n").replace(/\n{3,}/g, "\n\n");
}

/**
 * Heuristic heading detection: if the font is significantly larger
 * than body text, or if the text is short and bold-ish, classify as heading.
 */
function detectHeadingLevel(fontSize: number, bodySize: number, text: string): number {
  const ratio = fontSize / Math.max(bodySize, 1);
  const isShort = text.length < 80;

  // Very large font → H1
  if (ratio >= 1.8 && isShort) return 1;
  // Large font → H2
  if (ratio >= 1.45 && isShort) return 2;
  // Moderately larger → H3
  if (ratio >= 1.2 && isShort) return 3;
  // Slightly larger, very short → maybe H4
  if (ratio >= 1.1 && text.length < 50) return 4;

  // Check for numbered heading patterns like "1. Introduction" in slightly larger text
  if (ratio >= 1.05 && /^\d+(\.\d+)*\s+\w/.test(text) && isShort) return 3;

  return 0; // Body text
}
