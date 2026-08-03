import { BadgeCheck, Calculator, Coins, PawPrint, Scale } from "lucide-react";
import Reveal from "../Reveal";
import BrushRule from "../BrushRule";
import { ASSUMED_SPOT_AVG, IS_EXAMPLE_DATA, PRICE_DATE, getPlans } from "@/lib/energy";

/**
 * Läpinäkyvyysosio.
 *
 * Vertailusivujen suurin luottamusongelma on epäilys: "kuka tämän maksaa ja
 * onko järjestys ostettu?" Siihen ei vastata luottamuslogoilla vaan
 * kertomalla laskukaava ja rahavirta suoraan. Siksi kaava on tässä auki.
 */
const POINTS = [
  {
    icon: Calculator,
    title: "Näin laskemme",
    text: "Vuosihinta = perusmaksu × 12 + energian hinta × kulutuksesi. Pörssisopimuksissa energian hintana on marginaali plus pörssin keskihinta.",
  },
  {
    icon: Scale,
    title: "Järjestys ei ole myynnissä",
    text: "Sopimukset järjestyvät laskennan mukaan. Kumppanuus ei nosta ketään ylöspäin, eikä kumppanuuden puute pudota alaspäin.",
  },
  {
    icon: PawPrint,
    title: "Mikä on Ketun valinta",
    text: "Merkki nostaa esiin sopimuksen, jolla on paras hinnan ja käyttäjäarvion yhdistelmä: hinta painaa 72 % ja arvio 28 %. Halvin vaihtoehto on aina merkitty erikseen.",
  },
  {
    icon: Coins,
    title: "Näin ansaitsemme",
    text: "Saamme palkkion palveluntarjoajalta, jos teet sopimuksen linkkimme kautta. Sinulle vertailu on ilmainen eikä hinta muutu.",
  },
  {
    icon: BadgeCheck,
    title: "Mitä hinta ei sisällä",
    text: "Arviot kattavat sähkön myynnin. Siirtomaksu tulee paikalliselta verkkoyhtiöltä, sitä ei voi kilpailuttaa, ja se on sama sopimuksesta riippumatta.",
  },
];

export default function EnergyTrust() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        {/*
          Paneeli oli aiemmin tumma. Vaalean sivun keskellä musta laatikko
          leikkasi sivun kahtia juuri siinä kohdassa, jonka tehtävä on
          rauhoittaa lukija ennen "Tee sopimus" -klikkiä. Nyt sama osio on
          lämmin kettupinta: erottuu rytmillisesti, mutta pysyy samassa
          maailmassa ja teksti on tummaa eli maksimikontrastilla luettavaa.
        */}
        <div className="pelt-surface rounded-[2rem] border border-gold/25 px-6 py-14 sm:px-12 md:py-16">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-goldInk">
                Avoin laskenta
              </span>
              <BrushRule className="text-gold" width={64} />
            </div>
            <h2 className="mt-4 max-w-xl font-hero text-[2.2rem] leading-[1.08] text-ink sm:text-[2.7rem]">
              Kettu näyttää laskukaavan, ei vain lopputulosta.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {POINTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.07}>
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accentSoft text-accentDark">
                    <p.icon size={19} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-[16.5px] font-bold text-ink">{p.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink/70">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/12 pt-6 text-[13px] text-ink/65">
              <span>
                Hinnat tarkistettu{" "}
                <span className="font-data font-bold text-ink/85">
                  {new Date(PRICE_DATE).toLocaleDateString("fi-FI")}
                </span>
              </span>
              <span>
                Pörssin laskentakeskiarvo{" "}
                <span className="font-data font-bold text-ink/85">
                  {ASSUMED_SPOT_AVG.toLocaleString("fi-FI")} c/kWh
                </span>
              </span>
              <span>
                Sopimuksia vertailussa{" "}
                <span className="font-data font-bold text-ink/85">{getPlans().length}</span>
              </span>
            </div>
            {IS_EXAMPLE_DATA && (
              <p className="mt-4 rounded-2xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-[13px] leading-relaxed text-ink/80">
                <span className="font-bold text-goldInk">Huom.</span> Vertailun hinnat ovat
                toistaiseksi esimerkkilukuja, eivät palveluntarjoajien tarkistettuja ehtoja.
                Tarkista aina lopullinen hinta sähköyhtiön omilta sivuilta ennen sopimuksen tekoa.
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
