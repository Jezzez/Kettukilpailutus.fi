import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import ServiceCta from "@/components/home/ServiceCta";
import Eyebrow from "@/components/home/Eyebrow";
import { ENERGY_COMPARE } from "@/lib/nav";
import { euro, fiDate, type HomeFacts } from "@/lib/home";

/*
  MIKSI KILPAILUTTAMINEN KANNATTAA — YKSI KORTTI, EI KOLMEA.

  MIKÄ AUKKO TÄMÄ TÄYTTÄÄ. Etusivu kertoo muualla, mitä me teemme
  (palveluosio) ja miksi lukuihin voi luottaa (läpinäkyvyysosio). Tämä
  vastaa kysymykseen, joka on ajallisesti ensimmäinen: miksi kävijän
  kannattaisi koskea sopimukseensa tänään, kun se on toiminut moitteetta
  kolme vuotta. Ilman vastausta luottamusosio vakuuttaa ihmisen, joka ei ole
  päättänyt tehdä mitään, ja silloin hän poistuu luottavaisena.

  =====================================================================
  MIKSI KOLME KORTTIA YHDISTETTIIN YHDEKSI
  =====================================================================

  Tässä oli kolme valkoista korttia, joissa kussakin oli kuvake, otsikko ja
  viisi tai kuusi riviä tekstiä. Yhteensä noin 900 merkkiä perustelua
  kohdassa, jossa kävijä on ollut sivulla alle kymmenen sekuntia. Pitkä
  perustelu ei ole vahvempi perustelu: se on perustelu, jota ei lueta, ja
  lukematta jäänyt argumentti ei tuota klikkiä.

  Nyt sama asia on kaksi lyhyttä kappaletta ja neljä tarkistettavaa riviä.
  Rakenne on kilpailuttaja.fi:n vastaavasta osiosta: yksi täytetty
  pyöristetty kortti, vasemmalle ladottu otsikko, lyhyttä leipätekstiä,
  lihavoitu johdatusrivi ja siitä alkava rasti-lista.

  ORANSSI KORTTI VAALEALLA PINNALLA ON TIETOINEN POIKKEUS. DESIGN.md sanoo,
  että rytmin tekevät täysleveät oranssit vyöt, eikä tämä ole vyö. Vaihtoehto
  olisi ollut tehdä tästä kolmas täysleveä vyö, mutta se osuisi liian lähelle
  heroa (hero, lukurivi, tämä), ja kaksi oranssia pintaa kahden osion välillä
  syö heron vaikutuksen. Kortti pitää värin mutta jättää vyöt heron ja
  loppukehotuksen omaksi pariksi. Uutta väriä ei tule: pinta on sama
  `.ember-surface` kuin vöissä.

  =====================================================================
  JOKAINEN VÄITE ON TODENNETTAVISSA
  =====================================================================

  Tämä on osio, johon vertailusivut tyypillisesti kirjoittavat "suomalaiset
  maksavat sähköstä vuosittain liikaa miljoonia euroja". Sellaista lukua ei
  ole tässä, koska meillä ei ole sille lähdettä. Sen sijaan:

  1. Hintaero lasketaan samoilla funktioilla kuin vertailusivun hinnat
     (`lib/home.ts`).
  2. Tarkistuspäivä on `PRICE_DATE`, ei käsin kirjoitettu kuukausi.
  3. Kampanjaetuja koskeva väite on ehtotason tosiasia, ei luku: etu
     myönnetään uudelle sopimukselle. Aiemmin tässä oli laskettu luku
     (`facts.campaignCount`), ja se voi palata, jos osio joskus palautuu
     sähkökohtaiseksi.

  =====================================================================
  TEKSTI YLEISTETTIIN KOSKEMAAN KAIKKIA KOLMEA PALVELUA (19.9.2026)
  =====================================================================

  Jessen pyyntö: osio puhui pelkästä sähköstä, vaikka se on sivun kohta,
  jossa aikomus syntyy, ja sivu tarjoaa kolmea palvelua. Nyt kaksi
  ensimmäistä lausetta ja kaksi ensimmäistä rastiriviä koskevat kaikkia
  kolmea, ja sähkö on mukana todisteena eikä aiheena.

  MITÄ SE MAKSOI, JOTTA TÄTÄ EI TEHDÄ VAHINGOSSA UUDELLEEN. Tässä oli
  suora lakiviite (sähkömarkkinalaki 93 § 4 mom.), joka oli
  tarkistettavissa Finlexistä ja joka oli osion ainoa ulkopuolinen lähde.
  Se ei yleisty, koska se koskee vain sähköä: lainan ja vakuutuksen
  hinnanmuutos tulee sopimusehdoista, ei samasta pykälästä. Viite on
  edelleen sähkövertailussa ja oppaissa, eli se ei kadonnut sivustolta.
  Yleinen teksti on siis lähdeviitteen osalta heikompi kuin edeltäjänsä,
  ja se on tietoinen vaihtokauppa laajemman puhuttelun puolesta.

  MITÄ TÄHÄN EI SAA LISÄTÄ: lainan tai vakuutuksen euromäärää. Lainoista
  mikä tahansa kustannusta kuvaava luku laukaisee kuluttajansuojalain 7
  luvun vaatimuksen todellisesta vuosikorosta ja edustavasta esimerkistä
  (ks. lib/loans.ts), eikä vakuutuksista ole yhtään tarkistettua hintaa.
  Siksi viimeinen lause sanoo suoraan, että ero näkyy vasta tarjouksesta.

  NAPPI VIE EDELLEEN SÄHKÖÖN, VAIKKA TEKSTI ON YLEINEN. Yleinen nappi
  ("katso palvelut") veisi sivun osioon eikä kohteeseen, eli lisäisi yhden
  klikin matkalle palkkioon. Sähkö on ainoa palvelu, jossa kävijä saa
  tuloksen antamatta mitään, joten se on paras ensimmäinen askel myös
  sille, joka tuli lainan takia. Kolmen palvelun valikko on heti seuraavana
  osiona (`Services`).

  Väite, jota ei voi näyttää toteen, on affiliate-kumppanille
  compliance-riski ja kuluttaja-asiamiehen valvonnassa perusteeton
  markkinointiväite. Tarkistettava väite on myös vahvempi, koska lukija voi
  mennä katsomaan.
*/

