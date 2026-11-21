# Brief: 3 clipuri roby.media (Apple × Revolut), 9:16 + 4:5, 1080p60

Ești pe calculatorul meu, cu acces la Chrome și la fișierele mele. Folosește-le pentru tot ce ai nevoie. Lucrează în
repo-ul `roby.media` (agenția mea de video, foto și marketing din România). Toate textele din clipuri sunt în română,
cu diacritice corecte (ș ț cu virgulă, nu sedilă).

## 0. Pregătire

1. În repo-ul roby.media: `git fetch origin claude/determined-keller-4x80sc && git checkout claude/determined-keller-4x80sc`.
   Acolo e skill-ul **`.claude/skills/video-ads/`**. Citește `SKILL.md` și toate fișierele din `references/`
   (`style-rules.md`, `pitfalls.md`, `sound-and-music.md`, `engine-3d.md`, `into-footage.md`) și aplică-le.
2. Pornește de la exemplul **`.claude/skills/video-ads/examples/lansare/`**. Așa am făcut clipul „Pachetul Lansare”:
   - pagină HTML cu `renderAt(t)` determinist;
   - MacBook construit în CSS 3D;
   - texte care apar cuvânt cu cuvânt, „pac” pe beat;
   - randare cu Playwright și ffmpeg.

   Copiază-l într-un folder nou de lucru (de ex. `~/roby-media-clipuri/`), nu în site. Citește `README.md` de acolo.
3. Clonează aplicația: `git clone https://github.com/lyandrxw/iscusitul` (repo privat al meu).
4. Muzica e pe calculatorul meu, probabil în Downloads. Caută fișierele după nume:
   - „Travis Scott – FRANCHISE (feat. Young Thug, M.I.A.)”
   - „Flawl\$ss (feat. Lil Uzi Vert)”
   - „Migos – Bad and Boujee (ft. Lil Uzi Vert)”

   Dacă nu le găsești, întreabă-mă. Le folosesc doar pe conturi personale, deci le pui direct în clipuri.

## 1. Prelucrează asset-urile Apple × Revolut din Chrome-ul meu

În Chrome am salvate asset-uri și inspirații în stil Apple × Revolut: capturi, pagini, imagini, iconițe. Le găsești în
bookmark-uri, tab-uri deschise sau Downloads. Dacă nu e clar unde sunt, întreabă-mă o dată, scurt.

Ce faci cu ele:
1. **Strânge-le** într-un folder `inspiratie/` și fă o planșă de contact cu toate.
2. **Analizează-le** și scrie un `stil.md` scurt, cu:
   - paleta exactă (hex);
   - tipografia: greutăți, mărimi, tracking;
   - razele colțurilor, umbrele, blur-ul de sticlă, spațierile;
   - cum arată cardurile, butoanele, listele, cifrele mari, graficele, tranzițiile;
   - ce face „Revolut” (carduri mari și lucioase, cifre uriașe, gradienți, UI dens, dar curat) și ce face „Apple”
     (aer, ierarhie clară, sticlă, mișcare fină și precisă).
3. **Reconstruiește tot în vector/HTML**, ca să fie clar la orice mărime.
   - Nu lipi capturile lor în clip.
   - Nu folosi logo-urile Apple sau Revolut și nicio interfață de-a lor copiată 1:1.
   - Ia stilul, nu produsul lor.
4. Fontul: SF Pro e doar pentru produse Apple, deci nu-l include în fișiere. Folosește **Inter** (licență OFL, are
   diacritice) cu tracking −2%…−3%. Pe titluri merge Manrope (fontul site-ului), dacă arată mai bine. Compară-le pe
   imagini statice și alege.

Arată-mi planșa și `stil.md` înainte să construiești clipurile.

## 2. Identitatea comună a celor 3 clipuri

- **Gradient de fundal mov, animat, din 4 culori**, ca efectul „4-Color Gradient” din After Effects. Fac-o de la
  zero, ca shader WebGL sau canvas: 4 puncte de culoare care se mișcă lent pe curbe netede, fără să se oprească.
  - Îți trimit în chat un screenshot cu gradientul dorit. Extrage cele 4 culori din el și reconstruiește-l.
  - Dacă nu l-am trimis, cere-l.
  - Adaugă un grain fin și static, ca gradientul să nu facă benzi la compresie.
- **Logo de canal TV în stânga sus**, pe toată durata clipului.
  - Logo-ul (SVG alb) e în `.claude/skills/video-ads/examples/lansare/assets/roby-media-logo.svg`; tăiat în piese pentru animație e în `assets/data.js` din același folder.
  - La apariție se construiește animat, doar în colțul lui, „pac pac” pe beat: literele intră pe rând, bara albă
    șterge de la stânga la dreapta, punctul se aprinde auriu, la fel ca în clipul „Lansare”, dar mic și rapid.
  - Apoi rămâne discret, cu opacitate de ~85%.
  - Respectă zonele sigure: pe 9:16 nu-l pune sub bara de sus a TikTok. Coboară-l puțin, la ~120 px de sus.
