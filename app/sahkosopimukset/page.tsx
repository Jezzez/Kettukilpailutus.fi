import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import ElectricityExperience from "@/components/energy/ElectricityExperience";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import FoxSays from "@/components/FoxSays";
import SectionHead from "@/components/SectionHead";
import CtaSection from "@/components/CtaSection";
import TailSweep from "@/components/fox/TailSweep";
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
  { q: "Katkeaako sähkö, kun vaihdan sopimusta?", a: "Ei katkea. Sähkö tulee kotiisi samaa verkkoa pitkin kuin ennenkin, ja vaihtuu vain se yhtiö, joka laskuttaa sinua. Vaihto tapahtuu taustalla, etkä huomaa siitä kotona mitään." },
  { q: "Mitä sopimuksen vaihtaminen maksaa?", a: "Ei mitään. Vaihto on maksuton, ja uusi yhtiö hoitaa vanhan sopimuksen irtisanomisen puolestasi. Yksi poikkeus: jos sinulla on kesken määräaikainen sopimus, sen purkamisesta voi tulla kuluja. Tarkista päättymispäivä laskustasi ennen kuin vaihdat." },
  { q: "Mitä eroa on pörssisähköllä ja kiinteällä hinnalla?", a: "Pörssisähkössä hinta seuraa sähköpörssiä tunneittain: maksat markkinahinnan ja sen päälle yhtiön marginaalin. Kiinteässä sopimuksessa maksat saman sentin joka tunti koko sopimuskauden. Pörssi on pitkällä aikavälillä ollut keskimäärin halvempi, kiinteä taas ennustettava. Kumpikaan ei ole automaattisesti oikea valinta." },
  { q: "Miksi laskussa on kaksi osaa: myynti ja siirto?", a: "Myyjän voit kilpailuttaa, ja sitä osaa vertaillaan täällä. Siirron hoitaa aina paikallinen verkkoyhtiö, jota ei voi vaihtaa, ja sen hinta on sama riippumatta siitä, keneltä ostat sähkön. Kilpailuttamalla vaikutat siis laskun toiseen puoliskoon." },
  { q: "Kuinka usein sähkösopimus kannattaa kilpailuttaa?", a: "Kerran vuodessa ja aina, kun määräaikainen sopimus päättyy. Päättynyt sopimus jatkuu usein listahinnalla, ja listahinta on lähes aina kilpailutettua kalliimpi. Juuri siihen unohtamiseen yhtiöiden hinnoittelu nojaa." },
  { q: "Voinko vaihtaa, vaikka minulla on maksuhäiriömerkintä?", a: "Useimmat yhtiöt tarkistavat luottotiedot. Merkintä voi johtaa vakuusmaksuun tai hakemuksen hylkäämiseen, mutta käytännöt vaihtelevat yhtiöittäin, joten yhden kieltävä vastaus ei tarkoita kaikkien vastausta." },
];

