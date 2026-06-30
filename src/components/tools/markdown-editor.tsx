"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useRef } from "react";
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
import { Copy, Download, Eye, FileCode, FileText, FileDown } from "lucide-react";

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
    <div className="space-y-4">
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
        <DropTarget onFiles={handleFileDrop} className="flex flex-col min-h-[400px]">
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
        </DropTarget>

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
    </div>
  );
}
