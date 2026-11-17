import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceIcon } from "@/components/icons";
import type { ICONS } from "@/lib/content/schemas";

/** Card de serviciu cu hover cinematic (linie aurie, colțuri de vizor). */
export function ServiceCard({
  href, name, description, icon, priceLabel, index,
}: {
  href: string;
  name: string;
  description: string;
  icon: (typeof ICONS)[number];
  priceLabel?: string;
  index?: number;
}) {
  return (
    <Link
      href={href}
      className="viewfinder group relative flex h-full flex-col overflow-hidden border border-line bg-surface p-6 transition-colors duration-500 [--vf-color:transparent] [--vf-inset:18px] hover:border-line-strong hover:bg-surface-2 hover:[--vf-color:rgb(224_161_0_/_0.8)] hover:[--vf-inset:10px] md:p-7"
    >
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-x-100" />
      <div className="flex items-start justify-between">
        <ServiceIcon name={icon} className="h-8 w-8 text-gold" />
        {index !== undefined && <span className="font-display text-sm text-muted">{String(index + 1).padStart(2, "0")}</span>}
      </div>
      <h3 className="mt-8 font-display text-2xl md:text-[1.75rem]">{name}</h3>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{description}</p>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="font-semibold text-fg/80">{priceLabel}</span>
        <ArrowUpRight className="h-5 w-5 text-muted transition-[transform,color] duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" aria-hidden="true" />
      </div>
    </Link>
  );
}
