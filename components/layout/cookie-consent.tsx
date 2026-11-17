"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useTranslations } from "next-intl";
import { readConsent, writeConsent, track, type Consent, type ConversionEvent } from "@/lib/analytics";
import { buttonClass } from "@/components/ui/button";

const GA = process.env.NEXT_PUBLIC_GA4_ID;
const META = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TIKTOK = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

/** Link din footer care redeschide setările de cookie-uri. */
export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button type="button" className="hover:text-fg" onClick={() => window.dispatchEvent(new Event("roby:cookie-settings"))}>
      {label}
    </button>
  );
}

export function CookieConsent({ policyHref }: { policyHref: string }) {
  const t = useTranslations("cookies");
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const c = readConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- citim localStorage doar pe client
    setConsent(c);
    if (!c) setOpen(true);
    const onSettings = () => {
      const cur = readConsent();
      setAnalytics(!!cur?.analytics);
      setMarketing(!!cur?.marketing);
      setCustom(true);
      setOpen(true);
    };
    const onConsent = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener("roby:cookie-settings", onSettings);
    window.addEventListener("roby:consent", onConsent);
    return () => {
      window.removeEventListener("roby:cookie-settings", onSettings);
      window.removeEventListener("roby:consent", onConsent);
    };
  }, []);

  // Evenimente de conversie pe click: telefon, WhatsApp, email, butoane „Cere ofertă”.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLElement>("a,button");
      if (!a) return;
      const explicit = a.dataset.track as ConversionEvent | undefined;
      const href = a.getAttribute("href") ?? "";
      const ev: ConversionEvent | undefined =
        explicit ?? (href.startsWith("tel:") ? "phone" : href.includes("wa.me/") ? "whatsapp" : href.startsWith("mailto:") ? "email" : undefined);
      if (ev && ev !== "lead") track(ev);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  const save = (c: { analytics: boolean; marketing: boolean }) => {
    const hadMore = (consent?.analytics && !c.analytics) || (consent?.marketing && !c.marketing);
    writeConsent(c);
    setOpen(false);
    setCustom(false);
    // Retragerea acordului: reîncărcăm ca scripturile deja încărcate să dispară.
    if (hadMore) window.location.reload();
  };

  return (
    <>
      {consent?.analytics && GA ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}
      {consent?.marketing && META ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META}');fbq('track','PageView');`}
        </Script>
      ) : null}
      {consent?.marketing && TIKTOK ? (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=r+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${TIKTOK}');ttq.page();}(window,document,'ttq');`}
        </Script>
      ) : null}

      <AnimatePresence>
        {open && (
          <m.div
            role="dialog"
            aria-modal="false"
            aria-labelledby="cookie-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-2 bottom-[4.5rem] z-[55] mx-auto max-h-[70svh] max-w-xl overflow-y-auto border border-line-strong bg-surface p-4 shadow-2xl md:bottom-6 md:left-6 md:right-auto md:mx-0 md:p-6"
          >
            <p id="cookie-title" className="font-display text-xl md:text-2xl">{t("title")}</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted md:mt-3 md:text-sm">
              {t("text")}{" "}
              <Link href={policyHref} className="text-fg underline underline-offset-2 hover:text-gold">{t("policy")}</Link>
            </p>
            {custom && (
              <fieldset className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
                <legend className="sr-only">{t("customize")}</legend>
                <label className="flex items-start gap-3 opacity-80">
                  <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-[#E0A100]" />
                  <span><strong className="block text-fg">{t("necessary")}</strong>{t("necessaryText")}</span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 h-4 w-4 accent-[#E0A100]" />
                  <span><strong className="block text-fg">{t("analytics")}</strong><span className="text-muted">{t("analyticsText")}</span></span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 h-4 w-4 accent-[#E0A100]" />
                  <span><strong className="block text-fg">{t("marketing")}</strong><span className="text-muted">{t("marketingText")}</span></span>
                </label>
              </fieldset>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap md:mt-5">
              <button type="button" className={buttonClass("primary", "sm")} onClick={() => save({ analytics: true, marketing: true })}>
                {t("acceptAll")}
              </button>
              <button type="button" className={buttonClass("outline", "sm")} onClick={() => save({ analytics: false, marketing: false })}>
                {t("rejectAll")}
              </button>
              {custom ? (
                <button type="button" className={buttonClass("ghost", "sm", "col-span-2 sm:col-span-1")} onClick={() => save({ analytics, marketing })}>
                  {t("save")}
                </button>
              ) : (
                <button type="button" className={buttonClass("ghost", "sm", "col-span-2 sm:col-span-1")} onClick={() => setCustom(true)}>
                  {t("customize")}
                </button>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
