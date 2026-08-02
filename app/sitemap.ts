import type { MetadataRoute } from "next";
import { getCards, getPosts, SITE } from "@/lib/data";
import { getPlans, getEnergyTopics } from "@/lib/energy";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/sahkosopimukset`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/luottokortit`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
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
    ...getCards().map((c) => ({
      url: `${SITE.url}/kortit/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getPosts().map((p) => ({
      url: `${SITE.url}/blogi/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
