import Link from "next/link";
import { anton, manrope } from "./fonts";

// 404 pentru adrese care nu se potrivesc niciunei rute (fără layout de limbă).
export default function GlobalNotFound() {
  return (
    <html lang="ro" className={`${anton.variable} ${manrope.variable}`}>
      <body className="grain flex min-h-screen items-center bg-ink text-fg">
        <main className="container-x py-24">
          <p className="font-display text-[10rem] leading-none text-gold md:text-[16rem]">404</p>
          <h1 className="mt-2 font-display text-5xl md:text-7xl">Cadrul ăsta nu există.</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">Pagina căutată a fost mutată sau nu a existat niciodată. / This page doesn&apos;t exist.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex h-14 items-center bg-gold px-7 font-semibold text-ink hover:bg-gold-hover">Înapoi la pagina principală</Link>
            <Link href="/en" className="inline-flex h-14 items-center border border-fg/25 px-7 font-semibold hover:border-gold hover:text-gold">English</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
