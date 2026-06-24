"use client";

import { useTranslations } from "next-intl";
import { getToolComponent } from "./tool-loader";

interface ToolRendererProps {
  slug: string;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  const t = useTranslations("components");
  const ToolComponent = getToolComponent(slug);

  if (!ToolComponent) {
    return (
      <div className="border-2 border-dashed border-zinc-200 rounded-xl p-16 text-center bg-zinc-50">
        <p className="text-zinc-400">
          {t("toolRenderer.comingSoon")}
        </p>
      </div>
    );
  }

  return <ToolComponent />;
}
