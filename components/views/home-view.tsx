import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { StatsCounter } from "@/components/sections/stats";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ServiceIcon, WhatsAppIcon } from "@/components/icons";
import { ProcessSteps } from "@/components/sections/process-steps";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { PackagesDisclaimer } from "@/components/sections/packages";
import { Testimonials } from "@/components/sections/testimonials";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { FAQ } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button";
import {
  getStats, getServices, getPortfolio, getPackages, getTestimonials, getClients, getFaq,
} from "@/lib/content";
import { SERVICE_CATEGORIES, type Locale } from "@/lib/content/schemas";
import { path, servicePath } from "@/lib/routes";
import { formatPrice } from "@/lib/format";
import { waHref, packageWaMessage } from "@/lib/links";

export async function HomeView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "cta" });
  const tcat = await getTranslations({ locale, namespace: "categories" });
  const tci = await getTranslations({ locale, namespace: "categoryIntro" });
  const tcom = await getTranslations({ locale, namespace: "common" });

  const services = getServices();
  const portfolio = getPortfolio().filter((p) => p.featured).slice(0, 6);
  const pk = getPackages();
  const featuredGroups = ["social", "productie", "nunti", "website"] as const;
  const featuredPackages = featuredGroups
    .map((g) => pk.groups.find((x) => x.id === g))
    .filter(Boolean)
    .map((g) => ({ group: g!, pkg: g!.packages.find((p) => p.featured) ?? g!.packages[0] }));
  const stats = getStats();
  const testimonials = getTestimonials();
  const clients = getClients();
  const servicesHub = path("services", locale);

  const goals = [
    { key: "clients", href: `${servicesHub}#marketing`, icon: "target" },
    { key: "content", href: `${servicesHub}#productie`, icon: "phone-video" },
    { key: "event", href: `${servicesHub}#evenimente`, icon: "rings" },
    { key: "web", href: `${servicesHub}#web`, icon: "monitor" },
  ] as const;

  const why = t.raw("why") as { title: string; text: string }[];
  const process = t.raw("process") as { title: string; text: string }[];
  const nr = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <>
      <Hero locale={locale} />

      {/* Cifre (doar dacă există cifre reale în content/stats.json) */}
      {stats.length > 0 && (
        <section aria-label={t("statsTitle")} className="border-b border-line py-14 md:py-20">
          <div className="container-x">
            <StatsCounter stats={stats.map((s) => ({ ...s, label: s.label[locale] }))} locale={locale} />
          </div>
        </section>
      )}

      {/* Obiective: 2×2 mare, fără cutii */}
      <Section labelledBy="goals-title">
        <SectionHeader id="goals-title" index={1} eyebrow={t("goalsEyebrow")} title={t("goalsTitle")} />
        <ul className="grid border-b border-line sm:grid-cols-2">
          {goals.map((g, i) => (
            <Reveal as="li" key={g.key} delay={(i % 2) * 0.06} className={`border-t border-line ${i % 2 ? "sm:border-l" : ""}`}>
              <Link
                href={g.href}
                className={`group relative flex h-full flex-col py-10 transition-colors duration-[240ms] hover:bg-surface md:py-14 ${i % 2 ? "sm:pl-10 md:pl-14" : "sm:pr-10 md:pr-14"}`}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-display text-lg text-fg/30 tabular-nums transition-colors group-hover:text-gold">{nr(i)}</span>
                  <ServiceIcon name={g.icon} className="h-10 w-10 text-gold md:h-12 md:w-12" />
                </div>
                <h3 className="mt-10 font-display text-display-3 md:mt-16">{t(`goals.${g.key}.title`)}</h3>
                <p className="mt-3 max-w-[44ch] flex-1 text-muted">{t(`goals.${g.key}.text`)}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  {t(`goals.${g.key}.link`)}
                  <ArrowRight className="h-4 w-4 transition-transform duration-[240ms] group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Servicii pe categorii */}
      <Section tone="surface" labelledBy="services-title">
        <SectionHeader
          id="services-title"
          index={2}
          eyebrow={t("servicesEyebrow")}
          title={t("servicesTitle")}
          action={<ButtonLink href={servicesHub} variant="outline">{tc("seeAllServices")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>}
        />
        <div className="divide-y divide-line border-y border-line">
          {SERVICE_CATEGORIES.map((c) => (
            <div key={c} className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-12 md:py-12">
              <div className="lg:col-span-4">
                <h3 className="font-display text-display-3">{tcat(c)}</h3>
                <p className="mt-4 max-w-sm text-muted">{tci(c)}</p>
              </div>
              <ul className="grid gap-x-8 sm:grid-cols-2 lg:col-span-8">
                {services.filter((s) => s.category === c).map((s) => (
                  <li key={s.id}>
                    <Link href={servicePath(locale, s.slug)} className="group flex items-center gap-4 border-b border-line/70 py-4 transition-colors duration-[240ms] hover:text-gold">
                      <ServiceIcon name={s.icon} className="h-5 w-5 shrink-0 text-gold" />
                      <span className="flex-1 font-semibold">{s[locale].name}</span>
                      <ArrowUpRight className="h-4 w-4 text-muted transition-[transform,color] duration-[240ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* De ce noi: titlu fix în stânga, listă editorială în dreapta */}
      <Section labelledBy="why-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader id="why-title" index={3} eyebrow={t("whyEyebrow")} title={t("whyTitle")} className="lg:sticky lg:top-28" />
          </div>
          <ol className="lg:col-span-7">
            {why.map((w, i) => (
              <li key={i} className="grid grid-cols-[3.5rem_1fr] gap-x-6 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-[5rem_1fr] md:py-10">
                <span className="font-display text-4xl text-gold tabular-nums md:text-5xl">{nr(i)}</span>
                <div>
                  <h3 className="text-xl font-bold md:text-2xl">{w.title}</h3>
                  <p className="mt-3 max-w-[56ch] text-muted">{w.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Proces: cronologie (fixată la scroll pe desktop) */}
      <Section labelledBy="process-title" className="border-t border-line">
        <SectionHeader id="process-title" index={4} eyebrow={t("processEyebrow")} title={t("processTitle")} />
        <ProcessSteps steps={process} />
      </Section>

      {/* Portofoliu */}
      <Section labelledBy="portfolio-title" className="border-t border-line">
        <SectionHeader
          id="portfolio-title"
          index={5}
          eyebrow={t("portfolioEyebrow")}
          title={t("portfolioTitle")}
          action={<ButtonLink href={path("portfolio", locale)} variant="outline">{tc("seePortfolio")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>}
        />
        <PortfolioSection items={portfolio} locale={locale} />
      </Section>

      {/* Pachete: rânduri de comparație (cardurile complete sunt pe /pachete) */}
      <Section tone="surface" labelledBy="packages-title">
        <SectionHeader
          id="packages-title"
          index={6}
          eyebrow={t("packagesEyebrow")}
          title={t("packagesTitle")}
          action={<ButtonLink href={path("packages", locale)} variant="outline">{tc("seePackages")} <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>}
        />
        <ul className="border-b border-line">
          {featuredPackages.map(({ group, pkg }) => (
            <li key={pkg.id} className="grid items-center gap-x-8 gap-y-4 border-t border-line py-8 md:grid-cols-12 md:py-10">
              <div className="md:col-span-4">
                <p className="text-sm font-semibold tracking-wide text-muted">{group.title[locale]}</p>
                <h3 className="mt-1 font-display text-display-3">{pkg.name}</h3>
              </div>
              <p className="max-w-[46ch] text-[0.9375rem] text-muted md:col-span-4">{pkg.description[locale]}</p>
              <p className="flex flex-wrap items-baseline gap-x-2 md:col-span-2">
                {pkg.price === null ? (
                  <span className="font-display text-3xl">{tcom("onRequest")}</span>
                ) : (
                  <>
                    {pkg.from && <span className="text-sm text-muted">{tcom("from")}</span>}
                    <span className="font-display text-4xl text-gold tabular-nums">{formatPrice(pkg.price, locale)}</span>
                    <span className="text-sm text-muted">
                      {tcom("currency")}{pkg.period === "luna" ? ` ${tcom("perMonth")}` : ""}
                    </span>
                  </>
                )}
              </p>
              <div className="md:col-span-2 md:text-right">
                <ButtonLink href={waHref(packageWaMessage(locale, group.title[locale], pkg.name))} variant="outline" size="sm" track="whatsapp">
                  <WhatsAppIcon className="h-4 w-4" /> {tc("wantPackage")}
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
        <PackagesDisclaimer text={pk.disclaimer[locale]} />
      </Section>

      {/* Testimoniale și clienți: apar doar când există date reale în content/. */}
      {testimonials.length > 0 && (
        <Section labelledBy="testimonials-title">
          <SectionHeader id="testimonials-title" index={7} eyebrow={t("testimonialsEyebrow")} title={t("testimonialsTitle")} />
          <Testimonials items={testimonials} locale={locale} placeholderLabel={tcom("placeholder")} />
        </Section>
      )}

      {clients.length > 0 && <LogoMarquee items={clients} title={t("clientsTitle")} />}

      {/* FAQ */}
      <Section labelledBy="faq-title" className="border-t border-line">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader id="faq-title" index={testimonials.length > 0 ? 8 : 7} eyebrow={t("faqEyebrow")} title={t("faqTitle")} className="lg:sticky lg:top-28" />
          </div>
          <div className="lg:col-span-8">
            <FAQ items={getFaq().map((f) => ({ q: f.q[locale], a: f.a[locale] }))} />
          </div>
        </div>
      </Section>

      <CTASection locale={locale} />
    </>
  );
}
