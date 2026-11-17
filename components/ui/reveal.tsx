import type { CSSProperties, ReactNode } from "react";

/**
 * Apariție lentă, cinematică, la scroll.
 * Conținutul e vizibil implicit (SEO, fără JS, prefers-reduced-motion). Este ascuns doar când
 * <html> are clasa `js` și apare când RevealObserver adaugă `is-visible`.
 */
export function Reveal({
  children, className, delay = 0, as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article";
}) {
  const style = delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined;
  return (
    <Tag data-reveal="" className={className} style={style}>
      {children}
    </Tag>
  );
}
