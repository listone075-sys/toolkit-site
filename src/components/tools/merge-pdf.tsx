"use client";

import { useState, useCallback, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { mergePdfs } from "@/lib/tools/pdf/merge-pdf";
import { downloadFile, formatFileSize } from "@/lib/utils/file";
import { Upload, Download, X, FileText, ArrowDown } from "lucide-react";

export function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter((f) => f.type === "application/pdf");
    setFiles((prev) => [...prev, ...arr]);
    setError(null);
  }, []);

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleDrop = useCallback(
    (e: DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); },
    [addFiles],
  );

  const handleMerge = async () => {
    if (files.length < 2) { setError("Add at least 2 PDF files."); return; }
    setLoading(true);
    setError(null);
    try {
      const merged = await mergePdfs(files);
      downloadFile(new Blob([new Uint8Array(merged).buffer], { type: "application/pdf" }), "merged.pdf", "application/pdf");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-zinc-200"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-zinc-600 mb-1">Upload PDF Files</p>
        <p className="text-xs text-zinc-400 mb-3">Drag multiple PDFs — they will be merged in order</p>
        <label className="cursor-pointer inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent">
          Browse files
          <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
        </label>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="border rounded-lg p-4">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Files to Merge ({files.length})
          </div>
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-zinc-50 rounded text-sm">
                <span className="text-xs text-zinc-400 font-mono w-6">{i + 1}.</span>
                <FileText className="h-4 w-4 text-red-400 shrink-0" />
                <span className="flex-1 truncate text-zinc-700">{f.name}</span>
                <span className="text-xs text-zinc-400">{formatFileSize(f.size)}</span>
                {i < files.length - 1 && <ArrowDown className="h-4 w-4 text-blue-400 shrink-0" />}
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeFile(i)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className="flex justify-center">
        <Button onClick={handleMerge} disabled={files.length < 2 || loading} size="lg" className="gap-2">
          {loading ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {loading ? "Merging..." : `Merge ${files.length} PDFs`}
        </Button>
      </div>
    </div>
  );
}
