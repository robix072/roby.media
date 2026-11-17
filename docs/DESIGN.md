# Design system

Dark, cinematic, one accent. Read this before changing UI, colours, type or motion.

## Colour (tokens in `app/globals.css` `@theme`)

| Token | Use |
|---|---|
| `ink` `#0b0a09` | Page background, default for every section |
| `surface` / `surface-2` | Only two bands on home (services, packages) and raised panels |
| `line` / `line-strong` | Hairlines, 1px only |
| `gold` `#e0a100` | The one accent: CTAs, numbers, active states. Under ~10% of any screen |
| `gold-soft` | Tinted fills behind gold content |
| `fg` / `muted` | Text. Greys are warm (tinted toward gold), never neutral or pure white |

WhatsApp green `#25D366` appears only on WhatsApp controls.

## Type

- Display: Anton, uppercase, `font-display`. Line height 1.16 leaves room for Romanian capitals with diacritics (Â Î Ș Ț).
- Body: Manrope 400 / 500 / 600 / 700. Body text max 65ch, `text-pretty`; headings `text-balance`.
- Fluid scale, use these utilities instead of per-breakpoint sizes:
  - `text-display-1`: hero h1
  - `text-display-2`: section h2, page h1
  - `text-display-3`: card and block h3
- Numbers in stats, prices and timecodes: `tabular-nums`.

## Layout

- Container: `container-x` (max 88rem).
- Section padding via `<Section size>`; do not alternate `tone="surface"` by habit.
- Section header layouts: `align="left"` (default), `"split"` (title left, intro right), `"center"`. `index` adds the film label `01 / Eyebrow`.
- No repeated bordered `gap-px` card grids; vary composition per section.
- Square corners everywhere (no radius). Viewfinder corners are the signature on media frames.

## Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.23,1,.32,1)` | Enter, hover, press |
| `--ease-in-out` | `cubic-bezier(.77,0,.175,1)` | On-screen movement |
| Durations | 160ms press, 240ms hover, 600ms reveal | |

- Press: `scale(.97)` 160ms. Hover effects only under `(hover: hover) and (pointer: fine)`.
- Cards (`card-lift`): lift 2px; media inside (`media-zoom`) scales 1.03.
- Reveals (`<Reveal>`): 600ms, 16px; only on section headers and first rows, not every block.
- Scroll scenes use GSAP + ScrollTrigger in `components/motion/`, scoped with `gsap.context` / `useGSAP` cleanup, set up through `gsap.matchMedia()` so reduced motion and small screens get static layout. Native scrolling only, no smooth-scroll library.
  - Hero: headline lines rise on load; letterbox bars close and viewfinder tightens while scrolling past.
  - Hero camera (`components/sections/hero-camera.tsx`): a large gold camera outline draws itself line by line, holds, fades and loops every 10s. Pure CSS (`.cam-draw` in `globals.css`, `pathLength=1` + `stroke-dashoffset`). Don't add `vector-effect: non-scaling-stroke`: it breaks the dash maths.
  - Process: pinned on desktop (>=1024px wide, >=720px tall) with a gold progress line.
  - Portfolio: covers wipe in (clip-path) and drift 6% inside their frame.
- `prefers-reduced-motion`: everything static, all content visible. One exception, by the owner's choice: the hero camera keeps drawing (line draw and fade only, nothing moves across the screen).

## Background

- `AmbientBackground` (`components/motion/ambient-background.tsx`, mounted in the locale layout) is a fixed layer behind the page. It holds:
  - Three Codex-generated light images in `public/bg/`, blended with `screen` and crossfading over the page's scroll: `light-leak` (top), `anamorphic-flare` (middle), `bokeh` (end).
  - Gold, rose and teal light pools that drift with scroll.
  - A faint 12-column storyboard grid.
  - Reduced motion shows only the light leak.
- `<Section tone="ink">` is transparent so this layer shows through. Don't put `bg-ink` back on page sections.
- `tone="surface"` sections are opaque bands with film-perforation edges (`film-band`).
- A numbered `SectionHeader` (`index`) draws a large outlined number behind the title (`index-watermark`, desktop only).

## Media

- **Website projects:** set `url` on the portfolio item. The cover (a 1440×900 WebP screenshot in `public/portfolio/`) then renders in a browser-window frame and doesn't drift. Gallery images on the case page also use browser frames; a filename containing `-mobile` (600px wide) renders in a phone frame. Gallery rows fill 12 columns: phone 4 + desktop 8, otherwise desktop 6 + 6, so list a phone shot after the 1st and before the last desktop shot.
- **Live embed:** `"embed": true` swaps the case-page cover for `SitePreview`: screenshot first, then on click the real site in a scaled iframe (1440px wide, 390px on phones). Only set it for sites that allow framing (no `X-Frame-Options` / `frame-ancestors`); Elytra blocks it.

## Logo

`components/layout/logo.tsx`: viewfinder corners (fg) with a gold REC dot, then `ROBY` in Anton, a hairline, and `MEDIA` in tracked Manrope caps. `app/icon.svg` is the same mark. A file in `public/brand/logo.svg|png` replaces it.
- **Everything else:** no real photos or video exist yet. Stand-ins are graded frames; real files go in the slots listed in `content/site.json` (`showreel`) and each portfolio item's `cover` / `previewMp4`.
