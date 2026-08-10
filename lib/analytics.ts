export const GA_MEASUREMENT_ID = "G-0ML8LRVN1M";

export const GA_CONSENT_STORAGE_KEY = "kettu-google-analytics-consent";

export type GoogleAnalyticsConsent = "granted" | "denied";

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

/**
 * Lähettää nimettömän tapahtuman sivustolla jo käytössä olevaan GA4-tagiin.
 * Palvelinrenderöinnissä tai ennen gtagin latautumista funktio ei tee mitään.
 */
export function trackEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
): void {
  if (typeof window === "undefined") return;

  const gtag = (window as AnalyticsWindow).gtag;
  if (typeof gtag !== "function") return;

  gtag("event", eventName, params);
}

/**
 * Selaintapahtuma, jolla evästeikkuna avataan uudelleen.
 *
 * Alatunnisteen "Evästeasetukset" ja `CookieConsent` ovat eri puolilla
 * sivupuuta, joten ne eivät voi jakaa Reactin tilaa ilman contextia.
 * Yksi window-tapahtuma on tähän kevyempi kuin provider koko sivustolle.
 * Vakio on täällä eikä komponentissa, jottei alatunniste joudu tuomaan
 * koko suostumuskomponenttia mukanaan vain merkkijonon takia.
 */
export const COOKIE_SETTINGS_EVENT = "kettu:cookie-settings";
