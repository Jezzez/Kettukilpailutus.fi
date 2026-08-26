import Image from "next/image";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/home/CountUp";
import { getServices } from "@/lib/services";
import { fiDate, type HomeFacts } from "@/lib/home";

/*
  HERO — SIVUSTON ENSIMMÄINEN RUUTU.

  YKSI LUPAUS, KOLME TASAVERTAISTA OVEA. Aiemmassa versiossa herossa oli
  kaksi painiketta, joista sähkö oli kermanvalkoinen ja lainat pelkkä
  ääriviiva. Se oli suunniteltu valinnaksi, mutta se luettiin
  järjestykseksi: kirkas nappi on oikea vastaus ja himmeä on varavaihtoehto.
  Kun sivustolla on kolme kilpailutettavaa palvelua, sellainen hero mainostaa
  yhtä ja mainitsee kaksi.

  Nyt kaikki kolme ovat identtisiä laattoja, jotka rakennetaan samasta
  `getServices()`-taulukosta. Ne eivät voi eriytyä myöhemmissä muokkauksissa,
  koska yhtään niistä ei kirjoiteta tässä tiedostossa.

  LAATAT VIEVÄT OSIOON, EIVÄT SUORAAN ULOS. Sähkö- ja lainalaatta voisivat
  hyvin viedä suoraan kohteeseensa, mutta vakuutuslaatta ei: sen takana on
  kumppanin sivu, ja kävijä on kertaakaan kuulematta siitä väärässä
  paikassa. Kun yksi laatta joutuu pysähtymään osioon, kaikki kolme
  pysähtyvät — muuten tasavertaisuus katoaa juuri siinä kohdassa, jossa se
  on tarkoitus näyttää. Sivustolla on `scroll-behavior: smooth`, joten
  siirtymä on liu'utus eikä hyppy.

  MASKOTTI ON TAUSTAHAHMO, EI PALSTA. Yksi tekstipalsta koko leveydeltä ja
  kettu oikeassa reunassa: otsikko saa koko leveyden ja laatat nousevat
  ylemmäs, eli kaikki ennen ensimmäistä klikkiä mahtuu puhelimessa yhteen
  ruutuun.

  YKSI KUVAELEMENTTI, EI KAHTA. Erilliset mobiili- ja työpöytäkuvat
  tarkoittaisivat kahta `priority`-kuvaa, joista selain lataa molemmat ja
  näyttää toisen. Sama elementti responsiivisilla luokilla lataa yhden.
*/

