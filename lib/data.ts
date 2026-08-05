import cardsJson from "@/data/cards.json";
import postsJson from "@/data/posts.json";
import faqJson from "@/data/faq.json";
import type { Card, Post, FaqItem } from "./types";

/**
 * Sisältökerros: kaikki data luetaan JSON-tiedostoista.
 * Korttien lisääminen tai muokkaaminen ei vaadi koodimuutoksia –
 * riittää, että data/cards.json päivitetään (käsin tai admin-paneelista).
 */
export function getCards(): Card[] {
  return cardsJson.cards as Card[];
}

/**
 * Kertoo, ovatko korttien korot, kulut ja arviot vielä esimerkkilukuja.
 * Niin kauan kuin tämä on tosi, sivustolla näytetään siitä huomautus —
 * keksityillä luvuilla markkinointi on kuluttajansuojariski. Kun oikeat
 * ehdot on syötetty, aseta `isExampleData: false` data/cards.json:iin.
 */
export const CARDS_ARE_EXAMPLE_DATA: boolean = cardsJson.isExampleData === true;

export function getCard(slug: string): Card | undefined {
  return getCards().find((c) => c.slug === slug);
}

export function getPosts(): Post[] {
  return postsJson.posts as Post[];
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function getFaq(): FaqItem[] {
  return faqJson.items as FaqItem[];
}

export const SITE = {
  /**
   * NIMI ON DOMAIN — MUTTA VAIN SIELLÄ MISSÄ SE ON NIMILAPPU.
   *
   * `name` menee tunnuksiin, selaimen välilehdelle, hakutuloksen
   * otsikkoon, og:site_nameen ja footerin tekijänoikeusriville. Näissä
   * nimi seisoo yksin, ja päätteellinen muoto kertoo kävijälle suoraan
   * mihin osoitteeseen palataan. Vertailupalvelun toistuva käyttö tulee
   * pitkälti siitä, että osoite muistetaan ilman hakukonetta — se on
   * ilmaisinta mahdollista kävijähankintaa.
   *
   * LEIPÄTEKSTISSÄ JA LAKISIVUILLA nimi kirjoitetaan yhä muodossa
   * "Kettukilpailutus". Suomessa domain taipuu kaksoispisteellä
   * ("Kettukilpailutus.fi:n rekisteriseloste"), ja se muoto lukee
   * kömpelösti juuri niillä sivuilla, joiden tehtävä on vakuuttaa
   * lukija siitä, että takana on oikea yritys.
   */
  name: "Kettukilpailutus.fi",
  url: "https://www.kettukilpailutus.fi",
  description:
    "Kettu kilpailuttaa sopimuksesi puolestasi. Sähkösopimukset puolueettomasti vertailtuna omilla luvuillasi — ilmaiseksi ja selvällä suomella.",

  /**
   * YLLÄPITÄJÄN TIEDOT — footerin luottamuslohko.
   *
   * MIKSI NÄMÄ OVAT OLEMASSA: suomalainen 40–60-vuotias kävijä tarkistaa
   * footerista, onko sivun takana oikea yritys. Jos Y-tunnusta ei löydy,
   * vertailusivu näyttää hänen silmissään ulkomaiselta liidifarmilta, ja
   * hän poistuu ennen "Tee sopimus" -nappia. Tunnus on siis suoraan
   * tuottokysymys, ei muodollisuus.
   *
   * MIKSI TYHJÄNÄ EIKÄ KEKSITTYNÄ: keksitty Y-tunnus on väärää tietoa
   * ja tekisi affiliate-kumppanille compliance-riskin. Footer piilottaa
   * jokaisen kentän, joka on tyhjä — eli sivu näyttää siistiltä myös
   * ennen kuin tiedot ovat olemassa.
   *
   * TÄYTÄ NÄMÄ HETI KUN YRITYS ON PERUSTETTU. Muuta ei tarvitse tehdä:
   * footerin lohko ilmestyy itsestään.
   */
  operator: {
    /** esim. "Kettukilpailutus Oy" */
    legalName: "Kettukilpailutus Oy",
    /** esim. "1234567-8" */
    businessId: "3326500-5",
    /** osoite johon kävijä voi kirjoittaa, esim. "info@kettukilpailutus.fi" */
    email: "kettu@kettukilpailutus.fi",
  },
};
