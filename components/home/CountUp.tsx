"use client";

import { useEffect, useRef, useState } from "react";

/*
  LUKU, JOKA JUOKSEE NOLLASTA ARVOONSA KUN SE TULEE RUUTUUN.

  MIKSI TÄMÄ ON MUUTA KUIN KORISTE. Heron lukurivi on sivun ainoa kohta,
  jossa kerrotaan mitä vertailu on jo tehnyt. Paikallaan seisova numero
  luetaan taustatiedoksi ja ohitetaan. Liikkuva numero pysäyttää katseen
  siihen lukuun, joka on koko sivun myyntiargumentti (suurin ero
  halvimman ja kalleimman sopimuksen välillä), ja juuri sen luvun pitää
  jäädä mieleen ennen kuin kävijä päättää klikkaako.

  SERVERI RENDERÖI OIKEAN LUVUN, EI NOLLAA. Jos alkuarvo olisi nolla myös
  HTML:ssä, Googlebot lukisi etusivulta "0 €" — ja hakutuloksen alle
  poimittu nolla on pahempi kuin koko animaation puuttuminen. Nollaus
  tehdään vasta selaimessa.

  MIKSI TÄSSÄ EI KÄYTETÄ FRAMER MOTIONIN `useInView`-KOUKKUA. Käytettiin,
  ja se jätti kolmesta luvusta yhden pysyvästi nollaan. Mitattu
  selaimessa: kaksi laskuria saavutti arvonsa, ensimmäinen jäi arvoon
  "0" eikä toipunut. Etusivun päälukujen pitää toimia joka kerta, ja
  nolla euroa väärässä kohdassa on juuri se virhe, joka vie luottamuksen
  koko vertailulta. Suora IntersectionObserver ja `requestAnimationFrame`
  ovat noin kymmenen riviä koodia, ja ne voi lukea läpi ja todeta
  oikeiksi.

  `prefers-reduced-motion` ohittaa koko animaation: luku vain on
  paikallaan. Liikeherkälle kävijälle juokseva numero on oire, ei efekti.
*/

export default function CountUp({
  value,
  suffix = "",
  durationMs = 2400,
  delayMs = 0,
  className,
}: {
  /** Lopullinen arvo. Näytetään aina kokonaislukuna. */
  value: number;
  /** Yksikkö luvun perään, esim. " €". */
  suffix?: string;
  /**
   * Animaation kesto millisekunteina.
   *
   * 2400 ms on kaksi kertaa aiempi 1200 ms. Syy on katse, ei tyyli: 1,2
   * sekunnissa luku ehti perille ennen kuin kävijä oli lukenut otsikon,
   * jolloin hän näki vain valmiin numeron eikä koskaan huomannut sen
   * liikkuneen. Liike on se, joka pysäyttää katseen lukuun, ja luku on
   * se, joka perustelee klikin.
   */
  durationMs?: number;
  /**
   * Viive ennen aloitusta. Kolme lukua rinnakkain samalla hetkellä
   * käynnistettynä luetaan yhtenä nykäyksenä; porrastettuna silmä ehtii
   * käydä ne läpi vasemmalta oikealle siinä järjestyksessä, jossa ne on
   * kirjoitettu.
   */
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer = 0;
    let cancelled = false;

    /*
      Sama pehmennys kuin sivuston muissa liikkeissä: nopea lähtö, pitkä
      hidastuva loppu. Luku siis "asettuu" paikalleen sen sijaan että
      pysähtyisi kesken vauhdin.
    */
    const run = () => {
      /*
        Nollaus tehdään vasta tässä, ei heti observerin lauetessa. Syy on
        mitattu: taustavälilehdellä selain jäädyttää `requestAnimationFrame`
        -kutsut mutta ei IntersectionObserveria. Jos nollaus olisi
        observerissa, luku putoaisi nollaan eikä yksikään ruutu ajaisi sitä
        takaisin ylös. Kun välilehti on piilossa, animaatiota ei aloiteta
        lainkaan ja oikea luku jää näkyviin sellaisenaan.

        Tämä on sama vika, jonka takia framer-motionin `useInView` aikanaan
        poistettiin: nolla euroa väärässä kohdassa vie luottamuksen koko
        vertailulta, eikä väärä nolla saa olla mahdollinen missään tilassa.
      */
      if (document.visibilityState !== "visible") return;

      /*
        NOLLAUS JA VIIVE OVAT SAMASSA HETKESSÄ. Jos luku nollattaisiin heti
        ja juoksu alkaisi vasta viiveen jälkeen, kolmas luku seisoisi
        nollassa lähes puoli sekuntia näkyvissä. Nolla väärässä kohdassa on
        se virhe, jota koko tämä komponentti on kirjoitettu välttämään, joten
        oikea luku pysyy paikallaan siihen asti kun sen oma juoksu alkaa.
      */
      timer = window.setTimeout(() => {
        if (cancelled || document.visibilityState !== "visible") return;

        setShown(0);
        const t0 = performance.now();
        const tick = (t: number) => {
          if (cancelled) return;
          const p = Math.min(1, (t - t0) / durationMs);
          setShown(value * (1 - Math.pow(1 - p, 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }, delayMs);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();
        run();
      },
      { rootMargin: "-40px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs, delayMs]);

  return (
    <span ref={ref} className={className}>
      {Math.round(shown).toLocaleString("fi-FI")}
      {suffix}
    </span>
  );
}
