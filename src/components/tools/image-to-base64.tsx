"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { imageToBase64, parseBase64Image } from "@/lib/tools/image/image-to-base64";
import { formatFileSize, isImageFile } from "@/lib/utils/file";
import { useClipboard } from "@/hooks/use-clipboard";
import { Copy, X, Image as ImageIcon } from "lucide-react";

export function ImageToBase64Converter() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { copied, copy } = useClipboard();

  const info = base64 ? parseBase64Image(base64) : null;

  const processFile = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!isImageFile(f)) {
      setError(t("imageToBase64.uploadError"));
      return;
    }
    setFile(f);
    setError(null);
    setLoading(true);
    setPreview(URL.createObjectURL(f));

    try {
      const result = await imageToBase64(f);
      setBase64(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleClear = () => {
    setFile(null);
    setBase64(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      {!file ? (
        <FileUploadZone
          title={t("imageToBase64.uploadImage")}
          description={t("imageToBase64.orDragDrop")}
          browseLabel={t("imageToBase64.browse")}
          accept="image/*"
          onFiles={processFile}
        />
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border">
            <div className="flex items-center gap-2 text-sm">
              <ImageIcon className="h-4 w-4 text-green-500" />
              <span className="font-medium text-zinc-700">{file.name}</span>
              <span className="text-xs text-zinc-400">({formatFileSize(file.size)})</span>
            </div>
            <div className="ml-auto flex gap-1">
              <Button variant="outline" size="sm" onClick={() => copy(base64!)} disabled={!base64}>
                <Copy className="h-4 w-4 mr-1" /> {copied ? t("imageToBase64.copied") : t("imageToBase64.copy")}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4 mr-1" /> {t("imageToBase64.clear")}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Preview */}
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
              {loading ? (
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
              ) : preview ? (
                <img src={preview} alt="Preview" className="max-h-48 rounded object-contain" />
              ) : null}
              {info && (
                <div className="mt-3 flex gap-4 text-xs text-zinc-500">
                  <span>{info.mimeType}</span>
                  <span>{formatFileSize(info.sizeBytes)} (base64)</span>
                </div>
              )}
            </div>

            {/* Base64 Output */}
            <div className="border rounded-lg p-4 min-h-[200px] flex flex-col">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                {t("imageToBase64.base64Output")}
              </div>
              {error ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : base64 ? (
                <textarea
                  className="flex-1 text-xs font-mono resize-none bg-zinc-50 p-3 rounded border-0 focus:outline-none break-all"
                  value={base64}
                  readOnly
                  rows={8}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-zinc-400">{t("imageToBase64.converting")}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
