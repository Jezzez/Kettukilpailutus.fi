import electricityJson from "@/data/electricity.json";
import topicsJson from "@/data/energy-topics.json";

/**
 * Yhtion oma kampanja — se, mita kumppani mainostaa omalla sivullaan.
 *
 * Kampanja on aina MAARAAIKAINEN poikkeus normaalihinnasta. Siksi tassa
 * kerrotaan vain ne kentat, jotka kampanjan ajaksi muuttuvat; loput
 * luetaan sopimuksen normaaleista kentista. Nain sama kampanja voi olla
 * pelkka perusmaksuetu ("0 €/kk kolme kuukautta") tai koko hinnan
 * alennus, ilman kahta eri tietorakennetta.
 */
export interface PlanCampaign {
  /** Lyhyt teksti kortin ylakulmaan, esim. "Perusmaksu 0 € 3 kk". */
  label: string;
  /** Kampanjan kesto kuukausina sopimuksen alusta. */
  months: number;
  /** Perusmaksu kampanjan aikana (€/kk). Puuttuva = normaali perusmaksu. */
  basicFee?: number;
  /** Marginaali kampanjan aikana (c/kWh). Vain porssisopimuksille. */
  spotMargin?: number;
  /** Energiahinta kampanjan aikana (c/kWh). Vain kiinteille. */
  energyPrice?: number;
  /** Rajoitus, esim. "vain uusille asiakkaille". Nakyy kortilla. */
  limit?: string;
}

/** Sähkösopimuksen tietomalli. */
export interface ElectricityPlan {
  id: string;
  slug: string;
  provider: string;
  name: string;
  type: "spot" | "fixed" | "open";
  basicFee: number;            // €/kk
  energyPrice: number | null;  // c/kWh (kiinteä/toistaiseksi)
  spotMargin: number | null;   // c/kWh (pörssi)
  green: boolean;
  fixedTermMonths: number | null;
  /**
   * Asiakasarvio 0-5, tai `null` jos rehellista lahdetta ei ole.
   *
   * MIKSI NULL ON SALLITTU: kumppaniyhtioista ei ole yhtaan
   * riippumatonta arviolahdetta, jonka luvun voisi julkaista. Keksitty
   * tahtiluku olisi juuri se yksityiskohta, joka romuttaa koko sivun
   * uskottavuuden, koska sen voi tarkistaa sekunnissa muualta. Kun
   * kentta on `null`, kortti jattaa tahtirivin kokonaan pois eika
   * "Ketun valintaa" lasketa lainkaan.
   */
  rating: number | null;
  reviews: number | null;
  affiliateUrl: string;
  /**
   * Onko yhtio Kettukilpailutuksen kumppani, eli maksaako se palkkion.
   *
   * Tama ohjaa nappia: kumppanilla "Tee sopimus", muilla neutraali
   * "Siirry palveluntarjoajalle". Ilman erottelua sivu joko valehtelisi
   * napilla tai joutuisi piilottamaan puolet markkinasta.
   */
  partner?: boolean;
  /**
   * Kumppanin oma kampanja: mita se lupaa ja kuinka pitkaan.
   *
   * Naytetaan kortin ylakulmassa yhtion omana tarjouksena ja lasketaan
   * mukaan ensimmaisen vuoden hintaan. Ks. `annualCost`.
   */
  campaign?: PlanCampaign;
  /** Paiva, jolloin hinnat luettiin yhtion omalta sivulta (ISO). */
  checkedAt?: string;
  /** Sivu, jolta hinnat luettiin. Nakyy sopimussivulla lahdeviitteena. */
  sourceUrl?: string;
  /**
   * Yhtiön logo, polku `public/`-kansiosta (esim. "/logot/fortum.png").
   *
   * Kaikilla kumppaniyhtiöillä on logo — tiedostot on haettu yhtiöiden omilta
   * sivuilta ja normalisoitu 256×256 PNG:ksi. Neliömäinen tunnus, ei
   * tekstilogo: eri levyiset tekstilogot rikkoisivat korttiruudukon rivityksen.
   *
   * Kenttä on silti vapaaehtoinen, koska loput 24 sopimusta ovat keksittyä
   * esimerkkidataa eikä keksitylle yhtiölle saa piirtää logoa. Ilman kenttää
   * kortti näyttää yhtiön nimikirjaimet.
   */
  logo?: string;
  /**
   * Onko sopimuksen hinta vielä esimerkkiluku.
   *
   * Sivustoa rakennetaan, eikä yhdenkään yhtiön ehtoja ole vielä tarkistettu.
   * Lippu on sopimuskohtainen, jotta tarkistustyön voi tehdä yksi yhtiö
   * kerrallaan: kun luvut on varmistettu, tästä tulee `false` ja juuri se
   * sopimus on julkaisukelpoinen. Ilman sopimuskohtaista lippua ainoa
   * vaihtoehto olisi kääntää koko sivusto kerralla oikeaksi, ja käytännössä
   * se tarkoittaa, että lippu käännetään liian aikaisin.
   */
  example?: boolean;
  /**
   * Piilota sopimus sivustolta, vaikka sen luvut olisivat tarkistettuja.
   *
   * MIKSI TÄMÄ ON ERI LIPPU KUIN `example`: `example` tarkoittaa "luku on
   * keksitty". Jos piilottaisi liiketoiminnallisin perustein saman lipun
   * takana, aineistoa lukisi myöhemmin väärin — tarkistettu hinta
   * näyttäisi tarkistamattomalta, ja juuri se tieto ratkaisee, onko rivi
   * julkaisukelpoinen. Kaksi eri syytä ansaitsevat kaksi eri kenttää.
   *
   * MIHIN TÄTÄ KÄYTETÄÄN: sopimuksiin, jotka eivät tuota. Ilman
   * kumppanuutta klikki maksaa mainoksena mutta ei palauta euroakaan,
   * ja mainosliikenteessä se on suoraa tappiota. Rivi jää JSONiin, koska
   * kumppanuus voi syntyä myöhemmin ja silloin paluu on yhden kentän
   * poisto — ei uudelleen kerätty hinta-aineisto.
   *
   * HUOM: tämä ei ole tapa piilottaa kalliita sopimuksia. Vertailu, josta
   * on siivottu pois vaihtoehdot, jotka voittaisivat kumppanit, lakkaa
   * olemasta vertailu — ja sen huomaa kuka tahansa, joka tarkistaa yhden
   * hinnan muualta. Se on tällä sivustolla kallein mahdollinen virhe.
   */
  hidden?: boolean;
  /** Yhtiön kotipaikka. Tarkistettu tieto myös silloin, kun hinta ei ole. */
  region?: string;
  gradient: [string, string];
  features: string[];
  summary: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  faq: [string, string][];
}

