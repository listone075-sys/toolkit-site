"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { markdownToDocxBlob } from "@/lib/tools/markdown/md-to-docx";
import { downloadFile } from "@/lib/utils/file";
import { Download, FileText } from "lucide-react";

const placeholderMd = `# Annual Report 2025

## Executive Summary

This year we achieved **record growth** across all segments.
Revenue increased by *34%* compared to the previous year.

## Key Metrics

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|----|
| Revenue | $2.1M | $2.8M | $3.2M | $4.1M |
| Users | 14K | 18K | 22K | 31K |

## Next Steps

1. Expand into new markets
2. Launch mobile application
3. Double the engineering team

> "Innovation distinguishes between a leader and a follower." — Steve Jobs

---

_Generated with ToolCraft Markdown to DOCX Converter_`;

export function MarkdownToDocx() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headingCount = (input || placeholderMd).match(/^#{1,6}\s/gm)?.length ?? 0;
  const wordCount = (input || placeholderMd).trim()
    ? (input || placeholderMd).trim().split(/\s+/).length
    : 0;

  const handleConvert = useCallback(async () => {
    const md = input.trim() || placeholderMd;
    setLoading(true);
    setError(null);
    try {
      const blob = await markdownToDocxBlob(md);
      downloadFile(
        blob,
        "document.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [input]);

  return (
    <ToolShell
      inputPanel={
        <Textarea
          className="flex-1 font-mono text-sm resize-none border-0 shadow-none focus-visible:ring-0 p-0 min-h-[350px]"
          placeholder={placeholderMd}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      }
      outputPanel={
        <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
          <FileText className="h-16 w-16 text-blue-200" />
          <div>
            <p className="text-sm text-zinc-600 mb-1">Ready to convert</p>
            <p className="text-xs text-zinc-400">
              {headingCount} heading{headingCount !== 1 ? "s" : ""} •{" "}
              {wordCount} word{wordCount !== 1 ? "s" : ""}
            </p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleConvert} disabled={loading} size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            {loading ? "Converting..." : "Download DOCX"}
          </Button>
        </div>
      }
    />
  );
}
