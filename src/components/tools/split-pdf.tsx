"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { splitPdf, extractPages } from "@/lib/tools/pdf/split";
import type { SplitResult } from "@/lib/tools/pdf/split";
import { downloadFile } from "@/lib/utils/file";
import { Download, X, FileText, Scissors } from "lucide-react";

export function SplitPdf() {
  const t = useTranslations("components");
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<SplitResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [rangeBlob, setRangeBlob] = useState<Blob | null>(null);

  const loadFile = useCallback((files: File[]) => {
    const f = files[0];
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setError(t("splitPdf.uploadError"));
      return;
    }
    setFile(f);
    setError(null);
    setPages(null);
    setRangeBlob(null);
  }, [t]);

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
      setError(t("splitPdf.invalidRange"));
      return;
    }
    const startP = parseInt(match[1]);
    const endP = parseInt(match[2]);
    if (startP > endP) {
      setError(t("splitPdf.invalidOrder"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const blob = await extractPages(file, startP, endP);
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
        <FileUploadZone
          title={t("splitPdf.uploadPdf")}
          description={t("splitPdf.orDragDrop")}
          browseLabel={t("splitPdf.browse")}
          accept=".pdf,application/pdf"
          onFiles={loadFile}
        />
      ) : (
        <>
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border flex-wrap">
            <FileText className="h-5 w-5 text-zinc-500" />
            <span className="text-sm font-medium flex-1 min-w-0 truncate">{file.name}</span>
            <Button onClick={handleSplit} disabled={loading} size="sm">
              <Scissors className="h-4 w-4 mr-1" /> {loading ? t("splitPdf.splitting") : t("splitPdf.splitAll")}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Page range extraction */}
          <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border">
            <span className="text-sm text-zinc-600">{t("splitPdf.extractRange")}</span>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder={t("splitPdf.rangePlaceholder")}
              className="w-24 px-2 py-1 text-sm border rounded"
            />
            <Button onClick={handleExtractRange} disabled={loading || !pageRange.trim()} size="sm" variant="outline">
              {t("splitPdf.extract")}
            </Button>
            {rangeBlob && (
              <Button size="sm" onClick={() => {
                const name = file.name.replace(/\.pdf$/i, `_p${pageRange.replace(/[-–]/, "-")}.pdf`);
                downloadFile(rangeBlob, name, "application/pdf");
              }}>
                <Download className="h-4 w-4 mr-1" /> {t("splitPdf.download")}
              </Button>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Individual pages */}
          {pages && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-600">{t("splitPdf.pagesExtracted", { count: pages.length })}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {pages.map((page) => (
                  <div key={page.pageNumber} className="border rounded-lg p-3 text-center space-y-2">
                    <p className="text-sm font-medium">{t("splitPdf.pageLabel", { n: page.pageNumber })}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const name = file.name.replace(/\.pdf$/i, `_page_${page.pageNumber}.pdf`);
                        downloadFile(page.blob, name, "application/pdf");
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" /> {t("splitPdf.download")}
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
