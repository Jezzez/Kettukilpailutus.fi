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
import { getCards, getFaq, SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Vertaa luottokortit – löydä paras kortti | Kettukilpailutus",
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
      <section id="taulukko" className="scroll-mt-24 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Kaikki tiedot yhdessä taulukossa
            </h2>
            <p className="mt-3 max-w-xl text-ink/72">
              Järjestä taulukko vuosimaksun, koron tai luottorajan mukaan klikkaamalla saraketta.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <ComparisonTable cards={cards} />
          </Reveal>
        </div>
      </section>

      <Stats cardCount={cards.length} />

      <GuideBoxes />

      <TrustSection />

      {/* UKK */}
      <section id="ukk" className="scroll-mt-24 py-20 md:py-24">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-semibold text-ink sm:text-4xl">
              Usein kysytyt kysymykset
            </h2>
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
