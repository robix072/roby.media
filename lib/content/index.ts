/**
 * Încarcă și validează conținutul din /content. Rulează doar pe server, la build.
 */
import "server-only";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";
import {
  Service, PackagesFile, PortfolioItem, CityPage, StatsFile, TestimonialsFile, ClientsFile, FaqFile,
  SiteFile, City, LocalService, BlogFrontmatter, type Locale,
} from "./schemas";

const ROOT = join(process.cwd(), "content");

function load<T>(schema: z.ZodType<T>, rel: string): T {
  const raw = JSON.parse(readFileSync(join(ROOT, rel), "utf8"));
  const r = schema.safeParse(raw);
  if (!r.success) {
    const msg = r.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Conținut invalid în content/${rel}:\n${msg}`);
  }
  return r.data;
}

export const getSite = cache(() => load(SiteFile, "site.json"));
export const getStats = cache(() => load(StatsFile, "stats.json").stats);
export const getTestimonials = cache(() => load(TestimonialsFile, "testimonials.json").items);
export const getClients = cache(() => load(ClientsFile, "clients.json").items);
export const getFaq = cache(() => load(FaqFile, "faq.json").items);
export const getPackages = cache(() => load(PackagesFile, "packages.json"));
export const getPortfolio = cache(() =>
  load(z.object({ items: z.array(PortfolioItem) }).passthrough(), "portfolio.json").items,
);
export const getCities = cache(() =>
  load(z.object({ items: z.array(City) }).passthrough(), "cities.json").items.sort((a, b) => a.order - b.order),
);
export const getLocalServices = cache(() =>
  load(z.object({ items: z.array(LocalService) }).passthrough(), "local-services.json").items,
);

export const getServices = cache(() => {
  const files = readdirSync(join(ROOT, "services")).filter((f) => f.endsWith(".json"));
  const order = { productie: 0, evenimente: 1, marketing: 2, web: 3 } as const;
  return files
    .map((f) => load(Service, `services/${f}`))
    .sort((a, b) => order[a.category] - order[b.category] || a.order - b.order);
});

export const getService = (id: string) => getServices().find((s) => s.id === id);
export const getServiceBySlug = (locale: Locale, slug: string) =>
  getServices().find((s) => s.slug[locale] === slug);

export type CityPageFull = CityPage & {
  cityData: z.infer<typeof City>;
  localService: z.infer<typeof LocalService>;
  slug: string;
};

export const getCityPages = cache((): CityPageFull[] => {
  const cities = getCities();
  const out: CityPageFull[] = [];
  for (const ls of getLocalServices()) {
    for (const c of cities) {
      const rel = `city-pages/${ls.id}/${c.id}.json`;
      if (!existsSync(join(ROOT, rel))) continue;
      out.push({ ...load(CityPage, rel), cityData: c, localService: ls, slug: `${ls.slugPrefix}-${c.id}` });
    }
  }
  return out;
});

export const getCityPageBySlug = (slug: string) => getCityPages().find((p) => p.slug === slug);

/* ---------------------------------------------------------------- Blog */

export type BlogPost = BlogFrontmatter & { slug: string; locale: Locale; body: string };

export const getBlogPosts = cache((locale: Locale): BlogPost[] => {
  const dir = join(ROOT, "blog", locale);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const { data, content } = matter(readFileSync(join(dir, f), "utf8"));
      const fm = BlogFrontmatter.safeParse(data);
      if (!fm.success) throw new Error(`Frontmatter invalid în content/blog/${locale}/${f}: ${fm.error.message}`);
      return { ...fm.data, slug: f.replace(/\.mdx?$/, ""), locale, body: content };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
});

export const getBlogPost = (locale: Locale, slug: string) => getBlogPosts(locale).find((p) => p.slug === slug);

export function getBlogTranslation(post: BlogPost): BlogPost | undefined {
  const other: Locale = post.locale === "ro" ? "en" : "ro";
  return getBlogPosts(other).find((p) => p.translationKey === post.translationKey);
}

/* ---------------------------------------------------------------- Legal */

export type LegalDoc = "privacy" | "cookies" | "terms";
const legalFiles: Record<LegalDoc, Record<Locale, string>> = {
  privacy: { ro: "politica-confidentialitate", en: "privacy-policy" },
  cookies: { ro: "politica-cookies", en: "cookie-policy" },
  terms: { ro: "termeni-si-conditii", en: "terms" },
};

export function getLegal(doc: LegalDoc, locale: Locale) {
  const file = join(ROOT, "legal", locale, `${legalFiles[doc][locale]}.md`);
  if (!existsSync(file)) return null;
  const { data, content } = matter(readFileSync(file, "utf8"));
  const site = getSite();
  const a = site.address;
  const tokens: Record<string, string> = {
    legalName: site.legalName,
    cui: site.cui,
    regCom: site.regCom,
    address: `${a.street}, ${a.city}, ${a.county}, ${a.postalCode}, România`,
    email: site.email,
    phone: site.phone.display,
    domain: site.domain,
    url: site.url,
  };
  const body = content.replace(/\{\{(\w+)\}\}/g, (m, k) => tokens[k] ?? m);
  return { title: String(data.title ?? ""), updated: String(data.updated ?? ""), body };
}

/* ---------------------------------------------------------------- Ajutoare */

export function getPortfolioForService(serviceId: string, categories: string[], limit = 6) {
  const items = getPortfolio();
  const direct = items.filter((p) => p.services.includes(serviceId));
  const byCat = items.filter((p) => !direct.includes(p) && categories.includes(p.category));
  return [...direct, ...byCat].slice(0, limit);
}

export function getPackageGroup(id: string | null) {
  if (!id) return null;
  return getPackages().groups.find((g) => g.id === id) ?? null;
}
