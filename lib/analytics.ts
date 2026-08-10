export const GA_MEASUREMENT_ID = "G-0ML8LRVN1M";

export const GA_CONSENT_STORAGE_KEY = "kettu-google-analytics-consent";

export type GoogleAnalyticsConsent = "granted" | "denied";

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
