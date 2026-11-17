import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/views/blog-view";
import { initPage } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { blogPath } from "@/lib/routes";
import { getBlogPosts, getBlogPost, getBlogTranslation } from "@/lib/content";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return routing.locales.flatMap((locale) => getBlogPosts(locale).map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await initPage(params);
  const { slug } = await params;
  const post = getBlogPost(locale, slug);
  if (!post) return {};
  const tr = getBlogTranslation(post);
  return buildMetadata({
    locale,
    title: post.title,
    description: post.description,
    kicker: "Blog",
    type: "article",
    publishedTime: post.date,
    image: post.cover,
    paths: { [locale]: blogPath(locale, post.slug), ...(tr ? { [tr.locale]: blogPath(tr.locale, tr.slug) } : {}) },
  });
}

export default async function Page({ params }: Props) {
  const locale = await initPage(params);
  const { slug } = await params;
  const post = getBlogPost(locale, slug);
  if (!post) notFound();
  return <BlogPostView post={post} locale={locale} />;
}
