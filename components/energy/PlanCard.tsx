"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf, Star, Tag, TrendingDown, TrendingUp } from "lucide-react";
import type { ElectricityPlan } from "@/lib/energy";
import {
  campaignMonthlyCost,
  normalAnnualCost,
  ownChargesAnnual,
  periodCost,
  RANK_MONTHS,
  TYPE_LABEL,
} from "@/lib/energy";
import AffiliateButton from "../AffiliateButton";
import FoxPaw from "../FoxPaw";

/**
 * KORTIN MERKKI — VAIN YKSI LAJI.
 *
 * Tässä oli aiemmin kaksi merkkiä: kermanvalkoinen "Edullisin tällä
 * hetkellä" ja kultainen "Ketun valinta", ja ne saattoivat osua eri
 * kortteihin, koska Ketun valinta laskettiin painotuksella (hinta +
 * kampanjan jälkeinen hinta). Painotus poistettiin: Ketun suositus on
 * nyt aina halvin ensi kuun hinta kävijän omalla kulutuksella.
 *
 * Kun molemmat merkit tarkoittavat samaa korttia, kaksi merkkiä on
 * yksi liikaa — ja kahdesta merkistä syntyy kysymys "mitä eroa
 * näillä on?", johon vertailusivulla ei kannata kuluttaa lukijan
 * huomiota juuri ennen ostonappia. Jäljelle jää kultainen sinetti.
 *
 * `note` poistettiin samalla: se sanoi "tällä hetkellä edullisin sekä
 * ensimmäisenä vuonna että kampanjan jälkeen", mikä oli vanhan
 * painotuksen väite eikä enää totta.
 */
export type PlanBadge = { kind: "fox" } | null;

/**
 * Hintarivien luvut aina kahdella desimaalilla.
 *
 * `toLocaleString` pudottaa turhat nollat, joten sama kortti saattoi näyttää
 * "0,40 c/kWh" ominaisuuslistassa ja "0,4 c/kWh" hintataulukossa. Vertailussa
 * epätasainen desimaali luetaan huolimattomuutena, ja huolimaton hintataulukko
 * on juuri se, joka saa kävijän tarkistamaan luvut muualta.
 */
