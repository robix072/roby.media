# roby.media

Site-ul Roby Media SRL: producție foto-video, filmare cu drona, nunți și evenimente, site-uri, reclame Meta, Google și TikTok, marketing TikTok.

**Tehnologii:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, next-intl (RO/EN), Framer Motion, zod, nodemailer, MDX.

- Româna stă la rădăcină (`/servicii/filmare-nunta`), engleza sub `/en` (`/en/services/wedding-videography`). `/ro/...` redirecționează permanent spre varianta fără prefix.
- Toate paginile sunt generate static la build (191 de pagini). Rulează pe server doar formularul (`/api/contact`) și imaginile Open Graph (`/api/og`).

---

## 1. Rulare locală

Aveți nevoie de Node.js 20.9 sau mai nou (recomandat 22).

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Site-ul pornește pe http://localhost:3000. Fără date SMTP în `.env`, formularul funcționează în modul de dezvoltare: mesajul apare în terminal în loc să fie trimis pe email.

Build de producție, local:

```bash
npm run build && npm start
```

Comenzi utile:

| Comandă | Ce face |
|---|---|
| `npm run validate:content` | Verifică tot conținutul din `content/` |
| `npm run lint` | Verifică codul |
| `npm run content:city-skeletons` | Creează paginile-schelet pentru orașele noi |
| `npm run clean` | Șterge build-ul și cache-ul (`.next`), dacă o modificare nu apare |

## 2. Cum modific textele

| Ce | Unde |
|---|---|
| Datele firmei (CUI, telefon, email, adresă, social, Behance/Drive) | `content/site.json` |
| Prețuri și pachete | `content/packages.json` |
| Textele fiecărui serviciu (RO + EN) | `content/services/{serviciu}.json` |
| Portofoliu | `content/portfolio.json` + imagini în `public/portfolio/` |
| Testimoniale, logo-uri clienți, cifre | `content/testimonials.json`, `content/clients.json`, `content/stats.json` |
| Orașe și pagini locale | `content/cities.json`, `content/city-pages/` |
| FAQ general | `content/faq.json` |
| Pagini legale | `content/legal/ro/*.md`, `content/legal/en/*.md` |
| Texte de interfață (meniu, butoane, Acasă, Despre, Contact, formular, cookie-uri) | `messages/ro.json`, `messages/en.json` |

Ghidul detaliat, cu exemple (preț nou, proiect nou, oraș nou, showreel), este în **[content/README.md](content/README.md)**.

După editare rulați `npm run validate:content`: vă arată exact ce lipsește sau ce e greșit.

**Logo:** puneți `public/brand/logo.svg` (sau `logo.png`, pe fundal transparent). Site-ul îl folosește automat în header și footer. Pentru favicon înlocuiți `app/icon.svg`. Până atunci se afișează un logo text provizoriu.

## 3. Cum adaug un articol pe blog

Creați `content/blog/ro/slug-articol.mdx` (și, opțional, varianta EN în `content/blog/en/`):

```mdx
---
title: "Titlul articolului"
description: "Rezumat de max. 155 de caractere, apare în Google."
date: "2026-12-01"
author: "Echipa Roby Media"
translationKey: "cheie-unica"          # aceeași în RO și EN, ca să lege traducerile
relatedServices: ["filmare-drona"]     # ID-uri din content/services
readingMinutes: 6
---

Textul în Markdown. Folosiți ## și ### pentru titluri, liste, **bold**, [linkuri](/servicii/filmare-drona).
```

Slug-ul URL-ului este numele fișierului. Articolul apare automat în listă, în sitemap și pe Acasă.

## 4. Variabile de mediu

Lista completă, cu explicații, este în `.env.example`.

