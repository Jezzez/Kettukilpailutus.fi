import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, X, Star } from "lucide-react";
import { getCard, getCards, SITE } from "@/lib/data";
import AffiliateButton from "@/components/AffiliateButton";
import { CardMark } from "@/components/CardTile";
import Faq from "@/components/Faq";
import CardPageTabs from "@/components/CardPageTabs";
import StickyApply from "@/components/StickyApply";
import Reveal from "@/components/Reveal";

/** Staattinen generointi kaikille korteille — nopein mahdollinen sivu. */
export function generateStaticParams() {
  return getCards().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const card = getCard(params.slug);
  if (!card) return {};
  const title = `${card.name} – kokemuksia, edut ja kulut 2026`;
  const description = `${card.summary} Vuosimaksu ${card.annualFee}, korko ${card.interest}. Katso hyödyt, haitat ja hae verkossa.`;
  return {
    title,
    description,
    alternates: { canonical: `/kortit/${card.slug}` },
    openGraph: { title, description, url: `${SITE.url}/kortit/${card.slug}`, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default function CardPage({ params }: { params: { slug: string } }) {
  const card = getCard(params.slug);
  if (!card) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    brand: { "@type": "Brand", name: card.issuer },
    description: card.summary,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: card.rating,
      reviewCount: card.reviews,
      bestRating: 5,
    },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Etusivu", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Kortit", item: `${SITE.url}/#vertailu` },
      { "@type": "ListItem", position: 3, name: card.name, item: `${SITE.url}/kortit/${card.slug}` },
    ],
  };

  return (
    <article className="pb-32 md:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Otsikkoalue */}
      <header className="border-b border-line bg-mist/60">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
          <nav aria-label="Murupolku" className="flex items-center gap-1 text-[13px] text-ink/60">
            <Link href="/" className="hover:text-ink">Etusivu</Link>
            <ChevronRight size={13} aria-hidden />
            <Link href="/luottokortit#vertailu" className="hover:text-ink">Luottokortit</Link>
            <ChevronRight size={13} aria-hidden />
            <span className="text-ink/85">{card.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            <CardMark card={card} size={72} />
            <div>
              <h1 className="font-hero text-[2rem] leading-[1.08] text-ink sm:text-[2.5rem]">
                {card.name}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink/70">
                <Star size={14} className="fill-star text-star" aria-hidden />
                <span className="font-data">{card.rating.toFixed(1)}</span> · {card.reviews} arviota ·{" "}
                {card.issuer} · {card.network}
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">{card.summary}</p>
          <div className="mt-7">
            <AffiliateButton href={card.affiliateUrl} cardId={card.id} placement="card-page-hero" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Avainluvut */}
        <Reveal className="mt-10">
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Vuosimaksu", card.annualFee],
              ["Korko", card.interest],
              ["Luottoraja", card.creditLimit],
              ["Koroton aika", card.interestFreeDays],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line bg-white p-4 shadow-card">
                <dt className="text-xs font-medium uppercase tracking-wide text-ink/60">{k}</dt>
                <dd className="mt-1.5 font-data text-[15px] leading-snug text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Välilehdet: yleiskatsaus / edut / kokemuksia */}
        <Reveal className="mt-12">
          <CardPageTabs card={card} />
        </Reveal>

        {/* Korot ja kulut */}
        <Reveal className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ink">Korot ja kulut</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-line shadow-card">
            <table className="w-full text-sm">
              <caption className="sr-only">{card.name} – kulut</caption>
              <tbody>
                {card.fees.map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? "bg-mist/50" : "bg-white"}>
                    <th scope="row" className="px-5 py-3.5 text-left font-medium text-ink/80">{k}</th>
                    <td className="px-5 py-3.5 text-right font-data text-ink">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink/60">
            Tiedot ovat esimerkinomaisia. Tarkista ajantasaiset ehdot aina pankin sivuilta ennen hakemista.
          </p>
        </Reveal>

        {/* Kortin UKK */}
        {card.faq.length > 0 && (
          <Reveal className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Usein kysyttyä kortista
            </h2>
            <div className="mt-6">
              <Faq items={card.faq.map(([q, a]) => ({ q, a }))} />
            </div>
          </Reveal>
        )}

        {/* Loppu-CTA */}
        <Reveal className="mt-14">
          <div className="rounded-3xl bg-accent p-8 text-center sm:p-10">
            <h2 className="text-2xl font-semibold text-onEmber">Kuulostaako sopivalta?</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-onEmber/85">
              Hakemus täytetään pankin sivuilla ja vie tyypillisesti alle 10 minuuttia.
            </p>
            <div className="mt-6">
              <AffiliateButton href={card.affiliateUrl} cardId={card.id} placement="card-page-footer" variant="inverse">
                Siirry hakemaan – {card.name}
              </AffiliateButton>
            </div>
          </div>
        </Reveal>
      </div>
      <StickyApply card={card} />
    </article>
  );
}
