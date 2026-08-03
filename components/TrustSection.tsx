import { BadgeCheck, Scale, RefreshCw, HandCoins } from "lucide-react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { CARDS_ARE_EXAMPLE_DATA } from "@/lib/data";

const POINTS = [
  {
    icon: Scale,
    title: "Näin kortit järjestetään",
    text: "Sopivuus-luku lasketaan avoimella kaavalla: 70 % painolla osuvuus sinun valintoihisi ja 30 % painolla käyttäjäarviot. Raha ei vaikuta järjestykseen.",
  },
  {
    icon: HandCoins,
    title: "Näin Kettu ansaitsee",
    text: "Voimme saada pankilta korvauksen, kun haet korttia linkkiemme kautta. Korvaus ei koskaan muuta vertailun sisältöä, lukuja tai järjestystä.",
  },
  {
    icon: RefreshCw,
    title: "Tarkista aina pankilta",
    text: "Korttien ehdot muuttuvat, ja lopullisen hinnan päättää aina pankki. Siksi kehotamme varmistamaan korko-, kulu- ja etutiedot pankin omilta sivuilta ennen hakemuksen lähettämistä.",
  },
  {
    icon: BadgeCheck,
    title: "Riippumaton vertailu",
    text: "Vertailussa on mukana kortteja myös pankeilta, jotka eivät maksa meille mitään. Sinun etusi on aina etusijalla.",
  },
];

/** Läpinäkyvyys rakentaa luottamuksen: kerromme avoimesti miten palvelu toimii. */
export default function TrustSection() {
  return (
    <section id="nain-toimimme" className="scroll-mt-20 border-y border-line bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHead
            align="center"
            eyebrow="Näin toimimme"
            title="Kettu on sinun puolellasi"
            lead="Läpinäkyvyys rakentaa luottamuksen — siksi kerromme avoimesti, miten vertailu toimii ja miten ansaitsemme."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              {/*
                Reunaviiva lisätty: laatikot olivat vain aavistuksen
                taustaa tummempaa harmaata, joten neljä väitettä sulautui
                yhdeksi harmaaksi alueeksi. Juuri nämä neljä ovat sivun
                luottamuslupaukset — jos ne eivät erotu erillisiksi
                väitteiksi, niitä ei lueta, ja lukematta jäänyt lupaus ei
                tuota klikkiä.
              */}
              <div className="flex h-full gap-4 rounded-2xl border border-line bg-mist p-6 transition-colors hover:border-lineDark">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/20 bg-accentSoft">
                  <p.icon size={22} className="text-accentDark" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink/80">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {CARDS_ARE_EXAMPLE_DATA && (
          <Reveal delay={0.24}>
            <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gold/30 bg-gold/[0.07] px-5 py-4 text-[13.5px] leading-relaxed text-ink/80">
              <span className="font-bold text-goldInk">Huom.</span> Vertailun korko-, kulu- ja
              etutiedot ovat toistaiseksi esimerkkilukuja, eivät pankkien tarkistettuja ehtoja.
              Tarkista lopulliset tiedot pankin omilta sivuilta ennen hakemuksen lähettämistä.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
