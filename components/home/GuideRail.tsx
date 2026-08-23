import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionMark from "@/components/home/SectionMark";
import type { Post } from "@/lib/types";

/*
  OPPAAT — VAAKARULLA MOBIILISSA, RUUDUKKO DESKTOPISSA.

  MIKSI RULLA. Kolme korttia allekkain vie puhelimessa noin 900 pikseliä,
  eli lähes kaksi näytöllistä, ja ne ovat sivun VÄHITEN tuottava osio:
  blogiin siirtynyt kävijä on siirtynyt pois kilpailutusnapin luota. Osio
  ansaitsee paikkansa, koska osa kävijöistä ei ole vielä valmis
  vertailemaan ja poistuisi muuten kokonaan — mutta se ei ansaitse kahta
  näytöllistä. Vaakarulla vie yhden kortin verran korkeutta ja näyttää
  silti kolme.

  KOLMAS KORTTI KURKISTAA REUNASTA TARKOITUKSELLA. Kortti on 78 vh leveä,
  jolloin seuraavan reuna jää näkyviin ja rulla lukee rullaksi. Täyteen
  leveyteen sovitettu kortti näyttää yhdeltä kortilta, eikä kukaan pyyhkäise
  sivuun.
*/

function fiDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

export default function GuideRail({ posts }: { posts: Post[] }) {
  const shown = posts.slice(0, 3);

  return (
    <section className="theme-light bg-mist px-5 py-20 sm:px-8 md:py-28 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <SectionMark index="04" total="04">
            Oppaat
          </SectionMark>

          <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <h2 className="max-w-[15ch] font-hero text-[clamp(2.3rem,8vw,4rem)] leading-[0.96]">
              Etkö ole vielä valmis vertailemaan?
            </h2>
            <Link
              href="/blogi"
              className="group inline-flex shrink-0 items-center gap-2 font-display text-[15px] font-bold text-accentDark"
            >
              Kaikki oppaat
              <ArrowRight
                size={17}
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
      </div>

      {/*
        Rulla vuotaa tarkoituksella osion sivupehmusteiden yli (`-mx-5`),
        jotta ensimmäinen kortti alkaa samalta linjalta kuin otsikko mutta
        viimeinen voi liukua ruudun reunan yli. Sisään jäävä rulla näyttää
        laatikolta laatikon sisällä.
      */}
      <Reveal delay={0.05}>
        <div className="scrollbar-none -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 md:mx-auto md:grid md:max-w-[1180px] md:grid-cols-3 md:overflow-visible md:px-0 lg:-mx-0">
          {shown.map((post) => (
            <Link
              key={post.slug}
              href={`/blogi/${post.slug}`}
              className="lift group flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col rounded-2xl border border-line bg-white p-6 shadow-card md:w-auto md:max-w-none"
            >
              <div className="flex items-center justify-between text-[12px] text-ink/50">
                <span className="font-display font-bold uppercase tracking-[0.14em] text-goldInk">
                  {post.category}
                </span>
                <span>{post.readMinutes} min</span>
              </div>

              <h3 className="mt-6 font-hero text-[1.25rem] leading-tight group-hover:text-accentDark">
                {post.title}
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/65">
                {post.excerpt}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[12px] text-ink/50">
                <span>{fiDateShort(post.date)}</span>
                <ChevronRight
                  size={17}
                  aria-hidden
                  className="text-accentDark transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
