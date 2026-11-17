import { getTranslations } from "next-intl/server";
import { ArrowRight, Plus } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { PackageGrid, PackagesDisclaimer } from "@/components/sections/packages";
import { FAQ } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { getPackages, getService, getFaq } from "@/lib/content";
import type { Locale } from "@/lib/content/schemas";
import { path, servicePath } from "@/lib/routes";
import { waHref } from "@/lib/links";

export async function PackagesView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "packages" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "cta" });
  const tcom = await getTranslations({ locale, namespace: "common" });
  const pk = getPackages();
  const faq = getFaq().slice(1, 7).map((f) => ({ q: f.q[locale], a: f.a[locale] }));

  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("packages"), path: path("packages", locale) },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={<><p>{t("intro")}</p><p className="mt-3 text-base text-muted">* {pk.disclaimer[locale]}</p></>}
      >
        <nav aria-label={t("jump")} className="flex flex-wrap gap-2">
          {pk.groups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="inline-flex h-11 items-center border border-line px-4 text-sm font-semibold transition-colors hover:border-gold hover:text-gold">
              {g.title[locale]}
            </a>
          ))}
        </nav>
      </PageHero>

      {pk.groups.map((g, i) => {
        const svc = getService(g.serviceId);
        return (
          <Section key={g.id} id={g.id} tone={i % 2 ? "surface" : "ink"} labelledBy={`pk-${g.id}`}>
            <SectionHeader
              id={`pk-${g.id}`}
              eyebrow={String(i + 1).padStart(2, "0")}
              title={g.title[locale]}
              intro={<p>{g.intro[locale]}</p>}
              action={svc ? (
                <ButtonLink href={servicePath(locale, svc.slug)} variant="outline">
                  {tc("seeService")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              ) : undefined}
            />
            <PackageGrid packages={g.packages} groupTitle={g.title[locale]} locale={locale} />
            <PackagesDisclaimer text={pk.disclaimer[locale]} />
          </Section>
        );
      })}

      <Section id="extra" labelledBy="extra-title">
        <SectionHeader id="extra-title" title={pk.extras.title[locale]} intro={<p>{pk.extras.intro[locale]}</p>} />
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {pk.extras.items.map((x) => (
            <li key={x.id} className="flex flex-col bg-ink p-6">
              <Plus className="h-6 w-6 text-gold" aria-hidden="true" />
              <h3 className="mt-5 text-lg font-bold">{x.name[locale]}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{x.description[locale]}</p>
              <p className="mt-5 text-sm font-semibold text-gold">{x.price === null ? tcom("onRequest") : `${x.price} ${tcom("currency")}`}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-col items-start gap-5 border border-line bg-surface p-7 md:flex-row md:items-center md:justify-between md:p-9">
          <p className="max-w-2xl text-xl font-semibold">{t("custom")}</p>
          <ButtonLink href={waHref(locale === "ro" ? "Bună ziua, aș dori o ofertă personalizată." : "Hello, I'd like a custom quote.")} track="whatsapp">
            <WhatsAppIcon className="h-5 w-5" /> {tc("writeWhatsapp")}
          </ButtonLink>
        </div>
      </Section>

      <Section tone="surface" labelledBy="pfaq-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeader id="pfaq-title" eyebrow={tcom("faq")} title={t("faqTitle")} />
          </div>
          <div className="lg:col-span-8">
            <FAQ items={faq} />
          </div>
        </div>
      </Section>

      <CTASection locale={locale} />
    </>
  );
}
