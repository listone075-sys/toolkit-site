"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

/**
 * Map tool slugs to their client components.
 * Each component is lazy-loaded for optimal page performance.
 */
const toolComponentMap: Record<string, ComponentType<any>> = {
  "heic-to-jpg": dynamic(() =>
    import("./image-converter").then((m) => ({
      default: function HeicConverter() {
        const t = useTranslations("components");
        return m.ImageConverter({
          convertFn: async (file: File) => {
            const { heicToJpg } = await import("@/lib/tools/image/convert");
            return heicToJpg(file);
          },
          inputLabel: t("imageConverter.uploadHeicImage"),
          outputExtension: "jpg",
        });
      },
    })),
  ),

  "png-to-jpg": dynamic(() =>
    import("./image-converter").then((m) => ({
      default: function PngConverter() {
        const t = useTranslations("components");
        return m.ImageConverter({
          convertFn: async (file: File) => {
            const { pngToJpg } = await import("@/lib/tools/image/convert");
            return pngToJpg(file);
          },
          inputLabel: t("imageConverter.uploadPngImage"),
          outputExtension: "jpg",
        });
      },
    })),
  ),

  "webp-to-jpg": dynamic(() =>
    import("./image-converter").then((m) => ({
      default: function WebpConverter() {
        const t = useTranslations("components");
        return m.ImageConverter({
          convertFn: async (file: File) => {
            const { webpToJpg } = await import("@/lib/tools/image/convert");
            return webpToJpg(file);
          },
          inputLabel: t("imageConverter.uploadWebpImage"),
          outputExtension: "jpg",
        });
      },
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

  "url-encode-decode": dynamic(() =>
    import("./url-encoder").then((m) => ({
      default: m.UrlEncoderDecoder,
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

  "pdf-to-markdown": dynamic(() =>
    import("./pdf-to-markdown").then((m) => ({
      default: m.PdfToMarkdown,
    })),
  ),

  "resume-builder": dynamic(() =>
    import("./resume-builder").then((m) => ({
      default: m.ResumeBuilder,
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

  "case-converter": dynamic(() =>
    import("./case-converter").then((m) => ({
      default: m.CaseConverter,
    })),
  ),

  "regex-tester": dynamic(() =>
    import("./regex-tester").then((m) => ({
      default: m.RegexTester,
    })),
  ),

  "css-formatter": dynamic(() =>
    import("./css-formatter").then((m) => ({
      default: m.CssFormatter,
    })),
  ),

  "image-resizer": dynamic(() =>
    import("./image-resizer").then((m) => ({
      default: m.ImageResizer,
    })),
  ),

  "image-cropper": dynamic(() =>
    import("./image-cropper").then((m) => ({
      default: m.ImageCropper,
    })),
  ),

  "image-to-base64": dynamic(() =>
    import("./image-to-base64").then((m) => ({
      default: m.ImageToBase64Converter,
    })),
  ),

  "percentage-calculator": dynamic(() =>
    import("./percentage-calculator").then((m) => ({
      default: m.PercentageCalculator,
    })),
  ),

  "word-counter": dynamic(() =>
    import("./word-counter").then((m) => ({
      default: m.WordCounter,
    })),
  ),

  "age-calculator": dynamic(() =>
    import("./age-calculator").then((m) => ({
      default: m.AgeCalculator,
    })),
  ),

  "bmi-calculator": dynamic(() =>
    import("./bmi-calculator").then((m) => ({
      default: m.BmiCalculator,
    })),
  ),

  "discount-calculator": dynamic(() =>
    import("./discount-calculator").then((m) => ({
      default: m.DiscountCalculator,
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

  "compress-pdf": dynamic(() =>
    import("./compress-pdf").then((m) => ({
      default: m.CompressPdf,
    })),
  ),

  "split-pdf": dynamic(() =>
    import("./split-pdf").then((m) => ({
      default: m.SplitPdf,
    })),
  ),

  "rotate-pdf": dynamic(() =>
    import("./rotate-pdf").then((m) => ({
      default: m.RotatePdf,
    })),
  ),

  "pdf-reorder": dynamic(() =>
    import("./pdf-reorder").then((m) => ({
      default: m.PdfReorder,
    })),
  ),

  "gif-maker": dynamic(() =>
    import("./gif-maker").then((m) => ({
      default: m.GifMaker,
    })),
  ),

  "svg-to-png": dynamic(() =>
    import("./svg-to-png").then((m) => ({
      default: m.SvgToPng,
    })),
  ),

  "html-entity-encode-decode": dynamic(() =>
    import("./html-entities").then((m) => ({
      default: m.HtmlEntities,
    })),
  ),

  "jwt-decoder": dynamic(() =>
    import("./jwt-decoder").then((m) => ({
      default: m.JwtDecoder,
    })),
  ),

  "color-converter": dynamic(() =>
    import("./color-converter").then((m) => ({
      default: m.ColorConverter,
    })),
  ),

  "loan-calculator": dynamic(() =>
    import("./loan-calculator").then((m) => ({
      default: m.LoanCalculator,
    })),
  ),

  "tip-calculator": dynamic(() =>
    import("./tip-calculator").then((m) => ({
      default: m.TipCalculator,
    })),
  ),

  "remove-background": dynamic(() =>
    import("./background-removal").then((m) => ({
      default: m.BackgroundRemoval,
    })),
  ),

  "image-upscaler": dynamic(() =>
    import("./image-upscaler").then((m) => ({
      default: m.ImageUpscaler,
    })),
  ),

  "html-to-markdown": dynamic(() =>
    import("./html-to-markdown").then((m) => ({
      default: m.HtmlToMarkdown,
    })),
  ),

  "markdown-formatter": dynamic(() =>
    import("./markdown-formatter").then((m) => ({
      default: m.MarkdownFormatter,
    })),
  ),

  "markdown-to-pdf": dynamic(() =>
    import("./markdown-to-pdf").then((m) => ({
      default: m.MarkdownToPdf,
    })),
  ),

  "url-to-markdown": dynamic(() =>
    import("./url-to-markdown").then((m) => ({
      default: m.UrlToMarkdown,
    })),
  ),

  markdown: dynamic(() =>
    import("./markdown-workbench").then((m) => ({
      default: m.MarkdownWorkbench,
    })),
  ),
};

/**
 * Get the React component for a given tool slug
 */
export function getToolComponent(slug: string): ComponentType<any> | null {
  return toolComponentMap[slug] ?? null;
}
