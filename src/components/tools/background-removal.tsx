"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone, DropTarget } from "@/components/tools/file-upload-zone";
import { removeImageBackground, preloadBgRemovalModel } from "@/lib/tools/image/background-removal";
import { downloadFile, formatFileSize, isImageFile } from "@/lib/utils/file";
import { Download, X, Sparkles, Image as ImageIcon } from "lucide-react";

type Status = "idle" | "preloading" | "ready" | "processing" | "done" | "error";

export function BackgroundRemoval() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progressMsg, setProgressMsg] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const preloadStarted = useRef(false);
  const cachedRgbaBlob = useRef<Blob | null>(null);
  const currentFileRef = useRef<File | null>(null);

  // Preload model on first mount
  useEffect(() => {
    if (preloadStarted.current) return;
    preloadStarted.current = true;
    setStatus("preloading");
    setProgressMsg("Downloading AI model...");

    preloadBgRemovalModel((step, current, total) => {
      if (step === "fetch") {
        const pct = total > 0 ? Math.round((current / total) * 100) : 0;
        setProgressMsg(`Downloading AI model... ${pct}%`);
        setProgressPct(pct);
      }
    })
      .then(() => {
        setStatus("ready");
        setProgressMsg("");
        setProgressPct(0);
      })
      .catch(() => {
        // Model will download on first inference if preload fails
        setStatus("ready");
        setProgressMsg(t("backgroundRemoval.preloadFailed"));
        setProgressPct(0);
      });
  }, []);

  const handleFiles = useCallback(
    async (files: File[], overrides?: { format?: string }) => {
      const f = files[0];
      if (!isImageFile(f)) {
        setError(t("backgroundRemoval.uploadError"));
        return;
      }

      const fmt = (overrides?.format ?? format) as "image/png" | "image/jpeg" | "image/webp";
      const isSameFile = f === currentFileRef.current;

      setFile(f);
      setError(null);
      currentFileRef.current = f;

      // Show preview
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(f));

      // If only format changed and we have cached RGBA result, re-encode client-side
      if (overrides?.format && isSameFile && cachedRgbaBlob.current) {
        try {
          const reEncodedBlob = await reencodeImage(cachedRgbaBlob.current, fmt, 0.9);
          setOutputBlob(reEncodedBlob);
          if (outputUrl) URL.revokeObjectURL(outputUrl);
          setOutputUrl(URL.createObjectURL(reEncodedBlob));
          setStatus("done");
          return;
        } catch {
          // Fall through to full AI processing if re-encoding fails
          cachedRgbaBlob.current = null;
        }
      }

      // New file or first format selection: full AI processing
      setOutputBlob(null);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(null);
      cachedRgbaBlob.current = null;

      setStatus("processing");
      setProgressMsg("Analyzing image...");
      setProgressPct(0);

      try {
        const blob = await removeImageBackground(f, {
          format: fmt,
          quality: 0.9,
          onProgress: (step, current, total) => {
            if (step === "fetch") {
              const pct = total > 0 ? Math.round((current / total) * 100) : 0;
              setProgressMsg(`Downloading model... ${pct}%`);
              setProgressPct(pct);
            } else if (total > 0) {
              const pct = Math.round((current / total) * 100);
              setProgressMsg(`Processing image... ${pct}%`);
              setProgressPct(pct);
            } else {
              setProgressMsg("Processing image...");
            }
          },
        });

        // Cache the RGBA result for format switching — only if still the current file
        if (f === currentFileRef.current) {
          cachedRgbaBlob.current = blob;
        }
        setOutputBlob(blob);
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        setOutputUrl(URL.createObjectURL(blob));
        setStatus("done");
        setProgressMsg("");
        setProgressPct(0);
      } catch (e) {
        setError((e as Error).message);
        setStatus("error");
      }
    },
    [format, outputUrl, preview, t],
  );

  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const ext = format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    const name = file.name.replace(/\.[^.]+$/, `_nobg.${ext}`);
    downloadFile(outputBlob, name, format);
  };

  const handleClear = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setOutputBlob(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setStatus("ready");
    setError(null);
    setProgressMsg("");
    setProgressPct(0);
    cachedRgbaBlob.current = null;
    currentFileRef.current = null;
  };

  const isLoading = status === "preloading" || status === "processing";

  return (
    <div className="space-y-4">
      {/* AI badge */}
      <div className="flex items-center gap-2 p-2 px-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <span className="text-sm font-medium text-purple-700">
          {t("backgroundRemoval.aiPowered")}
        </span>
        <span className="text-xs text-purple-400 ml-auto">
          {t("backgroundRemoval.privacyNote")}
        </span>
      </div>

      {/* Format selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-zinc-600">{t("backgroundRemoval.outputFormat")}:</span>
        {(["image/png", "image/jpeg", "image/webp"] as const).map((fmt) => (
          <Button
            key={fmt}
            variant={format === fmt ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFormat(fmt);
              if (file) handleFiles([file], { format: fmt });
            }}
            disabled={isLoading}
          >
            {fmt.split("/")[1].toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("backgroundRemoval.original")}
          </div>
          {!file ? (
            <FileUploadZone
              title={t("backgroundRemoval.uploadImage")}
              description={t("backgroundRemoval.orDragDrop")}
              browseLabel={t("backgroundRemoval.browse")}
              accept="image/*"
              onFiles={handleFiles}
              className="flex-1 p-6"
              icon={<ImageIcon className="h-10 w-10 text-zinc-300 mb-3" />}
            />
          ) : (
            <DropTarget onFiles={handleFiles}>
              <div className="flex-1 flex flex-col items-center justify-center">
                {preview && (
                  <img src={preview} alt="Original" className="max-h-64 rounded object-contain" />
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-sm font-medium text-zinc-700 truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-zinc-400">({formatFileSize(file.size)})</span>
                </div>
              </div>
            </DropTarget>
          )}
        </div>

        {/* Output */}
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("backgroundRemoval.result")}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {isLoading ? (
              <div className="text-center space-y-4 w-full max-w-xs">
                <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct || 5}%` }}
                  />
                </div>
                <p className="text-sm text-zinc-500">{progressMsg || t("backgroundRemoval.processing")}</p>
              </div>
            ) : status === "error" ? (
              <div className="text-center">
                <p className="text-sm text-red-500 mb-2">{error}</p>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  {t("backgroundRemoval.tryAgain")}
                </Button>
              </div>
            ) : outputUrl ? (
              <div className="w-full space-y-3">
                <img src={outputUrl} alt="Background removed" className="max-h-64 rounded object-contain mx-auto bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23e5e5e5%22%2F%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23e5e5e5%22%2F%3E%3Crect%20x%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22white%22%2F%3E%3Crect%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E')]" />
                <p className="text-xs text-center text-zinc-400">
                  {formatFileSize(outputBlob?.size ?? 0)}
                </p>
                <div className="flex justify-center gap-2">
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" /> {t("backgroundRemoval.download")}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    <X className="h-4 w-4 mr-1" /> {t("backgroundRemoval.clear")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Sparkles className="h-10 w-10 text-purple-200 mx-auto mb-3" />
                <p className="text-sm text-zinc-400">
                  {t("backgroundRemoval.readyPrompt")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Re-encode a blob to a different format using Canvas. Avoids re-running AI model for format switches. */
function reencodeImage(sourceBlob: Blob, targetFormat: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(sourceBlob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas context unavailable")); return; }
      // Fill white background for JPEG (which discards alpha)
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob failed"));
        },
        targetFormat,
        quality,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load cached image"));
    };
  });
}
