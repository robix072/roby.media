/**
 * Toate URL-urile site-ului, pe limbi. Româna stă la rădăcină, engleza sub /en.
 */
import type { Locale } from "@/lib/content/schemas";

export const STATIC_PATHS = {
  home: { ro: "/", en: "/en" },
  services: { ro: "/servicii", en: "/en/services" },
  packages: { ro: "/pachete", en: "/en/packages" },
  portfolio: { ro: "/portofoliu", en: "/en/portfolio" },
  about: { ro: "/despre", en: "/en/about" },
  blog: { ro: "/blog", en: "/en/blog" },
  contact: { ro: "/contact", en: "/en/contact" },
  areas: { ro: "/zone-deservite", en: "/en/areas-we-serve" },
  privacy: { ro: "/politica-confidentialitate", en: "/en/privacy-policy" },
  cookies: { ro: "/politica-cookies", en: "/en/cookie-policy" },
  terms: { ro: "/termeni-si-conditii", en: "/en/terms" },
} as const satisfies Record<string, Record<Locale, string>>;

export type StaticPage = keyof typeof STATIC_PATHS;

export const path = (page: StaticPage, locale: Locale) => STATIC_PATHS[page][locale];

export const servicePath = (locale: Locale, slug: { ro: string; en: string }) =>
  locale === "ro" ? `/servicii/${slug.ro}` : `/en/services/${slug.en}`;

export const portfolioPath = (locale: Locale, slug: { ro: string; en: string }) =>
  locale === "ro" ? `/portofoliu/${slug.ro}` : `/en/portfolio/${slug.en}`;

export const blogPath = (locale: Locale, slug: string) => (locale === "ro" ? `/blog/${slug}` : `/en/blog/${slug}`);

export const cityPath = (slug: string) => `/${slug}`;

export const contactWithService = (locale: Locale, serviceId?: string) =>
  `${path("contact", locale)}${serviceId ? `?serviciu=${encodeURIComponent(serviceId)}` : ""}#formular`;
