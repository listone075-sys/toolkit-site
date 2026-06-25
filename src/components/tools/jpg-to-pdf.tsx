"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { imagesToPdf } from "@/lib/tools/pdf/image-to-pdf";
import { downloadFile, formatFileSize, isImageFile } from "@/lib/utils/file";
import { Download, X, Plus, GripVertical } from "lucide-react";

const PAGE_SIZES = ["A4", "Letter", "Legal", "A3"] as const;

export function JpgToPdf() {
  const t = useTranslations("components");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<string>("A4");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const arr = newFiles.filter((f) => isImageFile(f));
      setFiles((prev) => [...prev, ...arr]);
      arr.forEach((f) => {
        const url = URL.createObjectURL(f);
        setPreviews((prev) => [...prev, url]);
      });
      setError(null);
    },
    [],
  );

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[i]);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError(t("jpgToPdf.uploadError"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const pdfBytes = await imagesToPdf(files, { pageSize: pageSize as keyof typeof import("pdf-lib").PageSizes });
      const blob = new Blob([new Uint8Array(pdfBytes).buffer], { type: "application/pdf" });
      downloadFile(blob, "converted.pdf", "application/pdf");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Options */}
      <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-lg border flex-wrap">
        <span className="text-sm font-medium text-zinc-700">{t("jpgToPdf.pageSize")}</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
          className="h-8 rounded-md border px-2 text-sm bg-white"
        >
          {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="text-xs text-zinc-400 ml-auto">{t("jpgToPdf.imagesToConvert", { count: files.length })}</span>
      </div>

      {/* Upload / Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Area */}
        <FileUploadZone
          title={t("jpgToPdf.uploadImages")}
          description={t("jpgToPdf.orDragDrop")}
          browseLabel={t("jpgToPdf.browse")}
          accept="image/*"
          multiple
          onFiles={addFiles}
          icon={<Plus className="h-10 w-10 text-zinc-300 mb-3" />}
          className="min-h-[250px] p-6"
        />

        {/* File list */}
        <div className="border rounded-lg p-4 min-h-[250px]">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{t("jpgToPdf.imageOrder")}</div>
          {files.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center mt-12">{t("jpgToPdf.noImages")}</p>
          ) : (
            <div className="space-y-2 max-h-[350px] overflow-auto">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-zinc-50 rounded text-sm">
                  <GripVertical className="h-4 w-4 text-zinc-300 shrink-0" />
                  {previews[i] && <img src={previews[i]} alt="" className="h-10 w-10 object-cover rounded" />}
                  <span className="flex-1 truncate text-zinc-700">{f.name}</span>
                  <span className="text-xs text-zinc-400">{formatFileSize(f.size)}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFile(i)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error + Convert button */}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-center">
        <Button onClick={handleConvert} disabled={files.length === 0 || loading} size="lg" className="gap-2">
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {loading ? t("jpgToPdf.converting") : t("jpgToPdf.convertBtn", { count: files.length })}
        </Button>
      </div>
    </div>
  );
}
