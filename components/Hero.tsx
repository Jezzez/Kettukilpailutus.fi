"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Play, Scale } from "lucide-react";
import HeroKettu from "./mascot/HeroKettu";
import Kettu from "./mascot/Kettu";
import BrushRule from "./BrushRule";

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
    <section className="theme-light dawn-surface relative overflow-hidden">
      <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-8 px-4 pb-12 pt-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:pb-16 md:pt-16">
        <div>
          <motion.div {...fadeUp(0)} className="mb-4 flex items-center gap-3">
            <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-accentDark">
              Luottokortit
            </span>
            <BrushRule className="text-accent/70" width={64} />
          </motion.div>

          <motion.h1
            {...fadeUp(0)}
            className="font-hero text-[2.6rem] leading-[1.04] text-ink sm:text-[3.4rem]"
          >
            Löydä itsellesi
            <br />
            <em className="text-accentDark">paras</em> luottokortti.
          </motion.h1>

          <motion.p {...fadeUp(0.08)} className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/70">
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
                <li key={c} className="flex items-center gap-2 text-[14.5px] font-medium text-ink/70">
                  <Check size={15} strokeWidth={3} className="text-ink/40" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
            <div className="dawn-glow relative -mb-8 -mt-3 shrink-0 md:hidden">
              <Kettu pose="kortti" height={148} priority />
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href="#vertailu"
              className="group inline-flex items-center gap-2.5 btn-ember rounded-xl px-8 py-4 font-display text-[15.5px] font-bold text-onEmber transition-all active:scale-[0.98]"
            >
              Aloita vertailu
              <ArrowRight size={19} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href="#nain-toimimme"
              className="inline-flex items-center gap-2.5 rounded-xl border border-lineDark bg-white px-6 py-4 font-display text-[15.5px] font-bold text-ink shadow-card transition-colors hover:border-ink/30"
            >
              <Play size={14} className="fill-ink/45 text-ink/45" aria-hidden />
              Miten se toimii?
            </Link>
          </motion.div>

          {/* Todennettava tosiasia keksityn käyttäjämäärän tilalla. */}
          <motion.p {...fadeUp(0.26)} className="mt-7 text-[13.5px] text-ink/60">
            <span className="font-data font-bold text-ink">{cardCount}</span> korttia
            vertailussa · järjestys perustuu sopivuuteen, ei palkkioon
          </motion.p>
        </div>

        {/* Kettu + lupauslaatikko */}
        <motion.div {...fadeUp(0.15)} className="relative mx-auto w-full max-w-[520px]">
          <div className="ember-glow relative hidden md:block"><HeroKettu height={540} /></div>

          {/*
            Keksityn asiakaskommentin tilalla lupaus, jonka voimme pitää.
            Tämä on myös sivuston ainoa oikea kilpailuetu: rehellisyys.
            Mobiilissa laatikko on normaalissa tekstivirrassa (ei absoluuttinen),
            koska ilman isoa Kettua sillä ei ole enää mitään minkä päälle asettua.
          */}
          <motion.div
            {...fadeUp(0.5)}
            className="rounded-2xl border border-line bg-white p-4 shadow-cardHover md:absolute md:-bottom-2 md:left-0 md:w-[17.5rem]"
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
    </section>
  );
}
