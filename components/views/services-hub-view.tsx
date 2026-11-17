import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCard } from "@/components/sections/service-card";
import { CTASection } from "@/components/sections/cta-section";
import { JsonLd } from "@/components/ui/json-ld";
import { getServices } from "@/lib/content";
import { SERVICE_CATEGORIES, type Locale } from "@/lib/content/schemas";
import { path, servicePath } from "@/lib/routes";
import { priceLabel } from "@/lib/price";
import { abs } from "@/lib/seo";

export async function ServicesHubView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "services" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tcat = await getTranslations({ locale, namespace: "categories" });
  const tci = await getTranslations({ locale, namespace: "categoryIntro" });
  const tcom = await getTranslations({ locale, namespace: "common" });
  const services = getServices();

  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("services"), path: path("services", locale) },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={<p>{t("intro")}</p>}
      >
        <nav aria-label={tn("services")} className="flex flex-wrap gap-2">
          {SERVICE_CATEGORIES.map((c) => (
            <a key={c} href={`#${c}`} className="inline-flex h-11 items-center border border-line px-4 text-sm font-semibold transition-colors hover:border-gold hover:text-gold">
              {tcat(c)}
            </a>
          ))}
        </nav>
      </PageHero>

      {SERVICE_CATEGORIES.map((c, ci) => {
        const list = services.filter((s) => s.category === c);
        return (
          <Section key={c} id={c} tone={ci % 2 ? "surface" : "ink"} labelledBy={`cat-${c}`}>
            <SectionHeader id={`cat-${c}`} eyebrow={String(ci + 1).padStart(2, "0")} title={tcat(c)} intro={<p>{tci(c)}</p>} />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s, i) => (
                <Reveal as="li" key={s.id} delay={(i % 3) * 0.05}>
                  <ServiceCard
                    href={servicePath(locale, s.slug)}
                    name={s[locale].name}
                    description={s[locale].cardDescription}
                    icon={s.icon}
                    index={i}
                    priceLabel={priceLabel(s.priceFrom, s.priceUnit, locale, (k) => tcom(k))}
                  />
                </Reveal>
              ))}
            </ul>
          </Section>
        );
      })}

      <CTASection locale={locale} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s[locale].name, url: abs(servicePath(locale, s.slug)) })),
        }}
      />
    </>
  );
}
