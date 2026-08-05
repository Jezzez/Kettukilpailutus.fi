import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CreditCard, Globe, Landmark, ShieldCheck, Zap, BadgeCheck, Scale, Lock } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import HeroKettu from "@/components/mascot/HeroKettu";
import Kettu from "@/components/mascot/Kettu";
import TailSweep from "@/components/fox/TailSweep";
import GuideBoxes from "@/components/GuideBoxes";
import { SITE } from "@/lib/data";
import { FEATURES } from "@/lib/features";

export const metadata: Metadata = {
  title: "Kettukilpailutus.fi – kilpailuta sähkösopimukset ilmaiseksi",
  description:
    "Kettu kilpailuttaa puolestasi: sähkösopimukset nyt, pian myös luottokortit, lainat, vakuutukset ja nettiliittymät. Puolueeton vertailu suomalaisille — ilmaiseksi.",
  alternates: { canonical: "/" },
};

/** Kategoriat: kaksi aktiivista, kolme tulossa — tulossa-kortit rakentavat alustan mielikuvaa. */
const CATEGORIES = [
  {
    href: "/sahkosopimukset",
    icon: Zap,
    title: "Sähkösopimukset",
    desc: "Vertaa pörssi- ja kiinteähintaiset sopimukset omalla kulutuksellasi.",
    highlight: "Suosituin",
    live: true,
  },
  {
    href: "/luottokortit",
    icon: CreditCard,
    title: "Luottokortit",
    desc: "Löydä etuihisi ja arkeesi sopivin kortti kolmella kysymyksellä.",
    highlight: null,
    /* Korttiruutu ei katoa vaan siirtyy "Tulossa pian" -tilaan muiden
       avaamattomien vertikaalien joukkoon. Tyhjä paikka ruudukossa
       näyttäisi siltä, että jotain hajosi; tulossa-tila kertoo saman
       asian tavalla joka rakentaa alustan mielikuvaa eikä pura sitä. */
    live: FEATURES.cards,
  },
  { href: "#", icon: Landmark, title: "Lainat", desc: "Kilpailuta lainat ja säästä koroissa.", highlight: null, live: false },
  { href: "#", icon: ShieldCheck, title: "Vakuutukset", desc: "Koti, auto ja matka — vertaa hinnat.", highlight: null, live: false },
  { href: "#", icon: Globe, title: "Nettiliittymät", desc: "Nopein netti kotiisi oikeaan hintaan.", highlight: null, live: false },
] as const;

