import JSZip from "jszip";
import type { BatchItem } from "./types";

/**
 * Create a ZIP blob from successfully processed batch items.
 */
export async function createZip(
  items: BatchItem[],
  zipName = "toolcraft-batch.zip",
): Promise<Blob> {
  const zip = new JSZip();

  const nameCount: Record<string, number> = {};

  for (const item of items) {
    if (item.status !== "done" || !item.result) continue;

    let fileName = item.result.fileName;
    const ext = fileName.includes(".") ? "" : "";
    const base = fileName.includes(".")
      ? fileName.slice(0, fileName.lastIndexOf("."))
      : fileName;
    const extension = fileName.includes(".")
      ? fileName.slice(fileName.lastIndexOf("."))
      : "";

    // Handle duplicate filenames
    if (nameCount[fileName] !== undefined) {
      nameCount[fileName]++;
      fileName = `${base} (${nameCount[fileName]})${extension}`;
    } else {
      nameCount[fileName] = 0;
    }

    zip.file(fileName, item.result.blob);
  }

  return zip.generateAsync({ type: "blob" });
}

/**
 * Summary of batch processing results.
 */
export interface BatchSummary {
  total: number;
  succeeded: number;
  failed: number;
}

export function getBatchSummary(items: BatchItem[]): BatchSummary {
  return {
    total: items.length,
    succeeded: items.filter((i) => i.status === "done").length,
    failed: items.filter((i) => i.status === "error").length,
  };
}
