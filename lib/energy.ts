import electricityJson from "@/data/electricity.json";
import topicsJson from "@/data/energy-topics.json";

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
  rating: number;
  reviews: number;
  affiliateUrl: string;
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
 * Kertoo, ovatko luvut vielä esimerkkidataa. Päivämäärän korottaminen ilman
 * että hinnat on oikeasti tarkistettu olisi kuluttajalle valehtelua, joten
 * vanhentumista ei piiloteta — se kerrotaan. Kun `data/electricity.json`
 * saa todelliset hinnat, aseta `isExampleData: false` ja huomautus katoaa.
 */
export const IS_EXAMPLE_DATA: boolean = electricityJson.isExampleData === true;

export function getPlans(): ElectricityPlan[] {
  return electricityJson.plans as ElectricityPlan[];
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

/** Sopimuksen efektiivinen energiahinta c/kWh laskuria varten. */
export function effectivePrice(plan: ElectricityPlan): number {
  return plan.type === "spot"
    ? ASSUMED_SPOT_AVG + (plan.spotMargin ?? 0)
    : (plan.energyPrice ?? 0);
}

/** Arvioitu vuosikustannus (€) annetulla vuosikulutuksella. */
export function annualCost(plan: ElectricityPlan, kwhPerYear: number): number {
  return plan.basicFee * 12 + (effectivePrice(plan) * kwhPerYear) / 100;
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
