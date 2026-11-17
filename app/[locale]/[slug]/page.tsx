import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityView } from "@/components/views/city-view";
import { initPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { cityPath } from "@/lib/routes";
import { getCityPages, getCityPageBySlug } from "@/lib/content";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getCityPages().map((p) => ({ locale: "ro", slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await initPage(params, "ro");
  const { slug } = await params;
  const p = getCityPageBySlug(slug);
  if (!p) return {};
  return buildMetadata({
    locale,
    title: p.metaTitle.replace(/\s*\|\s*Roby Media$/, ""),
    description: p.metaDescription,
    kicker: p.cityData.name,
    paths: { ro: cityPath(p.slug) },
    // Paginile necompletate (ready: false) nu se indexează.
    noindex: !p.ready,
  });
}

export default async function Page({ params }: Props) {
  await initPage(params, "ro");
  const { slug } = await params;
  const p = getCityPageBySlug(slug);
  if (!p) notFound();
  return <CityView page={p} />;
}
