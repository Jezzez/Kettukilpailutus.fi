import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, BookOpen } from "lucide-react";
import BlogList from "@/components/BlogList";
import Reveal from "@/components/Reveal";
import TailSweep from "@/components/fox/TailSweep";
import { getPosts, OG_IMAGE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ketun oppaat – Fiksummat päätökset alkavat tiedosta.",
  description:
    "Ketun oppaat: selkeitä, myyntipuheettomia artikkeleita luottokorteista, koroista, matkustamisesta ja rahan säästämisestä.",
  alternates: { canonical: "/blogi" },
  /*
    OMA OG-LOHKO, VAIKKA `title` JA `description` OVAT JO YLLÄ.

    Next.js ei johda openGraphia sivun `title`-kentästä. Ilman tätä lohkoa
    sivu perii juuritason openGraphin sellaisenaan, eli jaettu linkki
    oppaisiin näyttäisi WhatsAppissa etusivun otsikon ja kuvauksen.
    Vastaanottaja klikkaisi odottaen etusivua ja saisi artikkelilistan —
    ja väärä lupaus linkin esikatselussa on juuri se kohta, jossa jakaminen
    lakkaa tuomasta kävijöitä.
  */
  openGraph: {
    title: "Ketun oppaat – Fiksummat päätökset alkavat tiedosta.",
    description:
      "Selkeitä, myyntipuheettomia oppaita sähköstä, koroista ja rahan säästämisestä.",
    url: "/blogi",
    // Pakko toistaa: sivun oma openGraph-lohko korvaa juuritason lohkon
    // kokonaan, jolloin kuva katoaisi. Ks. OG_IMAGE lib/data.ts.
    images: [OG_IMAGE],
  },
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
        <div
  aria-hidden
  className="pointer-events-none absolute inset-0 z-0 overflow-hidden md:hidden"
>
  <Image
    src="/kettukirjatuoli.png"
    alt=""
    width={1024}
    height={1536}
    priority
    className="absolute bottom-[-2%] right-[-14%] h-[100%] w-auto max-w-none object-contain opacity-40"
    style={{
      WebkitMaskImage:
        "linear-gradient(to left, #000 18%, transparent 100%)",
      maskImage:
        "linear-gradient(to left, #000 18%, transparent 100%)",
    }}
  />
</div>
        <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-8 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:pb-20 md:pt-16">
          <div>
            <Reveal>
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                Älä maksa ketunhäntää kainalossa
              </span>
              <h1 className="mt-4 font-hero text-[2.7rem] leading-[1.03] text-cream sm:text-[3.6rem]">
                Fiksummat päätökset<br />
                <em className="text-goldInk">Alkavat</em> tiedosta.
              </h1>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink/90">
                Kettu avaa sopimusten pikkupräntin ja kertoo, mitä se tarkoittaa lompakollesi. Oppaat auttavat sinua tekemään taloutesi kannalta parempia päätöksiä.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#oppaat"
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-cream px-6 py-3.5 font-display text-[15px] font-bold text-[#A83E0A] shadow-lift transition-all hover:bg-[#FFFFFF] active:scale-[0.98]"
                >
                  Selaa {posts.length} opasta
                  <ArrowDown size={17} className="transition-transform group-hover:translate-y-0.5" aria-hidden />
                </a>
                <span className="inline-flex items-center gap-2 text-[13px] font-medium text-ink/80">
                  <BookOpen size={15} className="text-goldInk" aria-hidden />
                  Selkeästi ja ilman myyntipuhetta
                </span>
              </div>
            </Reveal>
          </div>

          {/*
            KETTU ON PIILOSSA MOBIILISSA. Oppaissa taitteen alle pitää mahtua
            ensimmäinen artikkeliotsikko — se on tämän sivun ainoa klikki.
            Puhelimessa kuva veisi juuri sen rivin.
          */}
          <Reveal delay={0.15} className="relative mx-auto hidden h-[520px] w-full max-w-[560px] md:block">
            {/*
              Uusi lähdekuva on pystysuuntainen ja hahmo täyttää koko
              kuvan. Se keskitetään suoraan palstaan ja pidetään samassa
              540 px korkeudessa kuin aiempi hero-Kettu.
            */}
            <Image
              src="/kettukirjatuoli.png"
              alt="Kettu lukemassa kirjaa nojatuolissa"
              width={1024}
              height={1536}
              priority
              className="absolute bottom-0 left-1/2 h-[540px] w-auto max-w-none -translate-x-1/2 object-contain drop-shadow-[0_24px_42px_rgba(80,28,2,0.38)]"
            />
          </Reveal>
        </div>

        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={24} />
        </div>
      </section>

      <div id="oppaat" className="mx-auto max-w-[1180px] scroll-mt-24 px-4 pb-16 pt-8 sm:px-6">
        <Reveal>
          <BlogList posts={posts} />
        </Reveal>
      </div>
    </>
  );
}
