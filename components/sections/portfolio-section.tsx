import { getTranslations } from "next-intl/server";
import { PortfolioGrid, type PortfolioCard } from "./portfolio-grid";
import { Cover } from "@/components/ui/media";
import { portfolioPath } from "@/lib/routes";
import { PORTFOLIO_CATEGORIES, type Locale, type PortfolioItem } from "@/lib/content/schemas";

export async function PortfolioSection({
  items, locale, withFilters = false, columns = 3,
}: {
  items: PortfolioItem[];
  locale: Locale;
  withFilters?: boolean;
  columns?: 2 | 3;
}) {
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const cards: PortfolioCard[] = items.map((p) => ({
    key: p.slug.ro,
    href: portfolioPath(locale, p.slug),
    title: p.title[locale],
    client: p.client,
    industry: p.industry[locale],
    category: p.category,
    categoryLabel: t(`filters.${p.category}`),
    excerpt: p.excerpt[locale],
    cover: p.cover,
    previewMp4: p.video?.previewMp4,
    placeholder: p.placeholder,
    site: p.url,
    coverNode: (
      <Cover
        src={p.cover}
        alt={p.title[locale]}
        label={p.industry[locale]}
        className="h-full w-full"
        viewfinder={false}
        browserUrl={p.url}
        grade={Math.max(0, PORTFOLIO_CATEGORIES.indexOf(p.category))}
        sizes={columns === 2 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
      />
    ),
  }));
  const used = new Set(items.map((i) => i.category));
  return (
    <PortfolioGrid
      items={cards}
      columns={columns}
      filters={withFilters ? PORTFOLIO_CATEGORIES.filter((c) => used.has(c)).map((c) => ({ id: c, label: t(`filters.${c}`) })) : undefined}
      allLabel={t("filters.all")}
      filterLabel={t("filterLabel")}
      emptyLabel={t("empty")}
      placeholderLabel={tc("placeholder")}
    />
  );
}