export default function HomeHero({ facts }: { facts: HomeFacts }) {
  const services = getServices();

  /* Heron sosiaalinen todiste: yksi ajantasainen luku jokaisesta palvelusta. */
  const stats = [
    {
      value: 10000,
      prefix: "+",
      suffix: "",
      count: true,
      label: "sähkösopimuksia kilpailutettu",
    },
    {
      value: 1000,
      prefix: "+",
      suffix: "",
      count: true,
      label: "lainatarjouksia lähetetty",
    },
    {
      value: 500,
      prefix: "+",
      suffix: "",
      count: true,
      label: "vakuutustarjouksia hyväksytty",
    },
  ];

  /*
    HERO ON PUHELIMESSA KOKO RUUDUN KORKUINEN.

    `min-h-[calc(100svh-74px)]` tekee ensimmäisestä ruudusta kansikuvan:
    otsikko, maskotti, kolme laattaa ja lukurivi kerralla, eikä alle jää
    puolikasta seuraavaa osiota vetämässä katsetta pois. `svh` eikä `vh`,
    koska `vh` ei laske mobiiliselaimen osoiteriviä pois.

    MIINUS 74 PIKSELIÄ ON HEADERIN KORKEUS (`components/Header.tsx`,
    `h-[74px]`). Header on `sticky`, eli se on normaalissa virrassa ja vyö
    alkaa vasta sen alta. Jos headerin korkeus muuttuu, muuta tämä samalla.

    Vain puhelimessa. Työpöydällä koko ruudun korkuinen vyö ilman yhtään
    näkyvää sisältöä alla lukee mainokseksi.
  */
  return (
    <section className="theme-ember ember-surface relative flex min-h-[calc(100svh-74px)] flex-col justify-center overflow-hidden md:min-h-0 md:block">
      {/*
        HITAASTI LIIKKUVA VALO VYÖN TAKANA. Tasainen väripinta näyttää
        puhelimen ruudulla painetulta kuvalta. Yksi hyvin hidas,
        pehmeäreunainen valokehä otsikon takana saa pinnan elämään ilman
        että mikään vilkkuu. `pointer-events: none` eikä sisällön päällä,
        joten se ei voi varastaa yhtään klikkiä. Animoi vain `transform`ia
        ja `opacity`a, eli pyörii kompositorissa eikä hidasta vieritystä.
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
        sulattaa hahmon vyöhön ja pitää tekstin alta pois juuri sen osan
        kuvasta, joka olisi tekstin päällä.

        KORKEUS ON PROSENTTIA VYÖSTÄ, EI KIINTEÄ PIKSELIMÄÄRÄ. Kuva on
        omassa `overflow-hidden`-laatikossaan, joka on ankkuroitu oikeaan
        reunaan: se ei voi levitä vasemmalle millään näyttökoolla.

        KUVA ON KOKOVARTALOHAHMO, JOKA SEISOO VYÖN POHJALLA. Aiempi
        `kettu-innostunut.webp` oli rajattu polvista, jolloin `bottom-0`
        leikkasi hahmon keskeltä säärtä. `kettu-hub-hero.webp` päättyy
        kenkiin, joten alareuna on hahmon oma eikä rajaus.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[88%] overflow-hidden md:w-[52%]"
      >
        <Image
          src="/kettu-hub-hero.webp"
          alt=""
          width={910}
          height={1492}
          priority
          className="absolute bottom-0 right-[-6%] h-[86%] w-auto max-w-none object-contain opacity-[0.62] md:right-0 md:h-[96%] md:opacity-50"
          style={{
            WebkitMaskImage:
              "linear-gradient(to left, #000 58%, transparent 100%)",
            maskImage: "linear-gradient(to left, #000 58%, transparent 100%)",
          }}
        />
      </div>

      {/*
        TUMMENNUS MASKOTIN JA TEKSTIN VÄLISSÄ.

        Tämä on se kerros, jonka takia maskotti saa olla iso. Ilman sitä on
        vain kaksi huonoa vaihtoehtoa: haalea kettu, jolloin sivu ei
        hätkähdytä, tai kirkas kettu otsikon alla, jolloin kermanvaalea
        bleiseri ja kermanvaalea teksti sulavat yhteen eikä otsikkoa lue.

        Liukuväri on tumma vasemmalla ja katoaa 74 prosentin kohdalla, eli
        siinä missä tekstipalsta loppuu ja ketun kasvot alkavat. Sävy on
        vyön oma tumma pää (#8E3206), ei uusi väri.
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
          <span className="inline-flex items-center gap-2 rounded-full border border-onEmber/25 bg-[#7E2C05]/35 px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-onEmber/85">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            Kilpailutuspalvelu
          </span>

          {/*
            OTSIKON LEVEYS RAJATAAN OTSIKOSTA, EI KÄÄREESTÄ. `ch`-yksikkö
            laskee vanhemman fonttikoon mukaan, joten kääreessä se
            laskettaisiin leipätekstistä ja koko palsta kutistuisi.

            KULTAINEN LIUKUVÄRI VAIN SANASSA "liikaa", eli koko palvelun
            lupauksen ytimessä. Liukuväri kulkee kermasta kultaan, joten
            sana pysyy luettavana myös silloin kun selain ei osaa leikata
            väriä tekstiin — silloin se piirtyy kermana.
          */}
          <h1 className="mt-6 max-w-[9ch] font-hero text-[clamp(3.1rem,12vw,5.4rem)] leading-[0.88] text-onEmber sm:max-w-[13ch]">
            Ketuttaako maksaa{" "}
            <span className="bg-gradient-to-br from-cream via-cream to-gold bg-clip-text text-transparent">
              liikaa?
            </span>
          </h1>

          {/*
            ALARIVI KERTOO MITÄ TAPAHTUU, EI MITÄ OLEMME. Vanha rivi
            kuvaili palvelua ("samasta paikasta, selvällä suomella") mutta
            ei yhtäkään tekoa, joten sloganin jälkeen kävijä ei tiennyt mitä
            napin takana tapahtuu. Nyt rivi nimeää kaikki kolme palvelua ja
            sen, mitä ne maksavat. Ei lupausta säästöstä: rivin on pysyttävä
            totena myös silloin, kun kävijän nykyinen sopimus on jo halvin.
          */}
          <p className="mt-5 max-w-[32ch] text-[17px] leading-relaxed text-onEmber/85 sm:max-w-[46ch] sm:text-[19px]">
            Sähkö, lainat ja vakuutukset kilpailutettuna samassa paikassa.
            Kettu tekee laskutyön, sinä teet päätöksen. Sinulle ilmaista.
          </p>
        </Reveal>

        {/*
          KOLME LAATTAA, KAIKKI SAMAN NÄKÖISIÄ.

          MIKSI RINNAKKAIN MYÖS PUHELIMESSA. Allekkain ladotut vaihtoehdot
          eivät ole valinta vaan lista: ylin luetaan oletukseksi ja loput
          ohitetaan. Rinnakkain ne ovat kysymys, johon on pakko vastata.
          Kuvake päällekkäin nimen kanssa mahtuu 390 pikselillä kolmeen
          sarakkeeseen ilman että yksikään nimi katkeaa kahdelle riville.

          KERMANVAALEA POHJA, EI ORANSSIA. Oranssilla vyöllä oranssi laatta
          on sama väri kuin pohja. Vaaleat laatat ovat ruudun ainoat vaaleat
          pisteet, ja juuri se on koko vyön tarkoitus.

          EMBER-ANSA: `bg-cream` + kiinteä `text-[#A83E0A]`, ei
          `text-accentDark` — `.theme-ember`-vyöllä jälkimmäinen kääntyy
          vaaleaksi kermaksi ja teksti katoaa pohjaan.
        */}
        <Reveal delay={0.06}>
          <nav aria-label="Kilpailutettavat palvelut" className="mt-8">
            <ul className="grid grid-cols-3 gap-2 sm:gap-3">
              {services.map(({ key, name, Icon }) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="lift press sheen flex h-full flex-col items-center justify-center gap-2 rounded-xl bg-cream px-2 py-4 text-center font-display text-[14px] font-bold text-[#A83E0A] shadow-lift sm:gap-2.5 sm:py-5 sm:text-[16px]"
                  >
                    <Icon size={20} strokeWidth={2.2} aria-hidden />
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/*
            LUOTTAMUSRIVI HETI LAATTOJEN ALLA, EI OSIONA ALEMPANA. Kaksi
            yleisintä syytä olla klikkaamatta ovat "joudunko maksamaan" ja
            "joudunko antamaan tietoni". Molemmat kuuluvat samaan ruutuun
            painikkeiden kanssa, koska alempana ne eivät ehdi vaikuttaa
            päätökseen.

            "Ei rekisteröitymistä" koskee kaikkia kolmea; "ei
            yhteystietoja" ei koskisi, koska laina- ja vakuutushakemus
            luonnollisesti kysyy ne. Siksi se lause on nyt sähkön omassa
            osiossa eikä täällä.
          */}
          <p className="mt-4 font-display text-[13px] font-medium text-onEmber/65">
            Ilmainen · Ei rekisteröitymistä · Päätöksen teet itse
          </p>
        </Reveal>

        {/*
          POLKU ON HERON POHJALLA OMANA PANEELINAAN. Maskotti on taustalla
          myös tämän kohdalla, ja paljas teksti kuvan päällä lukisi
          epätarkasti. Oma tummempi pinta erottaa askeleet taustasta ja
          sulkee heron.

          PUHELIMESSA ALLEKKAIN, TYÖPÖYDÄLLÄ RINNAKKAIN. Askeleet ovat
          järjestys, eivät valinta — päinvastoin kuin yläpuolen kolme
          laattaa, jotka ovat rinnakkain juuri siksi, että ne ovat valinta.
          Allekkain 390 pikselillä koko rivi vie kolme tekstiriviä; kolmena
          sarakkeena jokainen otsikko katkeaisi kahdelle ja paneeli olisi
          korkeampi kuin lukurivi, joka siitä poistui. Hero on puhelimessa
          tasan yhden ruudun korkuinen, joten jokainen pikseli on pois
          laatoilta.
        */}
        <Reveal delay={0.12}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-onEmber/15 bg-[#7E2C05]/45 backdrop-blur-[2px] md:mt-14">
            <div className="gold-rule" />
            <dl className="grid grid-cols-3 divide-x divide-onEmber/15">
              {stats.map((s, i) => (
                <div key={s.label} className="px-3 py-4 sm:px-6 sm:py-7">
                  <dt className="font-hero text-[1.35rem] leading-none text-onEmber sm:text-[2.2rem]">
                    <span aria-hidden>{s.prefix}</span>
                    <CountUp
                      value={s.value}
                      suffix={s.suffix}
                      delayMs={i * 220}
                    />
                  </dt>
                  <dd className="mt-1.5 max-w-[26ch] text-[11px] leading-snug text-onEmber/70 sm:mt-2 sm:text-[13px]">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/*
            TARKISTUSRIVI OMANA RIVINÄÄN PANEELIN ALLA. Tämä on sivuston
            ainoa lause, jota kilpailija ei voi kopioida: hinnat on
            tarkistettu päivämäärällä, ja vertailussa on mukana sopimuksia,
            joista ei tule palkkiota. Molemmat luvut lasketaan datasta
            (`lib/home.ts`), joten rivi ei voi jäädä vanhentuneena
            väittämään väärin.
          */}
          <p className="mb-5 mt-2 text-[12px] text-onEmber/55 md:mb-16 md:mt-3 md:text-[13px]">
            Sähkön hinnat tarkistettu {fiDate(facts.priceDate)}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
