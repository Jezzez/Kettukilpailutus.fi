import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import AffiliateButton from "@/components/AffiliateButton";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import FoxSlot from "@/components/fox/FoxSlot";
import TailSweep from "@/components/fox/TailSweep";
import LoanStickyCta from "@/components/loans/LoanStickyCta";
import { SITE } from "@/lib/data";
import { FEATURES } from "@/lib/features";
import { LOAN_FAQ, LOAN_PARTNER, LOAN_STEPS } from "@/lib/loans";

/*
  TÄMÄ ON OHJAUSSIVU, EI VERTAILUSIVU.

  Kettu ei vertaile lainoja. Lainan hinta ei ole listahinta vaan
  hakijakohtainen päätös, joten vertailutaulukkoa ei voi rakentaa ilman
  että se valehtelee. Sivun ainoa tehtävä on siirtää kävijä Sortterille,
  joka tekee oikean vertailun oikeilla tarjouksilla.

  SIVU ON TARKOITUKSELLA LYHYT. Täällä oli neljä pitkää tekstiosiota
  hakukoneita varten. Ne poistettiin, koska ohjaussivulla teksti ei ole
  neutraali lisä vaan este: se työntää napin ruudullisten päähän ja
  antaa lukijalle kolme uutta kohtaa, joissa päättää lukevansa tämän
  myöhemmin. Kun sivulla ei ole työkalua johon jäädä, jokainen
  vieritetty ruudullinen on pelkkää poistumisriskiä.

  HINTA, JOKA TÄSTÄ MAKSETAAN: lyhyt sivu ei sijoitu hakukoneessa
  omilla asiasanoillaan. Se on tietoinen valinta — lainahaut ovat
  Suomen kilpailluinta hakusanatilaa, eikä tämä sivu olisi sijoittunut
  niissä joka tapauksessa. Liikenne tälle sivulle tulee navigaatiosta,
  etusivun ruudusta ja blogista, ja juuri sille yleisölle lyhyt sivu
  konvertoi paremmin. Jos lainasisällölle halutaan omaa hakuliikennettä,
  se kuuluu blogiartikkeleihin, jotka linkittävät tänne.

  NAPPEJA ON KOLME PLUS KELLUVA: hero, askelkaistan pääte ja loppuvyö,
  ja mobiilissa lisäksi kiinteä alapalkki. UKK:n perään ei laitettu
  omaa nappia, koska loppuvyö alkaa heti sen jälkeen — kaksi nappia
  peräkkäin ilman mitään välissä näyttää virheeltä, ei tarjoukselta.
  Jokainen `placement` on eri, joten seurannasta näkee myöhemmin kumpi
  kohta oikeasti vetää.

  SIVULLA EI OLE YHTÄÄN KORKOA TAI EUROA. Perustelu on kirjoitettu auki
  lib/loans.ts:ssä: emme ole tarkistaneet yhtään lainatarjousta, ja KSL
  7 luku vaatii todellisen vuosikoron ja edustavan esimerkin heti kun
  yksikin kustannusluku mainitaan.
*/

export const metadata: Metadata = {
  title: "Lainan kilpailutus – yksi hakemus, tarjoukset useasta pankista",
  description:
    "Yhdellä hakemuksella lainatarjoukset usealta pankilta rinnakkain. Maksutonta eikä sido mihinkään. Kettu ohjaa sinut kumppanilleen Sortterille.",
  alternates: { canonical: "/lainat" },
  openGraph: {
    title: "Lainan kilpailutus – yksi hakemus, tarjoukset useasta pankista",
    description:
      "Lainan hintaa ei voi lukea taulukosta, koska se on aina hakijakohtainen. Näin saat oikeat tarjoukset rinnakkain.",
    url: "/lainat",
  },
};

/*
  NAPPIEN KOKO ON YHTEINEN VAKIO.

  AffiliateButtonin oletusmitat on suunniteltu korttilistan riveille,
  joissa nappi on yksi elementti muiden joukossa. Tällä sivulla nappi
  ON sisältö: ruudulla ei ole vertailua eikä laskuria, joten mikään ei
  kilpaile sen kanssa huomiosta — ja silloin liian pieni nappi vain
  hukkaa sen huomion. Mobiilissa `w-full` tekee napista ruudun levyisen
  kaistan, jolloin sitä ei voi ohittaa vahingossa eikä siihen tarvitse
  osua peukalolla tarkasti.

  `!` on pakollinen: AffiliateButton kirjoittaa oman paddinginsa ja
  kokonsa `base`-merkkijonoon, joka tulee luokkalistassa ensin.
*/
const BIG_BTN = "w-full sm:w-auto !px-9 !py-5 !text-[17px]";

