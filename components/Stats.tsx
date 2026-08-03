"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Vain lukuja, jotka pitävät paikkansa ja jotka lukija voi itse tarkistaa.
 * Aiemmat "10 000+ kuukausittaista kävijää" ja "98 % käyttäjistä löysi
 * sopivan kortin" olivat keksittyjä. Älä palauta mitään lukua tähän ennen
 * kuin se on mitattu ja lähde on kerrottavissa.
 */
const buildStats = (cardCount: number) => [
  { value: cardCount, suffix: "", label: "korttia vertailussa" },
  { value: 0, suffix: " €", label: "mitä vertailu maksaa sinulle" },
  { value: 14, suffix: " vrk", label: "peruutusoikeus verkkohaussa" },
];

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-ink sm:text-5xl">
      {n.toLocaleString("fi-FI")}{suffix}
    </span>
  );
}

export default function Stats({ cardCount }: { cardCount: number }) {
  return (
    <section aria-label="Tilastot" className="px-4 py-4 sm:px-6">
      {/*
        Kolme lukua ilman erottimia ja liian väljällä pystypaddingilla luki
        yhtenä leveänä beessinä laatikkona — luvut hukkuivat tyhjään.
        Pystyviivat tekevät niistä kolme erillistä väitettä, jolloin silmä
        pysähtyy jokaiseen. Nämä ovat sivun tarkistettavissa olevia lupauksia
        (ilmainen, 14 vrk peruutusoikeus), joten niiden pitää myös näyttää
        väitteiltä eikä koristeelta.
      */}
      <div className="pelt-surface mx-auto grid max-w-[1180px] gap-10 rounded-3xl border border-gold/30 px-8 py-11 md:grid-cols-3 md:gap-0 md:divide-x md:divide-gold/25 md:py-12">
        {buildStats(cardCount).map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="text-center"
          >
            <CountUp value={s.value} suffix={s.suffix} />
            <p className="mt-2 text-sm text-ink/70">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
