"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { compareTexts, diffStats } from "@/lib/tools/dev/text-diff";
import { useClipboard } from "@/hooks/use-clipboard";
import { ArrowLeftRight, RotateCcw } from "lucide-react";

export function TextDiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState<ReturnType<typeof compareTexts> | null>(null);
  const [stats, setStats] = useState<ReturnType<typeof diffStats> | null>(null);
  const { copied, copy } = useClipboard();

  const handleCompare = useCallback(() => {
    const diff = compareTexts(left, right);
    setResult(diff);
    setStats(diffStats(diff));
  }, [left, right]);

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 min-h-[200px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Original</div>
          <Textarea
            className="flex-1 font-mono text-sm resize-none border-0 shadow-none focus-visible:ring-0 p-0"
            placeholder="Paste original text here..."
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="border rounded-lg p-4 min-h-[200px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Modified</div>
          <Textarea
            className="flex-1 font-mono text-sm resize-none border-0 shadow-none focus-visible:ring-0 p-0"
            placeholder="Paste modified text here..."
            value={right}
            onChange={(e) => setRight(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button onClick={handleCompare} disabled={!left && !right} className="gap-2">
          <ArrowLeftRight className="h-4 w-4" /> Compare
        </Button>
        <Button variant="outline" size="sm" onClick={() => { setLeft(""); setRight(""); setResult(null); setStats(null); }}>
          <RotateCcw className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-green-600">+{stats.added} added</span>
          <span className="text-red-500">-{stats.removed} removed</span>
          <span className="text-zinc-400">{stats.unchanged} unchanged</span>
        </div>
      )}

      {/* Diff result */}
      {result && (
        <div className="border rounded-lg p-4 bg-zinc-50 font-mono text-sm max-h-[400px] overflow-auto">
          {result.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap ${
                line.type === "added" ? "bg-green-50 text-green-800" :
                line.type === "removed" ? "bg-red-50 text-red-600 line-through" :
                "text-zinc-600"
              }`}
            >
              <span className="select-none mr-2 text-zinc-300 w-8 inline-block text-right">
                {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
              </span>
              {line.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
