import Image from "next/image";
import { cn } from "@/lib/format";

/**
 * Imagine de copertă. Dacă `src` lipsește, afișează un cadru placeholder în stilul site-ului
 * (până încărcați imaginile reale în /public).
 */
/** Gradări calde pentru cadrele provizorii (variază pe categorie, aceeași paletă). */
const GRADES = [
  "bg-[radial-gradient(120%_90%_at_80%_0%,#2a2010_0%,#161412_45%,#0c0b0a_100%)]",
  "bg-[radial-gradient(110%_90%_at_15%_10%,#2b1a10_0%,#171311_48%,#0c0b0a_100%)]",
  "bg-[radial-gradient(130%_80%_at_50%_100%,#24210f_0%,#151412_50%,#0c0b0a_100%)]",
  "bg-[radial-gradient(100%_100%_at_90%_90%,#1f1c17_0%,#141311_50%,#0b0a09_100%)]",
] as const;

export function Cover({
  src, alt, label, className, sizes = "(min-width: 1024px) 33vw, 100vw", priority, viewfinder = true, grade = 0, browserUrl,
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  viewfinder?: boolean;
  grade?: number;
  /** Pentru site-uri: captura apare într-o fereastră de browser cu adresa în bară. */
  browserUrl?: string;
}) {
  if (src && browserUrl) {
    const host = new URL(browserUrl).hostname.replace(/^www\./, "");
    return (
      <div className={cn("relative overflow-hidden bg-surface-2 ring-1 ring-line", className)}>
        <div aria-hidden="true" className="absolute inset-x-0 top-0 z-[2] flex h-7 items-center gap-3 border-b border-line bg-surface px-3">
          <span className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-fg/20" />
            <span className="h-2 w-2 rounded-full bg-fg/20" />
            <span className="h-2 w-2 rounded-full bg-fg/20" />
          </span>
          <span className="flex-1 truncate text-center font-mono text-[0.6875rem] text-fg/50">{host}</span>
          <span className="w-10" />
        </div>
        <div className="absolute inset-x-0 top-7 bottom-0 overflow-hidden">
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="media-zoom object-cover object-top" />
        </div>
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-surface-2", viewfinder && "viewfinder", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]" />
      ) : (
        <div role="img" aria-label={alt} className={cn("absolute inset-0 flex items-end p-5", GRADES[grade % GRADES.length])}>
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,#fff_0,#fff_1px,transparent_1px,transparent_4px)]" />
          <div aria-hidden="true" className="absolute top-5 left-5 flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.2em] text-fg/60">
            <span className="h-2 w-2 rounded-full bg-gold" /> REC
          </div>
          <div aria-hidden="true" className="absolute top-5 right-5 font-mono text-[0.6875rem] text-fg/50">4K · 25P</div>
          {label ? <span aria-hidden="true" className="relative font-display text-xl leading-tight text-fg/30">{label}</span> : null}
        </div>
      )}
    </div>
  );
}
