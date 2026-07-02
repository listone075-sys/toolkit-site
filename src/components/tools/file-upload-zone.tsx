"use client";

import { useState, useRef, useCallback, type DragEvent, type ReactNode } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface FileUploadZoneProps {
  /** Title text (e.g., "Upload PDF File") */
  title: string;
  /** Description/hint text (e.g., "or drag & drop your PDF here") */
  description: string;
  /** Browse button label (e.g., "Browse Files") */
  browseLabel: string;
  /** HTML accept attribute (e.g., ".pdf,application/pdf", "image/*") */
  accept: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Called when files are selected (via drop or browse). Single file if multiple=false. */
  onFiles: (files: File[]) => void;
  /** Optional custom icon. Defaults to Upload icon. */
  icon?: ReactNode;
  /** Extra class names applied to the outer container */
  className?: string;
  /** Extra content rendered below the browse button */
  children?: ReactNode;
}

/**
 * Reusable file upload drop zone with drag-and-drop support.
 * Used by 12+ tool components to eliminate duplicated upload UI.
 */
export function FileUploadZone({
  title,
  description,
  browseLabel,
  accept,
  multiple = false,
  onFiles,
  icon,
  className = "",
  children,
}: FileUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFiles(multiple ? files : [files[0]]);
      }
    },
    [onFiles, multiple],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) {
        onFiles(multiple ? files : [files[0]]);
        // Reset so the same file can be re-selected
        e.target.value = "";
      }
    },
    [onFiles, multiple],
  );

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors min-h-[200px] ${
        dragOver ? "border-blue-400 bg-blue-50" : "border-zinc-200 hover:border-zinc-300"
      } ${className}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {icon ?? <Upload className="h-10 w-10 text-zinc-300 mb-3" />}
      <p className="text-sm font-medium text-zinc-600 mb-1">{title}</p>
      <p className="text-xs text-zinc-400 mb-3">{description}</p>
      <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-accent">
        {browseLabel}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
      </label>
      {children}
    </div>
  );
}

/**
 * Thin drag-drop wrapper that adds drop handlers to any children.
 * Use to restore drag-to-replace behavior on file-display areas
 * after FileUploadZone has been replaced with a file-info bar.
 */
export function DropTarget({
  onFiles,
  className,
  children,
}: {
  onFiles: (files: File[]) => void;
  className?: string;
  children: ReactNode;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={cn(className, "transition-colors", dragOver && "bg-blue-50 rounded-lg ring-2 ring-blue-400")}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) onFiles(files);
      }}
    >
      {children}
    </div>
  );
}
