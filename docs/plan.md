# Plan de structură: roby.media

## URL-uri și limbi
- next-intl cu `localePrefix: "as-needed"`: româna stă la rădăcină (`/servicii/filmare-nunta`, `/filmare-nunta-cluj-napoca`), engleza sub `/en/...` cu slug-uri traduse (`/en/services/wedding-videography`). `/ro/...` face redirect 301 la URL-ul fără prefix. Așa rămân URL-urile curate din exemplele tale.
- hreflang `ro`, `en` și `x-default` (→ RO) pe fiecare pagină.

## Hartă site (RO / EN)
| Pagină | RO | EN |
|---|---|---|
| Acasă | `/` | `/en` |
| Servicii (hub) | `/servicii` | `/en/services` |
| Serviciu (33 de pagini) | `/servicii/[slug]` | `/en/services/[slug]` |
| Pachete | `/pachete` | `/en/packages` |
| Portofoliu | `/portofoliu`, `/portofoliu/[slug]` | `/en/portfolio/...` |
| Despre | `/despre` | `/en/about` |
| Blog | `/blog`, `/blog/[slug]` (3 articole) | `/en/blog/...` |
| Contact | `/contact` | `/en/contact` |
| Zone deservite (hub) | `/zone-deservite` | `/en/areas-we-serve` |
| Pagini de oraș | `/[serviciu]-[oras]` (5 servicii × 15 orașe = 75) | doar RO (vezi mai jos) |
| Pagini legale | `/politica-confidentialitate`, `/politica-cookies`, `/termeni-si-conditii` | `/en/privacy-policy`, ... |
| 404, sitemap.xml, robots.txt, OG dinamic | ✓ | ✓ |

**Servicii (33)**, pe 5 categorii, exact ca în brief: Producție foto-video (12), Evenimente (6), Marketing & reclame (8), Web & branding (5). Slug-uri RO de exemplu: `videoclip-prezentare-firma`, `spot-publicitar`, `continut-social-media`, `productie-ugc`, `fotografie-produs`, `filmare-drona`, `filmare-nunta`, `marketing-tiktok`, `reclame-tiktok-ads`, `reclame-facebook-instagram`, `google-ads`, `creare-site-prezentare`, `creare-magazin-online`, `optimizare-seo`, `branding` etc.

**Pagini de oraș:** `filmare-nunta`, `videoclip-prezentare-firma`, `filmare-drona`, `agentie-marketing`, `creare-site` × 15 orașe.
- Complet scrise: București, Cluj-Napoca, Timișoara, Iași, Brașov (25 de pagini).
- Restul de 50: structura e generată, iar conținutul local are `// TODO`. Până le completezi, au **`noindex` și nu apar în sitemap** (`"ready": false` în `cities.json`), ca să nu fie văzute de Google ca pagini subțiri sau „doorway”. Când pui `ready: true`, intră automat în index.
- Fac paginile de oraș **doar în română**: căutările locale sunt în română, iar 75 de pagini EN slabe ar strica SEO-ul. Le pot adăuga și în engleză dacă le vrei.

## Fișiere de conținut (`content/`)
`site.json` (date firmă, contact, social, Behance/Drive) · `stats.json` · `services/*.json` (câte un fișier pe serviciu, cu blocuri RO și EN) · `packages.json` · `portfolio.json` (9 placeholder-e) · `testimonials.json` · `clients.json` · `faq.json` (FAQ general) · `cities.json` · `city-pages/*.json` (conținutul local) · `blog/{ro,en}/*.mdx`.
JSON nu permite comentarii, așa că pun câmpuri `"_comment"` / `"_TODO"` și un `content/README.md` care explică fiecare fișier. `messages/{ro,en}.json` conțin doar textele de interfață (meniu, butoane, etichete).

## Componente
`Header` (sticky, mega-menu, comutator RO/EN, CTA) · `Footer` (date firmă, ANPC SAL/SOL) · `MobileActionBar` (Sună / WhatsApp / Ofertă) · `WhatsAppButton` · `Section` · `Hero` (video în buclă + poster) · `StatsCounter` · `ServiceCard` · `GoalCards` · `ProcessSteps` · `PackageCard`/`PackageGrid` · `PortfolioGrid` (filtre, preview la hover, modal) · `LiteVideo` (YouTube/Vimeo) · `Testimonials` · `LogoMarquee` · `FAQ` (+ JSON-LD) · `CTASection` · `ContactForm` · `Breadcrumbs` · `ViewfinderFrame` · `CookieBanner` + `Analytics` (GA4, Meta Pixel și TikTok Pixel încărcate doar după acord) · `CityPage` · `ServicePage` · `JsonLd`.

## Șablon pagină de serviciu
H1 cu cuvântul cheie → subtitlu cu beneficiul → CTA dublu → „Pe scurt” → problema → soluția → ce include → pentru cine (industrii) → proces → portofoliu filtrat → pachet / „de la” → FAQ (5–8) → servicii conexe + orașe → CTA final. Schema: `Service` + `Offer`, `FAQPage`, `BreadcrumbList`.

## Tehnic
Next.js 15+ (App Router, `output: "standalone"`), TypeScript, Tailwind, Framer Motion, next-intl, zod, nodemailer (route handler `/api/contact` cu honeypot și rate limit în memorie), `next/font` (Anton pentru titluri, Manrope pentru text, ambele cu subsetul `latin-ext` verificat pentru ă â î ș ț), `next/og`. Deploy: `netlify.toml` (cu `@netlify/plugin-nextjs`), `Dockerfile`, `docker-compose.yml`, README cu PM2 + Nginx + Let's Encrypt.

## Etape (câte un commit pe fiecare)
1. Scaffold, design system, layout, i18n, header/footer/conversie
2. Modele de conținut + date (site, pachete, portofoliu, orașe)
3. Acasă, Servicii, Pachete, Portofoliu, Despre, Contact, legale, 404
4. Cele 33 de pagini de serviciu (conținut RO + EN)
5. Pagini de oraș + hub
6. Blog (3 articole RO + EN)
7. SEO tehnic (metadata, OG, sitemap, JSON-LD), formular, tracking, cookies
8. Deploy (Netlify/Docker/VPS), README, build + lint + verificare Lighthouse
