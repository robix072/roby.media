import { getTranslations } from "next-intl/server";
import { Phone, Mail, Clock, MapPin, Building2 } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { ContactBlock } from "@/components/sections/contact-block";
import { FAQ } from "@/components/sections/faq";
import { WhatsAppIcon } from "@/components/icons";
import { getFaq, getSite } from "@/lib/content";
import type { Locale } from "@/lib/content/schemas";
import { path } from "@/lib/routes";
import { telHref, mailHref, waHref, hasEmail } from "@/lib/links";

export async function ContactView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tf = await getTranslations({ locale, namespace: "footer" });
  const tcom = await getTranslations({ locale, namespace: "common" });
  const site = getSite();
  const a = site.address;

  // Emailul apare ca buton doar după ce e confirmat în content/site.json.
  const channels = [
    { icon: <Phone className="h-6 w-6 text-gold" aria-hidden="true" />, label: t("phone"), value: site.phone.display, href: telHref, track: "phone" },
    { icon: <WhatsAppIcon className="h-6 w-6 text-gold" />, label: t("whatsapp"), value: site.phone.display, href: waHref(site.whatsapp.defaultMessage[locale]), track: "whatsapp" },
    { icon: <Mail className="h-6 w-6 text-gold" aria-hidden="true" />, label: t("email"), value: site.email, href: mailHref, track: "email" },
  ].filter((c) => c.track !== "email" || hasEmail);

  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("contact"), path: path("contact", locale) },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={<p>{t("intro")}</p>}
      />

      <Section size="sm">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="space-y-4 lg:col-span-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                data-track={c.track}
                {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-5 border border-line bg-surface p-5 transition-colors hover:border-gold"
              >
                {c.icon}
                <span>
                  <span className="block text-sm text-muted">{c.label}</span>
                  <span className="block text-lg font-semibold">{c.value}</span>
                </span>
              </a>
            ))}
            <div className="space-y-4 border border-line p-5 text-[0.9375rem]">
              <p className="flex gap-4"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" /><span><span className="block text-sm text-muted">{t("hours")}</span>{site.hours[locale]}</span></p>
              <p className="flex gap-4"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" /><span><span className="block text-sm text-muted">{t("area")}</span>{site.areaServed[locale]}</span></p>
              <p className="flex gap-4">
                <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  <span className="block text-sm text-muted">{t("company")}</span>
                  {site.legalName}
<br />{tf("cui")}: {site.cui} · {tf("regCom")}: {site.regCom}
                  <br />{a.street}, {a.city}, {a.county}
                </span>
              </p>
            </div>
          </aside>

          <div id="formular" className="border border-line bg-surface p-6 md:p-10 lg:col-span-8">
            <h2 className="font-display text-4xl md:text-5xl">{t("formTitle")}</h2>
            <p className="mt-3 mb-8 text-muted">{t("formIntro")}</p>
            <ContactBlock locale={locale} />
          </div>
        </div>
      </Section>

      <Section tone="surface" labelledBy="cfaq">
        <h2 id="cfaq" className="mb-10 font-display text-4xl md:text-5xl">{tcom("faq")}</h2>
        <FAQ items={getFaq().slice(0, 5).map((f) => ({ q: f.q[locale], a: f.a[locale] }))} />
      </Section>
    </>
  );
}
