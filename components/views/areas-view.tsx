import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { CTASection } from "@/components/sections/cta-section";
import { getCities, getCityPages, getLocalServices, getService } from "@/lib/content";
import type { Locale } from "@/lib/content/schemas";
import { path, cityPath, servicePath } from "@/lib/routes";

export async function AreasView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "areas" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const cities = getCities();
  const pages = getCityPages();
  const localServices = getLocalServices();
  const find = (ls: string, city: string) => pages.find((p) => p.localService.id === ls && p.city === city);

  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("areas"), path: path("areas", locale) },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={<p>{t("intro")}</p>}
      />

      <Section labelledBy="by-service">
        <SectionHeader id="by-service" title={t("byService")} />
        <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">
          {localServices.map((ls) => {
            const svc = getService(ls.serviceId);
            return (
              <div key={ls.id} className="border-t border-line pt-6">
                <h3 className="font-display text-3xl">
                  {svc ? <Link href={servicePath(locale, svc.slug)} className="hover:text-gold">{ls.name}</Link> : ls.name}
                </h3>
                <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[0.9375rem]">
                  {cities.map((c) => {
                    const p = find(ls.id, c.id);
                    return (
                      <li key={c.id}>
                        {p?.ready ? (
                          <Link href={cityPath(p.slug)} className="inline-flex items-center gap-2 hover:text-gold">
                            <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                            {c.name}
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-muted/70">
                            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                            {c.name} <span className="text-xs">({t("soon")})</span>
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="surface" labelledBy="by-city">
        <SectionHeader id="by-city" title={t("byCity")} />
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => {
            const ready = pages.filter((p) => p.city === c.id && p.ready);
            return (
              <li key={c.id} className="bg-surface p-6">
                <p className="font-display text-2xl">{c.name}</p>
                <p className="text-sm text-muted">{c.county} · {c.region}</p>
                {ready.length > 0 ? (
                  <ul className="mt-4 space-y-1.5 text-sm">
                    {ready.map((p) => (
                      <li key={p.slug}><Link href={cityPath(p.slug)} className="hover:text-gold">{p.localService.name}</Link></li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted/70">{t("soon")}</p>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-lg">{t("otherCity")}</p>
      </Section>

      <CTASection locale={locale} />
    </>
  );
}
