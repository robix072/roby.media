"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MousePointerClick } from "lucide-react";

/**
 * Site live într-o fereastră de browser. Până la click arată captura (fără cost de încărcare);
 * după click încarcă site-ul real într-un iframe randat la 1440px (390px pe ecrane mici)
 * și scalat ca să încapă în cadru, deci se vede exact ca pe un monitor.
 */
export function SitePreview({ url, cover, alt, label, hint }: { url: string; cover: string; alt: string; label: string; hint: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [view, setView] = useState({ w: 1440, h: 900, scale: 1 });
  const host = new URL(url).hostname.replace(/^www\./, "");

  useEffect(() => {
    const el = box.current;
    if (!el || !live) return;
    const fit = () => {
      const w = el.clientWidth < 640 ? 390 : 1440;
      const scale = el.clientWidth / w;
      setView({ w, h: el.clientHeight / scale, scale });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [live]);

  return (
    <div className="relative overflow-hidden bg-surface-2 ring-1 ring-line">
      <div aria-hidden="true" className="flex h-8 items-center gap-3 border-b border-line bg-surface px-3">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-fg/20" />
          <span className="h-2 w-2 rounded-full bg-fg/20" />
          <span className="h-2 w-2 rounded-full bg-fg/20" />
        </span>
        <span className="flex-1 truncate text-center font-mono text-xs text-fg/50">{host}</span>
        <span className="flex w-10 justify-end">{live && <span className="h-2 w-2 rounded-full bg-gold" />}</span>
      </div>
      <div ref={box} className="relative aspect-[3/4] overflow-hidden sm:aspect-[16/10]">
        {live ? (
          <iframe
            src={url}
            title={alt}
            sandbox="allow-scripts allow-same-origin allow-popups"
            className="absolute top-0 left-0 origin-top-left border-0 bg-white"
            style={{ width: view.w, height: view.h, transform: `scale(${view.scale})` }}
          />
        ) : (
          <button type="button" onClick={() => setLive(true)} className="group absolute inset-0 block w-full cursor-pointer text-left">
            <Image src={cover} alt={alt} fill sizes="100vw" priority className="object-cover object-top" />
            <span className="absolute inset-0 bg-ink/0 transition-colors duration-[240ms] group-hover:bg-ink/30" />
            <span className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/80 to-transparent" />
            <span className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-center">
              <span className="btn inline-flex items-center gap-2 bg-gold px-5 py-3 font-semibold text-ink shadow-[0_20px_50px_-15px_rgb(0_0_0_/_0.7)]">
                <MousePointerClick className="h-5 w-5" aria-hidden="true" /> {label}
              </span>
              <span className="mt-1 text-xs text-fg/80">{hint}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
