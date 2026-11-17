import { getTranslations } from "next-intl/server";
import { ArrowUpRight, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Cover } from "@/components/ui/media";
import { SitePreview } from "@/components/ui/site-preview";
import { LiteVideo } from "@/components/ui/lite-video";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { CTASection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { BehanceIcon, DriveIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/ui/json-ld";
import { getPortfolio, getService, getSite } from "@/lib/content";
import type { Locale, PortfolioItem } from "@/lib/content/schemas";
import { path, portfolioPath, servicePath } from "@/lib/routes";
import { waHref, isHolder } from "@/lib/links";
import { videoLd } from "@/lib/seo";

const isPhone = (s?: string) => !!s?.includes("-mobile");

/** Coloane (din 12) per captură: telefon 4, desktopul de lângă el 8, restul 6+6. */
function gallerySpans(gallery: string[]) {
  let used = 0;
  return gallery.map((g, i) => {
    const span = isPhone(g) ? 4 : (used === 0 && isPhone(gallery[i + 1])) || used === 4 ? 8 : 6;
    used = (used + span) % 12;
    return span;
  });
}

async function MoreWork({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const tc = await getTranslations({ locale, namespace: "common" });
  // Doar link-urile confirmate (url completat în content/site.json).
  const links = getSite().moreWork.filter((w) => !isHolder(w.url));
  if (links.length === 0) return null;
  return (
    <Section tone="surface" labelledBy="more-title">
      <SectionHeader id="more-title" title={t("moreTitle")} intro={<p>{t("moreIntro")}</p>} />
      <ul className="grid gap-6 md:grid-cols-2">
        {links.map((w, i) => {
          const Icon = w.kind === "behance" ? BehanceIcon : DriveIcon;
          return (
            <Reveal as="li" key={w.id} delay={i * 0.08}>
              <a href={w.url} target="_blank" rel="noopener noreferrer" className="group block border border-line bg-ink transition-colors hover:border-gold">
                {w.cover && <Cover src={w.cover} alt={w.title[locale]} label={w.kind === "behance" ? "Behance" : "Google Drive"} className="aspect-[16/9]" sizes="(min-width: 768px) 50vw, 100vw" />}
                <div className="flex items-start justify-between gap-6 p-7 md:p-8">
                  <div>
                    <p className="flex items-center gap-3 font-display text-3xl">
                      <Icon className="h-6 w-6 text-gold" /> {w.title[locale]}
                    </p>
                    <p className="mt-3 text-muted">{w.description[locale]}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-gold">
                      {w.kind === "behance" ? t("behanceCta") : t("driveCta")}
                      <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                      <span className="sr-only">{tc("openInNewTab")}</span>
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

export async function PortfolioView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("portfolio"), path: path("portfolio", locale) },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={<p>{t("intro")}</p>}
      />
      <Section size="sm">
        <PortfolioSection items={getPortfolio()} locale={locale} withFilters />
      </Section>
      <MoreWork locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}

export async function PortfolioDetailView({ item, locale }: { item: PortfolioItem; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const tcta = await getTranslations({ locale, namespace: "cta" });
  const href = portfolioPath(locale, item.slug);
  const others = getPortfolio().filter((p) => p.slug.ro !== item.slug.ro && p.category === item.category).concat(
    getPortfolio().filter((p) => p.slug.ro !== item.slug.ro && p.category !== item.category),
  ).slice(0, 3);
  const services = item.services.map((id) => getService(id)).filter(Boolean);
  const wa = locale === "ro"
    ? `Bună ziua, am văzut proiectul „${item.title.ro}” și aș dori ceva similar.`
    : `Hello, I saw the "${item.title.en}" project and I'd like something similar.`;

  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("portfolio"), path: path("portfolio", locale) },
          { name: item.title[locale], path: href },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={t(`filters.${item.category}`)}
        title={item.title[locale]}
        intro={<p>{item.excerpt[locale]}</p>}
      >
        <ButtonLink href={waHref(wa)} size="lg" track="whatsapp"><WhatsAppIcon className="h-5 w-5" /> {tcta("similar")}</ButtonLink>
        {item.url && (
          <ButtonLink href={item.url} variant="outline" size="lg">
            {tc("visitSite")} <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </ButtonLink>
        )}
      </PageHero>

      <Section size="sm">
        {item.placeholder && (
          <p className="mb-6 inline-block border border-gold/60 px-3 py-1 text-xs font-bold tracking-wider text-gold uppercase">{tc("placeholder")}</p>
        )}
        {item.video ? (
          <LiteVideo provider={item.video.provider} id={item.video.id} title={item.title[locale]} playLabel={tc("play")} soonLabel={tc("videoSoon")} poster={item.cover || undefined} />
        ) : item.url && item.embed ? (
          <SitePreview url={item.url} cover={item.cover} alt={item.title[locale]} label={tc("livePreview")} hint={tc("livePreviewHint")} />
        ) : (
          <Cover src={item.cover} alt={item.title[locale]} label={item.industry[locale]} className={item.url ? "aspect-[16/10]" : "aspect-video"} sizes="100vw" priority browserUrl={item.url} />
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <dl className="grid grid-cols-2 gap-6 self-start border-t border-line pt-6 lg:col-span-4 lg:grid-cols-1">
            <div><dt className="text-sm text-muted">{tc("client")}</dt><dd className="mt-1 font-semibold">{item.client}</dd></div>
            <div><dt className="text-sm text-muted">{tc("industry")}</dt><dd className="mt-1 font-semibold">{item.industry[locale]}</dd></div>
            <div><dt className="text-sm text-muted">{tc("year")}</dt><dd className="mt-1 font-semibold">{item.year}</dd></div>
            {services.length > 0 && (
              <div className="col-span-2 lg:col-span-1">
                <dt className="text-sm text-muted">{tn("services")}</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {services.map((s) => (
                    <Link key={s!.id} href={servicePath(locale, s!.slug)} className="border border-line px-3 py-1.5 text-sm hover:border-gold hover:text-gold">{s![locale].name}</Link>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          <div className="space-y-12 lg:col-span-8">
            <div>
              <h2 className="font-display text-4xl">{tc("challenge")}</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">{item.challenge[locale]}</p>
            </div>
            <div>
              <h2 className="font-display text-4xl">{tc("whatWeDid")}</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {item.whatWeDid[locale].map((w) => (
                  <li key={w} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />{w}</li>
                ))}
              </ul>
            </div>
            {item.result && (
              <div className="border-l-2 border-gold pl-6">
                <h2 className="font-display text-4xl">{tc("result")}</h2>
                <p className="mt-4 text-lg leading-relaxed">{item.result[locale]}</p>
              </div>
            )}
          </div>
        </div>

        {item.gallery.length > 0 && item.url ? (
          // Site-uri: capturi în ferestre de browser; cele „-mobile” într-un cadru de telefon.
          <ul className="mt-16 grid items-center gap-6 lg:grid-cols-12">
            {item.gallery.map((g, i) => {
              const alt = `${item.title[locale]} – ${i + 1}`;
              if (isPhone(g)) {
                return (
                  <li key={g} className="mx-auto w-full max-w-[17rem] lg:col-span-4">
                    <div className="rounded-[2.25rem] border border-line-strong bg-surface-2 p-2.5 shadow-[0_30px_80px_-30px_rgb(224_161_0_/_0.25)]">
                      <div className="relative aspect-[600/1298] overflow-hidden rounded-[1.75rem] bg-ink">
                        <Image src={g} alt={alt} fill sizes="272px" className="object-cover object-top" />
                      </div>
                    </div>
                  </li>
                );
              }
              const wide = gallerySpans(item.gallery)[i] === 8;
              return (
                <li key={g} className={wide ? "lg:col-span-8" : "lg:col-span-6"}>
                  <Cover src={g} alt={alt} browserUrl={item.url} className="aspect-[16/10]" sizes={wide ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 50vw, 100vw"} />
                </li>
              );
            })}
          </ul>
        ) : item.gallery.length > 0 ? (
          <ul className="mt-16 grid gap-4 sm:grid-cols-2">
            {item.gallery.map((g, i) => (
              <li key={g}><Cover src={g} alt={`${item.title[locale]} – ${i + 1}`} className="aspect-[4/3]" sizes="(min-width: 640px) 50vw, 100vw" /></li>
            ))}
          </ul>
        ) : null}

        <Link href={path("portfolio", locale)} className="mt-16 inline-flex items-center gap-2 font-semibold hover:text-gold">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t("back")}
        </Link>
      </Section>

      {others.length > 0 && (
        <Section tone="surface" labelledBy="others-title">
          <SectionHeader id="others-title" title={t("otherProjects")} />
          <PortfolioSection items={others} locale={locale} />
        </Section>
      )}

      <CTASection locale={locale} whatsapp={wa} />
      {item.video && (
        <JsonLd data={videoLd({ name: item.title[locale], description: item.excerpt[locale], provider: item.video.provider, id: item.video.id, uploadDate: item.video.uploadDate, duration: item.video.durationIso })} />
      )}
    </>
  );
}
