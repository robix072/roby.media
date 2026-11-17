import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ContactSchema } from "@/lib/contact-schema";
import { getServices } from "@/lib/content";
import site from "@/content/site.json";
import { isHolder } from "@/lib/links";

/* Rate limit simplu, în memorie: max. 5 cereri / 10 minute / IP (per instanță). */
const WINDOW = 10 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] },
      { status: 400 },
    );
  }
  const d = parsed.data;

  // Spam: honeypot completat sau formular trimis în mai puțin de 3 secunde → răspundem „ok”, dar nu trimitem.
  if (d.website || (d.startedAt && Date.now() - d.startedAt < 3000)) {
    return NextResponse.json({ ok: true });
  }

  const service = getServices().find((s) => s.id === d.service);
  const serviceName = service ? service.ro.name : d.service || "-";
  const rows: [string, string][] = [
    ["Nume", d.name],
    ["Firmă", d.company || "-"],
    ["Telefon", d.phone],
    ["Email", d.email],
    ["Serviciu", serviceName],
    ["Buget", d.budget || "-"],
    ["Oraș", d.city || "-"],
    ["Limba", d.locale.toUpperCase()],
    ["Pagina sursă", d.sourcePage || "-"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMesaj:\n${d.message || "-"}`;
  const html = `<h2 style="font-family:Arial,sans-serif">Cerere nouă de ofertă – ${esc(serviceName)}</h2>
<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#666">${esc(k)}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>
<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;border-top:1px solid #ddd;padding-top:12px">${esc(d.message || "-")}</p>`;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, MAIL_FROM, MAIL_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] SMTP neconfigurat. Mesajul ar fi fost:\n" + text);
      return NextResponse.json({ ok: true, dev: true });
    }
    console.error("[contact] SMTP neconfigurat: completați variabilele SMTP_* (vezi .env.example).");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 465),
      secure: SMTP_SECURE ? SMTP_SECURE === "true" : Number(SMTP_PORT || 465) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: MAIL_FROM || `"${site.name} – Site" <${SMTP_USER}>`,
      to: MAIL_TO || (isHolder(site.email) ? SMTP_USER : site.email),
      replyTo: `"${d.name.replace(/"/g, "")}" <${d.email}>`,
      subject: `Cerere ofertă: ${serviceName} – ${d.name}${d.city ? ` (${d.city})` : ""}`,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Eroare SMTP:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
