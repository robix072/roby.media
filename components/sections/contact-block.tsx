import { getTranslations } from "next-intl/server";
import { ContactForm } from "./contact-form";
import { getServices } from "@/lib/content";
import { SERVICE_CATEGORIES, type Locale } from "@/lib/content/schemas";
import { path } from "@/lib/routes";
import site from "@/content/site.json";

export async function ContactBlock({ locale, defaultService }: { locale: Locale; defaultService?: string }) {
  const tc = await getTranslations({ locale, namespace: "categories" });
  const order = Object.fromEntries(SERVICE_CATEGORIES.map((c, i) => [c, i]));
  const services = getServices()
    .slice()
    .sort((a, b) => order[a.category] - order[b.category] || a.order - b.order)
    .map((s) => ({ id: s.id, name: s[locale].name, group: tc(s.category) }));
  return (
    <ContactForm
      services={services}
      locale={locale}
      privacyHref={path("privacy", locale)}
      whatsappNumber={site.whatsapp.number}
      defaultService={defaultService}
    />
  );
}