/** Heron luottamusrivi. Jokainen kohta on tosi ja tarkistettavissa. */
const HERO_CHECKS = ["Yksi hakemus, useita pankkeja", "Maksuton", "Ei sido mihinkään"];

export default function LoansPage() {
  /* Kytkin on sama laite kuin korteilla: jos vertikaali suljetaan,
     sivu palauttaa 404 eikä jää roikkumaan hakukoneen indeksiin. */
  if (!FEATURES.loans) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Etusivu", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Lainat", item: `${SITE.url}/lainat` },
    ],
  };

  return (
    <>
      {/* Faq-komponentti tuottaa itse FAQPage-skeeman, joten tässä vain murupolku. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/*
        HERO ON KOKO SIVUN TÄRKEIN RUUTU.

        Rakenne on karsittu kolmeen asiaan: otsikko, yksi rivi selitystä
        ja nappi. Aiemmin tässä oli lisäksi viiden rivin ingressi ja
        erillinen luottamuskortti, jotka työnsivät napin mobiilissa
        ruudun alalaitaan. Nyt nappi mahtuu ensimmäiseen ruudulliseen
        myös puhelimessa — se on tämän sivun ainoa mittari.

        Ansaintakertomus ei kadonnut vaan siirtyi napin alle yhdeksi
        riviksi ja UKK:n viimeiseksi kysymykseksi. Se kuuluu sanoa itse,
        mutta se ei ansaitse omaa korttiaan heron sisältä.
      */}
      <section className="theme-ember ember-surface relative overflow-hidden">
        <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-8 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:pb-20 md:pt-16">
          <div>
            <Reveal>
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                Lainat
              </span>

              <h1 className="mt-4 font-hero text-[2.7rem] leading-[1.03] text-cream sm:text-[3.6rem]">
                Yksi hakemus.
                <br />
                <em className="text-goldInk">Monta</em> tarjousta.
              </h1>

              {/*
                YKSI RIVI, JA SE KERTOO ETTEI KETTU VERTAILE ITSE.
                Jos kävijä luulee saavansa vertailun tällä sivulla ja
                päätyykin toisen palvelun lomakkeelle, hän kokee
                tulleensa harhautetuksi ja poistuu ennen hakemusta —
                eli juuri ennen sitä kohtaa, josta palkkio syntyy.
              */}
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink/90">
                Kettu ei vertaile lainoja itse, vaan ohjaa sinut kumppanilleen{" "}
                {LOAN_PARTNER.name}ille — se lähettää yhden hakemuksesi usealle
                pankille ja näyttää tarjoukset rinnakkain.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              {/*
                `theme-light`-KÄÄRE ON PAKOLLINEN. AffiliateButtonin
                `inverse`-asu on `bg-white` + `text-accentDark`, ja
                ember-teemassa NE MOLEMMAT kääntyvät: pohja olisi
                oranssi ja teksti kermaa, eli nappi katoaisi vyöhön.
              */}
              <div className="theme-light mt-8" data-loan-cta>
                <AffiliateButton
                  href={LOAN_PARTNER.url}
                  cardId={LOAN_PARTNER.id}
                  placement="lainat-hero"
                  variant="inverse"
                  className={BIG_BTN}
                >
                  Hae lainatarjoukset
                  <ArrowRight size={19} aria-hidden />
                </AffiliateButton>
              </div>

              <ul className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
                {HERO_CHECKS.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-[14.5px] font-medium text-ink/85">
                    <Check size={15} strokeWidth={3} className="text-goldInk" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-[13px] leading-relaxed text-ink/70">
                Siirryt {LOAN_PARTNER.name}in sivulle. Saamme kumppanilta palkkion,
                jos teet hakemuksen — se ei näy sinun lainasi hinnassa.
              </p>
            </Reveal>
          </div>

          {/*
            Kuva keskitetään palstaan. Koko hahmo tuoleineen on kuvassa
            eikä siinä ole suoraa leikkausreunaa, joten sitä ei tarvitse
            ankkuroida aaltoreunaan piiloon.

            EI `halo-glow`-hehkua. Hehku on tarkoitettu tummapohjaisen
            kuvan irrottamiseen taustasta, mutta tässä kuvassa hahmon
            päävärit — kerma puku ja vaaleat kengät — ovat jo selvästi
            vyötä vaaleampia. Hehku näkyi siksi omana vaaleana laikkuna
            hahmon takana, ei valona hahmossa. Kontrasti riittää
            sellaisenaan.

            KORKEUS 470, EI 400: kuva on pystymallinen (712×993), joten
            400 pikselin korkeudella se piirtyisi vain 287 pistettä
            leveänä eli reilusti palstaa kapeampana. Liian pieni hahmo
            jättää ympärilleen tyhjää oranssia, ja tyhjä oranssi lukee
            keskeneräiseksi taitoksi, ei kuvitukseksi.
          */}
          <Reveal delay={0.15} className="relative mx-auto hidden w-full max-w-[520px] md:block">
            <div className="relative flex justify-center">
              <FoxSlot id="lainaHero" height={470} priority />
            </div>
          </Reveal>
        </div>

        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={64} />
        </div>
      </section>

      <div className="theme-light bg-paper">
        {/*
          ASKELKAISTA. Kolme riviä, ei kolmea kappaletta — tämän osion
          tehtävä on kumota yksi pelko ("onko tämä työlästä") yhdellä
          silmäyksellä ja päättyä nappiin.
        */}
        <section className="pt-14 md:pt-16">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <Reveal>
              <SectionHead
                eyebrow="Näin se etenee"
                title="Kolme askelta, muutama minuutti."
                align="center"
              />
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-9 overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
                <div className="grid gap-px bg-line md:grid-cols-3">
                  {LOAN_STEPS.map((s, i) => (
                    <div key={s.title} className="lift h-full bg-white p-6 text-center sm:p-7">
                      <span className="font-data text-[12px] font-bold uppercase tracking-[0.16em] text-accentDark">
                        Askel 0{i + 1}
                      </span>
                      <h3 className="mt-2.5 font-display text-[18px] font-bold text-ink">{s.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/*
              Osion päätepiste. Vaalealla pinnalla oranssi `primary`-nappi
              on ruudun kuumin piste — kermanappi toimisi vain vyöllä.
            */}
            <Reveal delay={0.14}>
              <div className="mt-9 flex flex-col items-center gap-3 text-center" data-loan-cta>
                <AffiliateButton
                  href={LOAN_PARTNER.url}
                  cardId={LOAN_PARTNER.id}
                  placement="lainat-askeleet"
                  className={BIG_BTN}
                >
                  Hae lainatarjoukset
                  <ArrowRight size={19} aria-hidden />
                </AffiliateButton>
                <span className="text-[13.5px] text-ink/70">
                  Ilmainen. Ei sido. Voit jättää lainan nostamatta.
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/*
          UKK on viimeinen vastalauseiden purku ennen loppunappia.
          Neljä kysymystä, ei enempää — jokainen lisäkysymys on uusi
          kohta, jossa lukija voi keksiä syyn olla hakematta.
        */}
        <section id="ukk" className="scroll-mt-24 py-14 md:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Reveal>
              <SectionHead
                eyebrow="Usein kysyttyä"
                title="Neljä kysymystä, jotka pysäyttävät hakemuksen."
                align="center"
              />
            </Reveal>
            <Reveal delay={0.1} className="mt-8">
              <Faq items={LOAN_FAQ} />
            </Reveal>
          </div>
        </section>
      </div>

      {/*
        LOPPUKEHOTUS ON OMA VYÖ EIKÄ JAETTU CtaSection: sen nappi on
        next/link eli sisäinen siirtymä, ja tämän sivun päätepiste on
        ulkoinen affiliate-linkki, joka tarvitsee `rel="nofollow
        sponsored"` -määreen ja klikkiseurannan.
      */}
      <section className="theme-ember ember-surface relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 rotate-180">
          <div className="theme-light">
            <TailSweep fill="rgb(var(--c-paper))" height={64} />
          </div>
        </div>

        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-24 text-center sm:px-6 md:flex-row md:py-28 md:text-left">
            <div className="flex-1">
              <h2 className="mx-auto max-w-xl font-hero text-[2rem] leading-[1.08] text-cream sm:text-[2.6rem] md:mx-0">
                Selvitä oma korkosi, älä mainoksen korkoa.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink/85 md:mx-0">
                Yksi hakemus lähtee usealle pankille kerralla, ja näet tarjoukset
                rinnakkain. Hakeminen ei sido sinua mihinkään.
              </p>

              <div className="theme-light mt-8" data-loan-cta>
                <AffiliateButton
                  href={LOAN_PARTNER.url}
                  cardId={LOAN_PARTNER.id}
                  placement="lainat-loppu"
                  variant="inverse"
                  className={BIG_BTN}
                >
                  Hae lainatarjoukset
                  <ArrowRight size={19} aria-hidden />
                </AffiliateButton>
              </div>

              <p className="mt-4 text-[13.5px] text-ink/75">
                Palvelun tarjoaa {LOAN_PARTNER.name}. Kettu saa palkkion
                hakemuksesta, sinä et maksa mitään.
              </p>
            </div>

            <div className="relative z-20 -mb-24 shrink-0 self-end md:-mb-28 md:-mt-40">
              <FoxSlot id="footer" height={500} className="!h-[300px] md:!h-[500px]" />
            </div>
          </div>
        </Reveal>
      </section>

      <LoanStickyCta />
    </>
  );
}
