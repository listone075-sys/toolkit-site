"use client";

import { useState, useCallback, type DragEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { docxToMarkdown } from "@/lib/tools/markdown/docx-to-md";
import { downloadFile, formatFileSize } from "@/lib/utils/file";
import { useClipboard } from "@/hooks/use-clipboard";
import { Upload, Download, Copy, X, FileText } from "lucide-react";

export function DocxToMarkdown() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { copied, copy } = useClipboard();

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.endsWith(".docx")) {
      setError(t("docxToMarkdown.uploadError"));
      return;
    }
    setFile(f);
    setOutput(null);
    setError(null);
    setLoading(true);
    try {
      const md = await docxToMarkdown(f);
      setOutput(md);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleDownload = () => {
    if (!output) return;
    const fileName = file?.name.replace(/\.docx$/i, "") ?? "document";
    downloadFile(output, `${fileName}.md`, "text/markdown");
  };

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-zinc-200"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <Upload className="h-10 w-10 text-zinc-300 mb-3" />
            <p className="text-sm text-zinc-600 mb-1">{t("docxToMarkdown.uploadDocx")}</p>
            <p className="text-xs text-zinc-400 mb-3">{t("docxToMarkdown.orDragDrop")}</p>
            <label className="cursor-pointer inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent">
              {t("docxToMarkdown.browse")}
              <input
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </label>
          </>
        ) : (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium truncate">{file.name}</span>
                <span className="text-xs text-zinc-400 ml-2">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setFile(null);
                  setOutput(null);
                  setError(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {loading && (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Output */}
      {output && (
        <div className="border rounded-lg p-4 bg-zinc-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {t("docxToMarkdown.markdownOutput")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => copy(output)}>
                <Copy className="h-4 w-4 mr-1" /> {copied ? t("docxToMarkdown.copied") : t("docxToMarkdown.copy")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> {t("docxToMarkdown.download")}
              </Button>
            </div>
          </div>
          <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto max-h-[500px] bg-white p-4 rounded border">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
