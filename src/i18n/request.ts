import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "zh")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      common: (await import(`../../messages/${locale}/common.json`)).default,
      tools: (await import(`../../messages/${locale}/tools.json`)).default,
      components: (await import(`../../messages/${locale}/components.json`)).default,
      homepage: (await import(`../../messages/${locale}/homepage.json`)).default,
      seo: (await import(`../../messages/${locale}/seo.json`)).default,
      blog: (await import(`../../messages/${locale}/blog.json`)).default,
      legal: (await import(`../../messages/${locale}/legal.json`)).default,
      notFound: (await import(`../../messages/${locale}/not-found.json`)).default,
    },
  };
});
