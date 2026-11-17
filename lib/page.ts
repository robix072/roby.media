import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/schemas";

/** Validează limba din URL și activează randarea statică. `only` = pagina există doar într-o limbă. */
export async function initPage(params: Promise<{ locale: string }>, only?: Locale): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale) || (only && locale !== only)) notFound();
  setRequestLocale(locale);
  return locale;
}
