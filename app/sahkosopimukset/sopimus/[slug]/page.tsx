import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Leaf, Star, Tag, X, Zap } from "lucide-react";
import AffiliateButton from "@/components/AffiliateButton";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import {
  getPlan,
  getPlans,
  annualCost,
  normalAnnualCost,
  TYPE_LABEL,
  ASSUMED_SPOT_AVG,
} from "@/lib/energy";
import { OG_IMAGE, SITE } from "@/lib/data";

export function generateStaticParams() {
  return getPlans().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const plan = getPlan(params.slug);
  if (!plan) return {};
  return {
    // Brändi tulee layoutin title-templatesta, ei tähän toiseen kertaan.
    title: `${plan.provider} ${plan.name} – hinta, ehdot ja kustannusarvio`,
    description: `${plan.provider} ${plan.name}: ${plan.summary} Katso hinta omalla kulutuksellasi ja vertaa muihin sopimuksiin.`,
    alternates: { canonical: `/sahkosopimukset/sopimus/${plan.slug}` },
    /*
      Next.js ei johda openGraphia `title`-kentästä. Ilman tätä lohkoa
      kaikki sopimussivut näyttäisivät jaettuna saman etusivun esikatselun,
      eli kaverille lähetetty "katso tätä sopimusta" -linkki ei kertoisi
      mistä sopimuksesta on kyse. Yhtiön nimi esikatselussa on lisäksi se,
      mikä saa linkin näyttämään vertailulta eikä mainokselta.
    */
    openGraph: {
      title: `${plan.provider} ${plan.name} – hinta, ehdot ja kustannusarvio`,
      description: `${plan.provider} ${plan.name}: ${plan.summary}`,
      url: `/sahkosopimukset/sopimus/${plan.slug}`,
      // Pakko toistaa: sivun oma openGraph-lohko korvaa juuritason lohkon
      // kokonaan, jolloin kuva katoaisi. Ks. OG_IMAGE lib/data.ts.
      images: [OG_IMAGE],
    },
  };
}

const EXAMPLE_KWH = [2000, 5000, 18000];

