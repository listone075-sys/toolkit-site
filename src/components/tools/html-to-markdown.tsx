"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { htmlToMarkdown } from "@/lib/tools/markdown/html-to-md";
import { useClipboard } from "@/hooks/use-clipboard";
import { Copy, ArrowRight, Trash2 } from "lucide-react";

export function HtmlToMarkdown() {
  const t = useTranslations("components");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { copied, copy } = useClipboard();

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    const md = htmlToMarkdown(input);
    setOutput(md);
  }, [input]);

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            HTML
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (output) setOutput("");
            }}
            placeholder={t("htmlToMarkdown.placeholder")}
            className="flex-1 text-sm font-mono resize-none bg-zinc-50 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Output */}
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Markdown
          </div>
          {output ? (
            <textarea
              className="flex-1 text-sm font-mono resize-none bg-zinc-50 p-3 rounded border focus:outline-none"
              value={output}
              readOnly
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-zinc-400">{t("htmlToMarkdown.clickToConvert")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-center">
        <Button onClick={handleConvert} disabled={!input.trim()}>
          <ArrowRight className="h-4 w-4 mr-1" /> {t("htmlToMarkdown.convert")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => copy(output)} disabled={!output}>
          <Copy className="h-4 w-4 mr-1" /> {copied ? t("htmlToMarkdown.copied") : t("htmlToMarkdown.copy")}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
          <Trash2 className="h-4 w-4 mr-1" /> {t("htmlToMarkdown.clear")}
        </Button>
      </div>
    </div>
  );
}
