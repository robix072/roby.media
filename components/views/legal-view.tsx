import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { Markdown } from "@/components/ui/markdown";
import { getLegal, type LegalDoc } from "@/lib/content";
import type { Locale } from "@/lib/content/schemas";
import { path } from "@/lib/routes";
import { formatDate } from "@/lib/format";

const PAGE: Record<LegalDoc, "privacy" | "cookies" | "terms"> = { privacy: "privacy", cookies: "cookies", terms: "terms" };

export async function LegalView({ doc, locale }: { doc: LegalDoc; locale: Locale }) {
  const legal = getLegal(doc, locale);
  if (!legal) notFound();
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tl = await getTranslations({ locale, namespace: "legal" });
  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: legal.title, path: path(PAGE[doc], locale) },
        ]}
        crumbLabel={tn("breadcrumb")}
        title={legal.title}
        intro={legal.updated ? <p className="text-base text-muted">{tl("updated")}: {formatDate(legal.updated, locale)}</p> : undefined}
      />
      <Section size="sm">
        <div className="max-w-3xl">
          <Markdown source={legal.body} />
        </div>
      </Section>
    </>
  );
}
