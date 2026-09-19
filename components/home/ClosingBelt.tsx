import Image from "next/image";
import Reveal from "@/components/Reveal";
import ServiceCta from "@/components/home/ServiceCta";
import { getServices } from "@/lib/services";

/*
  LOPPUKEHOTUS — SIVUN VIIMEINEN VYÖ.

  MIKSI SAMA KEHOTUS TOISTUU: kävijä, joka on selannut tänne asti, ei
  palaa ylös etsimään nappia. Sivun viimeinen ruutu ennen alatunnistetta on
  halvin mahdollinen paikka toiselle klikille, ja ilman sitä koko selaus
  päättyy alatunnisteen linkkilistaan.

  MIKSI TÄSSÄ EI OLE UUTTA ARGUMENTTIA: kaikki perustelut on jo esitetty.
  Uusi väite tässä kohdassa pakottaisi lukemaan uudelleen juuri silloin,
  kun hän on jo päättänyt. Kehotus toistaa sloganin ja tarjoaa napit.

  KOLME NAPPIA, KAIKKI SAMAN NÄKÖISIÄ. Aiemmin tässä oli kaksi nappia,
  joista sähkö oli kermanvalkoinen ja lainat pelkkä ääriviiva. Se luettiin
  järjestykseksi eikä valinnaksi: kirkas nappi on oikea vastaus, himmeä on
  varavaihtoehto. Nyt napit rakennetaan samasta `getServices()`-taulukosta
  ja samasta `ServiceCta`-komponentista kuin heron laatat ja
  vertikaaliosioiden napit, joten ne eivät voi eriytyä.

  NAPIT OVAT ALLEKKAIN PUHELIMESSA. Rinnakkain kolme koko lauseen mittaista
  nappia ("Kilpailuta sähkö", "Vertaile lainoja", "Kilpailuta vakuutus") katkeaisi
  390 pikselillä eri kohdista, jolloin ne olisivat eri korkuisia eivätkä
  enää lukisi joukoksi. Tässä kohtaa sivua allekkain ladottu lista ei
  myöskään haittaa: kävijä on jo lukenut kaikkien kolmen osion sisällön,
  joten hän tietää kumpaa on tullut hakemaan.

  MIKSI TÄMÄ EI OLE `"use client"` VAIKKA NAPEISSA ON SEURANTA:
  `ServiceCta` on asiakaskomponentti, tämä vyö ei. Vain napit lähtevät
  selaimeen, ei koko osio kuvineen.

  KUVA ON NYT TAUSTALLA MYÖS TYÖPÖYDÄLLÄ, EIKÄ SE OLE LAISKUUTTA.

  Kettu oli aiemmin oikeassa palstassa täydellä kirkkaudella, ja teksti
  vasemmassa. Kun otsikko keskitettiin muun etusivun mukana, geometria ei
  enää toiminut: keskitetty sisältö levittäytyy koko leveydelle, ja 329
  pikselin levyinen kuva oikeassa reunassa osuu kolmen napin riviin.
  Vaihtoehdot olivat kapeammat napit (jolloin "Kilpailuta vakuutus" katkeaa
  kahdelle riville), kaksipalstainen vyö keskitetyn sivun lopussa (jolloin
  viimeinen osio alkaa eri kohdasta kuin kaikki muut) tai kuva taustalle.

  Taustalla se on myös johdonmukainen: sivun toinen oranssi vyö eli hero
  käyttää täsmälleen samaa ratkaisua, himmennettyä kettua ja säteittäistä
  tummennusta tekstin takana. Kaksi oranssia vyötä ovat sivun alku ja
  loppu, ja niiden kuuluu näyttää parilta.

  JOS KIRKAS KETTU HALUTAAN TAKAISIN, se on tehtävissä: silloin tämän vyön
  otsikko latoutuu vasemmalle ja kuva palaa oikeaan palstaan. Se on
  tietoinen vaihtokauppa keskityksen kanssa, ei tekninen este.
*/

export default function ClosingBelt() {
  const services = getServices();

  return (
    <section className="theme-ember ember-surface relative overflow-hidden">
      {/*
        KETTU ON KOKO VYÖN KOKOINEN KERROS, EI RUUDUKON SARAKE. Kun se ei
        enää ole palsta, se ei myöskään voi puskea sisältöä sivuun: kuva on
        omassa kerroksessaan (`z-0`), tummennus sen päällä (`z-[1]`) ja
        sisältö niiden yllä (`z-10`).

        `alt=""` JA `aria-hidden`: kuva ei enää kerro mitään, mitä teksti ei
        kerro. Himmennetty koristekuva, jolla on kuvaava alt-teksti, on
        ruudunlukijalle pelkkä ylimääräinen lause ennen otsikkoa.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <Image
          src="/kettu-muotokuva.webp"
          alt=""
          width={569}
          height={900}
          className="absolute bottom-0 right-[-8%] h-[86%] w-auto max-w-none object-contain opacity-[0.42] md:right-[2%] md:h-[96%] md:opacity-[0.34]"
          style={{
            maskImage: "linear-gradient(to left, #000 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to left, #000 55%, transparent 100%)",
          }}
        />
      </div>

      {/*
        SÄTEITTÄINEN TUMMENNUS, SAMA KUIN HEROSSA. Vaakasuora liukuväri
        tummentaisi vasemman reunan ja jättäisi keskitetyn otsikon
        oikean pään vaaleaksi, eli kontrasti vaihtelisi otsikon sisällä.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 86% at 50% 50%, #8E3206 0%, rgba(142,50,6,0.80) 44%, rgba(142,50,6,0.28) 72%, rgba(142,50,6,0) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1180px] px-4 py-16 sm:px-6 md:min-h-[430px] md:py-24">
        <Reveal>
          <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
            <h2 className="max-w-[16ch] font-hero text-[clamp(2.2rem,6.5vw,3.6rem)] leading-[0.98] text-onEmber">
              Anna Ketun kilpailuttaa.
            </h2>

            <p className="mt-5 max-w-[50ch] text-[17px] leading-relaxed text-onEmber/85">
              Valitse palvelu, vastaa muutamaan kysymykseen ja katso hinta.
              Päätöksen teet aina itse.
            </p>
          </div>
        </Reveal>

        {/*
          NAPIT RAJATAAN 44 REMIIN, EI OSION LEVEYTEEN. Kolme nappia 1180
          pikselin levyisenä rivinä on kolme lyhyttä sanaa ja paljon tyhjää
          kummallakin puolella: rivi lukee kolmeksi erilliseksi napiksi eikä
          valinnaksi kolmesta. Kermanappi on lisäksi aina `w-full`, joten
          kääre on ainoa paikka, jossa leveys rajataan.
        */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-9 grid max-w-[44rem] gap-3 sm:grid-cols-3">
            {services.map((service) => (
              <ServiceCta
                key={service.key}
                name={service.name}
                href={service.href}
                label={service.cta}
                external={service.external}
                partner={service.partner}
                placement={`etusivu_loppu_${service.key}`}
                variant="cream"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
