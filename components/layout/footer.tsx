import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { getServices } from "@/lib/content";
import { SERVICE_CATEGORIES, type Locale } from "@/lib/content/schemas";
import { path, servicePath } from "@/lib/routes";
import { telHref, mailHref, waHref, hasEmail, isHolder } from "@/lib/links";
import { TikTokIcon, InstagramIcon, FacebookIcon, YouTubeIcon, LinkedInIcon, BehanceIcon, WhatsAppIcon } from "@/components/icons";
import site from "@/content/site.json";
import { Logo } from "./logo";
import { CookieSettingsLink } from "./cookie-consent";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "categories" });
  const services = getServices();
  const year = new Date().getFullYear();
  const socials = [
    { href: site.social.tiktok, label: "TikTok", Icon: TikTokIcon },
    { href: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: site.social.youtube, label: "YouTube", Icon: YouTubeIcon },
    { href: site.social.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: site.social.behance, label: "Behance", Icon: BehanceIcon },
  ].filter((s) => !isHolder(s.href));

  return (
    <footer className="border-t border-line bg-ink pb-24 md:pb-0">
      <div className="container-x grid gap-12 py-16 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo size="lg" />
          <p className="mt-6 max-w-sm text-muted">{t("tagline")}</p>
          <ul className="mt-8 space-y-3 text-[0.9375rem]">
            <li>
              <a href={telHref} data-track="phone" className="inline-flex items-center gap-3 hover:text-gold">
                <Phone className="h-4 w-4 text-gold" aria-hidden="true" /> {site.phone.display}
              </a>
            </li>
            <li>
              <a href={waHref(site.whatsapp.defaultMessage[locale])} target="_blank" rel="noopener noreferrer" data-track="whatsapp" className="inline-flex items-center gap-3 hover:text-gold">
                <WhatsAppIcon className="h-4 w-4 text-gold" /> WhatsApp
              </a>
            </li>
            <li>
              {hasEmail ? (
                <a href={mailHref} data-track="email" className="inline-flex items-center gap-3 hover:text-gold">
                  <Mail className="h-4 w-4 text-gold" aria-hidden="true" /> {site.email}
                </a>
              ) : (
                <span className="inline-flex items-center gap-3 text-muted"><Mail className="h-4 w-4 text-gold" aria-hidden="true" /> {site.email}</span>
              )}
            </li>
            <li className="inline-flex items-center gap-3 text-muted">
              <Clock className="h-4 w-4 text-gold" aria-hidden="true" /> {site.hours[locale]}
            </li>
            <li className="flex items-center gap-3 text-muted">
              <MapPin className="h-4 w-4 text-gold" aria-hidden="true" /> {site.areaServed[locale]}
            </li>
          </ul>
          <p className="mt-8 mb-3 text-sm font-semibold">{t("follow")}</p>
          <ul className="flex flex-wrap gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center border border-line text-muted transition-colors hover:border-gold hover:text-gold">
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
          {SERVICE_CATEGORIES.slice(0, 3).map((c) => (
            <div key={c}>
              <p className="mb-4 font-display text-lg text-gold">{tc(c)}</p>
              <ul className="space-y-2 text-sm text-muted">
                {services.filter((s) => s.category === c).map((s) => (
                  <li key={s.id}>
                    <Link href={servicePath(locale, s.slug)} className="hover:text-fg">{s[locale].name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="mb-4 font-display text-lg text-gold">{tc("web")}</p>
            <ul className="space-y-2 text-sm text-muted">
              {services.filter((s) => s.category === "web").map((s) => (
                <li key={s.id}>
                  <Link href={servicePath(locale, s.slug)} className="hover:text-fg">{s[locale].name}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 mb-4 font-display text-lg text-gold">{t("company")}</p>
            <ul className="space-y-2 text-sm text-muted">
              {(["packages", "portfolio", "about", "blog", "areas", "contact"] as const).map((k) => (
                <li key={k}>
                  <Link href={path(k, locale)} className="hover:text-fg">{tn(k)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-6 py-8 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p>© {year} {site.legalName}. {t("rights")}</p>
            <p>{t("cui")}: {site.cui} · {t("regCom")}: {site.regCom}</p>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href={path("privacy", locale)} className="hover:text-fg">{t("privacy")}</Link></li>
            <li><Link href={path("cookies", locale)} className="hover:text-fg">{t("cookies")}</Link></li>
            <li><Link href={path("terms", locale)} className="hover:text-fg">{t("terms")}</Link></li>
            <li><CookieSettingsLink label={t("cookieSettings")} /></li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <a href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer nofollow" title={t("anpcSal")} className="block"><span className="sr-only">{t("anpcSal")}</span>
              {/* Bannere conforme cu Ordinul ANPC 449/2022 (250×50). Puteți înlocui cu imaginile oficiale ANPC. */}
              <svg viewBox="0 0 250 50" className="h-[50px] w-[250px]" aria-hidden="true">
                <rect width="250" height="50" rx="4" fill="#F5F5F5" />
                <text x="12" y="22" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700" fill="#0A0A0A">ANPC · SAL</text>
                <text x="12" y="39" fontFamily="Arial, sans-serif" fontSize="10.5" fill="#333">Soluționarea alternativă a litigiilor</text>
              </svg>
            </a>
            <a href="https://consumer-redress.ec.europa.eu/" target="_blank" rel="noopener noreferrer nofollow" title={t("sol")} className="block"><span className="sr-only">{t("sol")}</span>
              <svg viewBox="0 0 250 50" className="h-[50px] w-[250px]" aria-hidden="true">
                <rect width="250" height="50" rx="4" fill="#F5F5F5" />
                <text x="12" y="22" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700" fill="#0A0A0A">SOL</text>
                <text x="12" y="39" fontFamily="Arial, sans-serif" fontSize="10.5" fill="#333">Soluționarea online a litigiilor</text>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
