"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Kettu, { type KettuPose } from "./Kettu";

/**
 * Heron Kettu: saapuu kerran ja elää sen jälkeen hillitysti.
 * Ei puhekuplia — maskotti on läsnä, ei äänessä.
 *
 * PERUSASENTO ON "OSOITTAA", EI "KORTTI". Kun korttivertailu on
 * piilotettu, etusivun maskotti ei voi pidellä luottokorttia: kävijä
 * lukee kuvasta lupauksen, jota navigaatiosta ei löydy, ja ristiriita
 * kuvan ja valikon välillä luetaan huolimattomuutena juuri sivuston
 * ensimmäisessä sekunnissa. Kun kortit avataan, vaihda `base` takaisin
 * arvoon "kortti".
 */
const base: KettuPose = "osoittaa";
const alt: KettuPose = "peukku";
export default function HeroKettu({ height = 560 }: { height?: number }) {
  const reduce = useReducedMotion();
  const [pose, setPose] = useState<KettuPose>(base);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reduce) return;
    const loop = setInterval(() => {
      setPose((p) => (p === base ? alt : base));
      timers.current.push(setTimeout(() => setPose(base), 4200));
    }, 14000);

    return () => {
      clearInterval(loop);
      timers.current.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <motion.div
      className="relative flex justify-center"
      initial={reduce ? false : { opacity: 0, x: 50, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.15 }}
    >
      <Kettu pose={pose} height={height} priority />
    </motion.div>
  );
}
