/**
 * Contur mare de cameră foto în fundalul hero-ului. Fiecare linie se desenează pe rând
 * (stroke-dashoffset, CSS pur, `.cam-draw` în globals.css), stă puțin, apoi dispare și bucla reia.
 * Cu mișcare redusă: desenul apare static, complet.
 */
const PATHS = [
  // corpul
  "M38 52H202Q222 52 222 72V150Q222 170 202 170H38Q18 170 18 150V72Q18 52 38 52Z",
  // cocoașa vizorului
  "M78 52L90 30H150L162 52",
  // obiectiv: inel exterior, inel interior
  "M162 111A42 42 0 1 0 78 111A42 42 0 1 0 162 111Z",
  "M146 111A26 26 0 1 0 94 111A26 26 0 1 0 146 111Z",
  // reflexia din obiectiv
  "M108 98Q114 92 122 92",
  // declanșator
  "M34 52V44Q34 40 38 40H58Q62 40 62 44V52",
  // blitz
  "M182 66H204V80H182Z",
];

export function HeroCamera() {
  return (
    <svg
      viewBox="0 0 240 190"
      aria-hidden="true"
      className="cam-draw pointer-events-none absolute top-[7%] -right-[18%] w-[105vw] max-w-none text-gold opacity-35 [&_path]:[stroke-width:1.1] md:top-1/2 md:right-[5%] md:w-[min(46vw,660px)] md:-translate-y-1/2 md:opacity-30 md:[&_path]:[stroke-width:0.6]"
    >
      {PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
