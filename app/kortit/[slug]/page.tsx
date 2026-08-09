import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, X, Star } from "lucide-react";
import { getCard, getCards, OG_IMAGE, SITE } from "@/lib/data";
import { FEATURES } from "@/lib/features";
import AffiliateButton from "@/components/AffiliateButton";
import { CardMark } from "@/components/CardTile";
import Faq from "@/components/Faq";
import CardPageTabs from "@/components/CardPageTabs";
import StickyApply from "@/components/StickyApply";
import Reveal from "@/components/Reveal";
import TailSweep from "@/components/fox/TailSweep";

/**
 * Staattinen generointi kaikille korteille — nopein mahdollinen sivu.
 * Kun korttiosio on piilotettu, sivuja ei generoida lainkaan: muuten
 * build kirjoittaisi kahdeksan valmista HTML-tiedostoa osiosta, jonka
 * on tarkoitus olla poissa näkyvistä.
 */
export function generateStaticParams() {
  if (!FEATURES.cards) return [];
  return getCards().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  if (!FEATURES.cards) return {};

  const card = getCard(params.slug);
  if (!card) return {};
  const title = `${card.name} – kokemuksia, edut ja kulut 2026`;
  const description = `${card.summary} Vuosimaksu ${card.annualFee}, korko ${card.interest}. Katso hyödyt, haitat ja hae verkossa.`;
  return {
    title,
    description,
    alternates: { canonical: `/kortit/${card.slug}` },
    // `images` on pakko toistaa: sivun oma openGraph-lohko korvaa
    // juuritason lohkon kokonaan. Ks. OG_IMAGE lib/data.ts.
    openGraph: {
      title,
      description,
      url: `${SITE.url}/kortit/${card.slug}`,
      type: "article",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}

export default function CardPage({ params }: { params: { slug: string } }) {
  if (!FEATURES.cards) notFound();

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
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/*
        KORTTISIVUN OTSIKKOALUE ON LÄMMIN VYÖ, EI ORANSSI.

        Muualla sivustolla sisääntulo merkitään täysleveällä oranssilla
        vyöllä. Tässä sitä ei tehdä, ja syy on tuotossa: tämän sivun
        tärkein elementti on oranssi "Hae kortti" -nappi. Oranssi nappi
        oranssilla vyöllä katoaa, ja jouduttaisiin vaihtamaan
        kermanvalkoiseen — eli sivun ainoa ostonappi vaihdettaisiin
        heikommaksi vain, jotta tausta olisi näyttävämpi. Väärä
        vaihtokauppa.

        `bg-mist/60` oli kuitenkin liian huomaamaton: se on neljä
        sävyaskelta paperista, eli käytännössä sama väri. Otsikkoalue
        luki samana pintana kuin muu sivu. `pelt-surface` on lämmin
        persikansävy kulta- ja oranssihehkuineen — se erottaa
        "kuka tämä kortti on" -osan lukudatasta, ja oranssi nappi jää
        edelleen ruudun kirkkaimmaksi pisteeksi.

        `relative z-[1]`: pinnan kohinapinta on `::after`, joka piirtyy
        asemoimattomien lapsien päälle.
      */}
      <header className="pelt-surface border-b border-line">
        <div className="relative z-[1] mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16">
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
            {/*
              Napin teksti oli oletusarvo "Katso kortti". Se on väärä
              kehote juuri tässä: lukija ON korttisivulla ja katsoo
              korttia. Nappi vie pankin omalle hakusivulle, ja sen
              pitää sanoa se — sekä mitä tapahtuu että se, että siirrytään
              pois sivustolta. Epäselvä kehote tulkitaan mainokseksi ja
              jätetään painamatta.

              Pankin nimeä ei kirjoiteta tähän: suomen genetiivi ei
              synny lisäämällä "n" perään ("S-Pankki" → "S-Pankin",
              ei "S-Pankkin", ja "OP" → "OP:n"). Ohjelmallinen
              taivutus tuottaisi kielivirheen kortista riippuen, ja
              kielivirhe napissa maksaa enemmän kuin nimen puuttuminen.
            */}
            <AffiliateButton href={card.affiliateUrl} cardId={card.id} placement="card-page-hero">
              Hae kortti pankin sivuilla
            </AffiliateButton>
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

      </div>

      {/*
        LOPPUKEHOTE ON TÄYSLEVEÄ VYÖ, EI PYÖREÄ LAATIKKO.

        Tässä oli oranssi laatikko vaalean palstan sisällä. Laatikko
        päättyy ennen ruudun reunoja, joten silmä lukee sen yhdeksi
        osioksi lisää — samaksi tyypiksi kuin ylempänä olevat
        kulutaulukko ja UKK. Kun koko kaista vaihtaa värin, muutos
        näkyy jo selatessa ja pysäyttää liikkeen. Sama ele kuin
        etusivun, sähkösivun ja oppaiden loppukehotteessa: kun kehote
        näyttää joka sivulla samalta, sitä ei tarvitse lukea
        tunnistaakseen sen.

        Vyö menee kiinni alatunnisteeseen. Oranssi vyö ja heti sen
        alla tumma alatunniste antavat sivulle lopun — juuri siinä
        kohdassa, jossa vaihtoehdot ovat "paina" tai "poistu".
      */}
      <section className="theme-ember ember-surface relative mt-16 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 rotate-180">
          <div className="theme-light">
            <TailSweep fill="rgb(var(--c-paper))" height={64} />
          </div>
        </div>

        <Reveal>
          <div className="relative z-[1] mx-auto max-w-4xl px-4 pb-28 pt-24 text-center sm:px-6 md:pb-24">
            <h2 className="font-hero text-[2rem] leading-[1.08] text-cream sm:text-[2.4rem]">
              Kuulostaako sopivalta?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink/85">
              Hakemus täytetään pankin sivuilla ja vie tyypillisesti alle 10 minuuttia.
            </p>
            {/*
              EMBER-ANSA: `inverse`-nappi käyttää `bg-white`- ja
              `text-accentDark`-luokkia. Ember-vyöllä edellinen on
              ORANSSI ja jälkimmäinen vaalea kerma, eli nappi olisi
              oranssi laatikko oranssilla pohjalla ja teksti katoaisi
              kokonaan. `theme-light`-kääre pakottaa muuttujat takaisin
              vaaleiksi, jolloin nappi on kermanvalkoinen ja teksti
              tummanoranssi — vyön ainoa vaalea piste.
            */}
            <div className="theme-light mt-8">
              <AffiliateButton href={card.affiliateUrl} cardId={card.id} placement="card-page-footer" variant="inverse">
                Siirry hakemaan – {card.name}
              </AffiliateButton>
            </div>
          </div>
        </Reveal>
      </section>

      <StickyApply card={card} />
    </article>
  );
}
