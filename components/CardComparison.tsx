"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  CreditCard,
  Fuel,
  GraduationCap,
  Palmtree,
  Repeat,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import type { Card, FilterKey } from "@/lib/types";
import { FILTERS, cardMatchesFilter } from "@/lib/types";
import CardTile from "./CardTile";
import MatchWizard from "./MatchWizard";

/** Mockupin ikonoidut kategoriavälilehdet. */
const TABS = [
  { key: null, label: "Kaikki kortit", icon: CreditCard },
  { key: "cashback" as FilterKey, label: "Cashback", icon: Repeat },
  { key: "matkailu" as FilterKey, label: "Matkailu", icon: Palmtree },
  { key: "polttoaine" as FilterKey, label: "Polttoaine", icon: Fuel },
  { key: "premium" as FilterKey, label: "Premium", icon: Sparkles },
  { key: "opiskelija" as FilterKey, label: "Paras opiskelijalle", icon: GraduationCap },
];

function matchScore(card: Card, active: FilterKey[]): number {
  const ratingPart = (card.rating / 5) * 100;
  if (active.length === 0) return Math.round(ratingPart);
  const hits = active.filter((f) => cardMatchesFilter(card, f)).length;
  return Math.round(0.7 * (hits / active.length) * 100 + 0.3 * ratingPart);
}

export default function CardComparison({ cards }: { cards: Card[] }) {
  const [tab, setTab] = useState<FilterKey | null>(null);
  const [active, setActive] = useState<FilterKey[]>([]);
  const [sheet, setSheet] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [wizardDone, setWizardDone] = useState(false);
  const reduce = useReducedMotion();

  const toggle = (key: FilterKey) =>
    setActive((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

  const all = useMemo<FilterKey[]>(
    () => (tab ? Array.from(new Set([...active, tab])) : active),
    [tab, active]
  );

  const scored = useMemo(
    () =>
      cards
        .map((card) => ({ card, score: matchScore(card, all) }))
        .filter((s) => (all.length ? s.score >= 40 : true))
        .sort((a, b) => b.score - a.score || Number(b.card.featured) - Number(a.card.featured)),
    [cards, all]
  );

  const visible = showAll ? scored : scored.slice(0, 4);

  return (
    <div>
      <MatchWizard
        onComplete={(f) => {
          setActive(f);
          setWizardDone(true);
        }}
        onReset={() => {
          setActive([]);
          setWizardDone(false);
        }}
      />

      {/* Vertailupaneeli */}
      <div className="mt-8 rounded-3xl border border-line bg-white p-4 shadow-card sm:p-6">
        {/* Välilehdet */}
        <div className="flex items-center gap-3">
          <div className="scrollbar-none -mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 pb-1">
            {TABS.map((t) => {
              const on = tab === t.key;
              return (
                <button
                  key={t.label}
                  onClick={() => setTab(t.key)}
                  aria-pressed={on}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 font-display text-[13px] font-semibold transition-all active:scale-[0.97] ${
                    on
                      ? "bg-accentSoft text-accentDark"
                      : "text-ink/68 hover:bg-mist hover:text-ink"
                  }`}
                >
                  <t.icon size={16} strokeWidth={1.9} aria-hidden />
                  {t.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setSheet(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-line px-4 py-2.5 font-display text-[13px] font-semibold text-ink/80 transition-colors hover:border-ink/25 hover:text-ink"
          >
            <SlidersHorizontal size={15} aria-hidden />
            Suodattimet
            {active.length > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] text-cream">
                {active.length}
              </span>
            )}
          </button>
        </div>

        <h3 className="mt-6 font-display text-xl font-semibold text-ink sm:text-2xl">
          {wizardDone ? "Sinulle sopivimmat kortit" : "Suosituimmat kortit juuri nyt"}
        </h3>
        <p className="mt-1 text-sm text-ink/68" aria-live="polite">
          {scored.length} korttia vastaa valintojasi.
        </p>

        {/* Ruudukko */}
        <LayoutGroup>
          <motion.div layout={!reduce} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map(({ card, score }, i) => (
                <motion.div
                  key={card.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                >
                  <CardTile
                    card={card}
                    score={all.length ? score : undefined}
                    topMatch={wizardDone && all.length > 0 && i === 0}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>

        {scored.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-mist p-10 text-center">
            <p className="font-display text-lg font-semibold text-ink">
              Kettu ei löytänyt korttia näillä ehdoilla
            </p>
            <button
              onClick={() => {
                setActive([]);
                setTab(null);
              }}
              className="btn-ember mt-4 rounded-xl px-5 py-2.5 font-display text-sm font-semibold text-cream transition-all active:scale-[0.98]"
            >
              Tyhjennä suodattimet
            </button>
          </div>
        )}

        {scored.length > 4 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-xl border border-line px-6 py-3 font-display text-sm font-semibold text-ink/82 transition-colors hover:border-ink/25 hover:text-ink"
            >
              {showAll ? "Näytä vähemmän" : `Näytä kaikki kortit (${scored.length})`}
              <ChevronDown
                size={16}
                className={`transition-transform ${showAll ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
          </div>
        )}
      </div>

      {/* Suodatinpaneeli (mobiilissa alhaalta, työpöydällä oikealta) */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheet(false)}
            />
            <motion.aside
              role="dialog"
              aria-label="Suodattimet"
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[380px] sm:max-h-none sm:rounded-l-3xl sm:rounded-tr-none"
              initial={reduce ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduce ? undefined : { y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-ink">Suodattimet</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActive([])}
                    className="text-sm font-medium text-ink/62 hover:text-ink"
                  >
                    Tyhjennä
                  </button>
                  <button
                    onClick={() => setSheet(false)}
                    aria-label="Sulje suodattimet"
                    className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink/72"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-5 space-y-1">
                {FILTERS.map((f) => {
                  const on = active.includes(f.key);
                  return (
                    <button
                      key={f.key}
                      onClick={() => toggle(f.key)}
                      role="checkbox"
                      aria-checked={on}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left transition-colors ${
                        on ? "bg-accentSoft" : "hover:bg-mist"
                      }`}
                    >
                      <span
                        className={`text-[15px] font-medium ${on ? "text-accentDark" : "text-ink/82"}`}
                      >
                        {f.label}
                      </span>
                      <span
                        className={`grid h-5 w-5 place-items-center rounded-full border-2 transition-colors ${
                          on ? "border-accent" : "border-line"
                        }`}
                      >
                        {on && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setSheet(false)}
                className="btn-ember sticky bottom-0 mt-6 w-full rounded-xl py-4 font-display text-[15px] font-bold text-cream transition-all active:scale-[0.98]"
              >
                Näytä tulokset ({scored.length})
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
