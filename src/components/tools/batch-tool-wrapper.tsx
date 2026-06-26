"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Download, Package, RotateCcw, X } from "lucide-react";
import type { BatchItem, ProcessResult } from "@/lib/batch/types";
import { processBatch } from "@/lib/batch/queue";
import { createZip, getBatchSummary } from "@/lib/batch/zip-utils";
import { downloadFile, formatFileSize } from "@/lib/utils/file";
import { cn } from "@/lib/utils/cn";
import { FileUploadZone } from "./file-upload-zone";

interface BatchToolWrapperProps {
  /** The processing function for a single file */
  processFn: (file: File) => Promise<ProcessResult>;
  /** Accepted MIME types */
  acceptTypes: string;
  /** Max concurrent processing */
  concurrency?: number;
  /** Max number of files */
  maxFiles?: number;
  /** Title shown in the upload zone */
  title: string;
  /** Description shown in the upload zone */
  description: string;
  /** Label for the browse button */
  browseLabel?: string;
  /** Optional extra content rendered below the batch UI (e.g., quality slider) */
  children?: React.ReactNode;
  /** Optional class name */
  className?: string;
}

export function BatchToolWrapper({
  processFn,
  acceptTypes,
  concurrency = 2,
  maxFiles = 20,
  title,
  description,
  browseLabel,
  children,
  className,
}: BatchToolWrapperProps) {
  const t = useTranslations("components");
  const [items, setItems] = useState<BatchItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const abortRef = useRef(false);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const capped = files.slice(0, maxFiles);
      abortRef.current = false;

      setProcessing(true);
      setDone(false);

      const results = await processBatch(capped, processFn, {
        concurrency,
        onItemUpdate: (updated) => {
          if (abortRef.current) return;
          setItems((prev) =>
            prev.map((item) => (item.id === updated.id ? { ...updated } : item)),
          );
        },
      });

      if (!abortRef.current) {
        setProcessing(false);
        setDone(true);
      }
    },
    [processFn, concurrency, maxFiles],
  );

  const handleDownloadZip = useCallback(async () => {
    const succeeded = items.filter((i) => i.status === "done");
    if (succeeded.length === 0) return;
    const zipBlob = await createZip(succeeded, "toolcraft-batch.zip");
    downloadFile(zipBlob, "toolcraft-batch.zip", "application/zip");
  }, [items]);

  const handleReset = useCallback(() => {
    abortRef.current = true;
    setItems([]);
    setProcessing(false);
    setDone(false);
  }, []);

  const summary = getBatchSummary(items);

  // Upload phase (no files yet)
  if (items.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <FileUploadZone
          title={title}
          description={description}
          browseLabel={browseLabel ?? t("imageConverter.browse")}
          accept={acceptTypes}
          multiple
          onFiles={(files) => {
            // Initialize batch items from the files
            const newItems: BatchItem[] = files.slice(0, maxFiles).map((file) => ({
              id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
              file,
              status: "pending" as const,
              progress: 0,
            }));
            setItems(newItems);
            handleFiles(files);
          }}
        />
        {children}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* File list + progress */}
      <div className="border rounded-lg divide-y">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              item.status === "error" && "bg-red-50",
              item.status === "done" && "bg-green-50/50",
            )}
          >
            {/* File info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-900 truncate">
                {item.file.name}
              </div>
              <div className="text-xs text-zinc-500">
                {formatFileSize(item.file.size)}
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 shrink-0">
              {item.status === "pending" && (
                <span className="text-xs text-zinc-400">{t("batch.pending")}</span>
              )}
              {item.status === "processing" && (
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-blue-600">{t("batch.processing")}</span>
                </div>
              )}
              {item.status === "done" && (
                <span className="text-xs text-green-600 font-medium">
                  {item.result ? formatFileSize(item.result.blob.size) : t("batch.done")}
                </span>
              )}
              {item.status === "error" && (
                <span className="text-xs text-red-500">{item.error || t("batch.failed")}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm text-zinc-600">
          {processing ? (
            t("batch.processingCount", {
              current: summary.succeeded,
              total: summary.total,
            })
          ) : done ? (
            <span>
              <span className="text-green-600 font-medium">
                {summary.succeeded} {t("batch.succeeded")}
              </span>
              {summary.failed > 0 && (
                <span className="text-red-500 ml-2">
                  {summary.failed} {t("batch.failedCount")}
                </span>
              )}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {done && summary.succeeded > 0 && (
            <Button onClick={handleDownloadZip} size="sm" className="gap-1.5">
              <Package className="h-4 w-4" />
              {t("batch.downloadZip", { count: summary.succeeded })}
            </Button>
          )}
          {done && (
            <Button onClick={handleReset} variant="outline" size="sm" className="gap-1.5">
              <RotateCcw className="h-4 w-4" />
              {t("batch.startOver")}
            </Button>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
