"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Play, Scale } from "lucide-react";
import HeroKettu from "./mascot/HeroKettu";
import Kettu from "./mascot/Kettu";
import BrushRule from "./BrushRule";
import TailSweep from "./fox/TailSweep";

const CHECKS = ["Puolueetonta vertailua", "Avoin laskenta", "Ilmainen palvelu"];

/**
 * HUOM: tästä herosta on poistettu keksitty sosiaalinen todiste —
 * medialogot, käyttäjämäärä, tähtiarvio ja nimetty asiakaskommentti.
 * Palvelu ei ole ollut esillä noissa medioissa eikä sillä ole arvioita,
 * joten väitteet olivat harhaanjohtavaa markkinointia (KSL 2 luku).
 * Älä palauta mitään lukua tähän ennen kuin se on todennettavissa.
 */
export default function Hero({ cardCount }: { cardCount: number }) {
  const reduce = useReducedMotion();
  const fadeUp = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.21, 0.65, 0.36, 1] as const },
        };

  return (
    /*
      Sama oranssi vyö kuin sähkösivun herossa. Perustelu on siellä
      kirjoitettu auki: vaalea hero ei anna silmälle mitään mihin
      tarttua, ja tumma hero saa oranssin napin lakkaamaan olemasta
      ruudun kuumin piste. Vyö tekee molemmat oikein.

      Yhtenäisyys on tässä oma arvonsa: kortti- ja sähkövertailu ovat
      saman brändin kaksi tuotetta, ja jos ne avautuvat eri värisinä,
      kävijä ei tunnista siirtyneensä saman talon sisällä. Se maksaa
      juuri niitä ristiinklikkauksia, joilla toinen vertikaali kasvaa.
    */
    <section className="theme-ember ember-surface relative overflow-hidden">
      <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-8 px-4 pb-20 pt-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-16">
        <div>
          <motion.div {...fadeUp(0)} className="mb-4 flex items-center gap-3">
            {/*
              `text-accentDark` kääntyisi tässä vaaleaksi kermaksi ja
              silmäotsikko katoaisi oranssiin. `goldInk` on ember-teemassa
              luettava kulta — sama sävy kuin sähkösivun herossa.
            */}
            <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
              Luottokortit
            </span>
            <BrushRule className="text-goldInk/70" width={64} />
          </motion.div>

          <motion.h1
            {...fadeUp(0)}
            className="font-hero text-[2.6rem] leading-[1.04] text-cream sm:text-[3.4rem]"
          >
            Löydä itsellesi
            <br />
            <em className="text-goldInk">paras</em> luottokortti.
          </motion.h1>

          <motion.p {...fadeUp(0.08)} className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/85">
            Vertaa kaikki tärkeimmät kortit nopeasti ja löydä sinulle sopivin vaihtoehto.
          </motion.p>

          {/*
            Mobiilissa Kettu on tässä, luottamusrivin vieressä — ei omana
            osionaan. Iso 540 px:n maskotti vei mobiilissa kokonaisen
            ruudullisen ennen ensimmäistäkään korttia, eli käyttäjän piti
            selata koristeen ohi päästäkseen työkaluun. Sama ratkaisu kuin
            sähkösivulla: brändi näkyy, mutta ei maksa klikkiä.
          */}
          <motion.div {...fadeUp(0.14)} className="mt-6 flex items-start gap-3">
            <ul className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-7">
              {CHECKS.map((c) => (
                <li key={c} className="flex items-center gap-2 text-[14.5px] font-medium text-ink/85">
                  <Check size={15} strokeWidth={3} className="text-goldInk" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
            {/* `halo-glow` on kermanvalkoinen hehku — se erottaa hahmon
                oranssista pohjasta. `dawn-glow` oli tehty vaaleaa pohjaa
                varten eikä näkyisi tässä lainkaan. */}
            <div className="halo-glow relative -mb-8 -mt-3 shrink-0 md:hidden">
              <Kettu pose="kortti" height={148} priority />
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="mt-8 flex flex-wrap items-center gap-3.5">
            {/*
              PÄÄNAPPI ON KERMANVALKOINEN, EI ORANSSI.

              `btn-ember` on oranssi nappi — oranssilla vyöllä se lakkaa
              olemasta nappi ja sulautuu taustaan. Vyön päällä napin
              tehtävä on olla ruudun ainoa vaalea piste, jolloin katse
              osuu siihen ennen kuin ehtii lukea otsikkoa.

              Tekstin väri on KIINTEÄ `#A83E0A` eikä `text-accentDark`:
              teemamuuttuja kääntyy ember-vyöllä vaaleaksi kermaksi, ja
              teksti katoaisi kermanvalkoisen napin sisään. Sama sävy
              kuin `.ember-surface`-pohjassa, eli ei uutta väriä.
            */}
            <Link
              href="#vertailu"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-cream px-8 py-4 font-display text-[15.5px] font-bold text-[#A83E0A] shadow-lift transition-all hover:bg-white active:scale-[0.98]"
            >
              Aloita vertailu
              <ArrowRight size={19} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            {/*
              Toissijainen nappi on läpinäkyvä ja reunoiltaan kermainen.
              `bg-white` tarkoittaa ember-teemassa oranssia (muuttuja
              kääntyy), joten valkoinen laatikko olisi ollut oranssi
              laatikko oranssilla pohjalla. Reunanappi pitää hierarkian
              selvänä: yksi täytetty nappi, yksi ääriviivanappi.
            */}
            <Link
              href="#nain-toimimme"
              className="inline-flex items-center gap-2.5 rounded-xl border border-cream/45 px-6 py-4 font-display text-[15.5px] font-bold text-cream transition-colors hover:border-cream hover:bg-cream/10"
            >
              <Play size={14} className="fill-cream/70 text-cream/70" aria-hidden />
              Miten se toimii?
            </Link>
          </motion.div>

          {/* Todennettava tosiasia keksityn käyttäjämäärän tilalla. */}
          <motion.p {...fadeUp(0.26)} className="mt-7 text-[13.5px] text-ink/75">
            <span className="font-data font-bold text-cream">{cardCount}</span> korttia
            vertailussa · järjestys perustuu sopivuuteen, ei palkkioon
          </motion.p>
        </div>

        {/* Kettu + lupauslaatikko */}
        <motion.div {...fadeUp(0.15)} className="relative mx-auto w-full max-w-[520px]">
          <div className="halo-glow relative hidden md:block"><HeroKettu height={540} /></div>

          {/*
            Keksityn asiakaskommentin tilalla lupaus, jonka voimme pitää.
            Tämä on myös sivuston ainoa oikea kilpailuetu: rehellisyys.
            Mobiilissa laatikko on normaalissa tekstivirrassa (ei absoluuttinen),
            koska ilman isoa Kettua sillä ei ole enää mitään minkä päälle asettua.

            `theme-light`-kääre pakottaa muuttujat vaaleiksi, vaikka koko osio
            on ember. Ilman sitä `bg-white` olisi oranssi ja laatikko sulaisi
            vyöhön. Vaalea kortti oranssilla pohjalla on myös se kontrasti,
            joka saa lupauksen luetuksi — se on sivun ainoa kilpailuetu.
          */}
          <motion.div
            {...fadeUp(0.5)}
            className="theme-light rounded-2xl border border-line bg-white p-4 shadow-cardHover md:absolute md:-bottom-2 md:left-0 md:w-[17.5rem]"
          >
            <p className="flex items-center gap-2 font-display text-[13px] font-bold text-ink">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accentSoft text-accentDark">
                <Scale size={14} aria-hidden />
              </span>
              Järjestys ei ole myynnissä
            </p>
            <p className="mt-2 text-[13px] leading-snug text-ink/70">
              Saamme palkkion vasta kun haet kortin. Se ei muuta lukuja eikä
              paikkoja vertailussa — myöskään silloin, kun paras kortti on se,
              josta emme saa mitään.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/*
        Oranssi vyö päättyy ketunhännän kaareen, ei suoraan viivaan.
        Sama laite kuin sähkösivun herossa — vaakasuora leikkaus näyttää
        siltä, että kaksi eri sivua on liimattu yhteen, kaari taas vie
        katseen alaspäin seuraavaan osioon.

        `theme-light`-kääre pakottaa `--c-paper`-muuttujan ratkeamaan
        ALAPUOLISEN vyöhykkeen vaaleaksi eikä tämän osion oranssiksi.
      */}
      <div className="theme-light">
        <TailSweep fill="rgb(var(--c-paper))" height={64} />
      </div>
    </section>
  );
}
