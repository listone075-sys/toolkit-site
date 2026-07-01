"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { markdownToHtml, markdownToHtmlDocument } from "@/lib/tools/markdown/md-to-html";
import { markdownToDocxBlob } from "@/lib/tools/markdown/md-to-docx";
import { markdownToPptxBlob } from "@/lib/tools/markdown/md-to-pptx";
import { markdownToPdfBlob } from "@/lib/tools/markdown/md-to-pdf";
import { downloadFile } from "@/lib/utils/file";
import { useClipboard } from "@/hooks/use-clipboard";
import { useDebounce } from "@/hooks/use-debounce";
import { DropTarget } from "./file-upload-zone";
import { Copy, Download, Eye, FileCode, FileText, FileDown, Maximize2, X, Upload } from "lucide-react";

interface MarkdownEditorProps {
  showHtmlExport?: boolean;
}

export function MarkdownEditor({ showHtmlExport = true }: MarkdownEditorProps) {
  const t = useTranslations("components");
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<"preview" | "html">("preview");
  const debouncedInput = useDebounce(input, 150);
  const { copied, copy } = useClipboard();

  const htmlOutput = debouncedInput ? markdownToHtml(debouncedInput) : "";
  const [pdfConverting, setPdfConverting] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [pageDragOver, setPageDragOver] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dragCounterRef = useRef(0);

  // Close fullscreen on Escape key
  useEffect(() => {
    if (!fullscreenOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreenOpen]);

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (fullscreenOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreenOpen]);

  // Global page-level drop target — intercept file drops ANYWHERE on the page
  useEffect(() => {
    const hasFiles = (dt: DataTransfer | null) => {
      if (!dt) return false;
      try {
        return Array.from(dt.types).includes("Files");
      } catch {
        // DOMStringList or other edge case — check via length
        return dt.files.length > 0;
      }
    };

    const handleDragOver = (e: globalThis.DragEvent) => {
      if (hasFiles(e.dataTransfer)) {
        e.preventDefault();
        e.dataTransfer!.dropEffect = "copy";
      }
    };

    const handleDragEnter = (e: globalThis.DragEvent) => {
      if (hasFiles(e.dataTransfer)) {
        e.preventDefault();
        dragCounterRef.current += 1;
        setPageDragOver(true);
      }
    };

    const handleDragLeave = (e: globalThis.DragEvent) => {
      if (hasFiles(e.dataTransfer)) {
        dragCounterRef.current -= 1;
        if (dragCounterRef.current <= 0) {
          dragCounterRef.current = 0;
          setPageDragOver(false);
        }
      }
    };

    const handleDrop = (e: globalThis.DragEvent) => {
      if (hasFiles(e.dataTransfer)) {
        e.preventDefault();
        dragCounterRef.current = 0;
        setPageDragOver(false);
        const files = Array.from(e.dataTransfer?.files ?? []);
        if (files.length > 0) {
          const file = files[0];
          const name = file.name.toLowerCase();
          if (
            name.endsWith(".md") ||
            name.endsWith(".txt") ||
            name.endsWith(".markdown") ||
            file.type.startsWith("text/")
          ) {
            const reader = new FileReader();
            reader.onload = () => setInput(reader.result as string);
            reader.onerror = () => {};
            reader.readAsText(file);
          }
        }
      }
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleCopyHtml = () => {
    copy(htmlOutput);
  };

  const handleCopyMarkdown = () => {
    copy(input || t("markdownEditor.placeholder"));
  };

  const handleDownloadHtml = () => {
    const doc = markdownToHtmlDocument(input || t("markdownEditor.placeholder"), t("markdownEditor.documentTitle"));
    downloadFile(doc, "document.html", "text/html");
  };

  const handleDownloadDocx = async () => {
    const md = input.trim() || t("markdownEditor.placeholder");
    const blob = await markdownToDocxBlob(md);
    downloadFile(
      blob,
      "document.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
  };

  const handleDownloadPptx = async () => {
    const md = input.trim() || t("markdownEditor.placeholder");
    const blob = await markdownToPptxBlob(md);
    downloadFile(
      blob,
      "presentation.pptx",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
  };

  const handleDownloadPdf = async () => {
    if (pdfConverting) return;
    setPdfConverting(true);
    try {
      const md = input.trim() || t("markdownEditor.placeholder");
      const blob = await markdownToPdfBlob(md, t("markdownEditor.documentTitle"));
      downloadFile(blob, "document.pdf", "application/pdf");
    } finally {
      setPdfConverting(false);
    }
  };

  const handleFileDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      // Accept .md, .txt, .markdown, and any text/plain files
      const name = file.name.toLowerCase();
      if (
        !name.endsWith(".md") &&
        !name.endsWith(".txt") &&
        !name.endsWith(".markdown") &&
        !file.type.startsWith("text/")
      ) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setInput(text);
      };
      reader.onerror = () => {
        // Silently ignore read errors for unsupported files
      };
      reader.readAsText(file);
    },
    [],
  );

  return (
    <DropTarget onFiles={handleFileDrop}>
      <div className="space-y-4">
        {/* Page-level drag overlay — intercepts file drops ANYWHERE on the page */}
        {pageDragOver && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-blue-50/80 backdrop-blur-sm border-[3px] border-blue-500 border-dashed rounded-none pointer-events-none">
            <div className="text-center">
              <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-blue-700 mb-1">{t("markdownEditor.dropHereTitle")}</p>
              <p className="text-sm text-blue-500">{t("markdownEditor.dropHereHint")}</p>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap p-3 bg-zinc-50 rounded-lg border">
        <div className="flex items-center gap-1 mr-4">
          <Button
            variant={viewMode === "preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("preview")}
          >
            <Eye className="h-4 w-4 mr-1" /> {t("markdownEditor.preview")}
          </Button>
          <Button
            variant={viewMode === "html" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("html")}
          >
            <FileCode className="h-4 w-4 mr-1" /> {t("markdownEditor.htmlOutput")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFullscreenOpen(true)}
            title={t("markdownEditor.fullscreenPreview")}
          >
            <Maximize2 className="h-4 w-4 mr-1" /> {t("markdownEditor.fullscreenPreview")}
          </Button>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
            <Copy className="h-4 w-4 mr-1" /> {copied ? t("markdownEditor.copied") : t("markdownEditor.copyMd")}
          </Button>
          {showHtmlExport && (
            <>
              <Button variant="outline" size="sm" onClick={handleCopyHtml}>
                <Copy className="h-4 w-4 mr-1" /> {t("markdownEditor.copyHtml")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadHtml}>
                <Download className="h-4 w-4 mr-1" /> {t("markdownEditor.downloadHtml")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadDocx}>
                <FileText className="h-4 w-4 mr-1" /> {t("markdownEditor.docx")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPptx}>
                <Download className="h-4 w-4 mr-1" /> {t("markdownEditor.pptx")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={pdfConverting}>
                <FileDown className="h-4 w-4 mr-1" /> {pdfConverting ? t("markdownEditor.converting") : t("markdownEditor.pdf")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Editor + Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="flex flex-col min-h-[400px]">
          <div className="border rounded-lg p-4 flex-1 flex flex-col">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>{t("markdownEditor.markdown")}</span>
              <span className="font-normal normal-case tracking-normal text-zinc-300 text-[11px]">
                {t("markdownEditor.dropHint")}
              </span>
            </div>
            <Textarea
              className="flex-1 font-mono text-sm resize-none border-0 shadow-none focus-visible:ring-0 p-0"
              placeholder={t("markdownEditor.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>

        {/* Output */}
        <div className="border rounded-lg p-4 min-h-[400px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {viewMode === "preview" ? t("markdownEditor.preview") : t("markdownEditor.htmlOutput")}
          </div>
          {viewMode === "preview" ? (
            <div
              className="flex-1 prose prose-sm max-w-none overflow-auto text-sm"
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          ) : (
            <pre className="flex-1 text-xs font-mono overflow-auto whitespace-pre-wrap bg-zinc-50 p-3 rounded">
              {htmlOutput || <span className="text-zinc-300">{t("markdownEditor.htmlPlaceholder")}</span>}
            </pre>
          )}
        </div>
      </div>

      {/* Fullscreen preview overlay */}
      {fullscreenOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex flex-col bg-white"
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-zinc-50 border-b border-zinc-200">
            <h2 className="text-sm font-semibold text-zinc-700">
              {t("markdownEditor.fullscreenPreview")}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFullscreenOpen(false)}
            >
              <X className="h-4 w-4 mr-1" /> {t("markdownEditor.closeFullscreen")}
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
              <div
                className="prose prose-zinc max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </DropTarget>
  );
}
