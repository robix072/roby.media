import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutView } from "@/components/views/about-view";
import { initPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { STATIC_PATHS } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await initPage(params, "en");
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("aboutTitle"), description: t("aboutDescription"), paths: STATIC_PATHS.about });
}

export default async function Page({ params }: Props) {
  const locale = await initPage(params, "en");
  return <AboutView locale={locale} />;
}
