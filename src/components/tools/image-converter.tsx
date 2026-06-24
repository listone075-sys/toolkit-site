"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { ToolShell } from "./tool-shell";
import { heicToJpg, webpToJpg, convertImage, getOutputFileName } from "@/lib/tools/image/convert";
import { downloadFile, formatFileSize, isImageFile } from "@/lib/utils/file";
import { Upload, Download, Image as ImageIcon, X } from "lucide-react";

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
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(
    async (f: File) => {
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

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) processFile(f);
    },
    [processFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) processFile(f);
    },
    [processFile],
  );

  const handleDownload = () => {
    if (!outputBlob || !file) return;
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
        <div
          className={`
            flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors
            ${dragOver ? "border-blue-400 bg-blue-50" : "border-zinc-200 hover:border-zinc-300"}
            ${file ? "border-green-300 bg-green-50/50" : ""}
          `}
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
              <p className="text-sm font-medium text-zinc-600 mb-1">{label}</p>
              <p className="text-xs text-zinc-400 mb-3">{t("imageConverter.orDragDrop")}</p>
              <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
                {t("imageConverter.browse")}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
              </label>
            </>
          ) : (
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
          )}
        </div>
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
