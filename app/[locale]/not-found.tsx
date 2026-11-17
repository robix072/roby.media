import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { path } from "@/lib/routes";
import type { Locale } from "@/lib/content/schemas";

export default async function NotFound() {
  const locale = ((await getLocale()) as Locale) ?? "ro";
  const t = await getTranslations({ locale, namespace: "notFound" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "cta" });
  const popular = (["services", "packages", "portfolio", "contact"] as const).map((k) => ({ href: path(k, locale), label: tn(k) }));
  return (
    <section className="relative flex min-h-[90svh] items-center overflow-hidden pt-28 pb-20">
      <div aria-hidden="true" className="viewfinder pointer-events-none absolute inset-0 [--vf-color:rgb(245_245_245_/_0.25)] [--vf-inset:32px] [--vf-size:36px]" />
      <div className="container-x relative">
        <p className="flex items-center gap-3 font-mono text-sm tracking-[0.3em] text-muted">
          <span className="h-2.5 w-2.5 rounded-full bg-gold" /> NO SIGNAL
        </p>
        <p aria-hidden="true" className="mt-6 font-display text-[9rem] leading-none text-gold sm:text-[14rem] md:text-[18rem]">{t("code")}</p>
        <h1 className="mt-2 font-display text-5xl md:text-7xl">{t("title")}</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{t("text")}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={path("home", locale)} size="lg">{tc("backHome")} <ArrowRight className="h-5 w-5" aria-hidden="true" /></ButtonLink>
          <ButtonLink href={path("contact", locale)} variant="outline" size="lg">{tc("quote")}</ButtonLink>
        </div>
        <p className="mt-14 text-sm font-semibold text-muted">{t("popular")}</p>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {popular.map((p) => (
            <li key={p.href}><Link href={p.href} className="text-lg hover:text-gold">{p.label}</Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
