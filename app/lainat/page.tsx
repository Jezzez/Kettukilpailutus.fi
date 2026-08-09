import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AffiliateButton from "@/components/AffiliateButton";
import Faq from "@/components/Faq";
import FoxPaw from "@/components/FoxPaw";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import FoxSlot from "@/components/fox/FoxSlot";
import TailSweep from "@/components/fox/TailSweep";
import LoanStickyCta from "@/components/loans/LoanStickyCta";
import SortterCalculator from "@/components/loans/SortterCalculator";
import { OG_IMAGE, SITE } from "@/lib/data";
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
    // Pakko toistaa: sivun oma openGraph-lohko korvaa juuritason lohkon
    // kokonaan, jolloin kuva katoaisi. Ks. OG_IMAGE lib/data.ts.
    images: [OG_IMAGE],
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
const HERO_CHECKS = ["Yksi hakemus", "Useita pankkeja", "Maksuton vertailu"];

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

      <section className="theme-ember ember-surface relative overflow-hidden pb-28 pt-9 md:pb-28 md:pt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 w-full overflow-hidden md:hidden"
        >
          <Image
            src="/kettu-tuolissa.webp"
            alt=""
            width={712}
            height={993}
            priority
            className="absolute bottom-0 left-15 h-[100%] w-auto max-w-full -scale-x-100 object-contain opacity-40"
            style={{
              WebkitMaskImage:
                "linear-gradient(to left, #000 84%, transparent 100%)",
              maskImage:
                "linear-gradient(to left, #000 84%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-[1] mx-auto max-w-[1180px] px-4 sm:px-6">
          <div className="grid items-center gap-6 md:grid-cols-[1.08fr_0.92fr] md:gap-8">
            <div>
              <Reveal>
                <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                  Lainavertailu
                </span>

                <h1 className="mt-4 max-w-[10ch] font-hero text-[2.7rem] leading-[1.03] text-cream sm:text-[3.6rem]">
                  Kilpailuta lainat
                  <br />
                  <em className="text-goldInk">Yhdellä</em> hakemuksella.
                </h1>

                <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-ink/90 sm:text-[17px]">
                  Kettu ohjaa sinut Suomen suosituimpiin kuuluvaan lainanvertailupalveluun. Yksi hakemus riittää sillä tarjoukset tulevat useilta pankeilta ja lainanantajilta yhdellä kertaa.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
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

                <ul className="mt-5 flex max-w-lg flex-wrap gap-2">
                  {HERO_CHECKS.map((c) => (
                    <li
                      key={c}
                      className="flex items-center gap-2 rounded-full border border-line/60 px-3 py-1.5 text-[13.5px] font-semibold text-ink/85"
                    >
                      <FoxPaw size={12} className="text-goldInk" />
                      {c}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-[13px] leading-relaxed text-ink/70">
                  Hakemus tehdään turvallisesti Sortterin palvelussa.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.12} className="mx-auto hidden md:block">
              <Image
                src="/kettu-tuolissa.webp"
                alt="Kettu, Kettukilpailutuksen maskotti"
                width={712}
                height={993}
                priority
                className="relative h-[430px] w-auto select-none drop-shadow-[0_26px_44px_rgba(80,28,2,0.5)] lg:h-[470px]"
              />
            </Reveal>
          </div>
        </div>

        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={64} />
        </div>
      </section>

      <div className="theme-light bg-paper pt-px">
        <div className="relative z-20 mx-auto -mt-40 max-w-[900px] px-4 sm:px-6 md:-mt-44">
          <SortterCalculator />
        </div>
      </div>

      <section className="theme-ember ember-surface relative -mt-40 overflow-hidden pb-20 pt-36 md:-mt-44 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 rotate-180">
          <div className="theme-light">
            <TailSweep fill="rgb(var(--c-paper))" height={64} />
          </div>
        </div>

        <div className="relative z-[1] mx-auto max-w-[1180px] px-4 sm:px-6">
          <Reveal>
            <div className="flex items-center justify-center gap-3">
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                Näin se etenee
              </span>
            </div>
            <h2 className="mx-auto mt-4 max-w-[20ch] text-center font-hero text-[2rem] leading-[1.08] text-cream sm:text-[2.5rem]">
              Yksi hakemus. Useita lainatarjouksia.
            </h2>
            <p className="mx-auto mt-3.5 max-w-[52ch] text-center text-[15.5px] leading-relaxed text-ink/85 sm:text-[16.5px]">
              Täytä yksi hakemus, vertaa saamasi tarjoukset rauhassa ja
              päätä itse, hyväksytkö niistä yhden. Hakeminen ei sido lainan
              nostamiseen.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="theme-light mt-9 overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
              <div className="grid gap-px bg-line md:grid-cols-3">
                {LOAN_STEPS.map((s, i) => (
                  <div
                    key={s.title}
                    className="lift relative h-full overflow-hidden bg-white p-6 text-center sm:p-7"
                  >
                    <span className="relative font-data text-[12px] font-bold uppercase tracking-[0.16em] text-accentDark">
                      Askel 0{i + 1}
                    </span>
                    <h3 className="relative mt-2.5 font-display text-[18px] font-bold text-ink">
                      {s.title}
                    </h3>
                    <p className="relative mt-2 text-[14px] leading-relaxed text-ink/70">
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div
              className="mt-9 flex flex-col items-center gap-3 text-center"
              data-loan-cta
            >
              <div className="theme-light">
                <AffiliateButton
                  href={LOAN_PARTNER.url}
                  cardId={LOAN_PARTNER.id}
                  placement="lainat-askeleet"
                  variant="inverse"
                  className={BIG_BTN}
                >
                  Hae lainatarjoukset
                  <ArrowRight size={19} aria-hidden />
                </AffiliateButton>
              </div>
              <span className="text-[13.5px] text-ink/85">
                Hakeminen on maksutonta eikä velvoita ottamaan lainaa.
              </span>
            </div>
          </Reveal>
        </div>

        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={64} />
        </div>
      </section>

      <div className="theme-light bg-paper">
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
                title="Usein kysyttyä lainojen kilpailutuksesta"
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
                Mainoksen korko ei ole sinun korkosi.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink/85 md:mx-0">
                Täytä yksi hakemus ja saat henkilökohtaiset lainatarjoukset useilta pankeilta yhdellä kertaa. Voit vertailla tarjoukset rauhassa ilman sitoutumista.
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
                Palvelun toteuttaa Sortter. Palvelu on sinulle maksuton.
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
