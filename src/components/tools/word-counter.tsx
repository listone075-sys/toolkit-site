"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { countWords } from "@/lib/tools/dev/word-counter";
import { useClipboard } from "@/hooks/use-clipboard";
import { Copy, Trash2 } from "lucide-react";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border rounded-lg p-3 text-center">
      <p className="text-2xl font-bold text-zinc-900">{value.toLocaleString()}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
    </div>
  );
}

export function WordCounter() {
  const t = useTranslations("components");
  const [text, setText] = useState("");
  const { copied, copy } = useClipboard();

  const stats = useMemo(() => countWords(text), [text]);

  const handleClear = () => setText("");

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-lg border">
        <span className="text-sm font-medium text-zinc-600">{t("wordCounter.stats")}</span>
        <div className="ml-auto flex gap-1">
          <Button variant="outline" size="sm" onClick={() => copy(text)} disabled={!text}>
            <Copy className="h-4 w-4 mr-1" /> {copied ? t("wordCounter.copied") : t("wordCounter.copy")}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-1" /> {t("wordCounter.clear")}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <StatCard label={t("wordCounter.words")} value={stats.words} />
        <StatCard label={t("wordCounter.characters")} value={stats.characters} />
        <StatCard label={t("wordCounter.charsNoSpaces")} value={stats.charactersNoSpaces} />
        <StatCard label={t("wordCounter.lines")} value={stats.lines} />
        <StatCard label={t("wordCounter.sentences")} value={stats.sentences} />
        <StatCard label={t("wordCounter.paragraphs")} value={stats.paragraphs} />
      </div>

      {/* Text Input */}
      <div className="border rounded-lg p-0.5">
        <Textarea
          className="min-h-[320px] resize-y border-0 shadow-none focus-visible:ring-0 text-sm"
          placeholder={t("wordCounter.placeholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
