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
  name: "Kettukilpailutus",
  url: "https://www.kettukilpailutus.fi",
  description:
    "Kettu kilpailuttaa sopimuksesi puolestasi. Sähkösopimukset ja luottokortit puolueettomasti vertailtuna omilla luvuillasi — ilmaiseksi ja selvällä suomella.",
};
