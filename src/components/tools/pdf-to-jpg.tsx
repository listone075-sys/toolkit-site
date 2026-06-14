"use client";

import { useState, useCallback, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { pdfToImages, getPdfPageCount, type PdfPageInfo } from "@/lib/tools/pdf/pdf-to-image";
import { downloadFile, formatFileSize } from "@/lib/utils/file";
import { Upload, Download, X, FileText } from "lucide-react";

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PdfPageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const processPdf = useCallback(async (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError(null);
    setLoading(true);
    try {
      const result = await pdfToImages(f, { scale: 2, format: "image/jpeg", quality: 0.92 });
      setPages(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) processPdf(f); },
    [processPdf],
  );

  const downloadPage = (page: PdfPageInfo) => {
    downloadFile(page.blob, `page-${page.pageNumber}.jpg`, "image/jpeg");
  };

  const downloadAll = () => {
    pages.forEach((page) => downloadFile(page.blob, `page-${page.pageNumber}.jpg`, "image/jpeg"));
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
        {!file ? (
          <>
            <Upload className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-zinc-600 mb-1">Upload PDF</p>
            <p className="text-xs text-zinc-400 mb-3">or drag & drop</p>
            <label className="cursor-pointer inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent">
              Browse files
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && processPdf(e.target.files[0])} />
            </label>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-red-500" />
              <div className="text-left">
                <p className="font-medium text-zinc-700">{file.name}</p>
                <p className="text-xs text-zinc-400">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => { setFile(null); setPages([]); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Converting PDF pages to images...</p>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* Results */}
      {pages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-zinc-900">{pages.length} page(s) extracted</h3>
            <Button variant="outline" size="sm" onClick={downloadAll}>
              <Download className="h-4 w-4 mr-1" /> Download All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pages.map((page) => (
              <div key={page.pageNumber} className="border rounded-lg p-2 group relative">
                <img
                  src={page.dataUrl}
                  alt={`Page ${page.pageNumber}`}
                  className="w-full h-40 object-contain bg-zinc-50 rounded mb-1"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Page {page.pageNumber}</span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => downloadPage(page)}>
                    <Download className="h-3 w-3 mr-1" /> JPG
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
