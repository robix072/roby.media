import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { anton, manrope } from "../fonts";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConversionBar } from "@/components/layout/conversion-bar";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { JsonLd } from "@/components/ui/json-ld";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { organizationLd, SITE_URL } from "@/lib/seo";
import { path } from "@/lib/routes";
import { AmbientBackground } from "@/components/motion/ambient-background";
import type { Locale } from "@/lib/content/schemas";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Roby Media",
  formatDetection: { telephone: false },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Mesajele trimise în browser: doar ce folosesc componentele client.
const CLIENT_NAMESPACES = ["form", "cookies"] as const;

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const all = (await getMessages()) as Record<string, unknown>;
  const messages = Object.fromEntries(CLIENT_NAMESPACES.map((k) => [k, all[k]]));
  const l = locale as Locale;
  const skip = l === "ro" ? "Sari la conținut" : "Skip to content";

  return (
    <html lang={l === "ro" ? "ro" : "en"} className={`${anton.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        {/* Marchează că JavaScript rulează, înainte de prima randare (pentru animațiile de apariție). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="grain min-h-screen">
        <a href="#continut" className="sr-only z-[100] bg-gold px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          {skip}
        </a>
        <AmbientBackground />
        <NextIntlClientProvider locale={l} messages={messages}>
          <Providers>
            <Header locale={l} />
            <main id="continut">{children}</main>
            <Footer locale={l} />
            <ConversionBar locale={l} />
            <CookieConsent policyHref={path("cookies", l)} />
            <RevealObserver />
          </Providers>
        </NextIntlClientProvider>
        <JsonLd data={organizationLd(l)} />
      </body>
    </html>
  );
}
