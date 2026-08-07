"use client";

import { motion, useReducedMotion } from "framer-motion";
import Kettu, { type KettuPose } from "./Kettu";

/**
 * Heron Kettu: saapuu kerran ja elää sen jälkeen hillitysti.
 * Ei puhekuplia — maskotti on läsnä, ei äänessä.
 *
 * YKSI ASENTO, EI VAIHTELUA. Tässä oli ajastin, joka vaihtoi asennon
 * "osoittaa" → "peukku" 14 sekunnin välein ja takaisin 4,2 sekunnin
 * kuluttua. Se poistettiin kahdesta syystä:
 *
 * 1) Se oli kaksi eri kettua samassa paikassa. Maskotti on brändin
 *    ydin, ja tunnistettavuus syntyy toistosta — jos etusivun hahmo
 *    vaihtuu toiseksi kesken katselun, kävijälle ei jää mieleen yhtä
 *    kuvaa vaan kaksi puolikasta.
 * 2) Vaihto tapahtui 14 sekunnin kohdalla eli keskellä lukemista, ja
 *    liike perifeerisessä näkökentässä vetää katseen pois tekstistä.
 *    Tämän heron ainoa tehtävä on saada katse kermanvalkoiseen nappiin;
 *    kaikki muu liike kilpailee sen kanssa.
 *
 * ASENTO ON "TUOLISSA" — SAMA KUIN LAINASIVUN HEROSSA. Jessen valinta.
 * Se on kuvasarjan ainoa asento, jossa hahmo on puvussa ja istuu
 * rennosti: asiantuntija, ei myyjä. Huomaa, että FoxSlot.tsx:n
 * `lainaHero`-kommentti perustelee tuon kuvan olevan vain lainasivulla,
 * jotta lainavertikaali erottuisi silmälle. Se peruste ei enää pidä —
 * jos lainasivulle halutaan taas oma ilme, se tarvitsee uuden kuvan.
 *
 * Jos kortit avataan joskus, `pose="kortti"` on edelleen olemassa.
 */
const pose: KettuPose = "tuolissa";

export default function HeroKettu({ height = 560 }: { height?: number }) {
  const reduce = useReducedMotion();

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
