import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, MapPin, ShieldCheck, UserCheck } from "lucide-react";
import ElectricityExperience from "@/components/energy/ElectricityExperience";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import FoxSays from "@/components/FoxSays";
import SectionHead from "@/components/SectionHead";
import CtaSection from "@/components/CtaSection";
import BrushRule from "@/components/BrushRule";
import TailSweep from "@/components/fox/TailSweep";
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
  ["Vastaa kolmeen kysymykseen", "Asumismuoto, vuosikulutus ja se, kumpi on tärkeämpää: halpa vai ennustettava. Ei yhteystietoja."],
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
        /* Ei "yllä näkyvä euromäärä": kysely on nyt tulosten edessä, joten
           osa lukijoista näkee tämän ennen kuin yhtään lukua on ruudulla.
           Viittaus johonkin, mitä ei ole, saa palvelun näyttämään
           rikkinäiseltä juuri luottamusrepliikin kohdalla. */
        note="Vertailun euromäärä sisältää energian hinnan, kuukausimaksun ja arvonlisäveron. Siirtomaksu tulee verkkoyhtiöltäsi eikä muutu sopimusta vaihtamalla, joten se ei kuulu vertailuun."
      />

      {/*
        Aiemmin tässä oli KAKSI laatikkoa peräkkäin: "kolme askelta" ja
        "ota nämä esiin". Ne vastaavat samaan pelkoon — "onko tämä hankalaa" —
        joten ne on yhdistetty yhdeksi. Kaksi laatikkoa samasta asiasta saa
        vaihdon näyttämään työläämmältä kuin se on.
      */}
      {/*
        TÄMÄ OSIO ON ORANSSI VYÖ, EI VAALEA PALSTA.

        MIKSI JUURI TÄSSÄ: sivun pisin vaalea jakso oli tuloslistan ja
        luottamusvyön välissä. Kävijä on juuri nähnyt hintansa ja
        epäröi yhtä asiaa — "onko vaihtaminen työlästä". Tämän osion
        koko tehtävä on kumota se pelko, ja se onnistuu vain jos osio
        nähdään. Kun koko kaista vaihtaa värin, selaus pysähtyy ennen
        kuin riviäkään on luettu.

        MIKSI TÄNNE SAA LAITTAA ORANSSIA: vyössä ei ole yhtään
        ostonappia. Oranssit vyöt, joissa nappi on (hero ja
        loppukehotus), säilyttävät siis edelleen ainoina ruudun
        kuumimman pisteen — tämä vyö vie katseen, ei klikkiä.

        Valkoinen kortti kääritään `theme-light`-luokkaan: ilman sitä
        `bg-white` on ember-teemassa ORANSSI, ja kortti katoaisi
        pohjaansa. Sama ansa koskee `text-accentDark`-luokkaa, joten
        yläotsikko käyttää `text-goldInk`-sävyä kuten muutkin vyöt.

        Alareunaan ei tule hännänvetoa: seuraava osio on persikkavyö,
        jonka pohjassa on liukuväri, eikä yksivärinen kaari osu siihen
        ilman saumaa. Suora raja oranssista persikkaan on tarkoituksella
        terävä.
      */}
      <section
        id="nain-toimii"
        className="theme-ember ember-surface relative scroll-mt-24 overflow-hidden py-20 md:py-24"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 rotate-180">
          <div className="theme-light">
            <TailSweep fill="rgb(var(--c-paper))" height={64} />
          </div>
        </div>

        <div className="relative z-[1] mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                Näin vaihto etenee
              </span>
              <BrushRule className="text-goldInk/70" width={64} />
            </div>
            <h2 className="mt-4 max-w-[20ch] font-hero text-[2rem] leading-[1.08] text-cream sm:text-[2.5rem]">
              Kolme askelta, viisi minuuttia.
            </h2>
            <p className="mt-3.5 max-w-[52ch] text-[15.5px] leading-relaxed text-ink/85 sm:text-[16.5px]">
              Vaihto tapahtuu taustalla. Sinun osuutesi on lyhyempi kuin useimmat luulevat.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="theme-light mt-9 overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
              <div className="grid gap-px bg-line md:grid-cols-3">
                {STEPS.map(([title, text], i) => (
                  <div key={title} className="lift relative h-full overflow-hidden bg-white p-6 sm:p-7">
                    <span className="relative font-data text-[12px] font-bold uppercase tracking-[0.16em] text-accentDark">
                      Askel 0{i + 1}
                    </span>
                    <h3 className="relative mt-2.5 font-display text-[18px] font-bold text-ink">{title}</h3>
                    <p className="relative mt-2 text-[14px] leading-relaxed text-ink/70">{text}</p>
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
