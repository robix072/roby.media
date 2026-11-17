import type { Locale } from "@/lib/content/schemas";

export const formatPrice = (value: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-GB").format(value);

export const formatDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "ro" ? "ro-RO" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
