"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { useWorkbench } from "../context";
import { EditorPanel } from "../shared/editor-panel";
import { PreviewPanel } from "../shared/preview-panel";
import { ExportButtons } from "../shared/export-buttons";
import { FullscreenOverlay } from "../shared/fullscreen-overlay";
import { TableDialog } from "../shared/table-dialog";
import { Copy, Download, Table } from "lucide-react";
import { downloadFile } from "@/lib/utils/file";

export function EditTab() {
  const t = useTranslations("components");
  const { markdown, setMarkdown, htmlPreview } = useWorkbench();
  const [viewMode, setViewMode] = useState<"preview" | "html">("preview");
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const { copied: mdCopied, copy: copyMd } = useClipboard();
  const { copied: htmlCopied, copy: copyHtml } = useClipboard();

  const wordCount = useMemo(() => {
    const text = markdown.trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  }, [markdown]);

  const charCount = useMemo(() => markdown.length, [markdown]);

  const handleCopyMarkdown = () => {
    copyMd(markdown || t("markdownWorkbench.edit.placeholder"));
  };

  const handleCopyHtml = () => {
    copyHtml(htmlPreview);
  };

  const handleDownloadMd = () => {
    downloadFile(markdown || "", "document.md", "text/markdown");
  };

  const handleInsertTable = (tableMd: string) => {
    setMarkdown(markdown + tableMd);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap p-3 bg-zinc-50 rounded-lg border">
        <div className="flex items-center gap-1 mr-4">
          <Button
            variant={viewMode === "preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("preview")}
          >
            {t("markdownWorkbench.edit.preview")}
          </Button>
          <Button
            variant={viewMode === "html" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("html")}
          >
            {t("markdownWorkbench.edit.htmlSource")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFullscreenOpen(true)}
          >
            {t("markdownWorkbench.edit.fullscreenPreview")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTableDialogOpen(true)}
          >
            <Table className="h-4 w-4 mr-1" /> {t("markdownWorkbench.edit.insertTable")}
          </Button>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
            <Copy className="h-4 w-4 mr-1" /> {mdCopied ? t("markdownWorkbench.edit.copied") : t("markdownWorkbench.edit.copyMarkdown")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyHtml}>
            <Copy className="h-4 w-4 mr-1" /> {htmlCopied ? t("markdownWorkbench.edit.copied") : t("markdownWorkbench.edit.copyHtml")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadMd} disabled={!markdown}>
            <Download className="h-4 w-4 mr-1" /> {t("markdownWorkbench.edit.downloadMd")}
          </Button>
          <ExportButtons markdown={markdown} />
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditorPanel
          value={markdown}
          onChange={setMarkdown}
          wordCount={wordCount}
          charCount={charCount}
        />
        <PreviewPanel
          htmlContent={htmlPreview}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode(viewMode === "preview" ? "html" : "preview")}
          onFullscreen={() => setFullscreenOpen(true)}
        />
      </div>

      {/* Fullscreen overlay */}
      <FullscreenOverlay
        htmlContent={htmlPreview}
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
      />

      {/* Table dialog */}
      <TableDialog
        open={tableDialogOpen}
        onClose={() => setTableDialogOpen(false)}
        onInsert={handleInsertTable}
      />
    </div>
  );
}