export interface EnergyTopic {
  slug: string;
  title: string;
  h1: string;
  intro: string;
  presetType: "spot" | "fixed" | "open" | null;
  presetKwh: number | null;
  content: string[];
  faq: [string, string][];
}

/**
 * Pörssin oletuskeskihinta laskurissa (c/kWh) — kerrotaan käyttäjälle avoimesti.
 *
 * TÄMÄ ON LASKURIN TÄRKEIN YKSITTÄINEN LUKU. Pörssisopimuksen arviosta noin
 * kaksi kolmasosaa on tätä lukua; marginaali on muutama prosentti ja
 * perusmaksu loput. Jos tämä on väärin, jokainen pörssikortin euromäärä on
 * väärin samalla kertoimella — eikä yksikään muu korjaus sivustolla auta.
 *
 * Siksi luvun rinnalla kulkee peruste ja lähde, ja ne näytetään sivulla.
 * Aiemmin tässä oli 6,2 ilman mitään perustelua. Lähteetön luku on tällä
 * sivustolla pahempi kuin väärä luku, koska väärän voi korjata ja
 * lähteettömän kanssa ei tiedä kumpi se on.
 *
 * ALV: sopimusten marginaalit ja perusmaksut ovat kuluttajahintoja eli
 * arvonlisäverollisia, joten myös keskihinnan on oltava verollinen. Sama
 * luku ilman alv:tä olisi 4,05 c/kWh, ja sen käyttäminen aliarvioisi
 * jokaisen pörssiarvion noin viidenneksellä.
 */
export const ASSUMED_SPOT_AVG: number = electricityJson.assumedSpotAverage;
/** Mihin `ASSUMED_SPOT_AVG` perustuu, esim. "vuoden 2025 toteutunut keskihinta". */
export const SPOT_AVG_BASIS: string = electricityJson.spotAverageBasis;
/** Keskihinnan alv-tila, esim. "alv 25,5 % mukana". */
export const SPOT_AVG_VAT: string = electricityJson.spotAverageVat;
/** Lähde, josta keskihinta on luettu. Näytetään läpinäkyvyysosiossa. */
export const SPOT_AVG_SOURCE: string = electricityJson.spotAverageSource;
export const PRICE_DATE: string = electricityJson.priceDate;

