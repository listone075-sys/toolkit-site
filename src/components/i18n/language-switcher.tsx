"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  const switchTo = locale === "en" ? "zh" : "en";
  const label = locale === "en" ? "简体中文" : "English";

  return (
    <button
      onClick={() => router.replace(pathname, { locale: switchTo })}
      className="px-3 py-1 text-sm border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label={`Switch language to ${switchTo === "zh" ? "简体中文" : "English"}`}
      title={t("languageSwitcher.label")}
    >
      {label}
    </button>
  );
}
