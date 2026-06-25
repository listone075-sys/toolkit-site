"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { testRegex, validateRegex } from "@/lib/tools/dev/regex-tester";
import { useClipboard } from "@/hooks/use-clipboard";
import { Copy, Trash2 } from "lucide-react";

const FLAG_OPTIONS = [
  { key: "g", labelKey: "regex.global" },
  { key: "i", labelKey: "regex.caseInsensitive" },
  { key: "m", labelKey: "regex.multiline" },
  { key: "s", labelKey: "regex.dotAll" },
  { key: "u", labelKey: "regex.unicode" },
];

export function RegexTester() {
  const t = useTranslations("components");
  const [input, setInput] = useState("");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const { copied, copy } = useClipboard();

  const validationError = useMemo(() => validateRegex(pattern), [pattern]);
  const matches = useMemo(() => testRegex(input, pattern, flags), [input, pattern, flags]);

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag,
    );
  };

  // Highlight matches in the input text
  const highlightedInput = useMemo(() => {
    if (!pattern || !input || matches.length === 0) return null;
    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;
    for (const m of matches) {
      if (m.index > lastIndex) {
        parts.push({ text: input.slice(lastIndex, m.index), highlight: false });
      }
      parts.push({ text: input.slice(m.index, m.index + m.text.length), highlight: true });
      lastIndex = m.index + m.text.length;
    }
    if (lastIndex < input.length) {
      parts.push({ text: input.slice(lastIndex), highlight: false });
    }
    return parts;
  }, [input, matches, pattern]);

  const handleClear = () => {
    setInput("");
    setPattern("");
    setFlags("g");
  };

  return (
    <div className="space-y-4">
      {/* Pattern Input */}
      <div className="flex items-center gap-3 flex-wrap p-3 bg-zinc-50 rounded-lg border">
        <span className="text-sm font-medium text-zinc-500">/</span>
        <Input
          className="flex-1 min-w-[200px] font-mono text-sm"
          placeholder={t("regex.patternPlaceholder")}
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        />
        <span className="text-sm font-medium text-zinc-500">/</span>
        <div className="flex gap-1">
          {FLAG_OPTIONS.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => toggleFlag(key)}
              className={`px-2 py-0.5 text-xs font-mono rounded border ${
                flags.includes(key)
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          <Button variant="outline" size="sm" onClick={() => copy(input)} disabled={!input}>
            <Copy className="h-4 w-4 mr-1" /> {copied ? t("regex.copied") : t("regex.copy")}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-1" /> {t("regex.clear")}
          </Button>
        </div>
      </div>

      {validationError && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{validationError}</p>
      )}

      {/* Input + Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("regex.testString")}
          </div>
          {highlightedInput ? (
            <pre className="flex-1 text-sm font-mono whitespace-pre-wrap overflow-auto">
              {highlightedInput.map((p, i) =>
                p.highlight ? (
                  <mark key={i} className="bg-yellow-200 rounded-sm px-0.5">{p.text}</mark>
                ) : (
                  <span key={i}>{p.text}</span>
                ),
              )}
            </pre>
          ) : (
            <Textarea
              className="flex-1 font-mono text-sm resize-none border-0 shadow-none focus-visible:ring-0 p-0"
              placeholder={t("regex.inputPlaceholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          )}
        </div>

        <div className="border rounded-lg p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("regex.matches")} ({matches.length})
          </div>
          {matches.length > 0 ? (
            <div className="flex-1 overflow-auto space-y-1">
              {matches.map((m, i) => (
                <div key={i} className="bg-zinc-50 rounded px-3 py-1.5 font-mono text-sm">
                  <span className="text-xs text-zinc-400 mr-2">[{m.index}]</span>
                  <span className="text-blue-700">{m.text}</span>
                  {m.groups.length > 0 && (
                    <span className="text-xs text-zinc-500 ml-2">
                      groups: {m.groups.join(", ")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-zinc-400">
                {pattern ? t("regex.noMatches") : t("regex.enterPattern")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
