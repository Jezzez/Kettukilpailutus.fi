import type { ReactNode } from "react";
import SpreadBar from "@/components/home/SpreadBar";
import VerticalSection, {
  PanelList,
  StepRow,
} from "@/components/home/VerticalSection";
import { getServices } from "@/lib/services";
import { LOAN_STEPS } from "@/lib/loans";
import { ASSUMED_SPOT_AVG, SPOT_AVG_BASIS } from "@/lib/energy";
import { euro, fiDate, type HomeFacts } from "@/lib/home";

/*
  ETUSIVUN KOLME VERTIKAALIOSIOTA.

  MIKSI YKSI TIEDOSTO EIKÄ KOLME. Kolme erillistä komponenttia olisi
  siistimpää luettavaa, mutta juuri se erillisyys oli alkuperäinen
  ongelma: kun sähköosio asui omassa tiedostossaan, sitä paranneltiin
  yksinään, ja kolmen kuukauden päästä se oli kaksi kertaa muiden
  mittainen. Kun kaikki kolme kirjoitetaan tähän samaan taulukkoon,
  epätasapaino näkyy heti kirjoittajalle itselleen.

  JÄRJESTYS JA OLEMASSAOLO TULEVAT `getServices()`:STÄ. Tämä tiedosto ei
  päätä, mitkä palvelut näkyvät: jos `FEATURES.loans` sammutetaan,
  lainaosio katoaa itsestään myös heron laatoista, alatunnisteesta ja
  loppukehotuksesta. Yksi kytkin, ei neljää.

  TAUSTOJEN VUOROTTELU on `index % 2`, ei kirjoitettu kunkin osion
  kohdalle. Kolme peräkkäistä osiota samalla pinnalla sulautuisi yhdeksi
  pitkäksi lohkoksi, jossa kävijä ei näe mistä yksi loppuu.

  MITÄ TÄSSÄ EI OLE: yhtään lainalukua. Kuluttajansuojalain 7 luku
  vaatii todellisen vuosikoron ja edustavan esimerkin heti, kun
  mainonnassa esiintyy mikä tahansa lainan kustannusta kuvaava luku, eikä
  sitä voi antaa oikein, koska tarjous on hakijakohtainen (ks.
  lib/loans.ts). Vakuutuspuolella ei ole lukuja siksi, ettei meillä ole
  yhtään tarkistettua vakuutushintaa.
*/

interface Copy {
  headline: string;
  lead: string;
  panelTitle: string;
  panelNote?: string;
  meta: string;
  panel: ReactNode;
}

