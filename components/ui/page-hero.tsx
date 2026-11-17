import type { ReactNode } from "react";
import { Breadcrumbs } from "./breadcrumbs";

/** Antetul paginilor interioare: breadcrumbs, eyebrow, H1, intro și acțiuni. */
export function PageHero({
  crumbs, crumbLabel, eyebrow, title, intro, children, aside,
}: {
  crumbs: { name: string; path: string }[];
  crumbLabel: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line pt-28 pb-14 md:pt-40 md:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_85%_0%,#1d1810_0%,transparent_60%)]" />
      <div className="container-x relative">
        <Breadcrumbs items={crumbs} label={crumbLabel} />
        <div className={aside ? "grid gap-12 lg:grid-cols-12 lg:items-end" : undefined}>
          <div className={aside ? "lg:col-span-7" : "max-w-5xl"}>
            {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
            <h1 className="font-display text-[2.5rem] text-balance sm:text-6xl md:text-7xl lg:text-[5rem]">{title}</h1>
            {intro ? <div className="mt-6 max-w-3xl text-lg text-fg/80 text-pretty md:text-xl">{intro}</div> : null}
            {children ? <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div> : null}
          </div>
          {aside ? <div className="lg:col-span-5">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
