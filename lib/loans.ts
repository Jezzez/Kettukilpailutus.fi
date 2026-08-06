import type { FaqItem } from "./types";

/**
 * LAINAVERTIKAALIN SISÄLTÖ.
 *
 * TÄMÄ SIVU ON OHJAUSSIVU, EI OPAS. Kettu ei vertaile lainoja, joten
 * sivulla ei ole työkalua jonka äärelle kävijä jäisi. Ainoa asia, joka
 * tällä sivulla tuottaa, on siirtymä kumppanille — ja jokainen rivi,
 * joka ei vie sinne, on rivi jonka aikana kävijä voi poistua.
 *
 * TÄSSÄ OLI AIEMMIN NELJÄ PITKÄÄ TEKSTIOSIOTA (korko, todellinen
 * vuosikorko, lainojen yhdistäminen, maksuhäiriömerkintä). Ne
 * poistettiin: ne olivat blogitekstiä ohjaussivulla, eli ne siirsivät
 * napin ruudullisten päähän ja antoivat lukijalle kolme kertaa
 * mahdollisuuden päättää "luen tämän myöhemmin". Sisältö ei ole hukassa
 * — se kuuluu blogiin, jossa se voi hakea liikennettä omilla
 * osoitteillaan ja ohjata takaisin tänne.
 *
 * TÄSSÄ TIEDOSTOSSA EI OLE YHTÄÄN LUKUA — EIKÄ SAA OLLA.
 * Kaksi syytä, joista kumpikin yksinään riittää:
 *
 * 1) Emme ole tarkistaneet yhtään lainatarjousta. Sivuston koko pääoma
 *    on se, että luvut pitävät paikkansa; keksitty korkoesimerkki
 *    kaataisi sen kerralla myös sähkövertailun osalta.
 * 2) Kuluttajansuojalain 7 luku: heti kun mainonnassa mainitaan korko
 *    tai mikä tahansa muu lainan kustannuksia kuvaava luku, samassa
 *    yhteydessä on annettava todellinen vuosikorko ja edustava
 *    esimerkki. Sitä ei voi antaa oikein, koska tarjous on aina
 *    hakijakohtainen.
 *
 * Luvut näytetään Sortterin omalla sivulla, jossa ne perustuvat
 * oikeisiin pankkitarjouksiin.
 */

/**
 * Kumppani. Linkki on Adtractionista; julkaisijatunnus `as=2098832052`
 * on Jessen tili. Jos tunnus muuttuu, palkkio menee väärään paikkaan.
 */
export const LOAN_PARTNER = {
  id: "sortter",
  name: "Sortter",
  /** Yksi lause, jonka jokainen sana on tarkistettavissa Sortterin sivulta. */
  summary:
    "suomalainen lainanvälittäjä, joka lähettää yhden hakemuksen usealle pankille kerralla",
  url: "https://go.adt291.com/t/t?a=1658832312&as=2098832052&t=2&tk=1",
} as const;

/**
 * Kolme askelta. Tehtävä on kumota yksi pelko — "onko tämä työlästä" —
 * ja päättyä nappiin. Jokainen teksti on yksi rivi: tämä on silmäiltävä
 * kaista, ei luettava osio.
 */
export const LOAN_STEPS: { title: string; text: string }[] = [
  {
    title: "Täytä yksi hakemus",
    text: "Muutama minuutti. Hakemus lähtee usealle pankille kerralla.",
  },
  {
    title: "Vertaa tarjoukset",
    text: "Näet oikeat tarjoukset rinnakkain — et mainoksen alinta korkoa.",
  },
  {
    title: "Valitse tai jätä väliin",
    text: "Hakeminen ei sido. Lainan voi jättää nostamatta myönteisenkin päätöksen jälkeen.",
  },
];

/**
 * UKK — neljä kysymystä, jotka pysäyttävät hakemuksen. Tämä ei ole
 * sisältöä hakukoneelle vaan viimeinen vastalauseiden purku ennen
 * loppunappia, joten mukana on vain se mikä estää klikkaamasta.
 *
 * Faq-komponentti tuottaa näistä itse FAQPage-skeeman, joten sivun ei
 * pidä lisätä samaa JSON-LD:tä uudestaan.
 */
export const LOAN_FAQ: FaqItem[] = [
  {
    q: "Maksaako hakeminen mitään?",
    a: "Ei. Hakemus ja tarjousten vertailu ovat sinulle maksuttomia eivätkä sido sinua mihinkään. Voit jättää lainan nostamatta, vaikka saisit myönteisen päätöksen. Kuluja syntyy vasta nostetusta lainasta.",
  },
  {
    q: "Miksi Kettu ei vertaile lainoja itse?",
    a: "Koska lainan hinta ei ole listahinta. Sähkösopimuksen hinnan voi lukea etukäteen ja laskea sinun kulutuksellasi, mutta lainatarjous syntyy vasta kun pankki on katsonut juuri sinun tietosi. Taulukko, jossa lukisi jokin yleinen korkohaarukka, näyttäisi vertailulta mutta ei kertoisi sinun hinnastasi mitään.",
  },
  {
    q: "Vaikuttaako hakeminen luottotietoihini?",
    a: "Lainahakemus näkyy luottotiedoissasi kyselymerkintänä. Se ei ole maksuhäiriö eikä estä lainan saamista, mutta useat kyselyt lyhyellä aikavälillä voivat vaikuttaa päätökseen. Siksi yksi hakemus usealle pankille on parempi kuin monta hakemusta peräkkäin — se jää yhdeksi merkinnäksi.",
  },
  {
    q: "Miten Kettukilpailutus ansaitsee tällä sivulla?",
    a: "Saamme kumppanilta palkkion, jos siirryt tältä sivulta Sortterille ja teet siellä hakemuksen. Sinulle palvelu on maksuton eikä palkkio vaikuta lainasi hintaan. Kerromme tämän tässä, koska kilpailutuspalvelun ainoa pääoma on se, että kävijä tietää mistä raha tulee.",
  },
];
