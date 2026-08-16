import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import ElectricityExperience from "@/components/energy/ElectricityExperience";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import CtaSection from "@/components/CtaSection";
import TailSweep from "@/components/fox/TailSweep";
import { annualCost, getPlans, getEnergyTopics } from "@/lib/energy";
import { OG_IMAGE, SITE } from "@/lib/data";

/*
  ETUSIVU ON SÄHKÖVERTAILU, EI KATEGORIAVALITSIN.

  Tässä oli aiemmin hub: viisi kategoriaruutua, joista kaksi oli auki.
  Se ohjautui `permanentRedirect`illä sähkösivulle, eli osoite
  kettukilpailutus.fi vei aina yhden ylimääräisen latauksen päähän
  siitä sisällöstä, jota kävijä tuli hakemaan.

  MIKSI MUUTETTIIN: sivuston ainoa tuottava vertikaali on sähkö. Etusivu
  on aina se osoite, jolle linkit ja maininnat kertyvät, ja hakukoneen
  silmissä se oli tyhjä uudelleenohjaus. Nyt vahvin osoite kantaa
  vahvinta sisältöä, ja kävijä on laskurin äärellä ensimmäisellä
  latauksella. `/sahkosopimukset` ohjautuu tänne 301:llä, joten vanha
  osoite ei katoa vaan siirtää painonsa tähän (ks. next.config.mjs).

  Kun toinen vertikaali (vakuutukset, internet) aukeaa oikeasti, hub
  kannattaa palauttaa — mutta silloin sille tehdään oma osoite, eikä
  sähkövertailua siirretä pois etusivulta.
*/

export const metadata: Metadata = {
  /*
    `absolute` ohittaa layoutin "%s | Kettukilpailutus.fi" -mallin.
    Ilman sitä otsikko olisi 84 merkkiä ja Google katkaisisi sen kesken
    lupauksen. Brändiä ei tarvitse toistaa: hakukone lisää sivuston nimen
    etusivun tulokseen itse (Organization-merkintä alla).
  */
  title: { absolute: "Kilpailuta sähkösopimus – vertaa hinnat omalla kulutuksellasi" },
  description:
    "Vertaa sähkösopimukset omalla kulutuksellasi: pörssisähkö, kiinteät ja toistaiseksi voimassa olevat. Näet heti arvioidun vuosihinnan ja säästön. Ilmainen ja puolueeton.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kilpailuta sähkösopimus – vertaa hinnat omalla kulutuksellasi",
    description:
      "Kerro kulutuksesi, niin Kettu laskee jokaisen sopimuksen todellisen vuosihinnan ja näyttää säästösi euroina.",
    url: "/",
    // Pakko toistaa: sivun oma openGraph-lohko korvaa juuritason lohkon
    // kokonaan, jolloin kuva katoaisi. Ks. OG_IMAGE lib/data.ts.
    images: [OG_IMAGE],
  },
};

const ENERGY_FAQ: { q: string; a: string }[] = [
  { q: "Katkeaako sähkö, kun vaihdan sopimusta?", a: "Ei vaihdon takia. Sähkö tulee kotiisi samaa verkkoa pitkin kuin ennenkin. Paikallinen verkkoyhtiösi pysyy samana, ja vain sähkönmyyjä vaihtuu." },
  { q: "Mitä sopimuksen vaihtaminen maksaa?", a: "Uuden sähkösopimuksen tekeminen on tavallisesti maksutonta. Määräaikaista sopimusta ei kuitenkaan yleensä voi päättää kesken sopimuskauden, joten tarkista nykyisen sopimuksesi päättymispäivä ennen tilausta. Kun vaihto on mahdollinen, uusi myyjä hoitaa vanhan sopimuksen irtisanomisen." },
  { q: "Mitä eroa on pörssisähköllä ja kiinteällä hinnalla?", a: "Pörssisähkön energiahinta vaihtuu tunneittain, ja myyjä lisää siihen marginaalin sekä mahdollisen perusmaksun. Kiinteässä sopimuksessa energian yksikköhinta pysyy samana sovitun kauden, mutta laskun summa muuttuu kulutuksesi mukana. Pörssisähkössä voit hyötyä edullisista tunneista, kun taas kiinteä hinta suojaa hintapiikeiltä." },
  { q: "Miksi laskussa on kaksi osaa: myynti ja siirto?", a: "Sähkönmyyjän ja myyntisopimuksen voit kilpailuttaa. Siirrosta vastaa paikallinen verkkoyhtiö, jota et voi vaihtaa, joten siirtomaksu ei riipu valitsemastasi sähkönmyyjästä. Tämä vertailu koskee sähkön myyntiosuutta." },
  { q: "Kuinka usein sähkösopimus kannattaa kilpailuttaa?", a: "Tarkista vaihtoehdot ainakin määräaikaisen sopimuksen lähestyessä loppuaan ja aina, kun saat hinnanmuutosilmoituksen. Toistaiseksi voimassa olevan sopimuksen voi kilpailuttaa muulloinkin, kun huomioit sopimuksen irtisanomisajan." },
  { q: "Voinko vaihtaa, vaikka minulla on maksuhäiriömerkintä?", a: "Maksuhäiriömerkintä ei automaattisesti estä sähkösopimuksen tekemistä. Myyjä voi erittäin painavasta syystä vaatia kohtuullisen vakuuden tai ennakkomaksun. Käytännöt vaihtelevat yhtiöittäin, joten tarkista ehdot valitsemaltasi myyjältä." },
];

