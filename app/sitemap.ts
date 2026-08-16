import type { MetadataRoute } from "next";
import { getCards, getPosts, SITE } from "@/lib/data";
import { FEATURES } from "@/lib/features";
import { getPlans, getEnergyTopics } from "@/lib/energy";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    /* Etusivu on hub: se esittelee palvelut eikä sisällä yhtään hintaa,
       joten se muuttuu vasta kun vertikaali avataan tai suljetaan.
       `monthly` on siksi rehellinen arvio; `daily` pyytäisi Googlea
       käymään joka päivä sivulla, joka on sama joka päivä, ja turhat
       käynnit ovat pois muualta. Prioriteetti on silti 1: tämä on
       brändihaun laskeutumissivu. */
    { url: SITE.url, lastModified: now, changeFrequency: "monthly", priority: 1 },

    /* Sähkövertailu palasi omaan osoitteeseensa 17.8.2026, eli rivi
       palasi myös tänne. Se on jälleen indeksoitava sivu (200, ei
       ohjaus), ja `daily` on tässä oikea: hinnat muuttuvat.
       Prioriteetti on sama 1 kuin etusivulla, koska tämä on se sivu,
       jolla ansainta tapahtuu. */
    {
      url: `${SITE.url}/sahkosopimukset`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...(FEATURES.loans
      ? [
          {
            url: `${SITE.url}/lainat`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ]
      : []),
    { url: `${SITE.url}/blogi`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/tietoa`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/tietosuoja`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/kayttoehdot`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...getEnergyTopics().map((t) => ({
      url: `${SITE.url}/sahkosopimukset/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...getPlans().map((p) => ({
      url: `${SITE.url}/sahkosopimukset/sopimus/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    /* Piilotettua osiota ei ilmoiteta hakukoneelle. Sivukartta, joka
       listaa 404:ää palauttavia osoitteita, laskee koko sivuston
       indeksoinnin luotettavuutta — ja sähkösivut ovat samassa
       tiedostossa. */
    ...(FEATURES.cards
      ? [
          {
            url: `${SITE.url}/luottokortit`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.9,
          },
          ...getCards().map((c) => ({
            url: `${SITE.url}/kortit/${c.slug}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          })),
        ]
      : []),
    ...getPosts().map((p) => ({
      url: `${SITE.url}/blogi/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
