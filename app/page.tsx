import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import Verticals from "@/components/home/Verticals";
import TrustBlock from "@/components/home/TrustBlock";
import GuideRail from "@/components/home/GuideRail";
import ClosingBelt from "@/components/home/ClosingBelt";
import { getPosts, OG_IMAGE, SITE } from "@/lib/data";
import { getHomeFacts } from "@/lib/home";

/*
  ETUSIVU — HUB.

  KOLME PALVELUA, SAMA PAINO. Etusivu esitteli aiemmin sähkön omalla
  osiollaan, lainat puolikkaalla kortilla ja vakuutukset ei ollenkaan. Se
  ei ollut päätös vaan kertymä: sähköstä oli eniten kerrottavaa, joten se
  sai eniten tilaa, ja tilasta tuli painotus. Kävijälle sivu näytti
  sähkövertailulta, jossa mainitaan laina, eikä lainaa kilpailuttamaan
  tullut tunnistanut olevansa oikeassa paikassa.

  Nyt jokainen palvelu saa oman, rakenteeltaan identtisen osionsa
  (`components/home/Verticals.tsx`), ja kaikki neljä paikkaa, joissa
  palveluista puhutaan, lukevat saman `lib/services.ts`-taulukon. Yhtä
  palvelua ei voi kasvattaa koskematta kaikkiin kolmeen.

  1. HERO — yksi lupaus ja kolme identtistä laattaa, jotka vievät alas
     omaan osioonsa. Maskotti on taustalla, ei omana palstanaan.
  2.–4. SÄHKÖ, LAINAT, VAKUUTUKSET — sama kuori, sama otsikkokoko, sama
     paneeli, sama nappi. Jokainen vastaa kysymykseen "mitä tapahtuu kun
     painan nappia", koska se on kysymys, joka pysäyttää klikin.
  5. LÄPINÄKYVYYS — mistä saamme palkkamme ja kuka minkäkin työn tekee.
  6. OPPAAT — ulospääsy niille, jotka eivät ole vielä valmiita.
  7. LOPPUKEHOTUS — kolme samannäköistä nappia, viimeinen mahdollisuus.

  ERILLINEN "NÄIN SE TOIMII" -OSIO POISTETTIIN samalla kun vertikaalit
  saivat omat askeleensa. Yleinen kolmen askeleen lista, joka yritti
  kuvata kolmen eri palvelun kulun kerralla, pakotti lukijan kääntämään
  jokaisen lauseen omalle palvelulleen — ja juuri se kääntämisen tarve
  oli se, mistä palautteessa valitettiin. Askeleet ovat nyt sen palvelun
  vieressä, jota ne koskevat.

  TAUSTOJEN RYTMI: oranssi → paperi → usva → paperi → hiekka → usva →
  oranssi. Kahdella peräkkäisellä osiolla ei ole samaa pintaa, koska
  silloin niiden raja katoaa ja kaksi osiota luetaan yhdeksi pitkäksi.

  MITÄ TÄSSÄ EI OLE: laskuria, kyselyä eikä sopimuslistaa. Ne kuuluvat
  `/sahkosopimukset`-sivulle portin taakse (ks. CLAUDE.md). Hubin tehtävä on
  tehdä klikistä tarpeellinen, ei korvata sitä.
*/

export const metadata: Metadata = {
  title: { absolute: "Kettukilpailutus.fi – kilpailuta sähkösopimukset ja lainat" },
  /*
    KUVAUKSESSA MAINITAAN VAKUUTUKSET, OTSIKOSSA EI.

    Vakuutuksissa emme vertaile mitään: POP Vakuutus antaa tarjouksen ja
    Kettu ohjaa sinne. Otsikko "kilpailuta sähkö, lainat ja vakuutukset"
    lupaisi hakutuloksessa vertailun, jota sivulla ei ole, ja lupaus
    romahtaisi yhden klikin päässä. Kuvaus saa siis sanan "vakuutustarjous"
    mukaan sanomalla suoraan, mistä on kyse.
  */
  description:
    "Kilpailuta sähkösopimukset ja lainat yhdessä paikassa ja pyydä vakuutustarjous POP Vakuutukselta. Kettu laskee sähkön vuosihinnan omalla kulutuksellasi ja lainatarjoukset haetaan yhdellä hakemuksella.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kettukilpailutus.fi – kilpailuta sähkösopimukset ja lainat",
    description:
      "Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi. Sähkösopimukset, lainatarjoukset yhdellä hakemuksella ja vakuutustarjous POP Vakuutukselta.",
    url: "/",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE.name + " – Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi.",
      },
    ],
  },
};

export default function HomePage() {
  const facts = getHomeFacts();
  const posts = getPosts();

  const orgId = `${SITE.url}/#organisaatio`;
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/isokettulogo.png`,
        description:
          "Suomalainen kilpailutuspalvelu: sähkösopimukset ja lainat puolueettomasti vertailtuna sekä vakuutustarjous kumppanilta.",
        legalName: SITE.operator.legalName,
        taxID: SITE.operator.businessId,
        email: SITE.operator.email,
        areaServed: "FI",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#sivusto`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "fi-FI",
        publisher: { "@id": orgId },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <main>
        <HomeHero facts={facts} />
        <Verticals facts={facts} />
        <TrustBlock facts={facts} />
        <GuideRail posts={posts} />
        <ClosingBelt />
      </main>
    </>
  );
}
