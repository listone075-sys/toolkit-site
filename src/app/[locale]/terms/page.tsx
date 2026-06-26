import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getBaseUrlFromHeaders } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.terms" });
  const base = await getBaseUrlFromHeaders();
  return {
    title: `${t("title")} | ToolCraft`,
    description:
      locale === "zh"
        ? "ToolCraft 服务条款 — 使用条款和条件。"
        : "ToolCraft Terms of Service — usage terms and conditions.",
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${base}/${locale}/terms`,
      languages: {
        en: `${base}/en/terms`,
        zh: `${base}/zh/terms`,
      },
    },
  };
}

function Section({ heading, body, list }: {
  heading: string;
  body?: string;
  list?: string[];
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-zinc-900 mb-3">{heading}</h2>
      {body && <p className="text-zinc-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: body }} />}
      {list && (
        <ul className="list-disc list-inside text-zinc-700 space-y-1 mt-2">
          {list.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.terms" });

  const sections: Array<{ heading: string; body?: string; list?: string[] }> = [
    t.raw("sections.0"),
    t.raw("sections.1"),
    t.raw("sections.2"),
    t.raw("sections.3"),
    t.raw("sections.4"),
    t.raw("sections.5"),
    t.raw("sections.6"),
    t.raw("sections.7"),
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">{t("title")}</h1>
      <p className="text-sm text-zinc-500 mb-8">{t("lastUpdated")}</p>
      <div className="prose prose-zinc max-w-none space-y-6">
        {sections.map((section, i) => (
          <Section key={i} {...section} />
        ))}
      </div>
    </div>
  );
}