/**
 * Kertoo, näkyykö sivulla yhtään lukua, jota ei ole tarkistettu.
 *
 * MIKSI TÄTÄ EI LUETA PELKÄSTÄÄN YLÄTASON LIPUSTA: se olisi yksi rivi, jonka
 * kääntämällä koko esimerkkihuomautus katoaa sivulta — myös silloin, kun
 * osa hinnoista on yhä tarkistamatta. Juuri se virhe on tässä projektissa
 * kallein mahdollinen: julkaistu vertailu, joka näyttää tarkistetulta mutta
 * ei ole.
 *
 * MIKSI EHTO ON `!p.checkedAt` EIKÄ `p.example === true`. Tässä luki
 * aiemmin jälkimmäinen, ja se oli hyödytön: `getPlans()` on juuri
 * suodattanut `example`-rivit pois, joten lauseke oli aina epätosi eikä
 * voinut laueta koskaan. Turvaverkko, joka ei voi laueta, on pahempi kuin
 * ei turvaverkkoa lainkaan, koska sen olemassaolo saa lopettamaan
 * tarkistamisen.
 *
 * `checkedAt` sen sijaan puuttuu täsmälleen silloin, kun rivi on päässyt
 * näkyviin ilman että kukaan on lukenut hintaa yhtiön omalta sivulta —
 * eli juuri siinä tilanteessa, jota vastaan huomautus on olemassa.
 * `example`-ehto jää mukaan dokumentoimaan aikomuksen siltä varalta, että
 * suodatin joskus muuttuu.
 */
export const IS_EXAMPLE_DATA: boolean =
  electricityJson.isExampleData === true ||
  getPlans().some((p) => p.example === true || !p.checkedAt);

/** Kaikki rivit, myos julkaisemattomat. Vain talon sisaiseen kayttoon. */
function allPlans(): ElectricityPlan[] {
  return electricityJson.plans as ElectricityPlan[];
}

/**
 * Sopimukset, jotka sivusto nayttaa.
 *
 * MIKSI `example`-riveja EI NAYTETA: aineistossa on yha kaksikymmenta
 * nelja sopimusta, joiden hinnat ovat keksittyja esimerkkilukuja.
 * Niiden esittaminen tarkistettujen rinnalla olisi tallaisen sivuston
 * pahin mahdollinen virhe: lukija ei nae eroa, joten yksi keksitty
 * hinta tekee kaikista muistakin epailyttavia — ja vaara hinta on
 * lisaksi kuluttajansuojaongelma. Rivit jaavat JSONiin, koska osa
 * yhtioista on oikeita ja niiden luvut voi tarkistaa myohemmin yksi
 * kerrallaan; naytolle ne paasevat vasta kun `example` poistuu.
 */
export function getPlans(): ElectricityPlan[] {
  return allPlans().filter((p) => p.example !== true && p.hidden !== true);
}

export function getPlan(slug: string): ElectricityPlan | undefined {
  return getPlans().find((p) => p.slug === slug);
}

export function getEnergyTopics(): EnergyTopic[] {
  return topicsJson.topics as EnergyTopic[];
}

export function getEnergyTopic(slug: string): EnergyTopic | undefined {
  return getEnergyTopics().find((t) => t.slug === slug);
}

/** Sopimuksen normaali energiahinta c/kWh — kampanjan jalkeinen taso. */
export function effectivePrice(plan: ElectricityPlan): number {
  return plan.type === "spot"
    ? ASSUMED_SPOT_AVG + (plan.spotMargin ?? 0)
    : (plan.energyPrice ?? 0);
}

/** Energiahinta c/kWh kampanjan aikana. Ilman kampanjaa sama kuin normaali. */
export function campaignPrice(plan: ElectricityPlan): number {
  const c = plan.campaign;
  if (!c) return effectivePrice(plan);
  return plan.type === "spot"
    ? ASSUMED_SPOT_AVG + (c.spotMargin ?? plan.spotMargin ?? 0)
    : (c.energyPrice ?? plan.energyPrice ?? 0);
}

/** Vuosikustannus (€) pelkalla normaalihinnalla, ilman kampanjaa. */
export function normalAnnualCost(plan: ElectricityPlan, kwhPerYear: number): number {
  return plan.basicFee * 12 + (effectivePrice(plan) * kwhPerYear) / 100;
}

