import { BadgeCheck, Scale, RefreshCw, HandCoins } from "lucide-react";
import Reveal from "./Reveal";

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
    title: "Ajantasaiset tiedot",
    text: "Korttien ehdot tarkistetaan säännöllisesti pankkien omista lähteistä. Näet aina, milloin vertailu on viimeksi päivitetty.",
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
    <section id="nain-toimimme" className="scroll-mt-20 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-semibold text-ink sm:text-4xl">
            Kettu on sinun puolellasi
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-ink/72">
            Läpinäkyvyys rakentaa luottamuksen — siksi kerromme avoimesti, miten vertailu toimii
            ja miten ansaitsemme.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="flex h-full gap-4 rounded-2xl bg-mist p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/20 bg-accentSoft">
                  <p.icon size={22} className="text-gold" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink/80">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
