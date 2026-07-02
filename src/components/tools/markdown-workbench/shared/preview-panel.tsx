"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

interface PreviewPanelProps {
  htmlContent: string;
  viewMode: "preview" | "html";
  onToggleViewMode: () => void;
  onFullscreen: () => void;
  minHeight?: string;
}

export function PreviewPanel({
  htmlContent,
  viewMode,
  onToggleViewMode,
  onFullscreen,
  minHeight = "400px",
}: PreviewPanelProps) {
  const t = useTranslations("components");

  return (
    <div className="border rounded-lg p-4 flex flex-col" style={{ minHeight }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {viewMode === "preview" ? t("markdownWorkbench.edit.preview") : t("markdownWorkbench.edit.htmlSource")}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onToggleViewMode}>
            {viewMode === "preview" ? t("markdownWorkbench.edit.htmlSource") : t("markdownWorkbench.edit.preview")}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onFullscreen} title={t("markdownWorkbench.edit.fullscreenPreview")}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {viewMode === "preview" ? (
        htmlContent ? (
          <div
            className="flex-1 prose prose-sm max-w-none overflow-auto text-sm"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-zinc-400">{t("markdownWorkbench.edit.emptyPreview")}</p>
          </div>
        )
      ) : (
        htmlContent ? (
          <pre className="flex-1 text-xs font-mono overflow-auto whitespace-pre-wrap bg-zinc-50 p-3 rounded">
            {htmlContent}
          </pre>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-zinc-400">{t("markdownWorkbench.edit.emptyPreview")}</p>
          </div>
        )
      )}
    </div>
  );
}
