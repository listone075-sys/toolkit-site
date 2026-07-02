"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DropTarget } from "@/components/tools/file-upload-zone";
import { Upload } from "lucide-react";

interface EditorPanelProps {
  value: string;
  onChange: (value: string) => void;
  wordCount?: number;
  charCount?: number;
}

export function EditorPanel({ value, onChange, wordCount, charCount }: EditorPanelProps) {
  const t = useTranslations("components");
  const [pageDragOver, setPageDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  // Page-level drag-and-drop for .md/.txt files
  useEffect(() => {
    const hasFiles = (dt: DataTransfer | null) => {
      if (!dt) return false;
      try {
        return Array.from(dt.types).includes("Files");
      } catch {
        return dt.files.length > 0;
      }
    };

    const handleDragOver = (e: globalThis.DragEvent) => {
      if (hasFiles(e.dataTransfer)) {
        e.preventDefault();
        e.dataTransfer!.dropEffect = "copy";
      }
    };

    const handleDragEnter = (e: globalThis.DragEvent) => {
      if (hasFiles(e.dataTransfer)) {
        e.preventDefault();
        dragCounterRef.current += 1;
        setPageDragOver(true);
      }
    };

    const handleDragLeave = (e: globalThis.DragEvent) => {
      if (hasFiles(e.dataTransfer)) {
        dragCounterRef.current -= 1;
        if (dragCounterRef.current <= 0) {
          dragCounterRef.current = 0;
          setPageDragOver(false);
        }
      }
    };

    const handleDrop = (e: globalThis.DragEvent) => {
      if (hasFiles(e.dataTransfer)) {
        e.preventDefault();
        dragCounterRef.current = 0;
        setPageDragOver(false);
        const files = Array.from(e.dataTransfer?.files ?? []);
        if (files.length > 0) {
          const file = files[0];
          const name = file.name.toLowerCase();
          if (
            name.endsWith(".md") ||
            name.endsWith(".txt") ||
            name.endsWith(".markdown") ||
            file.type.startsWith("text/")
          ) {
            const reader = new FileReader();
            reader.onload = () => onChange(reader.result as string);
            reader.onerror = () => {};
            reader.readAsText(file);
          }
        }
      }
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, [onChange]);

  const handleFileDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const name = file.name.toLowerCase();
      if (
        !name.endsWith(".md") &&
        !name.endsWith(".txt") &&
        !name.endsWith(".markdown") &&
        !file.type.startsWith("text/")
      ) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.onerror = () => {};
      reader.readAsText(file);
    },
    [onChange],
  );

  return (
    <DropTarget onFiles={handleFileDrop}>
      <div className="flex flex-col min-h-[400px] relative">
        {/* Page-level drag overlay */}
        {pageDragOver && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-blue-50/80 backdrop-blur-sm border-[3px] border-blue-500 border-dashed rounded-none pointer-events-none">
            <div className="text-center">
              <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-blue-700 mb-1">{t("markdownWorkbench.edit.dropHereTitle")}</p>
              <p className="text-sm text-blue-500">{t("markdownWorkbench.edit.dropHereHint")}</p>
            </div>
          </div>
        )}

        <div className="border rounded-lg p-4 flex-1 flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Markdown</span>
            <div className="flex items-center gap-4 font-normal normal-case tracking-normal text-zinc-400 text-[11px]">
              <span>{t("markdownWorkbench.edit.dropHint")}</span>
              {(wordCount !== undefined || charCount !== undefined) && (
                <span>
                  {wordCount !== undefined && `${wordCount} words`}
                  {wordCount !== undefined && charCount !== undefined && " · "}
                  {charCount !== undefined && `${charCount} chars`}
                </span>
              )}
            </div>
          </div>
          <Textarea
            className="flex-1 font-mono text-sm resize-none border-0 shadow-none focus-visible:ring-0 p-0"
            placeholder={t("markdownWorkbench.edit.placeholder")}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
    </DropTarget>
  );
}