/**
 * ENSIMMAISEN VUODEN kustannus (€) annetulla vuosikulutuksella.
 *
 * MIKSI KAMPANJA LASKETAAN MUKAAN JA MIKSI JUURI VUODEKSI.
 *
 * Jokainen kumppani mainostaa kampanjahintaa, ja ne ovat eripituisia:
 * Nordic Green antaa puolet pois kahdeltatoista kuukaudelta, Hehku
 * kolmen kuukauden perusmaksun. Vaihtoehtoja oli kolme, ja kaksi
 * niista on vaaria:
 *
 * 1. Jarjestys kampanjahinnan mukaan. Silloin yhden kuukauden
 *    houkutuslintu voittaa vuoden kestavan alennuksen, ja lista
 *    palkitsee lyhimman tarjouksen. Vertailu lakkaa mittaamasta rahaa.
 * 2. Jarjestys normaalihinnan mukaan. Rehellinen mutta sokea: kampanja
 *    on oikeaa rahaa, ja sivu neuvoisi ohi halvimman vaihtoehdon.
 * 3. Ensimmaisen vuoden yhteissumma. Kampanja painaa tasmalleen sen
 *    verran kuin se kestaa, ja vuosi on se aikajanne, jolla ostaja
 *    paatoksen tekee — sahkosopimuksen voi kilpailuttaa uudestaan.
 *
 * Kolmas on ainoa, joka vastaa kysymykseen "paljonko tama maksaa
 * minulle". Sita tama funktio laskee.
 *
 * TIEDOSSA OLEVA YKSINKERTAISTUS: kulutus jaetaan tasan kuukausille,
 * vaikka sahkoa kuluu talvella moninkertaisesti kesaan verrattuna.
 * Kesalla alkava kampanja tuottaa siis todellisuudessa hieman
 * pienemman hyodyn kuin tama laskee. Virhe on samansuuntainen kaikilla
 * sopimuksilla, joten jarjestys sailyy, ja tarkempi malli vaatisi
 * kuukausiprofiilin, jota ei ole tarkistettuna olemassa.
 */
export function annualCost(plan: ElectricityPlan, kwhPerYear: number): number {
  const c = plan.campaign;
  if (!c) return normalAnnualCost(plan, kwhPerYear);

  const months = Math.max(0, Math.min(c.months, 12));
  const rest = 12 - months;
  const kwhPerMonth = kwhPerYear / 12;

  const campFee = c.basicFee ?? plan.basicFee;
  const campEnergy = campaignPrice(plan);
  const normEnergy = effectivePrice(plan);

  return (
    campFee * months +
    plan.basicFee * rest +
    (campEnergy * kwhPerMonth * months) / 100 +
    (normEnergy * kwhPerMonth * rest) / 100
  );
}

/**
 * Yhtion oma osuus ensimmaisena vuonna (€) — perusmaksu ja marginaali,
 * ILMAN porssin spot-hintaa. Vain porssisopimuksille; palauttaa `null`
 * muille.
 *
 * MIKSI TAMA ON OMA FUNKTIONSA EIKA VAHENNYSLASKU KOMPONENTISSA:
 * `annualCost` painottaa kampanjan ja normaalin jakson eri pituisiksi,
 * joten "kokonaishinta miinus ASSUMED_SPOT_AVG × kWh" antaisi oikean
 * luvun vain sattumalta. Kampanja voi muuttaa marginaalia, ja silloin
 * yhtion oma osuus jakautuu kahdelle eri tasolle tasmalleen samoin kuin
 * kokonaishinta. Sama painotus lasketaan siis tassa uudestaan.
 *
 * Luku on tarkka, ei arvio: perusmaksu ja marginaali ovat sopimusehtoja.
 * Se on myos ainoa osa laskusta, johon kilpailuttaminen vaikuttaa.
 */
export function ownChargesAnnual(
  plan: ElectricityPlan,
  kwhPerYear: number
): number | null {
  if (plan.type !== "spot") return null;

  const margin = plan.spotMargin ?? 0;
  const c = plan.campaign;
  if (!c) return plan.basicFee * 12 + (margin * kwhPerYear) / 100;

  const months = Math.max(0, Math.min(c.months, 12));
  const rest = 12 - months;
  const kwhPerMonth = kwhPerYear / 12;
  const campFee = c.basicFee ?? plan.basicFee;
  const campMargin = c.spotMargin ?? margin;

  return (
    campFee * months +
    plan.basicFee * rest +
    (campMargin * kwhPerMonth * months) / 100 +
    (margin * kwhPerMonth * rest) / 100
  );
}

/** Paljonko kampanja saastaa ensimmaisena vuonna (€). 0 jos kampanjaa ei ole. */
export function campaignSaving(plan: ElectricityPlan, kwhPerYear: number): number {
  if (!plan.campaign) return 0;
  return normalAnnualCost(plan, kwhPerYear) - annualCost(plan, kwhPerYear);
}

