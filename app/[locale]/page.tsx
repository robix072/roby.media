import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HomeView } from "@/components/views/home-view";
import { initPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { STATIC_PATHS } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  const m = buildMetadata({ locale, title: t("homeTitle"), description: t("homeDescription"), paths: STATIC_PATHS.home });
  return { ...m, title: { absolute: `Roby Media | ${t("homeTitle")}` } };
}

export default async function Page({ params }: Props) {
  const locale = await initPage(params);
  return <HomeView locale={locale} />;
}
