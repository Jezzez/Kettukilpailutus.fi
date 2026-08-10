"use client";

import { trackEvent } from "@/lib/analytics";

export type AffiliateAnalytics = {
  category?: string;
  provider?: string;
  plan?: string;
};

/**
 * Affiliate-klikkausten seuranta.
 * Lähettää tapahtuman sekä GA4:ään (jos tagi on asennettu)
 * että omaan /api/track-päätepisteeseen palvelinpuolen lokitusta varten.
 */
export function trackAffiliateClick(
  cardId: string,
  placement: string,
  analytics: AffiliateAnalytics = {}
) {
  try {
    trackEvent("affiliate_click", {
      card_id: cardId,
      placement,
      ...analytics,
    });

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
