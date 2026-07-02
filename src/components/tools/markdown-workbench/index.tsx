"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { useWorkbench, WorkbenchProvider } from "./context";
import { EditTab } from "./tabs/edit-tab";
import { ExportTab } from "./tabs/export-tab";
import { BeautifyTab } from "./tabs/beautify-tab";
import { ImportTab } from "./tabs/import-tab";
import { downloadFile } from "@/lib/utils/file";
import { Copy, Download, Trash2, Edit3, ArrowRightLeft, Sparkles, Upload } from "lucide-react";

type TabValue = "edit" | "export" | "beautify" | "import";

function parseTabFromHash(value: string): TabValue {
  const valid: TabValue[] = ["edit", "export", "beautify", "import"];
  return valid.includes(value as TabValue) ? (value as TabValue) : "edit";
}

function getTabFromQuery(): TabValue {
  if (typeof window === "undefined") return "edit";
  const params = new URLSearchParams(window.location.search);
  return parseTabFromHash(params.get("tab") ?? "");
}

function WorkbenchContent() {
  const t = useTranslations("components");
  const { markdown, clearMarkdown } = useWorkbench();
  const { copied, copy } = useClipboard();
  const [activeTab, setActiveTab] = useState<TabValue>("edit");

  useEffect(() => {
    setActiveTab(getTabFromQuery());
  }, []);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const tab = parseTabFromHash(value);
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  };

  const handleCopyMd = () => {
    copy(markdown || "");
  };

  const handleDownloadMd = () => {
    if (!markdown) return;
    downloadFile(markdown, "document.md", "text/markdown");
  };

  const tabs = [
    { value: "edit" as const, icon: Edit3, label: t("markdownWorkbench.tabs.edit") },
    { value: "export" as const, icon: ArrowRightLeft, label: t("markdownWorkbench.tabs.export") },
    { value: "beautify" as const, icon: Sparkles, label: t("markdownWorkbench.tabs.beautify") },
    { value: "import" as const, icon: Upload, label: t("markdownWorkbench.tabs.import") },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
                <tab.icon className="h-4 w-4 mr-1" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="edit" className="mt-4">
          <EditTab />
        </TabsContent>
        <TabsContent value="export" className="mt-4">
          <ExportTab />
        </TabsContent>
        <TabsContent value="beautify" className="mt-4">
          <BeautifyTab />
        </TabsContent>
        <TabsContent value="import" className="mt-4">
          <ImportTab />
        </TabsContent>
      </Tabs>

      {/* Global action bar */}
      <div className="flex items-center gap-2 justify-center pt-4 border-t">
        <Button variant="outline" size="sm" onClick={handleCopyMd} disabled={!markdown}>
          <Copy className="h-4 w-4 mr-1" /> {copied ? t("markdownWorkbench.edit.copied") : t("markdownWorkbench.actions.copyMd")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadMd} disabled={!markdown}>
          <Download className="h-4 w-4 mr-1" /> {t("markdownWorkbench.actions.downloadMd")}
        </Button>
        <Button variant="ghost" size="sm" onClick={clearMarkdown} disabled={!markdown}>
          <Trash2 className="h-4 w-4 mr-1" /> {t("markdownWorkbench.actions.clear")}
        </Button>
      </div>
    </div>
  );
}

export function MarkdownWorkbench() {
  return (
    <WorkbenchProvider>
      <WorkbenchContent />
    </WorkbenchProvider>
  );
}
