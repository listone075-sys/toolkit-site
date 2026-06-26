"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { compressPdf } from "@/lib/tools/pdf/compress";
import { downloadFile, formatFileSize } from "@/lib/utils/file";
import { Download, X, FileArchive } from "lucide-react";

export function CompressPdf() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback((files: File[]) => {
    const f = files[0];
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError(t("compressPdf.uploadError"));
      return;
    }
    setFile(f);
    setError(null);
    setOutputBlob(null);
  }, [t]);

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await compressPdf(file);
      setOutputBlob(blob);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !file) { setError(t("compressPdf.downloadError")); return; }
    const name = file.name.replace(/\.pdf$/i, "") + "_compressed.pdf";
    downloadFile(outputBlob, name, "application/pdf");
  };

  const handleClear = () => {
    setFile(null);
    setOutputBlob(null);
    setError(null);
  };

  const savings =
    file && outputBlob
      ? Math.round((1 - outputBlob.size / file.size) * 100)
      : null;

  return (
    <div className="space-y-4">
      {!file ? (
        <FileUploadZone
          title={t("compressPdf.uploadPdf")}
          description={t("compressPdf.orDragDrop")}
          browseLabel={t("compressPdf.browse")}
          accept=".pdf,application/pdf"
          onFiles={loadFile}
        />
      ) : (
        <>
          {/* File info + actions */}
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border flex-wrap">
            <FileArchive className="h-5 w-5 text-zinc-500" />
            <span className="text-sm font-medium flex-1 min-w-0 truncate">{file.name}</span>
            <span className="text-xs text-zinc-400">{formatFileSize(file.size)}</span>
            <Button onClick={handleCompress} disabled={loading} size="sm">
              {loading ? t("compressPdf.compressing") : t("compressPdf.compress")}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Result */}
          {outputBlob && (
            <div className="border rounded-lg p-6 space-y-3 text-center">
              <div className="text-3xl font-bold text-green-600">
                {savings !== null
                  ? savings > 0
                    ? `−${savings}%`
                    : savings < 0
                    ? `+${Math.abs(savings)}%`
                    : "0%"
                  : "✓"}
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-zinc-600">
                <span>{formatFileSize(file.size)} → {formatFileSize(outputBlob.size)}</span>
              </div>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> {t("compressPdf.download")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
