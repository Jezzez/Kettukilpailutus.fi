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
  /*
    `inverse` on oranssin laatikon päällä oleva vaalea nappi.

    Se oli aiemmin `rounded-full`, `text-sm` ja pienemmällä
    paddingilla kuin sivun muut napit — eli korttisivun VIIMEINEN
    ostonappi oli fyysisesti pienempi kuin sivun yläreunan nappi ja
    lisäksi ainoa pyöreä nappi koko sivustolla. Molemmat ovat suoraan
    pois tuotosta: viimeinen kehote on se, jonka kohdalla päätös
    tehdään, ja eri muotoinen nappi lukee eri palvelun napiksi.

    Nyt sama muoto, sama koko ja sama typografia kuin oranssilla
    vyöllä olevissa kermanapeissa muualla sivustolla.
  */
  const base =
    variant === "inverse"
      ? "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-display text-[15px] font-bold text-accentDark shadow-lift transition-all hover:bg-mist active:scale-[0.98]"
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
