import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceView } from "@/components/views/service-view";
import { initPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { servicePath } from "@/lib/routes";
import { getServices, getServiceBySlug } from "@/lib/content";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getServices().map((s) => ({ locale: "ro", slug: s.slug.ro }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await initPage(params, "ro");
  const { slug } = await params;
  const s = getServiceBySlug(locale, slug);
  if (!s) return {};
  return buildMetadata({
    locale,
    title: s[locale].metaTitle,
    description: s[locale].metaDescription,
    kicker: s[locale].name,
    paths: { ro: servicePath("ro", s.slug), en: servicePath("en", s.slug) },
  });
}

export default async function Page({ params }: Props) {
  const locale = await initPage(params, "ro");
  const { slug } = await params;
  const s = getServiceBySlug(locale, slug);
  if (!s) notFound();
  return <ServiceView service={s} locale={locale} />;
}
