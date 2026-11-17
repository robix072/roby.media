import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BlogIndexView } from "@/components/views/blog-view";
import { initPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { STATIC_PATHS } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await initPage(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, title: t("blogTitle"), description: t("blogDescription"), paths: STATIC_PATHS.blog });
}

export default async function Page({ params }: Props) {
  const locale = await initPage(params);
  return <BlogIndexView locale={locale} />;
}
