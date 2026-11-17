import { getTranslations } from "next-intl/server";
import { getServices } from "@/lib/content";
import { SERVICE_CATEGORIES, type Locale } from "@/lib/content/schemas";
import { path, servicePath, contactWithService } from "@/lib/routes";
import { telHref } from "@/lib/links";
import site from "@/content/site.json";
import { Logo } from "./logo";
import { HeaderClient, type MenuCategory } from "./header-client";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tc = await getTranslations({ locale, namespace: "categories" });
  const ti = await getTranslations({ locale, namespace: "categoryIntro" });
  const tcta = await getTranslations({ locale, namespace: "cta" });
  const services = getServices();
  const categories: MenuCategory[] = SERVICE_CATEGORIES.map((c) => ({
    id: c,
    title: tc(c),
    intro: ti(c),
    services: services
      .filter((s) => s.category === c)
      .map((s) => ({ id: s.id, name: s[locale].name, href: servicePath(locale, s.slug), icon: s.icon })),
  }));
  return (
    <HeaderClient
      logo={<Logo />}
      locale={locale}
      homeHref={path("home", locale)}
      servicesHref={path("services", locale)}
      categories={categories}
      links={[
        { href: path("packages", locale), label: t("packages") },
        { href: path("portfolio", locale), label: t("portfolio") },
        { href: path("about", locale), label: t("about") },
        { href: path("blog", locale), label: t("blog") },
        { href: path("contact", locale), label: t("contact") },
      ]}
      labels={{
        services: t("services"), allServices: t("allServices"), quote: tcta("quote"), menu: t("menu"),
        openMenu: t("openMenu"), closeMenu: t("closeMenu"), switchTo: t("switchTo"), switchToShort: t("switchToShort"),
        language: t("language"), call: tcta("call"),
      }}
      quoteHref={contactWithService(locale)}
      telHref={telHref}
      phoneDisplay={site.phone.display}
    />
  );
}
