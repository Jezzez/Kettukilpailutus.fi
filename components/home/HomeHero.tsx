import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/home/CountUp";
import { FEATURES } from "@/lib/features";
import { ENERGY_COMPARE } from "@/lib/nav";
import { fiDate, type HomeFacts } from "@/lib/home";

/*
  HERO — SIVUSTON ENSIMMÄINEN RUUTU.

  MIKSI TÄMÄ EI OLE KAKSIPALSTAINEN NIIN KUIN MUUT HEROT. Sähkösivun ja
  aihesivujen hero on ruudukko, jossa vasemmalla on teksti ja oikealla
  laskuri. Kun hubilla oli sama ruudukko, hub näytti sähkösivulta josta
  puuttui laskuri — eli keskeneräiseltä versiolta oikeasta sivusta. Se on
  pahin mahdollinen ensivaikutelma sivulla, jonka ainoa tehtävä on saada
  kävijä luottamaan ja klikkaamaan eteenpäin.

  RAKENNE ON NYT YKSI TEKSTIPALSTA KOKO LEVEYDELTÄ JA MASKOTTI TAUSTALLA.
  Maskotti ei ole enää ruudukon toinen palsta vaan koko vyön korkuinen
  taustahahmo oikeassa reunassa. Kaksi seurausta, jotka molemmat vievät
  klikkiin päin:

  1. Otsikko saa koko leveyden. Se voi olla puhelimessa selvästi entistä
     isompi ilman että mikään siirtyy, ja iso otsikko on ainoa asia, jonka
     nopeasti selaava ehtii lukea.
  2. Napit nousevat ylemmäs. Kun kuvalle ei varata omaa palstaa, kaikki
     ennen nappia mahtuu puhelimessa yhteen ruutuun, eikä kävijän tarvitse
     vierittää päästäkseen ainoaan kohtaan, joka tuottaa.

  MASKOTTI ON SAMALLA TAVALLA KUIN MUILLA SIVUILLA: oikeaan reunaan
  ankkuroitu, `aria-hidden`, `pointer-events-none`, haalennettu ja
  vasemmalle häivytetty maskilla, jotta se ei koskaan kilpaile tekstin
  kanssa. Erona on, että täällä sama hahmo on myös työpöydällä — hubilla ei
  ole laskuria täyttämässä oikeaa reunaa, ja tyhjä oranssi puolikas näyttää
  siltä että jotain jäi lataamatta.

  YKSI KUVAELEMENTTI, EI KAHTA. Erilliset mobiili- ja työpöytäkuvat
  tarkoittaisivat kahta `priority`-kuvaa, joista selain lataa molemmat ja
  näyttää toisen. Sama elementti responsiivisilla luokilla lataa yhden.
*/

