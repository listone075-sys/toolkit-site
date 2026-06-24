"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateMarkdownTable, type CellAlignment, type TableData } from "@/lib/tools/markdown/table-gen";
import { useClipboard } from "@/hooks/use-clipboard";
import { downloadFile } from "@/lib/utils/file";
import { Plus, Trash2, Copy, Download, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export function MarkdownTableGenerator() {
  const t = useTranslations("components");
  const [headers, setHeaders] = useState<string[]>([t("markdownTableGenerator.columnLabel", { n: 1 }), t("markdownTableGenerator.columnLabel", { n: 2 }), t("markdownTableGenerator.columnLabel", { n: 3 })]);
  const [alignments, setAlignments] = useState<CellAlignment[]>(["left", "left", "left"]);
  const [rows, setRows] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
  ]);
  const { copied, copy } = useClipboard();

  const updateHeader = (i: number, value: string) => {
    const next = [...headers];
    next[i] = value;
    setHeaders(next);
  };

  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const next = rows.map((r) => [...r]);
    next[rowIdx][colIdx] = value;
    setRows(next);
  };

  const toggleAlignment = (colIdx: number) => {
    const next = [...alignments];
    const cycle: CellAlignment[] = ["left", "center", "right"];
    const currentIdx = cycle.indexOf(next[colIdx]);
    next[colIdx] = cycle[(currentIdx + 1) % 3];
    setAlignments(next);
  };

  const addColumn = () => {
    setHeaders([...headers, t("markdownTableGenerator.columnLabel", { n: headers.length + 1 })]);
    setAlignments([...alignments, "left"]);
    setRows(rows.map((r) => [...r, ""]));
  };

  const removeColumn = (colIdx: number) => {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, i) => i !== colIdx));
    setAlignments(alignments.filter((_, i) => i !== colIdx));
    setRows(rows.map((r) => r.filter((_, i) => i !== colIdx)));
  };

  const addRow = () => {
    setRows([...rows, Array(headers.length).fill("")]);
  };

  const removeRow = (rowIdx: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== rowIdx));
  };

  const tableData: TableData = { headers, rows, alignments };
  const markdown = generateMarkdownTable(tableData);

  const alignIcon = (a: CellAlignment) => {
    switch (a) {
      case "left": return <AlignLeft className="h-3 w-3" />;
      case "center": return <AlignCenter className="h-3 w-3" />;
      case "right": return <AlignRight className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Table editor */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="border p-2 bg-zinc-50 align-top">
                  <div className="flex items-center gap-1 mb-1">
                    <Input
                      className="h-8 text-sm font-semibold"
                      value={h}
                      onChange={(e) => updateHeader(i, e.target.value)}
                      placeholder="Header"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => toggleAlignment(i)}
                      title={`Align: ${alignments[i]}`}
                    >
                      {alignIcon(alignments[i])}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-red-400"
                      onClick={() => removeColumn(i)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </th>
              ))}
              <th className="border p-1 bg-zinc-50 w-10">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addColumn}>
                  <Plus className="h-3 w-3" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border p-1">
                    <Input
                      className="h-8 text-sm border-0 shadow-none"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      placeholder="Cell"
                    />
                  </td>
                ))}
                <td className="border p-1 text-center w-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-400"
                    onClick={() => removeRow(ri)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-4 w-4 mr-1" /> {t("markdownTableGenerator.addRow")}
        </Button>
      </div>

      {/* Markdown Output */}
      <div className="border rounded-lg p-4 bg-zinc-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t("markdownTableGenerator.markdownOutput")}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => copy(markdown)}>
              <Copy className="h-3 w-3 mr-1" /> {copied ? t("markdownTableGenerator.copied") : t("markdownTableGenerator.copy")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadFile(markdown, "table.md", "text/markdown")}
            >
              <Download className="h-3 w-3 mr-1" /> {t("markdownTableGenerator.download")}
            </Button>
          </div>
        </div>
        <pre className="text-sm font-mono whitespace-pre-wrap">{markdown}</pre>
      </div>
    </div>
  );
}
