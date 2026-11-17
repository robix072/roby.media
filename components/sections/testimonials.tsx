import { Star } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/lib/content/schemas";

type T = {
  placeholder: boolean; name: string; company: string; role: { ro: string; en: string };
  quote: { ro: string; en: string }; rating?: number;
};

function q(text: string, locale: Locale) {
  return locale === "ro" ? `„${text}”` : `“${text}”`;
}

function Byline({ t, locale, placeholderLabel }: { t: T; locale: Locale; placeholderLabel: string }) {
  return (
    <footer className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
      <div>
        <p className="font-semibold">{t.name}</p>
        <p className="text-sm text-muted">{t.role[locale]} · {t.company}</p>
      </div>
      {t.rating ? (
        <p className="flex gap-0.5" role="img" aria-label={`${t.rating}/5`}>
          {Array.from({ length: t.rating }).map((_, k) => (
            <Star key={k} className="h-4 w-4 text-gold" fill="currentColor" aria-hidden="true" />
          ))}
        </p>
      ) : null}
      {t.placeholder && (
        <span className="border border-gold/60 px-2 py-0.5 text-[0.6875rem] font-bold tracking-wider text-gold uppercase">{placeholderLabel}</span>
      )}
    </footer>
  );
}

/** Un citat mare, apoi restul într-o listă discretă. */
export function Testimonials({ items, locale, placeholderLabel }: { items: T[]; locale: Locale; placeholderLabel: string }) {
  if (items.length === 0) return null;
  const [lead, ...rest] = items;
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
      <Reveal as="article" className="lg:col-span-7">
        <blockquote className="font-display text-display-3 leading-[1.2] text-fg text-balance">{q(lead.quote[locale], locale)}</blockquote>
        <Byline t={lead} locale={locale} placeholderLabel={placeholderLabel} />
      </Reveal>
      {rest.length > 0 && (
        <ul className="divide-y divide-line border-y border-line lg:col-span-5">
          {rest.map((t, i) => (
            <li key={i} className="py-7">
              <blockquote className="text-[1.0625rem] leading-relaxed text-fg/85 text-pretty">{q(t.quote[locale], locale)}</blockquote>
              <Byline t={t} locale={locale} placeholderLabel={placeholderLabel} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
