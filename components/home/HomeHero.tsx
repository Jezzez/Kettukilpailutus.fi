import Image from "next/image";
import Reveal from "@/components/Reveal";
import ServiceRow from "@/components/home/ServiceRow";
import TailSweep from "@/components/fox/TailSweep";
import { getServices } from "@/lib/services";

/*
  HERO — SIVUSTON ENSIMMÄINEN RUUTU.

  =====================================================================
  UUSITTU KOKONAAN 19.9.2026. MIKÄ MUUTTUI JA MIKSI.
  =====================================================================

  Jessen arvio vanhasta versiosta oli "tunkkanen". Se oli oikea sana, ja
  syy oli yksi yksittäinen kerros: koko vyön peittävä ruskea ellipsi
  (`radial-gradient(… #8E3206 …)`), joka oli lisätty siksi, että keskitetty
  kermanvaalea otsikko osui kermanvaalean bleiserin päälle eikä sitä
  lukenut. Tummennus ratkaisi luettavuuden mutta maksoi koko pinnan: se
  sekoitti brändioranssin ja ruskean yhdeksi sameaksi sävyksi, ja kettu jäi
  sen alle 38 prosentin peitolla haamuksi. Ensimmäinen ruutu näytti siis
  likaiselta eikä lämpimältä, ja maskotti — koko brändin erottuva tekijä —
  oli siinä tunnistamaton.

  RATKAISU EI OLLUT TUMMENNUKSEN SÄÄTÄMINEN VAAN SEN TARPEEN POISTAMINEN.
  Kun teksti ja maskotti eivät ole päällekkäin, mitään väliin laitettavaa
  kerrosta ei tarvita. Siksi sommittelu on nyt epäsymmetrinen: teksti
  vasemmalla, kettu omassa tilassaan oikealla. Leveällä ruudulla kettu on
  TÄYDELLÄ peitolla ensimmäistä kertaa, ja vyö on puhdasta brändioranssia.

  MITÄ "ABSTRAKTI" TARKOITTAA TÄSSÄ. Ei uusia värejä eikä kuvituskuvia.
  Se on geometriaa: samankeskiset kultaiset hiusviivaympyrät maskotin
  takana. Motiivi on sisällöllinen eikä koriste — se on signaali, joka
  leviää yhdestä pisteestä, ja tämä sivusto lähettää yhden kyselyn usealle
  yhtiölle. Ohut viiva isossa koossa on myös se ele, joka erottaa
  nykyaikaisen pinnan pehmeäreunaisesta liukuvärisumusta: sumu on sitä,
  mitä jokaisella vertailusivustolla jo on.

  =====================================================================
  MIKÄ EI MUUTTUNUT, VAIKKA SOMMITTELU MUUTTUI
  =====================================================================

  KOLME RIVIÄ OVAT YHTÄ LEVEÄT KUIN ENNEN. Vanha kommentti varoitti, että
  vasempaan palstaan siirretyt palvelurivit kutistuvat kapeiksi — niin kävi
  aiemmassa kaksipalstaisessa versiossa. Siksi palstajako alkaa vasta
  `lg`-koosta (1024 px), jolloin tekstipalstaan mahtuu sama `36rem` kuin
  keskitettynä. Sitä kapeammilla ruuduilla rivit ovat koko palstan levyiset
  kuten ennenkin. Rivit ovat heron ainoa toiminto, eikä niistä tingitä.

  RIVIT RAKENNETAAN YHÄ `getServices()`-taulukosta, eli kolme palvelua
  eivät voi eriytyä painoarvoltaan. Ks. `lib/services.ts`.

  YKSI KUVAELEMENTTI, EI KAHTA. Erilliset mobiili- ja työpöytäkuvat
  tarkoittaisivat kahta `priority`-kuvaa, joista selain lataa molemmat ja
  näyttää toisen. Sama `<Image>` saa eri sijainnin, koon ja peiton
  luokilla, ja maski kytketään pois `lg`-koossa arbitrary-luokalla.
*/

