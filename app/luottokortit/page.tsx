import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Steps from "@/components/Steps";
import Stats from "@/components/Stats";
import CardComparison from "@/components/CardComparison";
import ComparisonTable from "@/components/ComparisonTable";
import GuideBoxes from "@/components/GuideBoxes";
import TrustSection from "@/components/TrustSection";
import Faq from "@/components/Faq";
import CtaSection from "@/components/CtaSection";
import Reveal from "@/components/Reveal";
import FoxSays from "@/components/FoxSays";
import SectionHead from "@/components/SectionHead";
import { getCards, getFaq, SITE } from "@/lib/data";

export const metadata: Metadata = {
  // Layoutin title-template lisää jo "| Kettukilpailutus". Kun se oli myös
  // tässä, selaimen välilehdellä ja Googlen hakutuloksessa luki brändi kahdesti
  // — se lyhentää näkyvää otsikkoa ja näyttää huolimattomalta juuri siinä
  // kohdassa, jossa klikkaus hakutuloksesta ratkaistaan.
  title: "Vertaa luottokortit – löydä paras kortti",
  description:
    "Vertaa Suomen suosituimmat luottokortit: edut, kulut ja korot puolueettomasti. Kolme kysymystä ja Kettu järjestää kortit sinulle sopivuuden mukaan.",
  alternates: { canonical: "/luottokortit" },
  openGraph: {
    title: "Vertaa luottokortit – löydä paras kortti",
    description:
      "Vertaa Suomen suosituimmat luottokortit: edut, kulut ja korot puolueettomasti rinnakkain.",
    url: "/luottokortit",
  },
};

export default function CreditCardsPage() {
  const cards = getCards();
  const faq = getFaq();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Etusivu", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Luottokortit", item: `${SITE.url}/luottokortit` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Hero cardCount={cards.length} />

      {/* Vertailupaneeli heti heron alla — mockupin mukaan */}
      <section id="vertailu" className="relative z-10 -mt-6 scroll-mt-24 pb-8">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <CardComparison cards={cards} />
        </div>
      </section>

      <TrustBar />

      <Steps />

      {/* Vertailutaulukko */}
      <section id="taulukko" className="scroll-mt-24 border-y border-line bg-white py-20 md:py-24">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <SectionHead
              eyebrow="Koko vertailu"
              title="Kaikki tiedot yhdessä taulukossa"
              lead="Järjestä taulukko vuosimaksun, koron tai luottorajan mukaan klikkaamalla saraketta."
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <ComparisonTable cards={cards} />
          </Reveal>
        </div>
      </section>

      {/*
        Kettu puhuu taulukon jälkeen: lukija on juuri katsonut kymmentä
        saraketta ja miettii, mikä niistä ratkaisee. Repliikki nimeää sen.
        Todellinen vuosikorko on ainoa luku, jolla kaksi korttia voi
        rehellisesti rinnastaa — ja kun lukija ymmärtää sen, hän valitsee
        kortin luottavaisemmin eikä palaa googlaamaan muualle.
      */}
      <FoxSays
        className="pb-4 pt-14 md:pt-16"
        quote="Korotonta maksuaikaa mainostetaan isolla. Korkoa, joka alkaa juosta sen jälkeen, ei."
        note="Siksi taulukossa näkyy todellinen vuosikorko: se sisältää myös kulut, joten se on ainoa luku, jolla kaksi korttia voi asettaa rinnakkain."
      />

      <Stats cardCount={cards.length} />

      <GuideBoxes />

      <TrustSection />

      {/* UKK */}
      <section id="ukk" className="scroll-mt-24 border-t border-line py-20 md:py-24">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <SectionHead
              align="center"
              eyebrow="Usein kysyttyä"
              title="Kysymykset, jotka kannattaa selvittää ennen hakemista"
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <Faq items={faq} />
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
