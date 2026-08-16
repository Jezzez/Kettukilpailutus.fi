/*
  SÄHKÖVERTAILUN OSOITE ON YHDESSÄ PAIKASSA.

  Tämä tiedosto on olemassa siksi, että osoite on ehtinyt vaihtua kahdesti:
  /sahkosopimukset → / → /sahkosopimukset. Joka kerta, kun polku on ollut
  kirjoitettuna käsin kymmeneen tiedostoon, osa linkeistä on jäänyt
  osoittamaan vanhaan paikkaan. Jokainen sellainen linkki on joko turha
  ohjaus tai suora 404 juuri sillä matkalla, jonka päässä affiliate-nappi
  on. Älä kirjoita polkua komponentteihin, tuo se täältä.

  ETUSIVU EI OLE ENÄÄ SÄHKÖSIVU. Osoitteessa `/` on hub, joka esittelee
  sähkön ja lainat. Siksi `isEnergyPath` ei saa palauttaa totta juuresta:
  jos se palauttaisi, navigaation aktiivimerkki näyttäisi "Sähkö"
  valittuna myös hubilla, ja footer tarjoaisi hubilla sähköaiheista
  linkkilistaa muiden palveluiden sijaan.
*/

/** Sähkövertailun sivu. */
export const ENERGY_PATH = "/sahkosopimukset";

/** Suora linkki laskuriin: sama sivu, ankkuri vertailulohkoon. */
export const ENERGY_COMPARE = "/sahkosopimukset#vertailu";

/** Kuuluuko polku sähkövertikaaliin. Hub (`/`) ei kuulu. */
export function isEnergyPath(pathname: string): boolean {
  return pathname.startsWith(ENERGY_PATH);
}
