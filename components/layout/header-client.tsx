"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight, Phone } from "lucide-react";
import { ServiceIcon } from "@/components/icons";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/format";
import type { ICONS } from "@/lib/content/schemas";

export type MenuService = { id: string; name: string; href: string; icon: (typeof ICONS)[number] };
export type MenuCategory = { id: string; title: string; intro: string; services: MenuService[] };
export type NavLink = { href: string; label: string };

type Labels = {
  services: string; allServices: string; quote: string; menu: string; openMenu: string; closeMenu: string;
  switchTo: string; switchToShort: string; language: string; call: string;
};

/** Găsește URL-ul paginii curente în cealaltă limbă din <link rel="alternate" hreflang>. */
function alternateHref(target: "ro" | "en") {
  if (typeof document === "undefined") return target === "ro" ? "/" : "/en";
  const sel = target === "ro" ? 'link[rel="alternate"][hreflang="ro-RO"]' : 'link[rel="alternate"][hreflang="en"]';
  const el = document.querySelector<HTMLLinkElement>(sel);
  if (el?.href) {
    const u = new URL(el.href);
    return u.pathname + u.search;
  }
  return target === "ro" ? "/" : "/en";
}

export function HeaderClient({
  logo, locale, homeHref, servicesHref, categories, links, labels, quoteHref, telHref, phoneDisplay,
}: {
  logo: ReactNode;
  locale: "ro" | "en";
  homeHref: string;
  servicesHref: string;
  categories: MenuCategory[];
  links: NavLink[];
  labels: Labels;
  quoteHref: string;
  telHref: string;
  phoneDisplay: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const target = locale === "ro" ? "en" : "ro";
  const [altHref, setAltHref] = useState(target === "ro" ? "/" : "/en");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- citim <link hreflang> după randare
    setAltHref(alternateHref(target));
  }, [pathname, target]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Închide meniurile la schimbarea paginii.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMegaOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMegaOpen(true); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 160); };

  const switchLocale = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = alternateHref(target);
  };

  const isActive = (href: string) => (href === homeHref ? pathname === href : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || megaOpen || mobileOpen
          ? "border-b border-line bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-ink/80 to-transparent",
      )}
    >
      <div
        className={cn(
          "container-x flex h-16 items-center justify-between gap-6 transition-[height] duration-300 ease-[var(--ease-out)]",
          scrolled ? "md:h-16" : "md:h-20",
        )}
      >
        <Link href={homeHref} className="shrink-0" aria-label="Roby Media">
          {logo}
        </Link>

        <nav className="hidden lg:block" aria-label="Principal">
          <ul className="flex items-center gap-1">
            <li onMouseEnter={openMega} onMouseLeave={scheduleClose} className="relative">
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 text-[0.9375rem] font-medium transition-colors hover:text-gold",
                  (megaOpen || pathname.startsWith(servicesHref)) && "text-gold",
                )}
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                onClick={() => setMegaOpen((v) => !v)}
              >
                {labels.services}
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", megaOpen && "rotate-180")} aria-hidden="true" />
              </button>
            </li>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn("link-draw block px-3.5 py-2 text-[0.9375rem] font-medium transition-colors hover:text-gold", isActive(l.href) && "text-fg")}
                  aria-current={isActive(l.href) ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={altHref}
            onClick={switchLocale}
            hrefLang={target}
            lang={target}
            className="hidden h-10 items-center px-2 text-sm font-semibold tracking-wider text-muted transition-colors hover:text-fg sm:inline-flex"
            aria-label={`${labels.language}: ${labels.switchTo}`}
          >
            {labels.switchToShort}
          </a>
          <a href={telHref} data-track="phone" className="hidden items-center gap-2 text-sm font-semibold text-fg hover:text-gold xl:inline-flex">
            <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
            {phoneDisplay}
          </a>
          <Link href={quoteHref} className={buttonClass("primary", "sm", "hidden sm:inline-flex")} data-track="quote_click">
            {labels.quote}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={mobileOpen ? labels.closeMenu : labels.openMenu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mega-menu desktop */}
      <AnimatePresence>
        {megaOpen && (
          <m.div
            id="mega-menu"
            ref={megaRef}
            onMouseEnter={openMega}
            onMouseLeave={scheduleClose}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-x-0 top-full hidden border-b border-line bg-ink/95 backdrop-blur-md lg:block"
          >
            <div className="container-x grid grid-cols-4 gap-8 py-10">
              {categories.map((cat, ci) => (
                <m.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: 0.04 * ci, ease: [0.23, 1, 0.32, 1] }}
                >
                  <p className="font-display text-xl text-gold">{cat.title}</p>
                  <p className="mt-2 mb-4 text-sm text-muted">{cat.intro}</p>
                  <ul className="space-y-0.5">
                    {cat.services.map((s) => (
                      <li key={s.id}>
                        <Link href={s.href} className="group flex items-center gap-2.5 py-1.5 text-[0.9375rem] text-fg/85 transition-colors hover:text-gold">
                          <ServiceIcon name={s.icon} className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-gold" />
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </m.div>
              ))}
            </div>
            <div className="border-t border-line">
              <div className="container-x flex items-center justify-between py-4">
                <Link href={servicesHref} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-gold">
                  {labels.allServices} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href={quoteHref} className={buttonClass("primary", "sm")}>{labels.quote}</Link>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Meniu mobil */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-ink lg:hidden"
          >
            <nav className="container-x pb-32 pt-6" aria-label={labels.menu}>
              <ul className="divide-y divide-line border-y border-line">
                {links.map((l, li) => (
                  <m.li
                    key={l.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 + 0.04 * li, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Link href={l.href} className="flex items-center justify-between py-4 font-display text-3xl">
                      {l.label}
                      <ArrowRight className="h-5 w-5 text-gold" aria-hidden="true" />
                    </Link>
                  </m.li>
                ))}
              </ul>
              {categories.map((cat) => (
                <details key={cat.id} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    {cat.title}
                    <ChevronDown className="h-5 w-5 text-gold transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <ul className="pb-4">
                    {cat.services.map((s) => (
                      <li key={s.id}>
                        <Link href={s.href} className="flex items-center gap-3 py-2.5 text-fg/85">
                          <ServiceIcon name={s.icon} className="h-4 w-4 text-gold" />
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
              <div className="mt-8 flex flex-col gap-3">
                <Link href={quoteHref} className={buttonClass("primary", "lg")}>{labels.quote}</Link>
                <a href={telHref} data-track="phone" className={buttonClass("outline", "lg")}>
                  <Phone className="h-5 w-5" aria-hidden="true" /> {labels.call}: {phoneDisplay}
                </a>
                <a href={altHref} onClick={switchLocale} hrefLang={target} lang={target} className={buttonClass("ghost", "md")}>
                  {labels.switchTo}
                </a>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
