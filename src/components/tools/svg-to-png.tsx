"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
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
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState<"file" | "paste">("file");

  const loadFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".svg") && f.type !== "image/svg+xml") {
      setError("Please upload an SVG file.");
      return;
    }
    setFile(f);
    setError(null);
    setOutputBlob(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
  }, [outputUrl]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      const input = mode === "file" && file ? file : svgText;
      if (!input) {
        setError("Provide an SVG file or paste SVG code.");
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
    if (!outputBlob) return;
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
          <Upload className="h-4 w-4 mr-1" /> Upload SVG
        </Button>
        <Button variant={mode === "paste" ? "default" : "outline"} size="sm" onClick={() => setMode("paste")}>
          <FileCode className="h-4 w-4 mr-1" /> Paste SVG
        </Button>
      </div>

      {mode === "file" ? (
        !file ? (
          <div
            className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors min-h-[200px] ${
              dragOver ? "border-blue-400 bg-blue-50" : "border-zinc-200 hover:border-zinc-300"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 text-zinc-300 mb-3" />
            <p className="text-sm font-medium text-zinc-600 mb-1">Upload SVG File</p>
            <p className="text-xs text-zinc-400 mb-3">or drag & drop your SVG file here</p>
            <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent">
              Browse files
              <input type="file" accept=".svg,image/svg+xml" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) loadFile(f);
              }} />
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border">
            <FileCode className="h-5 w-5 text-zinc-500" />
            <span className="text-sm font-medium flex-1 min-w-0 truncate">{file.name}</span>
            <Button onClick={handleConvert} disabled={loading} size="sm">
              {loading ? "Converting..." : "Convert to PNG"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      ) : (
        <div className="space-y-3">
          <textarea
            value={svgText}
            onChange={(e) => setSvgText(e.target.value)}
            placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;>..."
            className="w-full h-40 p-3 text-sm font-mono border rounded-lg resize-y"
          />
          <Button onClick={handleConvert} disabled={loading || !svgText.trim()}>
            {loading ? "Converting..." : "Convert to PNG"}
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
            <Download className="h-4 w-4 mr-1" /> Download PNG
          </Button>
        </div>
      )}
    </div>
  );
}
