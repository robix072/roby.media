"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

/**
 * Portofoliu: fiecare copertă se dezvăluie de jos în sus când intră în ecran (clip-path)
 * și alunecă ușor (6%) în cadrul ei cât traversează ecranul. Legat de scroll, reversibil.
 * Cu mișcare redusă: nimic.
 */
export function PortfolioScene({ watch }: { watch?: string }) {
  const anchor = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = anchor.current?.parentElement;
    if (!root) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-pf-media]", root).forEach((frame) => {
          gsap.fromTo(
            frame,
            { clipPath: "inset(0% 0% 100% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top 92%", end: "top 55%", scrub: 0.4 },
            },
          );
          const drift = frame.querySelector("[data-pf-drift]");
          if (drift) {
            gsap.fromTo(
              drift,
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: "none",
                scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          }
        });
      });
    }, root);
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
    // `watch` = filtrul activ: refacem efectele pentru cardurile nou afișate.
  }, [watch]);

  return <span ref={anchor} hidden />;
}
