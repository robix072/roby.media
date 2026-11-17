import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./json-ld";
import { breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ items, label }: { items: { name: string; path: string }[]; label: string }) {
  return (
    <>
      <nav aria-label={label} className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          {items.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-line-strong" aria-hidden="true" />}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-fg/80">{it.name}</span>
              ) : (
                <Link href={it.path} className="hover:text-gold">{it.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(items)} />
    </>
  );
}