const STEPS = [
  ["Vastaa neljään kysymykseen", "Asumismuoto, vuosikulutus, se mikä on sinulle tärkeintä ja nykyinen hintasi. Yhteystietoja ei kysytä."],
  ["Valitse sopimus", "Vertaa euroja, älä senttejä. Halvin on merkitty, ja hintapalkeista näet erot ilman laskemista."],
  ["Tee sopimus verkossa", "Täytä uuden yhtiön lomake parissa minuutissa. Loput hoituu ilman sinua."],
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
        quote="Sähköyhtiö ei kerro sinulle, mitä sen sopimus maksaa. Se kertoo sentin. Euromäärä syntyy vasta, kun sentti kerrotaan sinun kulutuksellasi."
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

        Vyön oma kermanappi on osion päätepiste. Se on tarkoituksella
        ainoa nappi tässä vyössä: koko osio kumoaa yhden pelon, ja
        vastaus siihen on paluu laskuriin.

        Valkoinen kortti kääritään `theme-light`-luokkaan: ilman sitä
        `bg-white` on ember-teemassa ORANSSI, ja kortti katoaisi
        pohjaansa. Sama ansa koskee `text-accentDark`-luokkaa, joten
        yläotsikko käyttää `text-goldInk`-sävyä kuten muutkin vyöt.
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
            <div className="flex items-center justify-center gap-3">
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                Näin vaihto etenee
              </span>
            </div>
            <h2 className="mx-auto mt-4 max-w-[20ch] text-center font-hero text-[2rem] leading-[1.08] text-cream sm:text-[2.5rem]">
              Kolme askelta, viisi minuuttia.
            </h2>
            <p className="mx-auto mt-3.5 max-w-[52ch] text-center text-[15.5px] leading-relaxed text-ink/85 sm:text-[16.5px]">
              Uusi yhtiö irtisanoo vanhan sopimuksen, siirtoyhtiö pysyy samana ja sähkö kulkee koko ajan. Sinulle jää lomakkeen täyttö.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="theme-light mt-9 overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
              <div className="grid gap-px bg-line md:grid-cols-3">
                {STEPS.map(([title, text], i) => (
                  <div key={title} className="lift relative h-full overflow-hidden bg-white p-6 text-center sm:p-7">
                    <span className="relative font-data text-[12px] font-bold uppercase tracking-[0.16em] text-accentDark">
                      Askel 0{i + 1}
                    </span>
                    <h3 className="relative mt-2.5 font-display text-[18px] font-bold text-ink">{title}</h3>
                    <p className="relative mt-2 text-[14px] leading-relaxed text-ink/70">{text}</p>
                  </div>
                ))}
              </div>

              {/*
                TÄSSÄ OLI "Ota nämä esiin ennen kuin aloitat" -tarkistuslista
                (käyttöpaikkatunnus, osoite, pankkitunnukset). Se poistettiin.

                Lista oli hyödyllinen mutta väärässä paikassa: se seisoi
                napin päällä ja teki viisi minuuttia kestävästä asiasta
                kotitehtävän. Juuri siinä kohdassa, jossa lukija on vasta
                vakuuttunut helppoudesta, "hae ensin laskusi ja etsi
                17-numeroinen tunnus" antaa täydellisen syyn palata asiaan
                myöhemmin — eikä myöhempää käyntiä tule.

                Tieto ei kadonnut: sama luettelo on heron "Vie noin 5
                minuuttia" -kohdan takana, jonka lukija avaa itse silloin
                kun haluaa tietää mitä vaihto vaatii.

                Peruutusoikeus jää näkyviin, koska se POISTAA riskiä sen
                sijaan että lisäisi työtä.
              */}
              <p className="flex items-center justify-center gap-2 border-t border-line px-6 py-4 text-center text-[13px] font-medium text-ink/70 sm:px-7">
                <ShieldCheck size={15} className="shrink-0 text-ink/40" aria-hidden />
                Etämyynnissä sopimuksella on aina 14 vuorokauden peruutusoikeus.
              </p>
            </div>
          </Reveal>

          {/*
            PALUUNAPPI KYSELYYN.

            Tämä osio selittää vaihdon kulun, eli se on juuri se kohta,
            jossa epäröivä lukija vakuuttuu. Ilman nappia hänen pitäisi
            vierittää takaisin ylös löytääkseen laskurin — ja osa ei
            vieritä vaan poistuu. Nappi vie suoraan sinne, missä
            affiliate-klikki syntyy.

            Kerma oranssilla, kiinteä `#A83E0A` tekstille: `accentDark`
            kääntyisi ember-teemassa kermaksi eli näkymättömäksi.

            HOVER ON KIINTEÄ VALKOINEN, EI `hover:bg-white`. Ember-vyöllä
            `bg-white` osoittaa oranssiin, joten kermanappi olisi
            välähtänyt oranssiksi juuri painalluksen hetkellä — nappi
            olisi kadonnut taustaansa sillä sekunnilla, kun sitä
            painetaan. Sama virhe on muissakin kermanapeissa.

            Nappi on keskitetty: askelkortti yläpuolella on täysleveä,
            joten vasempaan reunaan jäävä nappi näyttää unohtuneelta.
            Keskellä se on osion päätepiste.
          */}
          <Reveal delay={0.16}>
            <div className="mt-9 flex flex-col items-center gap-3 text-center">
              <Link
                href="#vertailu"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-cream px-8 py-4 font-display text-[15.5px] font-bold text-[#A83E0A] shadow-lift transition-all hover:bg-[#FFFFFF] active:scale-[0.98]"
              >
                Kilpailuta sopimuksesi
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <span className="text-[13.5px] text-ink/85">
                Neljä kysymystä. Ei maksua, ei yhteystietoja.
              </span>
            </div>
          </Reveal>
        </div>

        {/*
          Hännänveto palasi tähän, kun läpinäkyvyysosio poistettiin.
          Aiemmin alareuna oli tarkoituksella terävä, koska alapuolella
          oli persikkavyö; nyt alla on tasainen paperi, ja suora raja
          oranssista paperiin katkaisisi sivun kahtia juuri napin alta.

          `theme-light`-kääre on PAKOLLINEN. Ilman sitä `--c-paper`
          luetaan ember-teemasta, jossa se on oranssi — kaari piirtyi
          vaaleanoranssina eikä osunut alla olevaan paperiin lainkaan.
          Sama ansa kuin vyön yläreunan hännänvedossa.
        */}
        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={64} />
        </div>
      </section>

      {/*
        UKK — vastaa epäröintiin ennen kuin oppaat vievät pois sivulta.
        Ei `border-t`: tämän osion yläpuolella on hännänveto, ja suora
        hiusviiva heti kaaren alla pyyhkisi kaaren pois — silmä lukisi
        vain sen viivan.
      */}
      <section id="ukk" className="scroll-mt-24 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <SectionHead
              eyebrow="Usein kysyttyä"
              title="Kysymykset, jotka pysäyttävät vaihdon."
              lead="Nämä kuusi ovat ne, joiden takia sopimus jää useimmin vaihtamatta. Vastaukset ovat lyhyet."
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
        text="Anna Ketun kilpailuttaa puolestasi. Minuutti aikaa, ei maksua, ei tunnuksia."
        button="Kilpailuta sähkösopimus"
      />
    </>
  );
}
