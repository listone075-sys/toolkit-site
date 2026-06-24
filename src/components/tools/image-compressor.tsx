"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, type DragEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { compressImage, type CompressResult } from "@/lib/tools/image/compress";
import { downloadFile, formatFileSize, isImageFile } from "@/lib/utils/file";
import { Upload, Download, Image as ImageIcon, X, CheckCircle } from "lucide-react";

export function ImageCompressor() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [quality, setQuality] = useState(80);

  const processFile = useCallback(
    async (f: File) => {
      if (!isImageFile(f)) {
        setError(t("imageCompressor.uploadError"));
        return;
      }
      setFile(f);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(f));
      setResult(null);
      setOutputUrl(null);
      setError(null);
      setLoading(true);

      try {
        const r = await compressImage(f, { quality: quality / 100 });
        setResult(r);
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        setOutputUrl(URL.createObjectURL(r.blob));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [quality, preview, outputUrl],
  );

  // Re-process when quality changes
  useEffect(() => {
    if (file) {
      const timer = setTimeout(() => processFile(file), 200);
      return () => clearTimeout(timer);
    }
  }, [quality]);

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
    if (!result || !file) return;
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    downloadFile(result.blob, `compressed.${ext}`, result.blob.type);
  };

  const handleClear = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResult(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Quality slider */}
      <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-lg border">
        <span className="text-sm font-medium text-zinc-700 whitespace-nowrap">
          {t("imageCompressor.quality")} {quality}%
        </span>
        <div className="flex-1 max-w-xs">
          {/* Simple range input since shadcn slider may need separate install */}
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <span className="text-xs text-zinc-400">{t("imageCompressor.smallerFile")}</span>
        <span className="text-xs text-zinc-400 ml-auto">{t("imageCompressor.betterQuality")}</span>
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{t("imageCompressor.original")}</div>
          <div
            className={`
              flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors
              ${dragOver ? "border-blue-400 bg-blue-50" : "border-zinc-200 hover:border-zinc-300"}
              ${file ? "border-green-300 bg-green-50/50" : ""}
            `}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {!file ? (
              <>
                <Upload className="h-10 w-10 text-zinc-300 mb-3" />
                <p className="text-sm font-medium text-zinc-600 mb-1">{t("imageCompressor.uploadImage")}</p>
                <p className="text-xs text-zinc-400 mb-3">{t("imageCompressor.orDragDrop")}</p>
                <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent">
                  {t("imageCompressor.browse")}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                </label>
              </>
            ) : (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700 truncate">{file.name}</span>
                  <Button variant="ghost" size="icon" onClick={handleClear}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
                {preview && (
                  <img src={preview} alt="Original" className="max-h-40 rounded object-contain mx-auto" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{t("imageCompressor.compressed")}</div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm text-zinc-500">{t("imageCompressor.compressing")}</p>
              </div>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : result ? (
              <div className="w-full space-y-3">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-green-600">
                    {t("imageCompressor.smaller", { percent: result.savingsPercent })}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatFileSize(result.originalSize)} → {formatFileSize(result.compressedSize)}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {result.width} × {result.height}px
                  </p>
                </div>
                {outputUrl && (
                  <img src={outputUrl} alt="Compressed" className="max-h-40 rounded object-contain mx-auto" />
                )}
                <div className="flex justify-center">
                  <Button onClick={handleDownload} size="sm" className="gap-2">
                    <Download className="h-4 w-4" /> {t("imageCompressor.download")}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">{t("imageCompressor.uploadPrompt")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
