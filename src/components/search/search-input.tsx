"use client";

import { useRef } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

interface SearchInputProps {
  /** If true, render as larger homepage hero variant */
  variant?: "header" | "hero";
  className?: string;
}

/**
 * A search input that triggers the global search dialog.
 * Renders an input that dispatches a custom event to open the command palette.
 * The SearchDialog component in the Header listens for this event.
 */
export function SearchInput({ variant = "header", className }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("common");
  const isHero = variant === "hero";

  const handleFocus = () => {
    // Dispatch custom event to open the search dialog
    window.dispatchEvent(new CustomEvent("toolcraft:open-search"));
    // Blur so the dialog input gets focus instead
    inputRef.current?.blur();
  };

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("toolcraft:open-search"));
    inputRef.current?.blur();
  };

  return (
    <div
      className={cn(
        "relative",
        isHero ? "w-full max-w-xl mx-auto" : "w-full",
        className,
      )}
    >
      <Search
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none",
          isHero ? "h-5 w-5" : "h-4 w-4",
        )}
      />
      <input
        ref={inputRef}
        type="text"
        readOnly
        onFocus={handleFocus}
        onClick={handleClick}
        placeholder={t("search.placeholder")}
        className={cn(
          "w-full rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-text",
          isHero
            ? "h-12 pl-10 pr-4 text-base shadow-sm"
            : "h-9 pl-9 pr-3 text-sm",
        )}
      />
    </div>
  );
}
