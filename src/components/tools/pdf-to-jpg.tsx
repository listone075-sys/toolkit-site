"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { pdfToImages, getPdfPageCount, type PdfPageInfo } from "@/lib/tools/pdf/pdf-to-image";
import { downloadFile, formatFileSize } from "@/lib/utils/file";
import { Download, X, FileText } from "lucide-react";

export function PdfToJpg() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPdf = useCallback(async (files: File[]) => {
    const f = files[0];
    if (f.type !== "application/pdf") {
      setError(t("pdfToJpg.uploadError"));
      return;
    }
    setFile(f);
    setError(null);
    setLoading(true);
    try {
      const result = await pdfToImages(f, { scale: 2, format: "image/jpeg", quality: 0.92 });
      setPages(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadPage = (page: PdfPageInfo) => {
    downloadFile(page.blob, `page-${page.pageNumber}.jpg`, "image/jpeg");
  };

  const downloadAll = () => {
    pages.forEach((page) => downloadFile(page.blob, `page-${page.pageNumber}.jpg`, "image/jpeg"));
  };

  return (
    <div className="space-y-4">
      {/* Upload */}
      {!file ? (
        <FileUploadZone
          title={t("pdfToJpg.uploadPdf")}
          description={t("pdfToJpg.orDragDrop")}
          browseLabel={t("pdfToJpg.browse")}
          accept="application/pdf"
          onFiles={processPdf}
          className="text-center p-10"
        />
      ) : (
        <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border">
          <FileText className="h-5 w-5 text-zinc-500" />
          <span className="text-sm font-medium flex-1 min-w-0 truncate">{file.name}</span>
          <span className="text-xs text-zinc-400">{formatFileSize(file.size)}</span>
          <Button variant="ghost" size="sm" onClick={() => { setFile(null); setPages([]); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-zinc-500">{t("pdfToJpg.rendering")}</p>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* Results */}
      {pages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-zinc-900">{t("pdfToJpg.pages", { count: pages.length })}</h3>
            <Button variant="outline" size="sm" onClick={downloadAll}>
              <Download className="h-4 w-4 mr-1" /> {t("pdfToJpg.downloadAll", { count: pages.length })}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pages.map((page) => (
              <div key={page.pageNumber} className="border rounded-lg p-2 group relative">
                <img
                  src={page.dataUrl}
                  alt={t("pdfToJpg.downloadPage", { page: page.pageNumber })}
                  className="w-full h-40 object-contain bg-zinc-50 rounded mb-1"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{t("pdfToJpg.downloadPage", { page: page.pageNumber })}</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => downloadPage(page)}>
                    <Download className="h-3 w-3 mr-1" /> JPG
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
