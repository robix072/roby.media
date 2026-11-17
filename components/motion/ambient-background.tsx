"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/components/motion/gsap";

/**
 * Fundalul fix al paginii, vizibil prin secțiunile negre:
 * - trei imagini de lumină de film (public/bg, generate cu Codex), amestecate „screen”, care se
 *   succed pe parcursul paginii: light leak sus, flare anamorfic la mijloc, bokeh spre final;
 * - pete de lumină caldă și una rece (teal) care alunecă încet cu scroll-ul;
 * - o grilă de storyboard foarte discretă.
 * Doar transform și opacity, legate de scroll. Cu mișcare redusă: static (doar light leak-ul).
 */
export function AmbientBackground() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const scrub = { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 1.2 };
        gsap.to("[data-glow='a']", { yPercent: 70, xPercent: -25, ease: "none", scrollTrigger: scrub });
        gsap.to("[data-glow='b']", { yPercent: -60, xPercent: 30, ease: "none", scrollTrigger: scrub });
        gsap.to("[data-glow='c']", { yPercent: 40, xPercent: 40, ease: "none", scrollTrigger: scrub });

        // Cele trei imagini se predau una alteia (durate relative = procent din pagină).
        gsap.set(["[data-bg='flare']", "[data-bg='bokeh']"], { opacity: 0 });
        gsap
          .timeline({ defaults: { ease: "none" }, scrollTrigger: scrub })
          .to("[data-bg='leak']", { opacity: 0, yPercent: -8, duration: 35 }, 0)
          .to("[data-bg='flare']", { opacity: 1, duration: 20 }, 22)
          .to("[data-bg='flare']", { yPercent: -10, duration: 50 }, 22)
          .to("[data-bg='flare']", { opacity: 0, duration: 18 }, 58)
          .to("[data-bg='bokeh']", { opacity: 1, yPercent: -6, duration: 30 }, 66)
          .set({}, {}, 100);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div data-bg="leak" className="ambient-image bg-[url(/bg/light-leak.webp)] opacity-70" />
      <div data-bg="flare" className="ambient-image bg-[url(/bg/anamorphic-flare.webp)] opacity-0 motion-reduce:hidden" />
      <div data-bg="bokeh" className="ambient-image bg-[url(/bg/bokeh.webp)] opacity-0 motion-reduce:hidden" />
      <div data-glow="a" className="ambient-glow absolute -top-[25vmax] -right-[20vmax] h-[70vmax] w-[70vmax] [--glow:rgb(224_161_0_/_0.09)]" />
      <div data-glow="b" className="ambient-glow absolute -bottom-[30vmax] -left-[25vmax] h-[75vmax] w-[75vmax] [--glow:rgb(190_40_90_/_0.08)]" />
      <div data-glow="c" className="ambient-glow absolute top-[30vh] -left-[30vmax] h-[60vmax] w-[60vmax] [--glow:rgb(20_150_160_/_0.06)]" />
      <div className="storyboard-grid absolute inset-0" />
    </div>
  );
}
