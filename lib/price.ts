import type { Locale } from "@/lib/content/schemas";
import { formatPrice } from "./format";

type T = (key: "from" | "currency" | "perMonth" | "onRequest") => string;

/** „de la 1.800 lei”, „de la 900 lei / lună” sau „La cerere”. */
export function priceLabel(value: number | null, unit: string, locale: Locale, t: T) {
  if (value === null) return t("onRequest");
  const base = `${t("from")} ${formatPrice(value, locale)} ${t("currency")}`;
  return unit === "luna" ? `${base} ${t("perMonth")}` : base;
}
