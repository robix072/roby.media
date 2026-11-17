import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/format";

type Variant = "primary" | "outline" | "ghost" | "whatsapp";
type Size = "md" | "lg" | "sm";

const base =
  "btn group inline-flex items-center justify-center gap-2.5 font-semibold tracking-wide transition-[background-color,color,border-color,transform] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-gold text-ink hover:bg-gold-hover",
  outline: "btn-outline border border-fg/25 text-fg hover:border-gold hover:text-gold",
  ghost: "text-fg hover:text-gold",
  whatsapp: "border border-fg/25 text-fg hover:border-[#25D366] hover:text-[#25D366]",
};

/** Săgeată în pătrat propriu, la capătul butonului (se deplasează la hover). */
export function ArrowChip() {
  return (
    <span className="btn-chip" aria-hidden="true">
      <ArrowRight className="h-4 w-4" />
    </span>
  );
}
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}

type LinkBtnProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
  track?: string;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/** Buton-link. `track` adaugă data-track pentru evenimentele de conversie. */
export function ButtonLink({ href, variant, size, className, children, external, track, ...rest }: LinkBtnProps) {
  const cls = buttonClass(variant, size, className);
  const isExternal = external || /^(https?:|tel:|mailto:)/.test(href);
  if (isExternal) {
    const newTab = href.startsWith("http");
    return (
      <a href={href} className={cls} data-track={track} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} data-track={track} {...rest}>
      {children}
    </Link>
  );
}
