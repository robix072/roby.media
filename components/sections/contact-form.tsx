"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m } from "framer-motion";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { ContactSchema, BUDGETS } from "@/lib/contact-schema";
import { track } from "@/lib/analytics";
import { buttonClass } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { cn } from "@/lib/format";

type ServiceOption = { id: string; name: string; group: string };
type Status = "idle" | "sending" | "success" | "error" | "rate";

const field =
  "mt-2 block w-full border border-line bg-ink px-4 py-3.5 text-base text-fg placeholder:text-muted/60 transition-colors focus:border-gold focus:outline-none aria-[invalid=true]:border-red-400";
const label = "text-sm font-semibold text-fg/90";

export function ContactForm({
  services, locale, privacyHref, whatsappNumber, defaultService,
}: {
  services: ServiceOption[];
  locale: "ro" | "en";
  privacyHref: string;
  whatsappNumber: string;
  defaultService?: string;
}) {
  const t = useTranslations("form");
  const [preset, setPreset] = useState(defaultService ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startedAt] = useState(() => Date.now());
  const [sentService, setSentService] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  // Preselectează serviciul din ?serviciu=... (linkurile „Cere ofertă” de pe paginile de servicii).
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("serviciu");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- citim URL-ul doar pe client
    if (s && services.some((x) => x.id === s)) setPreset(s);
  }, [services]);

  const groups = [...new Set(services.map((s) => s.group))];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      service: String(fd.get("service") ?? ""),
      budget: String(fd.get("budget") ?? ""),
      city: String(fd.get("city") ?? ""),
      message: String(fd.get("message") ?? ""),
      gdpr: fd.get("gdpr") === "on",
      website: String(fd.get("website") ?? ""),
      startedAt,
      locale,
      sourcePage: typeof document !== "undefined" ? (document.referrer || window.location.href).slice(0, 300) : "",
    };
    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) {
        const k = String(i.path[0]);
        if (!errs[k]) errs[k] = t(`errors.${k}` as "errors.name");
      }
      setErrors(errs);
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.status === 429) return setStatus("rate");
      const json = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !json.ok) return setStatus("error");
      setSentService(services.find((s) => s.id === data.service)?.name ?? "");
      track("lead", { service: data.service, budget: data.budget });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const waText =
    locale === "ro"
      ? `Bună ziua, tocmai v-am trimis o cerere de ofertă pe site${sentService ? ` pentru ${sentService}` : ""}.`
      : `Hello, I've just sent a quote request on your website${sentService ? ` for ${sentService}` : ""}.`;

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1.5 text-sm text-red-300">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-error` : undefined });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <m.div
          key="ok"
          ref={successRef}
          tabIndex={-1}
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gold/50 bg-surface p-8 text-center outline-none md:p-12"
        >
          <CheckCircle2 className="mx-auto h-14 w-14 text-gold" aria-hidden="true" />
          <h3 className="mt-6 font-display text-3xl md:text-4xl">{t("successTitle")}</h3>
          <p className="mx-auto mt-4 max-w-md text-muted">{t("successText")}</p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp"
            className={buttonClass("primary", "lg", "mt-8")}
          >
            <WhatsAppIcon className="h-5 w-5" /> {t("successWhatsapp")}
          </a>
        </m.div>
      ) : (
        <m.form key="form" ref={formRef} onSubmit={onSubmit} noValidate initial={false} exit={{ opacity: 0 }} className="relative grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className={label}>{t("name")} *</label>
            <input id="cf-name" name="name" autoComplete="name" required className={field} {...aria("name")} />
            {err("name")}
          </div>
          <div>
            <label htmlFor="cf-company" className={label}>
              {t("company")} <span className="font-normal text-muted">({t("optional")})</span>
            </label>
            <input id="cf-company" name="company" autoComplete="organization" className={field} />
          </div>
          <div>
            <label htmlFor="cf-phone" className={label}>{t("phone")} *</label>
            <input id="cf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="07xx xxx xxx" className={field} {...aria("phone")} />
            {err("phone")}
          </div>
          <div>
            <label htmlFor="cf-email" className={label}>{t("email")} *</label>
            <input id="cf-email" name="email" type="email" autoComplete="email" required className={field} {...aria("email")} />
            {err("email")}
          </div>
          <div>
            <label htmlFor="cf-service" className={label}>{t("service")}</label>
            <select id="cf-service" name="service" defaultValue={preset} key={preset} className={cn(field, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%23E0A100%22 stroke-width=%221.5%22/></svg>')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10")}>
              <option value="">{t("servicePlaceholder")}</option>
              {groups.map((g) => (
                <optgroup key={g} label={g}>
                  {services.filter((s) => s.group === g).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
              ))}
              <option value="altceva">{t("serviceOther")}</option>
            </select>
          </div>
          <div>
            <label htmlFor="cf-budget" className={label}>{t("budget")}</label>
            <select id="cf-budget" name="budget" defaultValue="" className={cn(field, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%23E0A100%22 stroke-width=%221.5%22/></svg>')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10")}>
              <option value="">{t("budgetPlaceholder")}</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b}>{t(`budgets.${b}`)}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cf-city" className={label}>{t("city")}</label>
            <input id="cf-city" name="city" autoComplete="address-level2" className={field} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cf-message" className={label}>{t("message")}</label>
            <textarea id="cf-message" name="message" rows={5} placeholder={t("messagePlaceholder")} className={cn(field, "resize-y")} {...aria("message")} />
            {err("message")}
          </div>
          {/* Honeypot: invizibil pentru oameni, completat doar de roboți */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="cf-website">Website</label>
            <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
              <input type="checkbox" name="gdpr" required className="mt-0.5 h-5 w-5 shrink-0 accent-[#E0A100]" {...aria("gdpr")} />
              <span>
                {t("gdpr")}{" "}
                <Link href={privacyHref} className="text-fg underline underline-offset-2 hover:text-gold">{t("gdprLink")}</Link>. *
              </span>
            </label>
            {err("gdpr")}
          </div>
          <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
            <button type="submit" disabled={status === "sending"} className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
              {status === "sending" ? (
                <><Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> {t("sending")}</>
              ) : (
                <>{t("submit")} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></>
              )}
            </button>
            <p role="alert" aria-live="polite" className="text-sm text-red-300">
              {status === "error" ? t("error") : status === "rate" ? t("rateLimited") : ""}
            </p>
          </div>
        </m.form>
      )}
    </AnimatePresence>
  );
}
