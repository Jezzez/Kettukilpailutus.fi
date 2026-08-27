import { Zap, HandCoins, ShieldCheck, type LucideIcon } from "lucide-react";
import { FEATURES } from "@/lib/features";
import { ENERGY_COMPARE } from "@/lib/nav";

/*
  KOLME KILPAILUTETTAVAA PALVELUA — YHDESTÄ LÄHTEESTÄ.

  MIKSI TÄMÄ TIEDOSTO ON OLEMASSA. Etusivu puhuu palveluista neljässä eri
  kohdassa: heron siirtymäpainikkeissa, kolmessa omassa osiossaan,
  läpinäkyvyysosiossa ja loppukehotuksessa. Kun jokainen niistä kirjoitti
  nimet ja osoitteet itse, sähkö sai joka kerta hieman enemmän tilaa kuin
  muut — ei päätöksestä vaan siitä, että sähköä oli helpoin kirjoittaa.
  Lopputulos oli etusivu, joka mainosti yhtä vertikaalia ja mainitsi kaksi.

  Kun kaikki lukevat tämän saman taulukon, epätasapaino ei voi syntyä
  vahingossa: jos palvelun rivi on täällä, se näkyy kaikkialla samalla
  painolla, ja jos se poistetaan, se katoaa kaikkialta kerralla.

  MITÄ TÄSSÄ EI OLE: yhtään lukua. Sähkön luvut lasketaan `lib/home.ts`:ssä
  oikeasta datasta, ja lainoista sekä vakuutuksista meillä ei ole yhtään
  tarkistettua lukua. Keksitty korkoesimerkki tai vakuutushinta kaataisi
  koko sivuston uskottavuuden, sähkövertailu mukaan luettuna — ja lainojen
  osalta se rikkoisi lisäksi kuluttajansuojalain 7 luvun vaatimuksen
  todellisesta vuosikorosta (ks. lib/loans.ts).

  KOLME ERI ROOLIA, JOTKA SANOTAAN ÄÄNEEN. Kettu tekee näistä kolmesta
  vain yhden itse:

  - Sähkö: Kettu laskee hinnat itse tarkistetusta datasta.
  - Lainat: Sortter kilpailuttaa, Kettu ohjaa hakemukseen.
  - Vakuutukset: POP Vakuutus antaa tarjouksen, Kettu ei vertaile.

  `handledBy`-kenttä pakottaa jokaisen osion kertomaan tämän. Ilman sitä
  tasavertainen esitys antaisi ymmärtää, että vertailemme kaikkia kolmea
  itse — ja ero paljastuisi kävijälle heti seuraavalla klikillä. Se on
  pahin mahdollinen paikka menettää luottamus, koska se on juuri se klikki,
  josta palkkio maksetaan.
*/

/**
 * POP VAKUUTUKSEN KUMPPANILINKKI.
 *
 * Sama osoite kuin alatunnisteen Kilpailuta-listassa (`components/Footer.tsx`),
 * ja se on nyt vakiona täällä, jotta kaksi paikkaa ei voi eriytyä. Tunniste
 * `as=2098832052` on Jessen affiliate-tunnus, sama kuin sähkösopimusten
 * Adtraction-linkeissä.
 *
 * ULKOINEN LINKKI, EI OMAA SIVUA. Emme vertaile vakuutuksia, joten oma
 * `/vakuutukset`-laskeutumissivu olisi sivu, jolla ei ole mitään
 * näytettävää — se lisäisi yhden klikin matkalle eikä antaisi kävijälle
 * vastineeksi yhtään uutta tietoa. Kun meillä on joskus omaa
 * vakuutusdataa, tämä vakio vaihtuu sisäiseksi poluksi ja kaikki linkit
 * seuraavat mukana.
 */
export const POP_INSURANCE_URL =
  "https://go.popvakuutus.fi/t/t?a=1710920255&as=2098832052&t=2&tk=1";

export interface Service {
  /** Ankkuri etusivulla, esim. "sahko" → `#sahko`. */
  key: string;
  /** Lyhyt nimi. Yhden sanan nimet mahtuvat rinnakkain 390 pikselillä. */
  name: string;
  /** Mihin painike vie. Ulkoinen osoite tunnistetaan `external`-lipusta. */
  href: string;
  /** Onko kohde kumppanin sivu: vaikuttaa `rel`-arvoon ja klikkiseurantaan. */
  external?: true;
  Icon: LucideIcon;
  /** Yksi rivi siitä, mitä kävijä saa. Ei lupauksia säästöstä. */
  lead: string;
  /** Kuka työn oikeasti tekee. Näkyy aina, ei koskaan piilossa. */
  handledBy: string;
  /** Painikkeen teksti. Verbi, ei substantiivi. */
  cta: string;
}

/**
 * Palvelut esitysjärjestyksessä.
 *
 * JÄRJESTYS EI OLE PAREMMUUSJÄRJESTYS vaan se, kuinka valmis palvelu on:
 * sähkössä on oma laskenta, lainoissa kumppanin laskenta, vakuutuksissa
 * pelkkä tarjouspyyntö. Kävijä kohtaa siis ensin sen, jossa hän saa eniten
 * ilman että antaa mitään.
 */
export function getServices(): Service[] {
  return [
    {
      key: "sahko",
      name: "Sähkö",
      href: ENERGY_COMPARE,
      Icon: Zap,
      lead: "Näet jokaisen sopimuksen vuosihinnan euroina omalla kulutuksellasi.",
      handledBy: "Kettu laskee hinnat itse.",
      cta: "Kilpailuta sähkö",
    },
    ...(FEATURES.loans
      ? [
          {
            key: "lainat",
            name: "Lainat",
            href: "/lainat",
            Icon: HandCoins,
            lead: "Yksi hakemus lähtee usealle pankille, ja tarjoukset tulevat rinnakkain.",
            handledBy: "Kilpailutuksen tekee Sortter.",
            cta: "Vertaile lainoja",
          } satisfies Service,
        ]
      : []),
    {
      key: "vakuutukset",
      name: "Vakuutukset",
      href: POP_INSURANCE_URL,
      external: true,
      Icon: ShieldCheck,
      lead: "Pyydä tarjous vakuutuksistasi ja vertaa sitä nykyiseen laskuusi.",
      /*
        TÄMÄ LAUSE ON KOKO OSION EHTO. POP Vakuutus on yksi yhtiö, ei
        vertailu. Napin lyhyt toimintakehotus on käyttäjän toiveesta
        "Kilpailuta vakuutus", mutta itse kuvausteksti kertoo edelleen
        suoraan, että tarjous tulee POP Vakuutukselta eikä kyse ole usean
        yhtiön vertailusta.
      */
      handledBy: "Tarjouksen antaa POP Vakuutus.",
      cta: "Kilpailuta vakuutus",
    },
  ];
}
