/**
 * După `next build`, copiază public/ și .next/static/ în .next/standalone/,
 * ca serverul autonom (node .next/standalone/server.js) să servească și fișierele statice.
 * Folosit pentru VPS (PM2) și Docker. Pe Netlify nu strică nimic.
 */
import { cpSync, existsSync } from "node:fs";

if (existsSync(".next/standalone")) {
  cpSync("public", ".next/standalone/public", { recursive: true });
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
  console.log("✓ public/ și .next/static/ copiate în .next/standalone/");
}
