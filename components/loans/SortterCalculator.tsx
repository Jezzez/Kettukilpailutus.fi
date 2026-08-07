"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { LOAN_WIDGET } from "@/lib/loans";

/**
 * SORTTERIN LASKURI KETUN VÄREISSÄ.
 *
 * Widget on web-komponentti, jonka sisus on varjo-DOM:issa. Emme siis
 * pääse sen sisälle Tailwindilla emmekä ylikirjoittamaan sen luokkia —
 * ja se on hyvä niin, koska Sortterin lomake on Sortterin vastuulla.
 *
 * MITEN SE SILTI SAADAAN NÄYTTÄMÄÄN MEIDÄN SIVULTA: komponentti lukee
 * neljä väriä ja kirjasinperheen attribuuteista ja asettaa niistä
 * CSS-muuttujat isäntäelementille. CSS-muuttujat periytyvät varjo-DOM:iin,
 * joten arvot menevät perille ilman että mitään hakkeroidaan.
 *
 * Oletukset ovat Sortterin sinivihreät (#586bea liuku, #0faa16 nappi,
 * #041264 tekstit). Jos ne jätettäisiin paikalleen, sivulla olisi
 * yhtäkkiä sininen ja vihreä siinä missä muualla on vain kettuoranssi
 * ja kulta — ja kirkkaanvihreä nappi olisi ruudun kuumin piste, eli
 * silmä lähtisi ensimmäisenä sinne mistä se ei tunnista brändiä.
 *
 * VÄRIT OVAT KIINTEÄT HEKSAT, EIVÄT TEEMAMUUTTUJIA. Widget syöttää
 * arvon `hexToRgba`-funktioon läpinäkyvien sävyjen laskemiseksi, joten
 * `rgb(var(--c-ink))` ei kelpaa — siitä tulisi NaN ja liu'un varjo
 * katoaisi. Kortti kääritään sivulla `theme-light`-luokkaan, joten
 * kiinteät vaalean teeman arvot ovat oikein myös tumman teeman päällä.
 *
 * NAPIN TEKSTI VAIHDETTIIN. Oletus on "Lähetä hakemus", mutta täältä ei
 * lähde hakemusta minnekään — nappi vie Sortterin lomakkeelle, jossa
 * hakemus vasta täytetään. Väärä lupaus napissa on se kohta, jossa
 * kävijä kokee tulleensa harhautetuksi ja poistuu. Teksti on sama kuin
 * sivun muissa napeissa, jotta sivulla on yksi kehotus eikä kahta.
 */

interface SortterFormProps {
  /** "personal" | "corporate" | "both". Yrityslainoja emme markkinoi. */
  type?: string;
  /** Seurantaparametrit, jotka liitetään Sortterin osoitteeseen. */
  utm?: string;
  b2cLoanAmount?: string;
  b2cLoanPeriod?: string;
  b2cButtonText?: string;
  /** Tyhjä merkkijono = piilota. Ks. selitys kutsukohdassa. */
  hidePrivacyPolicy?: string;
  hideSplashScreen?: string;
  titleColor?: string;
  labelColor?: string;
  highLightColor?: string;
  buttonColor?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "sortter-reseller-form": SortterFormProps;
    }
  }
}

/** Kettuoranssi. Sama arvo kuin `accent` tailwind.config.ts:ssä. */
const ACCENT = "#E8691B";
/** Ensisijainen teksti vaalealla, sama kuin `--c-ink`. */
const INK = "#201A14";

