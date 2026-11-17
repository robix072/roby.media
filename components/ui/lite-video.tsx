"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/format";

/**
 * Embed YouTube/Vimeo „lite”: arată doar thumbnail-ul până la click, ca pagina să rămână rapidă.
 * Fără ID → cadru placeholder.
 */
export function LiteVideo({
  provider, id, title, playLabel, soonLabel, poster, className,
}: {
  provider: "youtube" | "vimeo";
  id: string;
  title: string;
  playLabel: string;
  soonLabel: string;
  poster?: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const thumb = poster || (id ? (provider === "youtube" ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : `https://vumbnail.com/${id}.jpg`) : "");
  const src =
    provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
      : `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`;

  return (
    <div className={cn("viewfinder relative aspect-video overflow-hidden bg-surface-2", className)}>
      {active && id ? (
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => id && setActive(true)}
          disabled={!id}
          className="group absolute inset-0 flex h-full w-full items-center justify-center"
          aria-label={id ? `${playLabel}: ${title}` : soonLabel}
        >
          {thumb ? (
            <Image src={thumb} alt="" fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover opacity-80 transition-opacity group-hover:opacity-100" />
          ) : (
            <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_0%,#262014_0%,#151515_45%,#0d0d0d_100%)]" />
          )}
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-fg/40 bg-ink/50 backdrop-blur-sm transition-[transform,border-color,background-color] duration-500 group-hover:scale-110 group-hover:border-gold group-hover:bg-gold">
            <Play className="ml-1 h-7 w-7 text-fg transition-colors group-hover:text-ink" fill="currentColor" aria-hidden="true" />
          </span>
          {!id && <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-muted">{soonLabel}</span>}
        </button>
      )}
    </div>
  );
}
