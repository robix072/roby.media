/**
 * Evenimente de conversie. Se trimit doar la platformele încărcate (adică doar după acordul pentru cookie-uri).
 */
type W = Window & {
  gtag?: (...a: unknown[]) => void;
  fbq?: (...a: unknown[]) => void;
  ttq?: { track: (e: string, p?: Record<string, unknown>) => void };
};

export type ConversionEvent = "phone" | "whatsapp" | "email" | "quote_click" | "lead";

const MAP: Record<ConversionEvent, { ga: string; meta: [string, string]; tiktok: string }> = {
  phone: { ga: "click_phone", meta: ["track", "Contact"], tiktok: "Contact" },
  whatsapp: { ga: "click_whatsapp", meta: ["track", "Contact"], tiktok: "Contact" },
  email: { ga: "click_email", meta: ["track", "Contact"], tiktok: "Contact" },
  quote_click: { ga: "click_quote", meta: ["trackCustom", "QuoteClick"], tiktok: "ClickButton" },
  lead: { ga: "generate_lead", meta: ["track", "Lead"], tiktok: "SubmitForm" },
};

export function track(event: ConversionEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as W;
  const m = MAP[event];
  const p = { page_path: window.location.pathname, ...params };
  try {
    w.gtag?.("event", m.ga, p);
    w.fbq?.(m.meta[0], m.meta[1], p);
    w.ttq?.track(m.tiktok, p);
  } catch {
    /* ignorăm erorile de tracking */
  }
}

export const CONSENT_KEY = "roby-consent-v1";
export type Consent = { analytics: boolean; marketing: boolean; ts: number };

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function writeConsent(c: Omit<Consent, "ts">) {
  const value: Consent = { ...c, ts: Date.now() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    /* stocare indisponibilă */
  }
  window.dispatchEvent(new CustomEvent("roby:consent", { detail: value }));
}
