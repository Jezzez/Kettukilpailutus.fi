"use client";

import { trackAffiliateClick } from "@/lib/track";

/**
 * Kaikki "Siirry hakemaan" -painikkeet kulkevat tämän komponentin kautta:
 * affiliate-URL vaihdetaan yhdestä paikasta (data/cards.json) ja jokainen
 * klikkaus kirjautuu analytiikkaan.
 */
export default function AffiliateButton({
  href,
  cardId,
  placement,
  variant = "primary",
  children = "Katso kortti",
  className = "",
}: {
  href: string;
  cardId: string;
  placement: string;
  variant?: "primary" | "small" | "inverse";
  children?: React.ReactNode;
  className?: string;
}) {
  const base =
    variant === "inverse"
      ? "inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-accentDark shadow-sm transition-all hover:bg-mist active:scale-[0.98]"
      : variant === "primary"
      ? "btn-ember inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-display text-[15px] font-bold text-onEmber transition-all active:scale-[0.98]"
      : "btn-ember inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-xs font-bold text-onEmber transition-colors";

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={`${base} ${className}`}
      onClick={() => trackAffiliateClick(cardId, placement)}
    >
      {children}
    </a>
  );
}
