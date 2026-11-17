import Image from "next/image";

type C = { name: string; logo: string; url?: string };

/** Bandă cu logo-urile clienților, în buclă. Se oprește la hover și cu prefers-reduced-motion. */
export function LogoMarquee({ items, title }: { items: C[]; title: string }) {
  const row = [...items, ...items];
  return (
    <section aria-label={title} className="overflow-hidden border-y border-line bg-ink/60 py-10">
      <p className="container-x mb-8 text-center text-sm font-semibold tracking-wide text-muted">{title}</p>
      <div className="group relative [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="flex w-max animate-marquee items-center gap-16 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row.map((c, i) => (
            <li key={i} aria-hidden={i >= items.length} className="flex h-12 shrink-0 items-center">
              {c.logo ? (
                <Image src={c.logo} alt={c.name} width={140} height={48} className="h-10 w-auto object-contain opacity-60 grayscale transition-opacity hover:opacity-100" />
              ) : (
                <span className="font-display text-2xl tracking-wide text-fg/45">{c.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