/**
 * Kuukausihinta kampanjan aikana (€/kk).
 *
 * Tama on kortin ISO luku. Se kertoo mita asiakas maksaa juuri nyt, jos han
 * tekee sopimuksen tanaan — ei ensimmaisen vuoden keskiarvoa. Perustelu:
 * keskiarvo nayttaa kalliimmalta kuin lasku, joka oikeasti kolahtaa postiin,
 * ja osa kavijoista paatteli siita ettei parempaa sopimusta ole saatavilla.
 * Menetetty klikki on menetetty palkkio.
 *
 * Tama on myos koko vertailun JARJESTYSPERUSTE: lista, "Ketun valinta",
 * hintapalkit ja "ala vaihda" -paatos lasketaan kaikki tasta luvusta.
 * Jesse paatti nain, ja peruste on selva: jos asiakas saa meilta 0,39
 * marginaalin ja maksaa nyt 0,49, han saa halvemman sopimuksen — ja
 * laskuri, joka vastaa siihen "ala vaihda", menettaa klikin ja palkkion.
 *
 * Vastapaino on kortin sisalla, ei kaavassa: ison luvun vieressa lukee
 * kampanjan kesto ja sen alla "Kampanjan jalkeen X € / kk". Se on syy,
 * miksi noita rivaja ei saa poistaa tilan saastamiseksi.
 *
 * Jos kampanjaa ei ole, palautetaan normaali kuukausihinta.
 */
export function campaignMonthlyCost(
  plan: ElectricityPlan,
  kwhPerYear: number
): number {
  const c = plan.campaign;
  if (!c) return normalAnnualCost(plan, kwhPerYear) / 12;

  const fee = c.basicFee ?? plan.basicFee;
  return fee + (campaignPrice(plan) * (kwhPerYear / 12)) / 100;
}

export const TYPE_LABEL: Record<ElectricityPlan["type"], string> = {
  spot: "Pörssisähkö",
  fixed: "Kiinteä hinta",
  open: "Toistaiseksi voimassa",
};

/**
 * Asumismuotojen kulutusarviot (kWh/v) — kyselyn nappien lähtöarvot.
 *
 * Luvut ovat tarkoituksella haarukoiden ALALAIDASSA, eivät keskiarvoja.
 * Perustelu: luku on esitäyttö, jonka käyttäjä voi kirjoittaa yli. Liian
 * suuri esitäyttö näyttää kävijälle laskun, joka on isompi kuin hänen
 * omansa, ja hän lähtee. Liian pienen hän korjaa ylöspäin. Väärä arvaus
 * alaspäin maksaa siis vähemmän kuin ylöspäin.
 *
 * Laskettu koko 47 sopimuksen datalla: halvin sopimus on sama kaikilla
 * kulutuksilla 1 000–15 000 kWh, joten matalampi esitäyttö EI muuta
 * suositusta eikä juuri näytettävää säästöä (kerrostalossa 75 € → 66 €
 * vuodessa). Muutos näkyy käytännössä vain kuukausihinnassa.
 *
 * Julkaistut haarukat vertailun vuoksi (Fortum, Vattenfall, Lumme,
 * Vaasan Sähkö, Selectra): kerrostaloyksiö 1 500–2 500, rivitalo ilman
 * sähkölämmitystä n. 4 000, omakotitalo ilman sähkölämmitystä n. 6 000,
 * sähkölämmitteinen 150 m² talo 17 000–20 000.
 *
 * Kerrostalon 1 000 on tietoisesti noiden haarukoiden ALLA: se on vähän
 * kuluttavan yksinasujan luku, ei tyypillisen kerrostaloasunnon. Siksi
 * käyttöliittymä saa kutsua näitä vain "arvioksi" — luvun viereen ei saa
 * kirjoittaa väitettä siitä, mikä on tavallista tai keskimääräistä.
 * Väärä keskiarvoväite olisi kuluttajansuojariski ja veisi sivulta juuri
 * sen luottamuksen, jonka varassa koko klikki on.
 */
export const DWELLINGS = [
  { key: "kerrostalo", label: "Kerrostalo", kwh: 1000, hint: "n. 1 000 kWh/v" },
  { key: "rivitalo", label: "Rivitalo", kwh: 3500, hint: "n. 3 500 kWh/v" },
  { key: "omakotitalo", label: "Omakotitalo", kwh: 7000, hint: "ei sähkölämmitystä, n. 7 000 kWh/v" },
  { key: "sahkolammitys", label: "Sähkölämmitteinen talo", kwh: 18000, hint: "n. 18 000 kWh/v" },
] as const;
