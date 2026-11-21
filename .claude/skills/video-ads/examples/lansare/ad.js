"use strict";
// Reclamă TikTok „Pachetul Lansare” – roby.media. 1080×1920 CSS (randat la 2× = 2160×3840), 60 fps.
// Totul e calculat din renderAt(t) și tăiat pe un beat trap de 140 BPM (20 de măsuri).

const FPS = 60;
const BPM = 140;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const T = (bar, beat = 0) => (bar * 4 + beat) * BEAT;
const DURATION = T(24) + 0.9;
// Format: ?ar=916 (TikTok/Reels/Shorts), 45 (feed Instagram/Facebook), 11 (pătrat)
const AR = new URLSearchParams(location.search).get("ar") || "916";
const LAYOUTS = {
  "916": { H: 1920, cy: 960, hlTop: 200, hlPkg: 150, hlSize: 84, pills: 1450, S: 0.9, pkgK: 1, pkgY: 1010, endY: 1000 },
  "45": { H: 1350, cy: 720, hlTop: 70, hlPkg: 60, hlSize: 72, pills: 1170, S: 0.82, pkgK: 0.9, pkgY: 760, endY: 700 },
  "11": { H: 1080, cy: 580, hlTop: 50, hlPkg: 40, hlSize: 64, pills: 930, S: 0.7, pkgK: 0.76, pkgY: 600, endY: 560 },
};
const L = LAYOUTS[AR] || LAYOUTS["916"];
const H = T(4);                      // predarea: punctul auriu devine ecranul MacBook-ului
const SCREEN_W = 872, SCREEN_H = 549;
const HAND_S = 1080 / SCREEN_W;
const C10 = Math.cos(10 * Math.PI / 180), S10 = Math.sin(10 * Math.PI / 180);

// Kick-urile din beat (aceleași ca în muzică): pe 1 și pe „și”-ul lui 3, măsurile 2–21
const KICKS = [];
for (let b = 2; b < 22; b++) { KICKS.push(T(b, 0), T(b, 2.5)); if (b % 2) KICKS.push(T(b, 3.5)); }

// ------------------------------------------------------------------ Matematică
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => cl((t - a) / (b - a));
const lerp = (a, b, p) => a + (b - a) * p;
const eo = (x) => 1 - Math.pow(1 - x, 3);
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eox = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const sine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
const mix = (a, b, p) => a.map((v, i) => lerp(v, b[i], p));
// „Pac”: intrare rapidă (0.22 s) cu expo-out
const pac = (t, at, dur = 0.22) => eox(seg(t, at, at + dur));

function lidPoint(u, v, d = 0) {
  const x = -450 + 14 + u;
  const yl = -585 + 14 + v;
  return [x, yl * C10 - d * S10, yl * S10 + d * C10];
}
const F_SCREEN = lidPoint(SCREEN_W / 2, SCREEN_H / 2);
const F_MAC = [0, -205, 120];

// ------------------------------------------------------------------ DOM
const $ = (s) => document.querySelector(s);
function h(tag, cls, style, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (style) n.style.cssText = style;
  if (html) n.innerHTML = html;
  return n;
}
const blur = (b) => (b > 0.05 ? `blur(${b}px)` : "none");

const glows = [
  { c: "224,161,0", a: 0.20, x: 180, y: 380 * L.H / 1920, s: 1500 },
  { c: "226,112,138", a: 0.11, x: 980, y: 1300 * L.H / 1920, s: 1300 },
  { c: "63,182,168", a: 0.08, x: 200, y: 1750 * L.H / 1920, s: 1200 },
].map((g) => { const n = h("div", "glow", `width:${g.s}px;height:${g.s}px;background:radial-gradient(closest-side, rgba(${g.c},${g.a}), rgba(${g.c},${g.a * 0.4}) 45%, transparent)`); $("#bg").append(n); return { ...g, n }; });

// MacBook
const mac = $("#mac");
const shadow = h("div", "shadow", "transform: translateY(80px) translateZ(-160px) rotateX(90deg)");
const base = h("div", "base", "transform: rotateX(90deg)");
const lip = h("div", "lip", "transform: translateZ(620px)");
const sideL = h("div", "side", "left:-470px; transform: rotateY(-90deg)");
const sideR = h("div", "side", "left:470px; transform: rotateY(-90deg)");
base.append(h("div", "grill", "left:28px"), h("div", "grill", "right:28px"), h("div", "pad"));
const kbd = h("div", "kbd");
[[18, Array(14).fill(1)], [36, [...Array(13).fill(1), 1.6]], [36, [1.5, ...Array(12).fill(1), 1.1]],
 [36, [1.8, ...Array(11).fill(1), 1.8]], [36, [2.3, ...Array(10).fill(1), 2.3]], [36, [1, 1, 1, 1.3, 5.2, 1.3, 1, 1, 1]]]
  .forEach(([ht, ws]) => {
    const row = h("div", "krow", `height:${ht}px`);
    ws.forEach((w) => row.append(h("div", "key", `flex:${w}`)));
    kbd.append(row);
  });
base.append(kbd);
const lid = h("div", "lid", "transform: rotateX(10deg)");
const slices = [];
for (let k = 7; k >= 1; k--) { const s = h("div", "slice", `transform: translateZ(${-k}px)`); slices.push(s); lid.append(s); }
const bezel = h("div", "bezel");
const screen = h("div", "screen", "transform: translateZ(0.6px)");
const notch = h("div", "notch", "inset:auto; left:50%; top:13px; width:132px; height:22px; border-radius:0 0 12px 12px; transform: translateZ(1px)");
lid.append(bezel, screen, notch);
mac.append(shadow, base, lip, sideL, sideR, lid);

