# Exemplu: reclama „Pachetul Lansare” (TikTok / Reels, 9:16, 4:5, 1:1)

Pagină animată deterministă (`renderAt(t)`), capturată cadru cu cadru cu Playwright și codată cu ffmpeg.

- `ad.html` + `ad.js`: animația (MacBook în CSS 3D, texte cuvânt cu cuvânt, cronologie pe beat la 140 BPM). `?ar=916|45|11` alege formatul.
- `assets/data.js`: logo-ul roby.media în piese (pentru animație) + iconițe Simple Icons (CC0).
- Copiați înainte de rulare: `assets/fonts/Manrope.ttf` și `public/bg/*.webp` din repo în `assets/` de aici.
- `stills.cjs`: imagini de verificare (`AR=45 node stills.cjs 0.4 1.5 3.2 …`).
- `events.cjs`: scoate `window.EVENTS`/`KICKS` în `events.json` pentru sunet.
- `music.py`: beat trap sintetizat + efecte pe evenimente (numpy, scipy).
- `render.cjs` / `render_all.sh`: randare 4K60 în 3 bucăți paralele, concat, sunet normalizat la −14 LUFS.
