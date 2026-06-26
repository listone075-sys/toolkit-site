"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import type { ShareConfig } from "@/lib/share/types";
import { getShareUrl } from "@/lib/share/url-encoder";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { toast } from "sonner";

interface ShareButtonProps {
  config: ShareConfig;
  className?: string;
}

export function ShareButton({ config, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");

  const shareUrl = getShareUrl({
    tool: config.toolSlug,
    params: config.shareParams ?? {},
  });

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      toast.success(t("share.copied"));
      setTimeout(() => setCopied(false), 2000);
      setOpen(false);
    }
  };

  const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(config.shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const pinterestIntent = config.isImage
    ? `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(config.shareText)}`
    : null;

  return (
    <div className={cn("relative", className)} ref={popoverRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-1.5"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">{t("share.title")}</span>
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-white shadow-lg border border-zinc-200 py-1.5 z-50">
          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? t("share.copied") : t("share.copyLink")}
          </button>

          {/* Twitter/X */}
          <a
            href={twitterIntent}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {t("share.twitter")}
          </a>

          {/* Pinterest (image tools only) */}
          {pinterestIntent && (
            <a
              href={pinterestIntent}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#E60023">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
              {t("share.pinterest")}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