// Desktop
const wall = h("div", "wall", "background: radial-gradient(60% 70% at 18% 8%, rgba(224,161,0,.38), transparent 70%), radial-gradient(60% 60% at 92% 85%, rgba(226,112,138,.30), transparent 70%)");
const menubar = h("div", "menubar", "", "<b>roby.media</b><span>Fișier</span><span>Editare</span><span>Vizualizare</span><span>Fereastră</span><span class='r'>Joi 10:24</span>");
const lights = "<i class='tl' style='background:#ff5f57'></i><i class='tl' style='background:#febc2e'></i><i class='tl' style='background:#28c840'></i>";
const lock = "<svg viewBox='0 0 24 24' width='11' height='11' fill='none' stroke='currentColor' stroke-width='2.4'><rect x='5' y='11' width='14' height='10' rx='2'/><path d='M8 11V8a4 4 0 0 1 8 0v3'/></svg>";

// Site: trei secțiuni pe o pagină care derulează pe beat
const siteWin = h("div", "win site", "", `<div class="tbar">${lights}<div class="url">${lock}brandul-tau.ro</div></div>`);
const page = h("div", "page");
const sNav = h("div", "sp snav", "", "<span class='brand'>Brandul tău</span><span>Servicii</span><span>Proiecte</span><span>Despre</span><span class='cta'>Contact</span>");
const sH = h("div", "sp shero", "", "<h4>Brandul tău, online.</h4>");
const sP = h("div", "sp shero", "top:232px", "<p>Un site rapid, clar și ușor de găsit pe Google, făcut să aducă cereri de ofertă.</p>");
const sBtns = h("div", "sp sbtns", "", "<span class='sbtn' style='background:#e0a100;color:#15120f'>Cere ofertă</span><span class='sbtn' style='box-shadow:inset 0 0 0 1.5px #d7d0c4;color:#15120f'>Portofoliu</span>");
const sImg = h("div", "sp simg");
const sCards = [34, 282, 530].map((x) => h("div", "sp scard", `left:${x}px`, "<i></i><div style='flex:1'><span style='width:70%'></span><span style='width:90%;margin-top:8px;background:#efeae1'></span></div>"));
const sec2 = h("div", "sp sec2", "", `<h4>Ce facem pentru tine</h4><div class="svc">
  <div style="background-image:url(assets/light-leak.webp)"><span>Servicii</span></div>
  <div style="background-image:url(assets/anamorphic-flare.webp)"><span>Proiecte</span></div>
  <div style="background-image:url(assets/bokeh.webp)"><span>Echipa</span></div></div>`);
const sec3 = h("div", "sp sec3", "", `<div class="l"><h4>Hai să vorbim.</h4><p>Lasă-ne un mesaj și revenim cu o ofertă.</p></div>
  <div class="form"><div class="fl">Nume</div><div class="fi" id="f1"></div><div class="fl">Telefon</div><div class="fi" id="f2"></div>
  <div class="fl">Mesaj</div><div class="fi ta" id="f3"></div><div class="fbtn" id="fbtn">Trimite cererea</div></div>`);
const siteParts = [sNav, sH, sP, sBtns, sImg, ...sCards];
page.append(...siteParts, sec2, sec3);
siteWin.append(page);
const FORM = [["#f1", "Ana"], ["#f2", "07xx xxx xxx"], ["#f3", "Vreau o ofertă pentru Lansare."]];

// Panoul de reclame
const dashWin = h("div", "win dash", "", `<div class="tbar">${lights}<div class="url">${lock}Campanii · Meta Ads</div></div>`);
const dSide = h("div", "dside", "", "<i class='on'></i><i></i><i></i><i></i><i></i>");
const dHead = h("div", "dmain", "", `<div class="dhead"><h5>Campanii</h5><span class="pill" id="pxpill"><b></b>Pixel conectat</span><span class="dplat"><svg viewBox="0 0 24 24"><path d="${ICONS.meta.d}"/></svg>Meta</span></div>`);
const dCard = h("div", "dcard", "left:88px; top:116px; width:684px; height:228px");
const rows = [["Lansare · Conversii", "Obiectiv: cereri de ofertă", ""], ["Ofertă · Conversii", "Obiectiv: mesaje WhatsApp", "url(assets/light-leak.webp) center/cover"]].map(([a, b, bg], i) => {
  const row = h("div", "crow", `top:${10 + i * 104}px`, `<div class="thumb" style="background:${bg || "#24211e"}"></div><div><div class="t1">${a}</div><div class="t2">${b}</div></div>`);
  const tog = h("div", "tog", "", "<b></b>");
  row.append(tog);
  dCard.append(row);
  return { row, tog };
});
dCard.append(h("div", "", "position:absolute;left:16px;right:16px;top:113px;height:1px;background:#24211e"));
const dChart = h("div", "dcard", "left:88px; top:356px; width:684px; height:104px", `<span class="chartlbl">Conversii</span>
  <svg viewBox="0 0 684 104" style="position:absolute;inset:0;width:100%;height:100%">
    <defs><linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0a100" stop-opacity=".35"/><stop offset="1" stop-color="#e0a100" stop-opacity="0"/></linearGradient></defs>
    <path id="carea" d="M150 88 C210 86 240 74 290 76 S370 60 420 58 S500 40 545 36 S620 20 664 16 L664 104 L150 104Z" fill="url(#gf)"/>
    <path id="cline" d="M150 88 C210 86 240 74 290 76 S370 60 420 58 S500 40 545 36 S620 20 664 16" fill="none" stroke="#e0a100" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
  </svg>`);
const toasts = ["Audiență setată", "Campanie activă", "Conversii urmărite"].map((s, i) => h("div", "toast", `bottom:${18 + i * 50}px`, `<b></b>${s}`));
dashWin.append(dSide, dHead, dCard, dChart, ...toasts);
// CRM: cererile intră pe beat și avansează prin etape
const crmWin = h("div", "win dash", "", `<div class="tbar">${lights}<div class="url">${lock}CRM · Cereri</div></div>`);
crmWin.append(h("div", "dside", "", "<i></i><i class='on'></i><i></i><i></i><i></i>"),
  h("div", "dmain", "", `<div class="dhead"><h5>Cereri</h5><span class="pill"><b></b>Live</span></div>`));
