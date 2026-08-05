/**
 * Kettukilpailutus-alustan brändikonfiguraatio.
 * Jokainen tuleva palvelu (Sähkökettu, Lainakettu, Vakuutuskettu, Remonttikettu)
 * käyttää samaa design-järjestelmää ja maskottia — vain tämä tiedosto vaihtuu.
 */
export const BRAND = {
  platform: "Kettukilpailutus.fi",
  product: "Sähkösopimukset",
  domain: "https://www.kettukilpailutus.fi",
  tagline: "Ketuttaako maksaa liikaa?",
  promise: "Kettu kilpailuttaa sähkösopimuksesi puolestasi.",
  mascot: "Kettu",
} as const;
