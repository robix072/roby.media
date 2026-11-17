"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/components/motion/gsap";

/**
 * Proces: pe desktop (lat și destul de înalt) secțiunea se fixează cât o înălțime de ecran,
 * linia aurie se umple și fiecare pas se aprinde pe rând. Legat de scroll, reversibil.
 * Pe mobil, ecrane scunde sau cu mișcare redusă: nimic, lista rămâne statică și completă.
 */
export function ProcessScene() {
  const anchor = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = anchor.current?.closest<HTMLElement>("[data-process]");
    const section = root?.closest("section");
    if (!root || !section) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]", root);
        const dots = gsap.utils.toArray<HTMLElement>("[data-process-dot]", root);
        gsap.set("[data-process-fill]", { scaleX: 0 });
        gsap.set(steps, { opacity: 0.35 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            // Secțiunea e mai scundă decât ecranul: o fixăm centrată, nu lipită sus.
            start: () => (section.offsetHeight < window.innerHeight ? "center center" : "top top"),
            end: "+=100%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });
        const n = steps.length;
        tl.to("[data-process-fill]", { scaleX: 1, duration: n }, 0);
        steps.forEach((step, i) => {
          tl.to(step, { opacity: 1, duration: 0.3 }, i);
          tl.to(dots[i], { backgroundColor: "#e0a100", color: "#0b0a09", duration: 0.3 }, i);
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return <span ref={anchor} hidden />;
}