const COLS = ["Cerere nouă", "Ofertă trimisă", "Programat", "Câștigat"];
const COL_X = (c) => 88 + c * 174, CARD_Y = (slot) => 158 + slot * 74;
COLS.forEach((name, c) => crmWin.append(h("div", "dcard", `left:${COL_X(c)}px; top:116px; width:160px; height:344px`,
  `<span class="chartlbl" style="left:12px;top:12px;font-size:12px">${name}</span>`)));
const LEADS = [
  { name: "Ana M.", src: "Site", c: "#e0a100", in: T(16, 0), moves: [[T(17, 0), 1], [T(17, 2), 2], [T(18, 0), 3]] },
  { name: "Mihai R.", src: "TikTok", c: "#ff3b5c", in: T(16, 1), moves: [[T(17, 1), 1], [T(18, 1), 2]] },
  { name: "Ioana P.", src: "Meta Ads", c: "#4f8cff", in: T(16, 2), moves: [[T(17, 3), 1]] },
  { name: "Radu C.", src: "WhatsApp", c: "#25D366", in: T(16, 3), moves: [[T(18, 2), 1]] },
];
const leadEls = LEADS.map((l) => {
  const n = h("div", "", "position:absolute;width:144px;height:64px;border-radius:11px;background:#221f1c;box-shadow:inset 0 0 0 1px #34302b;padding:9px 11px;",
    `<div style="font-size:13px;font-weight:700">${l.name}</div><div style="display:flex;align-items:center;gap:6px;margin-top:6px;font-size:11px;font-weight:700;color:#a6a29a"><b style="width:7px;height:7px;border-radius:50%;background:${l.c}"></b>${l.src}<span style="margin-left:auto;font-weight:600">Lansare</span></div>
     <div class="won" style="position:absolute;right:-7px;top:-7px;width:22px;height:22px;border-radius:50%;background:#e0a100;display:grid;place-items:center;opacity:0"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#0b0a09" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>`);
  crmWin.append(n);
  return n;
});
// Starea (coloană, poziție) a fiecărei cereri după fiecare eveniment, ca mișcarea să fie deterministă
const CRM_EVENTS = [...new Set(LEADS.flatMap((l) => [l.in, ...l.moves.map((m) => m[0])]))].sort((a, b) => a - b);
const CRM_STATES = CRM_EVENTS.map((e) => {
  const col = LEADS.map((l) => { if (l.in > e) return -1; let c = 0; for (const [mt, mc] of l.moves) if (mt <= e) c = mc; return c; });
  const entered = LEADS.map((l, i) => { let at = l.in; for (const [mt] of l.moves) if (mt <= e && col[i] >= 0) at = Math.max(at, mt); return at; });
  const slot = col.map((c, i) => (c < 0 ? -1 : LEADS.filter((_, j) => col[j] === c && (entered[j] < entered[i] || (entered[j] === entered[i] && j < i))).length));
  return { col, slot };
});
function crmAt(t) {
  const on = sine(seg(t, T(15, 3), T(16, 0)));
  crmWin.style.opacity = on;
  crmWin.style.transform = `scale(${0.96 + 0.04 * on})`;
  let k = -1;
  CRM_EVENTS.forEach((e, i) => { if (t >= e) k = i; });
  leadEls.forEach((n, i) => {
    if (k < 0 || CRM_STATES[k].col[i] < 0) { n.style.opacity = 0; return; }
    const cur = CRM_STATES[k], prev = k > 0 ? CRM_STATES[k - 1] : null;
    const p = eio(seg(t, CRM_EVENTS[k], CRM_EVENTS[k] + 0.32));
    const x1 = COL_X(cur.col[i]) + 8, y1 = CARD_Y(cur.slot[i]);
    const appeared = !prev || prev.col[i] < 0;
    const x0 = appeared ? x1 : COL_X(prev.col[i]) + 8, y0 = appeared ? y1 : CARD_Y(prev.slot[i]);
    const moving = !appeared && (x0 !== x1 || y0 !== y1) && p < 1;
    const pop = appeared ? pac(t, CRM_EVENTS[k], 0.25) : 1;
    n.style.left = `${lerp(x0, x1, p)}px`;
    n.style.top = `${lerp(y0, y1, p) - (moving ? Math.sin(Math.PI * p) * 14 : 0)}px`;
    n.style.opacity = cl(pop * 1.6);
    n.style.transform = `scale(${(appeared ? 1.25 - 0.25 * pop : 1) * (moving ? 1 + 0.06 * Math.sin(Math.PI * p) : 1)})`;
    n.style.zIndex = moving ? 2 : 1;
    const won = cur.col[i] === 3 ? pac(t, T(18, 0) + 0.25, 0.25) : 0;
    n.style.boxShadow = won > 0 ? `inset 0 0 0 ${1 + won}px rgba(224,161,0,${0.4 + 0.6 * won}), 0 0 ${24 * won}px rgba(224,161,0,${0.35 * won})` : "inset 0 0 0 1px #34302b";
    const w = n.querySelector(".won");
    w.style.opacity = won;
    w.style.transform = `scale(${1.6 - 0.6 * won})`;
  });
}

const glare = h("div", "", "position:absolute;inset:0;background:linear-gradient(115deg, transparent 30%, rgba(255,255,255,.07) 45%, transparent 60%);background-size:260% 100%");
screen.append(wall, menubar, siteWin, dashWin, crmWin, glare);

