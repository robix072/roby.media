import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioDetailView } from "@/components/views/portfolio-view";
import { initPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { portfolioPath } from "@/lib/routes";
import { getPortfolio } from "@/lib/content";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getPortfolio().map((p) => ({ locale: "en", slug: p.slug.en }));
}

const find = (slug: string) => getPortfolio().find((p) => p.slug.en === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await initPage(params, "en");
  const { slug } = await params;
  const p = find(slug);
  if (!p) return {};
  return buildMetadata({
    locale,
    title: p.title[locale],
    description: p.excerpt[locale],
    kicker: p.industry[locale],
    image: p.cover || undefined,
    paths: { ro: portfolioPath("ro", p.slug), en: portfolioPath("en", p.slug) },
    // Proiectele placeholder nu se indexează.
    noindex: p.placeholder,
  });
}

export default async function Page({ params }: Props) {
  const locale = await initPage(params, "en");
  const { slug } = await params;
  const p = find(slug);
  if (!p) notFound();
  return <PortfolioDetailView item={p} locale={locale} />;
}
