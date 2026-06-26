"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { encodeGif, createFrame, imageToImageData } from "@/lib/tools/image/gif-maker";
import { downloadFile, formatFileSize, isImageFile } from "@/lib/utils/file";
import { Download, X, Play, Plus, Trash2, GripVertical } from "lucide-react";

interface FrameEntry {
  id: number;
  imageUrl: string;
  file: File;
}

export function GifMaker() {
  const t = useTranslations("components");
  const [frames, setFrames] = useState<FrameEntry[]>([]);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delay, setDelay] = useState(500); // ms per frame
  const nextId = useRef(0);
  const outputUrlRef = useRef(outputUrl);
  useEffect(() => { outputUrlRef.current = outputUrl; }, [outputUrl]);

  const addFiles = useCallback((files: File[]) => {
    const newFrames: FrameEntry[] = [];
    for (const f of files) {
      if (!isImageFile(f)) continue;
      newFrames.push({
        id: nextId.current++,
        imageUrl: URL.createObjectURL(f),
        file: f,
      });
    }
    if (newFrames.length === 0) {
      setError(t("gifMaker.uploadError"));
      return;
    }
    setFrames((prev) => [...prev, ...newFrames]);
    setError(null);
    setOutputBlob(null);
    if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    setOutputUrl(null);
  }, [t]);

  const removeFrame = (id: number) => {
    setFrames((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx >= 0 && prev[idx].imageUrl) URL.revokeObjectURL(prev[idx].imageUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const moveFrame = (fromIdx: number, toIdx: number) => {
    setFrames((prev) => {
      const newFrames = [...prev];
      const [moved] = newFrames.splice(fromIdx, 1);
      newFrames.splice(toIdx, 0, moved);
      return newFrames;
    });
  };

  const handleCreateGif = async () => {
    if (frames.length < 2) {
      setError(t("gifMaker.minError"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Determine the size from the first frame
      const firstFrame = frames[0];
      const img = await loadImage(firstFrame.imageUrl, t("gifMaker.loadError"));
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // Cap dimensions to avoid huge GIFs
      const maxDim = 480;
      let outW = width;
      let outH = height;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        outW = Math.round(width * ratio);
        outH = Math.round(height * ratio);
      }

      const gifFrames = [];
      for (const frame of frames) {
        const imgEl = await loadImage(frame.imageUrl, t("gifMaker.loadError"));
        const imgData = imageToImageData(imgEl, outW, outH);
        gifFrames.push(createFrame(imgData, delay));
      }

      const blob = await encodeGif(gifFrames);
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
    if (!outputBlob) { setError(t("gifMaker.downloadError")); return; }
    downloadFile(outputBlob, "animated.gif", "image/gif");
  };

  const handleClear = () => {
    for (const f of frames) {
      if (f.imageUrl) URL.revokeObjectURL(f.imageUrl);
    }
    setFrames([]);
    setOutputBlob(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <FileUploadZone
        title={t("gifMaker.uploadImages")}
        description={t("gifMaker.orDragDrop")}
        browseLabel={t("gifMaker.addImages")}
        accept="image/*"
        multiple
        onFiles={addFiles}
        icon={<Plus className="h-8 w-8 text-zinc-300 mb-2" />}
        className="p-6"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Frame list */}
      {frames.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-zinc-600">{t("gifMaker.frames", { count: frames.length })}</span>
            <label className="text-sm text-zinc-500">
              {t("gifMaker.delay")}
              <Input
                type="number"
                value={delay}
                onChange={(e) => setDelay(Math.max(10, Number(e.target.value)))}
                className="w-20 ml-2 inline-block"
              />
              <span className="ml-1">{t("gifMaker.delayUnit")}</span>
            </label>
            <div className="flex-1" />
            <Button onClick={handleCreateGif} disabled={loading || frames.length < 2}>
              <Play className="h-4 w-4 mr-1" /> {loading ? t("gifMaker.creating") : t("gifMaker.create")}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4 mr-1" /> {t("gifMaker.clearAll")}
            </Button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {frames.map((frame, idx) => (
              <div key={frame.id} className="relative border rounded-lg overflow-hidden group">
                <img src={frame.imageUrl} alt={`Frame ${idx + 1}`} className="w-full h-24 object-cover" />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {idx + 1}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button
                    className="p-1 bg-white rounded hover:bg-zinc-100"
                    onClick={() => idx > 0 && moveFrame(idx, idx - 1)}
                    title={t("gifMaker.moveLeft")}
                  >
                    <GripVertical className="h-3 w-3" />
                  </button>
                  <button
                    className="p-1 bg-white rounded hover:bg-red-50 text-red-500"
                    onClick={() => removeFrame(frame.id)}
                    title={t("gifMaker.remove")}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output */}
      {outputBlob && outputUrl && (
        <div className="border rounded-lg p-6 text-center space-y-3">
          <img src={outputUrl} alt="Animated GIF" className="max-h-48 mx-auto rounded" />
          <p className="text-xs text-zinc-400">{formatFileSize(outputBlob.size)}</p>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> {t("gifMaker.download")}
          </Button>
        </div>
      )}
    </div>
  );
}

function loadImage(url: string, errorMsg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(errorMsg));
    img.src = url;
  });
}