// Clipuri verticale
const CAPS = [["Înainte și după", "Rezultatul final"], ["Cum lucrăm", "Ziua de filmare"], ["3 lucruri despre oferta lunii", "Ce primești", "Cum comanzi", "Scrie-ne azi"], ["Din culise", "Echipa"], ["Întrebări frecvente", "Răspunsul e simplu"]];
const CLIPS = [
  { img: "light-leak", f: "hue-rotate(0deg)" }, { img: "bokeh", f: "hue-rotate(-25deg) saturate(1.2)" },
  { img: "anamorphic-flare", f: "saturate(1.3)" }, { img: "bokeh", f: "hue-rotate(160deg)" }, { img: "light-leak", f: "hue-rotate(200deg)" },
];
const rail = `<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.2 5 6.6 5c2 0 3.4 1 4.4 2.5C12 6 13.4 5 15.4 5c3.4 0 5.4 3.6 4.1 6.8C19.5 16.4 12 21 12 21z"/></svg>
<svg viewBox="0 0 24 24"><path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.4 1.1 4.6 3 6.2L4.3 21l3.9-1.8c1.2.4 2.5.6 3.8.6 5.5 0 10-3.9 10-8.7S17.5 3 12 3z"/></svg>
<svg viewBox="0 0 24 24"><path d="M14 4l8 8-8 8v-5c-6 0-9.5 1.8-12 5.5C3 14 6 10 14 9z"/></svg>`;
const clips = CLIPS.map((c, i) => {
  const n = h("div", "clip", "", `<div class="img" style="background-image:url(assets/${c.img}.webp);filter:${c.f}"></div><div class="shade"></div>
    <div class="cap"><span></span></div><div class="who"><i></i>brandul.tau</div><div class="rail">${rail}</div><div class="bar"><b></b></div>`);
  $("#world").append(n);
  return { n, img: n.querySelector(".img"), bar: n.querySelector(".bar b"), cap: n.querySelector(".cap span"), heart: n.querySelector(".rail svg"), caps: CAPS[i] };
});
const FAN = [
  { x: -410, y: 40, z: -70, ry: 16 }, { x: -208, y: 12, z: -20, ry: 8 }, { x: 0, y: 0, z: 40, ry: 0 },
  { x: 208, y: 12, z: -20, ry: -8 }, { x: 410, y: 40, z: -70, ry: -16 },
];
const EMERGE_ORDER = [2, 1, 3, 0, 4];
const SLOT = lidPoint(38 + 104 + 27, 46 + 130 + 48, 2);
const SLOT_SCALE = 54 / 220;

// Logo
function makeLogo(width, cx, cy) {
  const hgt = width * 308 / 1532;
  const box = h("div", "logo", `left:${cx - width / 2}px; top:${cy - hgt / 2}px; width:${width}px; height:${hgt}px`);
  const svg = (d) => `<svg viewBox="${LOGO.viewBox}"><path fill-rule="evenodd" d="${d}"/></svg>`;
  const bar = h("div", "", "position:absolute;inset:0", svg(LOGO.full));
  const letters = h("div", "", "position:absolute;inset:0");
  const parts = [...LOGO.letters, LOGO.dot].map((d) => { const n = h("div", "", "position:absolute;inset:0", svg(d)); letters.append(n); return n; });
  box.append(bar, letters);
  return { box, bar, letters, parts, width, hgt, x: cx - width / 2, y: cy - hgt / 2 };
}
// Literele „pac” pe rând, punctul cade, bara șterge de la stânga la dreapta
function logoAt(L, t, t0, wipeA, wipeB) {
  L.parts.forEach((n, i) => {
    if (i === L.parts.length - 1) {
      const d = seg(t, t0 + 0.32, t0 + 0.5);
      n.style.transform = `translateY(${(d * d - 1) * 90}%)`;
      n.style.opacity = cl(d * 3);
      return;
    }
    const k = i < 4 ? i : i + 1;
    const p = pac(t, t0 + k * 0.028, 0.3);
    n.style.opacity = cl(p * 1.6);
    n.style.transform = `translateY(${(1 - p) * 24}%) scale(${1 + (1 - p) * 0.35})`;
    n.style.filter = blur((1 - p) * 10);
  });
  const w = eio(seg(t, wipeA, wipeB)) * 100;
  L.bar.style.clipPath = `inset(-25% ${100 - w}% -25% 0)`;
  L.letters.style.clipPath = `polygon(0 -25%, 100% -25%, 100% 125%, ${w}% 125%, ${w}% 46.17%, 0 46.17%)`;
}
const ovl = $("#ovl");
const logo1 = makeLogo(800, 540, L.H / 2);
const DOT = [logo1.x + 0.4578 * 800, logo1.y + 0.6929 * logo1.hgt, 2.422 / 76.6 * 800];
const disc = h("div", "disc");
ovl.append(logo1.box, disc);

