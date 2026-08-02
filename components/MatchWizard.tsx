"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import Kettu from "./mascot/Kettu";
import type { FilterKey } from "@/lib/types";

/**
 * Ohjattu polku: kolme kysymystä, joista jokainen valinta täyttää
 * suodattimet käyttäjän puolesta. Ei lomake vaan eteneminen.
 */
interface Question {
  q: string;
  options: { label: string; filters: FilterKey[] }[];
}

const QUESTIONS: Question[] = [
  {
    q: "Miten aiot käyttää korttia?",
    options: [
      { label: "Maksan laskun aina kokonaan", filters: [] },
      { label: "Käytän maksuaikaa erissä", filters: ["matala-korko"] },
      { label: "Yrityksen kuluihin", filters: ["yritys"] },
    ],
  },
  {
    q: "Mikä etu on sinulle tärkein?",
    options: [
      { label: "Ei vuosimaksua", filters: ["ei-vuosimaksua"] },
      { label: "Bonukset ja cashback", filters: ["cashback", "bonusohjelma"] },
      { label: "Matkaedut ja vakuutukset", filters: ["matkailu"] },
    ],
  },
  {
    q: "Maksatko puhelimella?",
    options: [
      { label: "Apple Pay", filters: ["apple-pay"] },
      { label: "Google Pay", filters: ["google-pay"] },
      { label: "Ei väliä", filters: [] },
    ],
  },
];

export default function MatchWizard({
  onComplete,
  onReset,
}: {
  onComplete: (filters: FilterKey[]) => void;
  onReset: () => void;
}) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<FilterKey[][]>([]);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  const choose = (filters: FilterKey[]) => {
    const next = [...picked, filters];
    setPicked(next);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setDone(true);
      onComplete(Array.from(new Set(next.flat())));
    }
  };

  const restart = () => {
    setStep(0);
    setPicked([]);
    setDone(false);
    onReset();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/58">
          Löydä korttisi
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
                done || i < step ? "bg-accent" : i === step ? "bg-accent/40" : "bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 min-h-[8.5rem]">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <p className="text-sm text-ink/58" aria-live="polite">
                Kysymys {step + 1}/{QUESTIONS.length}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-ink">
                {QUESTIONS[step].q}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => choose(opt.filters)}
                    className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink/82 transition-all duration-150 hover:border-accent hover:bg-accentSoft hover:text-accentDark active:scale-[0.97]"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex items-center gap-4">
                <Kettu pose="peukku" height={110} float={false} />
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    Valmista — järjestin kortit sinulle!
                  </h3>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink/68">
                    Paras osumasi on ensimmäisenä. Voit hienosäätää valintoja suodattimilla.
                  </p>
                </div>
              </div>
              <button
                onClick={restart}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink/58 transition-colors hover:text-ink"
              >
                <RotateCcw size={14} aria-hidden /> Aloita alusta
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
