"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { pdfToMarkdown, type PdfToMarkdownResult } from "@/lib/tools/pdf/pdf-to-markdown";
import { downloadFile } from "@/lib/utils/file";
import { useClipboard } from "@/hooks/use-clipboard";
import { FileUploadZone } from "./file-upload-zone";
import { FileText, Copy, Download, Loader2, Eye, EyeOff, Trash2 } from "lucide-react";

export function PdfToMarkdown() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PdfToMarkdownResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { copied: copyMdCopied, copy: copyMd } = useClipboard();
  const { copied: copyPageCopied, copy: copyPage } = useClipboard();
  const convertingRef = useRef(false);

  const handleFile = useCallback((files: File[]) => {
    const pdfFile = files[0];
    if (!pdfFile) return;
    if (pdfFile.type !== "application/pdf" && !pdfFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a valid PDF file.");
      return;
    }
    setFile(pdfFile);
    setResult(null);
    setError(null);
    setShowPreview(false);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file || convertingRef.current) return;
    convertingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const res = await pdfToMarkdown(file);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert PDF. Please try again.");
    } finally {
      setLoading(false);
      convertingRef.current = false;
    }
  }, [file]);

  const handleDownload = () => {
    if (!result || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, "");
    const blob = new Blob([result.markdown], { type: "text/markdown" });
    downloadFile(blob, `${baseName}.md`, "text/markdown");
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setShowPreview(false);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!file && (
        <FileUploadZone
          title="Upload PDF File"
          description="or drag & drop your PDF here"
          browseLabel="Browse Files"
          onFiles={handleFile}
          accept=".pdf,application/pdf"
          className="min-h-[200px]"
        />
      )}

      {/* File Info + Actions */}
      {file && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{file.name}</span>
            <span className="text-xs text-blue-500">
              ({(file.size / 1024).toFixed(0)} KB)
            </span>
          </div>

          {!result && !loading && (
            <Button onClick={handleConvert} size="sm">
              Convert to Markdown
            </Button>
          )}

          {loading && (
            <Button disabled size="sm">
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Extracting text...
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-3">
          {/* Stats + Actions Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
              {result.pageCount} page{result.pageCount !== 1 ? "s" : ""}
              {" · "}
              {result.markdown.length.toLocaleString()} chars
            </span>

            <div className="flex gap-1 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <><EyeOff className="h-3.5 w-3.5 mr-1" /> Hide Preview</>
                ) : (
                  <><Eye className="h-3.5 w-3.5 mr-1" /> Preview</>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyMd(result.markdown)}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                {copyMdCopied ? "Copied!" : "Copy All"}
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5 mr-1" /> Download .md
              </Button>
            </div>
          </div>

          {/* Preview / Raw Markdown */}
          {showPreview ? (
            <div className="border rounded-lg p-6 bg-white max-h-[600px] overflow-y-auto prose prose-sm prose-zinc max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(result.markdown) }}
              />
            </div>
          ) : (
            <textarea
              className="w-full h-[400px] text-sm font-mono resize-y bg-zinc-50 p-4 rounded border focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={result.markdown}
              readOnly
            />
          )}

          {/* Per-Page Downloads */}
          {result.pages.length > 1 && (
            <details className="border rounded-lg p-3">
              <summary className="text-sm font-medium text-zinc-700 cursor-pointer">
                Download individual pages ({result.pages.length} pages)
              </summary>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {result.pages.map((pageMd, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs w-full justify-between"
                      onClick={() => {
                        const baseName = file!.name.replace(/\.pdf$/i, "");
                        const blob = new Blob([pageMd], { type: "text/markdown" });
                        downloadFile(blob, `${baseName}-page-${i + 1}.md`, "text/markdown");
                      }}
                    >
                      <span>Page {i + 1}</span>
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs px-1"
                      onClick={() => copyPage(pageMd)}
                      title="Copy page"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Quick Markdown-to-HTML preview using basic regex replacements.
 * This is intentionally simpler than the full `marked` renderer
 * to keep the component lightweight for preview purposes.
 */
function renderMarkdownPreview(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (fenced)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g,
    '<pre class="bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-xs"><code>$2</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g,
    '<code class="bg-zinc-100 text-rose-600 px-1 py-0.5 rounded text-xs">$1</code>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Headings
  html = html.replace(/^#### (.+)$/gm, "<h4 class='text-base font-semibold mt-4 mb-1'>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3 class='text-lg font-semibold mt-5 mb-2'>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2 class='text-xl font-bold mt-6 mb-2 border-b pb-1'>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-6 mb-3'>$1</h1>");

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr class='my-4 border-zinc-200' />");

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, "<blockquote class='border-l-4 border-blue-400 pl-4 py-1 my-2 text-zinc-600'>$1</blockquote>");

  // Unordered lists
  html = html.replace(/^[-*+] (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>");
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, "<li class='ml-4 list-decimal'>$1</li>");

  // Paragraphs (double newlines)
  html = html.replace(/\n\n+/g, "</p><p class='my-2'>");
  html = "<p class='my-2'>" + html + "</p>";

  // Clean up empty paragraphs
  html = html.replace(/<p class='my-2'><\/p>/g, "");

  return html;
}
