import { getTranslations } from "next-intl/server";
import { Phone } from "lucide-react";
import { ArrowChip, ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { HeroVideo, ViewfinderHud } from "./hero-media";
import { HeroCamera } from "./hero-camera";
import { HeroScene } from "@/components/motion/hero-scene";
import { telHref, waHref } from "@/lib/links";
import { contactWithService } from "@/lib/routes";
import type { Locale } from "@/lib/content/schemas";
import site from "@/content/site.json";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tc = await getTranslations({ locale, namespace: "cta" });
  const { mp4, webm, poster } = site.showreel;
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink pt-28 pb-16 md:pb-24"
      aria-labelledby="hero-title"
    >
      <div data-hero-bg className="absolute inset-0 -z-10">
        {mp4 ? (
          <HeroVideo mp4={mp4} webm={webm} poster={poster} />
        ) : (
          /* Cadru provizoriu până la showreel: lumină caldă, linii de compoziție, o bandă de lumină lentă. */
          <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_72%_28%,#2a1f0b_0%,#151412_42%,#0b0a09_100%)]">
            <div className="absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_3px)]" />
            <div className="hero-sweep absolute inset-0" />
            {/* Linii de compoziție (regula treimilor) */}
            <div className="absolute inset-y-0 left-1/3 w-px bg-fg/[0.06]" />
            <div className="absolute inset-y-0 left-2/3 w-px bg-fg/[0.06]" />
            <div className="absolute inset-x-0 top-1/3 h-px bg-fg/[0.06]" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-fg/[0.06]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
        <HeroCamera />
        <div
          data-hero-vf
          className="viewfinder absolute inset-0 [--vf-color:rgb(245_243_239_/_0.35)] [--vf-inset:80px_16px_88px] [--vf-size:24px] md:[--vf-inset:104px_40px_40px] md:[--vf-size:40px]"
        />
        <ViewfinderHud />
      </div>

      {/* Bare de cinema care se închid la scroll (animate de HeroScene). */}
      <div aria-hidden="true" data-bar="top" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[14vh] origin-top scale-y-0 bg-ink" />
      <div aria-hidden="true" data-bar="bottom" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[14vh] origin-bottom scale-y-0 bg-ink" />

      <div data-hero-content className="container-x">
        <p className="eyebrow mb-6" data-hero-fade>{t("eyebrow")}</p>
        <h1 id="hero-title" className="max-w-[18ch] font-display text-display-1">
          <span className="block overflow-hidden pb-[0.06em]"><span data-hero-line className="block">{t("heroTitle1")}</span></span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">
              {t("heroTitle2")} <span className="text-gold">{t("heroTitleAccent")}</span>
            </span>
          </span>
        </h1>
        <p data-hero-fade className="mt-6 max-w-[56ch] text-lg text-fg/80 text-pretty md:mt-8 md:text-xl">{t("heroText")}</p>
        <div data-hero-fade className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
          <ButtonLink href={contactWithService(locale)} size="lg" track="quote_click">
            {tc("quote")} <ArrowChip />
          </ButtonLink>
          <ButtonLink href={waHref(site.whatsapp.defaultMessage[locale])} variant="whatsapp" size="lg" track="whatsapp">
            <WhatsAppIcon className="h-5 w-5" /> {tc("whatsapp")}
          </ButtonLink>
          <ButtonLink href={telHref} variant="ghost" size="lg" className="hidden sm:inline-flex" track="phone">
            <Phone className="h-5 w-5 text-gold" aria-hidden="true" /> <span className="tabular-nums">{site.phone.display}</span>
          </ButtonLink>
        </div>
      </div>
      <HeroScene />
    </section>
  );
}
