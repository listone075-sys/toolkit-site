"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Map tool slugs to their client components.
 * Each component is lazy-loaded for optimal page performance.
 */
const toolComponentMap: Record<string, ComponentType<any>> = {
  "heic-to-jpg": dynamic(() =>
    import("./image-converter").then((m) => ({
      default: () =>
        m.ImageConverter({
          convertFn: async (file: File) => {
            const { heicToJpg } = await import("@/lib/tools/image/convert");
            return heicToJpg(file);
          },
          inputLabel: "Upload HEIC Image",
          outputExtension: "jpg",
        }),
    })),
  ),

  "webp-to-jpg": dynamic(() =>
    import("./image-converter").then((m) => ({
      default: () =>
        m.ImageConverter({
          convertFn: async (file: File) => {
            const { webpToJpg } = await import("@/lib/tools/image/convert");
            return webpToJpg(file);
          },
          inputLabel: "Upload WebP Image",
          outputExtension: "jpg",
        }),
    })),
  ),

  "markdown-to-html": dynamic(() =>
    import("./markdown-editor").then((m) => ({
      default: () => m.MarkdownEditor({ showHtmlExport: true }),
    })),
  ),

  "markdown-editor": dynamic(() =>
    import("./markdown-editor").then((m) => ({
      default: () => m.MarkdownEditor({ showHtmlExport: true }),
    })),
  ),

  "markdown-table-generator": dynamic(() =>
    import("./markdown-table-generator").then((m) => ({
      default: m.MarkdownTableGenerator,
    })),
  ),

  "image-compressor": dynamic(() =>
    import("./image-compressor").then((m) => ({
      default: m.ImageCompressor,
    })),
  ),

  "json-formatter": dynamic(() =>
    import("./json-formatter").then((m) => ({
      default: m.JsonFormatter,
    })),
  ),

  "base64-encode-decode": dynamic(() =>
    import("./base64-encoder").then((m) => ({
      default: m.Base64Encoder,
    })),
  ),

  "uuid-generator": dynamic(() =>
    import("./uuid-generator").then((m) => ({
      default: m.UuidGenerator,
    })),
  ),

  "jpg-to-pdf": dynamic(() =>
    import("./jpg-to-pdf").then((m) => ({
      default: m.JpgToPdf,
    })),
  ),

  "pdf-to-jpg": dynamic(() =>
    import("./pdf-to-jpg").then((m) => ({
      default: m.PdfToJpg,
    })),
  ),

  "merge-pdf": dynamic(() =>
    import("./merge-pdf").then((m) => ({
      default: m.MergePdf,
    })),
  ),

  "qr-code-generator": dynamic(() =>
    import("./qrcode-generator").then((m) => ({
      default: m.QrCodeGenerator,
    })),
  ),

  "password-generator": dynamic(() =>
    import("./password-generator").then((m) => ({
      default: m.PasswordGenerator,
    })),
  ),

  "text-diff-checker": dynamic(() =>
    import("./text-diff-checker").then((m) => ({
      default: m.TextDiffChecker,
    })),
  ),

  "image-resizer": dynamic(() =>
    import("./image-resizer").then((m) => ({
      default: m.ImageResizer,
    })),
  ),

  "percentage-calculator": dynamic(() =>
    import("./percentage-calculator").then((m) => ({
      default: m.PercentageCalculator,
    })),
  ),

  "markdown-to-docx": dynamic(() =>
    import("./markdown-to-docx").then((m) => ({
      default: m.MarkdownToDocx,
    })),
  ),

  "markdown-to-pptx": dynamic(() =>
    import("./markdown-to-pptx").then((m) => ({
      default: m.MarkdownToPptx,
    })),
  ),

  "docx-to-markdown": dynamic(() =>
    import("./docx-to-markdown").then((m) => ({
      default: m.DocxToMarkdown,
    })),
  ),
};

/**
 * Get the React component for a given tool slug
 */
export function getToolComponent(slug: string): ComponentType<any> | null {
  return toolComponentMap[slug] ?? null;
}
