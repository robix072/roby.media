# Next steps

Branch `polish/redesign`: the visual polish (tokens, type scale, buttons, header, logo, home-page sections, GSAP scroll scenes, hero camera drawing) is done and uncommitted. The rules are in `docs/DESIGN.md`. `npm run build` passed on 2026-11-17 (stop the dev server first; with it running, page generation can run out of memory).

Still open, in order:

- **Unconfirmed company data:** every value in brackets in `content/site.json` (`[Denumirea firmei]`, `[CUI]`, `[Nr. Reg. Com.]`, address, `[email]`, `[Program de lucru]`) is a holder. They show as-is in the footer, the contact page and the legal pages, and are left out of the JSON-LD. Fill them before launch; the legal pages require the real company data.
  - While the email is `[email]`, it gets no `mailto:` link anywhere.
  - Social links and the Behance link are empty, so their icons and the portfolio "more work" section are hidden.
- **Hidden until real data exists:** stats (`content/stats.json`), testimonials (`content/testimonials.json`) and client logos (`content/clients.json`) are empty lists. Each section reappears on its own when items are added.
- **Portfolio texts:** XBR, Elytra, Urgent Broker, TNT Archive and "O zi din viața unui artist" texts are inferred (see `_TODO` in `content/portfolio.json`). Check them. The live embeds (`"embed": true`) break if a site starts sending `X-Frame-Options`.
- **Blog:** the home-page blog section is removed. The `/blog` pages, nav link and sitemap entries still exist.
- **Real media:** add `public/video/showreel.mp4` (+ `.webm`, poster) and set the paths in `content/site.json` under `showreel`. The OG image (`app/api/og`) still uses its own text logo.
- **Not yet checked:** Safari/iOS. The machine used for testing has Windows reduced motion on, so all motion there is static by design; it was verified with motion emulated.
