/**
 * Schemele (zod) pentru tot conținutul din /content.
 * Ele validează fișierele JSON la build (vezi lib/content/index.ts) și cu `npm run validate:content`.
 * Dacă un fișier are o greșeală (câmp lipsă, tip greșit), build-ul se oprește cu un mesaj clar.
 */
import { z } from "zod";

export const LOCALES = ["ro", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Text în ambele limbi. */
export const L = z.object({ ro: z.string().min(1), en: z.string().min(1) });
export type LText = z.infer<typeof L>;

/** Liste de texte în ambele limbi. */
export const LList = z.object({ ro: z.array(z.string()), en: z.array(z.string()) });

/** Câmpuri ignorate de site: notițe pentru editor. */
const meta = {
  _comment: z.string().optional(),
  _TODO: z.union([z.string(), z.array(z.string())]).optional(),
};

/* ---------------------------------------------------------------- Servicii */

export const SERVICE_CATEGORIES = ["productie", "evenimente", "marketing", "web"] as const;
export const PACKAGE_GROUPS = ["social", "ads", "website", "productie", "nunti"] as const;
export const PORTFOLIO_CATEGORIES = [
  "video-comercial",
  "tiktok-social",
  "nunti-evenimente",
  "drona",
  "foto",
  "website",
  "campanii",
] as const;

export const ICONS = [
  "camera", "film", "clapper", "phone-video", "users", "box", "briefcase", "home", "utensils",
  "drone", "music", "mic", "scissors", "rings", "heart", "baby", "presentation", "guitar", "broadcast",
  "trending", "target", "megaphone", "search", "calendar", "star", "pen", "compass", "monitor",
  "cart", "layout", "seo", "palette",
] as const;

const FaqItem = z.object({ q: z.string().min(5), a: z.string().min(20) });

export const ServiceContent = z.object({
  /** Nume scurt pentru meniu și carduri. */
  name: z.string().min(2),
  /** <title>, max ~60 caractere (brandul se adaugă automat dacă încape). */
  metaTitle: z.string().min(10).max(70),
  /** Meta description, max ~155 caractere. */
  metaDescription: z.string().min(50).max(165),
  /** H1 care conține cuvântul cheie principal. */
  h1: z.string().min(5),
  /** Subtitlu cu beneficiul principal (1–2 fraze). */
  subtitle: z.string().min(20),
  /** O frază pentru cardurile de serviciu. */
  cardDescription: z.string().min(20).max(180),
  /** Rezumatul „Pe scurt” (3–4 bullet-uri). */
  summary: z.array(z.string()).min(3).max(5),
  problem: z.object({ title: z.string(), paragraphs: z.array(z.string()).min(1) }),
  solution: z.object({ title: z.string(), paragraphs: z.array(z.string()).min(1) }),
  includes: z.object({
    title: z.string(),
    items: z.array(z.object({ title: z.string(), text: z.string() })).min(4),
  }),
  audience: z.object({
    title: z.string(),
    intro: z.string(),
    items: z.array(z.object({ industry: z.string(), text: z.string() })).min(4),
  }),
  process: z.object({
    title: z.string(),
    steps: z.array(z.object({ title: z.string(), text: z.string() })).min(3).max(6),
  }),
  /** Text scurt lângă preț, ex. „Proiectele încep de la 1.800 lei + TVA.” Opțional. */
  pricingNote: z.string().optional(),
  faq: z.array(FaqItem).min(5).max(8),
  closing: z.object({ title: z.string(), text: z.string() }),
  /** Mesajul precompletat pentru WhatsApp. */
  whatsapp: z.string().min(10),
});
export type ServiceContent = z.infer<typeof ServiceContent>;

export const Service = z.object({
  ...meta,
  /** Identificator intern (= slug-ul RO). */
  id: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(SERVICE_CATEGORIES),
  /** Ordinea în listă (mai mic = mai sus). */
  order: z.number().int(),
  slug: z.object({
    ro: z.string().regex(/^[a-z0-9-]+$/),
    en: z.string().regex(/^[a-z0-9-]+$/),
  }),
  icon: z.enum(ICONS),
  /** Grupa de pachete afișată pe pagină (din packages.json), sau null. */
  packageGroup: z.enum(PACKAGE_GROUPS).nullable(),
  /** ID-urile pachetelor evidențiate pe pagină (opțional; implicit tot grupul). */
  packageIds: z.array(z.string()).optional(),
  /** Prețul „de la” afișat (ex. 3500). null = „la cerere”. */
  priceFrom: z.number().nullable(),
  /** Unitatea prețului. */
  priceUnit: z.enum(["proiect", "luna", "sesiune", "ora"]).default("proiect"),
  /** Categoriile de portofoliu relevante. */
  portfolioCategories: z.array(z.enum(PORTFOLIO_CATEGORIES)).min(1),
  /** ID-urile serviciilor conexe (3–4). */
  related: z.array(z.string()).min(2).max(5),
  /** Dacă serviciul are pagini pe oraș, ID-ul din local-services.json. */
  localService: z.string().nullable().default(null),
  ro: ServiceContent,
  en: ServiceContent,
});
export type Service = z.infer<typeof Service>;

/* ---------------------------------------------------------------- Pachete */

export const PackageItem = z.object({
  ...meta,
  id: z.string(),
  name: z.string(),
  /** Preț în lei, fără TVA. null = la cerere. */
  price: z.number().nullable(),
  /** true = afișează „de la”. */
  from: z.boolean().default(false),
  /** Perioada: proiect unic sau abonament lunar. */
  period: z.enum(["proiect", "luna"]).default("proiect"),
  /** Badge „Cel mai ales”. Unul singur pe categorie. */
  featured: z.boolean().default(false),
  description: L,
  features: LList,
});
export type PackageItem = z.infer<typeof PackageItem>;

export const PackageGroup = z.object({
  ...meta,
  id: z.enum(PACKAGE_GROUPS),
  title: L,
  intro: L,
  /** Serviciul principal la care duce grupa. */
  serviceId: z.string(),
  packages: z.array(PackageItem).min(1),
});

export const PackagesFile = z.object({
  ...meta,
  currency: z.string(),
  disclaimer: L,
  groups: z.array(PackageGroup),
  extras: z.object({
    title: L,
    intro: L,
    items: z.array(z.object({ id: z.string(), name: L, description: L, price: z.number().nullable() })),
  }),
});
export type PackagesFile = z.infer<typeof PackagesFile>;

/* ---------------------------------------------------------------- Portofoliu */

export const Video = z.object({
  provider: z.enum(["youtube", "vimeo"]),
  /** ID-ul video (ex. pentru youtube.com/watch?v=ABC123 → "ABC123"). Gol = placeholder. */
  id: z.string(),
  /** Clip scurt MP4 (fără sunet) pentru preview la hover pe desktop, opțional. */
  previewMp4: z.string().optional(),
  durationIso: z.string().optional(),
  uploadDate: z.string().optional(),
});

export const PortfolioItem = z.object({
  ...meta,
  placeholder: z.boolean().default(false),
  slug: z.object({ ro: z.string(), en: z.string() }),
  title: L,
  client: z.string(),
  industry: L,
  year: z.number().int(),
  category: z.enum(PORTFOLIO_CATEGORIES),
  /** Serviciile (ID) folosite, pentru filtrarea pe paginile de servicii. */
  services: z.array(z.string()),
  /** Imagine de copertă din /public (ex. /portfolio/proiect.jpg). Gol = cadru placeholder. */
  cover: z.string(),
  /** Adresa proiectului live (site-uri), opțional. */
  url: z.string().url().optional(),
  /** true = site-ul permite iframe; pagina proiectului oferă previzualizare live. */
  embed: z.boolean().optional(),
  excerpt: L,
  challenge: L,
  whatWeDid: LList,
  /** Rezultatul, doar dacă e real. */
  result: L.optional(),
  video: Video.optional(),
  gallery: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});
export type PortfolioItem = z.infer<typeof PortfolioItem>;

/* ---------------------------------------------------------------- Orașe */

export const City = z.object({
  ...meta,
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  /** Forma cu prepoziție: „în București”, „în Cluj-Napoca”. */
  inName: z.string(),
  county: z.string(),
  region: z.string(),
  order: z.number().int(),
});
export type City = z.infer<typeof City>;

export const LocalService = z.object({
  ...meta,
  id: z.string(),
  /** Prefixul URL: /{slugPrefix}-{oras} */
  slugPrefix: z.string(),
  /** Serviciul principal (ID din content/services). */
  serviceId: z.string(),
  /** Nume pentru linkuri: „Filmare nuntă”. */
  name: z.string(),
});

export const CityPage = z.object({
  ...meta,
  /** false = pagina are noindex și nu apare în sitemap (conținut necompletat). */
  ready: z.boolean(),
  service: z.string(),
  city: z.string(),
  metaTitle: z.string().max(70),
  metaDescription: z.string().max(165),
  h1: z.string(),
  subtitle: z.string(),
  summary: z.array(z.string()).min(3),
  intro: z.array(z.string()).min(1),
  local: z.object({
    title: z.string(),
    text: z.string(),
    items: z.array(z.object({ title: z.string(), text: z.string() })),
  }),
  industries: z
    .object({ title: z.string(), items: z.array(z.object({ title: z.string(), text: z.string() })) })
    .optional(),
  travel: z.object({ title: z.string(), text: z.string() }),
  faq: z.array(FaqItem).min(3),
  whatsapp: z.string(),
});
export type CityPage = z.infer<typeof CityPage>;

/* ---------------------------------------------------------------- Alte fișiere */

export const Stat = z.object({
  ...meta,
  id: z.string(),
  value: z.number(),
  prefix: z.string().default(""),
  suffix: z.string().default(""),
  label: L,
});
export const StatsFile = z.object({ ...meta, stats: z.array(Stat) });

export const Testimonial = z.object({
  ...meta,
  placeholder: z.boolean().default(false),
  name: z.string(),
  role: L,
  company: z.string(),
  quote: L,
  services: z.array(z.string()).default([]),
  rating: z.number().min(1).max(5).optional(),
});
export const TestimonialsFile = z.object({ ...meta, items: z.array(Testimonial) });

export const Client = z.object({
  ...meta,
  placeholder: z.boolean().default(false),
  name: z.string(),
  /** Logo în /public/clients/*.svg sau .png. Gol = afișează numele. */
  logo: z.string(),
  url: z.string().optional(),
});
export const ClientsFile = z.object({ ...meta, items: z.array(Client) });

export const FaqFile = z.object({
  ...meta,
  items: z.array(z.object({ q: L, a: L })),
});

export const SiteFile = z.object({
  ...meta,
  name: z.string(),
  legalName: z.string(),
  domain: z.string(),
  url: z.string().url(),
  cui: z.string(),
  regCom: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    county: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  phone: z.object({ display: z.string(), e164: z.string() }),
  whatsapp: z.object({ number: z.string(), defaultMessage: L }),
  email: z.string(),
  hours: L,
  areaServed: L,
  social: z.object({
    tiktok: z.string(),
    instagram: z.string(),
    facebook: z.string(),
    youtube: z.string(),
    linkedin: z.string(),
    behance: z.string(),
  }),
  showreel: z.object({
    mp4: z.string(),
    webm: z.string(),
    poster: z.string(),
    youtubeId: z.string(),
  }),
  moreWork: z.array(
    z.object({
      id: z.string(),
      kind: z.enum(["behance", "drive"]),
      url: z.string(),
      cover: z.string(),
      title: L,
      description: L,
    }),
  ),
  founded: z.number().int().optional(),
});
export type SiteFile = z.infer<typeof SiteFile>;

export const BlogFrontmatter = z.object({
  title: z.string(),
  description: z.string().max(165),
  date: z.string(),
  updated: z.string().optional(),
  author: z.string(),
  /** Același ID în ambele limbi, ca să legăm traducerile. */
  translationKey: z.string(),
  cover: z.string().optional(),
  relatedServices: z.array(z.string()).default([]),
  readingMinutes: z.number().optional(),
});
export type BlogFrontmatter = z.infer<typeof BlogFrontmatter>;
