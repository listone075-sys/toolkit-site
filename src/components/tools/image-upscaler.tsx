"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone, DropTarget } from "@/components/tools/file-upload-zone";
import { upscaleImage } from "@/lib/tools/image/upscale";
import { downloadFile, formatFileSize, isImageFile } from "@/lib/utils/file";
import { Download, X, Maximize2, Image as ImageIcon } from "lucide-react";

const SCALES = [2, 3, 4] as const;
const FORMATS = [
  { value: "image/png", label: "PNG" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
] as const;

export function ImageUpscaler() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(2);
  const [format, setFormat] = useState<string>("image/png");
  const [sharpen, setSharpen] = useState(0);
  const [resultInfo, setResultInfo] = useState<{
    origW: number;
    origH: number;
    newW: number;
    newH: number;
  } | null>(null);
  const mountedRef = useRef(true);
  const outputUrlRef = useRef<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const handleFiles = useCallback(
    async (files: File[], overrides?: { scale?: number; format?: string; sharpen?: number }) => {
      const f = files[0];
      if (!isImageFile(f)) {
        setError(t("imageUpscaler.uploadError"));
        return;
      }

      const s = overrides?.scale ?? scale;
      const fmt = overrides?.format ?? format;
      const sh = overrides?.sharpen ?? sharpen;

      setFile(f);
      setError(null);
      setOutputBlob(null);
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = null;
      setOutputUrl(null);
      setResultInfo(null);

      // Show preview
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      const previewUrl = URL.createObjectURL(f);
      previewRef.current = previewUrl;
      setPreview(previewUrl);

      // Process
      const requestId = ++requestIdRef.current;
      setLoading(true);
      try {
        const result = await upscaleImage(f, {
          scale: s,
          format: fmt as "image/png" | "image/jpeg" | "image/webp",
          quality: 0.92,
          sharpen: sh,
        });

        if (!mountedRef.current || requestId !== requestIdRef.current) return;
        setOutputBlob(result.blob);
        if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
        const outUrl = URL.createObjectURL(result.blob);
        outputUrlRef.current = outUrl;
        setOutputUrl(outUrl);
        setResultInfo({
          origW: result.originalWidth,
          origH: result.originalHeight,
          newW: result.width,
          newH: result.height,
        });
      } catch (e) {
        if (!mountedRef.current) return;
        setError((e as Error).message);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [scale, format, sharpen, t],
  );

  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    const name = file.name.replace(/\.[^.]+$/, `_${scale}x.${ext}`);
    downloadFile(outputBlob, name, format);
  };

  const handleClear = () => {
    setFile(null);
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
    setPreview(null);
    setOutputBlob(null);
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    outputUrlRef.current = null;
    setOutputUrl(null);
    setResultInfo(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Options bar */}
      <div className="flex items-center gap-4 flex-wrap p-3 bg-zinc-50 rounded-lg border">
        <span className="text-sm font-medium text-zinc-700">
          {t("imageUpscaler.scale")}:
        </span>
        {SCALES.map((s) => (
          <Button
            key={s}
            variant={scale === s ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setScale(s);
              if (file) handleFiles([file], { scale: s });
            }}
            disabled={loading}
          >
            {s}×
          </Button>
        ))}

        <span className="text-sm font-medium text-zinc-700 ml-4">
          {t("imageUpscaler.format")}:
        </span>
        {FORMATS.map(({ value, label }) => (
          <Button
            key={value}
            variant={format === value ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFormat(value);
              if (file) handleFiles([file], { format: value });
            }}
            disabled={loading}
          >
            {label}
          </Button>
        ))}

        <label className="flex items-center gap-2 ml-4 text-sm text-zinc-600">
          <input
            type="checkbox"
            checked={sharpen > 0}
            onChange={(e) => {
              const v = e.target.checked ? 0.8 : 0;
              setSharpen(v);
              if (file) handleFiles([file], { sharpen: v });
            }}
            className="rounded"
          />
          {t("imageUpscaler.sharpen")}
        </label>
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("imageUpscaler.original")}
          </div>
          {!file ? (
            <FileUploadZone
              title={t("imageUpscaler.uploadImage")}
              description={t("imageUpscaler.orDragDrop")}
              browseLabel={t("imageUpscaler.browse")}
              accept="image/*"
              onFiles={handleFiles}
              className="flex-1 p-6"
              icon={<ImageIcon className="h-10 w-10 text-zinc-300 mb-3" />}
            />
          ) : (
            <DropTarget onFiles={handleFiles}>
              <div className="flex-1 flex flex-col items-center justify-center">
                {preview && (
                  <img src={preview} alt="Original" className="max-h-48 rounded object-contain" />
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm font-medium text-zinc-700 truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-zinc-400">({formatFileSize(file.size)})</span>
                </div>
                {resultInfo && (
                  <p className="text-xs text-zinc-500 mt-1">
                    {resultInfo.origW} × {resultInfo.origH} px
                  </p>
                )}
              </div>
            </DropTarget>
          )}
        </div>

        {/* Output */}
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("imageUpscaler.result")} {scale}×
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm text-zinc-500">{t("imageUpscaler.upscaling")}</p>
              </div>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : outputUrl ? (
              <div className="w-full space-y-3">
                <div className="relative overflow-hidden rounded-lg bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23e5e5e5%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23e5e5e5%22%2F%3E%3Crect%20x%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22white%22%2F%3E%3Crect%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E')]">
                  <img src={outputUrl} alt="Upscaled" className="max-h-48 rounded object-contain mx-auto" />
                </div>
                {resultInfo && (
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-green-600">
                      {resultInfo.origW}×{resultInfo.origH}
                      {" → "}
                      {resultInfo.newW}×{resultInfo.newH}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {formatFileSize(outputBlob?.size ?? 0)}
                    </p>
                  </div>
                )}
                <div className="flex justify-center gap-2">
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" /> {t("imageUpscaler.download")}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    <X className="h-4 w-4 mr-1" /> {t("imageUpscaler.clear")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Maximize2 className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
                <p className="text-sm text-zinc-400">{t("imageUpscaler.readyPrompt")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
