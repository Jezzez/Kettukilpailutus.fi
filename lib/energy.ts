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
   * Yhtiön logo, polku `public/`-kansiosta (esim. "/logot/lumo.svg").
   *
   * Vapaaehtoinen tarkoituksella: nykyiset yhtiöt ovat esimerkkidataa, joten
   * oikeita logoja ei ole eikä keksittyä logoa saa piirtää. Kun Adtractionin
   * mediapankista tulee kumppanin logo, tiedosto viedään `public/logot/` ja
   * polku tähän kenttään — kortti alkaa näyttää sen ilman koodimuutoksia.
   * Ilman kenttää kortti näyttää yhtiön nimikirjaimet.
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

/** Pörssin oletuskeskihinta laskurissa (c/kWh) — kerrotaan käyttäjälle avoimesti. */
export const ASSUMED_SPOT_AVG: number = electricityJson.assumedSpotAverage;
export const PRICE_DATE: string = electricityJson.priceDate;

/**
 * Kertoo, ovatko luvut vielä esimerkkidataa.
 *
 * MIKSI TÄTÄ EI LUETA PELKÄSTÄÄN YLÄTASON LIPUSTA: se olisi yksi rivi, jonka
 * kääntämällä koko esimerkkihuomautus katoaa sivulta — myös silloin, kun
 * kahdenkymmenen sopimuksen hinnat ovat yhä keksittyjä. Juuri se virhe on
 * tässä projektissa kallein mahdollinen: julkaistu vertailu, joka näyttää
 * tarkistetulta mutta ei ole. Siksi huomautus on päällä niin kauan kuin
 * yhdessäkin sopimuksessa on `example: true`, eikä sitä voi sammuttaa
 * muuten kuin tarkistamalla luvut yksi sopimus kerrallaan.
 */
export const IS_EXAMPLE_DATA: boolean =
  electricityJson.isExampleData === true ||
  getPlans().some((p) => p.example === true);

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
  return allPlans().filter((p) => p.example !== true);
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

/** Paljonko kampanja saastaa ensimmaisena vuonna (€). 0 jos kampanjaa ei ole. */
export function campaignSaving(plan: ElectricityPlan, kwhPerYear: number): number {
  if (!plan.campaign) return 0;
  return normalAnnualCost(plan, kwhPerYear) - annualCost(plan, kwhPerYear);
}

export const TYPE_LABEL: Record<ElectricityPlan["type"], string> = {
  spot: "Pörssisähkö",
  fixed: "Kiinteä hinta",
  open: "Toistaiseksi voimassa",
};

/** Asumismuotojen kulutusesimerkit (kWh/v) — vakiintuneet suomalaiset arviot. */
export const DWELLINGS = [
  { key: "kerrostalo", label: "Kerrostalo", kwh: 2000, hint: "n. 2 000 kWh/v" },
  { key: "rivitalo", label: "Rivitalo", kwh: 5000, hint: "n. 5 000 kWh/v" },
  { key: "omakotitalo", label: "Omakotitalo", kwh: 8000, hint: "ei sähkölämmitystä, n. 8 000 kWh/v" },
  { key: "sahkolammitys", label: "Sähkölämmitteinen talo", kwh: 18000, hint: "n. 18 000 kWh/v" },
] as const;
