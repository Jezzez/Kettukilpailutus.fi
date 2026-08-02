import { Gift, Scale, RefreshCw, Zap } from "lucide-react";
import Reveal from "./Reveal";

const ITEMS = [
  { icon: Gift, title: "100 % ilmainen", text: "Palvelu ei maksa sinulle mitään." },
  { icon: Scale, title: "Puolueeton vertailu", text: "Emme myy kortteja – vertailumme on riippumatonta." },
  { icon: RefreshCw, title: "Avoin laskenta", text: "Kerromme jokaisen luvun oletukset — ei pikkupränttiä." },
  { icon: Zap, title: "Nopea ja helppo", text: "Vertailu vie vain muutaman minuutin." },
];

export default function TrustBar() {
  return (
    <section aria-label="Miksi Kettu" className="pb-16 pt-4 md:pb-20">
      <Reveal>
        <div className="mx-auto grid max-w-[1180px] gap-7 px-4 sm:px-6 md:grid-cols-4">
          {ITEMS.map((i) => (
            <div key={i.title} className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accentSoft">
                <i.icon size={18} className="text-accent" strokeWidth={1.9} aria-hidden />
              </span>
              <div>
                <p className="font-display text-[15px] font-semibold text-ink">{i.title}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-ink/72">{i.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
