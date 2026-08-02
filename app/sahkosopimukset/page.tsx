import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, MapPin, ShieldCheck, UserCheck } from "lucide-react";
import ElectricityExperience from "@/components/energy/ElectricityExperience";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import CtaSection from "@/components/CtaSection";
import EnergyTrust from "@/components/energy/EnergyTrust";
import { getPlans, getEnergyTopics } from "@/lib/energy";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kilpailuta sähkösopimus – vertaa hinnat omalla kulutuksellasi",
  description:
    "Vertaa sähkösopimukset omalla kulutuksellasi: pörssisähkö, kiinteät ja toistaiseksi voimassa olevat. Näet heti arvioidun vuosihinnan ja säästön. Ilmainen ja puolueeton.",
  alternates: { canonical: "/sahkosopimukset" },
  openGraph: {
    title: "Kilpailuta sähkösopimus – vertaa hinnat omalla kulutuksellasi",
    description:
      "Kerro kulutuksesi, niin Kettu laskee jokaisen sopimuksen todellisen vuosihinnan ja näyttää säästösi euroina.",
    url: "/sahkosopimukset",
  },
};

const ENERGY_FAQ: { q: string; a: string }[] = [
  { q: "Katkeaako sähkö, kun vaihdan sopimusta?", a: "Ei katkea. Sähkö tulee kotiisi samaa verkkoa pitkin kuin ennenkin — vain laskuttava myyjä vaihtuu. Vaihto tapahtuu taustalla ilman minkäänlaista katkoa." },
  { q: "Mitä sopimuksen vaihtaminen maksaa?", a: "Ei mitään. Vaihto on aina maksutonta, ja uusi sähköyhtiö hoitaa vanhan sopimuksen irtisanomisen puolestasi. Ainoa poikkeus: kesken olevan määräaikaisen sopimuksen purkamisesta voi tulla kuluja, joten tarkista oman sopimuksesi päättymispäivä." },
  { q: "Mitä eroa on pörssisähköllä ja kiinteällä hinnalla?", a: "Pörssisähkössä hinta seuraa sähköpörssin tuntihintaa — maksat sähköstä sen todellisen markkinahinnan plus yhtiön marginaalin. Kiinteässä sopimuksessa maksat saman c/kWh-hinnan joka tunti koko sopimuskauden. Pörssi on historiallisesti ollut keskimäärin edullisempi, kiinteä taas ennustettava." },
  { q: "Miksi laskussa on kaksi osaa: myynti ja siirto?", a: "Sähkön myyjän voit kilpailuttaa — sen vertailet täällä. Siirron hoitaa aina paikallinen verkkoyhtiö, jota ei voi vaihtaa, ja sen hinta on sama myyjästä riippumatta. Kilpailuttamalla vaikutat siis laskun myyntiosuuteen." },
  { q: "Kuinka usein sähkösopimus kannattaa kilpailuttaa?", a: "Vähintään kerran vuodessa ja aina määräaikaisen sopimuksen päättyessä. Päättynyt sopimus jatkuu usein listahintaisena, joka on lähes aina kilpailutettua kalliimpi." },
  { q: "Voinko vaihtaa, vaikka minulla on maksuhäiriömerkintä?", a: "Useimmat yhtiöt tekevät luottotietotarkistuksen. Merkintä voi johtaa vakuusmaksun vaatimiseen tai hylkäykseen, mutta käytännöt vaihtelevat yhtiöittäin." },
];

const STEPS = [
  ["Kerro kulutuksesi", "Valitse asumismuoto tai syötä kWh-lukema laskusta. Kettu laskee todelliset vuosihinnat."],
  ["Valitse sopimus", "Vertaa euroja, älä senttejä. Halvin on merkitty ja hintapalkit näyttävät erot heti."],
  ["Tee sopimus verkossa", "Täytä uuden yhtiön lomake parissa minuutissa. Yhtiö hoitaa loput."],
];

