import { ProcessScene } from "@/components/motion/process-scene";

/**
 * Cronologie de proces. Desktop: pași pe orizontală cu o linie aurie care se umple la scroll
 * (secțiunea se fixează, vezi ProcessScene). Mobil și mișcare redusă: listă verticală statică.
 */
export function ProcessSteps({ steps }: { steps: { title: string; text: string }[] }) {
  const cols = steps.length >= 5 ? "lg:grid-cols-5" : steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <div data-process className="relative">
      {/* Șina orizontală (desktop) */}
      <div aria-hidden="true" className="absolute inset-x-0 top-[1.125rem] hidden h-px bg-line lg:block">
        <div data-process-fill className="h-full origin-left bg-gold lg:scale-x-100" />
      </div>
      <ol className={`relative grid gap-0 pl-[1.125rem] lg:gap-8 lg:pl-0 ${cols}`}>
        {steps.map((s, i) => (
          <li
            key={i}
            data-process-step
            className="relative grid grid-cols-[2.25rem_1fr] gap-x-5 border-l border-line pb-10 pl-0 last:pb-0 lg:block lg:border-l-0 lg:pb-0"
          >
            <span
              data-process-dot
              className="relative z-[1] -ml-[1.15rem] flex h-9 w-9 items-center justify-center border border-gold bg-ink font-display text-sm text-gold tabular-nums lg:ml-0"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="lg:mt-8">
              <h3 className="text-xl font-bold">{s.title}</h3>
              <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-relaxed text-muted">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <ProcessScene />
    </div>
  );
}
