"use client";

import { getToolComponent } from "./tool-loader";

interface ToolRendererProps {
  slug: string;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  const ToolComponent = getToolComponent(slug);

  if (!ToolComponent) {
    return (
      <div className="border-2 border-dashed border-zinc-200 rounded-xl p-16 text-center bg-zinc-50">
        <p className="text-zinc-400">
          Coming soon — <strong className="text-zinc-600">this tool</strong> is under development.
        </p>
      </div>
    );
  }

  return <ToolComponent />;
}
