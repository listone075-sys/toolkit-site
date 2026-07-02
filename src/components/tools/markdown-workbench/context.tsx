"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { markdownToHtml } from "@/lib/tools/markdown/md-to-html";

interface WorkbenchContextValue {
  markdown: string;
  setMarkdown: (md: string) => void;
  clearMarkdown: () => void;
  htmlPreview: string;
}

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null);

export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const [markdown, setMarkdown] = useState("");
  const clearMarkdown = useCallback(() => setMarkdown(""), []);

  const debouncedMd = useDebounce(markdown, 150);
  const htmlPreview = useMemo(() => (debouncedMd ? markdownToHtml(debouncedMd) : ""), [debouncedMd]);

  return (
    <WorkbenchContext.Provider value={{ markdown, setMarkdown, clearMarkdown, htmlPreview }}>
      {children}
    </WorkbenchContext.Provider>
  );
}

export function useWorkbench() {
  const ctx = useContext(WorkbenchContext);
  if (!ctx) throw new Error("useWorkbench must be used within WorkbenchProvider");
  return ctx;
}
