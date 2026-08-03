"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import FoxPaw from "../FoxPaw";

/**
 * "KETTU LASKEE" — maskotti tuotteen sisällä.
 *
 * MIKSI TÄMÄ ON OLEMASSA: slogan lupaa, että Kettu kilpailuttaa
 * käyttäjän puolesta, mutta käyttöliittymässä Kettu ei tähän asti
 * tehnyt mitään — hän seisoi herossa kuvana. Kun kulutusluku muuttuu ja
 * hinnat päivittyvät välittömästi, käyttäjä ei näe että työtä tehtiin;
 * hän näkee vain numeroiden vaihtuvan. Puolen sekunnin näkyvä laskenta
 * kertoo, että joku laski ne — ja se joku on Kettu.
 *
 * MIKSI SE ON NÄIN LYHYT: tämä on keinotekoinen viive, ja keinotekoinen
 * viive on lähtökohtaisesti tuoton vihollinen. 420 ms on riittävä, jotta
 * silmä ehtii rekisteröidä tapahtuman, mutta lyhyempi kuin se raja
 * (~1 s), jossa odottaminen alkaa tuntua odottamiselta. Pidempi
 * animaatio olisi maskotin hemmottelua käyttäjän kustannuksella.
 *
 * MIKSI SE EI ESTÄ MITÄÄN: tulokset ovat koko ajan näkyvissä ja
 * klikattavissa animaation alla. Jos käyttäjä on jo löytänyt haluamansa
 * sopimuksen, mikään ei tule hänen ja "Tee sopimus" -napin väliin.
 *
 * Liikeherkkyysasetus ohittaa koko efektin: `prefers-reduced-motion`
 * -tilassa mitään ei animoida eikä viivettä ole.
 */

/**
 * Palauttaa `true` lyhyen hetken aina kun `trigger` muuttuu.
 * Ensimmäisellä renderöinnillä palauttaa `false` — sivun latautuminen
 * ei ole uudelleenlaskenta, eikä siitä pidä näyttää ilmoitusta.
 */
export function useFoxComputing(trigger: unknown, ms = 420): boolean {
  const [busy, setBusy] = useState(false);
  const first = useRef(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce) return;
    setBusy(true);
    const t = setTimeout(() => setBusy(false), ms);
    return () => clearTimeout(t);
  }, [trigger, ms, reduce]);

  return busy;
}

export default function FoxComputing({ show }: { show: boolean }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="pointer-events-none inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/[0.10] px-3 py-1.5"
          role="status"
          aria-live="polite"
        >
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-goldInk">
            Kettu laskee
          </span>
          {/* Kolme tassua, jotka syttyvät peräkkäin — jälki, joka etenee. */}
          <span className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="inline-flex text-goldInk"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 0.62,
                  repeat: Infinity,
                  delay: i * 0.14,
                  ease: "easeInOut",
                }}
                style={{ transform: `rotate(${8}deg)` }}
              >
                <FoxPaw size={9} />
              </motion.span>
            ))}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
