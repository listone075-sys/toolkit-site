"use client";

import { useState } from "react";
import { Menu, X, Wrench, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { SearchDialog } from "@/components/search/search-dialog";
import { UserMenu } from "@/components/auth/user-menu";
import { SignInButton } from "@/components/auth/sign-in-button";
import type { Session } from "next-auth";

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useTranslations("common");
  const [favorites] = useLocalStorage<string[]>("toolcraft-favorites", []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-zinc-900 shrink-0">
            <Wrench className="h-6 w-6 text-blue-600" />
            <span>{t("header.logo")}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
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
            <Link href="/blog" className="text-sm text-zinc-600 hover:text-zinc-900">
              {t("header.nav.blog")}
            </Link>

            {/* Search trigger */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="hidden xl:inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
            >
              <Search className="h-4 w-4" />
              <span>{t("search.searchTools")}</span>
              <kbd className="inline-flex items-center gap-0.5 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-xs text-zinc-400 font-mono">
                Ctrl+K
              </kbd>
            </Button>

            {/* Search icon-only (visible between md and xl) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="hidden md:inline-flex xl:hidden text-zinc-500 hover:text-zinc-900"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Reserve space for favorites link to prevent CLS on hydration */}
            <span className="text-sm text-red-500 flex items-center gap-1" style={{ visibility: favorites.length > 0 ? "visible" : "hidden" }}>
              <Heart className="h-4 w-4 fill-current" />
              {t("header.nav.favorites")}
            </span>
            <LanguageSwitcher />

            {/* Auth */}
            {session ? <UserMenu session={session} /> : <SignInButton />}
          </nav>

          {/* Mobile toggle + search + language switcher */}
          <div className="flex items-center gap-1 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="text-zinc-500"
            >
              <Search className="h-4 w-4" />
            </Button>
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
            <Link href="/blog" className="text-sm text-zinc-600" onClick={() => setMobileOpen(false)}>
              {t("header.mobile.blog")}
            </Link>
          </nav>
        )}
      </header>

      {/* Global search dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
