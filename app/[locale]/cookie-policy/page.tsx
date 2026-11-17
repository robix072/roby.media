import type { Metadata } from "next";
import { LegalView } from "@/components/views/legal-view";
import { initPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { STATIC_PATHS } from "@/lib/routes";
import { getLegal, getSite } from "@/lib/content";

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await initPage(params, "en");
  const doc = getLegal("cookies", locale);
  const title = doc?.title ?? "cookies";
  return buildMetadata({ locale, title, description: `${title} – ${getSite().legalName} (${getSite().domain}).`, paths: STATIC_PATHS.cookies });
}

export default async function Page({ params }: Props) {
  const locale = await initPage(params, "en");
  return <LegalView doc="cookies" locale={locale} />;
}
