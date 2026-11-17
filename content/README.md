# Conținutul site-ului

Tot ce vedeți pe site (în afară de textele de interfață din `messages/`) se editează aici, fără cod.
JSON nu acceptă comentarii, așa că notițele stau în câmpurile `_comment` și `_TODO` (site-ul le ignoră).

După orice modificare rulați:

```bash
npm run validate:content
```

Scriptul verifică fiecare fișier (câmpuri lipsă, slug-uri duplicate, linkuri între servicii, lungimea titlurilor SEO, diacritice cu sedilă) și vă spune exact unde e problema. Dacă un fișier e invalid, nici build-ul nu trece.

| Fișier | Ce conține |
|---|---|
| `site.json` | Datele firmei: denumire, CUI, Reg. Com., adresă, telefon, WhatsApp, email, program, rețele sociale, showreel, linkuri Behance/Drive |
| `stats.json` | Cifrele de încredere (Acasă, Despre) |
| `packages.json` | Toate pachetele și prețurile + secțiunea „Extra” |
| `services/*.json` | Câte un fișier pe serviciu (31), cu textele RO și EN ale paginii |
| `portfolio.json` | Proiectele din portofoliu |
| `testimonials.json` | Testimoniale |
| `clients.json` | Logo-urile din banda animată |
| `faq.json` | Întrebările frecvente generale |
| `cities.json` | Orașele deservite |
| `local-services.json` | Serviciile care au pagini pe oraș |
| `city-pages/{serviciu}/{oras}.json` | Conținutul fiecărei pagini de oraș |
| `blog/ro/*.mdx`, `blog/en/*.mdx` | Articolele de blog |
| `legal/ro/*.md`, `legal/en/*.md` | Paginile legale |

## Exemple rapide

**Schimb un preț.** În `packages.json` găsiți pachetul și modificați `"price"`. `"from": true` afișează „de la”, `"period": "luna"` afișează „/ lună”, `"featured": true` pune eticheta „Cel mai ales” (unul pe grupă). Prețul „de la” afișat pe pagina serviciului este `"priceFrom"` din `services/{serviciu}.json`.

**Adaug un proiect în portofoliu.** Puneți coperta în `public/portfolio/nume.jpg` (ideal 1600×1000, JPG/WebP) și adăugați un obiect în `portfolio.json` (copiați unul existent). Setați `"placeholder": false`, `"cover": "/portfolio/nume.jpg"` și, pentru video, `"video": { "provider": "youtube", "id": "ID-ul" }`. `"services"` leagă proiectul de paginile de servicii, `"featured": true` îl afișează pe Acasă. Puneți `"result"` doar cu cifre reale. Ștergeți placeholder-ele: proiectele cu `"placeholder": true` au `noindex` și nu apar în sitemap.

**Adaug un oraș.** Adăugați orașul în `cities.json`, apoi rulați `npm run content:city-skeletons`. Se creează fișierele `city-pages/*/{oras}.json` cu `"ready": false`. Scrieți conținutul local (intro, locații, FAQ) și puneți `"ready": true`. Doar atunci pagina intră în sitemap și poate fi indexată. Nu copiați textul altui oraș: Google penalizează paginile identice.

**Completez un oraș existent.** Aceleași fișiere: cele 50 de schelete (orașele 6–15) au `_TODO` cu ce lipsește.

**Adaug un logo de client.** Fișier SVG/PNG alb sau monocrom în `public/clients/`, apoi în `clients.json`: `{ "name": "Firma", "logo": "/clients/firma.svg" }`. Folosiți doar logo-uri pentru care aveți acordul clientului.

**Showreel-ul din hero.** Clip MP4 (și opțional WebM) fără sunet, 1080p, 10–20 secunde, ideal sub 8 MB, în `public/video/`. În `site.json` → `showreel.mp4`: `"/video/showreel.mp4"`, plus `poster` (o imagine JPG din clip).
