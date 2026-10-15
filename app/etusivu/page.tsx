import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import StatStrip from "@/components/home/StatStrip";
import WhyCompare from "@/components/home/WhyCompare";
import Services from "@/components/home/Services";
import TrustBlock from "@/components/home/TrustBlock";
import AboutCard from "@/components/home/AboutCard";
import { OG_IMAGE, SITE } from "@/lib/data";
import { getHomeFacts } from "@/lib/home";

/*
  ETUSIVU — HUB.

  KOLME PALVELUA, SAMA PAINO. Kaikki paikat, joissa palveluista puhutaan,
  lukevat saman `lib/services.ts`-taulukon: heron rivit ja palveluosio. Yhtä
  palvelua ei voi kasvattaa koskematta molempiin.

  =====================================================================
  SIVU LYHENNETTIIN YHDESTÄTOISTA OSIOSTA KUUTEEN (19.9.2026)
  =====================================================================

  MIKÄ OLI VIKANA. Sivu oli rakenteellisesti oikea ja silti liian raskas
  luettavaksi. Jokainen osio oli perusteltu erikseen, ja jokainen perustelu
  piti paikkansa, mutta niiden summa oli yksitoista osiota, joista neljä
  vastasi käytännössä samaan kysymykseen kahdesti:

  - Kolme täyskorkeaa vertikaaliosiota, joissa kussakin oli kolmetoista
    elementtiä (kuvake, pikkuotsikko, otsikko, johdanto, kumppanirivi,
    paneeli, paneelin otsikko, kolme riviä, alaviite, nappi, rajauslause).
  - Läpinäkyvyysosio JA kotimaisuusosio peräkkäin, molemmat aiheesta
    "voiko teihin luottaa", yhteensä seitsemän tekstisaraketta.
  - Yksitoista UKK-kysymystä, joissa vastaus oli neljä tai viisi lausetta.

  Pitkä perustelu ei ole vahvempi perustelu. Se on perustelu, jota ei
  lueta, ja lukematta jäänyt argumentti ei tuota klikkiä. Siinä on koko
  syy tähän muutokseen: tuotto, ei estetiikka.

  MITÄ TEHTIIN:
  - Kolme vertikaaliosiota → yksi `Services`-osio, jossa per palvelu
    otsikko, kaksi riviä tekstiä ja nappi.
  - `WhyCompare`n kolme korttia → yksi oranssi kortti, jossa kaksi lyhyttä
    kappaletta ja neljä tarkistettavaa riviä.
  - `TrustBlock` + `AboutStrip` → yksi osio, neljä kohtaa. Y-tunnus ja
    ansaintamalli säilyivät, koska ne ovat tuottoehtoja eivät koristeita.
  - UKK poistettiin kokonaan (ks. alla).
  - Heron kolme laattaa → kolme täysleveää riviä, jotka vievät suoraan
    kohteeseen. Yksi klikki vähemmän matkalla palkkioon.

  =====================================================================
  UKK-OSIO POISTETTIIN KOKONAAN (19.9.2026)
  =====================================================================

  Jessen pyyntö. Osio oli jo lyhennetty yhdestätoista kysymyksestä
  seitsemään, ja se poistettiin silti kokonaan, koska se oli sivun viimeinen
  tekstimassa ennen oppaita.

  MITÄ SE MAKSOI, JOTTA TÄTÄ EI TEHDÄ VAHINGOSSA UUDELLEEN:

  1. FAQPage-rakennedata katosi etusivulta. Se oli sivun ainoa
     rikastettuihin tuloksiin kelpaava merkintä Organizationin ja WebSiten
     lisäksi. Etusivu voi siis pudota Googlessa kapeammaksi tulokseksi kuin
     ennen. `/sahkosopimukset`, sopimussivut ja aihesivut käyttävät
     `components/Faq.tsx`:ää edelleen, joten merkintä ei kadonnut
     sivustolta, vain tältä sivulta.
  2. Kolme vastausta oli myös vastalauseen purkaja ("maksaako tämä",
     "mistä te ansaitsette", "vaikuttaako palkkio järjestykseen"). Ne
     kaikki löytyvät yhä `TrustBlock`ista, joka on nyt viimeinen paikka
     etusivulla, jossa ansaintamalli sanotaan ääneen.

  Jos konversio laskee tämän jälkeen, tämä on ensimmäinen asia, joka
  kannattaa palauttaa, ja silloin se tehdään `components/Faq.tsx`:n kautta
  jotta merkintä ja näkyvä lista tulevat samasta taulukosta.

  Rakenteen malli on kilpailuttaja.fi, joka on tämän alan Suomen vahvin
  sivusto ja jonka etusivu tekee saman asian noin puolella osioista. Värit,
  luvut ja väitteet ovat meidän omia: heidän lauseensa ostoyhteenliittymän
  tuomasta edusta on heillä totta ja meillä ei olisi (ks. `HomeHero`).

  =====================================================================
  OSIOJÄRJESTYS JA SEN PERUSTELU
  =====================================================================

  Järjestys ei ole aihepiirin mukainen vaan sen mukainen, missä
  järjestyksessä kävijän kysymykset tulevat. Jokainen osio vastaa yhteen
  kysymykseen, ja seuraava osio on olemassa vain siksi, että edellinen
  vastaus synnyttää uuden kysymyksen.

  1. HERO ......... "Mikä tämä on?" Yksi lupaus, kolme riviä ulos.
  2. LUKURIVI ..... "Miksi uskoisin teitä?" Kaksi lukua, jotka voi
                    tarkistaa sivulta itseltään.
  3. MIKSI KILPAILUTTAA ... "Miksi tekisin tämän tänään?" Osio, jossa
                    aikomus syntyy. Ilman sitä loput osiot vakuuttavat
                    ihmisen, joka ei ole päättänyt tehdä mitään, ja silloin
                    hän poistuu luottavaisena.
  4. PALVELUT ..... "Mitä voin kilpailuttaa?" Kolme tasavertaista
                    vaihtoehtoa, kolme nappia.
  5. LÄPINÄKYVYYS . "Mistä te ansaitsette ja keitä te olette?" Vastaus
                    ennen klikkiä, ei sen jälkeen. Tämä on nyt myös ainoa
                    paikka, jossa kerrotaan kuka laskee mitäkin, joten sen
                    kohtaa 03 ei saa poistaa (ks. lib/services.ts).
  6. TIETOA ....... "Kuka te olette?" Kapea kortti, yksi kappale, oma
                    logomerkki. Muoto on kilpailuttaja.fi:n vastaavasta
                    laatikosta, sisältö on meidän. Sivu päättyy tähän.

  =====================================================================
  LOPPUKEHOTUS POISTETTIIN ETUSIVULTA (19.9.2026)
  =====================================================================

  Jessen pyyntö. `ClosingBelt` oli sivun viimeinen oranssi vyö ja sen kolme
  nappia olivat viimeinen toimintakehotus.

  MITÄ SE MAKSOI, JOTTA TÄTÄ EI TEHDÄ VAHINGOSSA UUDELLEEN:

  1. Sivun pohjalle asti selannut kävijä on se, joka on lukenut perustelut
     loppuun. Hänellä ei ole enää yhtään nappia siinä kohdassa, jossa hän on
     vakuuttunein, vaan hänen on selattava takaisin ylös. Tämä on suoraan
     pois palkkiosta, ja se on koko muutoksen hinta.
  2. Vöitä on nyt yksi: hero. DESIGN.md sanoo, että sivuston rytmin tekevät
     täysleveät oranssit vyöt, joten etusivulla ei ole enää sitä rytmiä
     vaan yksi vyö ja sen jälkeen pelkkiä vaaleita pintoja. Alatunnisteen
     tumma pinta on nyt ainoa asia, joka päättää sivun.
  3. Se oli yksi kolmesta paikasta, jossa kaikki kolme palvelua olivat
     tasavertaisesti esillä (hero, palveluosio, loppukehotus). Jäljellä on
     kaksi, ja molemmat ovat sivun yläpuoliskossa.

  `ClosingBelt.tsx` jäi tiedostoksi, koska osio voi palata, ja koska se
  lukee palvelunsa `getServices()`:stä eikä siihen tarvitse koskea.

  =====================================================================
  OPPAAT-OSIO POISTETTIIN ETUSIVULTA (19.9.2026)
  =====================================================================

  Jessen pyyntö: `GuideRail` ("Etkö ole vielä valmis vertailemaan?" ja kolme
  blogikorttia) korvattiin `AboutCard`illa.

  MITÄ SE MAKSOI, JOTTA TÄTÄ EI TEHDÄ VAHINGOSSA UUDELLEEN:

  1. Etusivulta katosi ainoa sisäinen linkki yksittäisiin blogiartikkeleihin.
     Sivuston vahvin sivu ei siis enää anna linkkiarvoa neljälletoista
     artikkelille. Header ja alatunniste linkittävät `/blogi`-listaukseen,
     joten artikkelit ovat yhä kahden klikin päässä eivätkä pudonneet
     indeksistä, mutta yhden klikin reitti meni.
  2. Osio oli ulospääsy kävijälle, joka ei ollut vielä valmis vertailemaan.
     Hän poistuu nyt sivustolta sen sijaan että siirtyisi lukemaan.

  `GuideRail.tsx` ja `SpreadBar.tsx` ovat molemmat nyt kuollutta koodia.
  Kumpaakaan ei poistettu, koska osio voi palata.

  KAIKKI OSIOT ALKAVAT SAMALLA TAVALLA: keskitetty pikkuotsikko, keskitetty
  otsikko, keskitetty johdantolause (`components/home/SectionHead.tsx`).
  Leipätekstit, listat ja taulukot latoutuvat vasemmalle. Poikkeus on
  `WhyCompare`n oranssi kortti, jonka otsikko on vasemmalla: se ei ole osion
  otsikko vaan lohko osion sisällä, ja kaksipalstaisessa lohkossa keskitetty
  vasen palsta osuisi eri kohtaan kuin oikea lista.

  ERILLISTÄ "NÄIN SE TOIMII" -OSIOTA EI PALAUTETTU, vaikka referenssillä
  sellainen on. Yleinen kolmen askeleen lista kirjoitettiin ja poistettiin
  26.8.2026, koska se kuvasi kolmen eri palvelun kulun yhdellä listalla ja
  pakotti lukijan kääntämään jokaisen lauseen omalle palvelulleen. Se
  ongelma ei ole kadonnut: sähkössä ei kysytä yhteystietoja, lainassa
  täytetään hakemus ja vakuutuksessa siirrytään POP:n sivulle, eli askel
  kaksi on jokaiselle eri. Sama tieto on nyt palveluosion
  johdantolauseissa.

  TAUSTOJEN RYTMI: oranssi (hero) → paperi (lukurivi) → usva (miksi) →
  paperi (palvelut) → hiekka (läpinäkyvyys) → usva (tietoa) → alatunnisteen
  tumma. Kahdella peräkkäisellä osiolla ei ole samaa pintaa, koska
  silloin niiden raja katoaa ja kaksi osiota luetaan yhdeksi pitkäksi.
  `GuideRail` vaihtoi tämän takia paperista usvaan ja `WhyCompare` paperista
  usvaan. Rytmi on laskettava uudelleen aina kun osio lisätään tai poistuu:
  UKK oli paperia hiekan ja usvan välissä, ja sen poistuttua järjestys osui
  sattumalta valmiiksi oikein.

  MITÄ TÄSSÄ EI OLE: laskuria, kyselyä eikä sopimuslistaa. Ne kuuluvat
  `/sahkosopimukset`-sivulle portin taakse (ks. CLAUDE.md). Hubin tehtävä on
  tehdä klikistä tarpeellinen, ei korvata sitä.
*/