export default function Verticals({ facts }: { facts: HomeFacts }) {
  const services = getServices();

  const copy: Record<string, Copy> = {
    /*
      SÄHKÖ — AINOA OSIO, JOSSA ON LUKU, KOSKA SE ON AINOA JOSSA MEILLÄ ON
      LUKU. Halvimman ja kalleimman sopimuksen ero on suora seuraus
      tarkistetuista hinnoista ja lasketaan `lib/home.ts`:ssä samoilla
      funktioilla kuin vertailusivun hinnat.

      HALVINTA SOPIMUSTA EI NIMETÄ TÄSSÄ. Se on vertailun vastaus, ja
      vastaus kuuluu vertailusivulle, jossa se on laskettu kävijän omalla
      kulutuksella ja jossa on nappi, joka tuottaa.
    */
    sahko: {
      headline: "Sama sähkö. Eri lasku.",
      lead: "Sähkö on samaa riippumatta siitä, keneltä sen ostat. Ainoa ero on hinta, ja se ero on isompi kuin useimmat arvaavat.",
      /*
        PANEELIN OTSIKKO MAHTUU YHDELLE RIVILLE. "Halvimman ja kalleimman
        ero ensimmäisenä vuonna" kietoutui kahdelle riville versaalina, ja
        kaksirivinen harmaa versaali paneelin päällä lukee otsikon sijaan
        varoitustekstiltä. Sama tieto on kokonaisuudessaan alaviitteessä.
      */
      panelTitle: "Ensimmäisen vuoden hintaero",
      panelNote: `Vertailun ${facts.planCount} sopimusta, ensimmäisen vuoden kokonaishinta kampanjat mukaan luettuna. Pörssisopimuksissa spot-hintana on ${ASSUMED_SPOT_AVG.toLocaleString(
        "fi-FI",
      )} c/kWh (${SPOT_AVG_BASIS}). Hinnat tarkistettu ${fiDate(
        facts.priceDate,
      )}. Oma erosi riippuu kulutuksestasi.`,
      meta: "Ei yhteystietoja · Vie noin viisi minuuttia",
      panel: (
        <PanelList>
          {facts.spreads.map((row, i) => (
            <li key={row.key}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="font-display text-[15px] font-bold">
                  {row.label}
                  <span className="ml-2 font-body text-[12px] font-medium text-ink/45">
                    {row.kwh.toLocaleString("fi-FI")} kWh/v
                  </span>
                </p>
                <p className="font-hero font-price text-[1.6rem] leading-none text-accentDark sm:text-[2rem]">
                  {euro(row.spread)}
                </p>
              </div>
              {/*
                URA ON USVAA, EI VALKOISTA. Paneeli on valkoinen, joten
                oletusura katoaisi taustaan eikä palkin täyttä mittaa
                näkisi — ja ilman vertailukohtaa lyhyt palkki ei kerro
                mitään.
              */}
              <SpreadBar
                ratio={row.ratio}
                delay={i * 0.08}
                trackClassName="bg-mist"
              />
            </li>
          ))}
        </PanelList>
      ),
    },

    /*
      LAINAT — ASKELEET TULEVAT `lib/loans.ts`:STÄ, EI TÄSTÄ TIEDOSTOSTA.
      Samat kolme askelta lukevat lainasivulla. Jos ne kirjoitettaisiin
      tässä uudestaan, etusivu ja lainasivu lupaisivat ensimmäisen
      muokkauksen jälkeen eri asiaa, ja kävijä lukee molemmat peräkkäin.
    */
    lainat: {
      headline: "Yksi hakemus, monta pankkia.",
      lead: "Lainan hinta ei ole listahinta. Tarjous syntyy vasta kun pankki on katsonut juuri sinun tietosi, joten vertailtavaa ei ole ennen kuin tarjoukset ovat pöydällä. Yksi hakemus riittää niiden saamiseen.",
      panelTitle: "Näin se etenee",
      panelNote:
        "Kettu ei laske lainojen hintoja eikä esitä korkolukuja: ne perustuvat aina hakijan omiin tietoihin, ja Sortter näyttää ne oikeiden pankkitarjousten pohjalta.",
      meta: "Maksuton · Hakeminen ei sido ottamaan lainaa",
      panel: (
        <PanelList>
          {LOAN_STEPS.map((s, i) => (
            <StepRow key={s.title} index={i + 1} title={s.title} text={s.text} />
          ))}
        </PanelList>
      ),
    },

    /*
      VAKUUTUKSET — OSIO, JOKA KERTOO RAJANSA ITSE.

      POP Vakuutus on yksi yhtiö, ei vertailu. Sanaa "kilpailuta" tai
      "vertaile" ei käytetä tässä osiossa kertaakaan, ja paneelin
      alaviite sanoo rajauksen suoraan. Syy on tuotto eikä periaate:
      kävijä huomaisi eron sekunnissa saapuessaan POP:n sivulle, ja
      pettymys siinä kohdassa maksaa enemmän kuin yksi vakuutusklikki
      tuottaa — myös sähkövertailun osalta, koska sama kävijä ei enää
      usko senkään lukuja.
    */
    vakuutukset: {
      /*
        OTSIKKO ON KAKSIRIVINEN, KUTEN KAHDESSA MUUSSA OSIOSSA. "Milloin
        viimeksi tarkistit vakuutuksesi?" venyi kolmelle riville, ja
        kolmirivinen otsikko kahden kaksirivisen välissä antaa osiolle
        enemmän painoa kuin kahdelle muulle — juuri se epätasapaino, jonka
        koko tämä rakenne on tarkoitettu estämään. Sana "viimeksi" ei
        muuta kysymyksen merkitystä.
      */
      headline: "Milloin tarkistit vakuutuksesi?",
      lead: "Vakuutus jatkuu vuodesta toiseen automaattisesti, eikä kukaan pyydä sinua tarkistamaan sen hintaa. Tarjous kertoo, maksatko yhä sen verran kuin kannattaa.",
      panelTitle: "Näin se etenee",
      panelNote:
        "Kettu ei vertaile vakuutuksia. POP Vakuutus on yksi yhtiö, joten tarjous kertoo sen hinnan eikä markkinan halvinta. Sanomme sen tässä, koska sen huomaisi joka tapauksessa yhden klikin päässä.",
      meta: "Tarjous on maksuton eikä sido mihinkään",
      panel: (
        <PanelList>
          <StepRow
            index={1}
            title="Siirryt POP Vakuutuksen sivulle"
            text="Linkki vie suoraan kumppanin omaan tarjouspyyntöön."
          />
          <StepRow
            index={2}
            title="Kerrot, mitä haluat vakuuttaa"
            text="Kodin, auton tai molemmat. Tiedot kysyy POP, ei Kettu."
          />
          <StepRow
            index={3}
            title="Vertaat tarjousta nykyiseen laskuusi"
            text="Vertailukohta on oma vakuutuksesi, ei kenenkään listahinta."
          />
        </PanelList>
      ),
    },
  };

  return (
    <>
      {services.map((service, i) => {
        const c = copy[service.key];
        if (!c) return null;

        return (
          <VerticalSection
            key={service.key}
            service={service}
            headline={c.headline}
            lead={c.lead}
            panelTitle={c.panelTitle}
            panelNote={c.panelNote}
            meta={c.meta}
            surface={i % 2 === 1 ? "mist" : "paper"}
          >
            {c.panel}
          </VerticalSection>
        );
      })}
    </>
  );
}
