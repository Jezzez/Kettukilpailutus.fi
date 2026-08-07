"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Kettu — Kettukilpailutuksen maskotti.
 * Kolme 3D-renderöityä asentoa, joita vaihdetaan tilanteen mukaan.
 * Asennonvaihto on ristiinhäivytys + pieni pomppu, jolloin hahmo
 * tuntuu elävältä ilman kehysanimaatiota.
 */
/*
  "OSOITTAA" ON POISTETTU KOKONAAN — ÄLÄ LISÄÄ SITÄ TAKAISIN.

  Tiedosto `/kettu-osoittaa.webp` on yhä kansiossa, mutta sitä ei käytetä
  missään eikä sitä oteta käyttöön ilman Jessen erillistä pyyntöä. Asento
  korvattiin `seisoo`-asennolla kaikissa neljässä paikassa (oppaiden hero,
  404, askelosio, sähkövertailun suositus).

  Poisto tehtiin tyyppitasolla tarkoituksella: jos joku kirjoittaa
  `pose="osoittaa"`, käännös kaatuu eikä asento livahda takaisin vahingossa.
*/
export type KettuPose = "kortti" | "peukku" | "seisoo" | "tuolissa";

const ASSETS: Record<KettuPose, { src: string; w: number; h: number; alt: string }> = {
  /*
    TUOLISSA — ETUSIVUN HERON ASENTO.

    Sama tiedosto kuin lainasivun herossa (ks. FoxSlot, `lainaHero`).
    Tämä on kuvasuhteeltaan poikkeus: muut asennot ovat kapeita pystykuvia
    (0,42:1), tämä on leveä (0,72:1). Sama korkeus tuottaa siis lähes
    kaksi kertaa leveämmän hahmon — heron kuvapalstassa se on hyvä, koska
    kapea hahmo jätti palstan reunoille pelkkää oranssia, mutta pienissä
    paikoissa (mobiilin 150 px) se vie leveyttä leipätekstiltä. Tarkista
    aina leveys, älä vain korkeutta, kun tätä käyttää uudessa paikassa.
  */
  tuolissa: {
    src: "/kettu-tuolissa.webp",
    w: 712,
    h: 993,
    alt: "Kettu, Kettukilpailutuksen maskotti",
  },
  kortti: {
    src: "/kettu-kortti.webp",
    w: 657,
    h: 1400,
    alt: "Kettu esittelee luottokorttia",
  },
  /*
    SEISOO — YLEISASENTO, JOKA KORVASI "OSOITTAA"-ASENNON.

    MIKSI JUURI TÄMÄ: osoittava kettu kantoi merkitystä ("katso tänne"),
    joka sopi vain osaan paikoista ja näytti muissa käskyttävältä. Seisova
    hahmo on neutraali — se voi olla oppaiden, askelosion, 404-sivun ja
    suosituksen vieressä ilman että kuva väittää mitään. Kuva on myös ainoa
    käyttämätön kokovartalokuva ilman leikkausreunaa, joten se ei tarvitse
    aaltoreunaa piilottamaan katkokohtaa.

    KAPEIN ASENTO KOKO SETISSÄ: 0,33:1. Sama korkeus tuottaa noin 20 %
    kapeamman hahmon kuin `peukku` ja alle puolet `tuolissa`-kuvan
    leveydestä. Leveässä kuvapalstassa (esim. heron oikea puolisko) tämä
    tarkoittaa, että korkeutta pitää nostaa reilusti tai palstan reunoille
    jää pelkkää taustaa.
  */
  seisoo: {
    src: "/kettu-seisoo.webp",
    w: 432,
    h: 1325,
    alt: "Kettu, Kettukilpailutuksen maskotti",
  },
  peukku: {
    src: "/kettu-peukku.webp",
    w: 425,
    h: 1000,
    alt: "Kettu näyttää peukkua",
  },
};

export default function Kettu({
  pose = "kortti",
  height = 520,
  priority = false,
  className = "",
  float = true,
}: {
  pose?: KettuPose;
  height?: number;
  priority?: boolean;
  className?: string;
  /** Kevyt leijunta = "hengitys". Pois, jos hahmo on pienessä roolissa. */
  float?: boolean;
}) {
  const reduce = useReducedMotion();
  const a = ASSETS[pose];
  const width = Math.round((a.w / a.h) * height);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ height, width }}
      animate={reduce || !float ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={pose}
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="absolute inset-0 flex items-end justify-center"
        >
          <Image
            src={a.src}
            alt={a.alt}
            width={a.w}
            height={a.h}
            priority={priority}
            className="h-full w-auto select-none drop-shadow-[0_24px_40px_rgba(38,32,26,0.16)]"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
