"use client";

/**
 * Affiliate-klikkausten seuranta.
 * Lähettää tapahtuman sekä analytiikkaan (gtag/dataLayer, jos asennettu)
 * että omaan /api/track-päätepisteeseen palvelinpuolen lokitusta varten.
 */
export function trackAffiliateClick(cardId: string, placement: string) {
  try {
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: unknown[];
    };
    w.gtag?.("event", "affiliate_click", { card_id: cardId, placement });
    w.dataLayer?.push({ event: "affiliate_click", card_id: cardId, placement });

    const body = JSON.stringify({ cardId, placement, ts: Date.now() });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", body);
    } else {
      fetch("/api/track", { method: "POST", body, keepalive: true });
    }
  } catch {
    // Seurannan epäonnistuminen ei saa estää siirtymistä.
  }
}
