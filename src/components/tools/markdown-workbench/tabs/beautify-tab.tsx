"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { useWorkbench } from "../context";
import { formatMarkdown, type FormatOptions } from "@/lib/tools/markdown/format";
import { Copy, Sparkles, ArrowRight, Trash2 } from "lucide-react";

export function BeautifyTab() {
  const t = useTranslations("components");
  const { markdown, setMarkdown } = useWorkbench();
  const [output, setOutput] = useState("");
  const [options, setOptions] = useState<FormatOptions>({
    headingSpacing: true,
    fixListIndent: true,
    listSpacing: true,
    trimTrailing: true,
    normalizeCodeFences: true,
  });
  const { copied: inputCopied, copy: copyInput } = useClipboard();
  const { copied: outputCopied, copy: copyOutput } = useClipboard();

  const handleFormat = useCallback(() => {
    if (!markdown.trim()) return;
    const formatted = formatMarkdown(markdown, options);
    setOutput(formatted);
  }, [markdown, options]);

  const handleApply = () => {
    if (output) {
      setMarkdown(output);
    }
  };

  const handleClear = () => {
    setOutput("");
  };

  const toggleOption = (key: keyof FormatOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const changeCount = useMemo(() => {
    if (!output) return 0;
    const inputLines = markdown.split("\n");
    const outputLines = output.split("\n");
    return Math.abs(outputLines.length - inputLines.length) +
      inputLines.filter((l, i) => l !== outputLines[i]).length;
  }, [markdown, output]);

  return (
    <div className="space-y-4">
      {/* Format options */}
      <div className="flex items-center gap-4 flex-wrap p-3 bg-zinc-50 rounded-lg border">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t("markdownWorkbench.beautify.options")}</span>
        {(["headingSpacing", "fixListIndent", "listSpacing", "trimTrailing", "normalizeCodeFences"] as Array<keyof FormatOptions>).map((key) => (
          <label key={key} className="flex items-center gap-1.5 text-sm text-zinc-600 cursor-pointer">
            <input
              type="checkbox"
              checked={options[key] ?? true}
              onChange={() => toggleOption(key)}
              className="rounded border-zinc-300"
            />
            {t(`markdownWorkbench.beautify.optionsLabels.${key}`)}
          </label>
        ))}
      </div>

      {/* Input / Output columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input (editable, syncs to context) */}
        <div className="border rounded-lg p-4 flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t("markdownWorkbench.beautify.input")}
            </span>
            <Button variant="ghost" size="sm" onClick={() => copyInput(markdown)} disabled={!markdown}>
              <Copy className="h-3 w-3 mr-1" /> {inputCopied ? t("markdownWorkbench.edit.copied") : t("markdownWorkbench.edit.copyMarkdown")}
            </Button>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => { setMarkdown(e.target.value); if (output) setOutput(""); }}
            placeholder={t("markdownWorkbench.edit.placeholder")}
            className="flex-1 text-sm font-mono resize-none bg-zinc-50 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Output (read-only) */}
        <div className="border rounded-lg p-4 flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t("markdownWorkbench.beautify.output")}
            </span>
            <Button variant="ghost" size="sm" onClick={() => copyOutput(output)} disabled={!output}>
              <Copy className="h-3 w-3 mr-1" /> {outputCopied ? t("markdownWorkbench.edit.copied") : t("markdownWorkbench.edit.copyMarkdown")}
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
              <p className="text-sm text-zinc-400">{t("markdownWorkbench.beautify.clickToFormat")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-center">
        <Button onClick={handleFormat} disabled={!markdown.trim()} size="lg">
          <Sparkles className="h-4 w-4 mr-1" /> {t("markdownWorkbench.beautify.format")}
        </Button>
        {output && (
          <>
            <Button variant="outline" onClick={handleApply}>
              <ArrowRight className="h-4 w-4 mr-1" /> {t("markdownWorkbench.beautify.applyToEditor")}
            </Button>
            <span className="text-sm text-zinc-500">
              {t("markdownWorkbench.beautify.changes", { count: changeCount })}
            </span>
          </>
        )}
        <Button variant="ghost" size="sm" onClick={handleClear} disabled={!output}>
          <Trash2 className="h-4 w-4 mr-1" /> {t("markdownWorkbench.edit.clear")}
        </Button>
      </div>
    </div>
  );
}
