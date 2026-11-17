import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/ui/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { StatsCounter } from "@/components/sections/stats";
import { CTASection } from "@/components/sections/cta-section";
import { ServiceIcon } from "@/components/icons";
import { getStats } from "@/lib/content";
import type { Locale } from "@/lib/content/schemas";
import { path } from "@/lib/routes";

const GEAR_ICONS = ["camera", "drone", "star", "mic", "film", "scissors"] as const;

export async function AboutView({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "about" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const story = t.raw("story") as string[];
  const stats = getStats();
  const gear = t.raw("gear") as { title: string; text: string }[];
  const values = t.raw("values") as { title: string; text: string }[];

  return (
    <>
      <PageHero
        crumbs={[
          { name: tn("home"), path: path("home", locale) },
          { name: tn("about"), path: path("about", locale) },
        ]}
        crumbLabel={tn("breadcrumb")}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={<p>{t("intro")}</p>}
      />

      <Section labelledBy="story-title">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeader id="story-title" title={t("storyTitle")} className="mb-0! lg:sticky lg:top-28" />
          </div>
          <div className="lg:col-span-7">
            <div className="space-y-5 text-lg leading-relaxed text-fg/85">
              {story.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {/* Cifrele apar doar când content/stats.json are cifre reale. */}
            {stats.length > 0 && (
              <div className="mt-12">
                <StatsCounter stats={stats.map((s) => ({ ...s, label: s.label[locale] }))} locale={locale} />
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section labelledBy="gear-title" className="border-t border-line">
        <SectionHeader id="gear-title" title={t("gearTitle")} intro={<p>{t("gearIntro")}</p>} />
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {gear.map((g, i) => (
            <Reveal as="li" key={i} delay={(i % 3) * 0.05} className="bg-ink p-7 md:p-8">
              <ServiceIcon name={GEAR_ICONS[i] ?? "camera"} className="h-8 w-8 text-gold" />
              <h3 className="mt-6 font-display text-2xl">{g.title}</h3>
              <p className="mt-3 text-muted">{g.text}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="surface" labelledBy="values-title">
        <SectionHeader id="values-title" title={t("valuesTitle")} />
        <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal as="li" key={i} delay={i * 0.06} className="border-t-2 border-gold pt-6">
              <h3 className="font-display text-2xl">{v.title}</h3>
              <p className="mt-3 text-muted">{v.text}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CTASection locale={locale} />
    </>
  );
}
