"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Card } from "@/lib/types";

const TABS = ["Yleiskatsaus", "Edut", "Kokemuksia"] as const;

/** Korttisivun välilehdet — sovellusmainen navigointi mockupin mukaan. */
export default function CardPageTabs({ card }: { card: Card }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Yleiskatsaus");

  return (
    <div>
      <div className="flex gap-1 border-b border-line" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`relative px-4 py-3 font-display text-[14px] font-semibold transition-colors ${
              tab === t ? "text-ink" : "text-ink/60 hover:text-ink/80"
            }`}
          >
            {t}
            {tab === t && (
              <motion.span
                layoutId="cardtab"
                className="absolute inset-x-2 -bottom-px h-[2.5px] rounded-full bg-accent"
              />
            )}
          </button>
        ))}
      </div>

      <div className="pt-6" role="tabpanel">
        {tab === "Yleiskatsaus" && (
          <div className="space-y-6">
            <ul className="space-y-2.5">
              {card.pros.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[15px] text-ink/85">
                  <Check size={16} strokeWidth={3} className="mt-1 shrink-0 text-ink/35" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Kenelle kortti sopii?</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/80">{card.bestFor}</p>
            </div>
          </div>
        )}

        {tab === "Edut" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <ul className="space-y-2.5 rounded-2xl bg-mist p-5">
              <p className="font-display text-sm font-semibold text-ink">Hyödyt</p>
              {card.pros.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14px] text-ink/85">
                  <Check size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-ink/35" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5 rounded-2xl bg-mist p-5">
              <p className="font-display text-sm font-semibold text-ink">Haitat</p>
              {card.cons.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-[14px] text-ink/85">
                  <X size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-ink/50" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "Kokemuksia" && (
          <div className="space-y-4">
            <p className="text-[15px] leading-relaxed text-ink/80">
              Kortti on saanut käyttäjiltä arvosanan{" "}
              <span className="font-data font-semibold text-ink">{card.rating.toFixed(1)}/5</span>{" "}
              yhteensä {card.reviews} arvion perusteella.
            </p>
            <blockquote className="rounded-2xl bg-mist p-5 text-[15px] leading-relaxed text-ink/85">
              ”{card.summary}”
            </blockquote>
          </div>
        )}
      </div>
    </div>
  );
}
