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
  | "lainaHero"
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
  /*
    LASKURI — VAIHDETTU KURKISTAJASTA LAMPUNSYTYTTÄJÄÄN.

    Tässä oli vaakakuva (760x620), jossa Kettu kurkisti paneelin reunan
    yli. Ele oli hyvä, mutta kuva oli aiheeton: sama kurkistaja olisi
    käynyt lainoihin ja vakuutuksiin. Tämä paikka on sähkövertailun
    portti, ja portti on se kohta, jossa osa kävijöistä poistuu ennen
    kuin on nähnyt yhtään hintaa. Aiheeseen osuva kuva — syttyvä lamppu
    ja työkaluvyö — kertoo yhdellä silmäyksellä mistä sivulla on kyse ja
    pitää heidät hetken pidempään. Se on suoraan pois poistumisista.

    MITAT: pystykuva 489x960, rajattu läpinäkyvän alueen mukaan. Ylin
    kymmenys on pelkkää riippujohtoa ja alareuna on leikattu reidestä —
    kumpikin leikkauskohta on TARKOITUS asemoida paneelin reunaan, jolloin
    lamppu näyttää roikkuvan paneelin yläpuolelta ja hahmo nousevan sen
    takaa. Vapaasti leijuessaan kumpikin pää näyttäisi katkaistulta.
    Ks. ElectricityExperience.tsx, porttipaneeli.
  */
  laskuri: {
    src: "/kettu-lamppu.webp",
    w: 489,
    h: 960,
    alt: "",
    brief:
      "Kokovartalo alaviistosta, kurkottaa ylös sytyttämään riippulampun. Villapaita ja työkaluvyö. Johto jatkuu kuvan yläreunan yli.",
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
  /* Osoittava kettu poistettiin käytöstä koko sivustolta, joten tämä
     paikka osoittaa nyt seisovaan asentoon. Slottia ei tällä hetkellä
     renderöidä missään — se on varaus tuleville vinkkiosioille. */
  neuvoo: {
    src: "/kettu-seisoo.webp",
    w: 432,
    h: 1325,
    alt: "",
    brief: "Rauhallinen seisonta. Vinkit ja neuvot.",
  },
  /*
    LAINASIVUN HERO — OMA KUVA, EI JAETTUA TIEDOSTOA.

    Tämä on ainoa paikka, jossa tuolikuvaa käytetään. Oma tiedosto on
    tarkoituksellinen: lainasivu on ainoa vertikaali, joka ei vertaile
    mitään itse, ja oma asento erottaa sen sähkövertailusta myös
    silmälle. Jaettu naamakuva toimi, mutta se toistuu jo kahdessa
    muussa paikassa sivustolla.

    KUVA ON RAJATTU LÄPINÄKYVÄN ALUEEN MUKAAN. Alkuperäisessä
    tiedostossa hahmo oli oikeassa laidassa ja vasen puoli oli tyhjää.
    Oranssilla vyöllä tyhjä puolisko olisi piirtynyt pelkkänä taustana
    ja kutistanut hahmon puoleen siitä koosta, jonka palsta sallii.

    EI SUORIA LEIKKAUSREUNOJA: koko hahmo tuoleineen on kuvassa, joten
    tämä ei tarvitse aaltoreunaa piilottamaan katkokohtaa vaan asettuu
    keskelle kuvapalstaa halon päälle.
  */
  lainaHero: {
    src: "/kettu-tuolissa.webp",
    w: 712,
    h: 993,
    alt: "",
    brief:
      "Kettu istuu toimistotuolissa, sormi ylhäällä. Rento asiantuntija, ei myyjä — sopii sivulle, joka ohjaa asian hoitavalle kumppanille.",
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
    src: "/kettu-muotokuva.webp",
    w: 569,
    h: 900,
    alt: "",
    brief:
      "Rintakuva, joka nousee loppukehotusvyön alareunasta. Sivun loppuallekirjoitus.",
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
