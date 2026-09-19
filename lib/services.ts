import { Zap, HandCoins, ShieldCheck, type LucideIcon } from "lucide-react";
import { FEATURES } from "@/lib/features";
import { ENERGY_PATH } from "@/lib/nav";
import type { Partner } from "@/components/PartnerDialog";

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

  =====================================================================
  KUMPPANIEN NIMIÄ EI ENÄÄ MAINITA PALVELUKOHDISSA (19.9.2026)
  =====================================================================

  Tässä oli kenttä `handledBy`, joka luki heron rivillä ja palveluosiossa:
  "Kettu laskee hinnat itse.", "Kilpailutuksen tekee Sortter.",
  "Tarjouksen antaa POP Vakuutus." Jesse pyysi poistamaan kumppanien nimet
  laina- ja vakuutuskohdista, ja tilalla on nyt neutraali `note`.

  MIKSI TÄMÄ ON RISKI, JA MIKSI SE SILTI TEHTIIN NÄIN. Vakuutusnapin
  teksti on "Kilpailuta vakuutus", mutta sen takana on yhden yhtiön oma
  tarjouspyyntö eikä usean yhtiön vertailu. Jos sivusto ei kerro sitä
  missään, se on kuluttajansuojalain 2 luvun tarkoittama harhaanjohtava
  markkinointiväite, ja se on lisäksi ensimmäinen asia, jonka
  affiliate-ohjelman compliance-tarkastus huomaa. Kumppanuuden katkeaminen
  tarkoittaisi sivuston koko liikevaihtoa.

  Jesse pyysi samana päivänä poistamaan nimet myös `TrustBlock`ista ja
  meta-kuvauksesta, eli nimiä ei ole enää missään etusivulla. Rajaus jäi
  silti yhteen paikkaan: `components/home/TrustBlock.tsx` kohta 03 sanoo
  "vakuutuksia emme vertaile" nimeämättä yhtiötä. SE LAUSE EI SAA KADOTA,
  koska se on nyt ainoa paikka etusivulla, jossa rajaus sanotaan. Jos se
  poistuu, "Kilpailuta vakuutus" jää väitteeksi ilman katetta.

  Nimi lukee edelleen `/kayttoehdot`- ja `/tietosuoja`-sivuilla, joissa se
  kuuluukin olla, koska tietojen vastaanottaja on kerrottava.

  `note` ON NEUTRAALI MUTTA SEN ON PYSYTTÄVÄ TOTENA. Vakuutuksen rivillä ei
  saa lukea "vertaa vakuutusyhtiöitä" tai mitään sen suuntaista, koska
  vertailua ei ole. "Maksuton tarjous, ei sitoumuksia" on totta.
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

/*
  KUMPPANI VÄLI-ILMOITUSTA VARTEN (Jessen pyyntö 19.9.2026).

  Vakuutuslinkki ei enää vie suoraan POP:n lomakkeelle vaan avaa pienen
  ikkunan, jossa on otsikko, yksi kappale tekstiä ja kaksi nappia. Ikkunan
  toteutus ja sen tuottoperustelut ovat `components/PartnerDialog.tsx`:n
  yläkommentissa; tässä on vain se tieto, jonka ikkuna piirtää.

  MIKSI NIMI PALAA TÄHÄN, VAIKKA SE POISTETTIIN PALVELUKOHDISTA. Nämä ovat
  eri asioita eivätkä ole ristiriidassa. Jesse poisti nimet siitä, mitä
  kävijä lukee selatessaan sivua. Tämä teksti näkyy vasta siinä hetkessä,
  kun kävijä on jo päättänyt siirtyä, ja juuri silloin hänen on tiedettävä
  kenen sivulle hän on menossa. Ikkuna siis korjaa sen saman aukon, jonka
  tämän tiedoston yläkommentti merkitsi sivuston avoimeksi riskiksi.

  `note` EI SAA VÄITTÄÄ VERTAILUA. Sama sääntö kuin `Service.note`:ssa,
  mutta tässä se on tiukempi: tämä on viimeinen teksti ennen siirtymää,
  eli se on se lause, jota vasten "Kilpailuta vakuutus" -nappia luetaan.
  Rajaus on sanottava tässä suoraan.
*/
export const POP_PARTNER: Partner = {
  id: "pop-vakuutus",
  name: "POP Vakuutus",
  note: "Tarjouspyyntö täytetään POP Vakuutuksen omalla sivustolla. Emme vertaile vakuutusyhtiöitä, joten tarjouksen antaa yksi yhtiö. Tarjous on maksuton eikä sido mihinkään.",
  confirmLabel: "Siirry POP Vakuutukseen",
};

