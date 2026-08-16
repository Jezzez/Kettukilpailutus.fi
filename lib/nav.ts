/*
  SÄHKÖVERTAILUN OSOITE ON YHDESSÄ PAIKASSA.

  Vertailu siirtyi osoitteesta /sahkosopimukset etusivulle (ks. app/page.tsx
  ja next.config.mjs). Siitä seuraa kaksi asiaa, jotka menivät helposti
  rikki eri puolilla koodia:

  1. Sähkösivun osoite on nyt "/". Jos se jää kirjoitetuksi käsin
     kymmeneen tiedostoon, seuraava siirto jättää osan linkeistä
     ohjauksen taakse — ja jokainen turha ohjaus on hidastus juuri
     sillä matkalla, jonka päässä affiliate-nappi on.

  2. "Ollaanko sähkösivulla" ei ole enää `startsWith("/sahkosopimukset")`,
     koska etusivu ei ala sillä. Ilman tätä tarkistusta navigaation
     aktiivimerkki, footerin linkkilista ja maskotin tervehdys pitäisivät
     sivuston tärkeintä sivua "jonain muuna sivuna".
*/

/** Sähkövertailun sivu. */
export const ENERGY_PATH = "/";

/** Suora linkki laskuriin: sama sivu, ankkuri vertailulohkoon. */
export const ENERGY_COMPARE = "/#vertailu";

/** Kuuluuko polku sähkövertikaaliin. Etusivu kuuluu. */
export function isEnergyPath(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/sahkosopimukset");
}
