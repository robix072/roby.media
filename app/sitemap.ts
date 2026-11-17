import type { MetadataRoute } from "next";
import { getServices, getPortfolio, getCityPages, getBlogPosts, getBlogTranslation } from "@/lib/content";
import { STATIC_PATHS, servicePath, portfolioPath, blogPath, cityPath } from "@/lib/routes";
import { abs } from "@/lib/seo";

type Entry = MetadataRoute.Sitemap[number];
const now = new Date();

function pair(ro: string | undefined, en: string | undefined, priority: number, freq: Entry["changeFrequency"] = "monthly"): Entry[] {
  const languages: Record<string, string> = {};
  if (ro) languages["ro-RO"] = abs(ro);
  if (en) languages["en"] = abs(en);
  const alt = Object.keys(languages).length > 1 ? { languages } : undefined;
  return [ro, en].filter(Boolean).map((p) => ({ url: abs(p!), lastModified: now, changeFrequency: freq, priority, alternates: alt }));
}

/** sitemap.xml: toate paginile indexabile (fără schelete de oraș și proiecte placeholder). */
export default function sitemap(): MetadataRoute.Sitemap {
  const out: Entry[] = [];
  const prio: Record<string, number> = { home: 1, services: 0.9, packages: 0.9, contact: 0.8, portfolio: 0.7, about: 0.6, blog: 0.6, areas: 0.6, privacy: 0.2, cookies: 0.2, terms: 0.2 };
  for (const [k, v] of Object.entries(STATIC_PATHS)) out.push(...pair(v.ro, v.en, prio[k] ?? 0.5, k === "home" ? "weekly" : "monthly"));
  for (const s of getServices()) out.push(...pair(servicePath("ro", s.slug), servicePath("en", s.slug), 0.9));
  for (const p of getPortfolio().filter((p) => !p.placeholder)) out.push(...pair(portfolioPath("ro", p.slug), portfolioPath("en", p.slug), 0.5));
  for (const c of getCityPages().filter((p) => p.ready)) out.push(...pair(cityPath(c.slug), undefined, 0.8));
  const seen = new Set<string>();
  for (const post of getBlogPosts("ro").concat(getBlogPosts("en"))) {
    if (seen.has(post.translationKey + post.locale)) continue;
    seen.add(post.translationKey + post.locale);
    const tr = getBlogTranslation(post);
    const ro = post.locale === "ro" ? post : tr;
    const en = post.locale === "en" ? post : tr;
    if (ro) seen.add(ro.translationKey + "ro");
    if (en) seen.add(en.translationKey + "en");
    out.push(...pair(ro ? blogPath("ro", ro.slug) : undefined, en ? blogPath("en", en.slug) : undefined, 0.6));
  }
  return out;
}
