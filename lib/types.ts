/** Yhden luottokortin tietomalli. Kaikki sisältö tulee data/cards.json-tiedostosta. */
export interface Card {
  id: string;
  slug: string;
  name: string;
  issuer: string;
  network: string;
  rating: number;
  reviews: number;
  annualFee: string;
  annualFeeNumeric: number;
  interest: string;
  interestNumeric: number;
  creditLimit: string;
  creditLimitMax: number;
  interestFreeDays: string;
  cashback: string;
  hasCashback: boolean;
  bonuses: string;
  travelInsurance: boolean;
  applePay: boolean;
  googlePay: boolean;
  bonusProgram: boolean;
  tags: string[];
  featured: boolean;
  affiliateUrl: string;
  gradient: [string, string];
  summary: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  fees: [string, string][];
  faq: [string, string][];
}

export interface Post {
  slug: string;
  title: string;
  category: string;
  date: string;
  readMinutes: number;
  excerpt: string;
  body: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

/** Suodattimet, jotka näkyvät vertailussa. Avain vastaa suodatuslogiikkaa. */
export const FILTERS = [
  { key: "ei-vuosimaksua", label: "Ei vuosimaksua" },
  { key: "cashback", label: "Cashback" },
  { key: "matkailu", label: "Matkailu" },
  { key: "opiskelija", label: "Paras opiskelijalle" },
  { key: "yritys", label: "Paras yritykselle" },
  { key: "matala-korko", label: "Matala korko" },
  { key: "suuri-luottoraja", label: "Suuri luottoraja" },
  { key: "apple-pay", label: "Apple Pay" },
  { key: "google-pay", label: "Google Pay" },
  { key: "bonusohjelma", label: "Bonusohjelma" },
  { key: "polttoaine", label: "Polttoaine" },
  { key: "premium", label: "Premium" },
] as const;

export type FilterKey = (typeof FILTERS)[number]["key"];

/** Palauttaa true, jos kortti läpäisee annetun suodattimen. */
export function cardMatchesFilter(card: Card, key: FilterKey): boolean {
  switch (key) {
    case "ei-vuosimaksua": return card.annualFeeNumeric === 0;
    case "cashback": return card.hasCashback;
    case "apple-pay": return card.applePay;
    case "google-pay": return card.googlePay;
    case "bonusohjelma": return card.bonusProgram;
    case "matala-korko": return card.interestNumeric > 0 && card.interestNumeric <= 9;
    case "suuri-luottoraja": return card.creditLimitMax >= 17000;
    default: return card.tags.includes(key);
  }
}
