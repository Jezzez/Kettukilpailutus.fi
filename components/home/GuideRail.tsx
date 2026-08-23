import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/home/Eyebrow";
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

  KOLMAS KORTTI KURKISTAA REUNASTA TARKOITUKSELLA. Kortti on 78 vw leveä,
  jolloin seuraavan reuna jää näkyviin ja rulla lukee rullaksi. Täyteen
  leveyteen sovitettu kortti näyttää yhdeltä kortilta, eikä kukaan
  pyyhkäise sivuun.
*/

function fiDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}

export default function GuideRail({ posts }: { posts: Post[] }) {
  const shown = posts.slice(0, 3);

  return (
    <section className="theme-light bg-mist py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          <Eyebrow>Oppaat</Eyebrow>

          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="max-w-[18ch] font-hero text-[clamp(2rem,6vw,3.2rem)] leading-[0.98]">
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
        Rulla on osiotason elementti, ei otsikkopalstan sisällä: sillä on
        sama vasen pehmuste kuin otsikolla, mutta oikea reuna jatkuu ruudun
        yli. Laatikon sisään suljettu rulla näyttää laatikolta laatikon
        sisällä, eikä kukaan pyyhkäise sivuun.

        `scroll-pl-4` EI OLE KORISTE. Ilman sitä `snap-mandatory` kohdistaa
        ensimmäisen kortin rullan reunaan eikä sen pehmusteeseen: selain
        asettaa `scrollLeft`-arvoksi 16, ja kortti latoutuu kiinni ruudun
        vasempaan reunaan, vaikka otsikko alkaa 16 pikselin päästä. Mitattu
        390 pikselin leveydellä. Rikkinäinen vasen linja on juuri se, mistä
        sivu näyttää keskeneräiseltä.
      */}
      <Reveal delay={0.05}>
        <div className="scrollbar-none mt-9 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-pl-6 sm:px-6 md:mx-auto md:grid md:max-w-[1180px] md:grid-cols-3 md:overflow-visible">
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

              <h3 className="mt-5 font-hero text-[1.2rem] leading-tight group-hover:text-accentDark">
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
