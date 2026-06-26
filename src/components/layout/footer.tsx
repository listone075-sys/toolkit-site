"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("common");

  return (
    <footer className="border-t bg-zinc-50 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">{t("footer.imageTools")}</h3>
            <ul className="space-y-2">
              <li><Link href="/tools/heic-to-jpg" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.heicToJpg")}</Link></li>
              <li><Link href="/tools/webp-to-jpg" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.webpToJpg")}</Link></li>
              <li><Link href="/tools/image-compressor" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.imageCompressor")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">{t("footer.markdownTools")}</h3>
            <ul className="space-y-2">
              <li><Link href="/tools/markdown-editor" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.markdownEditor")}</Link></li>
              <li><Link href="/tools/markdown-to-html" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.mdToHtml")}</Link></li>
              <li><Link href="/tools/markdown-table-generator" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.tableGenerator")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">{t("footer.pdfTools")}</h3>
            <ul className="space-y-2">
              <li><Link href="/tools/jpg-to-pdf" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.jpgToPdf")}</Link></li>
              <li><Link href="/tools/pdf-to-jpg" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.pdfToJpg")}</Link></li>
              <li><Link href="/tools/merge-pdf" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.mergePdf")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">{t("footer.devTools")}</h3>
            <ul className="space-y-2">
              <li><Link href="/tools/json-formatter" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.jsonFormatter")}</Link></li>
              <li><Link href="/tools/base64-encode-decode" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.base64")}</Link></li>
              <li><Link href="/tools/uuid-generator" className="text-sm text-zinc-600 hover:text-zinc-900">{t("footer.uuidGenerator")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-center text-sm text-zinc-500">
          <p>{t("footer.privacyBrowserTagline")}</p>
          <p className="mt-1">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/blog" className="text-xs text-zinc-400 hover:text-zinc-600">{t("footer.blog")}</Link>
            <Link href="/privacy" className="text-xs text-zinc-400 hover:text-zinc-600">{t("footer.privacyPolicy")}</Link>
            <Link href="/terms" className="text-xs text-zinc-400 hover:text-zinc-600">{t("footer.termsOfService")}</Link>
            <a href="mailto:hello@toolcraftbox.com" className="text-xs text-zinc-400 hover:text-zinc-600">{t("footer.contact")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
