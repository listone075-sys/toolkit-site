"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/utils/file";
import { Download, FileText, Loader2 } from "lucide-react";

interface ExportButtonsProps {
  markdown: string;
  variant?: "toolbar" | "cards";
}

export function ExportButtons({ markdown, variant = "toolbar" }: ExportButtonsProps) {
  const t = useTranslations("components");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);
  const [pptxLoading, setPptxLoading] = useState(false);
  const [currentLoading, setCurrentLoading] = useState<string | null>(null);

  const getMd = useCallback(() => markdown.trim() || t("markdownWorkbench.export.defaultTitle"), [markdown, t]);

  const handleDownloadHtml = useCallback(async () => {
    const { markdownToHtmlDocument } = await import("@/lib/tools/markdown/md-to-html");
    const doc = markdownToHtmlDocument(getMd(), t("markdownWorkbench.export.defaultTitle"));
    downloadFile(doc, "document.html", "text/html");
  }, [getMd, t]);

  const handleDownloadDocx = useCallback(async () => {
    setDocxLoading(true);
    setCurrentLoading("docx");
    try {
      const { markdownToDocxBlob } = await import("@/lib/tools/markdown/md-to-docx");
      const blob = await markdownToDocxBlob(getMd());
      downloadFile(blob, "document.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    } finally {
      setDocxLoading(false);
      setCurrentLoading(null);
    }
  }, [getMd]);

  const handleDownloadPptx = useCallback(async () => {
    setPptxLoading(true);
    setCurrentLoading("pptx");
    try {
      const { markdownToPptxBlob } = await import("@/lib/tools/markdown/md-to-pptx");
      const blob = await markdownToPptxBlob(getMd());
      downloadFile(blob, "presentation.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    } finally {
      setPptxLoading(false);
      setCurrentLoading(null);
    }
  }, [getMd]);

  const handleDownloadPdf = useCallback(async () => {
    setPdfLoading(true);
    setCurrentLoading("pdf");
    try {
      const { markdownToPdfBlob } = await import("@/lib/tools/markdown/md-to-pdf");
      const blob = await markdownToPdfBlob(getMd(), t("markdownWorkbench.export.defaultTitle"));
      downloadFile(blob, "document.pdf", "application/pdf");
    } finally {
      setPdfLoading(false);
      setCurrentLoading(null);
    }
  }, [getMd, t]);

  const headingCount = (markdown.match(/^#{1,6}\s/gm) ?? []).length;
  const slideCount = (markdown.match(/^##\s/gm) ?? []).length;

  if (variant === "toolbar") {
    return (
      <>
        <Button variant="outline" size="sm" onClick={handleDownloadHtml}>
          <Download className="h-4 w-4 mr-1" /> {t("markdownWorkbench.export.htmlCard.title")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadDocx} disabled={docxLoading}>
          {docxLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <FileText className="h-4 w-4 mr-1" />}
          {t("markdownWorkbench.export.docxCard.title")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPptx} disabled={pptxLoading}>
          {pptxLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
          {t("markdownWorkbench.export.pptxCard.title")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={pdfLoading}>
          {pdfLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
          {pdfLoading ? t("markdownWorkbench.edit.converting") : t("markdownWorkbench.export.pdfCard.title")}
        </Button>
      </>
    );
  }

  // Cards variant — used in Export tab
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* HTML card */}
      <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-2">
        <FileText className="h-8 w-8 text-orange-500" />
        <div>
          <p className="font-medium text-sm">{t("markdownWorkbench.export.htmlCard.title")}</p>
          <p className="text-xs text-zinc-500">{t("markdownWorkbench.export.htmlCard.desc")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadHtml} className="mt-1">
          <Download className="h-3 w-3 mr-1" /> {t("markdownWorkbench.export.download")}
        </Button>
      </div>

      {/* DOCX card */}
      <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-2">
        <FileText className="h-8 w-8 text-blue-500" />
        <div>
          <p className="font-medium text-sm">{t("markdownWorkbench.export.docxCard.title")}</p>
          <p className="text-xs text-zinc-500">{t("markdownWorkbench.export.docxCard.desc", { headings: headingCount })}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadDocx} disabled={docxLoading} className="mt-1">
          {docxLoading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Download className="h-3 w-3 mr-1" />}
          {t("markdownWorkbench.export.download")}
        </Button>
      </div>

      {/* PPTX card */}
      <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-2">
        <FileText className="h-8 w-8 text-red-500" />
        <div>
          <p className="font-medium text-sm">{t("markdownWorkbench.export.pptxCard.title")}</p>
          <p className="text-xs text-zinc-500">{t("markdownWorkbench.export.pptxCard.desc", { slides: slideCount || "~1" })}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadPptx} disabled={pptxLoading} className="mt-1">
          {pptxLoading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Download className="h-3 w-3 mr-1" />}
          {t("markdownWorkbench.export.download")}
        </Button>
      </div>

      {/* PDF card */}
      <div className="border rounded-lg p-4 flex flex-col items-center text-center gap-2">
        <FileText className="h-8 w-8 text-zinc-700" />
        <div>
          <p className="font-medium text-sm">{t("markdownWorkbench.export.pdfCard.title")}</p>
          <p className="text-xs text-zinc-500">{t("markdownWorkbench.export.pdfCard.desc")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={pdfLoading} className="mt-1">
          {pdfLoading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Download className="h-3 w-3 mr-1" />}
          {t("markdownWorkbench.export.download")}
        </Button>
      </div>
    </div>
  );
}
