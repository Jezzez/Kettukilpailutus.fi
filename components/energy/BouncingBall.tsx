"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
  HYPPIVÄ PALLO — MOBIILIN LATAUSNÄKYMÄN KATSEENKIINNITTÄJÄ.

  MIKSI TÄMÄ ON OLEMASSA. Jesse pyysi 10.10.2026 mobiiliin ruudun
  keskelle hyppivän pallon siihen kohtaan, jossa sopimukset latautuvat,
  "johon silmät keskittyy".

  =====================================================================
  LUE TÄMÄ ENNEN KUIN KOSKET: LATAUS ON KEINOTEKOINEN
  =====================================================================

  Sopimusdata on jo selaimessa ensimmäisestä renderistä asti. Sivusto on
  staattisesti generoitu eikä sillä ole tietokantaa, joten mitään ei
  oikeasti haeta. `RESULT_LOADING_MS` on tahallinen viive, ja sen
  perustelut ovat `ElectricityExperience.tsx`:n vakion kommentissa.

  Siitä seuraa yksi sääntö, joka tämän komponentin on pakko kestää:
  PALLO EI SAA KOSKAAN PIDENTÄÄ ODOTUSTA. Se ei saa olla syy nostaa
  viivettä "jotta animaatio ehtii näkyä". Jos pallo tuntuu jäävän
  vajaaksi, oikea korjaus on tehdä hypystä nopeampi, ei odotuksesta
  pidempi. Viive laskettiin samalla kertaa 5 000:sta 3 000:een, ja
  suunta on jatkossakin alaspäin.

  MIKSI PALLON RINNALLA ON YHÄ EDISTYMISPALKKI. Hyppivä pallo ei kerro,
  kauanko odotusta on jäljellä, ja määrittelemätön odotus tuntuu aina
  pidemmältä kuin yhtä pitkä määritelty. Pallo vie katseen, palkki
  kertoo lopun. Älä poista palkkia pallon tieltä.

  VÄRIT. `DESIGN.md` sallii kaksi väriä. Pallo on kettuoranssi ja
  korostuskiilto kulta. Varjo on vyön tummaa päätä, ei mustaa: musta on
  ainoa väri, jota tällä sivustolla ei ole missään.
*/

export default function BouncingBall({ size = 72 }: { size?: number }) {
  const reduce = useReducedMotion();

  /*
    HYPYN KESTO ON LYHYT TARKOITUKSELLA. 620 ms tarkoittaa, että kolmen
    sekunnin odotukseen mahtuu noin viisi hyppyä. Hitaampi hyppy lukee
    raskaaksi ja saa odotuksen tuntumaan pidemmältä kuin se on.

    `times` jakaa liikkeen kahtia: nousu hidastuu huipulle (`easeOut`) ja
    pudotus kiihtyy alas (`easeIn`). Tasainen tahti näyttäisi siltä, että
    pallo kelluu, ei siltä että se putoaa.
  */
  const sykli = {
    duration: 0.62,
    repeat: Infinity,
    times: [0, 0.5, 1],
    ease: ["easeOut", "easeIn"] as const,
  };

  /*
    LITISTYS JA VENYTYS. Pallo on alhaalla leveämpi kuin korkea ja
    huipulla päinvastoin. Ilman tätä liike on pelkkää pystysuuntaista
    siirtoa, joka lukee elementin siirtymiseksi eikä kappaleen
    pomppimiseksi, eikä silmä tartu siihen samalla tavalla.
  */
  const pallonLiike = reduce
    ? {}
    : {
        y: [0, -(size * 0.8), 0],
        scaleX: [1.14, 0.93, 1.14],
        scaleY: [0.86, 1.07, 0.86],
      };

  return (
    <div
      aria-hidden
      className="relative flex flex-col items-center justify-end"
      style={{ height: size * 2.1, width: size * 1.5 }}
    >
      <motion.span
        className="block rounded-full"
        style={{
          width: size,
          height: size,
          transformOrigin: "50% 100%",
          /*
            Valo tulee ylävasemmalta kuten sivuston muissakin pinnoissa.
            Kultainen kohokohta tekee pallosta kappaleen eikä ympyrän.
          */
          backgroundImage:
            "radial-gradient(circle at 32% 26%, #F7C77A 0%, #E8691B 46%, #A83E0A 100%)",
          boxShadow: "0 10px 26px -10px rgba(74,26,2,0.55)",
        }}
        animate={pallonLiike}
        transition={reduce ? undefined : sykli}
      />

      {/*
        VARJO ON OMA ELEMENTTINSÄ JA SE ELÄÄ VASTAKKAISEEN SUUNTAAN:
        kun pallo nousee, varjo kutistuu ja haalenee. Juuri tämä kertoo
        katsojalle korkeuden. Ilman varjoa pallo näyttää liikkuvan
        edestakaisin tyhjässä, ja korkeusvaikutelma katoaa.
      */}
      <motion.span
        className="mt-2 block rounded-full"
        style={{
          width: size * 0.78,
          height: size * 0.14,
          background: "rgba(74,26,2,0.30)",
          filter: "blur(4px)",
        }}
        animate={reduce ? {} : { scaleX: [1, 0.55, 1], opacity: [1, 0.35, 1] }}
        transition={reduce ? undefined : sykli}
      />
    </div>
  );
}
