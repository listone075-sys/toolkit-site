"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { markdownToHtmlDocument, markdownToPdfHtmlBlob } from "@/lib/tools/markdown/md-to-pdf";
import { downloadFile } from "@/lib/utils/file";
import { FileDown, Printer, Eye, Trash2 } from "lucide-react";

export function MarkdownToPdf() {
  const t = useTranslations("components");
  const [input, setInput] = useState("");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const printRef = useRef<HTMLIFrameElement>(null);
  const pendingPrint = useRef(false);

  const handlePreview = useCallback(() => {
    if (!input.trim()) return;
    const html = markdownToHtmlDocument(input);
    setPreviewHtml(html);
  }, [input]);

  const handleDownloadHtml = () => {
    if (!input.trim()) return;
    const blob = markdownToPdfHtmlBlob(input);
    downloadFile(blob, "document.html", "text/html");
  };

  const handlePrint = () => {
    if (!input.trim() || pendingPrint.current) return;
    pendingPrint.current = true;
    setError(null);
    const html = markdownToHtmlDocument(input);

    if (!printRef.current) {
      printRef.current = document.createElement("iframe");
      printRef.current.style.display = "none";
      printRef.current.title = "print";
      document.body.appendChild(printRef.current);
    }

    printRef.current.onload = () => {
      pendingPrint.current = false;
      try {
        printRef.current?.contentWindow?.print();
      } catch {
        setError(t("markdownToPdf.popupBlocked"));
      }
    };
    printRef.current.srcdoc = html;
  };

  const handleClear = () => {
    setInput("");
    setPreviewHtml(null);
    if (printRef.current) {
      document.body.removeChild(printRef.current);
      printRef.current = null as unknown as HTMLIFrameElement;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 min-h-[350px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Markdown
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (previewHtml) setPreviewHtml(null);
            }}
            placeholder={t("markdownToPdf.placeholder")}
            className="flex-1 text-sm font-mono resize-none bg-zinc-50 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="border rounded-lg p-4 min-h-[350px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("markdownToPdf.preview")}
          </div>
          {previewHtml ? (
            <iframe
              ref={previewRef}
              srcDoc={previewHtml}
              className="flex-1 w-full border rounded bg-white"
              sandbox="allow-same-origin"
              title="PDF Preview"
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-zinc-400">{t("markdownToPdf.clickPreview")}</p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-amber-600 text-center">{error}</p>}

      <div className="flex items-center gap-3 justify-center flex-wrap">
        <Button onClick={handlePreview} disabled={!input.trim()} variant="outline">
          <Eye className="h-4 w-4 mr-1" /> {t("markdownToPdf.previewBtn")}
        </Button>
        <Button onClick={handlePrint} disabled={!input.trim()}>
          <Printer className="h-4 w-4 mr-1" /> {t("markdownToPdf.printBtn")}
        </Button>
        <Button onClick={handleDownloadHtml} disabled={!input.trim()} variant="outline">
          <FileDown className="h-4 w-4 mr-1" /> {t("markdownToPdf.downloadHtml")}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input}>
          <Trash2 className="h-4 w-4 mr-1" /> {t("markdownToPdf.clear")}
        </Button>
      </div>

      <p className="text-xs text-center text-zinc-400">
        {t("markdownToPdf.printHint")}
      </p>
    </div>
  );
}