export const metadata: Metadata = {
  title: { absolute: "Kettukilpailutus.fi – kilpailuta sähkösopimukset ja lainat" },
  /*
    KUVAUKSESSA MAINITAAN VAKUUTUKSET, OTSIKOSSA EI.

    Vakuutuksissa emme vertaile mitään, vaan kävijä pyytää tarjouksen yhdeltä
    yhtiöltä. Otsikko "kilpailuta sähkö, lainat ja vakuutukset" lupaisi
    hakutuloksessa vertailun, jota sivulla ei ole, ja lupaus romahtaisi yhden
    klikin päässä. Kuvaus käyttää siksi sanaa "vakuutustarjous" eikä
    "vakuutusvertailu": tarjouspyyntö on totta, vertailu ei olisi.

    VAKUUTUSYHTIÖN NIMEÄ EI MAINITA (19.9.2026, Jessen pyyntö). Se oli tässä
    aiemmin, ja se oli hakutuloksessa näkyvä rajaus. Nyt rajaus on pelkästään
    sanavalinnan varassa, eli tämän lauseen sanamuoto on osa
    compliance-katetta eikä pelkkää markkinointia: sanaa "kilpailuta" tai
    "vertaa" ei saa liittää vakuutuksiin tässä kuvauksessa.
  */
  description:
    "Kilpailuta sähkösopimukset ja lainat yhdessä paikassa ja pyydä tarjous vakuutuksistasi. Kettu laskee sähkön vuosihinnan omalla kulutuksellasi ja lainatarjoukset haetaan yhdellä hakemuksella.",
  alternates: { canonical: "/etusivu" },
  openGraph: {
    title: "Kettukilpailutus.fi – kilpailuta sähkösopimukset ja lainat",
    description:
      "Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi. Sähkösopimukset, lainatarjoukset yhdellä hakemuksella ja maksuton vakuutustarjous.",
    url: "/etusivu",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE.name + " – Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi.",
      },
    ],
  },
};

