import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CreditCard, Globe, Landmark, ShieldCheck, Zap, BadgeCheck, Scale, Lock } from "lucide-react";
import Reveal from "@/components/Reveal";
import BrushRule from "@/components/BrushRule";
import SectionHead from "@/components/SectionHead";
import HeroKettu from "@/components/mascot/HeroKettu";
import Kettu from "@/components/mascot/Kettu";
import GuideBoxes from "@/components/GuideBoxes";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kettukilpailutus – kilpailuta sähkö, kortit ja sopimukset",
  description:
    "Kettu kilpailuttaa puolestasi: sähkösopimukset, luottokortit ja pian myös lainat, vakuutukset ja nettiliittymät. Puolueeton vertailu suomalaisille — ilmaiseksi.",
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
    live: true,
  },
  { href: "#", icon: Landmark, title: "Lainat", desc: "Kilpailuta lainat ja säästä koroissa.", highlight: null, live: false },
  { href: "#", icon: ShieldCheck, title: "Vakuutukset", desc: "Koti, auto ja matka — vertaa hinnat.", highlight: null, live: false },
  { href: "#", icon: Globe, title: "Nettiliittymät", desc: "Nopein netti kotiisi oikeaan hintaan.", highlight: null, live: false },
] as const;

export default function HubPage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kettukilpailutus",
    url: SITE.url,
    logo: `${SITE.url}/icon.svg`,
    description: "Suomalainen kilpailutuspalvelu: sähkö, luottokortit ja muut sopimukset.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      {/*
        HERO — vaalea, kuten sähkösivu.
        Aiemmin hubi oli tumma ja sähkösivu vaalea. Käyttäjä, joka klikkaa
        hubista sähköön, näki kaksi eri sivustoa peräkkäin; se syö juuri sitä
        luottamusta, jonka varassa "Tee sopimus" -klikki on. Yhtenäinen vaalea
        maailma + tumma footer ankkurina on rauhallisempi, ja vaalealla
        oranssi nappi on ruudun ainoa kuuma piste.
      */}
      <section className="theme-light dawn-surface relative overflow-hidden">
        <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-6 px-4 pb-20 pt-14 sm:px-6 md:grid-cols-[1.08fr_0.92fr] md:pb-24 md:pt-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-accentDark">
                Ketuttaako maksaa liikaa?
              </span>
              <BrushRule className="text-accent/70" width={64} />
            </div>
            {/* Antiikva ja normaalipaino: kun otsikko ei ole lihava, sivun
                painavin elementti on oranssi nappi. */}
            <h1 className="mt-4 font-hero text-[2.6rem] leading-[1.04] text-ink sm:text-[3.5rem]">
              Yksi kettu.<br />Kaikki <em className="text-accentDark">kilpailutukset</em>.
            </h1>
            {/*
              Mobiilissa Kettu on ingressin vieressä, ei omana ruudullisenaan.
              Maskotti on brändin ydin, joten se ei saa kadota puhelimessa —
              mutta se ei myöskään saa työntää "Kilpailuta sähkö" -nappia
              taitteen alle. Sama kuvio kuin sähkö- ja korttisivulla.
            */}
            <div className="mt-5 flex items-start gap-3">
              <p className="max-w-md flex-1 text-[16px] leading-relaxed text-ink/70">
                Anna Ketun kilpailuttaa puolestasi. Laskemme sopimustesi todelliset
                hinnat omilla luvuillasi — puolueettomasti, ilmaiseksi ja selvällä suomella.
              </p>
              <div className="dawn-glow relative -mb-6 -mt-4 shrink-0 md:hidden">
                <Kettu pose="kortti" height={150} priority />
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sahkosopimukset"
                className="group inline-flex items-center gap-2.5 btn-ember rounded-xl px-7 py-4 font-display text-[15.5px] font-bold text-onEmber transition-all active:scale-[0.98]"
              >
                <Zap size={18} aria-hidden /> Kilpailuta sähkö
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <Link
                href="/luottokortit"
                className="inline-flex items-center gap-2.5 rounded-xl border border-lineDark bg-white px-7 py-4 font-display text-[15.5px] font-bold text-ink shadow-card transition-all hover:border-ink/30 active:scale-[0.98]"
              >
                <CreditCard size={18} className="text-ink/45" aria-hidden /> Vertaa kortit
              </Link>
            </div>
          </div>
          <div className="dawn-glow relative mx-auto hidden md:block">
            <HeroKettu height={440} />
          </div>
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
                    className="group relative flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-card transition-all hover:-translate-y-1.5 hover:shadow-cardHover"
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
