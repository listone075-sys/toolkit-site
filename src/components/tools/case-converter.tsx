"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toKebabCase,
  toInvertCase,
} from "@/lib/tools/dev/case-converter";
import { useClipboard } from "@/hooks/use-clipboard";
import { Copy, Trash2 } from "lucide-react";

type CaseMode = "upper" | "lower" | "title" | "sentence" | "camel" | "kebab" | "invert";

const CASE_BUTTONS: { mode: CaseMode; labelKey: string }[] = [
  { mode: "upper", labelKey: "caseConverter.upper" },
  { mode: "lower", labelKey: "caseConverter.lower" },
  { mode: "title", labelKey: "caseConverter.title" },
  { mode: "sentence", labelKey: "caseConverter.sentence" },
  { mode: "camel", labelKey: "caseConverter.camel" },
  { mode: "kebab", labelKey: "caseConverter.kebab" },
  { mode: "invert", labelKey: "caseConverter.invert" },
];

const CONVERTERS: Record<CaseMode, (input: string) => string> = {
  upper: toUpperCase,
  lower: toLowerCase,
  title: toTitleCase,
  sentence: toSentenceCase,
  camel: toCamelCase,
  kebab: toKebabCase,
  invert: toInvertCase,
};

export function CaseConverter() {
  const t = useTranslations("components");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeMode, setActiveMode] = useState<CaseMode | null>(null);
  const { copied, copy } = useClipboard();

  const handleConvert = (mode: CaseMode) => {
    setActiveMode(mode);
    setOutput(CONVERTERS[mode](input));
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setActiveMode(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap p-3 bg-zinc-50 rounded-lg border">
        <div className="flex items-center gap-1 flex-wrap">
          {CASE_BUTTONS.map(({ mode, labelKey }) => (
            <Button
              key={mode}
              variant={activeMode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => handleConvert(mode)}
            >
              {t(labelKey)}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          <Button variant="outline" size="sm" onClick={() => copy(output)} disabled={!output}>
            <Copy className="h-4 w-4 mr-1" /> {copied ? t("caseConverter.copied") : t("caseConverter.copy")}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-1" /> {t("caseConverter.clear")}
          </Button>
        </div>
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("caseConverter.input")}
          </div>
          <Textarea
            className="flex-1 font-mono text-sm resize-none border-0 shadow-none focus-visible:ring-0 p-0"
            placeholder={t("caseConverter.placeholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("caseConverter.output")}
          </div>
          {output ? (
            <pre className="flex-1 text-sm font-mono whitespace-pre-wrap overflow-auto bg-zinc-50 p-3 rounded">
              {output}
            </pre>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-zinc-400">{t("caseConverter.clickToConvert")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