export default function WhyCompare({ facts }: { facts: HomeFacts }) {
  /*
    SUURIN ERO HAETAAN RIVEISTÄ, EI OLETETA JÄRJESTYSTÄ. `facts.spreads`
    latoutuu `DWELLINGS`-taulukon järjestyksessä, ei suuruusjärjestyksessä,
    joten `spreads[0]` osoittaisi tänään kerrostaloon ja huomenna mihin
    tahansa, jos asumismuotoja lisätään. Kulutusluku on lauseessa mukana,
    joten väärä rivi tarkoittaisi väärää väitettä.
  */
  const top =
    facts.spreads.find((r) => r.spread === facts.maxSpread) ?? facts.spreads[0];

  /*
    NELJÄ RIVIÄ, JOKAINEN YHDEN LAUSEEN MITTAINEN. Rasti-listan tehtävä on
    tulla luetuksi kokonaan, ja kahdelle riville kiertyvä kohta katkaisee
    silmäilyn. Jos näihin on lisättävä viides asia, jokin näistä poistuu.
  */
  const points = [
    "Vertailu on maksutonta, eikä yksikään kilpailutus sido sinua mihinkään.",
    "Kampanjaedut koskevat uutta sopimusta, eli nykyinen sopimuksesi ei saa niitä itsestään.",
    `Sähkön hinnat laskemme itse ja tarkistamme ne yhtiöiden omista hinnastoista, viimeksi ${fiDate(facts.priceDate)}.`,
    "Jos nykyinen sopimuksesi on jo halvempi, Kettu sanoo sen suoraan.",
  ];

  return (
    <section className="theme-light bg-mist py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          {/*
            `theme-ember` KÄÄNTÄÄ TOKENIT KORTIN SISÄLLÄ. Ilman sitä
            `text-onEmber` ja kermanappi eivät tiedä olevansa oranssin
            päällä. `overflow-hidden` on pakollinen: `.ember-surface::after`
            on `inset-0`-kerros, ja ilman leikkausta sen kohina piirtyisi
            pyöristettyjen kulmien yli.
          */}
          <div className="theme-ember ember-surface relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-16">
            <div className="relative z-10 grid gap-10 md:grid-cols-2 md:gap-14">
              {/*
                VASEN PALSTA: OTSIKKO JA PERUSTELU. Vasemmalle ladottu, ei
                keskitetty. Keskitys on etusivun osio-otsikoiden tapa
                (`SectionHead`), mutta tämä kortti ei ole osio vaan yksi lohko
                osion sisällä, ja kaksipalstaisessa lohkossa keskitetty
                vasen palsta osuisi eri kohtaan kuin oikea lista.
              */}
              <div>
                <Eyebrow onEmber>Miksi kilpailuttaa</Eyebrow>

                <h2 className="mt-4 max-w-[20ch] font-hero text-[clamp(1.9rem,5vw,2.8rem)] leading-[1.02] text-onEmber">
                  Sopimus ei parane odottamalla.
                </h2>

                <p className="mt-5 text-[16px] leading-relaxed text-onEmber/85">
                  Sähkö, laina ja vakuutus ovat kaikki sopimuksia, joiden hinta
                  elää. Ilmoitus muutoksesta tulee laskun mukana, ja laskusta
                  luetaan loppusumma. Kampanjaedut ja uusien asiakkaiden hinnat
                  eivät koskaan siirry vanhaan sopimukseen itsestään. Sopimus,
                  joka oli halpa kolme vuotta sitten, ei ole enää sama sopimus.
                </p>

                {/*
                  ASUMISMUODON NIMEÄ EI TAIVUTETA. `top.label` on tänään
                  "Sähkölämmitys", ja merkkijonoon liimattu pääte tuottaisi
                  siitä "sähkölämmitysssa". Kulutusluku kertoo saman asian
                  tarkemmin ja kestää sen, että asumismuotoja lisätään.
                */}
                <p className="mt-4 text-[16px] leading-relaxed text-onEmber/85">
                  Sähkössä ero on mitattu: kodissa, joka kuluttaa{" "}
                  {top.kwh.toLocaleString("fi-FI")} kWh vuodessa, halvimman ja
                  kalleimman sopimuksen ero on ensimmäisenä vuonna{" "}
                  <strong className="font-semibold text-onEmber">
                    {euro(top.spread)}
                  </strong>
                  . Kerrostaloasunnossa ero on pienempi, mutta se on silti
                  rahaa ilman vastinetta. Lainassa ja vakuutuksessa ero
                  riippuu sinusta, joten sen näkee vasta tarjouksesta.
                </p>
              </div>

              {/*
                OIKEA PALSTA: LISTA JA NAPPI. Lista on peruste, nappi on sen
                seuraus, ja ne ovat samassa palstassa, jotta viimeinen
                luettu rivi ja nappi ovat vierekkäin. Vasemmassa palstassa
                nappi olisi tekstin alla ja lista sen oikealla puolella, eli
                nappi tulisi vastaan ennen kuin perusteet on luettu.
              */}
              <div className="md:pt-11">
                <p className="font-display text-[15px] font-bold text-onEmber">
                  Kettu tekee kilpailutuksesta viiden minuutin asian:
                </p>

                <ul className="mt-5 space-y-3.5">
                  {points.map((p) => (
                    <li key={p} className="flex gap-3">
                      {/*
                        RASTI OMASSA KEHÄSSÄÄN, KUTEN REFERENSSISSÄ. Pelkkä
                        rasti ilman kehää on sama paino kuin luetelmapiste;
                        kehä tekee siitä merkin. Kehä on kermaa 18 prosentin
                        peitolla, eli se on oranssin oma vaalea pää eikä uusi
                        väri.
                      */}
                      <span
                        aria-hidden
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cream/20 text-onEmber"
                      >
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span className="text-[15px] leading-relaxed text-onEmber/90">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>

                {/*
                  KERMANAPPI, EI ORANSSIA. Oranssi nappi oranssilla kortilla
                  on sama väri kuin pohja. `ServiceCta`:n `cream`-variantti
                  on sama nappi kuin loppukehotuksessa, eli sivustolla on
                  yksi kermanappi eikä kahta erikseen kirjoitettua.

                  `name` JA `placement` MENEVÄT GA4:EEN. Tämä on sivun
                  ylimmäinen sähkönappi heron jälkeen, joten sen osuus
                  kertoo, syntyykö aikomus tässä osiossa vai herossa.
                */}
                <div className="mt-8 max-w-[22rem]">
                  <ServiceCta
                    name="Sähkö"
                    href={ENERGY_COMPARE}
                    label="Laske oma hintasi"
                    placement="etusivu_miksi_sahko"
                    variant="cream"
                  />
                  <p className="mt-3 text-center text-[13px] text-onEmber/70">
                    Ilmaista, eikä yhteystietoja kysytä.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
