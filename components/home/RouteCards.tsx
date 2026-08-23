import Link from "next/link";
import { ArrowRight, Zap, HandCoins } from "lucide-react";
import Reveal from "@/components/Reveal";
import FoxPaw from "@/components/FoxPaw";
import { FEATURES } from "@/lib/features";
import { ENERGY_COMPARE } from "@/lib/nav";
import type { HomeFacts } from "@/lib/home";

/*
  REITTIKORTIT — HUBIN AINOA VARSINAINEN TEHTÄVÄ.

  MIKSI KORTIT LIMITTYVÄT VYÖN RAJAN YLI. Aiemmin osiot olivat pinossa:
  oranssi vyö loppui, vaalea alkoi, ja korttirivi alkoi vasta sen jälkeen.
  Pino näyttää siltä, että osiot on tehty eri aikaan. Kun kortit nousevat
  oranssin päälle, raja ei ole enää sauma vaan taso: kortti on selvästi
  vyön päällä, vyö sen takana. Se on koko sivun ainoa rakenteellinen ele,
  ja se maksaa yhden negatiivisen marginaalin.

  MIKSI KORTIT EIVÄT OLE SAMANKOKOISIA. Kaksi identtistä ruutua on
  valinta, ja valinta hidastaa. Ansainta on tällä hetkellä sähkössä:
  siellä on 24 tarkistettua sopimusta ja oma vertailu, lainoissa on
  ohjaus kumppanille. Kortit kertovat sen suhteen kokonsa kautta ennen
  kuin kumpaakaan on luettu.

  MIKSI LUVUT OVAT 24 JA 1. Ne ovat sama asia kahdesta suunnasta: sähkössä
  vertaillaan montaa sopimusta, lainoissa täytetään yksi hakemus. Kaksi
  isoa numeroa vierekkäin lukee yhdessä sekunnissa, kaksi kappaletta
  tekstiä ei lue ollenkaan.

  KORTIT OVAT `theme-light`-KÄÄRITTYJÄ. Ilman sitä `bg-white` ratkeaisi
  oranssiksi siltä osalta, joka on vyön päällä — ks. DESIGN.md, ember-ansa.
*/

export default function RouteCards({ facts }: { facts: HomeFacts }) {
  return (
    <section className="theme-light relative z-20 -mt-28 px-5 sm:px-8 md:-mt-32 lg:px-10">
      <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-5 md:gap-5">
        {/* SÄHKÖ — ensisijainen reitti, kolme viidesosaa leveydestä. */}
        <Reveal className="md:col-span-3">
          <Link
            href={ENERGY_COMPARE}
            className="lift group flex h-full flex-col rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8"
          >
            <div className="flex items-center gap-2.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-accentDark">
              <Zap size={15} strokeWidth={2.4} aria-hidden />
              Sähkösopimukset
            </div>

            <div className="mt-6 flex items-end gap-4">
              <span className="font-hero text-[clamp(3.4rem,15vw,5.5rem)] leading-[0.8] text-accentDark">
                {facts.planCount}
              </span>
              <span className="mb-1.5 max-w-[13ch] text-[14px] leading-tight text-ink/60">
                tarkistettua sopimusta {facts.providerCount} yhtiöltä
              </span>
            </div>

            <h2 className="mt-7 font-hero text-[clamp(1.6rem,5.5vw,2.3rem)] leading-[1.02]">
              Paljonko sähkösi maksaa sinulle?
            </h2>
            <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-ink/70">
              Kerro asumismuoto, niin Kettu laskee jokaisen sopimuksen
              vuosihinnan euroina. Ei sentteinä kilowattitunnilta, vaan
              summana, jonka voi verrata omaan laskuun.
            </p>

            <span className="mt-8 inline-flex items-center gap-2 self-start rounded-xl bg-accent px-5 py-3.5 font-display text-[15px] font-bold text-onEmber shadow-ember">
              Kilpailuta sähkö
              <ArrowRight
                size={17}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </Reveal>

        {/* LAINAT — toissijainen reitti, kaksi viidesosaa. */}
        {FEATURES.loans && (
          <Reveal delay={0.06} className="md:col-span-2">
            <Link
              href="/lainat"
              className="lift group flex h-full flex-col rounded-3xl border border-line bg-mist p-6 shadow-card sm:p-8"
            >
              <div className="flex items-center gap-2.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-goldInk">
                <HandCoins size={15} strokeWidth={2.4} aria-hidden />
                Lainat
              </div>

              <div className="mt-6 flex items-end gap-4">
                <span className="font-hero text-[clamp(3.4rem,15vw,5.5rem)] leading-[0.8] text-goldInk">
                  1
                </span>
                <span className="mb-1.5 max-w-[13ch] text-[14px] leading-tight text-ink/60">
                  hakemus, monta pankkia
                </span>
              </div>

              <h2 className="mt-7 font-hero text-[clamp(1.6rem,5.5vw,2.1rem)] leading-[1.02]">
                Yksi hakemus riittää.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                Kettu ohjaa Sortterin lainavertailuun. Emme myönnä lainaa
                itse emmekä pyydä sinulta mitään tietoja.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 self-start font-display text-[15px] font-bold text-accentDark">
                Katso lainavertailu
                <ArrowRight
                  size={17}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Reveal>
        )}
      </div>

      {/*
        TULOSSA-RIVI. Kaksi vertikaalia näyttää kapealta, ja kapea valikoima
        lukee keskeneräiseltä. Tämä rivi kertoo suunnan käyttämättä
        pystytilaa kokonaiseen osioon — eikä lupaa päivämäärää, jota ei ole.
      */}
      <p className="mx-auto mt-6 flex max-w-[1180px] items-center gap-2.5 text-[13px] text-ink/50">
        <FoxPaw size={12} className="shrink-0 text-gold" />
        Tulossa: vakuutukset ja laajakaista.
      </p>
    </section>
  );
}
