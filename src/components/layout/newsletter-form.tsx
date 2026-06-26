"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { readHistory } from "@/lib/history/storage";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

const DISMISS_KEY = "toolcraft-nl-dismissed";
const DISMISS_DAYS = 30;

interface NewsletterFormProps {
  className?: string;
}

/**
 * Mailchimp embedded newsletter form.
 * Shows after user has visited 3+ tools or used 2+ tools, not if dismissed within 30 days.
 * Returns null if conditions aren't met or form was dismissed.
 */
export function NewsletterForm({ className }: NewsletterFormProps) {
  const t = useTranslations("common");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [dismissed, setDismissed, hydrated] = useLocalStorage<string | null>(DISMISS_KEY, null);

  // Don't render until hydrated to prevent flash
  if (!hydrated) return null;

  // Check if dismissed recently
  if (dismissed) {
    const dismissedAt = new Date(dismissed).getTime();
    const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    if (daysSince < DISMISS_DAYS) return null;
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      setStatus("loading");

      const mailchimpUrl = process.env.NEXT_PUBLIC_MAILCHIMP_URL;
      if (!mailchimpUrl) {
        // No Mailchimp URL configured — silently succeed for dev mode
        setStatus("success");
        return;
      }

      try {
        // Use a form POST to open Mailchimp's hosted signup page in a new tab.
        // This avoids CORS/CSRF issues that break no-cors AJAX requests.
        const form = document.createElement("form");
        form.method = "POST";
        form.action = mailchimpUrl;
        form.target = "_blank";
        form.style.display = "none";
        const emailField = document.createElement("input");
        emailField.name = "EMAIL";
        emailField.value = email;
        form.appendChild(emailField);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    },
    [email],
  );

  const handleDismiss = () => {
    setDismissed(new Date().toISOString());
  };

  return (
    <div className={className}>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-zinc-900">{t("newsletter.title")}</h3>
        </div>
        <p className="text-sm text-zinc-600 mb-4">{t("newsletter.description")}</p>

        {status === "success" ? (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            {t("newsletter.success")}
          </div>
        ) : status === "error" ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              {t("newsletter.error")}
            </div>
            <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
              {t("newsletter.tryAgain")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              required
              className="flex-1"
              disabled={status === "loading"}
            />
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "..." : t("newsletter.subscribe")}
            </Button>
          </form>
        )}

        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-zinc-400">{t("newsletter.privacy")}</p>
          {status !== "success" && (
            <button
              type="button"
              onClick={handleDismiss}
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              {t("dismiss")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper that checks if the newsletter should be shown.
 * Requires 3+ tool visits OR 2+ tool uses.
 */
export function NewsletterSection() {
  const [recent] = useLocalStorage<{ records: { slug: string }[] }>(
    "toolcraft-recent-v2",
    typeof window !== "undefined" ? readHistory() : { records: [] },
  );
  const [dismissed] = useLocalStorage<string | null>(DISMISS_KEY, null);

  // Don't show if dismissed within 30 days
  if (dismissed) {
    const dismissedAt = new Date(dismissed).getTime();
    const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    if (daysSince < DISMISS_DAYS) return null;
  }

  // Show after 3+ tool visits
  if (recent.records.length < 3) return null;

  return <NewsletterForm className="container mx-auto px-4 mb-12" />;
}
