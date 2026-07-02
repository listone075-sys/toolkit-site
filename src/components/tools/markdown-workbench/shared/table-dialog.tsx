"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateMarkdownTable, type CellAlignment, type TableData } from "@/lib/tools/markdown/table-gen";
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight, X, Table } from "lucide-react";

interface TableDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (tableMarkdown: string) => void;
}

export function TableDialog({ open, onClose, onInsert }: TableDialogProps) {
  const t = useTranslations("components");
  const [headers, setHeaders] = useState<string[]>(["Column 1", "Column 2", "Column 3"]);
  const [alignments, setAlignments] = useState<CellAlignment[]>(["left", "left", "left"]);
  const [rows, setRows] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
  ]);

  if (!open) return null;

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
    setHeaders([...headers, `Column ${headers.length + 1}`]);
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

  const handleInsert = () => {
    onInsert("\n" + markdown + "\n");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
            <Table className="h-5 w-5" />
            {t("markdownWorkbench.edit.insertTable")}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
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

          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4 mr-1" /> {t("markdownWorkbench.edit.addRow")}
          </Button>

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-zinc-50">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t("markdownWorkbench.edit.tablePreview")}
            </span>
            <pre className="text-sm font-mono whitespace-pre-wrap mt-2">{markdown}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-zinc-50">
          <Button variant="outline" onClick={onClose}>
            {t("markdownWorkbench.edit.cancel")}
          </Button>
          <Button onClick={handleInsert}>
            {t("markdownWorkbench.edit.insertTableBtn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
