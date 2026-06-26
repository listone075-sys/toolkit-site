import type { BatchItem, ProcessResult } from "./types";

let idCounter = 0;

function nextId(): string {
  return `batch-${++idCounter}-${Date.now()}`;
}

/**
 * Process files with limited concurrency using a worker pool pattern.
 * Each worker pulls from a shared queue until all files are processed.
 * Calls onItemUpdate for each status change.
 */
export async function processBatch(
  files: File[],
  processFn: (file: File) => Promise<ProcessResult>,
  options: {
    concurrency: number;
    onItemUpdate: (item: BatchItem) => void;
  },
): Promise<BatchItem[]> {
  const items: BatchItem[] = files.map((file) => ({
    id: nextId(),
    file,
    status: "pending" as const,
    progress: 0,
  }));

  // Notify initial state
  items.forEach((item) => options.onItemUpdate(item));

  const queue = [...items];
  const workerCount = Math.max(1, Math.min(options.concurrency, items.length));
  const workers: Promise<void>[] = [];

  const worker = async () => {
    while (true) {
      const item = queue.shift();
      if (!item) break;

      item.status = "processing";
      item.progress = 10;
      options.onItemUpdate({ ...item });

      try {
        const result = await processFn(item.file);
        item.status = "done";
        item.progress = 100;
        item.result = result;
      } catch (err) {
        item.status = "error";
        item.progress = 100;
        item.error = err instanceof Error ? err.message : "Unknown error";
      }

      options.onItemUpdate({ ...item });
    }
  };

  // Start workers
  for (let i = 0; i < workerCount; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
  return items;
}