function money(n: number): string {
  return n.toLocaleString("fi-FI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Sähkösopimuskortti.
 *
 * Hintapalkki on ymmärrettävyyden ydin: silmä vertaa palkkien pituuksia
 * hetkessä, kun taas kuuden euromäärän vertailu vaatii lukemista.
 * Säästöluku kertoo ensisijaisesti eron KÄYTTÄJÄN nykyiseen sopimukseen —
 * vertailu listan kalleimpaan on vain varajärjestely.
 */
export default function PlanCard({
  plan,
  kwh,
  badge = null,
  compareDiff = null,
  minCost,
  maxCost,
  rank,
  strength,
}: {
  plan: ElectricityPlan;
  kwh: number;
  badge?: PlanBadge;
  /**
   * Ero käyttäjän nykyiseen sopimukseen euroina vuodessa.
   * Positiivinen = tämä on halvempi. `null` = käyttäjä ei ole kertonut
   * nykyistä hintaansa, jolloin vertailua ei ole olemassa eikä sitä
   * keksitä listan kalleimmasta.
   */
  compareDiff?: number | null;
  /** Listan halvin vuosihinta. Hintapalkin nollakohta. */
  minCost: number;
  maxCost: number;
  /** Sijaluku valitussa järjestyksessä. Ks. perustelu logokaistan kommentissa. */
  rank?: number;
  /**
   * Yhden lauseen vahvuus merkittömälle kortille, esim. "Pienin perusmaksu"
   * tai "+0,70 € / kk halvimpaan". Laskettu vertailtavasta joukosta
   * `ElectricityExperience`-komponentissa — ks. sen `vahvuudet`-kommentti.
   * Näytetään vain, kun kortilla ei ole Ketun merkkiä.
   */
  strength?: string;
}) {
  /** Kiinteän sopimuksen järjestysperuste: kahden vuoden kokonaishinta.
   *  Pörssisopimukset järjestetään ison luvun mukaan, ks. `rankCost`. */
  const locked = plan.type === "fixed";
  const twoYears = periodCost(plan, kwh, RANK_MONTHS);

  /*
    ISO LUKU ON ENSI KUUN HINTA. PÖRSSI JÄRJESTETÄÄN SEN MUKAAN, KIINTEÄ
    KAHDEN VUODEN HINNAN MUKAAN (ks. `rankCost`).

    Nämä ovat tarkoituksella eri luvut, ja ero on koko kortin idea.

    Iso luku on se, mitä laskussa lukee ensi kuussa. Kukaan ei koskaan
    maksa keskiarvoa yhtenäkään kuukautena, eikä keskiarvoa voi verrata
    omaan laskuun — ja oma lasku on ainoa vertailukohta, joka lukijalla
    on. Nimeämätön keskiarvo isolla fontilla luetaan silti ensi kuun
    hinnaksi, joten se on sekä väärä luku että väärin luettu.

    Alla oleva perustelu koskee nykyään vain kiinteitä sopimuksia.
    Pörssisopimukset järjestetään Jessen päätöksellä 25.10.2026 ison luvun
    mukaan, vaikka neljän kuukauden houkutin
    päihittää vuoden kestävän alennuksen: Aalto Luotsi nousi kerran
    ykköseksi hinnalla 31,6 €/kk vaikka maksaa ensimmäisenä vuonna 504 €
    ja sen jälkeen 47,2 €/kk, ja halvin sopimus oli kahdeksantena.

    SEURAUS, JOKA ON HYVÄKSYTTY TIETOISESTI: lista ei ole ison luvun
    mukaisessa järjestyksessä. Kampanjakortti voi näyttää halvemmalta
    kuin yläpuolinen ja olla silti alempana. Juuri sen näkeminen on
    lukijalle se hyödyllinen havainto, ja kortti selittää sen itse
    kahdella rivillä: "Y € / 2 vuotta" ja "sitten X €/kk".
  */
  const monthly = campaignMonthlyCost(plan, kwh);

  /*
    HINTAPALKKI KÄÄNNETTIIN: PITKÄ PALKKI = HALPA.

    Palkki näytti aiemmin hinnan osuutta kalleimmasta, eli KALLEIN kortti
    sai pisimmän palkin. Jokaisessa muussa käyttöliittymässä maailmassa
    täysi palkki tarkoittaa hyvää tulosta, joten palkki luki päinvastoin
    kuin se oli tarkoitettu — ja väärinpäin luettu kaavio on huonompi
    kuin ei kaaviota lainkaan, koska se johtaa harhaan sekunnin ajan.

    Nyt palkki on halvimman hinnan suhde tämän kortin hintaan: halvin
    saa täyden palkin, kaksi kertaa kalliimpi puolikkaan. Palkki mittaa
    ENSI KUUN hintaa, eli samaa lukua kuin kortin iso numero. Sitä varten
    palkki on olemassa: silmä vertaa pituuksia nopeammin kuin kuutta
    euromäärää. Koska lista järjestetään vuosihinnalla, palkit eivät
    lyhene tasaisesti alaspäin, ja se on tarkoitus: palkki kertoo mitä
    maksat nyt, järjestys mitä maksat vuodessa.

    Katto on 100. Ilman sitä palkki voi mennä yli sadan, koska `minCost`
    on halvin VUOSIhinta ja jakaja on tämän kortin ensi kuun hinta kertaa
    12 — kampanjakuukausi voi siis olla halvempi kuin listan halvin vuosi.
    Cheap Energy piirtyi näin 113 %:iin eli palkki valui laatikon yli.
  */
  const barWidth = Math.min(
    100,
    Math.max(8, Math.round((minCost / (monthly * 12)) * 100))
  );

  /*
    ERO NYKYISEEN NÄKYY JOKAISESSA KORTISSA — MYÖS SILLOIN KUN SE ON HUONO.

    Aiemmin luku näytettiin vain jos sopimus oli halvempi kuin asiakkaan
    nykyinen. Se tarkoitti kahta ongelmaa. Ensinnäkin luku oli vain
    osassa kortteja, jolloin korttien sisältö oli eri korkeudella eikä
    hintoja voinut enää silmäillä vaakasuoraan. Toiseksi kalliimman
    sopimuksen kortti oli hiljaa juuri siitä tiedosta, joka asiakasta
    kiinnostaa — ja vaikeneminen huomataan.

    Kun kaikki 24 korttia kertovat eron samassa kohdassa, listasta tulee
    työkalu eikä myyntiesite. Se on tämän sivuston ainoa kilpailuetu:
    kävijä uskoo luvut, koska ne eivät kaikki osoita samaan suuntaan.
  */
  const diffMonthly = compareDiff === null ? null : compareDiff / 12;

  /*
    KAIKKI KORTIT OVAT ORANSSEJA — JÄRJESTYS TEHDÄÄN NAUHALLA, EI POHJAVÄRILLÄ.

    Aiemmin vain halvin kortti oli oranssi ja loput vaaleita. Kun koko
    ruudukko on oranssi, pohjaväri ei enää erota mitään, joten kortin
    rooli on siirrettävä johonkin muuhun. Se on nyt kortin ylin nauha:
    kulta = Ketun valinta, ei nauhaa = tavallinen. Yksi kultanauha
    kahdenkymmenenneljän oranssin kortin joukossa erottuu yhtä hyvin
    kuin yksi oranssi kortti erottui vaaleista — ja lisäksi nauhassa
    lukee SYY, jota pelkkä väri ei kertonut.

    OSTONAPPI: oranssi nappi oranssilla kortilla katoaisi pohjaansa,
    joten jokaisen kortin nappi on nyt kermanvalkoinen (`inverse` +
    `theme-light`). Se on kortin kirkkain piste, eli juuri se, mihin
    silmä päätyy. Tämä on koko muutoksen ainoa oikea riski: kun kaikki
    napit ovat yhtä kirkkaita, mikään ei ohjaa ylöspäin listalla.
    Sijaluku logon vieressä ja hintapalkki tekevät sen työn nyt yksin.

    EMBER-ANSA: `theme-ember` kääntää `bg-white`-luokan oranssiksi ja
    `text-accentDark`-luokan vaaleaksi kermaksi. Koska kortteja ei ole
    enää yhtään vaaleaa, jokainen aidosti valkoista pohjaa tarvitseva
    kohta — yhtiön logo, kettukuva, ostonappi — on käärittävä
    `theme-light`-luokkaan.
  */
  const foxPick = badge?.kind === "fox";

  /*
    KAMPANJA — KUMPPANIN OMA TARJOUS KORTIN YLÄKULMASSA.

    Kampanja on ainoa tieto kortissa, jolla on takaraja. Hinta, marginaali
    ja määräaika ovat voimassa ensi kuussakin, mutta "perusmaksu 0 € kolme
    kuukautta" on syy tehdä sopimus tänään eikä joskus. Vertailusivun
    tuotto syntyy vasta klikistä, ja klikin suurin este on lykkääminen —
    siksi juuri tämä tieto ansaitsee kortin näkyvimmän kohdan.

    Merkki on kumppanin oma tarjous, ei Ketun kannanotto. Siksi siinä ei
    ole tassua: tassu on varattu Ketun omille väitteille, ja jos sama
    merkki esiintyisi sähköyhtiön mainoksessa, koko tassun merkitys
    laimenisi. Lipputikku (Tag) lukee tarjoukseksi ilman selitystä.
  */
  const campaign = plan.campaign ?? null;

  /* Kampanjan jälkeinen pysyvä kuukausihinta. Iso euroluku kortissa on
     kampanjahinta, joka loppuu, joten tämä on sen pariluku: ilman sitä
     kortti lupaisi hinnan, joka nousee ilman varoitusta.

     ÄLÄ piilota "sitten"-lukuja tilan säästämiseksi — ei tätä eikä
     laattojen omia alarivejä ("6 kk, sitten 0,78"). Ilman niitä rivi
     lupaisi kampanjahinnan pysyväksi, ja se on täsmälleen se pettymys,
     jota vastaan tämä luku on rakennettu. */
  const normalMonthly = campaign ? normalAnnualCost(plan, kwh) / 12 : null;

  /*
    YHTIÖN OMA OSUUS — HINTA ILMAN PÖRSSIN SPOT-HINTAA.

    Pörssikortin iso euroluku sisältää itse sähkön, joka lasketaan
    oletuskeskihinnalla (ASSUMED_SPOT_AVG). Se on oikea tapa esittää
    kokonaishinta — ilman sitä pörssi- ja kiinteä hintaiset sopimukset eivät
    olisi vertailukelpoisia keskenään, koska kiinteän energiahinta sisältää
    sähkön ja pörssin marginaali ei. Mutta se tekee isosta luvusta osittain
    ennusteen, ja ennuste on aina väärässä jollain määrällä.

    Tämä rivi erottaa niistä kahdesta sen osan, joka EI ole ennuste:
    perusmaksu ja marginaali ovat sopimuksen ehtoja, eivät arvioita. Se on
    myös ainoa osa, johon kilpailuttaminen vaikuttaa — pörssin hinta on
    sama riippumatta siitä, minkä yhtiön valitsee.

    Lukija saa siis kaksi lukua eri tarkoitukseen: iso luku vastaa
    kysymykseen "paljonko lasku on", tämä rivi kysymykseen "paljonko tämä
    yhtiö veloittaa". Jälkimmäinen on tarkka, ja sen voi tarkistaa
    sopimusehdoista, mikä on tällä sivulla arvokkaampaa kuin yksi
    euromäärä lisää.

    Vain pörssisopimuksille. Kiinteässä sopimuksessa energiahinta on osa
    yhtiön omaa hinnastoa, joten "ilman pörssiä" ei tarkoittaisi mitään.
  */
  const omaOsuusVuosi = ownChargesAnnual(plan, kwh);

  /*
    LAATTOJEN LUVUT ERIKSEEN MERKKIJONOISTA.

    `energiaPysyva` ja `perusmaksuPysyva` yllä ovat valmiita merkkijonoja
    ("0,68 c/kWh + pörssi"), ja ne kelpaavat pienelle riville. Laatassa
    numero on 23 pikseliä ja yksikkö 11, joten ne on saatava erikseen.
    Sama luku lasketaan siis kahdessa muodossa tarkoituksella — vaihtoehto
    olisi pilkkoa merkkijono takaisin osiin, ja se rikkoutuisi
    ensimmäisessä muotoilumuutoksessa.

    Kiinteässä sopimuksessa ei ole marginaalia. Laatta ei silti katoa vaan
    näyttää energian hinnan: jos sarake häviäisi sopimustyypin mukaan,
    lukija menettäisi juuri sen pystylinjan, jonka takia koko lista on
    riveinä. Otsikko vaihtuu, paikka ei.
  */
  const energiaOtsikko = plan.type === "spot" ? "Marginaali" : "Energia";

  const energiaNytLuku = money(
    plan.type === "spot"
      ? campaign?.spotMargin ?? plan.spotMargin ?? 0
      : campaign?.energyPrice ?? plan.energyPrice ?? 0
  );

  const energiaSittenLuku =
    plan.type === "spot"
      ? campaign?.spotMargin != null
        ? money(plan.spotMargin ?? 0)
        : null
      : campaign?.energyPrice != null
        ? money(plan.energyPrice ?? 0)
        : null;

  const perusmaksuNytLuku = money(campaign?.basicFee ?? plan.basicFee);

  const perusmaksuSittenLuku =
    campaign?.basicFee != null && campaign.basicFee !== plan.basicFee
      ? money(plan.basicFee)
      : null;

  return (
    /*
      RIVI, JOSSA HINNAN OSAT OVAT OMANA LOHKONAAN.

      MIKSI MARGINAALI JA PERUSMAKSU NOUSIVAT ISOIKSI LUVUIKSI.

      Pörssisopimuksissa yhtiöt kilpailevat täsmälleen kahdella luvulla:
      marginaalilla ja perusmaksulla. Kaikki muu laskussa on pörssin hinta,
      joka on sama riippumatta siitä, minkä yhtiön valitsee. Aiemmin nämä
      kaksi lukua olivat rivin pienintä tekstiä erittelylaatikossa, eli
      lista näytti isolla sen osan hinnasta, johon valinta EI vaikuta, ja
      pienellä sen osan, johon vaikuttaa.

      Nyt ne ovat omina laattoinaan, ja kummankin alla lukee mihin luku
      nousee kampanjan jälkeen. Rivi vastaa siis itse kysymykseen "miksi
      tämä on halpa", eikä lukijan tarvitse avata mitään uskoakseen hinnan.
      Se on tämän sivuston ainoa kilpailuetu: luku, jonka voi tarkistaa
      sopimusehdoista, on arvokkaampi kuin yksi euromäärä lisää.

      ISO LUKU ON SILTI €/KK. Marginaali 0,34 c/kWh ei kerro
      ensikertalaiselle mitään ennen kuin sen kertoo kulutuksella, ja se
      kertolasku on koko laskurin olemassaolon syy. Jos marginaali olisi
      rivin suurin luku, sivu palvelisi sitä joka osaa jo laskea sen itse.

      KOLME ASETTELUA, KAKSI KATKAISUKOHTAA.

      Alle 640 px: kaikki allekkain, hinta ja nappi vierekkäin.
      640–1023 px: vasemmalla tunniste, oikealla laatat, alla hinta+nappi.
      1024 px ja yli: kaikki neljä samalla rivillä.

      Neljän sarakkeen rivi vaatii noin 930 pikseliä ennen kuin yhtiön nimi
      alkaa katketa, joten se ei voi alkaa `sm`-katkosta (640 px). Aiemmin
      se alkoi, ja seuraus oli että tunnistesarake puristui sijaluvun ja
      logon levyiseksi ja YHTIÖN NIMELLE JÄI NOLLA PIKSELIÄ — nimi ei ollut
      piilotettu, se oli puristettu näkymättömiin. Siksi tunnistesarakkeella
      on nyt `minmax(290px, …)`: se ei voi enää kadota, vaan pakottaa
      tarvittaessa rivin rivittymään.
    */
    <article
      className={`lift theme-ember ember-surface group relative overflow-hidden rounded-2xl border shadow-cardHover ${
        rank === 1 ? "ring-2 ring-cream/45" : ""
      } ${
        foxPick ? "border-gold hover:border-gold" : "border-line hover:border-cream/55"
      }`}
    >
      {/*
        YLÄNAUHA — AIKARAJATTU TIETO OMALLA PINNALLAAN.

        Nauhassa on vain kaksi asiaa, ja molemmat ovat aikaan sidottuja:
        Ketun valinta (voi vaihtua kun hinnat muuttuvat) ja kampanja (jolla
        on takaraja). Sopimustyyppi ja uusiutuvuus eivät ole, joten ne
        pysyvät nimen alla merkkeinä.

        Kampanja oli aiemmin kolmas lätkä sopimustyypin ja Uusiutuvan
        vieressä. Kolmesta samankokoisesta lätkästä ei erotu yksikään, ja
        kampanja on niistä ainoa, joka on syy toimia tänään eikä joskus.
        Vertailusivun tuotto syntyy vasta klikistä, ja klikin suurin este on
        lykkääminen — siksi juuri tämä tieto sai oman nauhansa.

        Nauha syntyy vain kun sisältöä on. Tyhjää nauhaa ei piirretä, koska
        sen ainoa tehtävä olisi kohdistaa rivien sisällöt samalle
        vaakalinjalle, eikä yhden sarakkeen listassa ole mitään mihin
        kohdistaa.
      */}
      {(foxPick || campaign) && (
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-b border-cream/15 bg-black/20 px-3 py-1.5 sm:px-5">
          {foxPick && (
            <>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-gold px-2 py-[3px] font-display text-[10px] font-extrabold uppercase leading-none tracking-[0.13em] text-[#4A2E06]">
                <FoxPaw size={11} /> Ketun valinta
              </span>
              <span className="shrink-0 font-data text-[10.5px] font-bold leading-none text-goldInk">
                {locked ? "Halvin 2 vuodessa" : "Halvin nyt"}
              </span>
            </>
          )}
          {campaign && (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              {/* `theme-light`: ember-vyöllä `bg-white` on oranssi, joten
                  ilman tätä kermalätkä olisi sama väri kuin nauha. */}
              <span className="theme-light inline-flex shrink-0 items-center gap-1 rounded-md bg-white px-2 py-[3px] font-display text-[9.5px] font-extrabold uppercase leading-none tracking-[0.1em] text-[#A83E0A]">
                <Tag size={10} aria-hidden /> Tarjous
              </span>
              <span className="truncate text-[11.5px] font-bold leading-none text-goldInk">
                {campaign.label}
                {campaign.limit ? ` · ${campaign.limit}` : ""}
              </span>
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-5 gap-y-3 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-y-4 sm:p-4 lg:grid-cols-[minmax(290px,1.25fr)_auto_minmax(150px,1fr)_176px] lg:gap-x-6 lg:p-5">
        {/*
          TUNNISTE: SIJA, LOGO, NIMI.

          Logolla on kiinteä laatikko, ei kiinteä logo. Aiemmin logo sai
          olla niin leveä kuin halusi, jolloin yhtiöiden nimet alkoivat eri
          kohdasta ja lista luki siltä kuin rivit olisi ladottu käsin.
          Kiinteä laatikko + `object-contain` tarkoittaa samalla, ettei
          tunnuksen tarvitse olla neliö: leveä tekstilogo (Hehku,
          Sähkötytöt) skaalautuu laatikkoon omassa mittasuhteessaan.

          Sijaluvun kirkkausportaikko on ennallaan: 1. täysi kerma, 2.–3.
          kermareunus, loput vaimeat. Mitaleja ei käytetä, koska ne toisivat
          sivulle kolme uutta väriä.
        */}
        <div className="flex min-w-0 items-center gap-2.5 lg:gap-3">
          {rank !== undefined && (
            <span
              className={`grid shrink-0 place-items-center rounded-lg font-data font-extrabold tabular-nums ${
                rank === 1
                  ? "h-7 w-7 bg-cream text-[13px] text-[#A83E0A] shadow-[0_1px_3px_rgba(74,26,2,0.35)]"
                  : rank === 2
                    ? "h-6 w-6 border border-cream/60 bg-black/15 text-[12px] text-cream"
                    : rank === 3
                      ? "h-6 w-6 border border-cream/35 bg-black/15 text-[12px] text-cream/85"
                      : "h-6 w-6 border border-cream/15 bg-black/15 text-[12px] text-cream/60"
              }`}
              aria-hidden
            >
              {rank}
            </span>
          )}
          <ProviderLogo provider={plan.provider} logo={plan.logo} />
          <div className="min-w-0">
            <h3 className="truncate font-display text-[15px] font-bold leading-tight text-ink sm:text-[16px]">
              <Link
                href={`/sahkosopimukset/sopimus/${plan.slug}`}
                className="underline-offset-4 hover:underline"
              >
                {plan.provider}
              </Link>
            </h3>
            <p className="truncate text-[12.5px] leading-tight text-ink/60">{plan.name}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <TypeBadges plan={plan} />
            </div>
            {/*
              VAHVUUSLAUSE MERKITTÖMÄLLE RIVILLE — HILJAINEN, EI NELJÄS LÄTKÄ.

              Pieni kirjain, ei harvennusta, ei ikonia. Jos tämä näyttäisi
              merkiltä, jokaisella rivillä olisi merkki eli yhdelläkään ei
              olisi.
            */}
            {!foxPick && strength && (
              <p className="mt-1.5 flex min-w-0 items-center gap-2 text-[11.5px] font-semibold leading-none text-cream/70">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cream/45" aria-hidden />
                <span className="truncate">{strength}</span>
              </p>
            )}
          </div>
        </div>

        {/*
          HINNAN OSAT — KAKSI LAATTAA, AINA SAMASSA JÄRJESTYKSESSÄ.

          Laatat ovat aina kaksi ja aina samat: energia ensin, perusmaksu
          toisena. Järjestystä ei saa vaihtaa sopimustyypin mukaan, koska
          silloin kahden rivin vertaaminen vaatisi otsikoiden lukemista
          joka kerta — ja juuri sen välttäminen on rivilistan koko idea.
        */}
        <div className="grid grid-cols-2 gap-2 lg:gap-2.5">
          <HintaLaatta
            otsikko={energiaOtsikko}
            luku={energiaNytLuku}
            yksikko="c/kWh"
            selite={plan.type === "spot" ? "pörssihinnan päälle" : "sisältää sähkön"}
            sitten={
              energiaSittenLuku && campaign
                ? `${campaign.months} kk, sitten ${energiaSittenLuku}`
                : null
            }
          />
          <HintaLaatta
            otsikko="Perusmaksu"
            luku={perusmaksuNytLuku}
            yksikko="€/kk"
            selite="joka kuukausi"
            sitten={
              perusmaksuSittenLuku && campaign
                ? `${campaign.months} kk, sitten ${perusmaksuSittenLuku}`
                : null
            }
          />
        </div>

        {/*
          HINTA JA NAPPI VIERETYSTEN, PAITSI ISOLLA NÄYTÖLLÄ.

          Kääre pitää hinnan ja napin samalla rivillä puhelimessa ja
          tabletilla. Ilman sitä nappi menisi omalle rivilleen ja rivi
          kasvaisi noin 60 pikseliä, eli puhelimen ruudulle mahtuisi enää
          yksi sopimus.

          `lg:contents` purkaa kääreen isolla näytöllä, jolloin hinta ja
          nappi palaavat omiksi ruudukkosarakkeikseen ja pysyvät samassa
          pystylinjassa joka rivillä. Ilman sitä olisi kaksi eri
          asettelupuuta ylläpidettävänä, ja ne erkanevat aina.

          `items-end`: nappi asettuu hintalohkon alareunaan eikä keskelle.
          Keskitettynä se osui hintaluvun ja palkin väliin, jolloin katse
          pysähtyi nappiin ennen kuin ehti lukea hinnan — ja hinta on se,
          joka saa napin painetuksi.
        */}
        <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-1 lg:contents">
          <div className="min-w-0 flex-1">
            {/* Ero nykyiseen: ainoa luku, jota ei voi päätellä muualta
                rivistä, joten se on hintaluvun yläpuolella. Näkyy vain kun
                eroa on yli 50 senttiä kuussa. */}
            {diffMonthly !== null && Math.abs(diffMonthly) > 0.5 && (
              <p
                className={`mb-1.5 inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11.5px] ${
                  diffMonthly > 0.5
                    ? "border-cream/45 bg-black/15 text-cream"
                    : "border-cream/15 bg-black/10 text-ink/65"
                }`}
              >
                {diffMonthly > 0.5 ? (
                  <>
                    <TrendingDown size={12} className="shrink-0" aria-hidden />
                    <span>
                      Säästät{" "}
                      <strong className="font-data font-bold">{money(diffMonthly)} €</strong> / kk
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={12} className="shrink-0" aria-hidden />
                    <span>
                      <strong className="font-data font-bold">
                        {money(Math.abs(diffMonthly))} €
                      </strong>{" "}
                      / kk kalliimpi
                    </span>
                  </>
                )}
              </p>
            )}

            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="font-display font-data font-price text-[27px] font-extrabold leading-none tracking-[-0.03em] text-ink sm:text-[30px]">
                {money(monthly)} €
              </span>
              <span className="font-display text-[13px] font-semibold text-ink/60">/ kk</span>
              {campaign ? (
                <span className="font-display text-[11.5px] font-semibold text-ink/50">
                  ensimmäiset {campaign.months} kk
                </span>
              ) : null}
            </div>

            {/* Hintapalkki: pitkä palkki = halpa. Ks. `barWidth`-perustelu. */}
            <div
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/25"
              role="img"
              aria-label={`Ensi kuun hinta suhteessa vertailun edullisimpaan: mitä pidempi palkki, sitä edullisempi sopimus. Tämä ${barWidth} prosenttia täydestä.`}
              title="Mitä pidempi palkki, sitä edullisempi sopimus ensi kuussa"
            >
              <div
                className="h-full rounded-full bg-cream transition-all duration-500"
                style={{ width: `${barWidth}%` }}
              />
            </div>

            {/*
              KAKSI PAKOLLISTA LUKUA YHDELLÄ RIVILLÄ.

              "X € / 2 vuotta" (vain kiinteät) on listan järjestysperuste, eli ainoa selitys
              sille miksi rivi voi olla eri kohdassa kuin sen iso luku
              antaisi olettaa. "Sitten Y €/kk" kertoo mihin kampanjahinta
              nousee. Kumpaakaan ei saa poistaa eikä piilottaa: silloin sivu
              näyttäisi halvimman ensimmäisen vuoden ja piilottaisi pysyvän
              hinnan, mikä on täsmälleen se temppu jota tämä vertailu ei tee.
            */}
            <p className="mt-1.5 text-[11.5px] leading-snug text-ink/60">
              <span className="font-data font-semibold text-ink/75">
                {locked
                  ? `${twoYears.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} €`
                  : null}
              </span>
              {locked ? " / 2 vuotta" : null}
              {campaign && normalMonthly !== null ? (
                <>
                  {locked ? (
                    <span className="mx-1.5 text-cream/40" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  {/* `whitespace-nowrap`: ilman sitä rivi katkesi puhelimessa
                      niin, että "kk" jäi yksin seuraavalle riville. Luku ja
                      sen yksikkö ovat yksi asia. */}
                  <span className="whitespace-nowrap">
                    {locked ? "sitten" : "Sitten"}{" "}
                    <span className="font-data font-bold text-ink/80">
                      {money(normalMonthly)} €
                    </span>{" "}
                    / kk
                  </span>
                </>
              ) : locked ? (
                <>
                  <span className="mx-1.5 text-cream/40" aria-hidden>
                    ·
                  </span>
                  laskettu kulutuksellasi
                </>
              ) : (
                "Laskettu kulutuksellasi"
              )}
            </p>
          </div>

          {/*
            NAPPISARAKE.

            Isolla näytöllä nappi on rivin oikeassa reunassa omassa
            sarakkeessaan, eli jokaisen rivin nappi on samassa
            pystylinjassa. Se on rivimuodon toinen tuottoperustelu: kun
            napit ovat linjassa, listaa voi selata nappi kerrallaan eikä
            kohdetta tarvitse etsiä joka rivistä uudelleen.

            `theme-light` on pakollinen: `theme-ember` kääntäisi
            kermanvalkoisen napin oranssiksi, jolloin nappi katoaisi rivin
            pohjaan. Ks. ember-ansa DESIGN.md:ssä.
          */}
          <div className="flex w-[136px] shrink-0 flex-col items-stretch gap-1 sm:w-[176px] lg:items-end">
            <div className="theme-light w-full">
              {/*
                PUHELIMESSA KAPEAMPI SISÄNNYS JA PIENEMPI KIRJASIN.

                Napin oma tyyli on `px-7` ja 15 px. 136 pikselin napissa se
                jättää tekstille 80 pikseliä, eli "Tee sopimus" katkeaisi
                kahdelle riville ja nappi kasvaisi parikymmentä pikseliä
                jokaisella rivillä. Huutomerkit ovat pakollisia: molemmat
                luokat tulevat samasta Tailwind-kerroksesta, joten pelkkä
                myöhempi maininta ei voita.

                `leading-tight`: kumppanittomien sopimusten "Siirry
                palveluntarjoajalle" ei mahdu yhdelle riville millään
                järkevällä koolla, joten kaksi riviä on hyväksytty, mutta
                tiiviinä.
              */}
              <AffiliateButton
                href={plan.affiliateUrl}
                cardId={plan.id}
                placement="energy-grid"
                analytics={{
                  category: "electricity",
                  provider: plan.provider,
                  plan: plan.name,
                }}
                variant="inverse"
                className="w-full !px-3 !py-3 !text-[14px] leading-tight sm:!px-6 sm:!py-3.5 sm:!text-[15px]"
              >
                {plan.partner ? "Tee sopimus" : "Siirry palveluntarjoajalle"}
              </AffiliateButton>
            </div>
          </div>
        </div>
      </div>

      {/*
        ALANAUHA — TARKISTETTAVAT TIEDOT, EI MYYNTITEKSTIÄ.

        OMINAISUUSLISTA POISTETTIIN KOKONAAN. Se toisti nyt laatat sanasta
        sanaan: Nordic Greenin ensimmäinen ominaisuus oli "Vuoden ajan 0,34
        c/kWh ja perusmaksu 2,99 €/kk", eli täsmälleen se mitä molemmissa
        laatoissa lukee isolla, ja kolmas oli "100 % ilmastoystävällistä
        sähköä", jonka Uusiutuva-merkki kertoo. Toistettu tieto ei lisää
        luottamusta vaan vie tilaa, ja täydet ominaisuudet ovat yhä
        sopimussivulla, johon tämä nauha linkittää.

        JÄLJELLE JÄI KAKSI ASIAA, JOITA EI SAA POISTAA. "Yhtiön oma osuus"
        on hinnan se puoli, joka EI ole ennuste: perusmaksu ja marginaali
        ovat sopimusehtoja, pörssin hinta on arvio. Tarkistuspäivä vastaa
        kysymykseen "onko tämä hinta vanha", joka on jokaisen
        vertailusivun ensimmäinen epäilys.
      */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t border-line px-3 py-2 text-[11.5px] text-ink/55 sm:px-4 lg:px-5">
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {omaOsuusVuosi !== null && (
            <span>
              Yhtiön oma osuus{" "}
              <span className="font-data font-bold text-ink/80">
                {money(omaOsuusVuosi / 12)} €/kk
              </span>{" "}
              <span className="text-ink/45">ilman pörssin hintaa</span>
            </span>
          )}
          {plan.rating !== null ? (
            <span>
              <Star size={13} className="mr-1 inline fill-star text-star" aria-hidden />
              <span className="font-data font-bold text-ink/80">{plan.rating.toFixed(1)}</span>
              {plan.reviews !== null ? ` (${plan.reviews})` : ""}
            </span>
          ) : plan.checkedAt ? (
            <span>Hinta tarkistettu {new Date(plan.checkedAt).toLocaleDateString("fi-FI")}</span>
          ) : null}
        </span>
        <Link
          href={`/sahkosopimukset/sopimus/${plan.slug}`}
          className="font-semibold text-ink/70 underline-offset-4 hover:text-ink hover:underline"
        >
          Kaikki tiedot sopimuksesta
        </Link>
      </div>
    </article>
  );
}

/**
 * Yksi hinnan osa isona lukuna.
 *
 * Laatta on tarkoituksella tyhmä: se ei tiedä mitään sopimustyypeistä
 * eikä kampanjoista, vaan saa valmiit merkkijonot. Syy on se, etta
 * marginaali ja perusmaksu kayttaytyvat eri tavalla (marginaali on
 * porssin paalle, perusmaksu ei), ja jos laatta paattelisi eron itse,
 * sama ehto olisi kahdessa paikassa.
 *
 * `selite` on aina paikalla, myos kun kampanjaa ei ole. Ilman sita kaksi
 * laattaa olisivat eri korkuisia sen mukaan onko sopimuksella kampanja,
 * ja rivien vertaaminen vaakasuoraan loppuisi siihen.
 */
function HintaLaatta({
  otsikko,
  luku,
  yksikko,
  selite,
  sitten,
}: {
  otsikko: string;
  luku: string;
  yksikko: string;
  selite: string;
  sitten: string | null;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-cream/20 bg-black/20 px-2.5 py-2 lg:min-w-[118px] lg:px-3 lg:py-2.5">
      <p className="truncate font-display text-[9.5px] font-extrabold uppercase leading-none tracking-[0.13em] text-goldInk">
        {otsikko}
      </p>
      <p className="mt-1.5 whitespace-nowrap font-data text-[21px] font-extrabold leading-none tracking-[-0.025em] text-cream lg:text-[23px]">
        {luku}
        <span className="ml-1 font-display text-[10.5px] font-bold tracking-normal text-ink/65">
          {yksikko}
        </span>
      </p>
      <p className="mt-1.5 truncate text-[10.5px] leading-tight text-ink/55">{selite}</p>
      {sitten ? (
        <p className="mt-0.5 truncate text-[10.5px] font-semibold leading-tight text-ink/80">
          {sitten}
        </p>
      ) : (
        /* Näkymätön paikanpitäjä: pitää kampanjattoman ja kampanjallisen
           laatan samankorkuisina, jotta hintarivi ei nyki listaa
           selatessa. `aria-hidden` estää ruudunlukijaa lukemasta viivaa. */
        <p className="mt-0.5 text-[10.5px] leading-tight text-ink/0" aria-hidden>
          &nbsp;
        </p>
      )}
    </div>
  );
}

/**
 * Sopimustyyppi ja uusiutuvuus.
 *
 * Omana komponenttinaan siksi, etta merkkilista on ollut kahdessa paikassa
 * ennenkin ja kopioitu lista erkanee ensimmaisessa muutoksessa. Eri tavalla
 * merkitty sopimustyyppi puhelimessa ja koneella luetaan virheeksi.
 */
function TypeBadges({ plan }: { plan: ElectricityPlan }) {
  return (
    <>
      <span className="whitespace-nowrap rounded-md border border-cream/25 bg-black/15 px-2 py-0.5 text-[10.5px] font-semibold text-ink/80">
        {TYPE_LABEL[plan.type]}
        {plan.fixedTermMonths ? ` · ${plan.fixedTermMonths} kk` : ""}
      </span>
      {plan.green && (
        /* `theme-light`: ilman sitä tausta ja teksti olisivat ember-vyöllä
           molemmat vaaleaa kermaa, eli merkki olisi tyhjä laatikko. */
        <span className="theme-light inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-accent/25 bg-accentSoft px-2 py-0.5 text-[10.5px] font-semibold text-accentDark">
          <Leaf size={11} aria-hidden /> Uusiutuva
        </span>
      )}
    </>
  );
}

/**
 * Yhtiön logo — tai sen paikka, kun logoa ei ole.
 *
 * Kumppaniyhtiöiden logot on haettu yhtiöiden omilta sivuilta kansioon
 * `public/logot/`. LAATIKKO ON KIINTEÄ, EI LOGO. Aiemmin logo sai olla
 * niin leveä kuin halusi (`max-w-[60%]`), koska se oli keskitettynä
 * pystykortin omalla vyöllään. Rivilistassa logon jälkeen tulee yhtiön
 * nimi, ja eri levyiset logot aloittaisivat nimet eri kohdasta — lista
 * lukisi siltä kuin rivit olisi ladottu käsin.
 *
 * Kiinteä laatikko + `object-contain` tarkoittaa myös, ettei tunnuksen
 * tarvitse enää olla neliö: leveä tekstilogo (Hehku, Sähkötytöt)
 * skaalautuu laatikon sisään sen omassa mittasuhteessa. Tunnusta ei
 * muokata — logon muuttaminen on tavaramerkin vääristämistä.
 *
 * Esimerkkidatan yhtiöille ei piirretä logoa: se antaisi olemattomalle
 * yhtiölle uskottavan ilmeen. Niissä näytetään nimikirjaimet.
 */
function ProviderLogo({ provider, logo }: { provider: string; logo?: string }) {
  if (logo) {
    return (
      /* Ei laattaa, ei reunusta, ei taustaa: logo istuu suoraan oranssilla
         pinnalla. Laatta laatan sisällä näyttäisi siltä, että logo on
         liitetty riviin jälkikäteen — ja juuri sitä vaikutelmaa vertailu ei
         kestä, koska se sama epäilys koskee sitten myös hintoja. */
      <Image
        src={logo}
        alt={`${provider} logo`}
        width={224}
        height={224}
        className="h-9 w-[76px] object-contain sm:h-10 sm:w-[92px]"
      />
    );
  }

  const initials = provider
    .replace(/\b(Oy|Ab|Oyj)\b/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className="grid h-9 w-[76px] place-items-center rounded-xl border border-cream/25 bg-black/15 font-display text-[15px] font-bold tracking-tight text-cream/60 sm:h-10 sm:w-[92px] sm:text-[16px]"
      title={provider}
      aria-hidden
    >
      {initials}
    </span>
  );
}
