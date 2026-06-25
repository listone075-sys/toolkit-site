"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { splitPdf, extractPages } from "@/lib/tools/pdf/split";
import type { SplitResult } from "@/lib/tools/pdf/split";
import { downloadFile } from "@/lib/utils/file";
import { Upload, Download, X, FileText, Scissors } from "lucide-react";

export function SplitPdf() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<SplitResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pageRange, setPageRange] = useState("");
  const [rangeBlob, setRangeBlob] = useState<Blob | null>(null);

  const loadFile = useCallback((f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError(null);
    setPages(null);
    setRangeBlob(null);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const handleSplit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await splitPdf(file);
      setPages(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleExtractRange = async () => {
    if (!file || !pageRange.trim()) return;
    const match = pageRange.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if (!match) {
      setError("Enter a range like 1-5");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const blob = await extractPages(file, parseInt(match[1]), parseInt(match[2]));
      setRangeBlob(blob);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPages(null);
    setRangeBlob(null);
    setPageRange("");
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
            <Button onClick={handleSplit} disabled={loading} size="sm">
              <Scissors className="h-4 w-4 mr-1" /> {loading ? "Splitting..." : "Split All Pages"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Page range extraction */}
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border">
            <span className="text-sm text-zinc-600">Extract pages:</span>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="e.g. 1-5"
              className="w-24 px-2 py-1 text-sm border rounded"
            />
            <Button onClick={handleExtractRange} disabled={loading || !pageRange.trim()} size="sm" variant="outline">
              Extract
            </Button>
            {rangeBlob && (
              <Button size="sm" onClick={() => {
                const name = file.name.replace(/\.pdf$/i, `_p${pageRange.replace(/[-–]/, "-")}.pdf`);
                downloadFile(rangeBlob, name, "application/pdf");
              }}>
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Individual pages */}
          {pages && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-600">{pages.length} pages extracted</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {pages.map((page) => (
                  <div key={page.pageNumber} className="border rounded-lg p-3 text-center space-y-2">
                    <p className="text-sm font-medium">Page {page.pageNumber}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const name = file.name.replace(/\.pdf$/i, `_page_${page.pageNumber}.pdf`);
                        downloadFile(page.blob, name, "application/pdf");
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
