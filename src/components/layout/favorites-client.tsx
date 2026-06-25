"use client";

import { useTranslations } from "next-intl";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { FAVORITES_KEY } from "./favorites-button";
import { ToolCard } from "./tool-card";
import { getToolRegistry } from "@/lib/tools";
import { Heart } from "lucide-react";

interface FavoritesSectionProps {
  locale: string;
}

/**
 * Client component that reads favorites from localStorage and renders a ToolCard grid.
 * Only renders when the user has at least one favorite.
 */
export function FavoritesSection({ locale }: FavoritesSectionProps) {
  const t = useTranslations("common");
  const [favorites] = useLocalStorage<string[]>(FAVORITES_KEY, []);
  const registry = getToolRegistry(locale);

  const favoriteTools = favorites
    .map((slug) => registry.find((t) => t.slug === slug))
    .filter(Boolean);

  if (favoriteTools.length === 0) return null;

  return (
    <section className="container mx-auto px-4 pt-10">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="h-5 w-5 text-red-500 fill-current" />
        <h2 className="text-xl font-bold text-zinc-900">
          {t("favorites.title")}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteTools.map((tool) => (
          <ToolCard key={tool!.slug} tool={tool!} />
        ))}
      </div>
      <hr className="mt-8 border-zinc-200" />
    </section>
  );
}
