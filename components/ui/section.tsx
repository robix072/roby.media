import type { ReactNode } from "react";
import { cn } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";

export function Section({
  id, children, className, tone = "ink", size = "md", labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "ink" | "surface";
  size?: "sm" | "md" | "lg";
  labelledBy?: string;
}) {
  // Jos puțin mai mult spațiu decât sus (echilibru optic).
  const pad = { sm: "pt-14 pb-16 md:pt-20 md:pb-24", md: "pt-20 pb-24 md:pt-28 md:pb-32", lg: "pt-24 pb-28 md:pt-36 md:pb-40" }[size];
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      // „ink” e transparent: se vede fundalul ambiental fix (AmbientBackground). „surface” e o bandă opacă cu margini de film.
      className={cn("relative", pad, tone === "surface" ? "film-band bg-surface" : "bg-transparent", className)}
    >
      <div className="container-x">{children}</div>
    </section>
  );
}

/**
 * Antet de secțiune.
 * align: "left" (titlu + acțiune), "split" (titlu stânga, intro dreapta), "center".
 * index: număr de secvență afișat ca „01 / Eyebrow”.
 */
export function SectionHeader({
  eyebrow, title, intro, id, align = "left", className, as: As = "h2", action, index,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  align?: "left" | "split" | "center";
  className?: string;
  as?: "h1" | "h2";
  action?: ReactNode;
  index?: number;
}) {
  const label = eyebrow ? (
    index ? (
      <p className="index-label mb-5">
        <span>{String(index).padStart(2, "0")}</span>
        <span className="text-fg/30" aria-hidden="true">/</span>
        <span className="text-fg/70">{eyebrow}</span>
      </p>
    ) : (
      <p className="eyebrow mb-4">{eyebrow}</p>
    )
  ) : null;
  const watermark = index ? (
    <span aria-hidden="true" className="index-watermark hidden md:block">{String(index).padStart(2, "0")}</span>
  ) : null;
  const heading = (
    <As id={id} className="font-display text-display-2 text-balance">
      {title}
    </As>
  );

  if (align === "split") {
    return (
      <Reveal className={cn("relative isolate mb-12 grid gap-6 md:mb-16 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
        {watermark}
        <div className="lg:col-span-7">
          {label}
          {heading}
        </div>
        <div className="flex flex-col items-start gap-6 lg:col-span-5 lg:pb-2">
          {intro ? <div className="max-w-[52ch] text-lg text-muted text-pretty">{intro}</div> : null}
          {action}
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal
      className={cn(
        "relative isolate mb-10 md:mb-14",
        align === "center" ? "mx-auto max-w-3xl text-center" : "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      {watermark}
      <div className={cn(align === "left" && "max-w-3xl")}>
        {label}
        {heading}
        {intro ? <div className="mt-5 max-w-[60ch] text-lg text-muted text-pretty">{intro}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}

/** Evidențiază un cuvânt în titlu cu galben. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-gold">{children}</span>;
}
