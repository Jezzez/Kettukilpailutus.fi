import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, MapPin, ShieldCheck, UserCheck } from "lucide-react";
import ElectricityExperience from "@/components/energy/ElectricityExperience";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import FoxSays from "@/components/FoxSays";
import SectionHead from "@/components/SectionHead";
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

      {/*
        Kaikki heron alapuolinen sisältö on vaalealla pinnalla. Tuloslista ja
        sitä seuraavat epäröintiä poistavat osiot ovat lukemista, ei brändiä.
      */}
      <div className="theme-light bg-paper">

      {/*
        Kettu puhuu heti tuloslistan jälkeen. Juuri siinä kohdassa lukija on
        nähnyt hinnat ja epäröi: "onko halvin oikeasti halvin?" Repliikki
        vastaa siihen ja korjaa samalla sähkövertailun yleisimmän
        väärinkäsityksen (siirtomaksu ei muutu sopimusta vaihtamalla).
        Ilman tätä osa kävijöistä jättää klikkaamatta, koska luulee luvun
        olevan puolikas totuus.
      */}
      <FoxSays
        className="pt-14 md:pt-16"
        quote="Halvin sopimus ei ole se, jonka mainos on kovaäänisin. Se on se, jonka kokonaishinta on pienin — ja sen näkee vain laskemalla."
        note="Yllä näkyvä euromäärä sisältää energian hinnan, kuukausimaksun ja arvonlisäveron. Siirtomaksu tulee verkkoyhtiöltäsi eikä muutu sopimusta vaihtamalla, joten se ei kuulu vertailuun."
      />

      {/*
        Aiemmin tässä oli KAKSI laatikkoa peräkkäin: "kolme askelta" ja
        "ota nämä esiin". Ne vastaavat samaan pelkoon — "onko tämä hankalaa" —
        joten ne on yhdistetty yhdeksi. Kaksi laatikkoa samasta asiasta saa
        vaihdon näyttämään työläämmältä kuin se on.
      */}
      <section id="nain-toimii" className="scroll-mt-24 border-t border-line py-16 md:py-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <SectionHead
              eyebrow="Näin vaihto etenee"
              title="Kolme askelta, viisi minuuttia."
              lead="Vaihto tapahtuu taustalla. Sinun osuutesi on lyhyempi kuin useimmat luulevat."
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
              <div className="grid gap-px bg-line md:grid-cols-3">
                {STEPS.map(([title, text], i) => (
                  <div key={title} className="h-full bg-white p-6 sm:p-7">
                    <span className="font-data text-[13px] font-bold tracking-[0.1em] text-accentDark">
                      0{i + 1}
                    </span>
                    <h3 className="mt-2.5 font-display text-[18px] font-bold text-ink">{title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{text}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-line p-6 sm:p-7">
                <p className="font-display text-[14px] font-bold text-ink">
                  Ota nämä esiin ennen kuin aloitat
                </p>
                <div className="mt-3.5 grid gap-3.5 sm:grid-cols-3">
                  {[
                    { icon: FileText, title: "Käyttöpaikkatunnus", text: "17-numeroinen GSRN-tunnus sähkölaskustasi." },
                    { icon: MapPin, title: "Osoite ja alkupäivä", text: "Käyttöpaikan osoite ja sopimuksen alkupäivä." },
                    { icon: UserCheck, title: "Pankkitunnukset", text: "Tunnistautumiseen. Sopimus syntyy sähköisesti." },
                  ].map((r) => (
                    <div key={r.title} className="flex gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-accent/20 bg-accentSoft text-accentDark">
                        <r.icon size={15} aria-hidden />
                      </span>
                      <div>
                        <p className="font-display text-[13px] font-bold text-ink">{r.title}</p>
                        <p className="mt-0.5 text-[12.5px] leading-snug text-ink/70">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-[13px] font-medium text-ink/70">
                  <ShieldCheck size={15} className="shrink-0 text-ink/40" aria-hidden />
                  Etämyynnissä sopimuksella on aina 14 vuorokauden peruutusoikeus.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <EnergyTrust />

      {/*
        UKK — vastaa epäröintiin ennen kuin oppaat vievät pois sivulta.
        Ei `border-t`: tämän osion yläpuolella on nyt tumman
        luottamusvyöhykkeen hännänveto, ja suora hiusviiva heti kaaren alla
        pyyhkisi kaaren pois — silmä lukisi vain sen viivan.
      */}
      <section id="ukk" className="scroll-mt-24 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <SectionHead
              eyebrow="Usein kysyttyä"
              title="Kysymykset, jotka pysäyttävät vaihdon."
              lead="Vastaukset ovat lyhyet, koska asia on yksinkertaisempi kuin miltä se näyttää."
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <Faq items={ENERGY_FAQ} />
          </Reveal>
        </div>
      </section>

      {/*
        Oppaat olivat neljä isoa korttia, jotka veivät kokonaisen ruudullisen
        tilaa ja houkuttelivat pois vertailusta juuri ennen loppukehotusta.
        Sisäiset linkit ovat tärkeitä hakukoneille, joten ne säilyvät —
        mutta kevyenä rivinä, ei kilpailevana osiona.
      */}
      <section className="border-t border-line pb-16 pt-14">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-[15px] font-bold text-ink">
              Lue lisää omasta tilanteestasi
            </h2>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {topics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/sahkosopimukset/${t.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 font-display text-[13.5px] font-semibold text-ink/80 transition-all hover:border-accent/45 hover:text-ink"
                >
                  {t.h1}
                  <ArrowRight size={14} className="text-ink/35 transition-transform group-hover:translate-x-0.5 group-hover:text-accentDark" aria-hidden />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      </div>

      <CtaSection
        href="/sahkosopimukset#vertailu"
        title="Ketuttaako maksaa liikaa?"
        text="Anna Ketun kilpailuttaa puolestasi — minuutissa, ilmaiseksi ja ilman tunnuksia."
        button="Kilpailuta sähkösopimus"
      />
    </>
  );
}
