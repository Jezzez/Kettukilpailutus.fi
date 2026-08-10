"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Leaf, Star, Tag, TrendingDown, TrendingUp } from "lucide-react";
import type { ElectricityPlan } from "@/lib/energy";
import {
  annualCost,
  campaignMonthlyCost,
  normalAnnualCost,
  ownChargesAnnual,
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
 * nyt aina halvin vuosihinta kävijän omalla kulutuksella.
 *
 * Kun molemmat merkit tarkoittavat samaa korttia, kaksi merkkiä on
 * yksi liikaa — ja kahdesta merkistä syntyy kysymys "mitä eroa
 * näillä on?", johon vertailusivulla ei kannata kuluttaa lukijan
 * huomiota juuri ennen ostonappia. Jäljelle jää kultainen sinetti.
 *
 * `note` poistettiin samalla: se sanoi "tällä hetkellä edullisin sekä
 * ensimmäisenä vuonna että kampanjan jälkeen", mikä oli vanhan
 * painotuksen väite eikä enää totta halvimmasta sopimuksesta.
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
  const yearly = annualCost(plan, kwh);

  /*
    ISO LUKU ON KAMPANJAN AIKAINEN KUUKAUSIHINTA, EI VUODEN KESKIARVO.

    Luku oli aiemmin ensimmäisen vuoden keskiarvo, eli kampanjakuukaudet
    ja niiden jälkeinen normaalihinta samassa euromäärässä. Se teki
    kampanjakorteista kalliimman näköisiä kuin mikä on se lasku, joka
    asiakkaalle oikeasti tulee ensi kuussa — ja osa kävijöistä päätteli
    siitä, ettei parempaa sopimusta ole tarjolla, vaikka oli. Menetetty
    klikki on menetetty palkkio, ja tässä se menetettiin luvulla, jota
    kukaan ei koskaan maksa sellaisenaan.

    Nyt luku vastaa kysymykseen "mitä maksan, jos teen sopimuksen
    tänään". Vuosiluku ja kampanjan jälkeinen hinta ovat edelleen
    näkyvissä alempana — ilman niitä tämä olisi houkuttelulukua, ei
    hintaa.

    HUOM: listan järjestys käyttää tätä lukua, mutta "Ketun valinta"
    -merkki EI. Merkki katsoo ensimmäisen vuoden kokonaishintaa niiden
    sopimusten joukossa, jotka voittavat asiakkaan nykyisen hinnan jo
    nyt — ks. `kokonaisuus`-kommentti ElectricityExperience.tsx:ssä.
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
    saa täyden palkin, kaksi kertaa kalliimpi puolikkaan. Kun lista on
    hintajärjestyksessä, palkit lyhenevät alaspäin mentäessä — silloin
    palkkia ei tarvitse selittää, se opettaa itsensä kahdessa
    sekunnissa. Sitä varten palkki on olemassa: silmä vertaa pituuksia
    nopeammin kuin kuutta euromäärää.
  */
  const barWidth = Math.max(8, Math.round((minCost / (monthly * 12)) * 100));

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

  /* Kampanjan jälkeinen kuukausihinta. Iso euroluku kortissa on
     KAMPANJAN AIKAINEN hinta, eli kampanjakorteissa pienempi kuin
     pysyvä hinta. Ilman tätä lukua kortti lupaisi hinnan, joka nousee
     ilman varoitusta — ja juuri se on se pettymys, joka menettää
     asiakkaan ja tuo valituksen. */
  const normalMonthly = campaign ? normalAnnualCost(plan, kwh) / 12 : null;

  /*
    ERITTELYRUUDUN HINNAT KAMPANJA EDELLÄ.

    Ruutu näytti aiemmin vain pysyvät hinnat. Cheap Energyn kortissa luki
    siis "Marginaali 0,78 c/kWh" ja "Perusmaksu 4,90 €/kk", vaikka kuusi
    ensimmäistä kuukautta maksavat 0,39 c/kWh ilman perusmaksua. Ruutu on
    kortin ainoa paikka, jossa lukee "tässä on hinta eriteltynä", joten se
    luetaan hinnastona — ja hinnasto, joka ei näytä sitä hintaa jonka
    asiakas oikeasti maksaa ensi kuussa, on kortin vahvin epäluottamuksen
    lähde. Erittely myös ristiriitasi kortin oman kampanjamerkin kanssa.

    Kampanjaluku on nyt lihavoitu rivi ja pysyvä hinta sen alla muodossa
    "6 kk, sitten 0,78 c/kWh". Järjestys on tarkoituksella tämä eikä
    toisin päin: ylempi rivi vastaa kysymykseen "mitä maksan nyt", alempi
    kysymykseen "mitä maksan sen jälkeen". Molemmat ovat päätöksen
    kannalta pakollisia.

    ÄLÄ piilota "sitten"-riviä tilan säästämiseksi. Ilman sitä kortti
    lupaisi kampanjahinnan pysyväksi, ja se on täsmälleen se pettymys,
    jota vastaan normalMonthly yllä on rakennettu.

    Kampanjan kentät ovat vapaaehtoisia, joten kampanjarivi syntyy vain
    sinne, missä kampanja oikeasti muuttaa kyseistä lukua: 20 sopimuksella
    47:stä on kampanja, ja niistä viisi muuttaa marginaalia, loput vain
    perusmaksua. Sopimus ilman kampanjaa näyttää yhden rivin kuten ennen.
  */
  const energiaPysyva =
    plan.type === "spot"
      ? `${money(plan.spotMargin ?? 0)} c/kWh + pörssi`
      : `${money(plan.energyPrice ?? 0)} c/kWh`;

  const energiaKampanja =
    plan.type === "spot"
      ? campaign?.spotMargin != null
        ? `${money(campaign.spotMargin)} c/kWh + pörssi`
        : null
      : campaign?.energyPrice != null
      ? `${money(campaign.energyPrice)} c/kWh`
      : null;

  const perusmaksuPysyva = `${money(plan.basicFee)} €/kk`;

  const perusmaksuKampanja =
    campaign?.basicFee != null ? `${money(campaign.basicFee)} €/kk` : null;

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
    MOBIILISSA YKSITYISKOHDAT AVATAAN, TYÖPÖYDÄLLÄ NE OVAT AINA AUKI.

    Kortti oli mobiilissa 527 pikseliä korkea eli 88 % puhelimen ruudusta,
    ja 21 korttia teki sivusta 30 ruudullista. Selaaminen ei silloin ole
    vertailua vaan urakka, ja urakka keskeytetään ennen ostonappia.

    Piiloon menee vain PÄÄTÖKSEN JÄLKEINEN tieto: marginaali, perusmaksu ja
    ominaisuuslista. Niitä ei lueta selatessa vaan vasta kun kaksi sopimusta
    on jo valittu vertailtavaksi. Näkyviin jää kaikki, millä valinta tehdään
    — sija, logo, tyyppi, €/kk, hintapalkki, ero nykyiseen ja kampanjan
    jälkeinen hinta.

    Kampanjan jälkeinen hinta EI mene piiloon, vaikka se on rivi lisää.
    Halvimman ensimmäisen vuoden näyttäminen ja pysyvän hinnan piilottaminen
    napin taakse olisi täsmälleen se temppu, jota tämä sivusto ei tee.

    Työpöydällä tilaa on eikä ongelmaa ollut, joten siellä kaikki näkyy
    kuten ennenkin: `hidden sm:block` piilottaa vain kapealla ruudulla.
  */
  const [avattu, setAvattu] = useState(false);

  return (
    /*
      Nosto tulee yhteisestä `.lift`-säännöstä (globals.css), ei kortin
      omasta `transition-all duration-300` -määrittelystä. Kortilla oli
      oma ajoitus, laskurilla toinen ja oppailla kolmas — eri nopeuksilla
      liikkuva sivu tuntuu tehdyltä eri käsillä, ja juuri se on se
      "ei ole sulava" -vaikutelma. Yksi sääntö, yksi nopeus, koko sivusto.
      `.lift` kunnioittaa myös `prefers-reduced-motion`-asetusta.
    */
    <article
      /*
        KÄRKIKORTIN KEHYS.

        Kaikki kortit ovat oranssia, joten ykkösen piti erottua jollain
        muulla kuin pohjavärillä. Kermanvalkoinen rengas kehyksen
        ulkopuolella on kirkkain arvo koko ruudukossa heti ostonapin
        jälkeen, eikä se muuta kortin kokoa — reunan paksuntaminen olisi
        siirtänyt ykköskortin sisällön pikselin muita alemmas ja
        rikkonut sen vaakalinjan, jolla hintoja verrataan.

        Rengas seuraa SIJAA eikä merkkiä: se kertoo "tämä on ensimmäinen
        valitsemassasi järjestyksessä". Uusia värejä ei tullut yhtään.
      */
      className={`lift theme-ember ember-surface group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-cardHover ${
        rank === 1 ? "ring-2 ring-cream/45" : ""
      } ${
        foxPick ? "border-gold hover:border-gold" : "border-line hover:border-cream/55"
      }`}
    >
      {/*
        MERKKIPALKKI ON AINA 44 PIKSELIÄ KORKEA — MYÖS ILMAN MERKKIÄ.

        Kaksi korttia kuudesta saa merkin. Jos merkitön kortti jättää
        palkin kokonaan pois, sen sisältö nousee palkin verran ylemmäs,
        ja kuuden kortin hintaluvut asettuvat kolmelle eri vaakalinjalle.
        Vertailu tehdään pyyhkäisemällä katse rivin yli: kun luvut ovat
        samalla linjalla, erot lukee pysähtymättä; kun eivät, jokainen
        kortti pitää lukea erikseen. Tyhjä palkki maksaa 44 pikseliä
        korkeutta ja ostaa sillä koko listan luettavuuden.

        YKSI PALKKI, KAKSI TIETOA: MERKKI VASEMMALLA, KAMPANJA OIKEALLA.

        Kampanjamerkki ei mahtunut merkkinauhan rinnalle omaksi toiseksi
        palkiksi rikkomatta 44 pikselin sääntöä, joten palkki on yksi
        rivi, jonka vasen puoli kertoo Ketun merkin ja oikea kumppanin
        tarjouksen. Korkeus pysyy samana kaikissa yhdistelmissä.
      */}
      <div
        className={`flex h-10 items-center gap-2 px-3.5 sm:px-4 ${
          foxPick ? "bg-gold" : "border-b border-white/10 bg-black/10"
        }`}
      >
        {foxPick && (
          <div className="flex min-w-0 items-center gap-2.5">
            {/*
              KULTAINEN TASSU TUMMALLA LAATALLA — EI TASSUA SUORAAN NAUHALLE.

              Nauha on kultaa, joten kultainen tassu suoraan sen päällä olisi
              kaksi samaa sävyä päällekkäin eli näkymätön. Tumma pyöreä laatta
              antaa tassulle taustan, ja samalla merkki alkaa lukea sinettinä
              eikä ikonina — juuri sitä se on. Kilpailijat rakentavat saman
              luottamuksen kolmannen osapuolen sertifikaateilla (TÜV, eKomi),
              joita Ketulla ei ole eikä niitä keksitä. Oma sinetti on ainoa
              rehellinen tapa saada sama visuaalinen paino.

              Tassu on sivuston yleinen allekirjoitus: sama muoto toistuu
              jokaisen kortin ominaisuusriveillä, joten lukija on jo oppinut,
              että tassun vieressä oleva väite on Ketun oma kannanotto eikä
              sähköyhtiön markkinointitekstiä.
            */}
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#4A2E06] text-gold shadow-[0_1px_2px_rgba(74,26,2,0.4)]">
              <FoxPaw size={15} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-[#4A2E06]">
                Ketun valinta
              </p>
              {/*
                PERUSTELU HETI MERKIN ALLA, EI RIVIN OIKEASSA REUNASSA.

                Oikeassa reunassa se katosi mobiilissa kokonaan ja työpöydällä
                se luki niin kaukana merkistä, ettei sitä yhdistetty siihen.
                Vertailusivun yleisin epäily on "onko tämä nosto ostettu?", ja
                siihen pitää vastata siinä sekunnissa kun epäily syntyy.

                RIVI SANOO NYT TÄSMÄLLEEN SEN, MITÄ KOODI LASKEE. Aiemmin
                tässä luki "tällä hetkellä edullisin myös kampanjan
                jälkeen" — se oli vanhan painotetun valinnan väite, ja kun
                merkki siirtyi halvimpaan vuosihintaan, väite lakkasi
                olemasta totta. Väärä perustelu merkin alla on pahempi kuin
                perustelun puuttuminen: se on tarkistettavissa kortin omista
                luvuista, ja kiinni jäänyt vertailusivu menettää klikin
                lisäksi paluukäynnin.

                Nyt rivi kertoo saman asian kuin listan järjestys ja
                hintapalkki, eli lukija voi todeta sen itse kolmesta
                paikasta. Se on tämän merkin koko uskottavuus.

                RIVI ON LYHYT, KOSKA SEN ON MAHDUTTAVA KAMPANJAMERKIN
                VIEREEN. Pidempi muoto ("Edullisin vuosihinta
                kulutuksellasi") katkesi kolmella pisteellä juuri niissä
                korteissa, joissa on kampanja — eli useimmiten. Katkaistu
                perustelu merkin alla lukee virheenä, ja virheeltä
                näyttävä merkki on huonompi kuin ei merkkiä lainkaan.
              */}
              {/* Perustelu vaihtui, kun merkin mittari vaihtui. Merkki ei
                  tarkoita halvinta kuukausihintaa — sen paikan voi ostaa
                  kolmen kuukauden houkuttimella — vaan halvinta ensimmäistä
                  vuotta. Merkin alarivin PITÄÄ sanoa sama asia kuin mittari,
                  muuten kortti väittää jotain, mitä sen omat luvut eivät tue.
                  Rivi on lyhyt, koska se katkeaa kampanjamerkin vieressä. */}
              <p className="mt-1 truncate font-data text-[10.5px] font-bold leading-none text-[#5C3A08]">
                Paras ensimmäinen vuosi
              </p>
            </div>
          </div>
        )}
        {!foxPick && strength && (
          /*
            MERKITTÖMÄN KORTIN VAHVUUSLAUSE — HILJAINEN, EI KOLMAS MERKKI.

            Palkki oli merkittömillä korteilla tyhjä, ja tyhjä palkki luki
            keskeneräiseltä juuri niissä korteissa, jotka muutenkin katosivat
            massaan. Nyt siinä lukee se yksi asia, jossa kortti on koko listan
            kärki — tai ero halvimpaan, jos kärkeä ei ole. Molemmat ovat
            laskettuja lukuja, eivät markkinointilauseita.

            TYPOGRAFIA ON TARKOITUKSELLA HILJAINEN: pieni kirjain, ei
            harvennusta, ei ikonia, kerma 70 %:n peitolla. "Edullisin" ja
            "Ketun valinta" ovat versaalilla, harvennettuina ja kirkkaalla
            nauhalla. Jos vahvuuslause näyttäisi samalta, kortteja olisi kuusi
            merkittyä eli nolla merkittyä — merkki toimii vain, jos merkittömiä
            on enemmän. Tämä on kuvateksti, ei mitali.

            Ei valkoista: kerma on sivuston oma vaalea, ja kiinteä valkoinen
            olisi kolmas vaalea sävy oranssin päällä.
          */
          <p className="flex min-w-0 items-center gap-2 text-[11.5px] font-semibold leading-none text-cream/70">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cream/45" aria-hidden />
            <span className="truncate">{strength}</span>
          </p>
        )}
        {campaign && (
          /*
            KERMANVALKOINEN LAATTA TUMMALLA PALKILLA, TUMMA VAALEALLA.

            Tyhjä palkki on tarkoituksella tummennettu, jotta merkitön
            kortti ei saisi merkkiä. Kampanjamerkki saa silti olla kirkas:
            se EI ole koristeraita vaan kortin ainoa aikarajattu tieto,
            joten sen lukeminen merkiksi on oikein.
          */
          <span
            className={`ml-auto flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-display text-[10.5px] font-bold leading-none ${
              foxPick ? "bg-[#4A2E06] text-cream" : "bg-cream text-[#A83E0A]"
            }`}
            title={campaign.limit ? `Tarjous: ${campaign.limit}` : "Kumppanin oma tarjous"}
          >
            <Tag size={11} className="shrink-0" aria-hidden />
            {campaign.label}
          </span>
        )}
      </div>

      {/*
        LOGOKAISTA — VAALEA VYÖ KORTIN YLÄOSASSA, LOGO ISONA KESKELLÄ.

        Logo oli aiemmin 40 pikselin laatta yhtiön nimen vieressä. Siinä koossa
        se ei tehnyt työtään: sähkövertailussa yhtiö tunnistetaan logosta
        nopeammin kuin nimestä, ja tunnistettu yhtiö madaltaa kynnystä painaa
        "Tee sopimus" -nappia. Tuntematon yhtiö taas saa kävijän poistumaan
        googlaamaan — ja se kävijä ei useimmiten palaa. Peukalonkynnen kokoinen
        kuvake ei ehdi tuottaa sitä tunnistusta.

        VYÖ ON ORANSSI, EI VAALEA. Jessen valinta: vaalea kaista katkaisi
        kortin kahtia ja näytti siltä, että logo on liimattu päälle. Oranssilla
        kortti luetaan yhtenä pintana ja brändi pysyy yhtenäisenä.

        Hinta on se, että logoja ei ole tehty oranssille pohjalle. Osalla
        kumppaneista tunnus on läpinäkyvä PNG (Fortum, Nordic Green, Oomi,
        Vattenfall) ja istuu suoraan vyölle. Osalla tunnus tulee mukanaan oman
        värillisen neliönsä kanssa (Aalto tummanvihreä, Cheap Energy keltainen,
        Hehku persikka) — niitä ei saa muokata läpinäkyväksi, koska tunnuksen
        muuttaminen on tavaramerkin vääristämistä. Ne näkyvät siis värillisinä
        neliöinä oranssilla. Ainoa oikea korjaus on hakea kumppanin omat
        läpinäkyvät logotiedostot (Adtractionin mediapankki), ei kuvankäsittely.

        `theme-ember` kääntää `bg-white`-luokan oranssiksi, joten vyö tehdään
        `bg-black/10`-kerroksella: sama oranssi hitusen syvempänä, jolloin
        kortissa on yhä rakennetta ilman toista väriä.

        SIJALUKU on absoluuttisesti vasemmassa reunassa: rivissä se työntäisi
        logon numeron verran oikealle, eivätkä kuuden kortin logot osuisi
        samaan pystylinjaan.
      */}
      <div className="relative flex items-center justify-center border-b border-cream/15 bg-black/10 px-12 py-4">
        {rank !== undefined && (
          /*
            KOLME KÄRKISIJAA EROTTUVAT — VALOARVOLLA, EI MITALEILLA.

            KETUN VALINNALLA ON NYT NUMERO 1, EI TASSUA. Aiemmin kortti
            saattoi olla nostettu listan kärkeen painotetun valinnan
            perusteella, jolloin siinä ei voinut lukea sijalukua: numero
            olisi väittänyt järjestystä, jota kortin omat hinnat eivät
            tue. Kun suositus on aina halvin, lista on puhtaassa
            hintajärjestyksessä ja merkkikortti on aidosti ykkönen —
            numero ja merkki kertovat saman asian eivätkä riitele.

            Palkintopallin idea on oikea: kolmen kärki pitää lukea
            palkintosijoina eikä juoksevana numerointina. Mitaliemojit
            🥇🥈🥉 eivät silti käy. Ne ovat käyttöjärjestelmän omia
            värikuvakkeita, eli ne näyttävät erilaisilta jokaisella
            laitteella eikä niiden väreihin voi vaikuttaa — punaiset
            nauhat ja harmaa hopea toisivat sivulle kolme uutta väriä
            kahden sallitun rinnalle. Emoji lukee myös leikkisänä, ja
            21 numeroa kolmen emojin perässä näyttäisi virheeltä.

            Sama järjestys tehdään siis kirkkaudella: 1. täysi kerma,
            2. vahva kermareunus, 3. himmeä kermareunus, loput vaimeat.
            Kolme kärkeä erottuu yhdellä silmäyksellä, ilme pysyy
            aikuisena eikä uusia värejä tule yhtään.
          */
          <span
            className={`absolute left-3 top-1/2 grid -translate-y-1/2 place-items-center rounded-lg font-data font-extrabold tabular-nums ${
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
      </div>

      {/*
        NIMI JA MERKIT KESKITETTYNÄ LOGON ALLE.

        Vasemmalle tasattu nimi keskitetyn logon alla näyttäisi siltä, että
        toinen niistä on pudonnut väärään kohtaan. Kun koko yläosa on yhdellä
        keskilinjalla, kortti luetaan yhtenä tuotteena eikä kahdesta osasta
        kootuksi.

        Tyyppimerkit ovat samassa lohkossa eivätkä omalla rivillään: yksi
        vaakaviiva vähemmän kortissa. Kun kortteja on kymmeniä allekkain,
        viivat alkavat lukea raitakuviona eikä rakenteena — juuri se saa
        listan näyttämään tuhannelta samalta kortilta.
      */}
      <div className="border-b border-line px-3.5 py-3 text-center sm:px-4">
        <h3 className="truncate font-display text-[16px] font-bold leading-tight text-ink">
          <Link href={`/sahkosopimukset/sopimus/${plan.slug}`} className="underline-offset-4 hover:underline">
            {plan.provider}
          </Link>
        </h3>
        <p className="mt-0.5 truncate text-[12.5px] text-ink/60">{plan.name}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          <TypeBadges plan={plan} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div>
          {/*
            YKSI DESIMAALI, EI PYÖRISTYSTÄ KOKONAISIIN EUROIHIN.

            Kokonaisina euroina 367 €/v ja 376 €/v näyttivät molemmat
            "31 €/kk". Silloin "Ketun valinta" -kortissa luki "ei halvin",
            vaikka sen hinta näytti täsmälleen samalta kuin halvimman —
            ja mobiilin tulospalkki väitti samaa lukua edullisimmaksi.
            Lukija, joka huomaa tuollaisen ristiriidan, ei enää usko
            muitakaan lukuja, ja juuri lukujen uskominen on tämän sivun
            koko ansaintalogiikka. Desimaali maksaa vähän silmää ja
            poistaa ristiriidan kokonaan.

            Sama tarkkuus on heron kärkiluvussa ja tulospalkissa —
            kolmen eri pyöristyksen näyttäminen olisi sama ongelma
            uudessa muodossa.

            Samasta syystä myös alla oleva ero-lätkä näyttää desimaalin.
            Se pyöristi aiemmin kokonaisluvuksi, jolloin suosituspaneeli
            sanoi "0,6 € / kk" ja saman sopimuksen kortti sanoi "1 € / kk"
            yhdellä ja samalla ruudulla. Kaksi eri lukua samasta asiasta
            on pahempi kuin pieni luku.
          */}
          {/* Ero nykyiseen ENNEN hintaa: se on ainoa luku, jota ei voi
              päätellä muualta kortista, ja se on syy lukea loput.

              LÄTKÄ NÄKYY VAIN KUN EROA ON. Alle puolen euron kohdalla
              tässä luki aiemmin "Käytännössä sama hinta kuin nyt". Se ei
              kertonut mitään, mitä kortin omat luvut eivät jo kertoneet,
              ja se vei parhaan paikan kortin yläreunasta — sen paikan,
              jossa muissa korteissa lukee säästö. Rivi ei myöskään anna
              mitään tehtävää: se ei kehota vaihtamaan eikä varoita
              vaihtamasta. Tyhjä tila lukee nopeammin kuin sisällötön
              lause, ja säästölätkät erottuvat kun niitä ei ympäröi
              joukko yhtä painavan näköisiä "ei mitään" -lätkiä. */}
          {diffMonthly !== null && Math.abs(diffMonthly) > 0.5 && (
            <p
              className={`mb-2 inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[12px] ${
                diffMonthly > 0.5
                  ? "border-cream/45 bg-black/15 text-cream"
                  : "border-cream/15 bg-black/10 text-ink/65"
              }`}
            >
              {diffMonthly > 0.5 ? (
                <>
                  <TrendingDown size={13} className="shrink-0" aria-hidden />
                  <span>
                    Säästät{" "}
                    <strong className="font-data font-bold">
                      {diffMonthly.toLocaleString("fi-FI", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}{" "}
                      €
                    </strong>{" "}
                    / kk {campaign ? "kampanjan aikana" : "nykyiseen verrattuna"}
                  </span>
                </>
              ) : diffMonthly < -0.5 ? (
                <>
                  <TrendingUp size={13} className="shrink-0" aria-hidden />
                  <span>
                    <strong className="font-data font-bold">
                      {Math.abs(diffMonthly).toLocaleString("fi-FI", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}{" "}
                      €
                    </strong>{" "}
                    / kk kalliimpi kuin nykyinen{campaign ? " jo kampanjahinnalla" : ""}
                  </span>
                </>
              ) : null}
            </p>
          )}

          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-data font-price text-[30px] font-extrabold leading-none tracking-[-0.03em] text-ink">
              {monthly.toLocaleString("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} €
            </span>
            <span className="font-display text-[13px] font-semibold text-ink/60">/ kk</span>
            {/* Aikaraja on ISON LUVUN VIERESSÄ, ei alaviitteenä.

                Iso luku on kampanjahinta, joka päättyy. Jos kesto lukisi
                vasta kortin alalaidassa, luku ehtisi lukeutua pysyväksi
                hinnaksi ennen kuin lukija näkee ehdon — ja ehto, joka
                luetaan vasta laskusta, on peruutus eikä palkkio. */}
            {campaign ? (
              <span className="font-display text-[12px] font-semibold text-ink/50">
                ensimmäiset {campaign.months} kk
              </span>
            ) : null}
          </div>

          <div
            className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/20"
            role="img"
            aria-label={`Hinta suhteessa tämän hetken edullisimpaan: mitä pidempi palkki, sitä edullisempi sopimus. Tämä ${barWidth} prosenttia täydestä.`}
            title="Mitä pidempi palkki, sitä edullisempi sopimus tällä hetkellä"
          >
            <div
              className="h-full rounded-full bg-cream transition-all duration-500"
              style={{ width: `${barWidth}%` }}
            />
          </div>

          {/* Vuosihinta JA sen alkuperä samalla rivillä. Pelkkä
              "168 € vuodessa" luetaan yleisenä listahintana; ilman
              lukua taas katoaa se summa, jolla sopimuksia oikeasti
              vertaillaan. Rivi sanoo molemmat eikä vie ylimääräistä
              korkeutta. */}
          <p className="mt-2 text-[12px] text-ink/60">
            {yearly.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} € vuodessa
            <span className="mx-1.5 text-cream/40" aria-hidden>·</span>
            {campaign ? "ensimmäinen vuosi kampanjoineen" : "laskettu kulutuksellasi"}
          </p>

          {/*
            KAMPANJAN JÄLKEINEN HINTA SANOTAAN HETI ISON LUVUN ALLA.

            Iso euroluku on kampanjan aikainen hinta. Kampanjakortissa se
            on siis pienempi kuin hinta, jonka asiakas maksaa kampanjan
            päätyttyä — ja tämä rivi on ainoa paikka, jossa pysyvä
            kuukausihinta sanotaan euroina. Jos kortti näyttäisi
            pelkän kampanjaluvun, se voittaisi vertailun tarjouksella ja
            asiakas huomaisi eron vasta laskusta — se on yksi peruutus,
            yksi menetetty palkkio ja yksi asiakas, joka ei palaa. Kolmen
            kuukauden tarjous ei saa ostaa ykköspaikkaa hiljaisuudella.

            Rajoitus ("vain uusille asiakkaille") on samalla rivillä:
            se on ainoa asia, joka voi tehdä koko tarjouksesta lukijalle
            mahdottoman, ja sen lukeminen vasta kumppanin sivulta on
            hukkaan mennyt klikki molemmille osapuolille.
          */}
          {campaign && normalMonthly !== null && (
            <p className="mt-1 text-[12px] text-ink/60">
              Kampanjan jälkeen{" "}
              <span className="font-data font-bold text-ink/80">
                {normalMonthly.toLocaleString("fi-FI", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}{" "}
                €
              </span>{" "}
              / kk
              {campaign.limit ? (
                <>
                  <span className="mx-1.5 text-cream/40" aria-hidden>·</span>
                  {campaign.limit}
                </>
              ) : null}
            </p>
          )}
        </div>

        {/* Avattava osa alkaa. `flex-1` on tässä kääreessä, jotta ostonappi
            painuu kortin alareunaan myös suljettuna — muuten suljetut kortit
            olisivat eri korkuisia ja napit sahalaitana. */}
        <div
          id={`tiedot-${plan.id}`}
          className={`flex-1 flex-col ${avattu ? "flex" : "hidden sm:flex"}`}
        >
        {/* Ks. `energiaKampanja`-kommentti komponentin ylaosassa. */}
        <dl className="mt-3.5 space-y-2 rounded-xl border border-line bg-black/10 p-3">
          <div className="flex items-start justify-between gap-3 text-[12px]">
            <dt className="text-ink/60">{plan.type === "spot" ? "Marginaali" : "Energia"}</dt>
            <dd className="text-right font-data font-bold text-ink">
              {energiaKampanja ?? energiaPysyva}
              {energiaKampanja && campaign && (
                <span className="mt-0.5 block text-[11px] font-medium leading-tight text-ink/55">
                  {campaign.months} kk, sitten {energiaPysyva}
                </span>
              )}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3 text-[12px]">
            <dt className="text-ink/60">Perusmaksu</dt>
            <dd className="text-right font-data font-bold text-ink">
              {perusmaksuKampanja ?? perusmaksuPysyva}
              {perusmaksuKampanja && campaign && (
                <span className="mt-0.5 block text-[11px] font-medium leading-tight text-ink/55">
                  {campaign.months} kk, sitten {perusmaksuPysyva}
                </span>
              )}
            </dd>
          </div>

          {/* Ks. `omaOsuusVuosi`-kommentti komponentin ylaosassa. Erotettu
              viivalla, koska tama ei ole hinnaston rivi vaan yhteenveto
              kahdesta ylla olevasta. */}
          {omaOsuusVuosi !== null && (
            <div className="flex items-start justify-between gap-3 border-t border-line pt-2 text-[11.5px]">
              <dt className="text-ink/55">Ilman pörssin hintaa</dt>
              <dd className="text-right font-data font-bold text-ink/75">
                {(omaOsuusVuosi / 12).toLocaleString("fi-FI", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                €/kk
                <span className="mt-0.5 block text-[10.5px] font-medium leading-tight text-ink/50">
                  vain yhtiön oma osuus
                </span>
              </dd>
            </div>
          )}
        </dl>

        {/*
          Luettelomerkkinä ketun tassu, ei harmaa väkänen. Väkänen on sama
          merkki kuin jokaisella verkkokaupalla, joten silmä ohittaa sen.
          Tassu on brändin oma ele ja toistuu joka kortissa — se saa listan
          näyttämään Ketun suositukselta eikä tuotekuvauksen kopiolta.
          Sama tassu on "Ketun valinta" -merkissä, joten kahden välille
          syntyy yhteys ilman että sitä tarvitsee selittää.
        */}
        <ul className="mt-3 flex-1 space-y-1">
          {plan.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-2 text-[12.5px] leading-snug text-ink/80">
              <span className="mt-[3px] shrink-0 text-cream/75" aria-hidden>
                <FoxPaw />
              </span>
              {f}
            </li>
          ))}
        </ul>
        </div>
        {/* Avattava osa loppuu. */}

        {/*
          TÄHTIRIVI NÄKYY VAIN JOS ARVIO ON OLEMASSA.

          Kumppaniyhtiöille ei ole riippumatonta arviolähdettä, joten
          niiden `rating` on `null`. Keksitty 4,6 tähteä olisi kortin
          halvin tapa näyttää luotettavalta ja samalla ainoa väite, jonka
          lukija voi kumota yhdellä haulla — ja kun yksi luku paljastuu
          keksityksi, myös hinnat lakkaavat kelpaamasta. Sivuston koko
          ansaintalogiikka on siinä, että luvut kestävät tarkistuksen.

          Kun arviota ei ole, rivin vasen puoli jää tyhjäksi ja "Tiedot"
          siirtyy oikeaan reunaan `justify-between`-säännön mukaan. Rivin
          korkeus säilyy, joten korttien vaakalinja ei liiku.
        */}
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
          {plan.rating !== null ? (
            <p className="flex items-center gap-1 text-[12px] text-ink/60">
              <Star size={13} className="fill-star text-star" aria-hidden />
              <span className="font-data font-bold text-ink">{plan.rating.toFixed(1)}</span>
              {plan.reviews !== null ? ` (${plan.reviews})` : ""}
            </p>
          ) : (
            /* Tarkistuspäivä arvion tilalla: se on tieto, joka on
               oikeasti olemassa, ja se vastaa kortin toiseksi yleisimpään
               epäilyyn ("onko tämä hinta vanha?"). */
            <p className="text-[12px] text-ink/55">
              {plan.checkedAt
                ? `Hinta tarkistettu ${new Date(plan.checkedAt).toLocaleDateString("fi-FI")}`
                : ""}
            </p>
          )}
          {/*
            SAMA PAIKKA, KAKSI ERI ELETTÄ RUUDUN LEVEYDEN MUKAAN.

            Työpöydällä yksityiskohdat ovat jo näkyvissä, joten linkki vie
            sopimussivulle kuten ennenkin. Mobiilissa samassa kohdassa on
            nappi, joka avaa piilotetun osan kortin sisällä.

            Mobiilissa EI näytetä molempia. Kaksi lähes samannimistä linkkiä
            ostonapin vieressä jakaisi huomion juuri siinä kohdassa, jossa
            sivusto ansaitsee — ja sopimussivulle pääsee joka tapauksessa
            yhtiön nimestä kortin yläreunassa.
          */}
          <button
            type="button"
            onClick={() => setAvattu((v) => !v)}
            aria-expanded={avattu}
            aria-controls={`tiedot-${plan.id}`}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-cream/25 bg-black/15 px-2.5 py-1 text-[12.5px] font-semibold text-ink/75 sm:hidden"
          >
            {avattu ? "Piilota" : "Tiedot"}
            <ChevronDown
              size={14}
              className={avattu ? "rotate-180" : ""}
              aria-hidden
            />
          </button>
          <Link
            href={`/sahkosopimukset/sopimus/${plan.slug}`}
            className="hidden text-[12.5px] font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline sm:inline"
          >
            Tiedot
          </Link>
        </div>

        {/*
          NAPIN TEKSTI KERTOO, MITÄ KLIKKI OIKEASTI TEKEE.

          "Tee sopimus" on kumppanilinkki, josta Kettu saa palkkion.
          Sopimukselle, jonka yhtiön kanssa ei ole kumppanuutta, sama
          teksti lupaisi tilausputken, jota linkin päässä ei ole.
          Neutraali teksti pitää listan avoinna myös yhtiöille, jotka
          eivät maksa — ja juuri se on ainoa syy uskoa, ettei järjestystä
          ole ostettu. Vertailu, joka näyttää vain maksavat yhtiöt, on
          mainos, ja mainokselta ei kysytä neuvoa toista kertaa.
        */}
        <div className="theme-light mt-2.5">
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
            className="w-full"
          >
            {plan.partner ? "Tee sopimus" : "Siirry palveluntarjoajalle"}
          </AffiliateButton>
        </div>
      </div>
    </article>
  );
}

/**
 * Sopimustyyppi ja uusiutuvuus — samat merkit kahdessa paikassa.
 *
 * Mobiilissa merkit ovat yhtiön nimen alla, työpöydällä omalla rivillään.
 * Yhtenä komponenttina siksi, että kahteen paikkaan kopioitu merkkilista
 * erkanee ensimmäisessä muutoksessa, ja eri tavalla merkitty sopimustyyppi
 * puhelimessa ja koneella on juuri se ero, joka luetaan virheeksi.
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
 * Kumppaniyhtiöiden logot on haettu yhtiöiden omilta sivuilta ja normalisoitu
 * 256×256 PNG:ksi kansioon `public/logot/`. Neliömäinen tunnus eikä tekstilogo:
 * tekstilogot ovat eri levyisiä, ja kahdeksan eri suhteista logoa 40 pikselin
 * laatassa näyttäisi siltä, että ne on liitetty huolimattomasti.
 *
 * Loput 24 sopimusta ovat esimerkkidataa, eikä keksitylle yhtiölle piirretä
 * logoa — se antaisi olemattomalle yhtiölle uskottavan ilmeen. Niissä
 * näytetään nimikirjaimet: rehellinen paikanpitäjä, joka näyttää silti
 * viimeistellyltä.
 */
function ProviderLogo({ provider, logo }: { provider: string; logo?: string }) {
  if (logo) {
    return (
      /* Ei laattaa, ei reunusta, ei taustaa: logo istuu suoraan oranssilla
         vyöllä. Laatta laatan sisällä näyttäisi siltä, että logo on liitetty
         korttiin jälkikäteen — ja juuri sitä vaikutelmaa vertailusivu ei
         kestä, koska se sama epäilys koskee sitten myös hintoja. */
      <Image
        src={logo}
        alt={`${provider} logo`}
        width={224}
        height={224}
        className="h-14 w-auto max-w-[60%] object-contain"
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
      className="grid h-14 w-14 place-items-center rounded-2xl border border-cream/25 bg-black/15 font-display text-[19px] font-bold tracking-tight text-cream/60"
      title={provider}
      aria-hidden
    >
      {initials}
    </span>
  );
}
