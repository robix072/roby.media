"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

/**
 * Hero: rândurile titlului urcă la încărcare; la scroll, barele de cinema se închid,
 * vizorul se strânge și conținutul se estompează. Totul e legat de poziția scroll-ului
 * (reversibil). Cu mișcare redusă: nimic, conținutul e vizibil din CSS.
 */
export function HeroScene() {
  const anchor = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = anchor.current?.closest("section");
    if (!section) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .to("[data-hero-line]", { y: 0, yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.1)
          .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0.35);

        gsap
          .timeline({
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.4 },
          })
          .to("[data-bar]", { scaleY: 1, ease: "none" }, 0)
          .to("[data-hero-vf]", { scale: 0.92, opacity: 0.4, ease: "none" }, 0)
          .to("[data-hero-content]", { y: -60, opacity: 0, ease: "none" }, 0)
          .to("[data-hero-bg]", { yPercent: 12, ease: "none" }, 0);
      });
    }, section);
    // Fonturile pot schimba înălțimea titlului după încărcare.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return <span ref={anchor} hidden />;
}
