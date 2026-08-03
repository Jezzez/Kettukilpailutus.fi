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
    <section aria-label="Miksi Kettu" className="pb-16 pt-6 md:pb-20">
      <Reveal>
        {/*
          Neljä lupausta oli aiemmin irrallaan taustan päällä ilman kehystä.
          Ne ovat sivun ensimmäinen luottamussignaali heti vertailun jälkeen,
          joten niiden pitää lukea yhtenä nauhana — ei neljänä sattumalta
          vierekkäin joutuneena rivinä. Kehys ja pystyviivat antavat silmälle
          selvän pysähdyspaikan ja erottavat lupaukset toisistaan.
        */}
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <div className="grid gap-px bg-line sm:grid-cols-2 md:grid-cols-4">
              {ITEMS.map((i) => (
                <div key={i.title} className="flex h-full gap-3 bg-white p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/15 bg-accentSoft">
                    <i.icon size={18} className="text-accentDark" strokeWidth={1.9} aria-hidden />
                  </span>
                  <div>
                    <p className="font-display text-[15px] font-semibold text-ink">{i.title}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-ink/70">{i.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
