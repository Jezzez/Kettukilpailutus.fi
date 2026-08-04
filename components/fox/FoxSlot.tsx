import Image from "next/image";
import FoxPaw from "../FoxPaw";

/**
 * KETUN KUVAPAIKAT.
 *
 * MIKÄ TÄMÄ ON: nimetty paikka, johon Ketun kuva tulee. Paikat ovat
 * olemassa koodissa ennen kuin kuvatiedostot ovat olemassa, jotta
 * sivujen taitto voidaan suunnitella valmiiksi oikean kokoisille kuville
 * eikä mitään tarvitse siirrellä myöhemmin.
 *
 * MITEN KUVA LISÄTÄÄN: pudota tiedosto `public/`-kansioon ja kirjoita sen
 * nimi alla olevan taulukon `src`-kenttään. Ei muuta. Paikka, koko ja
 * sijoittelu ovat jo valmiina.
 *
 * PLACEHOLDER NÄKYY NYT AINA, MYÖS TUOTANNOSSA. Aiemmin se piirtyi vain
 * kehitysympäristössä, jottei keskeneräinen laatikko päätyisi julkiselle
 * sivulle. Se oli ylivarovaista: sivustoa ei ole vielä markkinoitu, ja
 * paikkojen on näyttävä, jotta kuvat voidaan teettää oikean kokoisina.
 * Placeholder on siksi tarkoituksella siisti — kultainen katkoviiva,
 * tassu ja mitat, ei harmaa laatikko.
 *
 * KUN KUVAT ON TEETETTY: kirjoita tiedostonimi `src`-kenttään. Jos
 * placeholderit halutaan piiloon ennen sitä, käännä `SHOW_PLACEHOLDERS`.
 */
const SHOW_PLACEHOLDERS = true;

export type FoxSlotId =
  | "hero"
  | "laskuri"
  | "luottamus"
  | "laskee"
  | "alaVaihda"
  | "tyhja"
  | "voitto"
  | "neuvoo"
  | "eiLoytynyt"
  | "footer";

type SlotSpec = {
  /** Tiedosto `public/`-kansiossa, tai null jos kuvaa ei vielä ole. */
  src: string | null;
  w: number;
  h: number;
  /** alt-teksti. Koristekuville tyhjä merkkijono. */
  alt: string;
  /** Mitä tästä asennosta halutaan — ohje kuvantekijälle. */
  brief: string;
};

export const FOX_SLOTS: Record<FoxSlotId, SlotSpec> = {
  hero: {
    src: "/kettu-kortti.webp",
    w: 657,
    h: 1400,
    alt: "Kettu, Kettukilpailutuksen maskotti",
    brief: "Koko vartalo, kolmineljäsosaprofiili, itsevarma. Valo sivusta.",
  },
  laskuri: {
    src: null,
    w: 520,
    h: 620,
    alt: "",
    brief:
      "Puolivartalo, kurkistaa laskurin reunan yli käyttäjän lukuja. Keskittynyt, hieman huvittunut. Kyynärpäät voivat nojata reunaan.",
  },
  luottamus: {
    src: null,
    w: 460,
    h: 560,
    alt: "",
    brief:
      "Läpinäkyvyysosioon. Kettu esittelee kämmenellä laskukaavaa, katse lukijaan, mitään salaamaton avoin asento. Tämä korvaa entiset sinettimerkit.",
  },
  laskee: {
    src: null,
    w: 420,
    h: 420,
    alt: "",
    brief:
      "Pieni, liikkeessä, nuuskii. Käytetään hetken ajan kun tulokset lasketaan uudelleen. Ei naamaa kameraan — profiili, katse alaspäin lukuihin.",
  },
  alaVaihda: {
    src: null,
    w: 520,
    h: 620,
    alt: "",
    brief:
      "TÄRKEIN. Rehellinen, kämmen ylöspäin, kevyt olankohautus. Tämä näytetään kun käyttäjän nykyinen sopimus on jo halvin — eli hetkellä, jolloin Kettu sanoo ettei kannata ostaa.",
  },
  tyhja: {
    src: null,
    w: 460,
    h: 520,
    alt: "",
    brief:
      "Etsii: käsi silmien yllä tai lyhty kädessä. Näytetään kun suodattimet eivät tuota yhtään sopimusta.",
  },
  voitto: {
    src: "/kettu-peukku.webp",
    w: 425,
    h: 1000,
    alt: "",
    brief: "Peukku ylös. Iso säästö löytyi.",
  },
  neuvoo: {
    src: "/kettu-osoittaa.webp",
    w: 416,
    h: 1000,
    alt: "",
    brief: "Osoittaa sormella. Vinkit ja neuvot.",
  },
  eiLoytynyt: {
    src: null,
    w: 460,
    h: 520,
    alt: "",
    brief:
      "404-sivulle. Huvittunut, ei pahoillaan — kettu joka on itsekin eksynyt mutta tietää tien takaisin.",
  },
  footer: {
    src: null,
    w: 360,
    h: 360,
    alt: "",
    brief:
      "Pieni, istuva, häntä kiertyneenä eteen. Rauhallinen. Sivun loppuallekirjoitus.",
  },
};

export default function FoxSlot({
  id,
  /** Renderöity korkeus pikseleinä. Leveys lasketaan kuvasuhteesta. */
  height,
  priority = false,
  className = "",
}: {
  id: FoxSlotId;
  height: number;
  priority?: boolean;
  className?: string;
}) {
  const spec = FOX_SLOTS[id];
  const width = Math.round((spec.w / spec.h) * height);

  if (!spec.src) {
    if (!SHOW_PLACEHOLDERS) return null;

    return (
      <div
        className={`grid place-items-center rounded-2xl border-2 border-dashed border-gold/55 bg-gold/[0.09] p-3 text-center ${className}`}
        style={{ height, width }}
      >
        <div>
          <FoxPaw size={16} className="mx-auto mb-2 text-goldInk opacity-70" />
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.14em] text-goldInk">
            Kuvapaikka · {id}
          </p>
          <p className="mt-1.5 text-[10.5px] leading-snug text-ink/60">{spec.brief}</p>
          <p className="mt-1.5 font-data text-[9.5px] text-ink/45">
            {spec.w}×{spec.h}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={spec.src}
      alt={spec.alt}
      width={spec.w}
      height={spec.h}
      priority={priority}
      draggable={false}
      className={`w-auto select-none ${className}`}
      style={{ height }}
    />
  );
}