// Cardul pachetului
const ic = {
  site: "<svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='9'/><path d='M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z'/></svg>",
  clip: "<svg viewBox='0 0 24 24'><rect x='5' y='2.5' width='14' height='19' rx='3'/><path d='M10 9v6l5-3z'/></svg>",
  ads: "<svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='9'/><circle cx='12' cy='12' r='5'/><circle cx='12' cy='12' r='1.2'/></svg>",
  rep: "<svg viewBox='0 0 24 24'><path d='M4 20h16M7 16v-4M12 16V7M17 16v-6'/></svg>",
  crm: "<svg viewBox='0 0 24 24'><rect x='3' y='4' width='5' height='16' rx='1.5'/><rect x='9.5' y='4' width='5' height='11' rx='1.5'/><rect x='16' y='4' width='5' height='7' rx='1.5'/></svg>",
};
const tick = "<svg viewBox='0 0 24 24'><path d='M5 12.5l4.5 4.5L19 7.5'/></svg>";
const pkg = h("div", "pkg");
const pkgIn = h("div", "in", "", "<div class='tag'><b></b>Pachet nou</div><h2>Lansare</h2><div class='sub'>Site, conținut și reclame. O singură echipă.</div>");
const PROWS = [
  [ic.site, "Site de prezentare", "Până la 6 pagini, SEO de bază"],
  [ic.clip, "20 de clipuri TikTok și Reels", "Scripturi, filmare, editare"],
  [ic.ads, "Reclame Meta", "Pixel, conversii, 2 campanii"],
  [ic.crm, "CRM pentru cereri", "Toate sursele, într-un singur loc"],
  [ic.rep, "Raport lunar", "Ce merge și ce schimbăm"],
];
const prows = PROWS.map(([icon, a, b], i) => {
  const r = h("div", "prow", `top:${356 + i * 124}px`, `<div class="ic">${icon}</div><div><div class="a">${a}</div><div class="b">${b}</div></div><div class="ok">${tick}</div>`);
  pkgIn.append(r);
  return { r, ok: r.querySelector(".ok") };
});
const sheen = h("div", "sheen");
const search = h("div", "search", "inset:0", "<svg viewBox='0 0 24 24'><circle cx='11' cy='11' r='6.5'/><path d='m16 16 4.5 4.5'/></svg><span id='typed'></span><span class='caret' id='caret'></span>");
pkg.append(pkgIn, sheen, search);
ovl.append(pkg);
const logo2 = makeLogo(580, 540, L.endY - 210);
ovl.append(logo2.box);

// Texte
const txt = $("#txt");
function words(cls, html, style) {
  const n = h("div", cls, style || "", html);
  const ws = [...n.querySelectorAll(".w")];
  txt.append(n);
  return { n, ws };
}
const W = (s) => s.split(" ").map((w, i, a) => `<span class="w">${w}${i < a.length - 1 ? " " : ""}</span>`).join("");
// Cuvinte care intră „pac” (fiecare la momentul lui) și ies împreună
function slamAt(ws, t, times, tout) {
  ws.forEach((s, i) => {
    const p = pac(t, times[i], 0.26);
    const q = eio(seg(t, tout + i * 0.03, tout + i * 0.03 + 0.3));
    s.style.opacity = cl(p * 1.8) * (1 - q);
    s.style.transform = `translateY(${(1 - p) * 30 - q * 40}px) scale(${1 + (1 - p) * 0.3})`;
    s.style.filter = blur((1 - p) * 14 + q * 14);
  });
}
function wordsAt(ws, t, tin, tout, step = 0.06) {
  slamAt(ws, t, ws.map((_, i) => tin + i * step), tout || 999);
}
function chips(list) {
  const n = h("div", "pills");
  const cs = list.map((c) => { const s = h("span", "chip", "", c); n.append(s); return s; });
  txt.append(n);
  return cs;
}
function chipsAt(cs, t, times, tout) {
  cs.forEach((s, i) => {
    const p = pac(t, times[i], 0.26);
    const q = eio(seg(t, tout + i * 0.04, tout + i * 0.04 + 0.3));
    s.style.opacity = cl(p * 1.6) * (1 - q);
    s.style.transform = `translateY(${(1 - p) * 30 - q * 14}px) scale(${1.18 - 0.18 * p})`;
    s.style.filter = blur((1 - p) * 10 + q * 10);
  });
}

// Hook (măsura 0) și lista (măsura 1)
const hook = words("hook", `${W("Brandul tău")} <br>${W("are nevoie de")} <span class="w gold">4 </span><span class="w gold">lucruri.</span>`);
const HOOK_T = [T(0, 0) + 0.05, T(0, 0) + 0.05, T(0, 1), T(0, 1.5), T(0, 2), T(0, 2.5), T(0, 3)];
const list = h("div", "list");
const listRows = [["01", "Un site."], ["02", "Conținut."], ["03", "Reclame."], ["04", "Un CRM."]].map(([n, s]) => { const r = h("div", "li", "", `<small>${n}</small><span>${s}</span>`); list.append(r); return r; });
txt.append(list);
const flash = h("div", "flash");
$("#stage").append(flash);

const HL = [
  { ...words("hl", W("Site-ul tău.")), tin: T(4, 2), tout: T(7, 3) },
  { ...words("hl", W("20 de clipuri, gata de postat.")), tin: T(8, 1), tout: T(11, 2) },
  { ...words("hl", W("Reclame setate pe conversii.")), tin: T(12, 0), tout: T(15, 2) },
  { ...words("hl", W("Toate cererile, într-un singur loc.")), tin: T(16, 0), tout: T(19, 2) },
  { ...words("hl", W("Totul într-un singur pachet."), `top:${L.hlPkg}px`), tin: T(20, 0), tout: T(21, 3) },
];
const CH = [
  { cs: chips(["Design premium", "Până la 6 pagini", "SEO de bază"]), times: [T(5, 0), T(5, 1), T(5, 2)], tout: T(7, 3) },
  { cs: chips(["Scripturi și hook-uri", "Filmare", "Editare și subtitrare"]), times: [T(9, 0), T(9, 1), T(9, 2)], tout: T(11, 2) },
  { cs: chips(["Meta Ads", "Pixel și conversii", "2 campanii"]), times: [T(12, 2), T(12, 3), T(13, 0)], tout: T(15, 2) },
  { cs: chips(["Site", "TikTok și Meta", "WhatsApp"]), times: [T(17, 0), T(17, 1), T(17, 2)], tout: T(19, 2) },
];
const cta = words("cta", W("Cere oferta pe roby.media"));

