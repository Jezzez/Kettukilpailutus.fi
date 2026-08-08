import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import AffiliateButton from "@/components/AffiliateButton";
import Faq from "@/components/Faq";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import FoxSlot, { FOX_SLOTS } from "@/components/fox/FoxSlot";
import TailSweep from "@/components/fox/TailSweep";
import LoanStickyCta from "@/components/loans/LoanStickyCta";
import SortterCalculator from "@/components/loans/SortterCalculator";
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
        {/*
          MOBIILIN KETTU ON TAUSTAKUVA, EI OMA PALSTA.

          MIKSI TAUSTALLA EIKÄ TEKSTIN ALLA OMANA LOHKONA: tämän sivun
          ainoa mittari on "Hae lainatarjoukset" -napin painallus, ja
          mobiilissa se on aina kilpailussa ruudun korkeudesta. Kuva omana
          lohkonaan lisäisi heroon 300–400 pikseliä ja työntäisi napin
          taitteen alle — se maksaisi klikkejä riippumatta siitä, kuinka
          hyvä kuva on. Absoluuttisesti sijoitettuna kettu ei vie yhtään
          pystysuoraa tilaa: hero on täsmälleen yhtä korkea kuin ennen,
          mutta ei enää tyhjä.

          MIKSI SE ON HÄIVYTETTY: otsikko ja ingressi ovat kermanvärisiä,
          ja ketun puku on myös kerma. Täydellä peitolla teksti katoaisi
          hahmon päälle. Vasemmalle häipyvä maski pitää hahmon tiheimmän
          kohdan oikeassa laidassa, jossa tekstiä ei ole, ja liukuu
          olemattomiin ennen kuin se ehtii otsikon alle. Peitto 55 % pitää
          kontrastin luettavana myös auringossa.

          MIKSI OIKEALLE JA REUNAN YLI: sama paikka kuin työpöydällä, eli
          sama sivu pienemmässä ruudussa — ei eri taitto. Reunan yli
          valuva hahmo lukee myös tarkoitukselliselta rajaukselta, kun
          taas keskelle mahtumaan kutistettu hahmo lukee pieneltä.

          `aria-hidden`: kuva ei kerro mitään, mitä otsikossa ei jo lue.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[74%] overflow-hidden md:hidden"
        >
          <Image
            src={FOX_SLOTS.lainaHero.src ?? ""}
            alt=""
            width={FOX_SLOTS.lainaHero.w}
            height={FOX_SLOTS.lainaHero.h}
            priority
            className="absolute bottom-0 right-[-22%] h-[82%] w-auto max-w-none object-contain opacity-40"
            style={{
              WebkitMaskImage: "linear-gradient(to left, #000 14%, transparent 74%)",
              maskImage: "linear-gradient(to left, #000 14%, transparent 74%)",
            }}
          />
        </div>

        <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-8 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:pb-20 md:pt-16">
          <div>
            <Reveal>
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                Lainavertailu
              </span>

              <h1 className="mt-4 font-hero text-[2.7rem] leading-[1.03] text-cream sm:text-[3.6rem]">
                Kilpailuta lainat
                <br />
                <em className="text-goldInk">Yhdellä</em> hakemuksella.
              </h1>

              {/*
                YKSI RIVI, JA SE KERTOO ETTEI KETTU VERTAILE ITSE.
                Jos kävijä luulee saavansa vertailun tällä sivulla ja
                päätyykin toisen palvelun lomakkeelle, hän kokee
                tulleensa harhautetuksi ja poistuu ennen hakemusta —
                eli juuri ennen sitä kohtaa, josta palkkio syntyy.
              */}
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink/90">
                Kettu ohjaa sinut Suomen suosituimpiin kuuluvaan lainanvertailupalveluun. Yksi hakemus riittää sillä tarjoukset tulevat useilta pankeilta ja lainanantajilta yhdellä kertaa.
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
                Hakemus tehdään turvallisesti Sortterin palvelussa.
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


      </section>

      <div className="theme-light bg-paper">
        {/*
          LASKURI HETI HERON ALLE.

          MIKSI TÄHÄN EIKÄ HERON SISÄÄN: heron oikea palsta on 0,95fr eli
          noin 520 pikseliä, ja siinä on kettukuva. Laskuri kahdella
          liu'ulla ja isolla euroluvulla ei mahdu siihen ilman että
          kumpikin puristuu — ja mobiilissa se työntäisi heron oman napin
          ulos ensimmäisestä ruudullisesta, mikä on tämän sivun ainoa
          mittari. Heti heron ALLA laskuri saa koko leveyden eikä vie
          napilta yhtään pikseliä. Järjestys on sama kuin sähkösivulla:
          työkalu ennen myyntipuhetta, koska kävijä jää tekemään mutta ei
          jää lukemaan.

          LASKURIA EI KÄÄRITÄ OMAAN KORTTIIN. Ensimmäinen versio oli
          `rounded-3xl`-kortti otsikkokaistoineen, ja se näytti virheeltä:
          widget piirtää itse valkoisen, pyöreän ja varjostetun kortin,
          joten ruudulla oli kortti kortin sisällä. Nyt kehyksiä on yksi
          ja se on widgetin oma. Sortterin paneelin saa näyttää Sortterin
          paneelilta — sivun oma lupaus on juuri se, ettei Kettu vertaile
          lainoja itse.

          MIKSI EI OLE HOUKUTELTU MUOKKAAMAAN WIDGETIN SISUSTA: se on
          varjo-DOM:issa, joten ainoa tapa olisi injektoida tyylejä
          Sortterin omilla luokkanimillä. Ne ovat tiivistehäntäisiä
          moduulinimiä (`widget-calculator-module--…--QfGbo`) ja koodi
          tulee unpkg:sta ilman versionumeroa, eli se voi vaihtua
          tuotannossa ilmoittamatta. Sellainen viritys hajoaisi joskus
          hiljaa juuri sillä sivulla, joka tuottaa. Värit sen sijaan
          menevät perille widgetin omista attribuuteista — ks.
          SortterCalculator.tsx.
        */}
        <section className="pt-12 md:pt-14">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <Reveal>
              {/*
                TÄSSÄ EI KÄYTETÄ `SectionHead`-KOMPONENTTIA, VAIKKA JOKA
                MUU OSIO KÄYTTÄÄ. Syy on se, että widget piirtää itse
                otsikon "Kilpailuta lainat". Kaksi isoa otsikkoa peräkkäin
                lukee kahdeksi eri osioksi, joiden väliin ei jäänyt
                mitään — ja koska widgetin otsikkoa ei voi vaihtaa
                attribuutilla, meidän on väistettävä. Tämä on siis
                yläotsikko ja yksi rivi, ei osion ankkuri: widgetin oma
                otsikko toimii ankkurina.

                RIVI KERTOO MITÄ LASKURI EI OLE. "Suuntaa antava" ja
                "lopullisen korkosi ratkaisee vasta hakemus" eivät ole
                varauksia lakimiestä varten vaan tämän sivun koko
                myyntiargumentti: lainan hintaa ei voi lukea taulukosta,
                ja juuri siksi kannattaa kilpailuttaa. Kun sen sanoo itse
                ENNEN lukua, luku ei ole lupaus jota vasten pettyä.
              */}
              <div className="text-center">
                <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-accentDark">
                  Arvioi kuukausieräsi ennen hakemusta
                </p>
                <p className="mx-auto mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink/70 sm:text-[16.5px]">
                  Säädä lainasummaa ja laina-aikaa.
                  Näet heti suuntaa-antavan kuukausierän ennen kuin kilpailutat lainasi.
                </p>
              </div>
            </Reveal>

            {/*
              NEGATIIVISET MARGINAALIT SIISTIVÄT WIDGETIN OMAN VÄLIN.
              Sortterin uloin säiliö on `margin: 76px 0`, joten ilman
              tätä otsikon ja kortin väliin jäisi lähes sata pikseliä
              tyhjää ja saman verran alle — osio näyttäisi siltä, että
              siitä puuttuu jotain. Negatiivinen marginaali on tässä
              oikea työkalu, koska se ei kajoa widgetin sisään vaan
              siirtää sen kokonaisuutta: se kestää Sortterin päivitykset.
            */}
            <Reveal delay={0.08} className="mx-auto -mb-10 -mt-16 max-w-[760px]">
              <SortterCalculator />
            </Reveal>
          </div>
        </section>

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
                title="Yksi hakemus. Useita lainatarjouksia."
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
                  Hakeminen on maksutonta eikä velvoita ottamaan lainaa.
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
