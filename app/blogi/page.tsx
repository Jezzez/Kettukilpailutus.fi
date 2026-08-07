import type { Metadata } from "next";
import BlogList from "@/components/BlogList";
import Reveal from "@/components/Reveal";
import Kettu from "@/components/mascot/Kettu";
import TailSweep from "@/components/fox/TailSweep";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ketun oppaat – Fiksummat päätökset alkavat tiedosta.",
  description:
    "Ketun oppaat: selkeitä, myyntipuheettomia artikkeleita luottokorteista, koroista, matkustamisesta ja rahan säästämisestä.",
  alternates: { canonical: "/blogi" },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <>
      {/*
        OPPAIDEN HERO ON SAMAN KOKOINEN KUIN MUIDENKIN SIVUJEN.

        MIKSI ORANSSI VYÖ: oppaat ovat sivuston SEO-sisääntulo. Hakukoneesta
        tuleva kävijä ei ole valinnut brändiä — hän on valinnut aiheen, ja
        hänen täytyy tunnistaa ensimmäisessä sekunnissa mihin palveluun hän
        laskeutui, jotta artikkelin lopun vertailulinkki tuntuisi saman
        talon jatkoksi eikä mainokselta.

        MIKSI TÄYSIKOKOINEN: tässä oli aiemmin tarkoituksella matala vyö
        sillä perusteella, että oppaat ovat lukemisen alku eikä myyntisivu.
        Peruste ei kestänyt katsetta: kun sama kävijä siirtyy oppaasta
        etusivulle tai sähkövertailuun, hän kohtaa kaksi eri kokoista
        sisääntuloa, ja eri mittainen hero luetaan eri sivustoksi. Yhtenäinen
        mitta on brändin halvin luottamussignaali, ja luottamus on tässä
        bisnesmalli — vertailulinkkiä ei paineta sivustolla, joka näyttää
        kootun eri paikoista.

        Mitat ovat samat kuin /lainat- ja etusivun herossa: sama ruudukko,
        sama otsikkokoko, sama pystytäyte. Älä säädä vain tätä sivua.
      */}
      <section className="theme-ember ember-surface relative overflow-hidden">
        <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-8 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:pb-20 md:pt-16">
          <div>
            <Reveal>
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                Ketun oppaat
              </span>
              <h1 className="mt-4 font-hero text-[2.7rem] leading-[1.03] text-cream sm:text-[3.6rem]">
                Fiksummat päätökset<br />
                <em className="text-goldInk">Alkavat</em> tiedosta.
              </h1>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink/90">
                Kettu purkaa pienellä kirjoitetut ehdot, selittää vaikeat termit ja näyttää, mitä ne
                tarkoittavat oikeasti euroissasi. Jokainen opas on kirjoitettu auttamaan sinua
                tekemään paremman päätöksen.
              </p>
            </Reveal>
          </div>

          {/*
            KETTU ON PIILOSSA MOBIILISSA. Oppaissa taitteen alle pitää mahtua
            ensimmäinen artikkeliotsikko — se on tämän sivun ainoa klikki.
            Puhelimessa kuva veisi juuri sen rivin.
          */}
          <Reveal delay={0.15} className="relative mx-auto hidden w-full max-w-[520px] md:block">
            {/*
              KORKEUS ON 500, EI 430. Seisova asento on setin kapein
              (0,33:1), joten 430 pikselillä hahmo olisi vain 140 px leveä
              runsaassa 500 pikselin palstassa — kapea tikku keskellä
              oranssia lukee keskeneräiseltä. 500 antaa noin 163 px, ja
              jalat asettuvat häntäaallon päälle kuten muillakin sivuilla.
            */}
            <div className="halo-glow relative flex justify-center">
              <Kettu pose="seisoo" height={500} priority />
            </div>
          </Reveal>
        </div>

        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={64} />
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-4 pb-16 pt-8 sm:px-6">
        <Reveal>
          <BlogList posts={posts} />
        </Reveal>
      </div>
    </>
  );
}
