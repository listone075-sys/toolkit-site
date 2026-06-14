import { diffLines, type Change } from "diff";

export interface DiffResult {
  type: "added" | "removed" | "unchanged";
  value: string;
  lineNumber: number;
}

/**
 * Compare two texts line by line
 */
export function compareTexts(oldText: string, newText: string): DiffResult[] {
  const changes: Change[] = diffLines(oldText, newText);
  const results: DiffResult[] = [];
  let lineNumber = 1;

  for (const change of changes) {
    const lines = change.value.split("\n");
    // Remove trailing empty line from split
    if (lines[lines.length - 1] === "") lines.pop();

    for (const line of lines) {
      results.push({
        type: change.added ? "added" : change.removed ? "removed" : "unchanged",
        value: line,
        lineNumber: change.added ? lineNumber : change.removed ? lineNumber : lineNumber,
      });
      if (!change.removed) lineNumber++;
    }
  }

  return results;
}

/**
 * Get summary stats
 */
export function diffStats(results: DiffResult[]) {
  return {
    added: results.filter((r) => r.type === "added").length,
    removed: results.filter((r) => r.type === "removed").length,
    unchanged: results.filter((r) => r.type === "unchanged").length,
    total: results.length,
  };
}