// ------------------------------------------------------------------ Evenimente pentru sunet
const CLIP_T = (k) => T(8, 0) + k * BEAT / 2;
window.EVENTS = [
  ...HOOK_T.map((t, i) => ({ name: "hook." + i, t })),
  ...[0, 1, 2].map((i) => ({ name: "list." + i, t: T(1, i) })),
  { name: "drop", t: T(2) }, { name: "logo.wipe", t: T(2, 1) }, { name: "logo.rec", t: T(2, 2) },
  { name: "dot.squash", t: T(3, 2) }, { name: "dot.grow", t: T(3, 2.5) }, { name: "mac.reveal", t: H },
  ...siteParts.map((_, k) => ({ name: "site." + k, t: T(4, 1) + k * BEAT / 2 })),
  { name: "scroll.1", t: T(6, 0) }, { name: "scroll.2", t: T(6, 2) },
  ...FORM.map((_, i) => ({ name: "form." + i, t: T(7, 0) + i * BEAT * 0.5 })), { name: "form.send", t: T(7, 2) },
  ...[0, 1, 2, 3, 4].map((k) => ({ name: "clip." + k, t: CLIP_T(k) })),
  ...[0, 1, 2, 3].map((k) => ({ name: "caption." + k, t: T(10, k) })),
  { name: "clip.toSlot", t: T(11, 0) }, { name: "clip.land", t: T(11, 2) },
  { name: "pixel", t: T(12, 2) }, { name: "toggle.1", t: T(13, 0) }, { name: "toggle.2", t: T(13, 1) }, { name: "chart", t: T(13, 2) },
  ...[0, 1, 2].map((i) => ({ name: "toast." + i, t: T(14, i) })),
  { name: "crm.window", t: T(15, 3) },
  ...LEADS.map((l, i) => ({ name: "lead.in." + i, t: l.in })),
  ...LEADS.flatMap((l, i) => l.moves.map(([mt], j) => ({ name: `lead.move.${i}.${j}`, t: mt }))),
  { name: "lead.won", t: T(18, 0) },
  { name: "pkg.rise", t: T(19, 3) }, { name: "pkg.land", t: T(20, 0) },
  ...[0, 1, 2, 3, 4].map((i) => ({ name: "tick." + i, t: T(20, 1 + i) })),
  { name: "pkg.sheen", t: T(21, 1.5) }, { name: "pkg.morph", t: T(21, 3) }, { name: "logo2", t: T(22, 0) },
  ...[..."roby.media"].map((_, i) => ({ name: "type." + i, t: T(22, 1) + i * BEAT / 4 })),
  { name: "cta", t: T(23, 0) }, { name: "end", t: T(24) },
];
window.KICKS = KICKS;
window.BPM = BPM;
window.SONG = { bars: 24, drumsEnd: 22, pkgRise: T(19, 3) };

// ------------------------------------------------------------------ Cadru la timpul t
function camera(t) {
  const p = eox(seg(t, H, H + 2.2));
  const d = sine(seg(t, H + 0.8, T(21, 2)));
  return {
    S: lerp(HAND_S, L.S, p) * (1 + 0.07 * d),
    ax: lerp(-10, -16, p) + 4 * d,
    ay: lerp(0, -26, p) + 40 * d,
    f: mix(F_SCREEN, F_MAC, p),
  };
}

