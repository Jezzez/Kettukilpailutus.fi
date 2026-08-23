import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import RouteCards from "@/components/home/RouteCards";
import SpreadBlock from "@/components/home/SpreadBlock";
import LoansBelt from "@/components/home/LoansBelt";
import TrustBlock from "@/components/home/TrustBlock";
import GuideRail from "@/components/home/GuideRail";
import ClosingBelt from "@/components/home/ClosingBelt";
import { getPosts, OG_IMAGE, SITE } from "@/lib/data";
import { getHomeFacts } from "@/lib/home";
import { FEATURES } from "@/lib/features";

/*
  ETUSIVU — HUB.

  MITÄ TÄSSÄ ON KORJATTU. Vanha etusivu oli mobiilissa 4231 pikseliä korkea,
  siitä noin 2000 pikseliä yhtenäistä vaaleaa ilman yhtään väripintaa, ja
  ainoa oranssi vyö oli aivan lopussa. Kuusi lähes samannäköistä korttia
  peräkkäin ei kertonut kävijälle, mikä niistä on tärkein. Kun mikään ei ole
  korostettu, kaikki on yhtä tärkeää, ja kävijä valitsee sen mikä on
  lähinnä — eli usein ei mitään.

  KOLME RATKAISUA:

  1. RYTMI. Pinta vaihtuu kuusi kertaa: ember → vaalea → hiekka → ember →
     paperi → usva → ember. Jokainen vaihdos on syy jatkaa selaamista, ja
     kolme oranssia vyötä jakavat sivun paloihin, jotka jaksaa lukea.

  2. HIERARKIA. Reittikortit ovat epäsymmetriset (3:2). Sähkö on leveämpi,
     valkoinen ja siinä on oranssi nappi; lainat on kapeampi, usvanharmaa ja
     siinä on tekstilinkki. Sähkö on ainoa vertikaali, jossa Kettu itse
     laskee ja jossa palkkio on suurin — sen kuuluu näyttää siltä.

  3. YKSI KOVA LUKU. Sivulla on täsmälleen yksi numeroväite, jota
     kilpailijalla ei ole: halvimman ja kalleimman sopimuksen ero
     ensimmäisenä vuonna. Se lasketaan `lib/home.ts`:ssä oikeasta datasta,
     joten se ei voi vanhentua vahingossa eikä sitä voi kopioida sanomalla
     samaa.

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
        {FEATURES.loans && <LoansBelt />}
        <TrustBlock facts={facts} />
        <GuideRail posts={posts} />
        <ClosingBelt />
      </main>
    </>
  );
}
