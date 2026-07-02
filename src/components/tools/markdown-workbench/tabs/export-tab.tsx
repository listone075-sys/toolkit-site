"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useWorkbench } from "../context";
import { ExportButtons } from "../shared/export-buttons";

export function ExportTab() {
  const t = useTranslations("components");
  const { markdown, htmlPreview } = useWorkbench();

  const wordCount = useMemo(() => {
    const text = markdown.trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  }, [markdown]);

  const charCount = useMemo(() => markdown.length, [markdown]);
  const headingCount = (markdown.match(/^#{1,6}\s/gm) ?? []).length;
  const slideCount = (markdown.match(/^##\s/gm) ?? []).length;

  return (
    <div className="space-y-6">
      {/* Preview of current markdown */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t("markdownWorkbench.export.heading")}
          </span>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
            {headingCount > 0 && <span>{headingCount} headings</span>}
            {slideCount > 0 && <span>~{slideCount} slides</span>}
          </div>
        </div>
        {htmlPreview ? (
          <div
            className="prose prose-sm max-w-none max-h-[300px] overflow-auto text-sm"
            dangerouslySetInnerHTML={{ __html: htmlPreview }}
          />
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-zinc-400">{t("markdownWorkbench.export.emptyContent")}</p>
          </div>
        )}
      </div>

      {/* Export cards */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-700 mb-4">{t("markdownWorkbench.export.chooseFormat")}</h3>
        <ExportButtons markdown={markdown} variant="cards" />
      </div>
    </div>
  );
}
