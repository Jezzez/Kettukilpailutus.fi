import { ClipboardList, MousePointerClick, Send } from "lucide-react";
import Reveal from "./Reveal";
import Kettu from "./mascot/Kettu";

const STEPS = [
  { icon: ClipboardList, title: "1. Kerro Ketulle tarpeesi", text: "Vastaa kolmeen nopeaan kysymykseen korttien käytöstäsi." },
  { icon: MousePointerClick, title: "2. Vertaile kortit", text: "Näet sinulle sopivimmat kortit järjestyksessä – selkeästi ja puolueettomasti." },
  { icon: Send, title: "3. Hae verkossa", text: "Hakemus täytetään pankin sivuilla ja vie tyypillisesti alle 10 minuuttia." },
];

export default function Steps() {
  return (
    <section aria-label="Näin se toimii" className="bg-white py-16 md:py-24">
      <Reveal>
        <div className="mx-auto mb-10 flex max-w-[1180px] flex-col items-center gap-5 px-4 text-center sm:px-6">
          <Kettu pose="osoittaa" height={190} />
          <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Näin Kettu auttaa sinua
          </h2>
        </div>
      </Reveal>
      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 text-center sm:px-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-accent/20 bg-accentSoft">
              <s.icon size={28} className="text-cream" strokeWidth={1.75} aria-hidden />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{s.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-ink/76">{s.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
