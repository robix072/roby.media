import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ro", "en"],
  defaultLocale: "ro",
  // Româna stă la rădăcină (/servicii/...), engleza sub /en/...
  localePrefix: "as-needed",
  // Nu redirecționăm automat după limba browserului (important pentru SEO).
  localeDetection: false,
  localeCookie: false,
  // hreflang este generat de noi în metadata (slug-urile diferă între limbi).
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];