export default function ElectricityPage() {
  const plans = getPlans();
  const topics = getEnergyTopics();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ENERGY_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Etusivu", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Sähkösopimukset", item: `${SITE.url}/sahkosopimukset` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <ElectricityExperience plans={plans} />

      {/* NÄIN VAIHTO TOIMII */}
      <section id="nain-toimii" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-accentDark">
                Vaihto käytännössä
              </span>
              <span className="h-px flex-1 bg-line" aria-hidden />
            </div>
            <h2 className="mt-4 max-w-lg font-display text-[2rem] font-extrabold leading-tight text-ink sm:text-[2.5rem]">
              Kolme askelta, viisi minuuttia.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
            {STEPS.map(([title, text], i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="h-full bg-white p-7">
                  <span className="font-display font-data text-[13px] font-bold tracking-[0.1em] text-accent">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-[19px] font-bold text-ink">{title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink/72">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-6 rounded-3xl border border-line bg-white p-6 sm:p-7">
              <p className="font-display text-[15px] font-bold text-ink">Ota nämä esiin ennen kuin aloitat</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: FileText, title: "Käyttöpaikkatunnus", text: "17-numeroinen GSRN-tunnus. Löytyy sähkölaskustasi tai verkkoyhtiön palvelusta." },
                  { icon: MapPin, title: "Osoite ja alkupäivä", text: "Käyttöpaikan osoite ja päivä, jolloin haluat uuden sopimuksen alkavan." },
                  { icon: UserCheck, title: "Pankkitunnukset", text: "Tunnistautumiseen. Sopimus syntyy sähköisesti muutamassa minuutissa." },
                ].map((r) => (
                  <div key={r.title} className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-accent/20 bg-accentSoft text-accentDark">
                      <r.icon size={16} aria-hidden />
                    </span>
                    <div>
                      <p className="font-display text-[13.5px] font-bold text-ink">{r.title}</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-ink/68">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-[13.5px] font-medium text-ink/72">
                <ShieldCheck size={16} className="shrink-0 text-accent" aria-hidden />
                Etämyynnissä sopimuksella on aina 14 vuorokauden peruutusoikeus.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <EnergyTrust />

      {/* TILANNEKOHTAISET OPPAAT */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-accentDark">
                Valitse tilanteesi
              </span>
              <span className="h-px flex-1 bg-line" aria-hidden />
            </div>
            <h2 className="mt-4 max-w-xl font-display text-[2rem] font-extrabold leading-tight text-ink sm:text-[2.5rem]">
              Oikea sopimus riippuu siitä, missä asut.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((t, i) => (
              <Reveal key={t.slug} delay={i * 0.06}>
                <Link
                  href={`/sahkosopimukset/${t.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition-all hover:-translate-y-1.5 hover:border-den/15 hover:shadow-cardHover"
                >
                  <h3 className="font-display text-[16px] font-bold leading-snug text-ink">{t.h1}</h3>
                  <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-ink/68 line-clamp-3">{t.intro}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-display text-[13.5px] font-bold text-accentDark">
                    Lue opas
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* UKK */}
      <section id="ukk" className="scroll-mt-24 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-[2rem] font-extrabold leading-tight text-ink sm:text-[2.5rem]">
              Kysymykset, jotka pysäyttävät vaihdon.
            </h2>
            <p className="mt-3 text-[16px] text-ink/72">
              Vastaukset ovat lyhyet, koska asia on yksinkertaisempi kuin miltä se näyttää.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <Faq items={ENERGY_FAQ} />
          </Reveal>
        </div>
      </section>

      <CtaSection
        href="/sahkosopimukset#vertailu"
        title="Ketuttaako maksaa liikaa?"
        text="Anna Ketun kilpailuttaa puolestasi — minuutissa, ilmaiseksi ja ilman tunnuksia."
        button="Kilpailuta sähkösopimus"
      />
    </>
  );
}
