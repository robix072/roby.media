import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Imagine Open Graph 1200×630 generată dinamic, în stilul brandului. /api/og?title=...&kicker=... */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Roby Media").slice(0, 110).normalize("NFC").toLocaleUpperCase("ro-RO");
  const kicker = (searchParams.get("kicker") || "Producție video · Reclame · Marketing").slice(0, 60);
  const [anton, manrope] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Anton.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Manrope.ttf")),
  ]);
  const size = title.length > 60 ? 64 : title.length > 36 ? 80 : 104;
  const corner = (pos: Record<string, number>, rot: number) => (
    <div style={{ position: "absolute", width: 44, height: 44, borderTop: "3px solid #F5F5F5", borderLeft: "3px solid #F5F5F5", opacity: 0.5, transform: `rotate(${rot}deg)`, ...pos }} />
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0A0A0A", padding: "72px 80px", position: "relative", fontFamily: "Manrope" }}>
        {corner({ top: 32, left: 32 }, 0)}
        {corner({ top: 32, right: 32 }, 90)}
        {corner({ bottom: 32, right: 32 }, 180)}
        {corner({ bottom: 32, left: 32 }, 270)}
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#E0A100", fontSize: 26, fontWeight: 600 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#E0A100" }} />
          {kicker}
        </div>
        {/* Fără lineHeight explicit: în satori, lineHeight deplasează semnele diacritice (Ș, Ț, Ă, Î). */}
        <div style={{ display: "flex", flexWrap: "wrap", fontFamily: "Anton", fontSize: size, color: "#F5F5F5", maxWidth: 1040 }}>
          {title.split(/\s+/).map((w, i) => (
            <span key={i} style={{ marginRight: size * 0.22 }}>{w}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", fontFamily: "Anton", fontSize: 44, color: "#F5F5F5", textTransform: "uppercase" }}>
            Roby<span style={{ color: "#E0A100", marginLeft: 12 }}>Media</span>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#A3A3A3" }}>roby.media</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Anton", data: anton, weight: 400, style: "normal" },
        { name: "Manrope", data: manrope, weight: 600, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
    },
  );
}
