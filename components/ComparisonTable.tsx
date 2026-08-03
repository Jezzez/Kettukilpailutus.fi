"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Check, Minus } from "lucide-react";
import type { Card } from "@/lib/types";
import AffiliateButton from "./AffiliateButton";
import { CardMark } from "./CardTile";

type SortKey = "annualFeeNumeric" | "interestNumeric" | "creditLimitMax" | "rating";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "annualFeeNumeric", label: "Vuosimaksu" },
  { key: "interestNumeric", label: "Korko" },
  { key: "creditLimitMax", label: "Luottoraja" },
];

/** Kyllä/ei-solu: väri ja ikoni kantavat merkityksen, sr-teksti varmistaa saavutettavuuden. */
function Bool({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-ok/15 text-ok">
      <Check size={14} strokeWidth={2.5} aria-hidden /><span className="sr-only">Kyllä</span>
    </span>
  ) : (
    <span className="inline-grid h-6 w-6 place-items-center rounded-full text-ink/30">
      <Minus size={14} aria-hidden /><span className="sr-only">Ei</span>
    </span>
  );
}

export default function ComparisonTable({ cards }: { cards: Card[] }) {
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: "annualFeeNumeric", asc: true });

  const sorted = useMemo(
    () => [...cards].sort((a, b) => (sort.asc ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key])),
    [cards, sort]
  );

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, asc: s.key === key ? !s.asc : true }));

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
      <table className="w-full min-w-[900px] border-collapse text-left text-sm">
        <caption className="sr-only">Luottokorttien vertailutaulukko</caption>
        <thead>
          <tr className="border-b border-line bg-mist/70 text-[13px] text-ink/70">
            <th scope="col" className="sticky left-0 z-10 bg-mist px-5 py-3.5 font-semibold">Kortti</th>
            {COLUMNS.map((c) => (
              <th key={c.key} scope="col" className="px-4 py-3.5 font-semibold">
                <button
                  onClick={() => toggleSort(c.key)}
                  className="inline-flex items-center gap-1 hover:text-ink"
                  aria-label={`Järjestä sarakkeen ${c.label} mukaan`}
                >
                  {c.label} <ArrowUpDown size={13} aria-hidden className={sort.key === c.key ? "text-accentDark" : ""} />
                </button>
              </th>
            ))}
            <th scope="col" className="px-4 py-3.5 font-semibold">Cashback</th>
            <th scope="col" className="px-4 py-3.5 font-semibold">Matkavakuutus</th>
            <th scope="col" className="px-4 py-3.5 font-semibold">Koroton aika</th>
            <th scope="col" className="px-4 py-3.5 font-semibold">Apple Pay</th>
            <th scope="col" className="px-4 py-3.5 font-semibold">Google Pay</th>
            <th scope="col" className="px-4 py-3.5 font-semibold">Hakemus</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((card) => (
            <tr key={card.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-mist/40">
              <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-4 font-medium">
                <Link href={`/kortit/${card.slug}`} className="flex items-center gap-3 hover:underline underline-offset-4">
                  <CardMark card={card} size={36} />
                  <span className="text-ink">{card.name}</span>
                </Link>
              </th>
              <td className="px-4 py-4 font-data text-[13px]">{card.annualFee}</td>
              <td className="px-4 py-4 font-data text-[13px]">{card.interest}</td>
              <td className="px-4 py-4 font-data text-[13px]">{card.creditLimit}</td>
              <td className="px-4 py-4"><Bool value={card.hasCashback} /></td>
              <td className="px-4 py-4"><Bool value={card.travelInsurance} /></td>
              <td className="px-4 py-4 font-data text-[13px]">{card.interestFreeDays}</td>
              <td className="px-4 py-4"><Bool value={card.applePay} /></td>
              <td className="px-4 py-4"><Bool value={card.googlePay} /></td>
              <td className="px-4 py-4">
                <AffiliateButton href={card.affiliateUrl} cardId={card.id} placement="table" variant="small">
                  Hae
                </AffiliateButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
