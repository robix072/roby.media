import Link from "next/link";
import { Phone, FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "@/components/icons";
import { telHref, waHref } from "@/lib/links";
import { contactWithService } from "@/lib/routes";
import type { Locale } from "@/lib/content/schemas";
import site from "@/content/site.json";

/** Butonul WhatsApp flotant (desktop) și bara fixă cu 3 butoane (mobil). */
export async function ConversionBar({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "cta" });
  const wa = waHref(site.whatsapp.defaultMessage[locale]);
  return (
    <>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        data-track="whatsapp"
        aria-label={t("writeWhatsapp")}
        className="group fixed right-5 bottom-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-ink shadow-[0_10px_30px_-10px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-105 md:flex"
      >
        <WhatsAppIcon className="h-7 w-7" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-sm bg-surface-2 px-3 py-2 text-sm font-semibold text-fg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {t("writeWhatsapp")}
        </span>
      </a>

      <nav
        aria-label={t("quote")}
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      >
        <a href={telHref} data-track="phone" className="flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold">
          <Phone className="h-5 w-5 text-gold" aria-hidden="true" />
          {t("call")}
        </a>
        <a href={wa} target="_blank" rel="noopener noreferrer" data-track="whatsapp" className="flex h-16 flex-col items-center justify-center gap-1 border-x border-line text-xs font-semibold">
          <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
          {t("whatsapp")}
        </a>
        <Link href={contactWithService(locale)} data-track="quote_click" className="flex h-16 flex-col items-center justify-center gap-1 bg-gold text-xs font-bold text-ink">
          <FileText className="h-5 w-5" aria-hidden="true" />
          {t("offer")}
        </Link>
      </nav>
    </>
  );
}