export default function HomeHero() {
  const services = getServices();

  /*
    HERO ON PUHELIMESSA KOKO RUUDUN KORKUINEN.

    `min-h-[calc(100svh-var(--header-h))]` tekee ensimmäisestä ruudusta
    kansikuvan: otsikko, kettu ja kolme riviä kerralla, eikä alle jää
    puolikasta seuraavaa osiota vetämässä katsetta pois. `svh` eikä `vh`,
    koska `vh` ei laske mobiiliselaimen osoiteriviä pois.

    MIINUS HEADERIN KORKEUS. Header on `sticky`, eli se on normaalissa
    virrassa ja vyö alkaa vasta sen alta. Luku tulee `--header-h`
    -muuttujasta (app/globals.css), ei käsin kirjoitettuna.

    Vain puhelimessa. Työpöydällä koko ruudun korkuinen vyö ilman yhtään
    näkyvää sisältöä alla lukee mainokseksi.
  */
  return (
    <section className="theme-ember ember-surface relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden md:block md:min-h-0">
      {/*
        KERROS 1 — HIDAS VALO.

        Tasainen väripinta näyttää painetulta kuvalta. Yksi hyvin hidas,
        pehmeäreunainen valokehä saa pinnan elämään ilman että mikään
        vilkkuu. Animoi vain `transform`ia ja `opacity`a, eli pyörii
        kompositorissa eikä hidasta vieritystä. `pointer-events: none`,
        joten se ei voi varastaa yhtään klikkiä.

        KEHÄ SIIRTYI VASEMMALLE, koska otsikkokin siirtyi. Keskellä se
        valaisi kohtaa, jossa ei enää ole tekstiä.
      */}
      <div
        aria-hidden
        className="aurora absolute -top-[26%] left-[6%] h-[92vw] w-[92vw] max-h-[680px] max-w-[680px] lg:left-[-8%]"
      />

      {/*
        TÄSSÄ OLI ABSTRAKTI MOTIIVI: VIISI SAMANKESKISTÄ KULTAKEHÄÄ
        maskotin keskipisteestä. Jesse poisti ne 19.9.2026.

        Jos joskus palautat jonkin vastaavan, muista se sääntö jonka takia
        kehät ylipäätään olivat viivaa eivätkä pintaa: mikään vyölle
        lisätty PINTA ei saa peittää oranssia, koska juuri se teki
        edellisestä herosta sameahkon. Viiva ei peitä, liukuväri peittää.
      */}

      {/*
        KERROS 2 — MASKOTTI.

        LEVEÄLLÄ RUUDULLA TÄYSI PEITTO. Tämä on muutoksen ydin. Kun
        tekstipalsta on rajattu `36rem`:iin ja kettu asuu oikeassa
        kolmanneksessa, mikään ei ole päällekkäin, joten mitään
        tummennusta ei tarvita eikä hahmoa tarvitse haalentaa. Maskotti on
        `CLAUDE.md`:n mukaan brändin ydin, ja tähän asti se on ollut
        ensimmäisessä ruudussa 38 prosentin haamu.

        KAPEALLA RUUDULLA HAHMO ON YHÄ TAUSTAA. Siellä teksti ja kettu
        eivät mahdu vierekkäin, joten hahmo on oikeassa reunassa matalalla
        peitolla ja vasemmalle häipyvällä maskilla. Maski eikä pelkkä
        `opacity`: pelkkä peitto jättää kuvalle terävän pystyreunan siihen
        mihin kuva loppuu, ja terävä reuna keskellä oranssia lukee
        virheeksi.

        MASKI KYTKETÄÄN POIS `lg`-KOOSSA. Se tehdään arbitrary-luokalla
        eikä `style`-attribuutilla, koska inline-tyyliä ei voi sitoa
        mediakyselyyn — ja täydellä peitolla vasemmalle häipyvä reuna
        näyttäisi siltä, että kuva on latautunut puolittain.

        KUVA ON KOKOVARTALOHAHMO, JOKA SEISOO VYÖN POHJALLA.
        `kettu-hub-hero.webp` (910 × 1492) päättyy kenkiin, joten alareuna
        on hahmon oma eikä rajaus. Siksi se voidaan ankkuroida suoraan
        vyön alalaitaan ilman että mikään näyttää katkaistulta.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[82%] overflow-hidden lg:inset-y-auto lg:bottom-0 lg:right-[3%] lg:w-[31%] lg:max-w-[400px] lg:overflow-visible"
      >
        <Image
          src="/kettu-hub-hero.webp"
          alt=""
          width={910}
          height={1492}
          priority
          className="absolute bottom-0 right-[-8%] h-[84%] w-auto max-w-none object-contain opacity-[0.30] [-webkit-mask-image:linear-gradient(to_left,#000_58%,transparent_100%)] [mask-image:linear-gradient(to_left,#000_58%,transparent_100%)] lg:relative lg:right-auto lg:h-auto lg:w-full lg:opacity-100 lg:[-webkit-mask-image:none] lg:[mask-image:none]"
        />
      </div>

      {/*
        KERROS 3 — LUETTAVUUSVERHO, VAIN KAPEALLA RUUDULLA.

        Tämä on se kerros, joka teki vanhasta herosta tunkkaisen, ja siksi
        se on nyt kolmella tavalla rajattu: se on olemassa vain alle
        `lg`-koon (missä hahmo ja teksti ovat päällekkäin), se kulkee
        vasemmalta oikealle (ei koko pinnan yli), ja se haipuu kokonaan
        läpinäkyväksi jo 78 prosentin kohdalla. Vyön oikea reuna jää siis
        puhtaaksi oranssiksi.

        Sävy on vyön oma tumma pää (#8E3206), ei uusi väri.

        ÄLÄ PALAUTA TÄTÄ `lg`-KOKOON. Siellä sitä ei tarvita mihinkään, ja
        juuri siellä se söi eniten: leveä ruutu on iso pinta-ala, ja koko
        pinnan yli vedetty ruskea on iso määrä ruskeaa.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] lg:hidden"
        style={{
          backgroundImage:
            "linear-gradient(100deg, #8E3206 0%, rgba(142,50,6,0.86) 34%, rgba(142,50,6,0.42) 60%, rgba(142,50,6,0) 78%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:py-24">
        {/*
          TEKSTIPALSTA ON VASEMMALLA JA VASEMPAAN TASATTU.

          Keskitys oli aiemmin perusteltu sillä, että palvelurivit ovat
          heron ainoa toiminto ja ne kuuluvat sinne, mihin katse laskeutuu
          ilman etsimistä. Se pitää yhä paikkansa — mutta vasemmalle
          tasattu pino ei ole vaikeampi löytää, koska lukeminen alkaa
          joka tapauksessa vasemmasta reunasta. Keskityksen todellinen
          hinta oli se, että se pakotti tekstin maskotin päälle ja
          maskotin tummennuksen alle.

          `max-w-[36rem]` on sama luku kuin palveluriveillä ennen tätä
          muutosta, eli yksikään rivi ei kaventunut.
        */}
        <div className="max-w-[36rem]">
          <Reveal>
            {/*
              PIKKUOTSIKKO KERTOO ENSIMMÄISELLÄ SEKUNNILLA MIKÄ SIVUSTO
              TÄMÄ ON. "Kettu on sinun puolellasi" on slogan, ei toimiala:
              sen perusteella kävijä ei tiedä tulleensa
              kilpailutuspalveluun. Hakutuloksesta saapuva näkee tämän
              ennen kuin lukee yhtään lausetta.
            */}
           

            {/*
              OTSIKON LEVEYS RAJATAAN OTSIKOSSA, EI KÄÄREESSÄ. `ch`-yksikkö
              laskee vanhemman fonttikoon mukaan, joten kääreessä se
              laskettaisiin leipätekstistä ja koko palsta kutistuisi.

              KULTAINEN LIUKUVÄRI VAIN LOPPUOSASSA, eli koko palvelun
              lupauksen ytimessä. Liukuväri kulkee kermasta kultaan, joten
              sana pysyy luettavana myös silloin kun selain ei osaa leikata
              väriä tekstiin: silloin se piirtyy kermana.
            */}
            <h1 className="mt-6 max-w-[11ch] font-hero text-[clamp(3rem,11vw,5.2rem)] leading-[0.9] text-onEmber sm:max-w-[13ch]">
              Kettu on{" "}
              <span className="bg-gradient-to-br from-cream via-cream to-gold bg-clip-text text-transparent">
                sinun puolellasi.
              </span>
            </h1>

            {/*
              LYHYT KULTAVIIVA OTSIKON JA JOHDANTOLAUSEEN VÄLISSÄ.

              Ilman sitä otsikko ja johdantolause ovat kaksi tekstilohkoa
              peräkkäin, ja silmä lukee ne yhdeksi pitkäksi kappaleeksi,
              jonka ensimmäinen rivi sattuu olemaan iso. Viiva sanoo
              "otsikko loppui tähän" ilman yhtään sanaa.

              Se on myös sivuston oma ele eikä lainattu: sama kultainen
              hiusviiva merkitsee paneelien yläreunan kohdissa, joissa
              lukee faktaa.
            */}
            <span aria-hidden className="mt-6 block h-[3px] w-12 rounded-full bg-gold" />

            {/*
              ALARIVI KERTOO MITÄ TAPAHTUU, EI MITÄ OLEMME.

              Rivillä luki aiemmin: "Olemme neuvotelleet hinnat puolestasi
              etukäteen, joten saat kauttamme suuren ostoyhteenliittymän
              tuoman edun." Lause on peräisin kilpailuttaja.fi:ltä, jossa
              se on totta: sen takana on sähkönmyynnin välittäjä, joka
              neuvottelee sopimukset. Kettukilpailutus lukee yhtiöiden
              julkisia hinnastoja `data/electricity.json`:iin eikä
              neuvottele mitään, joten sama lause on täällä väärä.

              Sen hinta ei olisi maineriski vaan suora rahariski: väite
              paremmasta hinnasta "meidän kauttamme" on markkinointiväite,
              joka on KSL 2 luvun mukaan kyettävä näyttämään toteen, ja
              affiliate-ohjelma katkaisee kumppanuuden juuri tällaisesta.
            */}
            <p className="mt-5 max-w-[34ch] text-[17px] leading-relaxed text-onEmber/85 sm:max-w-[52ch] sm:text-[19px]">
              Sähkösopimukset, lainat ja vakuutukset yhdestä paikasta. Näet
              sähkön vuosihinnan euroina omalla kulutuksellasi, samaan hintaan
              kuin yhtiön omalta sivulta.
            </p>
          </Reveal>

          {/*
            KOLME RIVIÄ ALLEKKAIN, EI KOLMEA LAATTAA RINNAKKAIN.

            MIKSI ALLEKKAIN. Sähköä, lainaa ja vakuutusta hakeva kävijä
            tietää tullessaan kumman hän haluaa, eikä hän valitse niiden
            väliltä vaan etsii omansa. Etsimiseen lista on oikea muoto, ja
            täysleveällä rivillä on tila sanoa mitä klikistä seuraa.
            Rinnakkaisuuden hinta näkyi ruudulla: 390 pikselillä kolme
            saraketta on noin 112 px kukin, joten laattaan mahtui kuvake ja
            yksi substantiivi.

            VAALEA POHJA, EI ORANSSIA. Oranssilla vyöllä oranssi rivi on
            sama väri kuin pohja. Vaaleat rivit ovat ruudun ainoat vaaleat
            pisteet, ja juuri se on koko vyön tarkoitus. Sävyjen
            kääntyminen hoidetaan `theme-light`-kääreellä `ServiceRow`:n
            sisällä.
          */}
          <Reveal delay={0.06}>
            <nav aria-label="Kilpailutettavat palvelut" className="mt-8 sm:mt-9">
              <ul className="flex flex-col gap-3">
                {services.map((service) => {
                  const { Icon } = service;
                  return (
                    <li key={service.key}>
                      <ServiceRow
                        name={service.name}
                        href={service.href}
                        label={service.cta}
                        note={service.note}
                        external={service.external}
                        partner={service.partner}
                        placement={`etusivu_hero_${service.key}`}
                        icon={<Icon size={20} strokeWidth={2.2} aria-hidden />}
                      />
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/*
              LUOTTAMUSRIVI HETI RIVIEN ALLA, EI OSIONA ALEMPANA. Kaksi
              yleisintä syytä olla klikkaamatta ovat "joudunko maksamaan"
              ja "joudunko antamaan tietoni". Molemmat kuuluvat samaan
              ruutuun painikkeiden kanssa, koska alempana ne eivät ehdi
              vaikuttaa päätökseen.

              "Ei rekisteröitymistä" koskee kaikkia kolmea; "ei
              yhteystietoja" ei koskisi, koska laina- ja vakuutushakemus
              luonnollisesti kysyy ne. Siksi se lause on sähkön omassa
              osiossa eikä täällä.
            */}
            <p className="mt-5 font-display text-[13px] font-medium text-onEmber/65">
              Ilmainen · Ei rekisteröitymistä · Päätöksen teet itse
            </p>
          </Reveal>
        </div>
      </div>

      {/*
        VYÖ PÄÄTTYY HÄNNÄNVETOON, EI SUORAAN REUNAAN.

        Etusivun hero oli sivuston ainoa oranssi vyö, joka loppui terävään
        vaakaviivaan: sähkösivun hero, askelosio ja 404 kaikki kaartuvat
        seuraavaan vyöhykkeeseen. Suora raja luki liitokseksi kahden eri
        sivun välillä juuri siinä kohdassa, jossa kävijä päättää jatkaako
        hän vierittämistä.

        `fill` on SEURAAVAN vyöhykkeen väri: alla on `StatStrip`, joka on
        `bg-paper`. Jos vaihdat osioiden järjestystä, vaihda tämä väri.
      */}
      <TailSweep fill="rgb(var(--c-paper))" height={56} />
    </section>
  );
}
