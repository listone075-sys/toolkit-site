"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { rotatePdf } from "@/lib/tools/pdf/rotate";
import type { RotationAngle } from "@/lib/tools/pdf/rotate";
import { downloadFile } from "@/lib/utils/file";
import { Upload, Download, X, FileText, RotateCw } from "lucide-react";

const ROTATIONS: { label: string; angle: RotationAngle; icon: React.ReactNode }[] = [
  { label: "90° Clockwise", angle: 90, icon: <RotateCw className="h-4 w-4" /> },
  { label: "180°", angle: 180, icon: <RotateCw className="h-4 w-4 rotate-180" /> },
  { label: "270° (90° CCW)", angle: 270, icon: <RotateCw className="h-4 w-4 -rotate-90" /> },
];

export function RotatePdf() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const loadFile = useCallback((f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError(null);
    setOutputBlob(null);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const handleRotate = async (angle: RotationAngle) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await rotatePdf(file, angle);
      setOutputBlob(blob);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const name = file.name.replace(/\.pdf$/i, "_rotated.pdf");
    downloadFile(outputBlob, name, "application/pdf");
  };

  const handleClear = () => {
    setFile(null);
    setOutputBlob(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors min-h-[200px] ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-zinc-200 hover:border-zinc-300"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-zinc-300 mb-3" />
          <p className="text-sm font-medium text-zinc-600 mb-1">Upload PDF File</p>
          <p className="text-xs text-zinc-400 mb-3">or drag & drop your PDF here</p>
          <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent">
            Browse files
            <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) loadFile(f);
            }} />
          </label>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border flex-wrap">
            <FileText className="h-5 w-5 text-zinc-500" />
            <span className="text-sm font-medium flex-1 min-w-0 truncate">{file.name}</span>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {ROTATIONS.map(({ label, angle, icon }) => (
              <Button
                key={angle}
                onClick={() => handleRotate(angle)}
                disabled={loading}
                variant="outline"
                className="flex-col gap-1 py-6"
              >
                {icon}
                <span className="text-sm">{label}</span>
              </Button>
            ))}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {outputBlob && (
            <div className="border rounded-lg p-6 text-center space-y-3">
              <p className="text-sm text-green-600 font-medium">PDF rotated successfully!</p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> Download Rotated PDF
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
