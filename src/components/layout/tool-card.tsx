"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ToolConfig } from "@/lib/tools/types";
import { Image, FileCode, FileText, Braces, Calculator, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FavoritesButton } from "./favorites-button";

const categoryIcons: Record<string, React.ReactNode> = {
  image: <Image className="h-4 w-4" />,
  pdf: <FileText className="h-4 w-4" />,
  markdown: <FileCode className="h-4 w-4" />,
  dev: <Braces className="h-4 w-4" />,
  calculator: <Calculator className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  image: "bg-green-100 text-green-800",
  pdf: "bg-red-100 text-red-800",
  markdown: "bg-blue-100 text-blue-800",
  dev: "bg-purple-100 text-purple-800",
  calculator: "bg-orange-100 text-orange-800",
};

export function ToolCard({ tool }: { tool: ToolConfig }) {
  const t = useTranslations("common");

  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="group h-full p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 relative">
        <div className="absolute top-3 right-3 z-10">
          <FavoritesButton toolSlug={tool.slug} />
        </div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={categoryColors[tool.category] + " p-1.5 rounded-md"}>
              {categoryIcons[tool.category]}
            </span>
            {tool.isAi && (
              <Badge className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                <Sparkles className="h-3 w-3 mr-0.5" /> AI
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {tool.searchVolume}
            </Badge>
          </div>
        </div>
        <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors mb-1">
          {tool.title}
        </h3>
        <p className="text-sm text-zinc-500 line-clamp-2">{tool.description}</p>
        <div className="mt-3 flex items-center gap-1 text-xs text-green-600 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
          {t("toolCard.freeBadge")}
        </div>
      </Card>
    </Link>
  );
}
