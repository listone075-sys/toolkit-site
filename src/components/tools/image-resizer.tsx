"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect, useRef, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resizeImage } from "@/lib/tools/image/resize";
import { downloadFile, formatFileSize, isImageFile } from "@/lib/utils/file";
import { Upload, Download, X, Lock, Unlock } from "lucide-react";

export function ImageResizer() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [targetW, setTargetW] = useState("");
  const [targetH, setTargetH] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const mountedRef = useRef(true);

  // Track mounted state to prevent state updates and blob URL creation after unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const handleFile = useCallback(async (f: File) => {
    if (!isImageFile(f)) { setError(t("imageResizer.uploadError")); return; }
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setTargetW(String(img.naturalWidth));
      setTargetH(String(img.naturalHeight));
    };
    img.src = url;
    setError(null);
    setOutputUrl(null);
  }, [preview]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleWChange = (v: string) => {
    setTargetW(v);
    if (keepRatio && origW && origH) {
      const w = Number(v);
      if (w > 0) setTargetH(String(Math.round((origH * w) / origW)));
    }
  };

  const handleHChange = (v: string) => {
    setTargetH(v);
    if (keepRatio && origW && origH) {
      const h = Number(v);
      if (h > 0) setTargetW(String(Math.round((origW * h) / origH)));
    }
  };

  const handleResize = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const w = Number(targetW) || undefined;
      const h = Number(targetH) || undefined;
      const result = await resizeImage(file, { width: w, height: h, maintainAspectRatio: keepRatio });
      if (!mountedRef.current) return; // Component unmounted during resize — abort
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputBlob(result.blob);
      setOutputUrl(URL.createObjectURL(result.blob));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Revoke preview blob URL on change or unmount
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  // Revoke output blob URL on change or unmount
  useEffect(() => {
    return () => { if (outputUrl) URL.revokeObjectURL(outputUrl); };
  }, [outputUrl]);

  return (
    <div className="space-y-4">
      {/* Dimensions */}
      <div className="flex items-center gap-3 flex-wrap p-3 bg-zinc-50 rounded-lg border">
        <span className="text-sm text-zinc-600">{t("imageResizer.width")}:</span>
        <Input className="w-24 h-8" value={targetW} onChange={(e) => handleWChange(e.target.value)} placeholder={t("imageResizer.pixels")} />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setKeepRatio(!keepRatio)} title={t("imageResizer.lockRatio")}>
          {keepRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
        </Button>
        <span className="text-sm text-zinc-600">{t("imageResizer.height")}:</span>
        <Input className="w-24 h-8" value={targetH} onChange={(e) => handleHChange(e.target.value)} placeholder={t("imageResizer.pixels")} />
        <span className="text-xs text-zinc-400 ml-auto">{t("imageResizer.width")}: {origW} x {origH}{t("imageResizer.pixels")}</span>
      </div>

      {/* Upload + Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[250px] transition-colors ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-zinc-200"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <Upload className="h-10 w-10 text-zinc-300 mb-3" />
              <p className="text-sm text-zinc-600 mb-1">{t("imageResizer.uploadImage")}</p>
              <p className="text-xs text-zinc-400 mb-3">{t("imageResizer.orDragDrop")}</p>
              <label className="cursor-pointer inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent">
                {t("imageResizer.browse")}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </label>
            </>
          ) : (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{file.name}</span>
                <Button variant="ghost" size="icon" onClick={() => {
                  if (preview) URL.revokeObjectURL(preview);
                  if (outputUrl) URL.revokeObjectURL(outputUrl);
                  setFile(null); setPreview(null); setOutputUrl(null); setOutputBlob(null);
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {preview && <img src={preview} alt="" className="max-h-40 rounded mx-auto" />}
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4 min-h-[250px] flex flex-col items-center justify-center">
          {loading ? (
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : outputUrl ? (
            <div className="space-y-3 w-full">
              <img src={outputUrl} alt="Resized" className="max-h-40 rounded mx-auto" />
              <div className="flex justify-center">
                <Button onClick={() => {
                  if (!outputBlob) { setError("Download not available — please resize again"); return; }
                  const ext = file?.name.includes(".") ? file.name.split(".").pop() : "jpg";
                  downloadFile(outputBlob, `resized.${ext}`, outputBlob.type);
                }} size="sm">
                  <Download className="h-4 w-4 mr-1" /> {t("imageResizer.download")}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">{t("imageResizer.uploadPrompt")}</p>
          )}
        </div>
      </div>

      {file && (
        <div className="flex justify-center">
          <Button onClick={handleResize} disabled={loading} size="lg">
            {loading ? t("imageResizer.resizing") : "Resize Image"}
          </Button>
        </div>
      )}
    </div>
  );
}
