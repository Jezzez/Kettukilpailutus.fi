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
      label: "suurin ero halvimman ja kalleimman välillä",
    },
    {
      value: 0,
      suffix: " €",
      count: false,
      label: `vertailu maksaa, hinnat ${fiDate(facts.priceDate)}`,
    },
  ];

  return (
    <section className="theme-ember ember-surface relative overflow-hidden">
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

        MIKSI PUHELIMESSA VAIN 46 % KORKEUDESTA. Työpöydällä maskotti saa
        olla lähes koko vyön korkuinen, koska teksti käyttää vain vasemman
        puoliskon. Puhelimessa tekstipalsta on koko leveys, joten täyden
        korkuinen hahmo osui mitattuna otsikon, ingressin ja molempien
        nappien taakse: kermanvaalea bleiseri kermanvaalean tekstin alla
        söi kontrastin juuri siitä kolmesta elementistä, joiden varassa
        klikki on. 46 % ankkuroituna alareunaan pitää hahmon nappien
        alapuolella, tilastopaneelin takana — näkyvissä, mutta ei minkään
        luettavan alla.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[70%] overflow-hidden md:w-[50%]"
      >
        <Image
          src="/kettu-innostunut.webp"
          alt=""
          width={910}
          height={1507}
          priority
          className="absolute bottom-0 right-[-8%] h-[46%] w-auto max-w-none object-contain opacity-30 md:right-0 md:h-[96%] md:opacity-40"
          style={{
            WebkitMaskImage:
              "linear-gradient(to left, #000 62%, transparent 100%)",
            maskImage: "linear-gradient(to left, #000 62%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px] px-4 pt-12 sm:px-6 md:pt-20">
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
          <h1 className="mt-6 max-w-[13ch] font-hero text-[clamp(3rem,10.5vw,5.4rem)] leading-[0.9] text-onEmber">
            Ketuttaako maksaa{" "}
            <span className="bg-gradient-to-br from-cream via-cream to-gold bg-clip-text text-transparent">
              liikaa?
            </span>
          </h1>

          <p className="mt-6 max-w-[40ch] text-[17px] leading-relaxed text-onEmber/85 sm:text-[19px]">
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
          <div className="mb-12 mt-12 overflow-hidden rounded-2xl border border-onEmber/15 bg-[#7E2C05]/35 md:mb-16 md:mt-16">
            <div className="gold-rule" />
            <dl className="grid divide-y divide-onEmber/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((s) => (
                <div key={s.label} className="px-5 py-5 sm:px-6 sm:py-7">
                  <dt className="font-hero text-[1.9rem] leading-none text-onEmber sm:text-[2.2rem]">
                    {s.count ? (
                      <CountUp value={s.value} suffix={s.suffix} />
                    ) : (
                      `${s.value.toLocaleString("fi-FI")}${s.suffix}`
                    )}
                  </dt>
                  <dd className="mt-2 max-w-[26ch] text-[13px] leading-snug text-onEmber/70">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
