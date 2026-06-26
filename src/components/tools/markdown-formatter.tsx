"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { formatMarkdown } from "@/lib/tools/markdown/format";
import { useClipboard } from "@/hooks/use-clipboard";
import { DropTarget } from "./file-upload-zone";
import { Copy, Sparkles, Trash2 } from "lucide-react";

export function MarkdownFormatter() {
  const t = useTranslations("components");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { copied: copyMdCopied, copy: copyMd } = useClipboard();
  const { copied: copyOutputCopied, copy: copyOutput } = useClipboard();

  const handleFormat = useCallback(() => {
    if (!input.trim()) return;
    const formatted = formatMarkdown(input);
    setOutput(formatted);
  }, [input]);

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleFileDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".md") && !name.endsWith(".txt") && !name.endsWith(".markdown") && !file.type.startsWith("text/")) return;
    const reader = new FileReader();
    reader.onload = () => { setInput(reader.result as string); setOutput(""); };
    reader.readAsText(file);
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <DropTarget onFiles={handleFileDrop} className="flex flex-col min-h-[350px]">
          <div className="border rounded-lg p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {t("markdownFormatter.input")}
              </span>
              <span className="text-[11px] text-zinc-300 mr-2">{t("markdownFormatter.dropHint")}</span>
              <Button variant="ghost" size="sm" onClick={() => copyMd(input)} disabled={!input}>
                <Copy className="h-3 w-3 mr-1" /> {copyMdCopied ? t("markdownFormatter.copied") : t("markdownFormatter.copyMd")}
              </Button>
            </div>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (output) setOutput("");
              }}
              placeholder={t("markdownFormatter.placeholder")}
              className="flex-1 text-sm font-mono resize-none bg-zinc-50 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </DropTarget>

        {/* Output */}
        <div className="border rounded-lg p-4 min-h-[350px] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t("markdownFormatter.output")}
            </span>
            <Button variant="ghost" size="sm" onClick={() => copyOutput(output)} disabled={!output}>
              <Copy className="h-3 w-3 mr-1" /> {copyOutputCopied ? t("markdownFormatter.copied") : t("markdownFormatter.copy")}
            </Button>
          </div>
          {output ? (
            <textarea
              className="flex-1 text-sm font-mono resize-none bg-zinc-50 p-3 rounded border focus:outline-none"
              value={output}
              readOnly
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-zinc-400">{t("markdownFormatter.clickToFormat")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-center">
        <Button onClick={handleFormat} disabled={!input.trim()} size="lg">
          <Sparkles className="h-4 w-4 mr-1" /> {t("markdownFormatter.format")}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
          <Trash2 className="h-4 w-4 mr-1" /> {t("markdownFormatter.clear")}
        </Button>
      </div>
    </div>
  );
}
