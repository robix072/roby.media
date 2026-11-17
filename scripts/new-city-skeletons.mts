/**
 * Creează scheletele paginilor de oraș care lipsesc (ready: false → noindex, nu apar în sitemap).
 * Rulare: node scripts/new-city-skeletons.mts
 * Nu suprascrie fișierele existente. Util după ce adăugați un oraș nou în content/cities.json.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "content");
const cities = JSON.parse(readFileSync(join(root, "cities.json"), "utf8")).items;
const services = JSON.parse(readFileSync(join(root, "local-services.json"), "utf8")).items;

const kw: Record<string, { h: string; t: string; d: string; wa: string }> = {
  "filmare-nunta": { h: "Filmare nuntă", t: "videograf de nuntă", d: "Filmare de nuntă cinematică 4K", wa: "filmare nuntă" },
  "videoclip-prezentare-firma": { h: "Videoclip de prezentare firmă", t: "videoclip de prezentare", d: "Videoclipuri de prezentare pentru firme", wa: "un videoclip de prezentare" },
  "filmare-drona": { h: "Filmare cu drona", t: "filmare aeriană", d: "Filmare și fotografie cu drona 4K", wa: "filmare cu drona" },
  "agentie-marketing": { h: "Agenție de marketing și social media", t: "marketing și social media", d: "Marketing TikTok, social media și reclame", wa: "servicii de marketing și social media" },
  "creare-site": { h: "Creare site", t: "creare site", d: "Site-uri de prezentare și magazine online", wa: "crearea unui site" },
};

let n = 0;
for (const s of services) {
  mkdirSync(join(root, "city-pages", s.id), { recursive: true });
  for (const c of cities) {
    const file = join(root, "city-pages", s.id, `${c.id}.json`);
    if (existsSync(file)) continue;
    const k = kw[s.id] ?? { h: s.name, t: s.name.toLowerCase(), d: s.name, wa: s.name.toLowerCase() };
    const page = {
      _comment: `Pagina /${s.slugPrefix}-${c.id}. SCHELET: are noindex și nu apare în sitemap până puneți "ready": true.`,
      _TODO: [
        `Scrieți un paragraf introductiv propriu pentru ${c.name} (intro), nu copiat din alt oraș.`,
        `Completați „local” cu locații, zone sau industrii reale din ${c.name}.`,
        "Adăugați 3–5 întrebări FAQ locale.",
        "Când conținutul e complet și unic, puneți \"ready\": true.",
      ],
      ready: false,
      service: s.id,
      city: c.id,
      metaTitle: `${k.h} ${c.name} | Roby Media`,
      metaDescription: `${k.d} ${c.inName}. Echipă care se deplasează în tot județul ${c.county}. Cereți o ofertă pe WhatsApp sau prin formular.`,
      h1: `${k.h} ${c.inName}`,
      subtitle: `${k.d} ${c.inName} și în județul ${c.county}.`,
      summary: [
        `Lucrăm ${c.inName} și în localitățile din județul ${c.county}.`,
        "Ofertă clară, primită de regulă în aceeași zi lucrătoare.",
        "Contract, factură și termene de livrare stabilite de la început.",
      ],
      intro: [`TODO: paragraf introductiv unic despre ${k.t} ${c.inName}.`],
      local: {
        title: `${k.h} ${c.inName}: ce trebuie să știți`,
        text: `TODO: context local pentru ${c.name}.`,
        items: [{ title: "TODO", text: `TODO: locație, zonă sau industrie relevantă din ${c.name}.` }],
      },
      travel: {
        title: `Deplasare ${c.inName}`,
        text: `Echipa noastră se deplasează ${c.inName} și în județul ${c.county}. Costul deplasării, dacă există, apare transparent în ofertă.`,
      },
      faq: [
        { q: `Lucrați ${c.inName}?`, a: `Da. Lucrăm cu clienți ${c.inName} și din tot județul ${c.county}. Costul deplasării apare transparent în ofertă.` },
        { q: "Cât de repede primim o ofertă?", a: "De regulă în aceeași zi lucrătoare. Cel mai rapid ne găsiți pe WhatsApp sau la telefon." },
        { q: "Lucrați pe bază de contract?", a: "Da. ROBY MEDIA SRL emite factură, iar livrabilele, termenele și plățile sunt trecute în contract." },
      ],
      whatsapp: `Bună ziua, aș dori o ofertă pentru ${k.wa} ${c.inName}.`,
    };
    writeFileSync(file, JSON.stringify(page, null, 2) + "\n");
    n++;
  }
}
console.log(`${n} schelete create.`);
