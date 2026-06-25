"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { docxToMarkdown } from "@/lib/tools/markdown/docx-to-md";
import { downloadFile, formatFileSize } from "@/lib/utils/file";
import { useClipboard } from "@/hooks/use-clipboard";
import { Download, Copy, X, FileText } from "lucide-react";

export function DocxToMarkdown() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { copied, copy } = useClipboard();

  const handleFile = useCallback(async (files: File[]) => {
    const f = files[0];
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

  const handleDownload = () => {
    if (!output) return;
    const fileName = file?.name.replace(/\.docx$/i, "") ?? "document";
    downloadFile(output, `${fileName}.md`, "text/markdown");
  };

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      {!file ? (
        <FileUploadZone
          title={t("docxToMarkdown.uploadDocx")}
          description={t("docxToMarkdown.orDragDrop")}
          browseLabel={t("docxToMarkdown.browse")}
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onFiles={handleFile}
        />
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
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
        </div>
      )}

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
