"use client";

import { useState } from "react";
import { Menu, X, Wrench, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("common");
  const [favorites] = useLocalStorage<string[]>("toolcraft-favorites", []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-zinc-900">
          <Wrench className="h-6 w-6 text-blue-600" />
          <span>{t("header.logo")}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/tools/image-compressor" className="text-sm text-zinc-600 hover:text-zinc-900">
            {t("header.nav.image")}
          </Link>
          <Link href="/tools/pdf-to-jpg" className="text-sm text-zinc-600 hover:text-zinc-900">
            {t("header.nav.pdf")}
          </Link>
          <Link href="/tools/markdown-editor" className="text-sm text-zinc-600 hover:text-zinc-900">
            {t("header.nav.markdown")}
          </Link>
          <Link href="/tools/json-formatter" className="text-sm text-zinc-600 hover:text-zinc-900">
            {t("header.nav.dev")}
          </Link>
          {/* Reserve space for favorites link to prevent CLS on hydration */}
          <span className="text-sm text-red-500 flex items-center gap-1" style={{ visibility: favorites.length > 0 ? "visible" : "hidden" }}>
            <Heart className="h-4 w-4 fill-current" />
            {t("header.nav.favorites")}
          </span>
          <LanguageSwitcher />
        </nav>

        {/* Mobile toggle + language switcher */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-3">
          <Link href="/tools/image-compressor" className="text-sm text-zinc-600" onClick={() => setMobileOpen(false)}>
            {t("header.mobile.imageTools")}
          </Link>
          <Link href="/tools/pdf-to-jpg" className="text-sm text-zinc-600" onClick={() => setMobileOpen(false)}>
            {t("header.mobile.pdfTools")}
          </Link>
          <Link href="/tools/markdown-editor" className="text-sm text-zinc-600" onClick={() => setMobileOpen(false)}>
            {t("header.mobile.markdownTools")}
          </Link>
          <Link href="/tools/json-formatter" className="text-sm text-zinc-600" onClick={() => setMobileOpen(false)}>
            {t("header.mobile.devTools")}
          </Link>
        </nav>
      )}
    </header>
  );
}
