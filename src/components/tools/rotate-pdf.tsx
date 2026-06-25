"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { rotatePdf } from "@/lib/tools/pdf/rotate";
import type { RotationAngle } from "@/lib/tools/pdf/rotate";
import { downloadFile } from "@/lib/utils/file";
import { Download, X, FileText, RotateCw } from "lucide-react";

export function RotatePdf() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback((files: File[]) => {
    const f = files[0];
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError(t("rotatePdf.uploadError"));
      return;
    }
    setFile(f);
    setError(null);
    setOutputBlob(null);
  }, [t]);

  const handleRotate = async (angle: RotationAngle) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await rotatePdf(file, angle);
      setOutputBlob(blob);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const name = file.name.replace(/\.pdf$/i, "_rotated.pdf");
    downloadFile(outputBlob, name, "application/pdf");
  };

  const handleClear = () => {
    setFile(null);
    setOutputBlob(null);
    setError(null);
  };

  const rotations = useMemo(() => [
    { label: t("rotatePdf.c90"), angle: 90 as RotationAngle, iconClass: "" },
    { label: t("rotatePdf.c180"), angle: 180 as RotationAngle, iconClass: "rotate-180" },
    { label: t("rotatePdf.c270"), angle: 270 as RotationAngle, iconClass: "-rotate-90" },
  ], [t]);

  return (
    <div className="space-y-4">
      {!file ? (
        <FileUploadZone
          title={t("rotatePdf.uploadPdf")}
          description={t("rotatePdf.orDragDrop")}
          browseLabel={t("rotatePdf.browse")}
          accept=".pdf,application/pdf"
          onFiles={loadFile}
        />
      ) : (
        <>
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border flex-wrap">
            <FileText className="h-5 w-5 text-zinc-500" />
            <span className="text-sm font-medium flex-1 min-w-0 truncate">{file.name}</span>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {rotations.map(({ label, angle, iconClass }) => (
              <Button
                key={angle}
                onClick={() => handleRotate(angle)}
                disabled={loading}
                variant="outline"
                className="flex-col gap-1 py-6"
              >
                <RotateCw className={`h-4 w-4 ${iconClass}`} />
                <span className="text-sm">{label}</span>
              </Button>
            ))}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {outputBlob && (
            <div className="border rounded-lg p-6 text-center space-y-3">
              <p className="text-sm text-green-600 font-medium">{t("rotatePdf.rotated")}</p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> {t("rotatePdf.download")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
