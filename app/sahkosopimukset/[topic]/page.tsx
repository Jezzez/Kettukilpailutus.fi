import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ElectricityExperience from "@/components/energy/ElectricityExperience";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import CtaSection from "@/components/CtaSection";
import { getEnergyTopic, getEnergyTopics, getPlans } from "@/lib/energy";
import { OG_IMAGE, SITE } from "@/lib/data";

export function generateStaticParams() {
  return getEnergyTopics().map((t) => ({ topic: t.slug }));
}

export function generateMetadata({ params }: { params: { topic: string } }): Metadata {
  const topic = getEnergyTopic(params.topic);
  if (!topic) return {};
  return {
    // Brändi tulee layoutin title-templatesta. Kun se oli myös tässä, otsikko
    // päättyi "| Kettukilpailutus | Kettukilpailutus".
    title: topic.title,
    description: topic.intro,
    alternates: { canonical: `/sahkosopimukset/${topic.slug}` },
    /*
      Next.js ei johda openGraphia `title`-kentästä, vaan perii juuritason
      lohkon sellaisenaan. Ilman tätä jokainen näistä neljästä sivusta
      näyttäisi jaettuna etusivun otsikon. Juuri näille sivuille se sattuu
      pahiten: ne ovat sivuston hakukonesisääntulot, eli niitä myös jaetaan
      eniten eteenpäin, ja aiheeseen osunut linkki menettää koko arvonsa jos
      esikatselu lupaa jotain muuta.
    */
    openGraph: {
      title: topic.title,
      description: topic.intro,
      url: `/sahkosopimukset/${topic.slug}`,
      // Pakko toistaa: sivun oma openGraph-lohko korvaa juuritason lohkon
      // kokonaan, jolloin kuva katoaisi. Ks. OG_IMAGE lib/data.ts.
      images: [OG_IMAGE],
    },
  };
}

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topic = getEnergyTopic(params.topic);
  if (!topic) notFound();

  const plans = getPlans();

  const faqJsonLd = topic.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: topic.faq.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }
    : null;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      /* Kaksi askelta, ei kolmea: sähkövertailu ON etusivu, joten
         "Etusivu > Sähkösopimukset" olisi sama osoite kahdesti. Google
         hylkää murupolun, jonka askeleet osoittavat samaan URLiin. */
      { "@type": "ListItem", position: 1, name: "Sähkösopimukset", item: SITE.url },
      { "@type": "ListItem", position: 2, name: topic.h1, item: `${SITE.url}/sahkosopimukset/${topic.slug}` },
    ],
  };

  return (
    <div className="pb-4">
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="mx-auto max-w-[1180px] px-4 pt-8 sm:px-6">
        <nav aria-label="Murupolku" className="flex items-center gap-1.5 text-[13px] text-ink/60">
          <Link href="/" className="hover:text-ink">Sähkösopimukset</Link>
          <ChevronRight size={13} aria-hidden />
          <span className="text-ink/85">{topic.h1}</span>
        </nav>

        <Reveal>
          <h1 className="mt-6 max-w-2xl font-hero text-[2.4rem] leading-[1.06] text-ink sm:text-[3rem]">
            {topic.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink/80">{topic.intro}</p>
        </Reveal>
      </div>

      {/* Esisuodatettu vertailu heti otsikon alle */}
      <div className="pt-8">
        <ElectricityExperience
          plans={plans}
          initialType={topic.presetType}
          initialKwh={topic.presetKwh ?? 5000}
          withHero={false}
        />
      </div>

      {/* Opasteksti */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <div className="space-y-5">
              {topic.content.map((p, i) => (
                <p key={i} className="text-[16px] leading-relaxed text-ink/80">{p}</p>
              ))}
            </div>
          </Reveal>

          {topic.faq.length > 0 && (
            <Reveal className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-ink">Usein kysyttyä</h2>
              <div className="mt-5">
                <Faq items={topic.faq.map(([q, a]) => ({ q, a }))} />
              </div>
            </Reveal>
          )}

          {/* Sisäinen linkitys muihin oppaisiin */}
          <Reveal className="mt-10">
            <h2 className="font-display text-lg font-semibold text-ink">Katso myös</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {getEnergyTopics()
                .filter((t) => t.slug !== topic.slug)
                .map((t) => (
                  <Link
                    key={t.slug}
                    href={`/sahkosopimukset/${t.slug}`}
                    className="lift rounded-2xl border border-line bg-white p-4 text-[13.5px] font-semibold leading-snug text-ink shadow-card hover:border-accent/35"
                  >
                    {t.h1}
                  </Link>
                ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaSection
        href="/#vertailu"
        title="Katso, paljonko sinä säästäisit"
        text="Kulutusarvio, todelliset vuosihinnat ja paras sopimus — parissa minuutissa."
        button="Kilpailuta sähkösopimus"
      />
    </div>
  );
}
