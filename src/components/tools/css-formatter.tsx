"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { beautifyCss, minifyCss } from "@/lib/tools/dev/css-formatter";
import { useClipboard } from "@/hooks/use-clipboard";
import { Copy, Trash2, Minimize2, Paintbrush } from "lucide-react";

export function CssFormatter() {
  const t = useTranslations("components");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { copied, copy } = useClipboard();

  const handleBeautify = () => {
    try {
      setOutput(beautifyCss(input));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleMinify = () => {
    try {
      setOutput(minifyCss(input));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border">
        <Button onClick={handleBeautify} size="sm">
          <Paintbrush className="h-4 w-4 mr-1" /> {t("cssFormatter.beautify")}
        </Button>
        <Button variant="outline" onClick={handleMinify} size="sm">
          <Minimize2 className="h-4 w-4 mr-1" /> {t("cssFormatter.minify")}
        </Button>
        <div className="ml-auto flex gap-1">
          <Button variant="outline" size="sm" onClick={() => copy(output)} disabled={!output}>
            <Copy className="h-4 w-4 mr-1" /> {copied ? t("cssFormatter.copied") : t("cssFormatter.copy")}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-1" /> {t("cssFormatter.clear")}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Input / Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 min-h-[320px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("cssFormatter.input")}
          </div>
          <Textarea
            className="flex-1 font-mono text-sm resize-none border-0 shadow-none focus-visible:ring-0 p-0"
            placeholder={t("cssFormatter.inputPlaceholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="border rounded-lg p-4 min-h-[320px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("cssFormatter.output")}
          </div>
          {output ? (
            <pre className="flex-1 text-sm font-mono whitespace-pre-wrap overflow-auto bg-zinc-50 p-3 rounded">
              {output}
            </pre>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-zinc-400">{t("cssFormatter.clickToProcess")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
