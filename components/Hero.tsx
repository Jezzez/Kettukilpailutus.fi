"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Play, Scale } from "lucide-react";
import HeroKettu from "./mascot/HeroKettu";

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
    <section className="den-surface relative overflow-hidden">
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-8 px-4 pb-12 pt-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:pb-16 md:pt-16">
        <div>
          <motion.div {...fadeUp(0)} className="mb-4 flex items-center gap-3">
            <span className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-gold">
              Luottokortit
            </span>
            <span className="gold-rule w-16" aria-hidden />
          </motion.div>

          <motion.h1
            {...fadeUp(0)}
            className="font-display text-[2.6rem] font-extrabold leading-[1.04] tracking-tight text-cream sm:text-[3.4rem]"
          >
            Löydä itsellesi
            <br />
            <span className="text-accent">paras</span> luottokortti.
          </motion.h1>

          <motion.p {...fadeUp(0.08)} className="mt-5 max-w-md text-[16.5px] leading-relaxed text-cream/72">
            Vertaa kaikki tärkeimmät kortit nopeasti ja löydä sinulle sopivin vaihtoehto.
          </motion.p>

          <motion.ul {...fadeUp(0.14)} className="mt-6 flex flex-wrap gap-x-7 gap-y-2.5">
            {CHECKS.map((c) => (
              <li key={c} className="flex items-center gap-2 text-[14.5px] font-medium text-cream/80">
                <Check size={15} strokeWidth={3} className="text-gold" aria-hidden />
                {c}
              </li>
            ))}
          </motion.ul>

          <motion.div {...fadeUp(0.2)} className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href="#vertailu"
              className="group inline-flex items-center gap-2.5 btn-ember rounded-xl px-8 py-4 font-display text-[15.5px] font-bold text-cream transition-all active:scale-[0.98]"
            >
              Aloita vertailu
              <ArrowRight size={19} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href="#nain-toimimme"
              className="inline-flex items-center gap-2.5 rounded-xl border border-cream/15 bg-cream/5 px-6 py-4 font-display text-[15.5px] font-bold text-cream backdrop-blur transition-colors hover:bg-cream/10"
            >
              <Play size={14} className="fill-gold text-gold" aria-hidden />
              Miten se toimii?
            </Link>
          </motion.div>

          {/* Todennettava tosiasia keksityn käyttäjämäärän tilalla. */}
          <motion.p {...fadeUp(0.26)} className="mt-7 text-[13.5px] text-cream/68">
            <span className="font-data font-bold text-cream">{cardCount}</span> korttia
            vertailussa · järjestys perustuu sopivuuteen, ei palkkioon
          </motion.p>
        </div>

        {/* Kettu + arviolaatikko */}
        <motion.div {...fadeUp(0.15)} className="relative mx-auto w-full max-w-[520px]">
          <div className="ember-glow relative"><HeroKettu height={540} /></div>

          {/*
            Keksityn asiakaskommentin tilalla lupaus, jonka voimme pitää.
            Tämä on myös sivuston ainoa oikea kilpailuetu: rehellisyys.
          */}
          <motion.div
            {...fadeUp(0.5)}
            className="absolute -bottom-2 -left-4 w-[17.5rem] rounded-2xl border border-line bg-white p-4 shadow-cardHover sm:left-0"
          >
            <p className="flex items-center gap-2 font-display text-[13px] font-bold text-ink">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                <Scale size={14} aria-hidden />
              </span>
              Järjestys ei ole myynnissä
            </p>
            <p className="mt-2 text-[13px] leading-snug text-ink/72">
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
