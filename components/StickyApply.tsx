"use client";

import type { Card } from "@/lib/types";
import AffiliateButton from "./AffiliateButton";

/** Mobiilin kiinteä hakupalkki korttisivun alalaidassa (mockupin mukaan). */
export default function StickyApply({ card }: { card: Card }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-white/95 px-4 py-3 backdrop-blur md:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div>
        <p className="text-[11px] uppercase tracking-wide text-ink/58">Vuosimaksu</p>
        <p className="font-display text-lg font-bold text-ink">{card.annualFee}</p>
      </div>
      <AffiliateButton href={card.affiliateUrl} cardId={card.id} placement="sticky-mobile">
        Hae korttia
      </AffiliateButton>
    </div>
  );
}
