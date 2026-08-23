import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionMark from "@/components/home/SectionMark";
import { ENERGY_COMPARE } from "@/lib/nav";
import { euro, fiDate, type HomeFacts } from "@/lib/home";
import { ASSUMED_SPOT_AVG, SPOT_AVG_BASIS } from "@/lib/energy";

/*
  HINTAERO — SIVUN KOVIN HETKI.

  MIKÄ ONGELMA TÄMÄ RATKAISEE: hubilla ei ole vertailua, joten sillä ei ole
  mitään näytettävää — ja osio, jolla ei ole näytettävää, päätyy
  kirjoittamaan yleisiä lauseita siitä että vertailu kannattaa. Sellaisen
  lauseen lukija ohittaa, koska hän on lukenut sen jokaiselta
  vertailusivulta.

  MITÄ TÄSSÄ TEHDÄÄN SEN SIJAAN: näytetään yksi luku, jota kilpailijoilla ei
  ole. Halvimman ja kalleimman sopimuksen ero ensimmäisenä vuonna on
  sähkölämmitteisessä talossa yli tuhat euroa. Se ei ole mielipide eikä
  markkinointia, vaan suora seuraus 24 tarkistetusta hinnasta, ja se
  lasketaan `lib/home.ts`:ssä samoilla funktioilla kuin vertailusivun
  hinnat.

  MIKSI HALVINTA SOPIMUSTA EI NIMETÄ TÄSSÄ. Se olisi vertailun vastaus, ja
  vastaus kuuluu vertailusivulle, jossa se on laskettu käyttäjän omalla
  kulutuksella ja jossa on nappi, joka tuottaa. Etusivun tehtävä on tehdä
  klikistä tarpeellinen, ei korvata sitä. Ero-luku tekee juuri sen: se
  kertoo että valinnalla on väliä, mutta ei sitä, mikä valinta on oikea.

  MIKSI LÄHDE ON NÄKYVISSÄ. Iso euromäärä ilman laskuperustetta on
  täsmälleen se, mitä epäilevä kävijä ei usko — ja epäilevä kävijä on
  vertailusivun koko yleisö. Oletusspot ja tarkistuspäivä ovat siksi
  saman lohkon sisällä, eivät alaviitteenä sivun pohjalla.
*/

export default function SpreadBlock({ facts }: { facts: HomeFacts }) {
  return (
    <section className="theme-light sand-surface relative overflow-hidden px-5 pb-28 pt-20 sm:px-8 md:pb-36 md:pt-28 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <SectionMark index="01" total="04">
            Miksi kilpailuttaa
          </SectionMark>

          <h2 className="mt-6 max-w-[16ch] font-hero text-[clamp(2.3rem,8vw,4.6rem)] leading-[0.96]">
            Sama sähkö. Eri lasku.
          </h2>
          <p className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-ink/70 sm:text-[18px]">
            Sähkö on samaa riippumatta siitä, keneltä sen ostat. Ainoa ero on
            hinta, ja se ero on isompi kuin useimmat arvaavat. Näin paljon
            vertailun halvin ja kallein sopimus eroavat ensimmäisenä vuonna:
          </p>
        </Reveal>

        {/*
          RIVIT, EI KORTTEJA. Kolme korttia vierekkäin pakottaisi silmän
          vertaamaan lukuja eri korkeuksilta. Allekkain ladottu rivistö,
          jossa palkit lähtevät samalta vasemmalta reunalta, on ainoa
          esitystapa, jossa suuruusero näkyy ilman että lukuja lukee.

          PALKIN PITUUS ON SUHDE SUURIMPAAN EROON, ei absoluuttinen euro.
          Suhde on laskettu `lib/home.ts`:ssä, jotta esitys ei voi eriytyä
          luvusta.
        */}
        <div className="mt-12 md:mt-16">
          {facts.spreads.map((row, i) => (
            <Reveal key={row.key} delay={i * 0.05}>
              <div className="border-t border-lineDark/50 py-6 last:border-b sm:py-7">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-display text-[16px] font-bold sm:text-[18px]">
                    {row.label}
                    <span className="ml-2 font-body text-[13px] font-medium text-ink/50">
                      {row.kwh.toLocaleString("fi-FI")} kWh/v
                    </span>
                  </p>
                  <p className="font-hero font-price text-[clamp(2rem,7vw,3rem)] leading-none text-accentDark">
                    {euro(row.spread)}
                  </p>
                </div>

                <div
                  className="mt-4 h-[7px] overflow-hidden rounded-full bg-white"
                  role="presentation"
                >
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.round(row.ratio * 100)}%` }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.06}>
          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-[52ch] text-[13px] leading-relaxed text-ink/55">
              Vertailun {facts.planCount} sopimusta, ensimmäisen vuoden
              kokonaishinta kampanjat mukaan luettuna. Pörssisopimuksissa
              spot-hintana on {ASSUMED_SPOT_AVG.toLocaleString("fi-FI")} c/kWh
              ({SPOT_AVG_BASIS}). Hinnat tarkistettu {fiDate(facts.priceDate)}.
              Oma erosi riippuu kulutuksestasi, ja sen näet vertailussa.
            </p>

            <Link
              href={ENERGY_COMPARE}
              className="btn-ember lift inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-4 font-display text-[16px] font-bold text-onEmber"
            >
              Laske oma hintasi
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
