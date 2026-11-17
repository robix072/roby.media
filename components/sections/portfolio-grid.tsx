"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/format";
import { PortfolioScene } from "@/components/motion/portfolio-scene";

export type PortfolioCard = {
  key: string;
  href: string;
  title: string;
  client: string;
  industry: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  cover?: string;
  previewMp4?: string;
  placeholder: boolean;
  /** Adresa site-ului live (proiecte web). */
  site?: string;
  coverNode: React.ReactNode;
};

function Card({ item, placeholderLabel, large }: { item: PortfolioCard; placeholderLabel: string; large?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const onEnter = () => {
    if (!video.current) return;
    if (window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) void video.current.play().catch(() => {});
  };
  const onLeave = () => { video.current?.pause(); };
  return (
    <Link href={item.href} className="card-lift group block" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div data-pf-media className={cn("relative overflow-hidden bg-surface-2", !item.site && "viewfinder", large ? "aspect-[16/10]" : "aspect-[4/3]")}>
        {/* Imaginea e mai înaltă decât cadrul, ca să poată aluneca ușor la scroll (PortfolioScene). */}
        {item.site ? (
          // Captură de site în fereastră de browser: fără alunecare, bara de adresă trebuie să rămână vizibilă.
          <div className="absolute inset-0">{item.coverNode}</div>
        ) : (
          <div data-pf-drift className="absolute inset-x-0 -top-[6%] -bottom-[6%]">{item.coverNode}</div>
        )}
        {item.previewMp4 && (
          <video
            ref={video}
            src={item.previewMp4}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 z-[3] bg-ink/70 px-2.5 py-1 text-xs font-semibold tracking-wide text-fg backdrop-blur-sm">
          {item.categoryLabel}
        </span>
        {item.placeholder && (
          <span className="absolute top-4 right-4 z-[3] border border-gold/60 px-2 py-0.5 text-[0.6875rem] font-bold tracking-wider text-gold uppercase">
            {placeholderLabel}
          </span>
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl transition-colors group-hover:text-gold md:text-[1.75rem]">{item.title}</h3>
          <p className="mt-2 text-sm text-muted">{item.client} · {item.industry}</p>
        </div>
        <ArrowUpRight className="mt-1 h-6 w-6 shrink-0 text-muted transition-[transform,color] duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" aria-hidden="true" />
      </div>
    </Link>
  );
}

/** Grilă de portofoliu, opțional cu filtre pe categorii. */
export function PortfolioGrid({
  items, filters, allLabel, filterLabel, emptyLabel, placeholderLabel, columns = 3,
}: {
  items: PortfolioCard[];
  filters?: { id: string; label: string }[];
  allLabel?: string;
  filterLabel?: string;
  emptyLabel?: string;
  placeholderLabel: string;
  columns?: 2 | 3;
}) {
  const [active, setActive] = useState("all");
  const shown = active === "all" ? items : items.filter((i) => i.category === active);
  return (
    <div>
      {filters && (
        <div role="group" aria-label={filterLabel} className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ id: "all", label: allLabel ?? "All" }, ...filters].map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={active === f.id}
              onClick={() => setActive(f.id)}
              className={cn(
                "h-11 shrink-0 border px-5 text-sm font-semibold transition-colors",
                active === f.id ? "border-gold bg-gold text-ink" : "border-line text-fg/80 hover:border-gold hover:text-gold",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
      <m.ul layout className={cn("grid gap-x-6 gap-y-12 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3")}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((item) => (
            <m.li
              key={item.key}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card item={item} placeholderLabel={placeholderLabel} large={columns === 2} />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
      {shown.length === 0 && <p className="py-16 text-center text-muted">{emptyLabel}</p>}
      <PortfolioScene watch={active} />
    </div>
  );
}