| Variabilă | Rol |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Adresa publică (canonical, sitemap, OG). Implicit `https://roby.media` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Serverul de email pentru formular |
| `MAIL_FROM`, `MAIL_TO` | Expeditorul și destinatarul cererilor de ofertă |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 (`G-...`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | TikTok Pixel |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Verificare Google Search Console (opțional) |

Variabilele `NEXT_PUBLIC_*` intră în cod la build: după ce le schimbați, refaceți build-ul.

**Tracking:** GA4, Meta Pixel și TikTok Pixel se încarcă **doar după acordul** din bannerul de cookie-uri. Evenimente trimise automat: click pe telefon (`click_phone` / `Contact`), WhatsApp (`click_whatsapp` / `Contact`), email, „Cere ofertă” și trimiterea formularului (`generate_lead` / `Lead` / `SubmitForm`). În GA4, marcați `generate_lead`, `click_phone` și `click_whatsapp` ca evenimente-cheie (conversii).

**Formular anti-spam:** câmp-capcană invizibil (honeypot), timp minim de completare de 3 secunde, limită de 5 cereri la 10 minute per IP și validare cu zod pe server.

## 5. Deploy pe Netlify

1. Urcați repo-ul pe GitHub.
2. În Netlify: **Add new site → Import an existing project**, alegeți repo-ul. Setările de build sunt deja în `netlify.toml` (`npm run build`, pluginul Next.js).
3. **Site configuration → Environment variables:** adăugați variabilele din `.env.example`.
4. **Domain management:** adăugați `roby.media` și urmați instrucțiunile DNS. SSL-ul se activează automat.

## 6. Deploy pe VPS (Ubuntu/Debian)

### Varianta A: Node.js + PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs nginx
```

```bash
sudo npm install -g pm2
```

```bash
git clone <repo> /var/www/roby-media && cd /var/www/roby-media
```

```bash
cp .env.example .env && nano .env
```

```bash
npm ci && npm run build
```

`npm run build` copiază automat `public/` și `.next/static/` în `.next/standalone/` (scriptul `postbuild`).

```bash
pm2 start ecosystem.config.cjs && pm2 save && pm2 startup
```

Actualizare după modificări:

```bash
git pull && npm ci && npm run build && pm2 reload roby-media
```

> În `ecosystem.config.cjs`, `HOSTNAME` trebuie să rămână `localhost` (sau `0.0.0.0` cu portul 3000 blocat în firewall). Cu `127.0.0.1`, redirecționările de limbă intră în buclă.

### Varianta B: Docker

```bash
cp .env.example .env && nano .env
```

```bash
docker compose up -d --build
```

Containerul ascultă doar local, pe `127.0.0.1:3000`. Variabilele `NEXT_PUBLIC_*` din `.env` sunt transmise automat la build.

### Nginx (reverse proxy) + SSL Let's Encrypt

Creați `/etc/nginx/sites-available/roby.media`:

```nginx
server {
    listen 80;
    server_name roby.media www.roby.media;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/roby.media /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx
```

```bash
sudo apt-get install -y certbot python3-certbot-nginx && sudo certbot --nginx -d roby.media -d www.roby.media
```

Certbot configurează HTTPS și reînnoirea automată. Pentru redirect `www → roby.media`, adăugați un bloc `server` separat pentru `www.roby.media` cu `return 301 https://roby.media$request_uri;`.

`X-Forwarded-For` este necesar pentru limita de cereri a formularului (IP-ul real al vizitatorului).

## 7. SEO

- `metadata` unic pe fiecare pagină, canonical, hreflang (`ro-RO`, `en`, `x-default`), Open Graph și Twitter Card cu imagine generată dinamic (`/api/og`).
- `sitemap.xml` și `robots.txt` generate automat. Paginile-schelet de oraș (`ready: false`) și proiectele placeholder au `noindex` și nu apar în sitemap.
- JSON-LD: `Organization` + `LocalBusiness`, `Service` (cu `Offer`), `FAQPage`, `BreadcrumbList`, `Article`, `VideoObject`, `ItemList`.
- După lansare: adăugați site-ul în Google Search Console și trimiteți `https://roby.media/sitemap.xml`.

## 8. Structura proiectului

```
app/[locale]/        rutele (RO și EN au foldere separate pentru slug-uri traduse)
app/api/contact      formularul (SMTP)
app/api/og           imaginile Open Graph
components/views     paginile complete (Acasă, Serviciu, Oraș etc.)
components/sections  secțiuni reutilizabile (CTA, FAQ, pachete, portofoliu, formular)
components/layout    header, footer, bara mobilă, cookie-uri
content/             tot conținutul editabil
messages/            textele de interfață RO/EN
lib/                 încărcarea conținutului, SEO, rute, tracking
docs/                cercetarea, planul și brief-ul de conținut
```
