"use client";

import { useEffect, useRef, useState } from "react";

/** Fundalul video al hero-ului. Nu pornește automat dacă utilizatorul preferă mișcare redusă. */
export function HeroVideo({ mp4, webm, poster }: { mp4: string; webm?: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) v.pause();
    else void v.play().catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster || undefined}
      aria-hidden="true"
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}

function pad(n: number) { return String(n).padStart(2, "0"); }

/** Interfață de vizor (REC + timecode) peste fundalul placeholder. */
export function ViewfinderHud() {
  const [frames, setFrames] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const id = window.setInterval(() => setFrames(Math.floor(((performance.now() - start) / 1000) * 25)), 40);
    return () => window.clearInterval(id);
  }, []);
  const s = Math.floor(frames / 25);
  const tc = `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(frames % 25)}`;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden select-none md:block">
      <div className="absolute top-32 right-16 flex items-center gap-6 font-mono text-xs tracking-widest text-fg/60 tabular-nums">
        <span className="flex items-center gap-2.5 font-sans font-semibold tracking-[0.25em] text-fg/70">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-gold" /> REC
        </span>
        {tc}
      </div>
      <div className="absolute right-16 bottom-16 font-mono text-xs tracking-widest text-fg/45">4K · 25P · ISO 800 · F2.8</div>
      <div className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 opacity-30">
        <span className="absolute top-1/2 left-0 h-px w-full bg-fg" />
        <span className="absolute top-0 left-1/2 h-full w-px bg-fg" />
      </div>
    </div>
  );
}
