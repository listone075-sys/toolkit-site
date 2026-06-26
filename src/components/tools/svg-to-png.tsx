"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone, DropTarget } from "@/components/tools/file-upload-zone";
import { svgToPng } from "@/lib/tools/image/svg-to-png";
import { downloadFile, formatFileSize } from "@/lib/utils/file";
import { Upload, Download, X, FileCode } from "lucide-react";

export function SvgToPng() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [svgText, setSvgText] = useState("");
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"file" | "paste">("file");

  const loadFile = useCallback((files: File[]) => {
    const f = files[0];
    if (!f.name.toLowerCase().endsWith(".svg") && f.type !== "image/svg+xml") {
      setError(t("svgToPng.uploadError"));
      return;
    }
    setFile(f);
    setError(null);
    setOutputBlob(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
  }, [outputUrl, t]);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      const input = mode === "file" && file ? file : svgText;
      if (!input) {
        setError(t("svgToPng.provideInput"));
        setLoading(false);
        return;
      }
      const blob = await svgToPng(input, { scale: 2 });
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
    if (!outputBlob) { setError(t("svgToPng.downloadError")); return; }
    const name = file ? file.name.replace(/\.svg$/i, ".png") : "converted.png";
    downloadFile(outputBlob, name, "image/png");
  };

  const handleClear = () => {
    setFile(null);
    setSvgText("");
    setOutputBlob(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button variant={mode === "file" ? "default" : "outline"} size="sm" onClick={() => setMode("file")}>
          <Upload className="h-4 w-4 mr-1" /> {t("svgToPng.uploadSvg")}
        </Button>
        <Button variant={mode === "paste" ? "default" : "outline"} size="sm" onClick={() => setMode("paste")}>
          <FileCode className="h-4 w-4 mr-1" /> {t("svgToPng.pasteSvg")}
        </Button>
      </div>

      {mode === "file" ? (
        !file ? (
          <FileUploadZone
            title={t("svgToPng.uploadSvg")}
            description={t("svgToPng.orDragDrop")}
            browseLabel={t("svgToPng.browse")}
            accept=".svg,image/svg+xml"
            onFiles={loadFile}
          />
        ) : (
          <DropTarget onFiles={loadFile}>
            <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border">
              <FileCode className="h-5 w-5 text-zinc-500" />
              <span className="text-sm font-medium flex-1 min-w-0 truncate">{file.name}</span>
              <Button onClick={handleConvert} disabled={loading} size="sm">
                {loading ? t("svgToPng.converting") : t("svgToPng.convert")}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DropTarget>
        )
      ) : (
        <div className="space-y-3">
          <textarea
            value={svgText}
            onChange={(e) => setSvgText(e.target.value)}
            placeholder={t("svgToPng.placeholder")}
            className="w-full h-40 p-3 text-sm font-mono border rounded-lg resize-y"
          />
          <Button onClick={handleConvert} disabled={loading || !svgText.trim()}>
            {loading ? t("svgToPng.converting") : t("svgToPng.convert")}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Output */}
      {outputBlob && outputUrl && (
        <div className="border rounded-lg p-6 text-center space-y-3">
          <img src={outputUrl} alt="PNG output" className="max-h-48 mx-auto rounded" />
          <p className="text-xs text-zinc-400">{formatFileSize(outputBlob.size)}</p>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> {t("svgToPng.download")}
          </Button>
        </div>
      )}
    </div>
  );
}
