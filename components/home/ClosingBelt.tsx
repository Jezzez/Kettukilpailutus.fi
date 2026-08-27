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

  TYÖPÖYDÄLLÄ KUVA ANKKUROIDAAN VYÖN ALAREUNAAN ja korvat saavat nousta
  edellisen osion puolelle. Puhelimessa kuva on heron tapaan taustalla,
  himmennettynä ja sisällön takana, jotta tekstit ja painikkeet säilyvät
  helposti käytettävinä.
*/

export default function ClosingBelt() {
  const services = getServices();

  return (
    <section className="theme-ember ember-surface relative overflow-hidden md:overflow-visible">
      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-8 px-4 py-16 sm:px-6 md:min-h-[430px] md:grid-cols-[1.15fr_0.85fr] md:py-20">
        <Reveal className="relative z-10">
          <h2 className="max-w-[14ch] font-hero text-[clamp(2.2rem,6.5vw,3.6rem)] leading-[0.98] text-onEmber">
            Anna Ketun kilpailuttaa.
          </h2>

          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-onEmber/85">
            Valitse palvelu, vastaa muutamaan kysymykseen ja katso hinta.
            Päätöksen teet aina itse.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {services.map((service) => (
              <ServiceCta
                key={service.key}
                name={service.name}
                href={service.href}
                label={service.cta}
                external={service.external}
                placement={`etusivu_loppu_${service.key}`}
                variant="cream"
              />
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={0.07}
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden md:inset-y-auto md:bottom-0 md:left-auto md:right-[7%] md:z-20 md:h-[520px] md:w-[329px] md:overflow-visible"
        >
          <Image
            src="/kettu-muotokuva.webp"
            alt="Kettu tervehtii ja odottaa kilpailutuksen aloittamista"
            width={569}
            height={900}
            className="absolute bottom-0 right-[-6%] h-[86%] w-auto max-w-none object-contain opacity-[0.42] md:static md:h-full md:max-h-none md:opacity-100"
          />
        </Reveal>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(96deg, #8E3206 0%, rgba(142,50,6,0.86) 26%, rgba(142,50,6,0.42) 52%, rgba(142,50,6,0) 74%)",
          }}
        />
      </div>
    </section>
  );
}
