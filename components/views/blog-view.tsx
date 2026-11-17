import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { Markdown } from "@/components/ui/markdown";
import { ServiceCard } from "@/components/sections/service-card";
import { CTASection } from "@/components/sections/cta-section";
import { JsonLd } from "@/components/ui/json-ld";
import { getBlogPosts, getService, type BlogPost } from "@/lib/content";
import type { Locale, Service } from "@/lib/content/schemas";
import { path, blogPath, servicePath } from "@/lib/routes";
import { formatDate } from "@/lib/format";
import { articleLd } from "@/lib/seo";
import { priceLabel } from "@/lib/price";

export async function BlogIndexView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "cta" });
  const tcom = await getTranslations({ locale, namespace: "common" });
  const posts = getBlogPosts(locale);
  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("blog"), path: path("blog", locale) },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={<p>{t("intro")}</p>}
      />
      <Section size="sm">
        {posts.length === 0 ? (
          <p className="text-muted">{t("empty")}</p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={blogPath(locale, p.slug)} className="group grid gap-4 py-10 md:grid-cols-12 md:gap-10">
                  <p className="text-sm text-muted md:col-span-3">
                    {formatDate(p.date, locale)}
                    {p.readingMinutes ? <><br />{p.readingMinutes} {tcom("minutes")}</> : null}
                  </p>
                  <div className="md:col-span-9">
                    <h2 className="font-display text-3xl transition-colors group-hover:text-gold md:text-5xl">{p.title}</h2>
                    <p className="mt-4 max-w-3xl text-lg text-muted">{p.description}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-gold">
                      {tc("readMore")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
      <CTASection locale={locale} />
    </>
  );
}

export async function BlogPostView({ post, locale }: { post: BlogPost; locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tcom = await getTranslations({ locale, namespace: "common" });
  const href = blogPath(locale, post.slug);
  const related = post.relatedServices.map((id) => getService(id)).filter((s): s is Service => !!s);
  const others = getBlogPosts(locale).filter((p) => p.slug !== post.slug).slice(0, 2);
  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("blog"), path: path("blog", locale) },
          { name: post.title, path: href },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={`${formatDate(post.date, locale)}${post.readingMinutes ? ` · ${post.readingMinutes} ${tcom("minutes")}` : ""}`}
        title={post.title}
        intro={<p>{post.description}</p>}
      />
      <Section size="sm">
        <div className="grid gap-14 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <Markdown source={post.body} />
            <p className="mt-12 text-sm text-muted">{post.author}{post.updated ? ` · ${tcom("updated")}: ${formatDate(post.updated, locale)}` : ""}</p>
            <Link href={path("blog", locale)} className="mt-10 inline-flex items-center gap-2 font-semibold hover:text-gold">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {t("back")}
            </Link>
          </article>
          {related.length > 0 && (
            <aside className="lg:col-span-4">
              <div className="space-y-4 lg:sticky lg:top-28">
                <p className="font-display text-2xl">{t("relatedServices")}</p>
                {related.map((s) => (
                  <ServiceCard
                    key={s.id}
                    href={servicePath(locale, s.slug)}
                    name={s[locale].name}
                    description={s[locale].cardDescription}
                    icon={s.icon}
                    priceLabel={priceLabel(s.priceFrom, s.priceUnit, locale, (k) => tcom(k))}
                  />
                ))}
              </div>
            </aside>
          )}
        </div>
      </Section>
      {others.length > 0 && (
        <Section tone="surface" size="sm">
          <h2 className="mb-8 font-display text-3xl">{tcom("relatedArticles")}</h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={blogPath(locale, p.slug)} className="group block h-full border border-line bg-ink p-7 hover:border-line-strong">
                  <h3 className="font-display text-2xl group-hover:text-gold md:text-3xl">{p.title}</h3>
                  <p className="mt-3 text-muted">{p.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <CTASection locale={locale} serviceId={post.relatedServices[0]} />
      <JsonLd data={articleLd({ title: post.title, description: post.description, path: href, date: post.date, updated: post.updated, author: post.author, locale })} />
    </>
  );
}
