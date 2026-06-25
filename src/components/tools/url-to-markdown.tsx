"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { urlToMarkdown } from "@/lib/tools/markdown/url-to-md";
import { useClipboard } from "@/hooks/use-clipboard";
import { Copy, Download, Globe, Loader2, Trash2 } from "lucide-react";

export function UrlToMarkdown() {
  const t = useTranslations("components");
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { copied, copy } = useClipboard();

  const handleFetch = useCallback(async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const result = await urlToMarkdown(url);
      setOutput(result.markdown);
      setPageTitle(result.title);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes("fetch") || msg.includes("NetworkError")) {
        setError(t("urlToMarkdown.corsError"));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [url, t]);

  const handleDownload = () => {
    if (!output) return;
    const name = (pageTitle || "page").replace(/[^a-zA-Z0-9-]/g, "_") + ".md";
    const blob = new Blob([output], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleClear = () => {
    setUrl("");
    setOutput("");
    setPageTitle("");
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* URL input */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("urlToMarkdown.urlPlaceholder")}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          />
        </div>
        <Button onClick={handleFetch} disabled={loading || !url.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-1" />
          )}
          {loading ? t("urlToMarkdown.fetching") : t("urlToMarkdown.fetch")}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* Output */}
      <div className="border rounded-lg p-4 min-h-[350px] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Markdown
            </span>
            {pageTitle && (
              <span className="text-xs text-zinc-500 ml-3">— {pageTitle}</span>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => copy(output)} disabled={!output}>
              <Copy className="h-3 w-3 mr-1" /> {copied ? t("urlToMarkdown.copied") : t("urlToMarkdown.copy")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
              <Download className="h-3 w-3 mr-1" /> {t("urlToMarkdown.downloadMd")}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!url && !output}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {output ? (
          <textarea
            className="flex-1 text-sm font-mono resize-none bg-zinc-50 p-3 rounded border focus:outline-none"
            value={output}
            readOnly
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-zinc-400">
              {loading ? t("urlToMarkdown.loading") : t("urlToMarkdown.enterUrl")}
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-center text-zinc-400">
        {t("urlToMarkdown.corsNote")}
      </p>
    </div>
  );
}
