import type { FaqItem } from "./types";

/**
 * LAINAVERTIKAALIN SISÄLTÖ.
 *
 * TÄMÄ SIVU ON OHJAUSSIVU, EI OPAS. Kettu ei vertaile lainoja, joten
 * sivulla ei ole työkalua jonka äärelle kävijä jäisi. Ainoa asia, joka
 * tällä sivulla tuottaa, on siirtymä kumppanille — ja jokainen rivi,
 * joka ei vie sinne, on rivi jonka aikana kävijä voi poistua.
 *
 * TÄSSÄ OLI AIEMMIN NELJÄ PITKÄÄ TEKSTIOSIOTA (korko, todellinen
 * vuosikorko, lainojen yhdistäminen, maksuhäiriömerkintä). Ne
 * poistettiin: ne olivat blogitekstiä ohjaussivulla, eli ne siirsivät
 * napin ruudullisten päähän ja antoivat lukijalle kolme kertaa
 * mahdollisuuden päättää "luen tämän myöhemmin". Sisältö ei ole hukassa
 * — se kuuluu blogiin, jossa se voi hakea liikennettä omilla
 * osoitteillaan ja ohjata takaisin tänne.
 *
 * TÄSSÄ TIEDOSTOSSA EI OLE YHTÄÄN LUKUA — EIKÄ SAA OLLA.
 * Kaksi syytä, joista kumpikin yksinään riittää:
 *
 * 1) Emme ole tarkistaneet yhtään lainatarjousta. Sivuston koko pääoma
 *    on se, että luvut pitävät paikkansa; keksitty korkoesimerkki
 *    kaataisi sen kerralla myös sähkövertailun osalta.
 * 2) Kuluttajansuojalain 7 luku: heti kun mainonnassa mainitaan korko
 *    tai mikä tahansa muu lainan kustannuksia kuvaava luku, samassa
 *    yhteydessä on annettava todellinen vuosikorko ja edustava
 *    esimerkki. Sitä ei voi antaa oikein, koska tarjous on aina
 *    hakijakohtainen.
 *
 * Luvut näytetään Sortterin omalla sivulla, jossa ne perustuvat
 * oikeisiin pankkitarjouksiin.
 */

/**
 * CO-BRANDED HAKEMUSSIVU — TÄMÄN SIVUN AINOA KOHDE.
 *
 * Sortter on rakentanut meille oman hakemussivun. Se on Sortterin
 * lomake ja Sortterin vastuu, mutta yläpalkissa on Kettukilpailutuksen
 * logo ja oikealla lukee "Palvelun tarjoaa Sortter". Kävijä ei siis
 * putoa tuntemattomalle sivustolle kesken siirtymän — se on juuri se
 * kohta, jossa ohjaussivut menettävät eniten kävijöitä.
 *
 * SEURANTA ON SISÄÄNRAKENNETTU OSOITTEESEEN, EI PARAMETREIHIN.
 * Tarkistettu sivun lähdekoodista: Jessen `affiliateId`
 * (958405be-…) ja `offerId` (4f317b7d-…) ovat sivulla valmiina.
 * Osoitteeseen ei siis tarvitse eikä saa lisätä tunnisteita — riittää
 * että kävijä päätyy tähän aliverkkotunnukseen.
 *
 * MIKSI ADTRACTION-LINKKI POISTETTIIN. Vanha nappi meni osoitteeseen
 * `go.adt291.com/t/t?a=1658832312&as=2098832052…` eli Adtractionin
 * ohjelmaan. Kaksi rinnakkaista ohjelmaa samalle kumppanille on
 * huonompi kuin yksi kumpaakaan tapaa kohtaan: sama kävijä voisi
 * painaa ensin nappia (Adtraction) ja sitten laskurin nappia
 * (co-branded), jolloin kahdesta jäljestä sovitaan jälkikäteen. Nyt
 * kaikki neljä siirtymää tältä sivulta menevät samaan paikkaan.
 *
 * ⚠ ENNEN JULKAISUA: varmista Sortterilta, että tämän ohjelman
 * palkkio on vähintään yhtä hyvä kuin Adtractionin ohjelman
 * (`a=1658832312`). Jos ei ole, palataan Adtractioniin nappien osalta
 * — mutta laskurin `b2cUrl` jää tähän, koska se ei ole koskaan
 * kulkenut Adtractionin kautta lainkaan.
 *
 * HUOM KENOVIIVA LOPUSSA. Widget rakentaa osoitteen muodossa
 * `${b2cUrl}?amount=…` eli liittää kysymysmerkin itse. Osoitteessa ei
 * siksi saa olla omaa kyselymerkkijonoa, ja päättävä `/` pitää olla
 * paikallaan.
 */
export const SORTTER_APPLICATION_URL = "https://kettukilpailutus.hakemus-sortter.fi/";

