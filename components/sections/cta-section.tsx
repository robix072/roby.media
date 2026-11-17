import { getTranslations } from "next-intl/server";
import { Phone } from "lucide-react";
import { ArrowChip, ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/ui/reveal";
import { telHref, waHref, hasEmail } from "@/lib/links";
import { contactWithService } from "@/lib/routes";
import type { Locale } from "@/lib/content/schemas";
import site from "@/content/site.json";

/** Secțiunea CTA mare de la finalul fiecărei pagini. */
export async function CTASection({
  locale, title, text, whatsapp, serviceId,
}: {
  locale: Locale;
  title?: string;
  text?: string;
  whatsapp?: string;
  serviceId?: string;
}) {
  const t = await getTranslations({ locale, namespace: "cta" });
  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-36" aria-labelledby="cta-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_80%_at_50%_120%,rgba(224,161,0,0.16),transparent_70%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <Reveal className="container-x relative text-center">
        <p className="eyebrow mb-6 justify-center">{t("responseTime")}</p>
        <h2 id="cta-title" className="mx-auto max-w-5xl font-display text-display-1 text-balance">
          {title ?? t("finalTitle")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted text-pretty">{text ?? t("finalText")}</p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <ButtonLink href={telHref} variant="outline" size="lg" track="phone">
            <Phone className="h-5 w-5" aria-hidden="true" /> {t("callNow")}
          </ButtonLink>
          <ButtonLink href={waHref(whatsapp ?? site.whatsapp.defaultMessage[locale])} variant="whatsapp" size="lg" track="whatsapp">
            <WhatsAppIcon className="h-5 w-5" /> {t("whatsapp")}
          </ButtonLink>
          <ButtonLink href={contactWithService(locale, serviceId)} variant="primary" size="lg" track="quote_click">
            {t("quote")} <ArrowChip />
          </ButtonLink>
        </div>
        <p className="mt-8 text-sm text-muted">
          <a href={telHref} className="font-semibold text-fg hover:text-gold" data-track="phone">{site.phone.display}</a>
          {hasEmail && (
            <>
              <span className="mx-3 text-line-strong">/</span>
              <a href={`mailto:${site.email}`} className="hover:text-fg">{site.email}</a>
            </>
          )}
        </p>
      </Reveal>
    </section>
  );
}
