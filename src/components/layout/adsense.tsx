"use client";

import Script from "next/script";

const FALLBACK_ADSENSE_ID = "ca-pub-5142105226310650";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID ?? FALLBACK_ADSENSE_ID;

export function AdSense() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
