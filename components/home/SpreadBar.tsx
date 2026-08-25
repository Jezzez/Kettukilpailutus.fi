"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
  HINTAERON PALKKI, JOKA KASVAA NOLLASTA MITTAANSA.

  MIKSI JUURI TÄSSÄ LIIKETTÄ. Palkkien koko tehtävä on tehdä suuruusero
  näkyväksi ilman että lukuja lukee: kerrostalon 149 € on kymmenesosa
  sähkölämmitteisen talon 1 544 eurosta. Paikallaan olevista palkeista
  silmä poimii pituuden, mutta kasvava palkki näyttää MATKAN — ja matka
  on juuri se, mitä lukijan pitää tuntea ennen kuin hän uskoo, että
  vertailulla on väliä.

  GRADIENTTI ORANSSISTA KULTAAN, ei uutta väriä. Molemmat ovat sivuston
  kaksi olemassa olevaa väriä, ja pituuseron kärki jää kullalle, jolloin
  pisin palkki erottuu lyhyistä myös värillä eikä vain mitalla.

  LOPULLINEN LEVEYS ON `style`-ATTRIBUUTISSA, LIIKE ON `scaleX`.
  Ensimmäinen versio animoi `width`-arvoa nollasta prosenttilukuun. Se ei
  toiminut lainkaan: palkit jäivät nollan levyisiksi, koska nollan (px) ja
  prosentin välillä ei ole yksiselitteistä välimuotoa. Mitattu selaimessa,
  leveys 0 px kaikilla kolmella rivillä.

  `scaleX` korjaa sen ja on lisäksi oikea tapa: leveys on kunnossa jo
  HTML:ssä (myös ilman JavaScriptiä), venytys tapahtuu kompositorissa
  eikä pakota selainta laskemaan asettelua uudelleen 60 kertaa
  sekunnissa, ja pyöristetyt päät säilyvät oikean muotoisina.
*/

export default function SpreadBar({
  ratio,
  delay = 0,
  trackClassName = "bg-white",
}: {
  /** Osuus suurimmasta erosta, 0–1. */
  ratio: number;
  /** Porrastus sekunteina, jotta rivit kasvavat peräkkäin. */
  delay?: number;
  /**
   * Uran väri.
   *
   * MIKSI TÄMÄ ON SÄÄDETTÄVISSÄ: ura oli kiinteästi `bg-white`, mikä
   * toimi hiekanvärisellä pinnalla. Kun palkit siirtyivät valkoisen
   * paneelin sisään, ura katosi taustaan eikä palkin täysi mitta enää
   * näkynyt — silloin lyhyt palkki ei kerro mitään, koska vertailukohtaa
   * ei ole. Oletus on ennallaan, joten vanhat käyttöpaikat eivät muutu.
   */
  trackClassName?: string;
}) {
  const reduce = useReducedMotion();
  const width = `${Math.round(ratio * 100)}%`;

  if (reduce) {
    return (
      <div
        className={`mt-3.5 h-2 overflow-hidden rounded-full ${trackClassName}`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-gold"
          style={{ width }}
        />
      </div>
    );
  }

  /*
    LAUKAISIN ON URA, EI PALKKI. `whileInView` palkissa itsessään ei
    toiminut: `scaleX(0)` tekee elementistä nollan levyisen, ja
    nollapinta-alaista elementtiä IntersectionObserver ei raportoi
    näkyväksi. Palkit jäivät siksi pysyvästi piiloon. Mitattu selaimessa:
    `width` oli oikein 10/20/100 %, mutta `transform` jäi arvoon
    `scaleX(0)` vaikka rivi oli keskellä ruutua.

    Ura on aina täysleveä ja 8 px korkea, joten se havaitaan varmasti.
    Se antaa tilan variantteina, ja palkki perii sen vanhemmaltaan.
  */
  return (
    <motion.div
      className={`mt-3.5 h-2 overflow-hidden rounded-full ${trackClassName}`}
      initial="alku"
      whileInView="taysi"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div
        className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-gold"
        style={{ width }}
        variants={{ alku: { scaleX: 0 }, taysi: { scaleX: 1 } }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