export interface Service {
  /** Ankkuri etusivulla, esim. "sahko" → `#sahko`. */
  key: string;
  /** Lyhyt nimi. Yhden sanan nimet mahtuvat rinnakkain 390 pikselillä. */
  name: string;
  /** Mihin painike vie. Ulkoinen osoite tunnistetaan `external`-lipusta. */
  href: string;
  /** Onko kohde kumppanin sivu: vaikuttaa `rel`-arvoon ja klikkiseurantaan. */
  external?: true;
  /**
   * Kumppani, jonka väli-ilmoitus näytetään ennen siirtymää. Jos tämä on
   * annettu, linkki avaa `PartnerDialog`-ikkunan tavallisella klikillä.
   *
   * KENTÄN ON OLTAVA SARJALLISTUVAA DATAA. `Service.Icon` on funktio, ja
   * juuri siksi sitä ei voi välittää palvelinkomponentista
   * asiakaskomponentille (ks. `ServiceCta`). `Partner` on pelkkiä
   * merkkijonoja, joten se kulkee. Älä lisää tähän funktioita.
   */
  partner?: Partner;
  Icon: LucideIcon;
  /** Yksi rivi siitä, mitä kävijä saa. Ei lupauksia säästöstä. */
  lead: string;
  /**
   * Yksi lyhyt rivi napin alle: mitä kävijä saa. EI kumppanin nimeä, mutta
   * ks. tiedoston yläkommentti: tämän on silti pysyttävä totena. Vakuutuksen
   * rivillä ei saa väittää vertailua, koska vertailua ei ole.
   */
  note: string;
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
      /*
        SIVUN ALKUUN, EI ANKKURIIN (19.9.2026, Jessen pyyntö).

        Tässä oli `ENERGY_COMPARE`, eli `/sahkosopimukset#vertailu`. Ankkuri
        osoittaa laskurikorttiin, joka nousee heron alareunan päälle, joten
        selain hyppäsi työpöydällä suoraan kyselyyn ja ohitti sähkösivun
        heron kokonaan. Kävijä laskeutui keskelle lomaketta tietämättä mille
        sivulle hän tuli.

        `ENERGY_PATH` vie sivun alkuun. Laskuri ei jää piiloon: se on heron
        sisällä ja näkyy heti ensiruudussa (ks. CLAUDE.md, CRO-kohta 1).
        Kävijä saa siis saman työkalun ja lisäksi sen, mitä sivu lupaa.
      */
      href: ENERGY_PATH,
      Icon: Zap,
      lead: "Näet jokaisen sopimuksen vuosihinnan euroina omalla kulutuksellasi.",
      note: "Vuosihinta euroina omalla kulutuksellasi",
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
            note: "Yksi hakemus, useita tarjouksia",
            cta: "Vertaile lainoja",
          } satisfies Service,
        ]
      : []),
    {
      key: "vakuutukset",
      name: "Vakuutukset",
      href: POP_INSURANCE_URL,
      external: true,
      partner: POP_PARTNER,
      Icon: ShieldCheck,
      lead: "Pyydä tarjous vakuutuksistasi ja vertaa sitä nykyiseen laskuusi.",
      /*
        TÄMÄ RIVI EI SAA VÄITTÄÄ VERTAILUA. Kohteena on yhden yhtiön oma
        tarjouspyyntö, joten "vertaa vakuutusyhtiöitä" tai mikä tahansa sen
        suuntainen olisi harhaanjohtava. "Maksuton tarjous, ei sitoumuksia"
        on totta. Kuka tarjouksen antaa, sanotaan `TrustBlock`in kohdassa 03.
      */
      note: "Maksuton tarjous, ei sitoumuksia",
      cta: "Kilpailuta vakuutus",
    },
  ];
}
