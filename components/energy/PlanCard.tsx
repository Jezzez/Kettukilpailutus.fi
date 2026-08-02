"use client";

import Link from "next/link";
import { Check, Leaf, Star, Zap } from "lucide-react";
import type { ElectricityPlan } from "@/lib/energy";
import { annualCost, TYPE_LABEL } from "@/lib/energy";
import AffiliateButton from "../AffiliateButton";

export type PlanBadge = { kind: "cheapest" | "fox"; note?: string } | null;

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
  savings = 0,
  savingsLabel = "",
  maxCost,
}: {
  plan: ElectricityPlan;
  kwh: number;
  badge?: PlanBadge;
  savings?: number;
  savingsLabel?: string;
  maxCost: number;
}) {
  const yearly = annualCost(plan, kwh);
  const monthly = yearly / 12;
  const barWidth = Math.max(8, Math.round((yearly / maxCost) * 100));
  const highlighted = badge !== null;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/35 hover:shadow-cardHover ${
        badge?.kind === "cheapest"
          ? "border-accent/45 shadow-cardHover"
          : badge?.kind === "fox"
            ? "border-gold/45 shadow-cardHover"
            : "border-line shadow-card"
      }`}
    >
      {badge?.kind === "cheapest" && (
        <div className="bg-accent px-5 py-2.5">
          <p className="flex items-center gap-1.5 font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-den">
            <Zap size={12} aria-hidden /> Edullisin kulutuksellasi
          </p>
        </div>
      )}
      {badge?.kind === "fox" && (
        <div className="border-b border-gold/25 bg-gold/[0.12] px-5 py-2.5">
          <p className="flex items-center gap-1.5 font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-gold">
            <FoxPaw /> Ketun valinta
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {badge?.note && (
          <p className="mb-3 text-[12px] leading-snug text-ink/68">{badge.note}</p>
        )}

        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-[17.5px] font-bold leading-tight text-ink">
              <Link href={`/sahkosopimukset/sopimus/${plan.slug}`} className="underline-offset-4 hover:underline">
                {plan.provider}
              </Link>
            </h3>
            <p className="mt-0.5 text-[13px] text-ink/62">{plan.name}</p>
          </div>
          {/*
            Laatta on tarkoituksella neutraali. Palveluntarjoajan omat
            brändivärit toisivat sivulle 4–5 uutta väriä, ja paletissa on
            vain oranssi ja kulta. Erottelu tehdään valoarvolla ja tekstillä.
          */}
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-den"
            aria-hidden
          >
            <Zap size={17} className="text-accent" />
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-mist px-2.5 py-1 text-[11px] font-semibold text-ink/72">
            {TYPE_LABEL[plan.type]}
            {plan.fixedTermMonths ? ` · ${plan.fixedTermMonths} kk` : ""}
          </span>
          {plan.green && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-accentSoft px-2.5 py-1 text-[11px] font-semibold text-accentDark">
              <Leaf size={11} aria-hidden /> Uusiutuva
            </span>
          )}
        </div>

        <div className="mt-5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-data text-[34px] font-extrabold leading-none tracking-tight text-ink">
              {monthly.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} €
            </span>
            <span className="font-display text-[14px] font-semibold text-ink/58">/ kk</span>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-den">
            <div
              className={`h-full rounded-full transition-all duration-500 ${highlighted ? "bg-accent" : "bg-ink/20"}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>

          <p className="mt-2 text-[12.5px] text-ink/62">
            {yearly.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} € vuodessa
          </p>
          {savings > 0 && (
            <p className="mt-1 text-[12.5px] font-semibold text-accentDark">
              Säästät {savings.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} € {savingsLabel}
            </p>
          )}
        </div>

        <dl className="mt-5 space-y-2 rounded-2xl border border-line bg-den/60 p-3.5">
          <div className="flex justify-between text-[12.5px]">
            <dt className="text-ink/62">{plan.type === "spot" ? "Marginaali" : "Energia"}</dt>
            <dd className="font-data font-bold text-ink">
              {plan.type === "spot"
                ? `${plan.spotMargin?.toLocaleString("fi-FI")} c/kWh + pörssi`
                : `${plan.energyPrice?.toLocaleString("fi-FI")} c/kWh`}
            </dd>
          </div>
          <div className="flex justify-between text-[12.5px]">
            <dt className="text-ink/62">Perusmaksu</dt>
            <dd className="font-data font-bold text-ink">{plan.basicFee.toLocaleString("fi-FI")} €/kk</dd>
          </div>
        </dl>

        <ul className="mt-4 flex-1 space-y-1.5">
          {plan.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13px] leading-snug text-ink/80">
              <Check size={14} strokeWidth={3} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
          <p className="flex items-center gap-1 text-[12px] text-ink/62">
            <Star size={13} className="fill-star text-star" aria-hidden />
            <span className="font-data font-bold text-ink">{plan.rating.toFixed(1)}</span> ({plan.reviews})
          </p>
          <Link
            href={`/sahkosopimukset/sopimus/${plan.slug}`}
            className="text-[13px] font-semibold text-ink/62 underline-offset-4 hover:text-ink hover:underline"
          >
            Tiedot
          </Link>
        </div>

        <div className="mt-3">
          <AffiliateButton href={plan.affiliateUrl} cardId={plan.id} placement="energy-grid" className="w-full">
            Tee sopimus
          </AffiliateButton>
        </div>
      </div>
    </article>
  );
}

/** Pieni tassunjälki — ketun oma merkki suositukselle. */
function FoxPaw() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <ellipse cx="12" cy="16" rx="5.2" ry="4.4" />
      <ellipse cx="5.6" cy="10.4" rx="2.2" ry="2.9" />
      <ellipse cx="18.4" cy="10.4" rx="2.2" ry="2.9" />
      <ellipse cx="9" cy="5.6" rx="2" ry="2.7" />
      <ellipse cx="15" cy="5.6" rx="2" ry="2.7" />
    </svg>
  );
}
