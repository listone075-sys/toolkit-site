"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-zinc-900">
          <Wrench className="h-6 w-6 text-blue-600" />
          <span>ToolCraft</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/tools/image-compressor" className="text-sm text-zinc-600 hover:text-zinc-900">
            Image
          </Link>
          <Link href="/tools/pdf-to-jpg" className="text-sm text-zinc-600 hover:text-zinc-900">
            PDF
          </Link>
          <Link href="/tools/markdown-editor" className="text-sm text-zinc-600 hover:text-zinc-900">
            Markdown
          </Link>
          <Link href="/tools/json-formatter" className="text-sm text-zinc-600 hover:text-zinc-900">
            Dev Tools
          </Link>
        </nav>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-3">
          <Link href="/tools/image-compressor" className="text-sm text-zinc-600" onClick={() => setMobileOpen(false)}>Image Tools</Link>
          <Link href="/tools/pdf-to-jpg" className="text-sm text-zinc-600" onClick={() => setMobileOpen(false)}>PDF Tools</Link>
          <Link href="/tools/markdown-editor" className="text-sm text-zinc-600" onClick={() => setMobileOpen(false)}>Markdown Tools</Link>
          <Link href="/tools/json-formatter" className="text-sm text-zinc-600" onClick={() => setMobileOpen(false)}>Dev Tools</Link>
        </nav>
      )}
    </header>
  );
}
