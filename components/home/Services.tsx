import Reveal from "@/components/Reveal";
import SectionHead from "@/components/home/SectionHead";
import ServiceCta from "@/components/home/ServiceCta";
import { getServices } from "@/lib/services";

/*
  KILPAILUTA, VERTAA JA VALITSE — YKSI OSIO KOLMELLE PALVELULLE.

  =====================================================================
  MITÄ TÄMÄ KORVASI JA MIKSI
  =====================================================================

  Tässä oli kolme täyskorkeaa osiota (`Verticals.tsx` +
  `VerticalSection.tsx`), joissa kussakin oli: kuvakelaatta, pikkuotsikko,
  iso otsikko, johdantolause, kumppanirivi, valkoinen paneeli kultaisella
  hiusviivalla, paneelin versaaliotsikko, kolme riviä sisältöä, alaviite,
  nappi ja napin alle vielä rajauslause. Kolmetoista elementtiä kerrottuna
  kolmella, eli noin kolme ruudunmittaa pelkkää palveluesittelyä.

  Rakenne oli itsessään oikea päätös: se pakotti kolme palvelua
  tasavertaisiksi, mikä oli aito ongelma. Mutta se ratkaisi tasavertaisuuden
  antamalla jokaiselle palvelulle kaiken sen sijaan, että olisi antanut
  jokaiselle vähän. Lopputulos oli sivu, jota ei jaksa lukea, ja lukematta
  jäänyt perustelu ei vaikuta päätökseen. Se on suoraan tuotosta pois.

  Nyt yksi osio, ja siinä per palvelu kolme asiaa: otsikko, kaksi riviä
  tekstiä ja yksi nappi. Sama rakenne on kilpailuttaja.fi:n vastaavassa
  osiossa, ja se on siellä toimivampi samasta syystä: kävijä, joka tietää
  hakevansa sähköä, näkee kolmen palvelun valikon yhdellä silmäyksellä eikä
  joudu selaamaan kahden muun palvelun paneelien läpi.

  MIHIN PANEELIEN SISÄLTÖ MENI:
  - Sähkön hintaero (`SpreadBar`-palkit) → `WhyCompare`, jossa se on
    argumentti eikä palveluesittely. Luku on sivun kovin myyntiargumentti,
    joten se ei kadonnut, se siirtyi ylemmäs.
  - Lainan ja vakuutuksen kolmen askeleen listat → `HowItWorks`, yksi
    kolmen askeleen osio koko sivustolle.
  - Alaviitteet ("Kettu ei vertaile vakuutuksia", spot-oletus, KSL 7 luku)
    → UKK ja vertailusivu, eli sinne missä ne luetaan silloin kun ne
    kysytään.

  KUMPPANIRIVI POISTETTIIN TÄSTÄ OSIOSTA (19.9.2026). Tässä oli joka
  palvelun kohdalla kultapisteellä merkitty rivi ("Kilpailutuksen tekee
  Sortter.", "Tarjouksen antaa POP Vakuutus."). Jesse pyysi poistamaan
  kumppanien nimet laina- ja vakuutuskohdista, ja `lib/services.ts`:n
  `handledBy` on nyt neutraali `note`, jota tämä osio ei näytä lainkaan.

  MIKÄ SIITÄ SEURAA. Kettu laskee näistä kolmesta vain yhden itse. Kun sitä
  ei sanota täällä, ainoa paikka etusivulla, jossa rajaus sanotaan, on
  `components/home/TrustBlock.tsx` kohta 03 ("vakuutuksia emme vertaile").
  SITÄ KOHTAA EI SAA POISTAA:
  ilman sitä nappi "Kilpailuta vakuutus" lupaa vertailun, jota ei ole, ja se
  on sekä kuluttajansuojalain 2 luvun harhaanjohtava markkinointiväite että
  ensimmäinen asia, jonka affiliate-ohjelman compliance-tarkastus huomaa.
  Perustelut kokonaisuudessaan: `lib/services.ts` yläkommentti.

  MITÄ TÄSSÄ EI OLE: yhtään lainalukua eikä vakuutushintaa. Kuluttajansuojalain
  7 luku vaatii todellisen vuosikoron ja edustavan esimerkin heti, kun
  mainonnassa esiintyy mikä tahansa lainan kustannusta kuvaava luku, eikä sitä
  voi antaa oikein, koska tarjous on hakijakohtainen (ks. lib/loans.ts).
  Vakuutuksista meillä ei ole yhtään tarkistettua hintaa.

  JÄRJESTYS JA OLEMASSAOLO TULEVAT `getServices()`:STÄ. Tämä tiedosto ei
  päätä, mitkä palvelut näkyvät: jos `FEATURES.loans` sammutetaan, lainat
  katoavat itsestään myös heron riveistä, alatunnisteesta ja
  loppukehotuksesta.
*/

export default function Services() {
  const services = getServices();

  return (
    <section id="palvelut" className="theme-light bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <SectionHead
          eyebrow="Kolme palvelua"
          title="Kilpailuta, vertaa ja valitse."
          lead="Valitse mitä haluat kilpailuttaa. Jokainen on maksuton, eikä yksikään sido sinua mihinkään."
        />

        {/*
          KOLME SARAKETTA TYÖPÖYDÄLLÄ, PINO PUHELIMESSA.

          MIKSI SARAKKEET. Kolme allekkain ladottua lohkoa on kolme
          ruudunmittaa, eli sama vika pienempänä kuin siinä mitä tämä
          korvasi. Rinnakkain koko valikko on yhdessä silmäyksessä, ja juuri
          sitä osio yrittää olla.

          HIUSVIIVA EIKÄ KORTTIA. Kortti tarkoittaisi kolme laatikkoa
          peräkkäin, ja ne olisivat sivun kolmas laatikkorivi (`WhyCompare`
          ja `GuideRail` ovat jo kortteja). Yläviiva ja kuvake riittävät
          erottamaan sarakkeet, ja ne pitävät osion kevyempänä kuin
          naapurinsa. Sama ele on `TrustBlock`issa.

          `items-start` JA `mt-auto`: nappi on joka sarakkeessa samalla
          korkeudella vaikka johdantolauseet ovat eri mittaisia. Kolme eri
          korkeudella olevaa nappia lukee kolmeksi eri tärkeäksi asiaksi.
        */}
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {services.map((service, i) => {
            const { Icon } = service;
            return (
              <Reveal key={service.key} delay={i * 0.06} className="h-full">
                <li className="flex h-full flex-col border-t border-lineDark/60 pt-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-peach text-accentDark">
                    <Icon size={20} strokeWidth={2.2} aria-hidden />
                  </span>

                  <h3 className="mt-4 font-hero text-[1.5rem] leading-tight">
                    {service.name}
                  </h3>

                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink/70">
                    {service.lead}
                  </p>

                  <div className="mt-auto pt-6">
                    <ServiceCta
                      name={service.name}
                      href={service.href}
                      label={service.cta}
                      external={service.external}
                      partner={service.partner}
                      placement={`etusivu_${service.key}`}
                    />
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
