"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Lightbulb } from "lucide-react";

/*
  KETUN VINKIT — LATAUSNÄKYMÄN VAIHTUVAT FAKTAT.

  Jessen pyyntö 26.10.2026: latauksessa ei näytetä laskelmia sopimuksista
  (vertailulaskuri poistettiin), vaan Edisonin lamppufakta ja muita
  vaihtuvia juttuja, kun Kettu sytyttää lampun.

  ILME: iOS. Jessen toive oli, että latausnäkymä tuntuu Applen tekemältä.
  Siksi tässä (ja vain tässä näkymässä) on järjestelmäfontti, joka on
  Apple-laitteilla SF Pro, lasimainen kortti, isot pehmeät kulmat ja iOS:n
  tapa vaihtaa sisältöä: vanha teksti sumenee pois ja uusi tarkentuu esiin
  samalla kun ne liukuvat ristiin. Värit pysyvät DESIGN.md:n kahdessa:
  oranssi on vain hehkulampun kuvakkeessa.

  JOKAINEN LAUSE ON TARKISTETTU. Tämä on sama sääntö kuin sopimushinnoissa:
  sivun ansaintamalli on se, että siihen luotetaan, eikä latausruudun
  hauska fakta saa olla keksitty. Lähteet:

    Edison           aiemmin hyväksytty LOADING_TIP-teksti (sama sanamuoto)
    Finlayson        fi.wikipedia.org/wiki/Finlayson: "Pohjoismaiden
                     ensimmäiset sähkövalot syttyivät Finlaysonin tehtaalla
                     vuonna 1882."
    Revontulet       fi.wikipedia.org/wiki/Revontulet (kansanuskomus)
    Varttihinta      SDAC/EPEX: 15 minuutin tuotteet toimituspäivästä
                     1.10.2025 alkaen; Fingridin markkinatoimikunta 12/2025
    Vaihto, katko,   sivuston omat, jo julkaistut lupaukset (hero ja
    peruutus         askelosio), eli sama väite kuin muualla sivulla

  Uutta lausetta ei lisätä ilman lähdettä tähän luetteloon.

  RYTMI. Edison tulee aina ensin, koska ruudulla syttyy hehkulamppu. Loput
  arvotaan, jotta toistuva kävijä näkee eri asian. Yksi lause näkyy
  `INTERVAL_MS` ajan: lyhyempi ei ehdi tulla luetuksi.
*/

/** Applen järjestelmäfontti (SF Pro), muualla käyttöjärjestelmän oma. */
export const IOS_FONT = "[font-family:-apple-system,BlinkMacSystemFont,'Segoe_UI',system-ui,sans-serif]";
/** iOS:n oletuskäyrä: nopea lähtö, pitkä pehmeä lasku. */
export const IOS_EASE = [0.32, 0.72, 0, 1] as const;

const FIRST = "Vuonna 1879 Edisonin työryhmä esitteli käytännöllisen hehkulampun. Ratkaisu syntyi monen keksijän aiemman työn pohjalta.";

const OTHERS = [
  "Pohjoismaiden ensimmäiset sähkövalot syttyivät Finlaysonin tehtaalla Tampereella vuonna 1882.",
  "Kansanuskomuksen mukaan revontulet syttyivät, kun Lapin tuliketut iskivät häntänsä lumihankeen.",
  "Pörssisähkön hinta vaihtuu vartin välein. Varttihinnat tulivat käyttöön 1.10.2025.",
  "Kun vaihdat sähkösopimusta, uusi yhtiö irtisanoo vanhan sopimuksesi puolestasi.",
  "Sähkö ei katkea vaihdon aikana. Se tulee edelleen saman verkkoyhtiön johtoja pitkin.",
  "Netissä tehdyllä sähkösopimuksella on 14 vuorokauden peruutusoikeus.",
];

const INTERVAL_MS = 2700;

function shuffled<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export default function LoadingFacts({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  /* Arvotaan kerran, kun lataus alkaa. Komponentti syntyy vasta napin
     painalluksesta, ei palvelimella, joten satunnaisuus ei riko hydraatiota. */
  const [facts] = useState(() => [FIRST, ...shuffled(OTHERS)]);
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % facts.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, [facts.length]);

  return (
    <div
      className={`rounded-[22px] bg-white/75 px-5 pb-5 pt-4 shadow-[0_1px_2px_rgba(60,40,20,0.04),0_10px_30px_-8px_rgba(60,40,20,0.14)] ring-1 ring-black/[0.05] backdrop-blur-xl ${IOS_FONT} ${className}`}
    >
      <p className="flex items-center gap-1.5 text-[13px] font-semibold tracking-[-0.005em] text-ink/45">
        <Lightbulb size={15} strokeWidth={2.2} className="text-accent" aria-hidden />
        Tiesitkö?
      </p>

      {/* Kiinteä korkeus neljälle riville, ja lauseet ovat päällekkäin
          vaihdon ajan: kortti ei hyppää, eikä väliin jää tyhjää hetkeä. */}
      <div className="relative mt-2 min-h-[6.2rem]" aria-live="polite">
        <AnimatePresence initial={false}>
          <motion.p
            key={i}
            className="absolute inset-x-0 top-0 text-[16px] leading-[1.45] tracking-[-0.011em] text-ink/85"
            initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={{ duration: reduce ? 0 : 0.6, ease: IOS_EASE }}
          >
            {facts[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
