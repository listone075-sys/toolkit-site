export interface ProcessResult {
  blob: Blob;
  mimeType: string;
  fileName: string;
}

export interface BatchItem {
  id: string;
  file: File;
  status: "pending" | "processing" | "done" | "error";
  progress: number; // 0-100
  result?: ProcessResult;
  error?: string;
}

export interface BatchConfig {
  /** Max concurrent processing (default: 2 for image, 1 for PDF) */
  concurrency: number;
  /** Accepted MIME types, e.g. "image/*" */
  acceptTypes: string;
  /** Max number of files (default: 20) */
  maxFiles?: number;
}
