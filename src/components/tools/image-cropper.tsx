"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useCallback, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { cropImage } from "@/lib/tools/image/crop";
import { downloadFile, formatFileSize, isImageFile } from "@/lib/utils/file";
import { Upload, Download, X, Crop } from "lucide-react";

export function ImageCropper() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Crop state
  const [cropping, setCropping] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadFile = useCallback((f: File) => {
    if (!isImageFile(f)) {
      setError(t("imageCropper.uploadError"));
      return;
    }
    setFile(f);
    setError(null);
    setOutputBlob(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    const url = URL.createObjectURL(f);
    setImageUrl(url);
  }, [t, outputUrl]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imgRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropping(true);
    setCropStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cropping || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = Math.max(10, Math.abs(x - cropStart.x));
    const h = Math.max(10, Math.abs(y - cropStart.y));
    setCropRect({ x: Math.min(cropStart.x, x), y: Math.min(cropStart.y, y), w, h });
  };

  const handleMouseUp = () => setCropping(false);

  const handleCrop = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      // Scale crop rect to actual image dimensions
      const img = imgRef.current;
      const container = containerRef.current;
      if (!img || !container) return;

      const displayWidth = container.clientWidth;
      const displayHeight = img.clientHeight || container.clientHeight;
      const scaleX = img.naturalWidth / displayWidth;
      const scaleY = img.naturalHeight / displayHeight;

      const blob = await cropImage(
        file,
        Math.round(cropRect.x * scaleX),
        Math.round(cropRect.y * scaleY),
        Math.round(cropRect.w * scaleX),
        Math.round(cropRect.h * scaleY),
      );
      setOutputBlob(blob);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const name = file.name.replace(/\.[^.]+$/, "") + "_cropped.jpg";
    downloadFile(outputBlob, name, "image/jpeg");
  };

  const handleClear = () => {
    setFile(null);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setOutputBlob(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!imageUrl ? (
        <div
          className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors min-h-[200px] ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-zinc-200 hover:border-zinc-300"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-zinc-300 mb-3" />
          <p className="text-sm font-medium text-zinc-600 mb-1">{t("imageCropper.uploadImage")}</p>
          <p className="text-xs text-zinc-400 mb-3">{t("imageCropper.orDragDrop")}</p>
          <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent">
            {t("imageCropper.browse")}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
          </label>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border">
            <Button onClick={handleCrop} disabled={loading} size="sm">
              <Crop className="h-4 w-4 mr-1" /> {loading ? t("imageCropper.cropping") : t("imageCropper.crop")}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4 mr-1" /> {t("imageCropper.clear")}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Crop Area */}
            <div
              ref={containerRef}
              className="relative border rounded-lg overflow-hidden bg-zinc-100"
              style={{ minHeight: 300 }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setCropping(false)}
            >
              <img ref={imgRef} src={imageUrl} alt="Crop" className="w-full h-auto select-none" draggable={false} />
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
                style={{ left: cropRect.x, top: cropRect.y, width: cropRect.w, height: cropRect.h }}
              />
              <p className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
                {t("imageCropper.dragToSelect")}
              </p>
            </div>

            {/* Output */}
            <div className="border rounded-lg flex flex-col items-center justify-center min-h-[300px] p-4">
              {error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : outputUrl ? (
                <div className="space-y-3 w-full">
                  <img src={outputUrl} alt="Cropped result" className="max-h-48 rounded mx-auto" />
                  <p className="text-xs text-center text-zinc-400">
                    {formatFileSize(outputBlob?.size ?? 0)}
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={handleDownload} size="sm">
                      <Download className="h-4 w-4 mr-1" /> {t("imageCropper.download")}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-400">{t("imageCropper.selectArea")}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
