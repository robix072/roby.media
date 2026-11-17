import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Check, MapPin, Car } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { ProcessSteps } from "@/components/sections/process-steps";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { PackageGrid, PackagesDisclaimer } from "@/components/sections/packages";
import { FAQ } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta-section";
import { JsonLd } from "@/components/ui/json-ld";
import {
  getService, getCityPages, getPortfolioForService, getPackageGroup, getPackages, type CityPageFull,
} from "@/lib/content";
import { path, servicePath, contactWithService, cityPath } from "@/lib/routes";
import { waHref } from "@/lib/links";
import { serviceLd } from "@/lib/seo";
import { priceLabel } from "@/lib/price";

/** Pagina SEO locală: /{serviciu}-{oraș}. Doar în română. */
export async function CityView({ page }: { page: CityPageFull }) {
  const locale = "ro" as const;
  const t = await getTranslations({ locale, namespace: "common" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "cta" });
  const service = getService(page.localService.serviceId);
  const sc = service?.ro;
  const city = page.cityData;
  const href = cityPath(page.slug);
  const all = getCityPages().filter((p) => p.ready);
  const sameService = all.filter((p) => p.localService.id === page.localService.id && p.slug !== page.slug);
  const sameCity = all.filter((p) => p.city === page.city && p.slug !== page.slug);
  const group = service ? getPackageGroup(service.packageGroup) : null;
  const pkgs = group && service ? (service.packageIds?.length ? group.packages.filter((p) => service.packageIds!.includes(p.id)) : group.packages) : [];
  const portfolio = service ? getPortfolioForService(service.id, service.portfolioCategories, 3) : [];

  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("areas"), path: path("areas", locale) },
          { name: `${page.localService.name} ${city.name}`, path: href },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={`${city.name} · ${city.county}`}
        title={page.h1}
        intro={<p>{page.subtitle}</p>}
        aside={
          <Reveal className="border border-line bg-surface/80 p-7 backdrop-blur-sm md:p-8">
            <p className="flex items-center gap-3 font-display text-2xl">
              <MapPin className="h-6 w-6 text-gold" aria-hidden="true" /> {t("summary")}
            </p>
            <ul className="mt-5 space-y-3">
              {page.summary.map((s) => (
                <li key={s} className="flex gap-3 text-[0.9375rem] text-fg/85">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
            {service && (
              <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
                <span className="text-sm text-muted">{t("priceFromLabel")}</span>
                <span className="font-display text-3xl text-gold">{priceLabel(service.priceFrom, service.priceUnit, locale, (k) => t(k))}</span>
              </div>
            )}
          </Reveal>
        }
      >
        <ButtonLink href={waHref(page.whatsapp)} size="lg" track="whatsapp">
          <WhatsAppIcon className="h-5 w-5" /> {tc("whatsapp")}
        </ButtonLink>
        <ButtonLink href={contactWithService(locale, service?.id)} variant="outline" size="lg" track="quote_click">
          {tc("quote")} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </ButtonLink>
      </PageHero>

      {/* Introducere + context local */}
      <Section labelledBy="local-title">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="space-y-5 text-lg leading-relaxed text-fg/85 lg:col-span-5">
            {page.intro.map((p, i) => <p key={i}>{p}</p>)}
          </Reveal>
          <div className="lg:col-span-7">
            <h2 id="local-title" className="font-display text-4xl text-balance md:text-5xl">{page.local.title}</h2>
            <p className="mt-5 text-lg text-muted">{page.local.text}</p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {page.local.items.map((it, i) => (
                <li key={i} className="grid gap-2 py-5 sm:grid-cols-3 sm:gap-6">
                  <h3 className="font-bold text-gold">{it.title}</h3>
                  <p className="text-muted sm:col-span-2">{it.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {page.industries && (
        <Section tone="surface" labelledBy="ind-title">
          <SectionHeader id="ind-title" eyebrow={t("audience")} title={page.industries.title} />
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {page.industries.items.map((it, i) => (
              <Reveal as="li" key={i} delay={(i % 3) * 0.05} className="border-t border-line pt-6">
                <h3 className="font-display text-2xl text-gold">{it.title}</h3>
                <p className="mt-3 text-muted">{it.text}</p>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* Ce include (din pagina serviciului) */}
      {sc && service && (
        <Section labelledBy="inc-title">
          <SectionHeader
            id="inc-title"
            eyebrow={t("includes")}
            title={sc.includes.title}
            action={<ButtonLink href={servicePath(locale, service.slug)} variant="outline">{tc("seeService")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>}
          />
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {sc.includes.items.map((it) => (
              <li key={it.title} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <span><strong className="font-semibold">{it.title}.</strong> <span className="text-muted">{it.text}</span></span>
              </li>
            ))}
          </ul>
          <div className="mt-16">
            <h2 className="mb-8 font-display text-3xl md:text-4xl">{sc.process.title}</h2>
            <ProcessSteps steps={sc.process.steps} />
          </div>
        </Section>
      )}

      {portfolio.length > 0 && (
        <Section tone="surface" labelledBy="pf-title">
          <SectionHeader id="pf-title" eyebrow={tn("portfolio")} title={tn("portfolio")} />
          <PortfolioSection items={portfolio} locale={locale} />
        </Section>
      )}

      {pkgs.length > 0 && group && (
        <Section labelledBy="pk-title">
          <SectionHeader id="pk-title" eyebrow={t("pricing")} title={group.title.ro} intro={sc?.pricingNote ? <p>{sc.pricingNote}</p> : undefined} />
          <PackageGrid packages={pkgs} groupTitle={group.title.ro} locale={locale} />
          <PackagesDisclaimer text={getPackages().disclaimer.ro} />
        </Section>
      )}

      {/* Deplasare */}
      <Section tone="surface" size="sm" labelledBy="travel-title">
        <div className="flex flex-col gap-6 border border-line bg-ink p-7 md:flex-row md:items-start md:gap-10 md:p-10">
          <Car className="h-10 w-10 shrink-0 text-gold" aria-hidden="true" />
          <div>
            <h2 id="travel-title" className="font-display text-3xl md:text-4xl">{page.travel.title}</h2>
            <p className="mt-4 max-w-3xl text-lg text-muted">{page.travel.text}</p>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader id="faq-title" eyebrow={t("faq")} title={`${t("faq")}: ${page.localService.name} ${city.name}`} className="lg:sticky lg:top-28" />
          </div>
          <div className="lg:col-span-8"><FAQ items={page.faq} /></div>
        </div>
      </Section>

      {(sameService.length > 0 || sameCity.length > 0) && (
        <Section tone="surface" size="sm">
          <div className="grid gap-12 md:grid-cols-2">
            {sameService.length > 0 && (
              <div>
                <h2 className="font-display text-3xl">{t("otherCities")}</h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {sameService.map((p) => (
                    <li key={p.slug}>
                      <Link href={cityPath(p.slug)} className="inline-flex h-11 items-center gap-2 border border-line px-4 text-sm font-semibold hover:border-gold hover:text-gold">
                        <MapPin className="h-4 w-4 text-gold" aria-hidden="true" /> {p.cityData.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sameCity.length > 0 && (
              <div>
                <h2 className="font-display text-3xl">{t("otherServicesCity", { city: city.name })}</h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {sameCity.map((p) => (
                    <li key={p.slug}>
                      <Link href={cityPath(p.slug)} className="inline-flex h-11 items-center border border-line px-4 text-sm font-semibold hover:border-gold hover:text-gold">
                        {p.localService.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      <CTASection locale={locale} title={`${page.localService.name} ${city.inName}`} text={sc?.closing.text} whatsapp={page.whatsapp} serviceId={service?.id} />

      <JsonLd
        data={serviceLd({
          name: page.h1,
          description: page.metaDescription,
          path: href,
          priceFrom: service?.priceFrom ?? null,
          areaName: city.name,
          serviceType: page.localService.name,
        })}
      />
    </>
  );
}
