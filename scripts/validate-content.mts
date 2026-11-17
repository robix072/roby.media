/**
 * Validează tot conținutul din /content: schemă, referințe între fișiere, lungimi SEO, număr de cuvinte.
 * Rulare: npm run validate:content
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  Service, PackagesFile, PortfolioItem, CityPage, StatsFile, TestimonialsFile, ClientsFile, FaqFile,
  SiteFile, City, LocalService,
} from "../lib/content/schemas.ts";
import { z } from "zod";

const root = join(import.meta.dirname, "..", "content");
const errors: string[] = [];
const warnings: string[] = [];
const read = (p: string) => JSON.parse(readFileSync(join(root, p), "utf8"));

function check<T>(schema: z.ZodType<T>, data: unknown, label: string): T | null {
  const r = schema.safeParse(data);
  if (!r.success) {
    for (const i of r.error.issues) errors.push(`${label}: ${i.path.join(".")} → ${i.message}`);
    return null;
  }
  return r.data;
}
const words = (v: unknown): number => {
  if (typeof v === "string") return v.split(/\s+/).filter(Boolean).length;
  if (Array.isArray(v)) return v.reduce((a, x) => a + words(x), 0);
  if (v && typeof v === "object") return Object.entries(v).reduce((a, [k, x]) => (k.startsWith("_") || ["metaTitle","metaDescription","whatsapp","cardDescription","name"].includes(k) ? a : a + words(x)), 0);
  return 0;
};

const only = process.argv[2]; // opțional: filtru după nume fișier

// Servicii
const serviceFiles = readdirSync(join(root, "services")).filter((f) => f.endsWith(".json"));
const services = new Map<string, z.infer<typeof Service>>();
for (const f of serviceFiles) {
  const s = check(Service, read(`services/${f}`), `services/${f}`);
  if (s) {
    if (`${s.id}.json` !== f) errors.push(`services/${f}: id „${s.id}” diferă de numele fișierului`);
    services.set(s.id, s);
  }
}
const pk = check(PackagesFile, read("packages.json"), "packages.json");
const pkgIds = new Set(pk?.groups.flatMap((g) => g.packages.map((p) => p.id)) ?? []);
const localServices = (read("local-services.json").items as unknown[]).map((x, i) => check(LocalService, x, `local-services.json[${i}]`)).filter(Boolean);
const lsIds = new Set(localServices.map((x) => x!.id));
for (const s of services.values()) {
  if (only && !s.id.includes(only)) continue;
  for (const r of s.related) if (!services.has(r) && serviceFiles.length > 25) errors.push(`services/${s.id}: related „${r}” nu există`);
  for (const id of s.packageIds ?? []) if (!pkgIds.has(id)) errors.push(`services/${s.id}: packageId „${id}” nu există`);
  if (s.localService && !lsIds.has(s.localService)) errors.push(`services/${s.id}: localService „${s.localService}” nu există`);
  for (const loc of ["ro", "en"] as const) {
    const c = s[loc];
    const w = words(c);
    if (w < 750) warnings.push(`services/${s.id} [${loc}]: doar ${w} cuvinte (țintă 800–1.200)`);
    if (c.metaTitle.length > 62) warnings.push(`services/${s.id} [${loc}]: metaTitle are ${c.metaTitle.length} caractere`);
    if (c.metaDescription.length > 158) warnings.push(`services/${s.id} [${loc}]: metaDescription are ${c.metaDescription.length} caractere`);
    if (/[şţŞŢ]/.test(JSON.stringify(c))) errors.push(`services/${s.id} [${loc}]: diacritice cu sedilă (ş/ţ). Folosiți ș/ț.`);
    if (/—/.test(JSON.stringify(c))) warnings.push(`services/${s.id} [${loc}]: conține liniuță lungă (—)`);
    console.log(`  ${s.id} [${loc}] ${w} cuvinte`);
  }
}
const slugsRo = [...services.values()].map((s) => s.slug.ro);
const slugsEn = [...services.values()].map((s) => s.slug.en);
for (const arr of [slugsRo, slugsEn]) arr.forEach((s, i) => { if (arr.indexOf(s) !== i) errors.push(`slug duplicat: ${s}`); });

// Orașe
const cities = (read("cities.json").items as unknown[]).map((x, i) => check(City, x, `cities.json[${i}]`)).filter(Boolean);
for (const ls of localServices) {
  for (const c of cities) {
    const p = `city-pages/${ls!.id}/${c!.id}.json`;
    if (!existsSync(join(root, p))) { warnings.push(`lipsește ${p}`); continue; }
    if (only && !p.includes(only)) continue;
    const cp = check(CityPage, read(p), p);
    if (cp) {
      if (cp.service !== ls!.id || cp.city !== c!.id) errors.push(`${p}: service/city nu corespund căii`);
      if (/[şţŞŢ]/.test(JSON.stringify(cp))) errors.push(`${p}: diacritice cu sedilă`);
      if (cp.ready) console.log(`  ${p} ${words(cp)} cuvinte`);
    }
  }
}

// Restul
const portfolio = read("portfolio.json");
(portfolio.items as unknown[]).forEach((x, i) => check(PortfolioItem, x, `portfolio.json[${i}]`));
check(StatsFile, read("stats.json"), "stats.json");
check(TestimonialsFile, read("testimonials.json"), "testimonials.json");
check(ClientsFile, read("clients.json"), "clients.json");
check(FaqFile, read("faq.json"), "faq.json");
check(SiteFile, read("site.json"), "site.json");

console.log(`\n${services.size} servicii, ${warnings.length} avertismente, ${errors.length} erori`);
warnings.forEach((w) => console.log("  ⚠ " + w));
errors.forEach((e) => console.log("  ✗ " + e));
process.exit(errors.length ? 1 : 0);
