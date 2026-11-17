"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type Stat = { id: string; value: number; prefix: string; suffix: string; label: string };

function Counter({ stat, locale }: { stat: Stat; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(stat.value);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!inView || reduce || started) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pornim animația o singură dată
    setStarted(true);
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(stat.value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, started, stat.value]);

  return (
    <span ref={ref} className="tabular-nums">
      {stat.prefix}
      {new Intl.NumberFormat(locale === "ro" ? "ro-RO" : "en-GB").format(n)}
      <span className="text-gold">{stat.suffix}</span>
    </span>
  );
}

/** Contoare animate. Valoarea finală e randată pe server (bun pentru SEO și fără JS). */
export function StatsCounter({ stats, locale, placeholderNote }: { stats: Stat[]; locale: string; placeholderNote?: string }) {
  return (
    <div>
      <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.id}
            className={`flex flex-col-reverse gap-3 px-0 sm:px-6 lg:px-8 ${i % 2 ? "border-l border-line pl-6" : ""} ${i === 2 ? "lg:border-l lg:border-line lg:pl-8" : ""} ${i === 0 ? "lg:pl-0" : ""}`}
          >
            <dt className="max-w-[18ch] text-sm text-muted md:text-base">{s.label}</dt>
            <dd className="font-display text-5xl tabular-nums md:text-7xl">
              <Counter stat={s} locale={locale} />
            </dd>
          </div>
        ))}
      </dl>
      {placeholderNote && <p className="mt-3 text-xs text-muted/70">{placeholderNote}</p>}
    </div>
  );
}
