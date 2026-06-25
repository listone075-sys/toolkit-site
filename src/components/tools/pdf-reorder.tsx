"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { reorderPdfPages, reversePdfPages } from "@/lib/tools/pdf/reorder";
import { downloadFile } from "@/lib/utils/file";
import { Upload, Download, X, FileText, GripVertical, ArrowUpDown } from "lucide-react";

export function PdfReorder() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const loadFile = useCallback(async (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }
    setFile(f);
    setError(null);
    setOutputBlob(null);

    // Get page count from pdf-lib
    try {
      const { PDFDocument } = await import("pdf-lib");
      const ab = await f.arrayBuffer();
      const doc = await PDFDocument.load(ab, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setPageCount(count);
      setOrder(Array.from({ length: count }, (_, i) => i));
    } catch {
      setPageCount(0);
      setOrder([]);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const movePage = (fromIdx: number, toIdx: number) => {
    const newOrder = [...order];
    const [moved] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, moved);
    setOrder(newOrder);
  };

  const handleReorder = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await reorderPdfPages(file, order);
      setOutputBlob(blob);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReverse = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await reversePdfPages(file);
      setOutputBlob(blob);
      setOrder([...order].reverse());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const name = file.name.replace(/\.pdf$/i, "_reordered.pdf");
    downloadFile(outputBlob, name, "application/pdf");
  };

  const handleClear = () => {
    setFile(null);
    setPageCount(0);
    setOrder([]);
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
            <span className="text-xs text-zinc-400">{pageCount} pages</span>
            <Button onClick={handleReverse} disabled={loading} variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-1" /> Reverse
            </Button>
            <Button onClick={handleReorder} disabled={loading} size="sm">
              {loading ? "Reordering..." : "Apply Order"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Page order editor */}
          {order.length > 0 && (
            <div className="border rounded-lg p-4">
              <p className="text-sm text-zinc-500 mb-3">Drag to reorder pages. Current order shown below.</p>
              <div className="flex flex-wrap gap-2">
                {order.map((pageNum, idx) => (
                  <div
                    key={`${idx}-${pageNum}`}
                    draggable
                    onDragStart={() => setDragIdx(idx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragIdx !== null && dragIdx !== idx) {
                        movePage(dragIdx, idx);
                        setDragIdx(idx);
                      }
                    }}
                    onDragEnd={() => setDragIdx(null)}
                    className={`flex items-center gap-1 px-3 py-2 rounded border cursor-move text-sm select-none ${
                      dragIdx === idx ? "border-blue-400 bg-blue-50" : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <GripVertical className="h-3 w-3 text-zinc-400" />
                    Page {pageNum + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {outputBlob && (
            <div className="border rounded-lg p-6 text-center space-y-3">
              <p className="text-sm text-green-600 font-medium">PDF reordered successfully!</p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> Download Reordered PDF
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