- **UI în stil Apple × Revolut**, pe un MacBook construit în cod (exemplul are deja unul) și pe un iPhone construit în
  cod: sticlă neagră, ramă subțire, Dynamic Island, fără butoane laterale.
- **Fără preț**, nicăieri.
- **Hook în prima secundă.** Fără „roby.media prezintă” și fără logo mare la început. Ceva care oprește scroll-ul
  instant, pe primul beat.
- **Final (CTA) „pac pac” pe beat:**
  - „roby.media” se construiește mare, centrat;
  - apoi, pe câte un beat, pastile cu iconițe: Instagram @roby.media, TikTok @roby.media, Facebook @roby.media;
  - apoi „roby.media” ca adresă de site, într-o bară de căutare care se scrie;
  - totul perfect centrat, fără mișcare de cameră pe ultimul cadru.
- **Animații:** intrări rapide, cu expo-out de ~0,22 s, cu blur și scale mic. Tranziții prin transformare de formă.
  Camera merge într-o singură direcție, iar tot cadrul pulsează discret pe kick (~1,4%). Fără bounce pe text, fără
  lens flare.

## 3. Cele 3 clipuri (fiecare de minimum 45 s)

Pentru fiecare clip:
1. Găsește BPM-ul și grila de beat a melodiei (librosa sau aubio; verifică manual pe vârfurile kick-ului).
2. Alege o bucată de ≥45 s cu drop-ul pe momentul cheie.
3. Construiește cronologia din grila de beat, ca în exemplu (`T(bar, beat)`).
4. Pune melodia direct în clip: AAC 320k, normalizată la −14 LUFS, cu fade scurt la capete.

### Clip 1: Spot publicitar pentru firme, pe „FRANCHISE”

Ce oferim (din `content/packages.json`):
- **Spot Publicitar**: concept creativ, filmare cinematică, color grading, sound design, variante 16:9, 9:16 și 1:1.
- **Video Prezentare**: concept și script, 1 zi de filmare, clip de 60–120 s, 3 variante scurte pentru social media.

Idee:
- **Hook**: ecran negru, o clapetă de filmare închide pe primul beat, cadrul se aprinde, apoi „Reclama ta arată ca
  acum 10 ani?” cuvânt cu cuvânt.
- Apoi transformarea, pe beat:
  - storyboard care se desenează;
  - timeline de montaj pe MacBook (UI propriu, nu Final Cut sau Premiere);
  - roți de color grading care se rotesc, cu un cadru care trece din „plat” în „gradat”;
  - forme de undă pentru sound design;
  - exportul în 16:9 → 9:16 → 1:1, cu cadrul care își schimbă forma pe beat.

Fără filmări reale. Cadrele din „spot” le faci din imagini abstracte și gradate, de exemplu luminile din `public/bg/`.

### Clip 2: Social media Growth, pe „Bad and Boujee”

Ce oferim:
- **Growth**: 30 de clipuri pe lună, postare și management TikTok și Instagram, răspuns la comentarii, raport lunar.
- **All-In Brand**: tot ce include Growth, plus campanii TikTok Ads / Meta Ads, optimizare săptămânală și raport de
  performanță.

Idee:
- **Hook**: un iPhone cu un feed care derulează tot mai repede și se oprește pe beat, cu „Postezi zilnic și nu te vede
  nimeni?”
- Apoi:
  - calendar de conținut pe o lună, cu 30 de sloturi care se umplu pe optimi;
  - clipuri verticale care ies din telefon;
  - comentarii cu răspunsuri care apar;
  - raport lunar în stil Revolut: carduri mari, grafic care se desenează.

**Fără cifre inventate** de urmăritori sau vizualizări. Graficele nu au valori.

### Clip 3: Site-uri și aplicații, pe „Flawl\$ss”

Ce oferim:
- **Site Prezentare**: până la 6 pagini, design premium, SEO de bază, bilingv opțional.
- **Landing Page**: o pagină de conversie, copywriting, formular și WhatsApp, tracking.
- **Magazin Online**: e-commerce, plăți online, curierat, fotografie de produs.
- **Aplicații**: le facem, dar nu sunt încă pe site. Nu inventa ce include pachetul. Arată doar aplicația.

Idee:
- **Hook**: capacul MacBook-ului se deschide pe beat și un site apare instant, cu „Clientul tău decide în câteva
  secunde.”
