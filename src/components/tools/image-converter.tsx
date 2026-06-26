"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { ToolShell } from "./tool-shell";
import { heicToJpg, webpToJpg, convertImage, getOutputFileName } from "@/lib/tools/image/convert";
import { downloadFile, formatFileSize, isImageFile } from "@/lib/utils/file";
import { Download, Image as ImageIcon, X } from "lucide-react";

interface ImageConverterProps {
  convertFn?: (file: File) => Promise<Blob>;
  inputLabel?: string;
  outputFormat?: string;
  outputExtension?: string;
}

export function ImageConverter({
  convertFn,
  inputLabel,
  outputFormat = "image/jpeg",
  outputExtension = "jpg",
}: ImageConverterProps) {
  const t = useTranslations("components");
  const label = inputLabel ?? t("imageConverter.uploadImage");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    async (files: File[]) => {
      const f = files[0];
      if (!isImageFile(f)) {
        setError(t("imageConverter.uploadError"));
        return;
      }

      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError(null);
      setLoading(true);

      try {
        let blob: Blob;
        if (convertFn) {
          blob = await convertFn(f);
        } else {
          blob = await convertImage(f, outputFormat);
        }
        setOutputBlob(blob);
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        setOutputUrl(URL.createObjectURL(blob));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [convertFn, outputFormat, outputUrl],
  );

  const handleDownload = () => {
    if (!outputBlob || !file) { setError(t("imageConverter.downloadError")); return; }
    const outName = getOutputFileName(file.name, outputExtension);
    downloadFile(outputBlob, outName, outputFormat);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setOutputBlob(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setError(null);
  };

  return (
    <ToolShell
      inputPanel={
        !file ? (
          <FileUploadZone
            title={label}
            description={t("imageConverter.orDragDrop")}
            browseLabel={t("imageConverter.browse")}
            accept="image/*"
            onFiles={processFile}
            className="flex-1"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 border-green-300 bg-green-50/50">
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <ImageIcon className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-zinc-700">{file.name}</span>
                  <span className="text-xs text-zinc-400">({formatFileSize(file.size)})</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClear}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {preview && (
                <img src={preview} alt="Preview" className="max-h-48 rounded-lg mx-auto object-contain" />
              )}
            </div>
          </div>
        )
      }
      outputPanel={
        <div className="flex-1 flex flex-col items-center justify-center">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-zinc-500">{t("imageConverter.converting")}</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : outputUrl ? (
            <div className="w-full space-y-3">
              <img src={outputUrl} alt="Output" className="max-h-48 rounded-lg mx-auto object-contain" />
              <p className="text-xs text-center text-zinc-400">
                {formatFileSize(outputBlob?.size ?? 0)} — {outputExtension.toUpperCase()}
              </p>
              <div className="flex justify-center">
                <Button onClick={handleDownload} size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> {t("imageConverter.download")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Download className="h-10 w-10 text-zinc-200 mb-3 mx-auto" />
              <p className="text-sm text-zinc-400">{t("imageConverter.seeResult")}</p>
            </div>
          )}
        </div>
      }
    />
  );
}