export default function HomePage() {
  const facts = getHomeFacts();

  const orgId = `${SITE.url}/#organisaatio`;
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/isokettulogo.png`,
        description:
          "Suomalainen kilpailutuspalvelu: sähkösopimukset ja lainat puolueettomasti vertailtuna sekä vakuutustarjous kumppanilta.",
        legalName: SITE.operator.legalName,
        taxID: SITE.operator.businessId,
        email: SITE.operator.email,
        areaServed: "FI",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#sivusto`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "fi-FI",
        publisher: { "@id": orgId },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <main>
        {/*
          HERO EI SAA `facts`-PROPIA. Siinä oli kolme kovakoodattua
          menekkilukua ("+10 000 sähkösopimuksia kilpailutettu" ja kaksi
          muuta), joita ei ollut mitattu mistään. Ne poistettiin, ja
          tilalle tuli `StatStrip`. Hero ei siis enää tarvitse dataa.
        */}
        <HomeHero />
        {/*
          `StatStrip` EI SAA ENÄÄ `facts`-PROPIA (19.9.2026).

          Osion kaksi laskettua lukua (sopimusten määrä ja hintojen
          tarkistuspäivä) korvattiin Jessen pyynnöstä kolmella
          PAIKKAMERKILLÄ, jotka hän täyttää itse. Paikkamerkit ovat
          kovakoodattuja `StatStrip.tsx`:n alussa, joten osio ei enää lue
          `data/electricity.json`:ia.

          Tämä on tietoinen vaihtokauppa ja sen hinta on kirjattu
          `StatStrip.tsx`:n yläkommenttiin: rivillä on nyt numeerisia
          menekkiväitteitä, joita tämä sivusto ei pysty näyttämään
          toteen. Luvut on vaihdettava tosiksi ennen pushia.

          `facts` kulkee yhä `WhyCompare`lle ja `TrustBlock`ille, joten
          tarkistuspäivä ei kadonnut etusivulta.
        */}
        <StatStrip />
        <WhyCompare facts={facts} />
        {/*
          `Services` EI SAA `facts`-PROPIA. Osiossa ei ole yhtään lukua:
          sähkön hintaero siirtyi `WhyCompare`en, jossa se on argumentti
          eikä palveluesittely. Jos tähän joskus lisätään luku, se on
          lisättävä kaikille kolmelle palvelulle tai ei yhdellekään, ja
          lainoista sekä vakuutuksista meillä ei ole yhtään tarkistettua
          lukua (KSL 7 luku, ks. lib/loans.ts).
        */}
        <Services />
        <TrustBlock facts={facts} />
        {/*
          TÄLLÄ SIVULLA EI OLE ENÄÄ UKK:TA EIKÄ SIIS FAQPage-RAKENNEDATAA.
          Jos UKK palautetaan, se tehdään `components/Faq.tsx`:n kautta, joka
          tuottaa merkinnän ja näkyvän listan samasta taulukosta. Merkintää ei
          saa kirjoittaa tähän omasta kopiostaan: Google näkisi ensimmäisen
          muokkauksen jälkeen eri vastaukset kuin kävijä, mikä on
          rikastettujen tulosten ohjeissa kielletty.
        */}
        {/*
          SIVU PÄÄTTYY TÄHÄN, EI LOPPUKEHOTUKSEEN. Ks. yläkommentti: se on
          Jessen päätös 19.9.2026, ja sen hinta on kirjattu sinne. Jos tähän
          joskus palautetaan nappi, se palautetaan `ClosingBelt`inä, joka
          lukee `getServices()`:n eikä kirjoita palveluita uudestaan.
        */}
        <AboutCard />
      </main>
    </>
  );
}
