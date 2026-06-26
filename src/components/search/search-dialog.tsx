"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { searchTools } from "@/lib/search";
import type { ToolConfig } from "@/lib/tools/types";
import { categoryIcons, categoryColors } from "@/components/layout/tool-card";
import { Button } from "@/components/ui/button";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ToolConfig[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  // Keyboard shortcut: Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  // Listen for custom event from other components (e.g., homepage search input)
  useEffect(() => {
    const handler = () => onOpenChange(true);
    window.addEventListener("toolcraft:open-search", handler);
    return () => window.removeEventListener("toolcraft:open-search", handler);
  }, [onOpenChange]);

  // Focus input and reset when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Search on query change
  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(searchTools(query, locale, 8));
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query, locale]);

  // Scroll selected item into view
  useEffect(() => {
    const item = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        const tool = results[selectedIndex];
        onOpenChange(false);
        router.push(`/tools/${tool.slug}`);
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    },
    [results, selectedIndex, onOpenChange],
  );

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={(e) => {
        if (e.target === overlayRef.current) onOpenChange(false);
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 border-b border-zinc-200">
          <Search className="h-5 w-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("search.placeholder")}
            className="flex-1 h-14 bg-transparent text-zinc-900 placeholder:text-zinc-400 outline-none text-base"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-xs text-zinc-400 font-mono">
            Esc
          </kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul ref={listRef} className="max-h-80 overflow-y-auto p-2" role="listbox">
            {results.map((tool, i) => (
              <li key={tool.slug} role="option" aria-selected={i === selectedIndex}>
                <Link
                  href={`/tools/${tool.slug}`}
                  onClick={() => onOpenChange(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
                    i === selectedIndex
                      ? "bg-blue-50 text-blue-900"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`p-1.5 rounded-md shrink-0 ${
                      categoryColors[tool.category] ?? "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {categoryIcons[tool.category]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{tool.title}</div>
                    <div className="text-xs text-zinc-500 truncate">{tool.description}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 opacity-40" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div className="px-4 py-10 text-center text-sm text-zinc-400">
            {t("search.noResults")}
          </div>
        )}

        {query.trim().length < 2 && (
          <div className="px-4 py-8 text-center text-sm text-zinc-400">
            {t("search.startTyping")}
          </div>
        )}
      </div>
    </div>
  );
}

/** Button + dialog combo — render once in Header */
export function SearchButton() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("common");

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <Search className="h-4 w-4" />
        <span className="hidden lg:inline">{t("search.searchTools")}</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-xs text-zinc-400 font-mono">
          {typeof navigator !== "undefined" && navigator.platform?.includes("Mac")
            ? "⌘K"
            : "Ctrl+K"}
        </kbd>
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