export default function PlanPage({ params }: { params: { slug: string } }) {
  const plan = getPlan(params.slug);
  if (!plan) notFound();

  /* Ks. PlanCard.tsx: "Tee sopimus" on kumppanilinkki. Yhtiölle, jonka
     kanssa ei ole kumppanuutta, sama teksti lupaisi tilausputken, jota
     linkin päässä ei ole. */
  const cta = plan.partner ? "Tee sopimus" : "Siirry palveluntarjoajalle";

  /*
    AGGREGATERATING VAIN JOS ARVIO ON OIKEASTI OLEMASSA.

    Rakennedatassa keksitty tähtiarvio ei ole vain epärehellinen vaan
    myös Googlen rikkaiden tulosten sääntöjen vastainen: arvion on
    perustuttava sivustolla oikeasti näkyviin arvosteluihin. Väärä
    merkintä voi poistaa koko sivuston rikkaista tuloksista, eli se
    maksaisi juuri sitä orgaanista liikennettä, jonka varaan tämä
    sivusto on rakennettu. Kun arviota ei ole, kenttä jätetään pois.
  */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${plan.provider} ${plan.name}`,
    description: plan.summary,
    brand: { "@type": "Brand", name: plan.provider },
    ...(plan.rating !== null && plan.reviews !== null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: plan.rating,
            reviewCount: plan.reviews,
            bestRating: 5,
          },
        }
      : {}),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Etusivu", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Sähkösopimukset", item: `${SITE.url}/sahkosopimukset` },
      { "@type": "ListItem", position: 3, name: `${plan.provider} ${plan.name}`, item: `${SITE.url}/sahkosopimukset/sopimus/${plan.slug}` },
    ],
  };

  return (
    <article className="pb-32 md:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        <nav aria-label="Murupolku" className="flex items-center gap-1.5 text-[13px] text-ink/60">
          <Link href="/" className="hover:text-ink">Etusivu</Link>
          <ChevronRight size={13} aria-hidden />
          <Link href="/sahkosopimukset" className="hover:text-ink">Sähkösopimukset</Link>
          <ChevronRight size={13} aria-hidden />
          <span className="text-ink/85">{plan.provider}</span>
        </nav>

        <Reveal>
          <header className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-mist"
                  aria-hidden
                >
                  <Zap size={20} className="text-ink/35" />
                </span>
                <div>
                  <h1 className="font-hero text-[2rem] leading-[1.08] text-ink sm:text-[2.5rem]">
                    {plan.provider} {plan.name}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ink/70">
                    <span className="rounded-full bg-mist px-2.5 py-0.5 font-semibold">
                      {TYPE_LABEL[plan.type]}{plan.fixedTermMonths ? ` · ${plan.fixedTermMonths} kk` : ""}
                    </span>
                    {plan.green && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accentSoft px-2.5 py-0.5 font-semibold text-accentDark">
                        <Leaf size={11} aria-hidden /> Uusiutuva
                      </span>
                    )}
                    {/* Arvio näkyy vain jos se on olemassa. Kumppaniyhtiöille
                        ei ole riippumatonta arviolähdettä, eikä tähtiä keksitä
                        — ks. PlanCard.tsx:n sama perustelu. */}
                    {plan.rating !== null && (
                      <span className="inline-flex items-center gap-1">
                        <Star size={13} className="fill-star text-star" aria-hidden />
                        <span className="font-data font-semibold text-ink">{plan.rating.toFixed(1)}</span>
                        {plan.reviews !== null ? ` (${plan.reviews} arviota)` : ""}
                      </span>
                    )}
                    {plan.campaign && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accentSoft px-2.5 py-0.5 font-semibold text-accentDark">
                        <Tag size={11} aria-hidden /> {plan.campaign.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink/80">{plan.summary}</p>
            </div>
            <div className="hidden sm:block">
              <AffiliateButton href={plan.affiliateUrl} cardId={plan.id} placement="plan-hero">
                {cta}
              </AffiliateButton>
            </div>
          </header>
        </Reveal>

        {/* Hinnat */}
        <Reveal className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">Hinnat</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-ink/60">
                {plan.type === "spot" ? "Marginaali" : "Energian hinta"}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">
                {plan.type === "spot"
                  ? `${plan.spotMargin?.toLocaleString("fi-FI")} c/kWh`
                  : `${plan.energyPrice?.toLocaleString("fi-FI")} c/kWh`}
              </p>
              {plan.type === "spot" && (
                <p className="mt-1 text-[12px] text-ink/60">+ pörssin tuntihinta</p>
              )}
            </div>
            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="text-[12px] uppercase tracking-wide text-ink/60">Perusmaksu</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">
                {plan.basicFee.toLocaleString("fi-FI")} €/kk
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
            <table className="w-full text-left">
              <caption className="sr-only">Arvioitu vuosikustannus eri kulutuksilla</caption>
              <thead>
                <tr className="border-b border-line bg-mist/60 text-[12px] uppercase tracking-wide text-ink/60">
                  <th className="px-5 py-3 font-semibold">Vuosikulutus</th>
                  <th className="px-5 py-3 text-right font-semibold">Arvio / vuosi</th>
                  <th className="px-5 py-3 text-right font-semibold">Arvio / kk</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_KWH.map((k) => (
                  <tr key={k} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-[14px] text-ink/80">{k.toLocaleString("fi-FI")} kWh</td>
                    <td className="px-5 py-3 text-right font-data text-[14px] font-semibold text-ink">
                      {annualCost(plan, k).toLocaleString("fi-FI", { maximumFractionDigits: 0 })} €
                    </td>
                    <td className="px-5 py-3 text-right font-data text-[14px] text-ink/80">
                      {(annualCost(plan, k) / 12).toLocaleString("fi-FI", { maximumFractionDigits: 0 })} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plan.type === "spot" && (
            <p className="mt-2 text-[12px] text-ink/60">
              Arviot laskettu {ASSUMED_SPOT_AVG.toLocaleString("fi-FI")} c/kWh pörssikeskihinnalla. Toteutunut hinta vaihtelee.
            </p>
          )}

          {/*
            KAMPANJA AUKI OMANA LAATIKKONAAN — MYÖS SEN JÄLKEINEN HINTA.

            Taulukon luvut ovat ENSIMMÄISEN vuoden kustannus kampanja
            mukaan luettuna. Jos sivu näyttäisi vain sen, sopimus näyttäisi
            pysyvästi halvemmalta kuin se on, ja ero paljastuisi vasta
            laskusta. Sopimussivu on se paikka, jossa lukija tekee lopullisen
            päätöksen — täällä ehdon lukeminen on halvempaa kuin peruutus
            myöhemmin, ja peruutuksesta ei makseta palkkiota.
          */}
          {plan.campaign && (
            <div className="mt-4 rounded-2xl border border-accent/25 bg-accentSoft p-5">
              <p className="flex items-center gap-2 font-display text-sm font-semibold text-accentDark">
                <Tag size={14} aria-hidden /> Kampanja: {plan.campaign.label}
              </p>
              <ul className="mt-3 space-y-1.5 text-[14px] text-ink/85">
                <li>
                  Kampanjahinta on voimassa {plan.campaign.months} kuukautta sopimuksen alusta.
                </li>
                <li>
                  Kampanjan aikana perusmaksu{" "}
                  {(plan.campaign.basicFee ?? plan.basicFee).toLocaleString("fi-FI")} €/kk
                  {plan.type === "spot"
                    ? ` ja marginaali ${(plan.campaign.spotMargin ?? plan.spotMargin ?? 0).toLocaleString("fi-FI")} c/kWh`
                    : ` ja energia ${(plan.campaign.energyPrice ?? plan.energyPrice ?? 0).toLocaleString("fi-FI")} c/kWh`}
                  .
                </li>
                <li>
                  Kampanjan jälkeen perusmaksu {plan.basicFee.toLocaleString("fi-FI")} €/kk
                  {plan.type === "spot"
                    ? ` ja marginaali ${(plan.spotMargin ?? 0).toLocaleString("fi-FI")} c/kWh`
                    : ` ja energia ${(plan.energyPrice ?? 0).toLocaleString("fi-FI")} c/kWh`}
                  {" "}— eli 5 000 kWh kulutuksella noin{" "}
                  {(normalAnnualCost(plan, 5000) / 12).toLocaleString("fi-FI", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  €/kk.
                </li>
                {plan.campaign.limit && <li>Rajoitus: {plan.campaign.limit}.</li>}
              </ul>
            </div>
          )}

          {/* Tarkistuspäivä ja lähde. Hinta on ainoa luku, jonka lukija voi
              tarkistaa sekunnissa — kun kerromme itse, mistä ja milloin se on
              haettu, tarkistus vahvistaa sivun sen sijaan että kumoaisi sen. */}
          {plan.checkedAt && (
            <p className="mt-3 text-[12px] text-ink/60">
              Hinnat tarkistettu {new Date(plan.checkedAt).toLocaleDateString("fi-FI")}{" "}
              {plan.sourceUrl ? (
                <>
                  ·{" "}
                  <a
                    href={plan.sourceUrl}
                    rel="nofollow noopener"
                    target="_blank"
                    className="underline underline-offset-2 hover:text-ink"
                  >
                    {plan.provider}in hinnasto
                  </a>
                </>
              ) : null}
            </p>
          )}
        </Reveal>

        {/* Hyödyt ja haitat */}
        <Reveal className="mt-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl bg-mist p-5">
              <p className="font-display text-sm font-semibold text-ink">Vahvuudet</p>
              <ul className="mt-3 space-y-2.5">
                {plan.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[14px] text-ink/85">
                    <Check size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-ink/35" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-mist p-5">
              <p className="font-display text-sm font-semibold text-ink">Huomioitavaa</p>
              <ul className="mt-3 space-y-2.5">
                {plan.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-[14px] text-ink/85">
                    <X size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-ink/50" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <div className="rounded-2xl bg-peach p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Kenelle sopimus sopii?</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{plan.bestFor}</p>
          </div>
        </Reveal>

        {plan.faq.length > 0 && (
          <Reveal className="mt-10">
            <h2 className="font-display text-xl font-semibold text-ink">Usein kysyttyä</h2>
            <div className="mt-4">
              <Faq items={plan.faq.map(([q, a]) => ({ q, a }))} />
            </div>
          </Reveal>
        )}

        <Reveal className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-6">
            <div>
              <p className="font-display text-lg font-semibold text-ink">Valmis vaihtamaan?</p>
              <p className="mt-1 text-[14px] text-ink/70">
                Tilaus vie noin 5 minuuttia — uusi yhtiö hoitaa loput, eikä sähkö katkea.
              </p>
            </div>
            <AffiliateButton href={plan.affiliateUrl} cardId={plan.id} placement="plan-footer">
              {cta}
            </AffiliateButton>
          </div>
          <p className="mt-3 text-center text-[12px] text-ink/60">
            <Link href="/sahkosopimukset#vertailu" className="underline underline-offset-4 hover:text-ink">
              ← Takaisin vertailuun
            </Link>
          </p>
        </Reveal>
      </div>

      {/* Mobiilin kiinteä CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div>
          <p className="text-[11px] uppercase tracking-wide text-ink/60">Perusmaksu</p>
          <p className="font-display text-lg font-bold text-ink">{plan.basicFee.toLocaleString("fi-FI")} €/kk</p>
        </div>
        <AffiliateButton href={plan.affiliateUrl} cardId={plan.id} placement="plan-sticky">
          {cta}
        </AffiliateButton>
      </div>
    </article>
  );
}
