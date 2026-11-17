/** Link-uri de contact (telefon, WhatsApp, email). */
import site from "@/content/site.json";

/** Valoare neconfirmată din content/site.json: goală sau între paranteze drepte, ex. „[CUI]”. */
export const isHolder = (v: string) => !v || v.startsWith("[");

export const telHref = `tel:${site.phone.e164}`;
export const mailHref = `mailto:${site.email}`;
/** false cât timp emailul e încă „[email]”: nu facem link mailto: către el. */
export const hasEmail = !isHolder(site.email);

export function waHref(message?: string) {
  const text = message ?? site.whatsapp.defaultMessage.ro;
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export function packageWaMessage(locale: "ro" | "en", group: string, pkg: string) {
  return locale === "ro"
    ? `Bună ziua, vreau pachetul ${pkg} (${group}). Îmi puteți trimite mai multe detalii?`
    : `Hello, I'm interested in the ${pkg} package (${group}). Could you send me more details?`;
}
