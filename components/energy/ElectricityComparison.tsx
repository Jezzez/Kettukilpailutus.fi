"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Building2, Home, House, Flame, Leaf, Info } from "lucide-react";
import type { ElectricityPlan } from "@/lib/energy";
import { annualCost, ASSUMED_SPOT_AVG, DWELLINGS, PRICE_DATE } from "@/lib/energy";
import PlanCard from "./PlanCard";

/**
 * Sähkövertailun ydin.
 *
 * CRO-logiikka:
 * 1. Kulutusarvio ensin (asumismuoto → kWh, muokattavissa) — sen jälkeen
 *    jokainen hinta sivulla on henkilökohtainen euromäärä, ei c/kWh-abstraktio.
 * 2. Halvin sopimus korostetaan ja jokaiseen korttiin lasketaan säästö
 *    kalleimpaan vaihtoehtoon verrattuna — vaihtamisen hyöty näkyy euroina.
 * 3. Laskentaoletukset kerrotaan avoimesti (spot-keskihinta, päivämäärä).
 */
const TYPE_TABS = [
  { key: null, label: "Kaikki" },
  { key: "spot", label: "Pörssisähkö" },
  { key: "fixed", label: "Kiinteä hinta" },
  { key: "open", label: "Toistaiseksi voimassa" },
] as const;

const DWELLING_ICONS = { kerrostalo: Building2, rivitalo: Home, omakotitalo: House, sahkolammitys: Flame } as const;

export default function ElectricityComparison({
  plans,
  initialType = null,
  initialKwh = 5000,
}: {
  plans: ElectricityPlan[];
  initialType?: "spot" | "fixed" | "open" | null;
  initialKwh?: number;
}) {
  const [kwh, setKwh] = useState(initialKwh);
  const [dwelling, setDwelling] = useState<string | null>(
    DWELLINGS.find((d) => d.kwh === initialKwh)?.key ?? null
  );
  const [type, setType] = useState<"spot" | "fixed" | "open" | null>(initialType);
  const [greenOnly, setGreenOnly] = useState(false);
  const reduce = useReducedMotion();

  const filtered = useMemo(
    () =>
      plans
        .filter((p) => (type ? p.type === type : true))
        .filter((p) => (greenOnly ? p.green : true))
        .sort((a, b) => annualCost(a, kwh) - annualCost(b, kwh)),
    [plans, type, greenOnly, kwh]
  );

  const priciestAll = useMemo(
    () => Math.max(...plans.map((p) => annualCost(p, kwh))),
    [plans, kwh]
  );

  return (
    <div className="rounded-3xl border border-line bg-white p-4 shadow-card sm:p-6">
      {/* 1) Kulutusarvio */}
      <fieldset>
        <legend className="font-display text-[15px] font-semibold text-ink">
          Millaisessa asunnossa asut?
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DWELLINGS.map((d) => {
            const Icon = DWELLING_ICONS[d.key as keyof typeof DWELLING_ICONS];
            const on = dwelling === d.key;
            return (
              <button
                key={d.key}
                onClick={() => { setDwelling(d.key); setKwh(d.kwh); }}
                aria-pressed={on}
                className={`rounded-xl border px-3 py-3 text-left transition-all active:scale-[0.98] ${
                  on ? "border-accent bg-accentSoft" : "border-line hover:border-ink/25"
                }`}
              >
                <Icon size={18} className={on ? "text-accentDark" : "text-ink/40"} aria-hidden />
                <p className={`mt-1.5 font-display text-[13px] font-semibold ${on ? "text-accentDark" : "text-ink/80"}`}>
                  {d.label}
                </p>
                <p className="text-[11px] text-ink/45">{d.hint}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label htmlFor="kwh" className="text-[13px] font-medium text-ink/65">
            Tarkka vuosikulutus:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="kwh"
              type="number"
              inputMode="numeric"
              min={500}
              max={40000}
              step={100}
              value={kwh}
              onChange={(e) => { setKwh(Math.max(0, Number(e.target.value))); setDwelling(null); }}
              className="w-28 rounded-xl border border-line bg-white px-3 py-2 text-right font-data text-[14px] font-semibold text-ink focus:border-accent focus:outline-none"
            />
            <span className="text-[13px] text-ink/55">kWh/v</span>
          </div>
          <span className="text-[12px] text-ink/40">Löydät luvun edellisestä sähkölaskustasi.</span>
        </div>
      </fieldset>

      {/* 2) Sopimustyyppi + vihreä */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
        <div className="scrollbar-none -mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1">
          {TYPE_TABS.map((t) => {
            const on = type === t.key;
            return (
              <button
                key={t.label}
                onClick={() => setType(t.key as typeof type)}
                aria-pressed={on}
                className={`shrink-0 rounded-xl px-4 py-2.5 font-display text-[13px] font-semibold transition-all active:scale-[0.97] ${
                  on ? "bg-accentSoft text-accentDark" : "text-ink/55 hover:bg-mist hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setGreenOnly(!greenOnly)}
          aria-pressed={greenOnly}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2.5 font-display text-[13px] font-semibold transition-all active:scale-[0.97] ${
            greenOnly ? "border-accent bg-accentSoft text-accentDark" : "border-line text-ink/60 hover:border-ink/25"
          }`}
        >
          <Leaf size={14} aria-hidden /> Vain uusiutuva
        </button>
      </div>

      {/* 3) Tulokset */}
      <p className="mt-5 text-sm text-ink/55" aria-live="polite">
        {filtered.length} sopimusta · järjestetty edullisimmasta kulutuksellasi
      </p>

      <LayoutGroup>
        <motion.div layout={!reduce} className="mt-4 grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((plan, i) => {
              const saving = priciestAll - annualCost(plan, kwh);
              return (
                <motion.div
                  key={plan.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                >
                  <PlanCard plan={plan} kwh={kwh} cheapest={i === 0 && filtered.length > 1} savings={saving} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {filtered.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-line bg-mist p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            Näillä rajauksilla ei löytynyt sopimuksia
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink/55">
            Kokeile poistaa uusiutuva-rajaus tai valita toinen sopimustyyppi.
          </p>
          <button
            onClick={() => { setType(null); setGreenOnly(false); }}
            className="mt-4 rounded-xl bg-accent px-5 py-2.5 font-display text-sm font-semibold text-white hover:bg-accentDark"
          >
            Näytä kaikki sopimukset
          </button>
        </div>
      )}

      {/* 4) Laskentaoletukset avoimesti */}
      <p className="mt-6 flex items-start gap-2 rounded-xl bg-mist/70 p-3.5 text-[12px] leading-relaxed text-ink/55">
        <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
        <span>
          Pörssisopimusten arvio perustuu {ASSUMED_SPOT_AVG.toLocaleString("fi-FI")} c/kWh
          keskihintaan — toteutunut hinta vaihtelee tunneittain. Hinnat tarkistettu{" "}
          {new Date(PRICE_DATE).toLocaleDateString("fi-FI")}. Arviot eivät sisällä siirtomaksua,
          joka on sama yhtiöstä riippumatta.
        </span>
      </p>
    </div>
  );
}
