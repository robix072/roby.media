/**
 * Metadata (title, description, canonical, hreflang, Open Graph) și date structurate JSON-LD.
 */
import type { Metadata } from "next";
import type { Locale } from "@/lib/content/schemas";
import site from "@/content/site.json";
import { isHolder } from "@/lib/links";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");
export const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p === "/" ? "" : p}` || SITE_URL);

type Paths = Partial<Record<Locale, string>>;

/** Adaugă „| Roby Media” doar dacă titlul rămâne sub ~60 de caractere. */
export function fullTitle(title: string) {
  const branded = `${title} | ${site.name}`;
  return branded.length <= 62 ? branded : title;
}

export function ogImageUrl(title: string, kicker?: string) {
  const q = new URLSearchParams({ title });
  if (kicker) q.set("kicker", kicker);
  return `/api/og?${q.toString()}`;
}

export function buildMetadata(opts: {
  locale: Locale;
  title: string;
  description: string;
  paths: Paths;
  kicker?: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const { locale, title, description, paths } = opts;
  const canonical = paths[locale] ?? "/";
  const languages: Record<string, string> = {};
  if (paths.ro) languages["ro-RO"] = abs(paths.ro);
  if (paths.en) languages["en"] = abs(paths.en);
  if (paths.ro) languages["x-default"] = abs(paths.ro);
  const t = fullTitle(title);
  const image = opts.image ?? ogImageUrl(title, opts.kicker);
  return {
    title: { absolute: t },
    description,
    alternates: { canonical: abs(canonical), languages: Object.keys(languages).length > 1 ? languages : undefined },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: opts.type ?? "website",
      title: t,
      description,
      url: abs(canonical),
      siteName: site.name,
      locale: locale === "ro" ? "ro_RO" : "en_GB",
      alternateLocale: locale === "ro" && paths.en ? ["en_GB"] : locale === "en" && paths.ro ? ["ro_RO"] : undefined,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: t, description, images: [image] },
  };
}

/* ---------------------------------------------------------------- JSON-LD */

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationLd(locale: Locale) {
  const s = site.social;
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": ORG_ID,
    name: site.name,
    // Valorile neconfirmate („[...]”) nu ajung în datele structurate.
    ...(isHolder(site.legalName) ? {} : { legalName: site.legalName }),
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/api/og?title=${encodeURIComponent(site.name)}`,
    telephone: site.phone.e164,
    ...(isHolder(site.email) ? {} : { email: site.email }),
    priceRange: "$$",
    areaServed: { "@type": "Country", name: locale === "ro" ? "România" : "Romania" },
    address: {
      "@type": "PostalAddress",
      addressCountry: "RO",
      ...(isHolder(site.address.city) ? {} : {
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.county,
        postalCode: site.address.postalCode,
      }),
    },
    sameAs: [s.tiktok, s.instagram, s.facebook, s.youtube, s.linkedin, s.behance].filter((u) => !isHolder(u)),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone.e164,
      contactType: "sales",
      areaServed: "RO",
      availableLanguage: ["Romanian", "English"],
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceLd(opts: {
  name: string;
  description: string;
  path: string;
  priceFrom: number | null;
  areaName?: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.serviceType ?? opts.name,
    description: opts.description,
    url: abs(opts.path),
    provider: { "@id": ORG_ID },
    areaServed: opts.areaName ? { "@type": "City", name: opts.areaName } : { "@type": "Country", name: "Romania" },
    ...(opts.priceFrom
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "RON",
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: opts.priceFrom,
              priceCurrency: "RON",
              valueAddedTaxIncluded: false,
            },
          },
        }
      : {}),
  };
}

export function articleLd(opts: { title: string; description: string; path: string; date: string; updated?: string; author: string; locale: Locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    url: abs(opts.path),
    mainEntityOfPage: abs(opts.path),
    datePublished: opts.date,
    dateModified: opts.updated ?? opts.date,
    inLanguage: opts.locale === "ro" ? "ro-RO" : "en",
    author: { "@type": "Organization", name: opts.author, url: SITE_URL },
    publisher: { "@id": ORG_ID },
    image: abs(ogImageUrl(opts.title)),
  };
}

export function videoLd(opts: { name: string; description: string; provider: "youtube" | "vimeo"; id: string; uploadDate?: string; duration?: string }) {
  if (!opts.id) return null;
  const embed = opts.provider === "youtube" ? `https://www.youtube.com/embed/${opts.id}` : `https://player.vimeo.com/video/${opts.id}`;
  const thumb = opts.provider === "youtube" ? `https://i.ytimg.com/vi/${opts.id}/hqdefault.jpg` : `https://vumbnail.com/${opts.id}.jpg`;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: opts.name,
    description: opts.description,
    thumbnailUrl: thumb,
    embedUrl: embed,
    uploadDate: opts.uploadDate ?? "2026-01-01",
    ...(opts.duration ? { duration: opts.duration } : {}),
  };
}