export default function HomeHero({ facts }: { facts: HomeFacts }) {
  /*
    `count: false` kolmannella rivillä on tarkoituksellinen. Nollasta
    nollaan juokseva luku on liikettä, joka ei kerro mitään, ja se veisi
    katseen kahdelta luvulta, jotka oikeasti kertovat.
  */
  const stats = [
    {
      value: facts.planCount,
      suffix: "",
      count: true,
      label: `sopimusta ${facts.providerCount} yhtiöltä`,
    },
    {
      value: Math.round(facts.maxSpread),
      suffix: " €",
      count: true,
      label: "halvimman ja kalleimman ero",
    },
    {
      value: 0,
      suffix: " €",
      count: false,
      label: "vertailu maksaa sinulle",
    },
  ];

  /*
    HERO ON PUHELIMESSA KOKO RUUDUN KORKUINEN.

    `min-h-[100svh]` tekee ensimmäisestä ruudusta kansikuvan: kävijä näkee
    otsikon, maskotin, molemmat napit ja lukurivin kerralla, eikä alle jää
    puolikasta seuraavaa osiota vetämässä katsetta pois. `svh` eikä `vh`,
    koska `vh` ei laske mobiiliselaimen osoiteriviä pois ja hero jäisi sen
    verran liian korkeaksi — juuri nappien alta.

    MIINUS 74 PIKSELIÄ ON HEADERIN KORKEUS (`components/Header.tsx`,
    `h-[74px]`). Header on `sticky`, eli se on normaalissa virrassa ja vyö
    alkaa vasta sen alta. Pelkkä `100svh` teki herosta täsmälleen headerin
    verran liian korkean, jolloin alin rivi jäi ruudun alapuolelle. Jos
    headerin korkeus muuttuu, muuta tämä luku samalla.

    Vain puhelimessa. Työpöydällä koko ruudun korkuinen vyö ilman yhtään
    näkyvää sisältöä alla lukee mainokseksi, ja hubin tehtävä on ohjata
    eteenpäin heti.
  */
  return (
    <section className="theme-ember ember-surface relative flex min-h-[calc(100svh-74px)] flex-col justify-center overflow-hidden md:min-h-0 md:block">
      {/*
        HITAASTI LIIKKUVA VALO VYÖN TAKANA.

        Oranssi vyö on tasainen väripinta, ja tasainen pinta näyttää
        puhelimen ruudulla painetulta kuvalta. Yksi hyvin hidas (18 s),
        pehmeäreunainen valokehä otsikon takana saa pinnan elämään ilman
        että mikään vilkkuu. Se on `pointer-events: none` eikä ole
        sisällön päällä (sisältö on `z-10`), joten se ei voi varastaa
        yhtään klikkiä. Animoi vain `transform`ia ja `opacity`a, eli se
        pyörii kompositorissa eikä hidasta vieritystä.
      */}
      <div
        aria-hidden
        className="aurora absolute -left-[18%] -top-[26%] h-[78vw] w-[78vw] max-h-[600px] max-w-[600px] md:left-[4%] md:-top-[22%]"
      />

      {/*
        MASKOTTI TAUSTALLA.

        MIKSI MASKI EIKÄ PELKKÄ HAALENNUS. Pelkkä `opacity` jättää kuvalle
        terävän pystyreunan siihen, mihin kuva loppuu, ja terävä reuna
        keskellä oranssia pintaa lukee virheeksi. Vasemmalle häipyvä maski
        sulattaa hahmon vyöhön, jolloin se on tunnelmaa eikä liimattu
        kuva — ja samalla se pitää tekstin alta pois juuri sen osan
        kuvasta, joka olisi tekstin päällä.

        KORKEUS ON PROSENTTIA VYÖSTÄ, EI KIINTEÄ PIKSELIMÄÄRÄ. Aiemmin
        maskotti skaalattiin heron korkeuden mukaan ilman kattoa, ja kun
        hero kasvoi sisällön myötä, kuvasta tuli valtava ja se valui
        otsikon päälle. Nyt kuva on omassa `overflow-hidden`-laatikossaan,
        joka on ankkuroitu oikeaan reunaan: se ei voi levitä vasemmalle
        millään näyttökoolla.

        MASKOTTI ON PUHELIMESSA ISO, EI PIENI. Välissä oli versio, jossa
        hahmo kutistettiin 46 prosenttiin ja työnnettiin alanurkkaan, jotta
        se ei olisi tekstin alla. Se ratkaisi kontrastin ja rikkoi sivun:
        vierekkäin sähkö- ja lainasivun kanssa hub oli ainoa, jolla ei ollut
        kansikuvaa, eli ainoa joka näytti keskeneräiseltä. Oikea ratkaisu ei
        ole pienentää kuvaa vaan tummentaa se tekstin alta, mikä on
        seuraavan kerroksen tehtävä.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[88%] overflow-hidden md:w-[52%]"
      >
        <Image
          src="/kettu-innostunut.webp"
          alt=""
          width={910}
          height={1507}
          priority
          className="absolute bottom-0 right-[-6%] h-[86%] w-auto max-w-none object-contain opacity-[0.62] md:right-0 md:h-[96%] md:opacity-45"
          style={{
            WebkitMaskImage:
              "linear-gradient(to left, #000 58%, transparent 100%)",
            maskImage: "linear-gradient(to left, #000 58%, transparent 100%)",
          }}
        />
      </div>

      {/*
        TUMMENNUS MASKOTIN JA TEKSTIN VÄLISSÄ.

        Tämä on se kerros, jonka takia maskotti saa olla iso. Ilman sitä oli
        vain kaksi huonoa vaihtoehtoa: haalea kettu, jolloin sivu ei
        hätkähdytä, tai kirkas kettu otsikon alla, jolloin kermanvaalea
        bleiseri ja kermanvaalea teksti sulavat yhteen eikä otsikkoa lue.

        Liukuväri on tumma vasemmalla ja katoaa kokonaan 74 prosentin
        kohdalla, eli juuri siinä missä tekstipalsta loppuu ja ketun kasvot
        alkavat. Teksti saa siis oman tumman pohjansa ja hahmo jää täyteen
        voimaansa. Sävy on vyön oma tumma pää (#8E3206), ei uusi väri.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(96deg, #8E3206 0%, rgba(142,50,6,0.86) 26%, rgba(142,50,6,0.42) 52%, rgba(142,50,6,0) 74%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 pt-8 sm:px-6 sm:pt-12 md:pt-20">
        <Reveal>
          {/*
            MERKKIPILLERI EIKÄ PALJAS PIKKUOTSIKKO. Sama sana, mutta
            kehystettynä se lukee merkiltä eikä leipätekstin ensimmäiseltä
            riviltä. Kultainen piste on sivuston toinen väri, ei kolmas.
          */}
          <span className="inline-flex items-center gap-2 rounded-full border border-onEmber/25 bg-[#7E2C05]/35 px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-onEmber/85">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            Kilpailutuspalvelu
          </span>

          {/*
            OTSIKON LEVEYS RAJATAAN OTSIKOSTA, EI KÄÄREESTÄ. `ch`-yksikkö
            laskee vanhemman fonttikoon mukaan. Kun `max-w-[16ch]` oli
            kääreessä, se laskettiin 16 pikselin leipätekstistä eli noin
            160 pikseliksi, ja koko tekstipalsta kutistui siihen 90
            pikselin otsikon alla. Raja kuuluu siis h1-elementille itselleen.

            KULTAINEN LIUKUVÄRI VAIN YHDESSÄ SANASSA. Se sana on "liikaa",
            eli koko palvelun lupauksen ydin. Liukuväri kulkee kermasta
            kultaan, joten sana pysyy luettavana myös silloin kun selain ei
            osaa leikata väriä tekstiin — silloin se piirtyy kermana.
          */}
          <h1 className="mt-6 max-w-[9ch] font-hero text-[clamp(3.1rem,12vw,5.4rem)] leading-[0.88] text-onEmber sm:max-w-[13ch]">
            Ketuttaako maksaa{" "}
            <span className="bg-gradient-to-br from-cream via-cream to-gold bg-clip-text text-transparent">
              liikaa?
            </span>
          </h1>

          <p className="mt-5 max-w-[30ch] text-[17px] leading-relaxed text-onEmber/85 sm:max-w-[40ch] sm:text-[19px]">
            Anna Ketun kilpailuttaa. Sähkösopimukset ja lainat samasta
            paikasta, ilmaiseksi ja selvällä suomella.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          {/*
            ENSISIJAINEN NAPPI ON KERMANVALKOINEN, EI ORANSSI. Oranssilla
            vyöllä oranssi nappi on sama väri kuin pohja. Vaalea nappi on
            ruudun ainoa vaalea piste, ja juuri se on koko vyön tarkoitus.

            Mobiilissa napit ovat pinossa ja täysleveät: vierekkäin ne
            jäisivät 390 pikselin leveydellä alle 44 pikselin
            kosketusalueeseen.
          */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={ENERGY_COMPARE}
              className="lift press sheen inline-flex items-center justify-center gap-2 rounded-xl bg-cream px-6 py-4 font-display text-[16px] font-bold text-[#A83E0A] shadow-lift"
            >
              Kilpailuta sähkö
              <ArrowRight size={18} aria-hidden className="nudge" />
            </Link>

            {FEATURES.loans && (
              <Link
                href="/lainat"
                className="press inline-flex items-center justify-center gap-2 rounded-xl border border-onEmber/40 px-6 py-4 font-display text-[16px] font-bold text-onEmber transition-colors hover:bg-onEmber/12"
              >
                Vertaile lainoja
              </Link>
            )}
          </div>

          {/*
            LUOTTAMUSRIVI HETI NAPIN ALLA, EI OSIONA ALEMPANA. Kaksi
            yleisintä syytä olla klikkaamatta vertailunappia ovat "joudunko
            maksamaan" ja "joudunko antamaan numeroni". Molemmat kuuluvat
            samaan ruutuun napin kanssa, koska alempana ne eivät ehdi
            vaikuttaa päätökseen.
          */}
          <p className="mt-4 font-display text-[13px] font-medium text-onEmber/65">
            Ilmainen · Ei yhteystietoja · Ei rekisteröitymistä
          </p>
        </Reveal>

        {/*
          LUKURIVI ON HERON POHJALLA OMANA PANEELINAAN.

          MIKSI PANEELI EIKÄ PALJAS RIVI VIIVAN ALLA: maskotti on nyt
          taustalla myös lukujen kohdalla, ja paljas teksti kuvan päällä on
          juuri se kohta, jossa vertailun luvut näyttäisivät epätarkoilta.
          Oma tummempi pinta erottaa luvut taustasta, ja samalla se sulkee
          heron: rivi lukee allekirjoituksena eikä kilpaile napin kanssa.

          LUVUT TULEVAT DATASTA, EIVÄT TÄSTÄ TIEDOSTOSTA. Rivi ei lupaa
          mitään, se kertoo mitä on jo tehty, ja jokainen luku on
          tarkistettavissa.
        */}
        <Reveal delay={0.12}>
          <div className="mt-9 overflow-hidden rounded-2xl border border-onEmber/15 bg-[#7E2C05]/45 backdrop-blur-[2px] md:mt-16">
            <div className="gold-rule" />
            <dl className="grid grid-cols-3 divide-x divide-onEmber/15">
              {stats.map((s) => (
                <div key={s.label} className="px-3 py-4 sm:px-6 sm:py-7">
                  <dt className="font-hero text-[1.35rem] leading-none text-onEmber sm:text-[2.2rem]">
                    {s.count ? (
                      <CountUp value={s.value} suffix={s.suffix} />
                    ) : (
                      `${s.value.toLocaleString("fi-FI")}${s.suffix}`
                    )}
                  </dt>
                  <dd className="mt-1.5 max-w-[26ch] text-[11px] leading-snug text-onEmber/70 sm:mt-2 sm:text-[13px]">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/*
            HINTAPÄIVÄ OMALLA RIVILLÄÄN, EI LUVUN SELITTEESSÄ. Kun se oli
            kolmannen luvun selitteenä ("vertailu maksaa, hinnat 20.8.2026"),
            se vei nauhassa kolme riviä ja työnsi luvut eri korkeuksille.
            Tieto on silti pakko näkyä: se on ainoa asia, joka erottaa
            tarkistetun vertailun arvauksesta.
          */}
          <p className="mb-5 mt-2 text-[12px] text-onEmber/55 md:mb-16 md:mt-3 md:text-[13px]">
            Hinnat tarkistettu {fiDate(facts.priceDate)}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
