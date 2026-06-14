export type CellAlignment = "left" | "center" | "right";

export interface TableData {
  headers: string[];
  rows: string[][];
  alignments: CellAlignment[];
}

/**
 * Generate a Markdown table string from structured data
 */
export function generateMarkdownTable(data: TableData): string {
  const { headers, rows, alignments } = data;
  if (headers.length === 0) return "";

  // Header row
  const headerLine = `| ${headers.join(" | ")} |`;

  // Alignment row
  const alignMap: Record<CellAlignment, string> = {
    left: ":---",
    center: ":---:",
    right: "---:",
  };
  const alignLine = `| ${alignments.map((a) => alignMap[a]).join(" | ")} |`;

  // Data rows
  const dataLines = rows.map(
    (row) => `| ${row.map((cell) => cell.replace(/\|/g, "\\|")).join(" | ")} |`,
  );

  return [headerLine, alignLine, ...dataLines].join("\n");
}

/**
 * Parse a Markdown table string back to structured data
 */
export function parseMarkdownTable(text: string): TableData | null {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return null;

  // Parse headers
  const headerMatch = lines[0].match(/^\|(.+)\|$/);
  if (!headerMatch) return null;
  const headers = headerMatch[1].split("|").map((h) => h.trim());

  // Parse alignment
  const alignMatch = lines[1].match(/^\|(.+)\|$/);
  if (!alignMatch) return null;
  const alignments = alignMatch[1].split("|").map((a) => {
    const trimmed = a.trim();
    if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center" as CellAlignment;
    if (trimmed.endsWith(":")) return "right" as CellAlignment;
    return "left" as CellAlignment;
  });

  // Parse data rows
  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const rowMatch = lines[i].match(/^\|(.+)\|$/);
    if (!rowMatch) continue;
    rows.push(rowMatch[1].split("|").map((c) => c.trim()));
  }

  return { headers, rows, alignments };
}