export default function HubPage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon.svg`,
    description: "Suomalainen kilpailutuspalvelu: sähkösopimukset ja muut arjen sopimukset puolueettomasti vertailtuna.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      {/*
        HERO ON TÄYSLEVEÄ ORANSSI VYÖ — SAMA KUIN SÄHKÖ- JA KORTTISIVULLA.

        MIKSI MUUTETTIIN: hero oli vaalea hiekkapinta vaalealla sivulla.
        Se ei antanut silmälle mitään mihin tarttua, ja etusivun tehtävä
        on nimenomaan ottaa kiinni ensimmäisessä sekunnissa — hubissa ei
        ole työkalua, vain kaksi nappia, joten koko sivun tuotto riippuu
        siitä, osuuko katse niihin.

        MIKSI TÄMÄ NOSTAA TUOTTOA: kun vyö on oranssi ja napit kermaa,
        napit ovat ruudun ainoat vaaleat pisteet. Silmä hakeutuu suurimman
        valoarvoeron kohtaan ennen kuin se ehtii lukea otsikkoa. Sama vyö
        kaikilla kolmella sisääntulosivulla tekee myös sen, että hubista
        sähköön klikkaava tunnistaa jatkavansa saman talon sisällä — juuri
        ne ristiinklikkaukset kasvattavat toista vertikaalia ilman uutta
        kävijähankintaa.
      */}
      <section className="theme-ember ember-surface relative overflow-hidden">
        <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-6 px-4 pb-20 pt-14 sm:px-6 md:grid-cols-[1.08fr_0.92fr] md:pb-24 md:pt-20">
          <div>
            <div className="flex items-center gap-3">
              {/* `accentDark` kääntyy ember-vyöllä vaaleaksi kermaksi ja
                  katoaisi; `goldInk` on teeman luettava kulta. */}
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                Ketuttaako maksaa liikaa?
              </span>
            </div>
            {/* Antiikva ja normaalipaino: kun otsikko ei ole lihava, sivun
                painavin elementti on kermanvalkoinen nappi. */}
            <h1 className="mt-4 font-hero text-[2.6rem] leading-[1.04] text-cream sm:text-[3.5rem]">
              Yksi kettu.<br />Kaikki <em className="text-goldInk">kilpailutukset</em>.
            </h1>
            {/*
              Mobiilissa Kettu on ingressin vieressä, ei omana ruudullisenaan.
              Maskotti on brändin ydin, joten se ei saa kadota puhelimessa —
              mutta se ei myöskään saa työntää "Kilpailuta sähkö" -nappia
              taitteen alle. Sama kuvio kuin sähkö- ja korttisivulla.
            */}
            <div className="mt-5 flex items-start gap-3">
              <p className="max-w-md flex-1 text-[16px] leading-relaxed text-ink/85">
                Anna Ketun kilpailuttaa puolestasi. Laskemme sopimustesi todelliset
                hinnat omilla luvuillasi — puolueettomasti, ilmaiseksi ja selvällä suomella.
              </p>
              {/* Kermanvalkoinen hehku, ei aamunkajo: oranssilla pohjalla
                  vain vaaleampi hehku irrottaa hahmon taustasta. */}
              <div className="halo-glow relative -mb-6 -mt-4 shrink-0 md:hidden">
                {/* Sama syy kuin HeroKetussa: ei korttia kädessä
                    niin kauan kuin korttivertailu on piilossa. */}
                <Kettu pose="osoittaa" height={150} priority />
              </div>
            </div>
            {/*
              KAKSI NAPPIA, KAKSI ERI PAINOA.

              Sähkö on päävertikaali ja saa täytetyn kermanapin; kortit
              saavat ääriviivanapin. Jos molemmat olisivat yhtä painavia,
              kävijä joutuisi tekemään valinnan itse, ja valinta hidastaa
              — hub menettää klikkejä juuri epäröintiin. Nyt sivu ehdottaa
              yhtä polkua ja jättää toisen näkyviin niille, jotka tulivat
              korttien takia.

              Tekstin väri on kiinteä `#A83E0A`: `accentDark` kääntyisi
              ember-teemassa kermaksi ja katoaisi kermanapin sisään.
            */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sahkosopimukset"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-cream px-7 py-4 font-display text-[15.5px] font-bold text-[#A83E0A] shadow-lift transition-all hover:bg-[#FFFFFF] active:scale-[0.98]"
              >
                <Zap size={18} aria-hidden /> Kilpailuta sähkö
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              {FEATURES.cards && (
                <Link
                  href="/luottokortit"
                  className="inline-flex items-center gap-2.5 rounded-xl border border-cream/45 px-7 py-4 font-display text-[15.5px] font-bold text-cream transition-all hover:border-cream hover:bg-cream/10 active:scale-[0.98]"
                >
                  <CreditCard size={18} className="text-cream/70" aria-hidden /> Vertaa kortit
                </Link>
              )}
            </div>
          </div>
          <div className="halo-glow relative mx-auto hidden md:block">
            <HeroKettu height={440} />
          </div>
        </div>

        {/* Vyö päättyy ketunhännän kaareen. `theme-light` pakottaa
            `--c-paper`-muuttujan ratkeamaan alapuolisen vyöhykkeen
            vaaleaksi eikä tämän osion oranssiksi. */}
        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={64} />
        </div>
      </section>

      {/* KATEGORIAT */}
      <section className="relative z-10 -mt-8 pb-16">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                {c.live ? (
                  <Link
                    href={c.href}
                    /* Nosto tulee yhteisestä `.lift`-säännöstä, ei kortin
                       omasta ajoituksesta. Kun jokainen kortti sivustolla
                       liikkuu samalla nopeudella, sivu tuntuu tehdyltä
                       yhdellä kädellä — se on se "smooth", jota haettiin. */
                    className="lift group relative flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-card hover:border-accent/35"
                  >
                    {c.highlight && (
                      <span className="absolute right-4 top-4 rounded-full bg-accentSoft px-2.5 py-1 text-[11px] font-bold text-accentDark">
                        {c.highlight}
                      </span>
                    )}
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-accent/25 bg-accentSoft text-accentDark transition-transform group-hover:scale-110">
                      <c.icon size={22} aria-hidden />
                    </span>
                    <h2 className="mt-4 font-display text-xl font-semibold text-ink">{c.title}</h2>
                    <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-ink/70">{c.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-display text-[14px] font-semibold text-accentDark">
                      Aloita vertailu
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                ) : (
                  <div className="flex h-full flex-col rounded-3xl border border-dashed border-line bg-white/50 p-7" aria-disabled>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-mist text-ink/30">
                      <c.icon size={22} aria-hidden />
                    </span>
                    <h2 className="mt-4 font-display text-xl font-semibold text-ink/60">{c.title}</h2>
                    <p className="mt-1.5 flex-1 text-[14px] leading-relaxed text-ink/55">{c.desc}</p>
                    <span className="mt-4 inline-block w-fit rounded-full bg-mist px-3 py-1 text-[12px] font-semibold text-ink/60">
                      Tulossa pian
                    </span>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MIKSI KETTU */}
      <section className="border-y border-line bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <SectionHead
              align="center"
              eyebrow="Miksi Kettu"
              title="Kettu on sinun puolellasi"
              lead="Kolme sääntöä, joista emme jousta — ne ovat syy siihen, että lukuihin voi luottaa."
            />
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              { icon: Scale, title: "Puolueeton vertailu", text: "Järjestys perustuu aina hintaan ja sopivuuteen — ei siihen, kuka maksaa eniten." },
              { icon: BadgeCheck, title: "Avoin laskenta", text: "Kerromme jokaisen arvion oletukset. Ei tähtimerkintöjä, ei pikkupränttiä." },
              { icon: Lock, title: "Ilmainen sinulle", text: "Saamme palkkion palveluntarjoajalta, kun teet sopimuksen. Sinulle vertailu ei maksa mitään." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-line bg-mist p-6 text-center transition-colors hover:border-lineDark">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-line bg-white text-accentDark">
                    <f.icon size={22} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OPPAAT */}
      <GuideBoxes />
    </>
  );
}
