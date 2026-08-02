# Kettukilpailutus — Luottokorttien vertailualusta

Tuotantovalmis Next.js-projekti: Kettukilpailutus-alustan ensimmäinen tuote. Premium-brändi, oma design system (ks. `DESIGN.md`),
suodatettava korttivertailu Sopivuus-mittarilla, vertailutaulukko, SEO-optimoidut
korttisivut, blogi, UKK (schema.org), affiliate-seuranta ja admin-paneeli.

## Käyttöönotto

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # tuotanto
```

## Rakenne

```
app/            Sivut (App Router): etusivu, /kortit/[slug], /blogi, /admin
components/     Design systemin komponentit
data/           Sisältövarasto: cards.json, posts.json, faq.json
lib/            Tyypit, datakerros, suodatuslogiikka, klikkiseuranta
DESIGN.md       Brändi- ja design system -dokumentaatio
```

## Sisällönhallinta

Kaikki sisältö on JSON-tiedostoissa (`data/`). Kortin lisääminen ei vaadi koodia:

1. **Admin-paneeli:** avaa `/admin`, token `kettu-admin` (vaihda `ADMIN_TOKEN`-
   ympäristömuuttujalla). Lisää/poista/muokkaa kortteja, vaihda affiliate-linkit,
   järjestä, lisää blogeja → Tallenna.
2. **Tai suoraan:** muokkaa `data/cards.json`.

Huom: admin kirjoittaa tiedostojärjestelmään → toimii devissä ja omalla
Node-palvelimella. Vercelin kaltaisella serverless-alustalla vaihda tallennus
tietokantaan (rajapinta `app/api/admin/cards/route.ts` on valmis laajennettavaksi).

## Affiliate

- Linkit vaihdetaan yhdestä paikasta: `data/cards.json` → `affiliateUrl`.
- Jokainen klikkaus lähettää `affiliate_click`-tapahtuman gtag/dataLayeriin
  (jos GA/GTM asennettu) sekä `/api/track`-päätepisteeseen (`lib/track.ts`).
- Kaikissa affiliate-linkeissä `rel="nofollow sponsored noopener"`.
- Affiliate disclosure on footerissa.

## SEO

Schema.org (Organization, Product, FAQPage, Article, BreadcrumbList JSON-LD),
Open Graph + Twitter Cards, canonicalit, `sitemap.xml`, `robots.txt`, dynaamiset
title/description-tagit, semanttinen HTML, murupolut, sisäinen linkitys,
staattisesti generoidut sivut (SSG) ja next/font → erinomaiset Core Web Vitals.

## Huomio sisällöstä

Korttien luvut ovat esimerkinomaisia placeholder-tietoja. Ennen julkaisua
päivitä todelliset, ajantasaiset ehdot pankkien sivuilta — kuluttajansuojan
ja markkinointisäännösten vuoksi virheelliset korko-/kulutiedot ovat riski.

## Monibrändialusta

Tämä projekti on Kettukilpailutus-alustan ensimmäinen tuote (Luottokortit).
Uusi palvelu (Sähkökettu, Lainakettu, Vakuutuskettu, Remonttikettu...) syntyy
samasta pohjasta:

1. Kopioi projekti ja päivitä `lib/brand.ts` (tuotteen nimi, domain, tagline).
2. Vaihda `data/`-sisältö uuden vertikaalin dataan (sama tietomallirakenne).
3. Design-järjestelmä (`tailwind.config.ts`, komponentit, Kettu-maskotti
   `components/mascot/`) pysyy samana — brändi näyttää ja tuntuu yhteneväiseltä
   jokaisessa palvelussa.
