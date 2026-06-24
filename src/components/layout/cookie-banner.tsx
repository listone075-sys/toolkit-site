"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("common");

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-4 animate-in slide-in-from-bottom">
      <div className="container mx-auto max-w-4xl flex items-start gap-4 flex-col sm:flex-row sm:items-center">
        <p className="text-sm text-zinc-600 flex-1">
          {t("cookieBanner.text")}{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            {t("cookieBanner.learnMore")}
          </Link>
          . {t("cookieBanner.continuation")}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={accept} size="sm">
            {t("cookieBanner.accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
