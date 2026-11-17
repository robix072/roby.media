import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/ui/reveal";
import { formatPrice, cn } from "@/lib/format";
import { waHref, packageWaMessage } from "@/lib/links";
import type { Locale, PackageItem } from "@/lib/content/schemas";

export async function PackageCard({ pkg, groupTitle, locale }: { pkg: PackageItem; groupTitle: string; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const tc = await getTranslations({ locale, namespace: "cta" });
  return (
    <article
      className={cn(
        "relative flex h-full flex-col border bg-surface p-7 md:p-8",
        pkg.featured ? "border-gold shadow-[0_0_0_1px_var(--color-gold)]" : "border-line",
      )}
    >
      {pkg.featured && (
        <p className="absolute -top-3 left-7 bg-gold px-3 py-1 text-xs font-bold tracking-wider text-ink uppercase">
          {t("mostChosen")}
        </p>
      )}
      <h3 className="font-display text-3xl">{pkg.name}</h3>
      <p className="mt-3 min-h-[3rem] text-[0.9375rem] text-muted">{pkg.description[locale]}</p>
      <p className="mt-6 flex flex-wrap items-baseline gap-x-2 border-y border-line py-5">
        {pkg.price === null ? (
          <span className="font-display text-4xl">{t("onRequest")}</span>
        ) : (
          <>
            {pkg.from && <span className="text-sm text-muted">{t("from")}</span>}
            <span className="font-display text-5xl text-gold">{formatPrice(pkg.price, locale)}</span>
            <span className="text-sm text-muted">
              {t("currency")} {pkg.period === "luna" ? t("perMonth") : ""} <span className="whitespace-nowrap">{t("vatNote")}</span>
            </span>
          </>
        )}
      </p>
      <ul className="mt-6 flex-1 space-y-3 text-[0.9375rem]">
        {pkg.features[locale].map((f) => (
          <li key={f} className="flex gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <ButtonLink
        href={waHref(packageWaMessage(locale, groupTitle, pkg.name))}
        variant={pkg.featured ? "primary" : "outline"}
        className="mt-8 w-full"
        track="whatsapp"
      >
        <WhatsAppIcon className="h-5 w-5" /> {tc("wantPackage")}
      </ButtonLink>
    </article>
  );
}

export async function PackageGrid({
  packages, groupTitle, locale,
}: {
  packages: PackageItem[];
  groupTitle: string;
  locale: Locale;
}) {
  const cols =
    packages.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : packages.length === 3 ? "md:grid-cols-3" : packages.length === 2 ? "md:grid-cols-2 max-w-4xl" : "max-w-md";
  return (
    <div className={cn("grid gap-6 pt-3", cols)}>
      {packages.map((p, i) => (
        <Reveal key={p.id} delay={i * 0.06} className="h-full">
          <PackageCard pkg={p} groupTitle={groupTitle} locale={locale} />
        </Reveal>
      ))}
    </div>
  );
}

export async function PackagesDisclaimer({ text }: { text: string }) {
  return <p className="mt-8 text-sm text-muted">* {text}</p>;
}
