"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploadZone } from "@/components/tools/file-upload-zone";
import { urlToMarkdown } from "@/lib/tools/markdown/url-to-md";
import { htmlToMarkdown } from "@/lib/tools/markdown/html-to-md";
import { docxToMarkdown } from "@/lib/tools/markdown/docx-to-md";
import { downloadFile, formatFileSize } from "@/lib/utils/file";
import { useClipboard } from "@/hooks/use-clipboard";
import { useWorkbench } from "../context";
import { Copy, Download, Globe, Loader2, ArrowRight, X, FileText } from "lucide-react";

type ImportSource = "url" | "html" | "docx";

export function ImportTab() {
  const t = useTranslations("components");
  const { setMarkdown } = useWorkbench();
  const [source, setSource] = useState<ImportSource>("url");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL mode
  const [url, setUrl] = useState("");

  // HTML mode
  const [htmlInput, setHtmlInput] = useState("");

  // DOCX mode
  const [docxFile, setDocxFile] = useState<File | null>(null);

  // Shared output
  const [output, setOutput] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const { copied, copy } = useClipboard();

  const handleUrlFetch = useCallback(async () => {
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
        setError(t("markdownWorkbench.import.corsError"));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [url, t]);

  const handleHtmlConvert = useCallback(() => {
    if (!htmlInput.trim()) return;
    setError(null);
    const md = htmlToMarkdown(htmlInput);
    setOutput(md);
  }, [htmlInput]);

  const handleDocxUpload = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setDocxFile(f);
    setOutput("");
    setError(null);
    setLoading(true);
    try {
      const md = await docxToMarkdown(f);
      setOutput(md);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImportAndEdit = () => {
    if (output) {
      setMarkdown(output);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const name = (pageTitle || "imported").replace(/[^a-zA-Z0-9-]/g, "_") + ".md";
    downloadFile(output, name, "text/markdown");
  };

  const handleClear = () => {
    setUrl("");
    setHtmlInput("");
    setDocxFile(null);
    setOutput("");
    setPageTitle("");
    setError(null);
  };

  const sourceTabs: { value: ImportSource; label: string }[] = [
    { value: "url", label: t("markdownWorkbench.import.sourceUrl") },
    { value: "html", label: t("markdownWorkbench.import.sourceHtml") },
    { value: "docx", label: t("markdownWorkbench.import.sourceDocx") },
  ];

  return (
    <div className="space-y-4">
      {/* Source selector */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg w-fit">
        {sourceTabs.map((s) => (
          <button
            key={s.value}
            onClick={() => { setSource(s.value); setError(null); }}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              source === s.value
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Source-specific input */}
      {source === "url" && (
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t("markdownWorkbench.import.urlPlaceholder")}
              className="pl-9"
              onKeyDown={(e) => e.key === "Enter" && handleUrlFetch()}
            />
          </div>
          <Button onClick={handleUrlFetch} disabled={loading || !url.trim()}>
            {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
            {loading ? t("markdownWorkbench.import.fetching") : t("markdownWorkbench.import.fetch")}
          </Button>
        </div>
      )}

      {source === "html" && (
        <div className="space-y-3">
          <textarea
            value={htmlInput}
            onChange={(e) => { setHtmlInput(e.target.value); if (output) setOutput(""); }}
            placeholder={t("markdownWorkbench.import.htmlPlaceholder")}
            className="w-full h-[200px] text-sm font-mono resize-none bg-zinc-50 p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <Button onClick={handleHtmlConvert} disabled={!htmlInput.trim()}>
            <ArrowRight className="h-4 w-4 mr-1" /> {t("markdownWorkbench.import.convert")}
          </Button>
        </div>
      )}

      {source === "docx" && (
        !docxFile ? (
          <FileUploadZone
            title={t("markdownWorkbench.import.uploadDocx")}
            description={t("markdownWorkbench.import.orDragDrop")}
            browseLabel={t("markdownWorkbench.import.browse")}
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onFiles={handleDocxUpload}
          />
        ) : (
          <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium truncate">{docxFile.name}</span>
                  <span className="text-xs text-zinc-400 ml-2">{formatFileSize(docxFile.size)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setDocxFile(null); setOutput(""); setError(null); }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {loading && (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                </div>
              )}
            </div>
          </div>
        )
      )}

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="border rounded-lg p-4 flex flex-col min-h-[250px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Markdown
              </span>
              {pageTitle && (
                <span className="text-xs text-zinc-500">— {pageTitle}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => copy(output)}>
                <Copy className="h-3 w-3 mr-1" /> {copied ? t("markdownWorkbench.edit.copied") : t("markdownWorkbench.import.copy")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-3 w-3 mr-1" /> {t("markdownWorkbench.import.downloadMd")}
              </Button>
            </div>
          </div>
          <textarea
            className="flex-1 text-sm font-mono resize-none bg-zinc-50 p-3 rounded border focus:outline-none"
            value={output}
            readOnly
          />
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex items-center gap-3 justify-center">
        {output && (
          <Button onClick={handleImportAndEdit} size="lg">
            <ArrowRight className="h-4 w-4 mr-1" /> {t("markdownWorkbench.import.importAndEdit")}
          </Button>
        )}
        {(url || htmlInput || docxFile || output) && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="h-4 w-4 mr-1" /> {t("markdownWorkbench.edit.clear")}
          </Button>
        )}
      </div>
    </div>
  );
}