export default function SortterCalculator() {
  /*
    PAIKANPITÄJÄ ON PAKOLLINEN, EI KOSMETIIKKAA.

    Määrittelemätön web-komponentti on selaimelle tuntematon inline-elementti
    eli nollan korkuinen. Ilman varausta kortti olisi ensin litteä ja
    ponnahtaisi lähes 700–870 pikseliä korkeaksi sillä sekunnilla, kun
    skripti latautuu — ja koska kortti on heti heron alla, hyppy siirtäisi
    koko loppusivun juuri kun kävijä on alkanut vierittää. Se on sekä ruma
    että Googlen CLS-mittarissa suoraan rankaiseva.

    VARAUS ANNETAAN VAIN LATAUKSEN AJAKSI. Jos `min-h` jäisi paikalleen,
    se jäisi myös valmiin widgetin alle tyhjäksi kaistaksi silloin kun
    widget on varattua matalampi. Mitatut korkeudet ovat noin 867 px
    (320 px leveä), 832 px (360 px), 727 px (574 px) ja 680 px (760 px)
    — siksi kolme porrasta.

    `customElements.whenDefined` on oikea signaali, ei skriptin onLoad:
    UMD-nide voi latautua ennen kuin elementti on rekisteröity.
  */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    customElements.whenDefined("sortter-reseller-form").then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      className={`relative ${
        ready ? "" : "min-h-[860px] sm:min-h-[740px] lg:min-h-[690px]"
      }`}
    >
      {/*
        `afterInteractive`, ei `lazyOnload`. Laskuri on työpöydällä heti
        ensimmäisen ruudullisen alla, joten sen pitää olla valmis silloin
        kun kävijä ehtii siihen. `lazyOnload` odottaa window.load-tapahtumaa
        eli kuvien latautumista, ja tällä sivulla on iso kettukuva.
      */}
      <Script src={LOAN_WIDGET.src} type="module" strategy="afterInteractive" />

      {!ready && (
        /*
          Luuranko, ei pyörivä spinneri. Spinneri kertoo "odota", luuranko
          kertoo "tähän tulee kaksi liukua ja nappi" — jälkimmäinen pitää
          kävijän paikallaan, koska hän tietää mitä on tulossa.
          `motion-safe` kunnioittaa käyttäjän liikeasetusta.
        */
        <div className="absolute inset-0 flex flex-col justify-center gap-6 px-1" aria-hidden>
          <div className="motion-safe:animate-pulse space-y-3">
            <div className="h-3 w-28 rounded-full bg-line/70" />
            <div className="h-9 w-40 rounded-lg bg-line/50" />
            <div className="h-2 w-full rounded-full bg-line/60" />
          </div>
          <div className="motion-safe:animate-pulse space-y-3">
            <div className="h-3 w-36 rounded-full bg-line/70" />
            <div className="h-9 w-28 rounded-lg bg-line/50" />
            <div className="h-2 w-full rounded-full bg-line/60" />
          </div>
          <div className="motion-safe:animate-pulse h-[52px] w-full rounded-[4rem] bg-line/50" />
        </div>
      )}

      {/*
        Elementti on aina DOM:issa — sitä ei saa jättää renderöimättä,
        koska silloin `whenDefined` ei koskaan johtaisi mihinkään näkyvään
        ja upotus jäisi kiinni kanamunaan. Se vain häivytetään esiin, kun
        Sortterin koodi on ottanut sen haltuun.

        `sortter-reseller-form` on tuntematon tunniste, joka on oletuksena
        inline. Ilman `display: block` -asetusta widgetin oma leveys ei
        täyttäisi korttia.
      */}
      <sortter-reseller-form
        type="personal"
        utm={LOAN_WIDGET.utm}
        b2cLoanAmount={String(LOAN_WIDGET.amount)}
        b2cLoanPeriod={String(LOAN_WIDGET.periodYears)}
        b2cButtonText="Hae lainatarjoukset"
        /*
          Molemmat ovat tyhjiä merkkijonoja eli EPÄTOSIA — Sortterin
          nimeäminen on tässä harhaanjohtava, sillä koodissa lippu
          näyttää elementin eikä piilota sitä. Tyhjä arvo siis piilottaa,
          niin kuin nimi lupaa.

          Roiskekuva pois: se on Sortterin oma välianimaatio, joka veisi
          kortin haltuun keskellä meidän sivuamme.

          Tietosuojalinkki pois Sortterin ohjeen mukaan. Se on turvallista
          vain siksi, ettei tällä widgetillä kerätä henkilötietoja — se on
          kaksi liukua, ja hakemus täytetään vasta Sortterin sivulla,
          jossa heidän oma tietosuojaselosteensa on voimassa. Jos widget
          joskus muuttuu lomakkeeksi, tämä on otettava takaisin.
        */
        hideSplashScreen=""
        hidePrivacyPolicy=""
        titleColor={INK}
        labelColor={INK}
        highLightColor={ACCENT}
        buttonColor={ACCENT}
        fontFamily="var(--font-inter), system-ui, sans-serif"
        style={{
          display: "block",
          opacity: ready ? 1 : 0,
          transition: "opacity 220ms ease",
        }}
      />
    </div>
  );
}
