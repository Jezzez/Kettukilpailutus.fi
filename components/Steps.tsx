import { ClipboardList, MousePointerClick, Send } from "lucide-react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import Kettu from "./mascot/Kettu";

const STEPS = [
  { n: "1", icon: ClipboardList, title: "Kerro Ketulle tarpeesi", text: "Vastaa kolmeen nopeaan kysymykseen korttien käytöstäsi." },
  { n: "2", icon: MousePointerClick, title: "Vertaile kortit", text: "Näet sinulle sopivimmat kortit järjestyksessä – selkeästi ja puolueettomasti." },
  { n: "3", icon: Send, title: "Hae verkossa", text: "Hakemus täytetään pankin sivuilla ja vie tyypillisesti alle 10 minuuttia." },
];

export default function Steps() {
  return (
    <section aria-label="Näin se toimii" className="border-y border-line bg-white py-16 md:py-24">
      <Reveal>
        <div className="mx-auto mb-10 flex max-w-[1180px] flex-col items-center gap-5 px-4 sm:px-6">
          <Kettu pose="osoittaa" height={190} />
          <SectionHead
            align="center"
            eyebrow="Näin se toimii"
            title="Näin Kettu auttaa sinua"
            lead="Kolme askelta hakemukseen. Kettu tekee vertailun, sinä teet päätöksen."
          />
        </div>
      </Reveal>

      {/*
        Askeleet olivat kolme irrallista pylvästä ilman reunoja: valkoisella
        pinnalla ne kelluivat eikä silmä hahmottanut, mihin yksi askel loppuu
        ja seuraava alkaa. Yhteinen kehys ja pystyviivat tekevät niistä yhden
        luettavan polun — sama ele kuin sähkösivun "Kolme askelta" -laatikossa,
        jolloin sivusto näyttää suunnitellulta eikä kootulta.
      */}
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
          <div className="grid gap-px bg-line md:grid-cols-3">
            {STEPS.map((s, i) => (
              /*
                JÄTTINUMERO ON SILMÄN ANKKURI, EI KORISTE.

                Askeleen numero oli aiemmin otsikon sisällä ("1. Kerro
                Ketulle…"). Siinä muodossa se on tekstiä muun tekstin
                seassa: silmä ei näe kolmea askelta, se näkee kolme
                kappaletta. Kun numero on 88 pikselin haamunumero solun
                taustalla, kolmiosaisuus näkyy jo silmäkulmassa selatessa,
                eikä kävijän tarvitse lukea riviäkään ymmärtääkseen että
                prosessi on lyhyt.

                MIKSI TÄMÄ VAIKUTTAA TUOTTOON: "onko tämä työlästä" on
                se epäilys, joka pysäyttää kilpailutuksen. Näkyvä
                kolmiportaisuus vastaa siihen ennen kuin se ehtii syntyä.
                Laite on lainattu kilpailuttaja.fi:ltä, jossa sama
                numerointi kantaa koko etusivun rakenteen.

                `aria-hidden`: numero on jo otsikon järjestyksessä, joten
                ruudunlukija ei saa lukea sitä toiseen kertaan.
              */
              <div key={s.title} className="relative h-full overflow-hidden bg-white p-7 text-center sm:p-8">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-3 right-3 select-none font-hero text-[88px] leading-none text-accent/[0.13]"
                >
                  {s.n}
                </span>
                <Reveal delay={i * 0.08}>
                  <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-accent/20 bg-accentSoft">
                    <s.icon size={28} className="text-accentDark" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="relative mt-5 font-display text-[22px] font-semibold text-ink">{s.title}</h3>
                  <p className="relative mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-ink/75">{s.text}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