/**
 * CO-BRANDED HAKEMUSSIVU YRITYSLAINOILLE.
 *
 * Sama aliverkkotunnus, oma polku. Tarkistettu sivun datasta samalla
 * tavalla kuin kuluttajapuolen sivu: `/sme` sisältää palvelimen puolelta
 * valmiina `affiliate_id` 958405be-… ja `offer_id` 4f317b7d-…, eli
 * täsmälleen saman parin kuin juuren sivu. Osoitteeseen ei siksi lisätä
 * tunnisteita tässäkään.
 *
 * KOSKA TUNNISTE ON SAMA, EROTTELU TAPAHTUU VAIN `utm`:LLÄ. Sortterin
 * raportissa yrityslainahakemus ei erotu kuluttajahakemuksesta
 * tunnisteen perusteella, koska pari on sama molemmilla sivuilla — ero
 * syntyy laskeutumissivusta. Jos yrityspuolen tuotto halutaan joskus
 * nähdä erikseen, se vaatii oman utm-arvon, ei omaa tunnistetta.
 *
 * EI PÄÄTTÄVÄÄ KENOVIIVAA. Widget liittää perään `?amount=…`, joten
 * osoite muuttuu muotoon `/sme?amount=…`. Tämä on täsmälleen se osoite,
 * jonka Sortter antoi.
 */
export const SORTTER_SME_APPLICATION_URL =
  "https://kettukilpailutus.hakemus-sortter.fi/sme";

/** Kumppani. Kaikki tämän sivun napit vievät co-branded hakemussivulle. */
export const LOAN_PARTNER = {
  id: "sortter",
  name: "Sortter",
  /** Yksi lause, jonka jokainen sana on tarkistettavissa Sortterin sivulta. */
  summary:
    "suomalainen lainanvälittäjä, joka lähettää yhden hakemuksen usealle pankille kerralla",
  url: SORTTER_APPLICATION_URL,
} as const;

/**
 * SORTTERIN LASKURIVIDGET (`<sortter-reseller-form>`).
 *
 * MIKSI SE ON SIVULLA: tämän sivun tunnustettu heikkous on ollut se,
 * ettei täällä ole työkalua jonka äärelle kävijä jäisi — pelkkä nappi ei
 * anna mitään tekemistä, ja ilman tekemistä jokainen vieritetty ruutu on
 * pelkkää poistumisriskiä. Kahden liu'un laskuri antaa kävijälle oman
 * summan ja oman takaisinmaksuajan ennen kuin hän lähtee mihinkään, ja
 * hakemus avautuu Sortterilla nuo arvot valmiiksi täytettyinä. Se on
 * lyhyempi matka hakemukseen, ei pidempi.
 *
 * MIKSI LUKUJEN KIELTO EI RIKKOUDU: tämän tiedoston yläkommentti kieltää
 * omat lainaluvut. Widgetin luvut eivät ole meidän: laskennan tekee
 * Sortter omalla korkotaulullaan, ja widget tulostaa itse alalaitaansa
 * kuluttajansuojalain 7 luvun vaatiman edustavan esimerkin — lainasumma,
 * korko, avausmaksu, tilinhoitomaksu, kuukausierä, takaisinmaksettava
 * summa ja todellinen vuosikorko. Tarkistettu widgetin lähdekoodista:
 * tuo teksti EI ole minkään attribuutin takana, vaan se piirtyy aina.
 * Jos Sortter joskus poistaa sen, widget on otettava pois sivulta.
 *
 * PALKKION KULKU — AIEMPI AVOIN KYSYMYS ON RATKAISTU. Widgetin oma
 * nappi ei kulkenut Adtractionin kautta lainkaan: se rakentaa
 * osoitteen muodossa `b2cUrl?amount=…&period=…&utm…`, ja `b2cUrl`:n
 * oletus oli Sortterin oma `sortter.fi/lainahakemus/`, jossa ei ole
 * mitään tunnistetta meistä. Laskurin klikki oli siis ilmainen
 * Sortterille. Nyt `b2cUrl` osoittaa co-branded sivulle, jossa
 * `affiliateId` ja `offerId` ovat valmiina — sama klikki tuottaa.
 *
 * KAKSI ASKELTA MUUTTUI YHDEKSI. Co-branded sivun ensimmäinen vaihe
 * on "Valitse lainasumma", eli täsmälleen sama kysymys kuin tässä
 * laskurissa. Kun summa ja aika tulevat osoitteessa mukana, sivu
 * merkitsee vaiheen 1 tehdyksi ja avaa suoraan vaiheen 2. Tarkistettu
 * selaimessa arvoilla 31 000 € / 9 vuotta: sivu näytti ne ja hyppäsi
 * vaiheeseen 2. Ilman tätä laskuri olisi ollut kävijälle turha
 * välikysymys, joka kysytään heti uudestaan.
 */
