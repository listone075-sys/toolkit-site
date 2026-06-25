"use client";

import { Heart } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils/cn";

const STORAGE_KEY = "toolcraft-favorites";

interface FavoritesButtonProps {
  toolSlug: string;
  className?: string;
  iconOnly?: boolean;
}

/**
 * Heart toggle button for adding/removing tools from favorites.
 * Display on ToolCards and tool pages.
 */
import { useTranslations } from "next-intl";

export function FavoritesButton({ toolSlug, className, iconOnly = true }: FavoritesButtonProps) {
  const t = useTranslations("common");
  const [favorites, setFavorites, hydrated] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const isFavorited = favorites.includes(toolSlug);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent card link navigation
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(toolSlug)
        ? prev.filter((s) => s !== toolSlug)
        : [...prev, toolSlug],
    );
  };

  if (!hydrated) return null; // Avoid flash on SSR

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFavorited ? t("favorites.removeTooltip") : t("favorites.addTooltip")}
      aria-pressed={isFavorited}
      className={cn(
        "rounded-full transition-colors",
        iconOnly ? "p-1" : "inline-flex items-center gap-1.5 px-2 py-1 text-sm",
        isFavorited
          ? "text-red-500 hover:text-red-600"
          : iconOnly
            ? "text-zinc-300 hover:text-red-400"
            : "text-zinc-500 hover:text-red-500",
        className,
      )}
    >
      <Heart
        className={cn("h-5 w-5", isFavorited && "fill-current")}
      />
      {!iconOnly && (
        <span>{isFavorited ? t("favorites.removeTooltip") : t("favorites.addTooltip")}</span>
      )}
    </button>
  );
}

/** Get favorites from localStorage (for use in server components via hydration) */
export { STORAGE_KEY as FAVORITES_KEY };
