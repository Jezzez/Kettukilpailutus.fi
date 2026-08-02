/**
 * Kettukilpailutus-alustan brändikonfiguraatio.
 * Jokainen tuleva palvelu (Sähkökettu, Lainakettu, Vakuutuskettu, Remonttikettu)
 * käyttää samaa design-järjestelmää ja maskottia — vain tämä tiedosto vaihtuu.
 */
export const BRAND = {
  platform: "Kettukilpailutus",
  product: "Luottokortit",
  domain: "https://www.kettukilpailutus.fi",
  tagline: "Kettutaako maksaa liikaa?",
  promise: "Kettu kilpailuttaa luottokortit puolestasi.",
  mascot: "Kettu",
} as const;