- **Site-urile mele** elytra.ro, urgentbroker.ro și xbr.ro:
  - capturează-le din Chrome, desktop la 1440 px lățime și mobil la 390 px, pagină întreagă (DevTools → „Capture full
    size screenshot”);
  - închide bannerele de cookies înainte de captură;
  - arată-le pe MacBook și pe iPhone, cu derulare pe beat și tăieturi între ele;
  - sunt ale mele, deci nu ai nevoie de alt acord.
- **Aplicația** din repo-ul `iscusitul`, o platformă de servicii la domiciliu:
  1. `pnpm install`, apoi `pnpm dev:mobile` și tasta `w` (Expo web).
  2. Parcurge fluxul demo: comandă → căutare meseriaș → tracking pe hartă → deviz → semnătură → lucrare → evaluare.
  3. Fă capturi și înregistrări la rezoluție de telefon (390×844, scale 3).
  4. Arată-le pe iPhone-ul construit în cod.

  **Foarte important:**
  - Numele **„iscusitul” nu trebuie să apară nicăieri**: logo, titluri, texte, URL-uri, notificări. Înlocuiește-l cu o
    marcă neutră, cu stilul din `stil.md`, sau ascunde-l.
  - Nu trebuie să se vadă că e prototip:
    - ascunde banda galbenă „Pasul următor”;
    - ascunde codul SMS de test afișat pe ecran (123456);
    - ascunde orice text cu „demo”, „test” sau „simulat”;
    - ascunde datele de test evident false.
  - Nu scrie nici că aplicația e lansată, în App Store sau Google Play, sau că are utilizatori. Prezint-o doar ca
    aplicație pe care am construit-o.

## 4. Formate (2 pentru fiecare clip, deci 6 fișiere)

| Format | Rezoluție | Unde |
|---|---|---|
| 4:5 | 1080×1350 | feed Instagram/Facebook, merge pus și ca Reel |
| 9:16 | 1080×1920 | TikTok (și Reels/Shorts) |

- 60 fps, H.264 High, yuv420p, CRF ~16, `-movflags +faststart`. Randează la `deviceScaleFactor: 2` și micșorează la
  1080p cu lanczos, ca textul să fie foarte clar.
- **Layout adaptat** fiecărui format, nu decupat. Exemplul are deja `?ar=916|45`, folosește același sistem.
- **Zone sigure pe 9:16 (TikTok):**
  - nimic important în primii ~150 px de sus;
  - nimic în ultimii ~420 px de jos (descriere, muzică);
  - nimic în ultimii ~140 px din dreapta (butoane).
- **Grid de profil:** TikTok și Instagram arată în grid o decupare centrală 3:4.
  - Primul cadru al fiecărui clip trebuie să arate bine și decupat așa, cu hook-ul în centru.
  - Exportă și o **copertă PNG** pentru fiecare clip și format, cu textul principal în zona centrală 3:4.

## 5. Text pentru postare (pentru fiecare clip)

- **Descriere pe un singur rând, care începe cu un emoji**, cu un CTA spre @roby.media / link în bio.
- **5 hashtag-uri** relevante (unul de brand, de ex. #robymedia).
- **Un comentariu fixat** cu ce include serviciul, ca listă scurtă cu emoji, și un îndemn la mesaj („Scrie «SPOT» și
  îți trimitem oferta”).
- Doar afirmații adevărate. Fără prețuri, fără rezultate garantate, fără cifre inventate.

## 6. Mod de lucru

1. După pasul 1 (asset-uri), arată-mi planșa și `stil.md`.
2. Pentru fiecare clip, arată-mi întâi o **planșă de imagini statice**: un cadru la fiecare beat important, în ambele
   formate. Corectează ce nu iese: suprapuneri, text tăiat, zone sigure, contrast.
3. Verifică sincronizarea: fiecare „pac” cade pe beat (abatere de cel mult un cadru). Scoate o planșă cu forma de undă
   peste cadre.
4. Randează la 1080p60. Verifică durata, rezoluția, fps-ul și volumul (−14 LUFS) cu ffprobe și ffmpeg.
5. Pune totul în `~/roby-media-clipuri/export/`, cu nume clare:
   - `roby-media-spot-publicitar-9x16.mp4`, `…-4x5.mp4`;
   - copertele;
   - un `texte-postare.md` cu descrierile, hashtag-urile și comentariile fixate.
6. Nu posta nimic nicăieri. Nu face push în repo fără să mă întrebi.
7. Dacă ceva te blochează (lipsește screenshot-ul cu gradientul, nu găsești asset-urile sau melodiile, o captură a unui
   site nu merge), întreabă-mă scurt și continuă cu restul între timp.
