"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { reorderPdfPages, reversePdfPages } from "@/lib/tools/pdf/reorder";
import { downloadFile } from "@/lib/utils/file";
import { Download, X, FileText, GripVertical, ArrowUpDown } from "lucide-react";

export function PdfReorder() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const loadFile = useCallback(async (files: File[]) => {
    const f = files[0];
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError(t("pdfReorder.uploadError"));
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
      setError("Failed to read PDF. The file may be corrupted or password-protected.");
      setPageCount(0);
      setOrder([]);
    }
  }, [t]);

  const movePage = (fromIdx: number, toIdx: number) => {
    const newOrder = [...order];
    const [moved] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, moved);
    setOrder(newOrder);
  };

  const handleApply = async (newOrder: number[]) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await reorderPdfPages(file, newOrder);
      setOutputBlob(blob);
      setOrder(newOrder);
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
        <FileUploadZone
          title={t("pdfReorder.uploadPdf")}
          description={t("pdfReorder.orDragDrop")}
          browseLabel={t("pdfReorder.browse")}
          accept=".pdf,application/pdf"
          onFiles={loadFile}
        />
      ) : (
        <>
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border flex-wrap">
            <FileText className="h-5 w-5 text-zinc-500" />
            <span className="text-sm font-medium flex-1 min-w-0 truncate">{file.name}</span>
            <span className="text-xs text-zinc-400">{t("pdfReorder.pageCount", { count: pageCount })}</span>
            <Button onClick={handleReverse} disabled={loading} variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-1" /> {t("pdfReorder.reverse")}
            </Button>
            <Button onClick={() => handleApply(order)} disabled={loading} size="sm">
              {loading ? t("pdfReorder.reordering") : t("pdfReorder.apply")}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Page order editor */}
          {order.length > 0 && (
            <div className="border rounded-lg p-4">
              <p className="text-sm text-zinc-500 mb-3">{t("pdfReorder.dragHint")}</p>
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
                    {t("pdfReorder.pageLabel", { n: pageNum + 1 })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {outputBlob && (
            <div className="border rounded-lg p-6 text-center space-y-3">
              <p className="text-sm text-green-600 font-medium">{t("pdfReorder.reordered")}</p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" /> {t("pdfReorder.download")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
