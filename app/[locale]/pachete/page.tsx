import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PackagesView } from "@/components/views/packages-view";
import { initPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { STATIC_PATHS } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ro" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await initPage(params, "ro");
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("packagesTitle"), description: t("packagesDescription"), paths: STATIC_PATHS.packages });
}

export default async function Page({ params }: Props) {
  const locale = await initPage(params, "ro");
  return <PackagesView locale={locale} />;
}
