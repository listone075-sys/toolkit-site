import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolcraftbox.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return {
    title: `${t("title")} | ToolCraft`,
    description:
      locale === "zh"
        ? "ToolCraft 隐私政策 — 我们如何处理您的数据并保护您的隐私。"
        : "ToolCraft Privacy Policy — how we handle your data and protect your privacy.",
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy`,
      languages: {
        en: `${SITE_URL}/en/privacy`,
        zh: `${SITE_URL}/zh/privacy`,
      },
    },
  };
}

function Section({ heading, body, list, footer }: {
  heading: string;
  body?: string;
  list?: string[];
  footer?: string;
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
      {footer && <p className="text-zinc-700 leading-relaxed mt-2" dangerouslySetInnerHTML={{ __html: footer }} />}
    </section>
  );
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.privacy" });

  const sections: Array<{ heading: string; body?: string; list?: string[]; footer?: string }> = [
    t.raw("sections.0"),
    t.raw("sections.1"),
    t.raw("sections.2"),
    t.raw("sections.3"),
    t.raw("sections.4"),
    t.raw("sections.5"),
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
