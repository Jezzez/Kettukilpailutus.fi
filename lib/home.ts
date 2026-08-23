/*
  ETUSIVUN FAKTAT — LASKETAAN, EI KIRJOITETA KÄSIN.

  Etusivun ainoa kova myyntiargumentti on se, että sopimusten välinen ero on
  isompi kuin ihmiset luulevat. Se luku on houkuttelevin mahdollinen koukku,
  mutta samalla vaarallisin: käsin kirjoitettuna se vanhenee heti kun
  `data/electricity.json` muuttuu, ja vanhentunut euromäärä etusivulla on
  täsmälleen se virhe, joka vie luottamuksen koko vertailulta.

  Siksi jokainen tämän tiedoston palauttama luku johdetaan samasta datasta ja
  samoilla funktioilla kuin vertailusivun hinnat. Jos hinta muuttuu, etusivu
  muuttuu mukana ilman että kukaan muistaa käydä muuttamassa sitä.

  MITÄ TÄSSÄ EI LASKETA: halvinta sopimusta nimeltä eikä sen hintaa. Se on
  vertailun vastaus, ja vastaus kuuluu vertailusivulle. Etusivu kertoo vain
  kuinka paljon valinnalla on väliä — se tekee klikistä tarpeellisen sen
  sijaan, että korvaisi sen.
*/

import { annualCost, getPlans, DWELLINGS, PRICE_DATE } from "@/lib/energy";

export interface SpreadRow {
  /** Asumismuodon avain, sama kuin `DWELLINGS`-taulukossa. */
  key: string;
  /** Lyhyt nimi, mahtuu puhelimen riville. */
  label: string;
  /** Vuosikulutus kWh. */
  kwh: number;
  /** Halvimman ja kalleimman ensimmäisen vuoden hinnan ero, euroa. */
  spread: number;
  /** Suhde suurimpaan eroon, 0–1. Palkin pituus. */
  ratio: number;
}

/** Etusivun chipeille ja luvuille tarvittavat tosiasiat. */
export interface HomeFacts {
  /** Näkyvien sopimusten määrä. */
  planCount: number;
  /** Montako eri sähköyhtiötä vertailussa on. */
  providerCount: number;
  /** Montako näkyvää sopimusta ei tuota palkkiota. */
  nonPartnerCount: number;
  /** Hintojen tarkistuspäivä ISO-muodossa. */
  priceDate: string;
  /** Hintaero asumismuodoittain, suurin ensin. */
  spreads: SpreadRow[];
  /** Suurin yksittäinen ero euroina — heron luku. */
  maxSpread: number;
}

/**
 * Lyhennetty nimi etusivun kapeaan sarakkeeseen.
 *
 * `DWELLINGS`-taulukon "Sähkölämmitteinen talo" on 22 merkkiä eikä mahdu
 * puhelimessa yhdelle riville palkin viereen. Katkennut nimi näyttää
 * rikkinäiseltä juuri siinä kohdassa, jossa lukijan pitäisi uskoa numero.
 */
const SHORT_LABEL: Record<string, string> = {
  kerrostalo: "Kerrostalo",
  rivitalo: "Rivitalo",
  omakotitalo: "Omakotitalo",
  sahkolammitys: "Sähkölämmitys",
};

export function getHomeFacts(): HomeFacts {
  const plans = getPlans();

  /*
    Ero lasketaan vain kolmelle asumismuodolle neljästä. Neljä riviä on liikaa
    yhteen silmäykseen, ja kerrostalo–rivitalo–sähkölämmitys kattaa koko
    asteikon pienimmästä suurimpaan. Omakotitalo jää pois, koska se asettuu
    keskelle eikä lisää mitään, mitä rivitalo ei jo kerro.
  */
  const shown = ["kerrostalo", "rivitalo", "sahkolammitys"];

  const rows = DWELLINGS.filter((d) => shown.includes(d.key)).map((d) => {
    const costs = plans.map((p) => annualCost(p, d.kwh));
    const spread = Math.max(...costs) - Math.min(...costs);
    return {
      key: d.key,
      label: SHORT_LABEL[d.key] ?? d.label,
      kwh: d.kwh,
      spread,
      ratio: 0,
    };
  });

  const max = Math.max(...rows.map((r) => r.spread));

  return {
    planCount: plans.length,
    providerCount: new Set(plans.map((p) => p.provider)).size,
    nonPartnerCount: plans.filter((p) => p.partner === false).length,
    priceDate: PRICE_DATE,
    spreads: rows.map((r) => ({ ...r, ratio: r.spread / max })),
    maxSpread: max,
  };
}

/** Euromäärä ilman senttejä. Etusivulla ei ole yhtään lukua, jossa sentit merkitsisivät. */
export function euro(value: number): string {
  return `${Math.round(value).toLocaleString("fi-FI")} €`;
}

/** ISO-päivä muodossa "20.8.2026". */
export function fiDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
}
