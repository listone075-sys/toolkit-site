"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { markdownToPptxBlob } from "@/lib/tools/markdown/md-to-pptx";
import { downloadFile } from "@/lib/utils/file";
import { Download, Presentation } from "lucide-react";

const placeholderMd = `# My Presentation

## Introduction

Welcome to the presentation! Here's what we'll cover:

- Background and context
- Key findings
- Next steps

## Key Findings

1. **Revenue** increased by 34% year-over-year
2. **User engagement** reached an all-time high
3. **Customer satisfaction** improved to 92%

## Market Analysis

| Region | Growth | Market Share |
|--------|--------|-------------|
| North America | +28% | 42% |
| Europe | +19% | 31% |
| Asia Pacific | +45% | 27% |

## Next Steps

- Expand into LATAM market
- Launch new product line
- Hire 50 more engineers

> Use \`##\` headings to create new slides. Each heading becomes a slide title.`;

export function MarkdownToPptx() {
  const t = useTranslations("components");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estimate slide count from H2 headings
  const slideCount = ((input || placeholderMd).match(/^##\s/gm) ?? []).length + 1;

  const handleConvert = useCallback(async () => {
    const md = input.trim() || placeholderMd;
    setLoading(true);
    setError(null);
    try {
      const blob = await markdownToPptxBlob(md);
      downloadFile(
        blob,
        "presentation.pptx",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
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
          <Presentation className="h-16 w-16 text-orange-200" />
          <div>
            <p className="text-sm text-zinc-600 mb-1">{t("markdownToPptx.emptyState")}</p>
            <p className="text-xs text-zinc-400">
              ~{slideCount} slide{slideCount !== 1 ? "s" : ""} estimated
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Use <code className="bg-zinc-100 px-1 rounded">##</code> headings to
              create new slides
            </p>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleConvert} disabled={loading} size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            {loading ? t("markdownToPptx.converting") : t("markdownToPptx.download")}
          </Button>
        </div>
      }
    />
  );
}
