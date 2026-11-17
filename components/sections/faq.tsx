import { Plus } from "lucide-react";
import { JsonLd } from "@/components/ui/json-ld";
import { faqLd } from "@/lib/seo";

/** FAQ cu <details> (funcționează fără JavaScript) + JSON-LD FAQPage. */
export function FAQ({ items, withSchema = true }: { items: { q: string; a: string }[]; withSchema?: boolean }) {
  return (
    <>
      <div className="divide-y divide-line border-y border-line">
        {items.map((f, i) => (
          <details key={i} className="group" name="faq">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left text-lg font-semibold transition-colors hover:text-gold md:text-xl [&::-webkit-details-marker]:hidden">
              <h3 className="text-pretty">{f.q}</h3>
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center border border-line-strong transition-[transform,border-color] duration-500 ease-[var(--ease-cine)] group-open:rotate-45 group-open:border-gold">
                <Plus className="h-4 w-4 text-gold" aria-hidden="true" />
              </span>
            </summary>
            <p className="max-w-3xl pb-7 text-[1.0625rem] leading-relaxed text-muted text-pretty">{f.a}</p>
          </details>
        ))}
      </div>
      {withSchema && <JsonLd data={faqLd(items)} />}
    </>
  );
}