export const LOAN_WIDGET = {
  /**
   * Sortterin oma jakelu. HUOM: osoitteessa ei ole versionumeroa, joten
   * Sortter voi vaihtaa tuotannossa ajettavan koodin milloin tahansa
   * ilman että me huomaamme. Jos Sortterilta saa versioidun osoitteen
   * (…@1.2.3/dist/…), se kannattaa vaihtaa tähän.
   */
  src: "https://www.unpkg.com/@sortter/sortter-resellers-web-component/dist/sortter-reseller-form.js.umd.js",

  /**
   * Mihin laskurin nappi vie. Ilman tätä widget käyttää omaa
   * oletustaan `https://sortter.fi/lainahakemus/`, joka ei tunnista
   * meitä lähettäjäksi. Sama osoite kuin `LOAN_PARTNER.url`, jotta
   * sivulla on yksi kohde eikä kahta.
   */
  b2cUrl: SORTTER_APPLICATION_URL,

  /**
   * Yrityslainapuolen kohde. Widgetissä on erilliset `b2cUrl` ja
   * `b2bUrl`, eli sama laskuri osaa ohjata kummankin hakijan omalle
   * hakemussivulleen. Ilman tätä yrityslainaa hakeva kävijä päätyisi
   * kuluttajalomakkeelle, eli väärään hakemukseen — se on menetetty
   * hakemus, ei pelkkä kauneusvirhe.
   */
  b2bUrl: SORTTER_SME_APPLICATION_URL,

  /**
   * Liukujen aloitusarvot: 25 000 € ja 6 vuotta. Ne eivät ole väite
   * mistään — ne ovat vain se kohta, josta kävijä alkaa raahata. Sortter
   * ehdotti näitä, ja ne osuvat lainojen yhdistämisen kokoluokkaan, joka
   * on tämän sivun todennäköisin kävijä.
   */
  amount: 25000,
  periodYears: 6,

  /**
   * Erottelutunniste, EI palkkion peruste. Palkkio kulkee co-branded
   * osoitteen kautta; tämä kertoo Sortterin raportissa vain sen, että
   * kävijä tuli laskurista eikä sivun napista. `utm_medium=slider` on
   * Sortterin oma arvo, eikä sitä muuteta.
   */
  utm: "utm_source=kettukilpailutus.fi&utm_medium=slider",
} as const;

/**
 * Kolme askelta. Tehtävä on kumota yksi pelko — "onko tämä työlästä" —
 * ja päättyä nappiin. Jokainen teksti on yksi rivi: tämä on silmäiltävä
 * kaista, ei luettava osio.
 */
export const LOAN_STEPS: { title: string; text: string }[] = [
  {
    title: "Täytä yksi hakemus",
    text: "Muutama minuutti. Hakemus lähtee usealle pankille kerralla.",
  },
  {
    title: "Vertaa tarjoukset",
    text: "Näet oikeat tarjoukset rinnakkain, et mainoksen alinta korkoa.",
  },
  {
    title: "Valitse tai jätä väliin",
    text: "Hakeminen ei sido. Lainan voi jättää nostamatta myönteisenkin päätöksen jälkeen.",
  },
];

/**
 * UKK — neljä kysymystä, jotka pysäyttävät hakemuksen. Tämä ei ole
 * sisältöä hakukoneelle vaan viimeinen vastalauseiden purku ennen
 * loppunappia, joten mukana on vain se mikä estää klikkaamasta.
 *
 * Faq-komponentti tuottaa näistä itse FAQPage-skeeman, joten sivun ei
 * pidä lisätä samaa JSON-LD:tä uudestaan.
 */
export const LOAN_FAQ: FaqItem[] = [
  {
    q: "Maksaako hakeminen mitään?",
    a: "Ei. Hakemus ja tarjousten vertailu ovat sinulle maksuttomia eivätkä sido sinua mihinkään. Voit jättää lainan nostamatta, vaikka saisit myönteisen päätöksen. Kuluja syntyy vasta nostetusta lainasta.",
  },
  {
    q: "Miksi Kettu ei vertaile lainoja itse?",
    a: "Koska lainan hinta ei ole listahinta. Sähkösopimuksen hinnan voi lukea etukäteen ja laskea sinun kulutuksellasi, mutta lainatarjous syntyy vasta kun pankki on katsonut juuri sinun tietosi. Taulukko, jossa lukisi jokin yleinen korkohaarukka, näyttäisi vertailulta mutta ei kertoisi sinun hinnastasi mitään.",
  },
  {
    q: "Vaikuttaako hakeminen luottotietoihini?",
    a: "Lainahakemus näkyy luottotiedoissasi kyselymerkintänä. Se ei ole maksuhäiriö eikä estä lainan saamista, mutta useat kyselyt lyhyellä aikavälillä voivat vaikuttaa päätökseen. Siksi yksi hakemus usealle pankille on parempi kuin monta hakemusta peräkkäin — se jää yhdeksi merkinnäksi.",
  },
  {
    q: "Miten Kettukilpailutus ansaitsee tällä sivulla?",
    a: "Saamme kumppanilta palkkion, jos siirryt tältä sivulta Sortterille ja teet siellä hakemuksen. Sinulle palvelu on maksuton eikä palkkio vaikuta lainasi hintaan. Kerromme tämän tässä, koska kilpailutuspalvelun ainoa pääoma on se, että kävijä tietää mistä raha tulee.",
  },
];
