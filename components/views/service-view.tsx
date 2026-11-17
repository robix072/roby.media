import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon, ServiceIcon } from "@/components/icons";
import { ProcessSteps } from "@/components/sections/process-steps";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { PackageGrid, PackagesDisclaimer } from "@/components/sections/packages";
import { FAQ } from "@/components/sections/faq";
import { ServiceCard } from "@/components/sections/service-card";
import { CTASection } from "@/components/sections/cta-section";
import { JsonLd } from "@/components/ui/json-ld";
import {
  getService, getPortfolioForService, getPackageGroup, getPackages, getCityPages,
} from "@/lib/content";
import type { Locale, Service } from "@/lib/content/schemas";
import { path, servicePath, contactWithService, cityPath } from "@/lib/routes";
import { waHref } from "@/lib/links";
import { serviceLd } from "@/lib/seo";
import { priceLabel } from "@/lib/price";

export async function ServiceView({ service, locale }: { service: Service; locale: Locale }) {
  const c = service[locale];
  const t = await getTranslations({ locale, namespace: "common" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "cta" });
  const tcat = await getTranslations({ locale, namespace: "categories" });
  const ts = await getTranslations({ locale, namespace: "services" });

  const href = servicePath(locale, service.slug);
  const portfolio = getPortfolioForService(service.id, service.portfolioCategories, 3);
  const group = getPackageGroup(service.packageGroup);
  const pkgs = group ? (service.packageIds?.length ? group.packages.filter((p) => service.packageIds!.includes(p.id)) : group.packages) : [];
  const related = service.related.map((id) => getService(id)).filter((s): s is Service => !!s);
  const cities = locale === "ro" && service.localService
    ? getCityPages().filter((p) => p.localService.id === service.localService && p.ready)
    : [];
  const price = priceLabel(service.priceFrom, service.priceUnit, locale, (k) => t(k));

  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("services"), path: path("services", locale) },
          { name: c.name, path: href },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={tcat(service.category)}
        title={c.h1}
        intro={<p>{c.subtitle}</p>}
        aside={
          <Reveal className="border border-line bg-surface/80 p-7 backdrop-blur-sm md:p-8">
            <p className="flex items-center gap-3 font-display text-2xl">
              <ServiceIcon name={service.icon} className="h-6 w-6 text-gold" /> {t("summary")}
            </p>
            <ul className="mt-5 space-y-3">
              {c.summary.map((s) => (
                <li key={s} className="flex gap-3 text-[0.9375rem] text-fg/85">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
              <span className="text-sm text-muted">{t("priceFromLabel")}</span>
              <span className="font-display text-3xl text-gold">{price}</span>
            </div>
          </Reveal>
        }
      >
        <ButtonLink href={waHref(c.whatsapp)} variant="primary" size="lg" track="whatsapp">
          <WhatsAppIcon className="h-5 w-5" /> {tc("whatsapp")}
        </ButtonLink>
        <ButtonLink href={contactWithService(locale, service.id)} variant="outline" size="lg" track="quote_click">
          {tc("quote")} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </ButtonLink>
      </PageHero>

      {/* Problema și soluția */}
      <Section labelledBy="problem-title">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 id="problem-title" className="font-display text-4xl text-balance md:text-5xl">{c.problem.title}</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
              {c.problem.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="border-l-2 border-gold pl-6 md:pl-10">
            <h2 className="font-display text-4xl text-balance md:text-5xl">{c.solution.title}</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-fg/85">
              {c.solution.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Ce include */}
      <Section tone="surface" labelledBy="includes-title">
        <SectionHeader id="includes-title" eyebrow={t("includes")} title={c.includes.title} />
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {c.includes.items.map((it, i) => (
            <Reveal as="li" key={i} delay={(i % 3) * 0.05} className="bg-surface p-6 md:p-8">
              <Check className="h-6 w-6 text-gold" aria-hidden="true" />
              <h3 className="mt-5 text-lg font-bold">{it.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{it.text}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Pentru cine */}
      <Section labelledBy="audience-title">
        <SectionHeader id="audience-title" eyebrow={c.audience.title.toLowerCase() === t("audience").toLowerCase() ? undefined : t("audience")} title={c.audience.title} intro={<p>{c.audience.intro}</p>} />
        <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {c.audience.items.map((a, i) => (
            <Reveal as="li" key={i} delay={(i % 3) * 0.05} className="border-t border-line pt-6">
              <h3 className="font-display text-2xl text-gold">{a.industry}</h3>
              <p className="mt-3 text-muted">{a.text}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Proces */}
      <Section tone="surface" labelledBy="process-title">
        <SectionHeader id="process-title" eyebrow={c.process.title.toLowerCase() === t("process").toLowerCase() ? undefined : t("process")} title={c.process.title} />
        <ProcessSteps steps={c.process.steps} />
      </Section>

      {/* Portofoliu */}
      {portfolio.length > 0 && (
        <Section labelledBy="work-title">
          <SectionHeader
            id="work-title"
            eyebrow={tn("portfolio")}
            title={ts("portfolioTitle")}
            action={<ButtonLink href={path("portfolio", locale)} variant="outline">{tc("seePortfolio")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>}
          />
          <PortfolioSection items={portfolio} locale={locale} />
        </Section>
      )}

      {/* Prețuri */}
      <Section tone="surface" labelledBy="pricing-title">
        <SectionHeader
          id="pricing-title"
          eyebrow={t("pricing")}
          title={pkgs.length ? ts("packagesTitle") : `${t("priceFromLabel")}: ${price}`}
          intro={c.pricingNote ? <p>{c.pricingNote}</p> : undefined}
          action={<ButtonLink href={path("packages", locale)} variant="outline">{tc("seePackages")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>}
        />
        {pkgs.length > 0 && group ? (
          <PackageGrid packages={pkgs} groupTitle={group.title[locale]} locale={locale} />
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={waHref(c.whatsapp)} size="lg" track="whatsapp"><WhatsAppIcon className="h-5 w-5" /> {tc("writeWhatsapp")}</ButtonLink>
            <ButtonLink href={contactWithService(locale, service.id)} variant="outline" size="lg" track="quote_click">{tc("quote")}</ButtonLink>
          </div>
        )}
        <PackagesDisclaimer text={getPackages().disclaimer[locale]} />
      </Section>

      {/* FAQ */}
      <Section labelledBy="faq-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader id="faq-title" eyebrow={t("faq")} title={`${t("faq")}: ${c.name}`} className="lg:sticky lg:top-28" />
          </div>
          <div className="lg:col-span-8">
            <FAQ items={c.faq} />
          </div>
        </div>
      </Section>

      {/* Servicii conexe + orașe */}
      <Section tone="surface" labelledBy="related-title">
        <SectionHeader id="related-title" title={t("related")} />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r) => (
            <li key={r.id}>
              <ServiceCard
                href={servicePath(locale, r.slug)}
                name={r[locale].name}
                description={r[locale].cardDescription}
                icon={r.icon}
                priceLabel={priceLabel(r.priceFrom, r.priceUnit, locale, (k) => t(k))}
              />
            </li>
          ))}
        </ul>
        {cities.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-3xl">{t("inCities")}</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {cities.map((p) => (
                <li key={p.slug}>
                  <Link href={cityPath(p.slug)} className="inline-flex h-11 items-center gap-2 border border-line px-4 text-sm font-semibold transition-colors hover:border-gold hover:text-gold">
                    <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                    {p.localService.name} {p.cityData.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={path("areas", locale)} className="inline-flex h-11 items-center gap-2 px-4 text-sm font-semibold text-muted hover:text-gold">
                  {tn("areas")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        )}
      </Section>

      <CTASection locale={locale} title={c.closing.title} text={c.closing.text} whatsapp={c.whatsapp} serviceId={service.id} />

      <JsonLd
        data={serviceLd({
          name: c.name,
          description: c.metaDescription,
          path: href,
          priceFrom: service.priceFrom,
        })}
      />
    </>
  );
}
