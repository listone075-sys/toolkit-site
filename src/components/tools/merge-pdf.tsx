"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { mergePdfs } from "@/lib/tools/pdf/merge-pdf";
import { downloadFile, formatFileSize } from "@/lib/utils/file";
import { Download, X, FileText, ArrowDown } from "lucide-react";

export function MergePdf() {
  const t = useTranslations("components");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((newFiles: File[]) => {
    const arr = newFiles.filter((f) => f.type === "application/pdf");
    setFiles((prev) => [...prev, ...arr]);
    setError(null);
  }, []);

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleMerge = async () => {
    if (files.length < 2) { setError(t("mergePdf.minFilesError")); return; }
    setLoading(true);
    setError(null);
    try {
      const merged = await mergePdfs(files);
      downloadFile(new Blob([new Uint8Array(merged).buffer], { type: "application/pdf" }), "merged.pdf", "application/pdf");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload */}
      <FileUploadZone
        title={t("mergePdf.uploadPdfs")}
        description={t("mergePdf.orDragDrop")}
        browseLabel={t("mergePdf.browse")}
        accept="application/pdf"
        multiple
        onFiles={addFiles}
        className="text-center p-10"
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="border rounded-lg p-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("mergePdf.filesToMerge", { count: files.length })}
          </div>
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-zinc-50 rounded text-sm">
                <span className="text-xs text-zinc-400 font-mono w-6">{i + 1}.</span>
                <FileText className="h-4 w-4 text-red-400 shrink-0" />
                <span className="flex-1 truncate text-zinc-700">{f.name}</span>
                <span className="text-xs text-zinc-400">{formatFileSize(f.size)}</span>
                {i < files.length - 1 && <ArrowDown className="h-4 w-4 text-blue-400 shrink-0" />}
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeFile(i)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className="flex justify-center">
        <Button onClick={handleMerge} disabled={files.length < 2 || loading} size="lg" className="gap-2">
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {loading ? t("mergePdf.merging") : t("mergePdf.mergeBtn", { count: files.length })}
        </Button>
      </div>
    </div>
  );
}
