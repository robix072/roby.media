import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { cn } from "@/lib/format";

/**
 * Logo-ul. Dacă există public/brand/logo.svg (sau logo.png), îl folosim.
 * Altfel: semn de vizor (colțuri de cadru + punct REC auriu) și wordmark ROBY | MEDIA.
 */
const LOGO_FILE = ["logo.svg", "logo.png"].find((f) => existsSync(join(process.cwd(), "public", "brand", f)));

/** Semnul singur: colțurile vizorului și punctul de înregistrare (același desen ca app/icon.svg). */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M2 10V2h8M22 2h8v8M30 22v8h-8M10 30H2v-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <circle cx="16" cy="16" r="5" fill="#E0A100" />
    </svg>
  );
}

export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  if (LOGO_FILE) {
    return (
      <Image
        src={`/brand/${LOGO_FILE}`}
        alt="Roby Media"
        width={size === "lg" ? 200 : 150}
        height={size === "lg" ? 56 : 42}
        className={cn("h-auto w-auto", size === "lg" ? "max-h-14" : "max-h-10", className)}
        priority
      />
    );
  }
  const lg = size === "lg";
  return (
    <span className={cn("inline-flex items-center select-none", lg ? "gap-3.5" : "gap-3", className)} aria-label="Roby Media">
      <LogoMark className={cn("shrink-0 text-fg", lg ? "h-9 w-9" : "h-7 w-7")} />
      <span aria-hidden="true" className="flex items-center">
        <span className={cn("font-display leading-none tracking-[0.04em] text-fg", lg ? "text-[2.125rem]" : "text-[1.625rem]")}>ROBY</span>
        <span className={cn("mx-2.5 w-px self-stretch bg-line-strong", lg ? "my-1" : "my-0.5")} />
        <span className={cn("font-semibold leading-none tracking-[0.3em] text-fg/70", lg ? "text-[0.8125rem]" : "text-[0.6875rem]")}>MEDIA</span>
      </span>
    </span>
  );
}
