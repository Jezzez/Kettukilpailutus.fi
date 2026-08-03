"use client";

import { motion, useReducedMotion } from "framer-motion";
import FoxPaw from "../FoxPaw";

/**
 * TASSUNJÄLKI — sivuston rakenteellinen tunnusmerkki.
 *
 * MIKSI TÄMÄ KORVAA VIIVAN: osioiden välissä ollut `h-px`-viiva on
 * neutraali. Se erottaa kaksi asiaa toisistaan, mutta ei kerro yhtään
 * mitään. Tassunjälkien rivi tekee saman työn ja lisäksi lukee "kettu meni
 * tästä" — se on samaan aikaan erotin ja suuntamerkki, joka vie katseen
 * seuraavaan osioon. Se on halvin mahdollinen tapa tehdä sivusta ketun
 * näköinen: yksi SVG-muoto, ei yhtään uutta väriä, ei kuvatiedostoja.
 *
 * MIKSI JÄLJET OVAT SUORASSA LINJASSA: kettu kävelee "direct register"
 * -askelluksella, eli takatassu osuu tarkalleen etutassun jälkeen. Siksi
 * ketun jälki lumessa on lähes täydellinen suora pisteviiva, kun taas
 * koiran jälki haarautuu leveäksi. Jäljitysoppaissa tätä pidetään ketun
 * tunnusmerkkinä. Meille se on sekä tosiasia että metafora: kettu ottaa
 * suoran ja taloudellisen reitin. Juuri sitä palvelu lupaa tehdä
 * käyttäjän sopimuksille.
 *
 * MIKSI JÄLJET HAALISTUVAT: tasavahva rivi näyttäisi koristelistalta.
 * Kun jäljet vaimenevat kulkusuuntaan, rivi saa suunnan, ja katse
 * liikkuu sitä pitkin eteenpäin sen sijaan että pysähtyisi siihen.
 */
export default function PawTrail({
  /** Jälkien määrä. Pariton luku näyttää luonnollisemmalta kuin parillinen. */
  count = 5,
  size = 11,
  /** Kulkusuunta. "right" vaimenee oikealle, "left" vasemmalle. */
  direction = "right",
  /** Animoi jäljet esiin peräkkäin, kun rivi tulee näkyviin. */
  animate = false,
  className = "",
}: {
  count?: number;
  size?: number;
  direction?: "left" | "right";
  animate?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();

  /*
    Jälki kallistuu hieman kulkusuuntaan ja nousee/laskee vuorotellen
    puoli pikseliä. Täysin samalla linjalla oleva rivi näyttää
    ladotulta fontilta; pieni epäsäännöllisyys tekee siitä jäljen.
  */
  const prints = Array.from({ length: count }, (_, i) => {
    const t = i / Math.max(count - 1, 1);
    return {
      /* Vaimeneminen ei mene nollaan: viimeinenkin jälki on vielä
         luettavissa, muuten rivi näyttää katkeavan kesken. */
      opacity: 0.9 - t * 0.62,
      offsetY: i % 2 === 0 ? 0 : 2,
      rotate: direction === "right" ? 8 : -8,
      delay: i * 0.075,
    };
  });

  const ordered = direction === "right" ? prints : [...prints].reverse();

  /*
    Juurielementti on SPAN eikä DIV. Tämä ei ole tyylikysymys: rivi
    upotetaan usein <p>-elementin sisään, eikä <div> saa HTML:ssä olla
    <p>:n jälkeläinen. Selain korjaa virheen sulkemalla kappaleen
    ennen diviä, jolloin palvelimen ja selaimen puurakenteet eroavat ja
    koko sivu putoaa hydraatiovirheeseen — React heittää SSR:n pois ja
    piirtää sivun uudelleen selaimessa. Se näkyy käyttäjälle nykimisenä
    heti latauksen jälkeen. `inline-flex` pitää ulkoasun ennallaan.
  */
  return (
    <span
      className={`inline-flex items-center align-middle ${direction === "right" ? "" : "flex-row-reverse"} ${className}`}
      style={{ gap: size * 0.62 }}
      aria-hidden
    >
      {ordered.map((p, i) => {
        const content = (
          <FoxPaw
            size={size}
            className="shrink-0"
          />
        );

        const style = {
          opacity: p.opacity,
          transform: `translateY(${p.offsetY}px) rotate(${p.rotate}deg)`,
        };

        if (!animate || reduce) {
          return (
            <span key={i} style={style} className="inline-flex">
              {content}
            </span>
          );
        }

        return (
          <motion.span
            key={i}
            className="inline-flex"
            style={{ transform: style.transform }}
            initial={{ opacity: 0, scale: 0.55 }}
            whileInView={{ opacity: p.opacity, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: p.delay, duration: 0.32, ease: "easeOut" }}
          >
            {content}
          </motion.span>
        );
      })}
    </span>
  );
}
