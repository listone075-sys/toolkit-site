"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateUuidV4, generateUuids } from "@/lib/tools/dev/uuid";
import { useClipboard } from "@/hooks/use-clipboard";
import { downloadFile } from "@/lib/utils/file";
import { Copy, Download, RefreshCw, Fingerprint } from "lucide-react";

export function UuidGenerator() {
  const t = useTranslations("components");
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const { copied, copy } = useClipboard();

  const handleGenerate = () => {
    setUuids(generateUuids(count));
  };

  const handleCopyAll = () => {
    copy(uuids.join("\n"));
  };

  const handleDownloadAll = () => {
    downloadFile(uuids.join("\n"), "uuids.txt", "text/plain");
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border flex-wrap">
        <span className="text-sm font-medium text-zinc-700">{t("uuidGenerator.count")}</span>
        <input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
          className="w-20 h-8 rounded-md border px-2 text-sm"
        />
        <Button onClick={handleGenerate} size="sm">
          <RefreshCw className="h-4 w-4 mr-1" /> {t("uuidGenerator.generate")}
        </Button>
        {uuids.length > 0 && (
          <div className="ml-auto flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              <Copy className="h-4 w-4 mr-1" /> {copied ? t("uuidGenerator.copied") : t("uuidGenerator.copyAll")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadAll}>
              <Download className="h-4 w-4 mr-1" /> {t("uuidGenerator.download")}
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="border rounded-lg p-4 min-h-[200px]">
        {uuids.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <Fingerprint className="h-10 w-10 text-zinc-200 mb-3" />
            <p className="text-sm text-zinc-400">{t("uuidGenerator.emptyState")}</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <span className="text-xs text-zinc-400 font-mono w-6">{i + 1}.</span>
                <code className="flex-1 text-sm font-mono bg-zinc-50 px-2 py-1 rounded text-zinc-800 select-all">
                  {uuid}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copy(uuid)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
