"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf, Star, Tag, TrendingDown, TrendingUp } from "lucide-react";
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
  const yearly = annualCost(plan, kwh);

  /*
    ISO LUKU ON ENSI KUUN HINTA. JÄRJESTYS ON ENSIMMÄINEN VUOSI.

    Nämä ovat tarkoituksella eri luvut, ja ero on koko kortin idea.

    Iso luku on se, mitä laskussa lukee ensi kuussa. Kukaan ei koskaan
    maksa keskiarvoa yhtenäkään kuukautena, eikä keskiarvoa voi verrata
    omaan laskuun — ja oma lasku on ainoa vertailukohta, joka lukijalla
    on. Nimeämätön keskiarvo isolla fontilla luetaan silti ensi kuun
    hinnaksi, joten se on sekä väärä luku että väärin luettu.

    Järjestys, palkki, "Ketun valinta" ja ero nykyiseen lasketaan silti
    ensimmäisen vuoden kokonaishinnasta. Muuten neljän kuukauden houkutin
    päihittää vuoden kestävän alennuksen: Aalto Luotsi nousi kerran
    ykköseksi hinnalla 31,6 €/kk vaikka maksaa ensimmäisenä vuonna 504 €
    ja sen jälkeen 47,2 €/kk, ja halvin sopimus oli kahdeksantena.

    SEURAUS, JOKA ON HYVÄKSYTTY TIETOISESTI: lista ei ole ison luvun
    mukaisessa järjestyksessä. Kampanjakortti voi näyttää halvemmalta
    kuin yläpuolinen ja olla silti alempana. Juuri sen näkeminen on
    lukijalle se hyödyllinen havainto, ja kortti selittää sen itse
    kahdella rivillä: "sitten X €/kk" ja "Y € vuodessa".
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

  /* Kampanjan jälkeinen pysyvä kuukausihinta. Iso euroluku kortissa on
     kampanjahinta, joka loppuu, joten tämä on sen pariluku: ilman sitä
     kortti lupaisi hinnan, joka nousee ilman varoitusta. */
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
    KAIKKI HINTATIEDOT NÄKYVÄT SAMALLA KERTAA.

    Marginaali, perusmaksu, yhtiön oma osuus ja ominaisuuslista ovat nyt
    suoraan jokaisessa kortissa sekä puhelimella että työpöydällä. Näin
    kävijä voi tarkistaa hinnan muodostumisen ilman ylimääräistä klikkausta.
  */
  return (
    /*
      PYSTYKORTISTA VAAKARIVIKSI — MIKSI KOKO RAKENNE VAIHTUI.

      Kortti oli 530 pikseliä korkea kolmen sarakkeen ruudukossa. Puhelimella
      se tarkoitti yhtä sopimusta ruudullista kohti: 24 sopimuksen silmäily
      oli 24 pyyhkäisyä, eikä kukaan tee sitä loppuun. Vertailu, joka ei
      mahdu silmäiltäväksi, ei ole vertailu vaan selauslista, ja keskeytetty
      selaus ei koskaan päädy "Tee sopimus" -nappiin.

      Rivi ratkaisee saman asian mitä pystykortti yritti: se laittaa saman
      tiedon samaan pystylinjaan JOKAISESSA sopimuksessa. Hinta on aina
      samalla kohdalla vasemmalta, joten hintojen vertailu on katseen
      pudottaminen alaspäin — ei kortista toiseen hyppimistä. Kolmen
      sarakkeen ruudukossa se ei onnistunut, koska vierekkäisten korttien
      sisältö oli eri korkeudella heti kun yhdessä oli kampanjarivi ja
      toisessa ei.

      MITÄ JÄI NÄKYVIIN: sija, logo, yhtiö, sopimustyyppi, €/kk,
      hintapalkki, ensimmäisen vuoden hinta, kampanjan jälkeinen hinta,
      ero nykyiseen ja ostonappi. Ne ovat kaikki päätöksentekotietoa.

      MARGINAALI, PERUSMAKSU, YHTIÖN OMA OSUUS JA OMINAISUUSLISTA näkyvät
      nyt suoraan jokaisessa kortissa. Hintojen erittely on osa päätöstä,
      joten käyttäjän ei tarvitse avata sitä erikseen.

      MERKKINAUHA EI OLE ENÄÄ AINA PAIKALLA. Tyhjä 44 pikselin nauha oli
      olemassa vain siksi, että vierekkäisten korttien hinnat osuisivat
      samalle vaakalinjalle. Rivilistassa vierekkäisiä kortteja ei ole,
      joten koko perustelu katosi — ja sen mukana 44 pikseliä jokaisesta
      merkittömästä sopimuksesta.
    */
    <article
      className={`lift theme-ember ember-surface group relative overflow-hidden rounded-2xl border shadow-cardHover ${
        rank === 1 ? "ring-2 ring-cream/45" : ""
      } ${
        foxPick ? "border-gold hover:border-gold" : "border-line hover:border-cream/55"
      }`}
    >
      {/*
        KETUN VALINTA ON OHUT NAUHA, EI KORTIN LEVYINEN LOHKO.

        Merkki tarvitsee yhä oman pintansa: kultainen laatta rivin sisällä
        olisi ollut kolmas lätkä sopimustyypin ja kampanjan rinnalla, eikä
        kolmesta samankokoisesta lätkästä erotu yksikään. Nauha vie 28
        pikseliä ja saa yhden rivin näyttämään erilaiselta koko listassa.

        Perustelu "Paras 1. vuosi" on samalla rivillä eikä sen alla: rivi
        on matala, ja kaksirivinen merkki söisi nauhan koko hyödyn.
      */}
      {foxPick && (
        <div className="flex h-7 items-center gap-2 bg-gold px-3 sm:px-4">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#4A2E06] text-gold">
            <FoxPaw size={11} />
          </span>
          <p className="truncate font-display text-[10.5px] font-bold uppercase leading-none tracking-[0.14em] text-[#4A2E06]">
            Ketun valinta
          </p>
          <span className="shrink-0 font-data text-[10.5px] font-bold leading-none text-[#5C3A08]">
            Paras 1. vuosi
          </span>
        </div>
      )}

      {/*
        RIVIN SARAKKEET.

        Työpöytä: [sija+logo] [nimi ja merkit] [hinta ja palkki] [nappi].
        Kolme ensimmäistä ovat kiinteässä suhteessa, jotta hintasarake
        alkaa jokaisessa rivissä samasta kohdasta — se on koko rivimuodon
        syy. Nappisarake on `auto`, koska napin leveys on sen tekstin
        mittainen ja kahden eri tekstin ("Tee sopimus" /
        "Siirry palveluntarjoajalle") venyttäminen samaan mittaan tekisi
        lyhyemmästä oudon leveän.

        Puhelin: kaksi saraketta. Ylärivi on logo ja nimi, sen alle
        koko leveydeltä hinta ja nappi. Rivin korkeus on noin 190
        pikseliä, eli 700 pikselin ruudulle mahtuu kolme sopimusta.
      */}
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-3 p-3 sm:grid-cols-[auto_minmax(0,1.05fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-x-5 sm:p-4">
        {/*
          SIJALUKU JA LOGO SAMASSA SARAKKEESSA, LOGOLLE KIINTEÄ LAATIKKO.

          Logo oli ennen `max-w-[60%]`, jolloin jokainen logo oli eri
          levyinen ja yhtiöiden nimet alkoivat eri kohdasta. Pystykortissa
          sillä ei ollut väliä, koska nimi oli logon alla keskitettynä.
          Rivissä sillä on: eri kohdasta alkavat nimet lukevat siltä, että
          rivit on ladottu käsin eri leveyksille.

          Kiinteä laatikko ratkaisee samalla sen ongelman, jonka takia
          logojen piti olla neliöitä. Nyt levyinen tekstilogo (Hehku,
          Sähkötytöt) skaalautuu laatikon sisään `object-contain`-säännöllä
          eikä työnnä mitään sivuun.

          Sijaluvun kirkkausportaikko on ennallaan: 1. täysi kerma, 2.–3.
          kermareunus, loput vaimeat. Ks. alkuperäinen perustelu — mitaleja
          ei käytetä, koska ne toisivat sivulle kolme uutta väriä.
        */}
        <div className="flex items-center gap-2.5 sm:gap-3">
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
        </div>

        {/* NIMI, SOPIMUSTYYPPI JA KAMPANJA */}
        <div className="min-w-0">
          <h3 className="truncate font-display text-[15px] font-bold leading-tight text-ink sm:text-[16px]">
            <Link
              href={`/sahkosopimukset/sopimus/${plan.slug}`}
              className="underline-offset-4 hover:underline"
            >
              {plan.provider}
            </Link>
          </h3>
          <p className="truncate text-[12.5px] text-ink/60">{plan.name}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <TypeBadges plan={plan} />
            {campaign && (
              /*
                KAMPANJALÄTKÄ SIIRTYI OMASTA NAUHASTAAN MERKKIEN JOUKKOON.

                Kampanja on yhä kortin ainoa aikarajattu tieto, eli syy
                toimia tänään, mutta rivimuodossa sille ei ole omaa
                yläkulmaa. Kermanvalkoinen pohja pitää sen kirkkaimpana
                kolmesta lätkästä, joten se luetaan yhä tarjoukseksi eikä
                ominaisuudeksi.
              */
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cream px-2 py-0.5 font-display text-[10.5px] font-bold leading-none text-[#A83E0A]"
                title={campaign.limit ? `Tarjous: ${campaign.limit}` : "Kumppanin oma tarjous"}
              >
                <Tag size={11} className="shrink-0" aria-hidden />
                {campaign.label}
              </span>
            )}
          </div>
          {/*
            VAHVUUSLAUSE MERKITTÖMÄLLE RIVILLE — HILJAINEN, EI NELJÄS LÄTKÄ.

            Sama perustelu kuin ennen: pieni kirjain, ei harvennusta, ei
            ikonia. Jos tämä näyttäisi merkiltä, jokaisella rivillä olisi
            merkki eli yhdelläkään ei olisi.
          */}
          {!foxPick && strength && (
            <p className="mt-1.5 flex min-w-0 items-center gap-2 text-[11.5px] font-semibold leading-none text-cream/70">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cream/45" aria-hidden />
              <span className="truncate">{strength}</span>
            </p>
          )}
        </div>

        {/*
          HINTA JA NAPPI VIERETYSTEN MYÖS PUHELIMESSA.

          Ensimmäinen versio latoi puhelimessa hinnan omalle riville ja
          napin sen alle, jolloin rivi oli 291 pikseliä: kaksi sopimusta
          ruudulla. Kun nappi nousee hinnan viereen, rivi on noin 210
          pikseliä ja ruudulle mahtuu kolme. Se oli koko muutoksen tavoite.

          `sm:contents` poistaa tämän kääreen työpöydältä kokonaan, jolloin
          hinta ja nappi palaavat omiksi ruudukkosarakkeikseen ja pysyvät
          samassa pystylinjassa joka rivillä. Ilman sitä olisi kaksi eri
          asettelupuuta ylläpidettävänä, ja ne erkanevat aina.

          `items-end`: nappi asettuu hintalohkon alareunaan eikä keskelle.
          Keskitettynä se osui hintaluvun ja palkin väliin, jolloin katse
          pysähtyi nappiin ennen kuin ehti lukea hinnan — ja hinta on se,
          joka saa napin painetuksi.
        */}
        <div className="col-span-2 flex items-end gap-3 sm:contents">
        <div className="min-w-0 flex-1">
          {/* Ero nykyiseen: ainoa luku, jota ei voi päätellä muualta
              rivistä, joten se on hintaluvun yläpuolella. Näkyy vain kun
              eroa on yli 50 senttiä kuussa — ks. alkuperäinen perustelu. */}
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
                    <strong className="font-data font-bold">{money(Math.abs(diffMonthly))} €</strong>{" "}
                    / kk kalliimpi
                  </span>
                </>
              )}
            </p>
          )}

          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="font-display font-data font-price text-[26px] font-extrabold leading-none tracking-[-0.03em] text-ink sm:text-[28px]">
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
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/20"
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

            "X € 1. vuosi" on listan järjestysperuste, eli ainoa selitys
            sille miksi rivi voi olla eri kohdassa kuin sen iso luku
            antaisi olettaa. "Sitten Y €/kk" kertoo mihin kampanjahinta
            nousee. Kumpaakaan ei saa poistaa eikä piilottaa: silloin sivu näyttäisi halvimman
            ensimmäisen vuoden ja piilottaisi pysyvän hinnan, mikä on
            täsmälleen se temppu jota tämä vertailu ei tee.

            Ne ovat nyt samalla rivillä välipisteellä erotettuna, koska
            kaksi erillistä riviä maksoi 18 pikseliä jokaisesta
            sopimuksesta ilman että kumpikaan luku muuttui.
          */}
          <p className="mt-1.5 text-[11.5px] leading-snug text-ink/60">
            <span className="font-data font-semibold text-ink/75">
              {yearly.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} €
            </span>{" "}
            1. vuosi
            {campaign && normalMonthly !== null ? (
              <>
                <span className="mx-1.5 text-cream/40" aria-hidden>
                  ·
                </span>
                {/* `whitespace-nowrap`: ilman sitä rivi katkesi puhelimessa
                    niin, että "kk" jäi yksin seuraavalle riville. Luku ja sen
                    yksikkö ovat yksi asia, joten ne katkeavat vain yhdessä. */}
                <span className="whitespace-nowrap">
                  sitten{" "}
                  <span className="font-data font-bold text-ink/80">{money(normalMonthly)} €</span> / kk
                </span>
              </>
            ) : (
              <>
                <span className="mx-1.5 text-cream/40" aria-hidden>
                  ·
                </span>
                laskettu kulutuksellasi
              </>
            )}
            {campaign?.limit ? (
              <>
                <span className="mx-1.5 text-cream/40" aria-hidden>
                  ·
                </span>
                {campaign.limit}
              </>
            ) : null}
          </p>
        </div>

        {/*
          NAPPISARAKE.

          Työpöydällä nappi on rivin oikeassa reunassa omassa sarakkeessaan,
          eli jokaisen rivin nappi on samassa pystylinjassa. Se on rivimuodon
          toinen tuottoperustelu: kun napit ovat linjassa, listaa voi selata
          nappi kerrallaan eikä kohdetta tarvitse etsiä joka rivistä
          uudelleen.

          `theme-light` on pakollinen: `theme-ember` kääntäisi
          kermanvalkoisen napin oranssiksi, jolloin nappi katoaisi rivin
          pohjaan. Ks. ember-ansa DESIGN.md:ssä.
        */}
        <div className="flex w-[128px] shrink-0 flex-col items-stretch gap-1 sm:w-[176px] sm:gap-1.5 sm:items-end">
          <div className="theme-light w-full">
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
        </div>
        {/* Hinta+nappi-kääre loppuu. Ks. `sm:contents`-perustelu ylempänä. */}
      </div>

      {/*
        HINNAN ERITTELY — KOKO RIVIN LEVYINEN, EI SARAKKEEN.

        Erittely on rivin alla omana lohkonaan, jotta sen kolme hintariviä
        ja ominaisuuslista mahtuvat vierekkäin työpöydällä. Sarakkeen
        sisällä ne olisivat 200 pikselin levyisiä ja rivi kasvaisi
        kaksinkertaiseksi.
      */}
      <div
        id={`tiedot-${plan.id}`}
        className="grid gap-3 border-t border-line px-3 py-3 sm:grid-cols-2 sm:gap-5 sm:px-4"
      >
          {/* Ks. `energiaKampanja`-kommentti komponentin ylaosassa. */}
          <dl className="space-y-2 rounded-xl border border-line bg-black/10 p-3">
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

            {/* Ks. `omaOsuusVuosi`-kommentti komponentin ylaosassa. */}
            {omaOsuusVuosi !== null && (
              <div className="flex items-start justify-between gap-3 border-t border-line pt-2 text-[11.5px]">
                <dt className="text-ink/55">Ilman pörssin hintaa</dt>
                <dd className="text-right font-data font-bold text-ink/75">
                  {money(omaOsuusVuosi / 12)} €/kk
                  <span className="mt-0.5 block text-[10.5px] font-medium leading-tight text-ink/50">
                    vain yhtiön oma osuus
                  </span>
                </dd>
              </div>
            )}
          </dl>

          <div className="flex flex-col justify-between gap-2">
            {/* Luettelomerkkinä ketun tassu, ei harmaa väkänen — ks.
                alkuperäinen perustelu: väkänen on sama merkki kuin
                jokaisella verkkokaupalla, joten silmä ohittaa sen. */}
            <ul className="space-y-1">
              {plan.features.slice(0, 3).map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-[12.5px] leading-snug text-ink/80"
                >
                  <span className="mt-[3px] shrink-0 text-cream/75" aria-hidden>
                    <FoxPaw />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/*
              TARKISTUSPÄIVÄ JA LINKKI SOPIMUSSIVULLE.

              Tähtiriviä ei ole, koska yhdelläkään sopimuksella ei ole
              riippumatonta arviolähdettä ja keksitty tähtiluku on kortin
              halvin tapa näyttää luotettavalta — ja ainoa väite, jonka
              lukija voi kumota yhdellä haulla.

              Tarkistuspäivä siirtyi erittelyn sisään: se vastaa kysymykseen
              "onko tämä hinta vanha?", joka syntyy vasta kun lukija on jo
              pysähtynyt yhden sopimuksen kohdalle. Silmäilyvaiheessa se vei
              rivistä tilaa vastaamatta mihinkään.
            */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
              <p className="text-[12px] text-ink/55">
                {plan.rating !== null ? (
                  <>
                    <Star size={13} className="mr-1 inline fill-star text-star" aria-hidden />
                    <span className="font-data font-bold text-ink">{plan.rating.toFixed(1)}</span>
                    {plan.reviews !== null ? ` (${plan.reviews})` : ""}
                  </>
                ) : plan.checkedAt ? (
                  `Hinta tarkistettu ${new Date(plan.checkedAt).toLocaleDateString("fi-FI")}`
                ) : (
                  ""
                )}
              </p>
              <Link
                href={`/sahkosopimukset/sopimus/${plan.slug}`}
                className="text-[12.5px] font-semibold text-ink/65 underline-offset-4 hover:text-ink hover:underline"
              >
                Kaikki tiedot sopimuksesta
              </Link>
            </div>
          </div>
      </div>
    </article>
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