const STEPS = [
  ["Vastaa neljään kysymykseen", "Asumismuoto, vuosikulutus, se mikä on sinulle tärkeintä ja nykyinen hintasi. Yhteystietoja ei kysytä."],
  ["Valitse sopimus", "Vertaa euroja, älä senttejä. Tämän hetken edullisin on merkitty, ja hintapalkeista näet erot ilman laskemista."],
  ["Tee sopimus verkossa", "Täytä uuden yhtiön lomake parissa minuutissa. Loput hoituu ilman sinua."],
];

export default function HomePage() {
  const plans = getPlans();
  const topics = getEnergyTopics();

  /*
    Organization on etusivun merkintä, ei alasivun. Se tuli mukana hubista
    ja jää tänne, koska tämä on nyt se osoite, jonka hakukone lukee
    sivuston "kotina".
  */
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon.svg`,
    description: "Suomalainen kilpailutuspalvelu: sähkösopimukset ja muut arjen sopimukset puolueettomasti vertailtuna.",
  };

  /*
    TÄSSÄ OLI TOINEN FAQPage-MERKINTÄ. POISTETTU.

    `components/Faq.tsx` tuottaa saman merkinnän samoista kysymyksistä,
    joten sivu julisti kaksi FAQPage-lohkoa. Google ei valitse niistä
    parempaa vaan voi jättää molemmat huomiotta, eli tuplaus vei pois
    juuri sen näkyvyyden, jota varten merkintä tehtiin. Kysymykset
    annetaan `<Faq>`-komponentille alempana, ja merkintä syntyy siellä.

    Myös BreadcrumbList poistettiin: etusivu on murupolun juuri, eikä
    yhden askeleen polku kerro hakukoneelle mitään.
  */

  /*
    ITEMLIST: MITÄ TÄLLÄ SIVULLA VERRATAAN JA MISSÄ JÄRJESTYKSESSÄ.

    Merkintä kertoo hakukoneelle, että sivu on vertailulista eikä
    artikkeli, ja nimeää jokaisen sopimuksen sekä sen oman sivun.
    Tuoton kannalta hyöty on epäsuora mutta oikea: sopimussivut ovat ne,
    jotka voivat sijoittua yhtiönimihauilla ("oomi sähkösopimus"), ja
    tämä lista kertoo Googlelle että ne kuuluvat yhteen kokonaisuuteen
    tämän sivun alla.

    JÄRJESTYS ON SAMA KUIN RUUDULLA: ensimmäinen vuosi halvimmasta
    kalleimpaan oletuskulutuksella 1 500 kWh. Merkintä, jonka järjestys
    poikkeaa näkyvästä listasta, on ristiriita sivun oman sisällön
    kanssa, ja sellainen luetaan manipulaatioyritykseksi.

    HINTOJA EI MERKITÄ, EIKÄ `Offer`-TYYPPIÄ KÄYTETÄ. Se olisi houkutus,
    koska hintarikastettu hakutulos erottuu. Mutta meidän euromäärämme ei
    ole hinta vaan laskelma: se riippuu kävijän kulutuksesta ja
    oletetusta pörssikeskiarvosta, eikä yksikään yhtiö veloita sitä
    summaa keneltäkään. Koneluettavaksi hinnaksi merkittynä se olisi
    keksitty luku Googlen suuhun. Sama sääntö kuin sopimusdatassa:
    tarkistamatonta lukua ei julkaista.
  */
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sähkösopimusten vertailu",
    numberOfItems: plans.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: [...plans]
      .sort((a, b) => annualCost(a, 1500) - annualCost(b, 1500))
      .map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${p.provider} ${p.name}`,
        url: `${SITE.url}/sahkosopimukset/sopimus/${p.slug}`,
      })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/*
        `resultsVisibleFromStart` on koko tämän sivun syy olla olemassa:
        tuloslista on palvelimen palauttamassa HTML:ssä heti, oletuksena
        kerrostalon 1 500 kWh. Kysely jää tarkentajaksi eikä ole enää
        sisällön este. Ks. perustelut ElectricityExperience.tsx:n
        porttikommentista.
      */}
      <ElectricityExperience plans={plans} initialKwh={1500} resultsVisibleFromStart />

      {/*
        Kaikki heron alapuolinen sisältö on vaalealla pinnalla. Tuloslista ja
        sitä seuraavat epäröintiä poistavat osiot ovat lukemista, ei brändiä.
      */}
      <div className="theme-light bg-paper">

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
            <TailSweep fill="rgb(var(--c-paper))" height={44} />
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
          <TailSweep fill="rgb(var(--c-paper))" height={44} />
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
              title="Mietityttääkö sopimuksen vaihtaminen?"
              lead="Näistä vastauksista näet, mitä vaihdossa tapahtuu ja mitä kannattaa tarkistaa ennen tilausta."
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
        href="/#vertailu"
        title="Kettu kilpailuttaa. Sinä säästät."
        text="Vastaa muutamaan kysymykseen ja Kettu laskee todellisen hinnan puolestasi. Näet selkeästi, mikä sähkösopimus säästää eniten rahaa juuri sinun kodissasi."
        button="Kilpailuta sähkösopimus"
      />
    </>
  );
}
