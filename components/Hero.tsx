"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Play, Star } from "lucide-react";
import HeroKettu from "./mascot/HeroKettu";

const CHECKS = ["Puolueetonta vertailua", "Ajantasaiset edut", "Ilmainen palvelu"];
const MEDIA = ["Iltalehti", "Taloussanomat", "mtv", "Kauppalehti"];

/** Pienet käyttäjäkasvot: piirretty SVG:nä, ei kuvatiedostoja. */
function Avatars() {
  const tones = ["#E7C9A9", "#C99B76", "#EBD3B8", "#B98457"];
  return (
    <div className="flex -space-x-2.5" aria-hidden>
      {tones.map((t, i) => (
        <svg key={i} width="30" height="30" viewBox="0 0 32 32" className="rounded-full ring-2 ring-den">
          <circle cx="16" cy="16" r="16" fill={t} />
          <circle cx="16" cy="12.5" r="5.5" fill="#5B4534" opacity="0.55" />
          <path d="M4 32 C6 23 26 23 28 32 Z" fill="#5B4534" opacity="0.55" />
        </svg>
      ))}
    </div>
  );
}

export default function Hero() {
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

          <motion.div {...fadeUp(0.26)} className="mt-7 flex items-center gap-3">
            <Avatars />
            <p className="text-[13.5px] text-cream/68">
              Yli <span className="font-data font-bold text-cream">45 000</span> suomalaista
              löytänyt paremman kortin
            </p>
          </motion.div>

          <motion.ul {...fadeUp(0.32)} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            {MEDIA.map((m) => (
              <li
                key={m}
                className="font-display text-[15px] font-bold tracking-tight text-cream/25"
              >
                {m}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Kettu + arviolaatikko */}
        <motion.div {...fadeUp(0.15)} className="relative mx-auto w-full max-w-[520px]">
          <div className="ember-glow relative"><HeroKettu height={540} /></div>

          <motion.figure
            {...fadeUp(0.5)}
            className="absolute -bottom-2 -left-4 w-[17.5rem] rounded-2xl border border-line bg-white p-4 shadow-cardHover sm:left-0"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/15 text-[13px] font-bold text-accent">
                4
              </span>
              <span className="font-display text-[15px] font-bold text-ink">4,9 / 5</span>
              <span className="flex" aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-star text-star" />
                ))}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-ink/58">2 382 arviota</p>
            <blockquote className="mt-2.5 text-[14px] font-medium leading-snug text-ink">
              ”Säästin 480 € vuodessa vaihtamalla korttia.”
            </blockquote>
            <figcaption className="mt-1.5 text-[12px] text-ink/62">– Joni, Helsinki</figcaption>
          </motion.figure>
        </motion.div>
      </div>
    </section>
  );
}
