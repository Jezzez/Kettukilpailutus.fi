import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import RouteCards from "@/components/home/RouteCards";
import SpreadBlock from "@/components/home/SpreadBlock";
import TrustBlock from "@/components/home/TrustBlock";
import GuideRail from "@/components/home/GuideRail";
import ClosingBelt from "@/components/home/ClosingBelt";
import { getPosts, OG_IMAGE, SITE } from "@/lib/data";
import { getHomeFacts } from "@/lib/home";

/*
  ETUSIVU — HUB.

  KUUSI OSIOTA, JOKAINEN YKSI ASIA. Etusivun aiemmat versiot yrittivät
  tehdä monta asiaa kerralla: ne limittivät osioita päällekkäin, vaihtoivat
  taustaa seitsemän kertaa ja ripottelivat maskotin joka toiseen lohkoon.
  Lopputulos oli 5987 pikseliä pitkä sivu, jolla ei ollut yhtään kohtaa,
  josta silmä olisi tiennyt mistä aloittaa. Nyt jokaisella osiolla on yksi
  tehtävä ja sen tehtävä lukee pikkuotsikossa.

  1. HERO — kuka olemme ja mihin painetaan. Kaksi palstaa, teksti ja kuva
     erillään; kuva ei voi kasvaa tekstin päälle.
  2. REITIT — sähkö vai lainat. Hubin ainoa varsinainen työ, ja siksi heti
     heron alla ennen yhtäkään perustelua.
  3. HINTAERO — yksi kova luku, joka tekee klikistä tarpeellisen.
  4. LÄPINÄKYVYYS — mistä saamme palkkamme.
  5. OPPAAT — ulospääsy niille, jotka eivät ole vielä valmiita.
  6. LOPPUKEHOTUS — toinen ja viimeinen nappi.

  ORANSSIA ON KAKSI VYÖTÄ, ei kolme. Erillinen lainavyö keskellä sivua
  poistettiin: se toisti sanasta sanaan sen, mikä lukee jo reittikortissa,
  ja maksoi noin 700 pikseliä pystytilaa. Toisto ei ollut painotusta vaan
  este halvimman klikin ja kävijän välissä.

  MITÄ TÄSSÄ EI OLE: laskuria, kyselyä eikä sopimuslistaa. Ne kuuluvat
  `/sahkosopimukset`-sivulle portin taakse (ks. CLAUDE.md). Hubin tehtävä on
  tehdä klikistä tarpeellinen, ei korvata sitä.
*/

export const metadata: Metadata = {
  title: { absolute: "Kettukilpailutus.fi – kilpailuta sähkösopimukset ja lainat" },
  description:
    "Kilpailuta sähkösopimukset ja lainat yhdessä paikassa. Kettu laskee sähkön vuosihinnan omalla kulutuksellasi ja hakee lainatarjoukset yhdellä hakemuksella.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kettukilpailutus.fi – kilpailuta sähkösopimukset ja lainat",
    description:
      "Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi. Sähkösopimukset sekä lainatarjoukset yhdellä hakemuksella.",
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
          "Suomalainen kilpailutuspalvelu: sähkösopimukset ja lainat puolueettomasti vertailtuna.",
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
        <RouteCards facts={facts} />
        <SpreadBlock facts={facts} />
        <TrustBlock facts={facts} />
        <GuideRail posts={posts} />
        <ClosingBelt />
      </main>
    </>
  );
}
