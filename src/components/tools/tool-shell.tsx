"use client";

import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";

interface ToolShellProps {
  inputPanel: ReactNode;
  outputPanel: ReactNode;
  optionsBar?: ReactNode;
  direction?: "horizontal" | "vertical";
}

export function ToolShell({ inputPanel, outputPanel, optionsBar, direction = "horizontal" }: ToolShellProps) {
  const t = useTranslations("components");
  const isHorizontal = direction === "horizontal";

  return (
    <div className="space-y-4">
      {/* Options bar */}
      {optionsBar && (
        <div className="flex items-center gap-4 flex-wrap p-3 bg-zinc-50 rounded-lg border">
          {optionsBar}
        </div>
      )}

      {/* Input / Output panels */}
      <div
        className={cn(
          "grid gap-4",
          isHorizontal ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1",
        )}
      >
        {/* Input */}
        <Card className="p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("toolShell.input")}
          </div>
          <div className="flex-1 flex flex-col">{inputPanel}</div>
        </Card>

        {/* Output */}
        <Card className="p-4 min-h-[300px] flex flex-col">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {t("toolShell.output")}
          </div>
          <div className="flex-1 flex flex-col">{outputPanel}</div>
        </Card>
      </div>
    </div>
  );
}