function renderAt(t) {
  // pompare pe kick (doar cât merg tobele)
  let punch = 0;
  for (const k of KICKS) if (t >= k && t - k < 0.5) punch += Math.exp(-(t - k) / 0.09);
  $("#stage").style.transform = `scale(${1 + 0.014 * cl(punch, 0, 1.4)})`;
  flash.style.opacity = t >= T(2) ? Math.exp(-(t - T(2)) / 0.12) : 0;

  const gIn = sine(seg(t, T(2) - 0.3, T(2) + 1.2));
  glows.forEach((g, i) => {
    g.n.style.left = `${g.x - g.s / 2 + Math.sin(t * 0.35 + i * 2) * 50}px`;
    g.n.style.top = `${g.y - g.s / 2 + Math.cos(t * 0.3 + i) * 40}px`;
    g.n.style.opacity = gIn;
  });

  // 0–1: hook și lista
  slamAt(hook.ws, t, HOOK_T, T(1, 0) - 0.12);
  hook.n.style.display = t < T(1, 0) + 0.4 ? "block" : "none";
  listRows.forEach((r, i) => {
    const p = pac(t, T(1, i), 0.26);
    const q = eio(seg(t, T(2) - 0.2 + i * 0.025, T(2) + 0.02 + i * 0.025));
    r.style.opacity = cl(p * 1.8) * (1 - q);
    r.style.transform = `translateX(${(1 - p) * -60}px) scale(${1 + (1 - p) * 0.2})`;
    r.style.filter = blur((1 - p) * 12 + q * 16);
  });
  list.style.display = t < T(2) + 0.2 ? "block" : "none";

  // 2–3: logo pe drop, punctul se aprinde, crește și devine ecranul
  logoAt(logo1, t, T(2), T(2, 1), T(2, 1.9));
  const lb = seg(t, T(3, 2.5), H);
  logo1.box.style.display = t >= T(2) - 0.05 && lb < 1 ? "block" : "none";
  logo1.box.style.opacity = 1 - seg(t, T(3, 2.6), T(3, 3.4));
  logo1.box.style.transform = `scale(${1 + 0.1 * lb})`;
  logo1.box.style.filter = blur(lb * 10);

  if (t < H && t >= T(2, 2)) {
    const squash = 1 - 0.1 * Math.sin(Math.PI / 2 * seg(t, T(3, 2), T(3, 2.5)));
    const g = eio(seg(t, T(3, 2.5), H));
    const d0 = DOT[2] * squash;
    const w = lerp(d0, 1080, g), hh = lerp(d0, SCREEN_H * HAND_S, g);
    const cx = lerp(DOT[0], 540, g), cy = lerp(DOT[1], L.cy, g);
    const r = (Math.min(w, hh) / 2) * (1 - g * g * g);
    const g3 = g * g * g;
    const col = mix([224, 161, 0], [22, 17, 13], seg(g, 0.25, 0.85)).map(Math.round);
    Object.assign(disc.style, {
      display: "block", left: `${cx - w / 2}px`, top: `${cy - hh / 2}px`, width: `${w}px`, height: `${hh}px`,
      borderRadius: `${r + 17 * g3}px ${r + 17 * g3}px ${r + 5 * g3}px ${r + 5 * g3}px`,
      background: `rgb(${col})`, opacity: pac(t, T(2, 2), 0.15),
      boxShadow: `0 0 ${40 * (1 - g)}px rgba(224,161,0,${0.6 * (1 - g)})`,
    });
  } else disc.style.display = "none";

  // 4–17: lumea 3D
  const ww = $("#worldWrap");
  const showWorld = t >= H && t < T(22, 2);
  ww.style.display = showWorld ? "block" : "none";
  if (showWorld) {
    const cam = camera(t);
    $("#world").style.transform = `translate3d(540px,${L.cy}px,0) scale3d(${cam.S},${cam.S},${cam.S}) rotateX(${cam.ax}deg) rotateY(${cam.ay}deg) translate3d(${-cam.f[0]}px,${-cam.f[1]}px,${-cam.f[2]}px)`;
    const mIn = sine(seg(t, H, H + 0.5));
    [shadow, base, lip, sideL, sideR, bezel, notch, ...slices].forEach((n) => (n.style.opacity = mIn));
    wall.style.opacity = sine(seg(t, H + 0.05, H + 0.6));
    menubar.style.opacity = sine(seg(t, H + 0.1, H + 0.5));
    glare.style.backgroundPosition = `${50 + cam.ay * 2.2}% 0`;

    // site: piesele pac pe optimi, apoi derulare pe beat și formular
    const sw = eox(seg(t, H + 0.08, H + 0.45));
    const sOut = sine(seg(t, T(9, 2), T(10, 0)));
    siteWin.style.opacity = sw * (1 - sOut);
    siteWin.style.transform = `scale(${0.93 + 0.07 * sw})`;
    siteParts.forEach((n, k) => {
      const p = pac(t, T(4, 1) + k * BEAT / 2, 0.3);
      n.style.opacity = cl(p * 1.5);
      n.style.transform = `translateY(${(1 - p) * 26}px) scale(${1 + (1 - p) * 0.08})`;
    });
    const sc = 460 * eio(seg(t, T(6, 0), T(6, 0) + 0.32)) + 440 * eio(seg(t, T(6, 2), T(6, 2) + 0.32));
    page.style.transform = `translateY(${-sc}px)`;
    FORM.forEach(([id, val], i) => {
      const t0 = T(7, 0) + i * BEAT * 0.5;
      const n = Math.floor(cl((t - t0) / 0.025, 0, val.length));
      $(id).textContent = t < t0 ? "" : val.slice(0, n);
    });
    const sent = pac(t, T(7, 2), 0.2);
    const fb = $("#fbtn");
    fb.textContent = t >= T(7, 2) ? "Trimis ✓" : "Trimite cererea";
    fb.style.background = t >= T(7, 2) ? "#2fbf55" : "#e0a100";
    fb.style.color = t >= T(7, 2) ? "#fff" : "#15120f";
    fb.style.transform = `scale(${t >= T(7, 2) ? 0.94 + 0.06 * sent : 1 - 0.05 * seg(t, T(7, 2) - 0.12, T(7, 2))})`;

    // panoul de reclame
    const dw = eox(seg(t, T(9, 2), T(10, 0)));
    const dOut = sine(seg(t, T(15, 3), T(16, 0)));
    dashWin.style.opacity = dw * (1 - dOut);
    crmAt(t);
    dashWin.style.transform = `scale(${0.96 + 0.04 * dw})`;
    const px = pac(t, T(12, 2), 0.25);
    $("#pxpill").style.opacity = cl(px * 1.5);
    $("#pxpill").style.transform = `scale(${1.3 - 0.3 * px})`;
    rows.forEach(({ tog }, i) => {
      const k = eox(seg(t, T(13, i), T(13, i) + 0.2));
      tog.style.background = `rgb(${mix([52, 48, 43], [224, 161, 0], k).map(Math.round)})`;
      tog.firstChild.style.transform = `translateX(${20 * k}px)`;
      tog.firstChild.style.background = k > 0.5 ? "#0b0a09" : "#f5f3ef";
    });
    const ch = eio(seg(t, T(13, 2), T(14, 2)));
    $("#cline").style.strokeDashoffset = String(1 - ch);
    $("#carea").style.opacity = ch * 0.9;
    toasts.forEach((n, i) => {
      const p = pac(t, T(14, i), 0.28);
      n.style.opacity = cl(p * 1.6);
      n.style.transform = `translateX(${(1 - p) * 60}px) scale(${1.1 - 0.1 * p})`;
    });

    // clipurile: pac-pac din ecran pe optimi, subtitrări schimbate pe beat, unul intră în campanie
    const q = eio(seg(t, T(11, 0), T(11, 2)));
    clips.forEach((c, i) => {
      const k = EMERGE_ORDER.indexOf(i);
      const e = eox(seg(t, CLIP_T(k), CLIP_T(k) + 0.5));
      if (e <= 0.001) { c.n.style.display = "none"; return; }
      c.n.style.display = "block";
      const fan = FAN[i];
      const bob = Math.sin(t * 1.3 + i * 1.7) * 6;
      const start = lidPoint(SCREEN_W / 2 + fan.x * 0.25, SCREEN_H / 2, 2);
      const fanPos = [fan.x, F_SCREEN[1] + fan.y + bob, 230 + fan.z];
      let pos = mix(start, fanPos, e);
      let ry = lerp(0, fan.ry - cam.ay * 0.85, e);
      let rx = lerp(10, -cam.ax * 0.85, e);
      let beatK = 0;
      for (let b = 0; b < 4; b++) { const tb = T(10, b); if (t >= tb) beatK = Math.exp(-(t - tb) / 0.1); }
      let sc = lerp(0.3, 1, e) * (1 + (i === 2 ? 0.07 : 0.025) * beatK);
      let op = cl(e * 3);
      if (i === 2) {
        op *= 1 - sine(seg(t, T(15, 3), T(16, 0)));
        pos = mix(pos, SLOT, q);
        ry = lerp(ry, 0, q); rx = lerp(rx, 10, q); sc = lerp(sc, SLOT_SCALE, q);
      } else {
        pos = [pos[0] * (1 + 1.1 * q), pos[1] - 80 * q, pos[2] + 260 * q];
        op *= 1 - q;
      }
      c.n.style.opacity = op;
      c.n.style.transform = `translate3d(${pos[0]}px,${pos[1]}px,${pos[2]}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${sc})`;
      c.img.style.transform = `scale(${1.05 + 0.04 * Math.sin(t * 0.5 + i)}) translateX(${Math.sin(t * 0.4 + i) * 4}%)`;
      c.bar.style.width = `${(((t - CLIP_T(0)) * 0.16 + i * 0.19) % 1) * 100}%`;
      const ci = t < T(10, 0) ? 0 : Math.min(c.caps.length - 1, Math.floor((t - T(10, 0)) / BEAT) % c.caps.length);
      if (c.cap.textContent !== c.caps[ci]) c.cap.textContent = c.caps[ci];
      c.heart.style.fill = t >= T(10, i % 4) + 0.05 && i !== 4 ? "#ff3b5c" : "#fff";
    });

    const blurK = sine(seg(t, T(19, 3), T(20, 0) + 0.4));
    ww.style.filter = blurK > 0 ? `blur(${14 * blurK}px) brightness(${1 - 0.55 * blurK})` : "none";
    ww.style.opacity = 1 - sine(seg(t, T(21, 2), T(22, 1)));
  }

  // 16–19: cardul pachetului → căutare
  const r = eox(seg(t, T(19, 3), T(20, 0) + 0.05));
  const pOn = t >= T(19, 3);
  pkg.style.display = pOn ? "block" : "none";
  if (pOn) {
    const m = eio(seg(t, T(21, 3), T(22, 1)));
    const land = t >= T(20) ? Math.exp(-(t - T(20)) / 0.12) : 0;
    const w = lerp(800, 860, m), hh = lerp(1000, 136, m);
    const k = lerp(L.pkgK, 1, m);
    Object.assign(pkg.style, {
      width: `${w}px`, height: `${hh}px`, margin: `${-hh / 2}px 0 0 ${-w / 2}px`, borderRadius: `${lerp(48, 68, m)}px`,
      top: `${lerp(L.pkgY, L.endY, m)}px`, opacity: cl(r * 2),
      transform: `translateY(${(1 - r) * 700}px) rotateX(${(1 - r) * 30}deg) scale(${k * (0.86 + 0.14 * r) * (1 - 0.03 * land)})`,
    });
    pkgIn.style.opacity = 1 - seg(t, T(21, 2.6), T(21, 3.1));
    prows.forEach(({ r: row, ok }, i) => {
      const p = pac(t, T(20, 0.5) + i * BEAT * 0.2, 0.3);
      row.style.opacity = cl(p * 1.5);
      row.style.transform = `translateY(${(1 - p) * 30}px)`;
      row.style.filter = blur((1 - p) * 10);
      const k = pac(t, T(20, 1 + i), 0.22);
      ok.style.opacity = cl(k * 2);
      ok.style.transform = `scale(${1.6 - 0.6 * k}) rotate(${(1 - k) * -40}deg)`;
    });
    sheen.style.backgroundPosition = `${100 - 100 * eio(seg(t, T(21, 1.5), T(21, 2.9)))}% 0`;
    sheen.style.opacity = 1 - m;
    search.style.opacity = seg(t, T(22, 0.6), T(22, 1));
    const n = Math.floor(cl((t - T(22, 1)) / (BEAT / 4) + 1, 0, 10));
    $("#typed").textContent = "roby.media".slice(0, t < T(22, 1) ? 0 : n);
    $("#caret").style.opacity = t < T(23) || (t - T(23)) % BEAT < BEAT / 2 ? 1 : 0;
  }
  logoAt(logo2, t, T(22, 0), T(22, 1), T(22, 2));
  logo2.box.style.display = t >= T(22, 0) - 0.05 ? "block" : "none";

  // texte
  HL.forEach((x) => wordsAt(x.ws, t, x.tin, x.tout));
  CH.forEach((x) => chipsAt(x.cs, t, x.times, x.tout));
  wordsAt(cta.ws, t, T(23, 0), 0, BEAT / 2);
}

// Aplică layout-ul formatului ales
(function applyLayout() {
  document.documentElement.style.height = document.body.style.height = `${L.H}px`;
  $("#worldWrap").style.perspectiveOrigin = `540px ${L.cy}px`;
  $("#ovl").style.perspectiveOrigin = `540px ${L.pkgY}px`;
  document.querySelectorAll(".hl").forEach((n) => { n.style.fontSize = `${L.hlSize}px`; if (!n.style.top) n.style.top = `${L.hlTop}px`; });
  document.querySelectorAll(".pills").forEach((n) => (n.style.top = `${L.pills}px`));
  hook.n.style.top = `${L.H / 2 - 260}px`;
  list.style.top = `${L.H / 2 - 290}px`;
  cta.n.style.top = `${L.endY + 120}px`;
  pkg.style.top = `${L.pkgY}px`;
})();

window.FPS = FPS;
window.DURATION = DURATION;
window.renderAt = renderAt;
window.ready = Promise.all([
  document.fonts.load("700 40px Manrope"), document.fonts.ready,
  ...["light-leak", "bokeh", "anamorphic-flare"].map((n) => { const i = new Image(); i.src = `assets/${n}.webp`; return i.decode(); }),
]).then(() => renderAt(0));
