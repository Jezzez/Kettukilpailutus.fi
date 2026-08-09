# Kettukilpailutus.fi

Suomalainen kilpailutusalusta. Kettu kilpailuttaa sopimukset puolestasi:
sähkösopimukset ja luottokortit puolueettomasti vertailtuna omilla luvuillasi.

Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion. Julkaistaan
Vercelissä automaattisesti jokaisesta `main`-haaran pushista.

## Käyttöönotto

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # tuotanto
```

## Rakenne

```
app/            Sivut (App Router)
components/     Jaetut komponentit + energy/ ja mascot/
data/           Sisältövarasto JSONeina
lib/            Tyypit, datakerros, hintalaskenta, klikkiseuranta
CLAUDE.md       Projektiohjeet ja työtavat
DESIGN.md       Design-järjestelmä — lue ennen ulkoasumuutoksia
```

Sivut:

```
/                            hub — kategoriavalitsin
/sahkosopimukset             sähkövertailu (päävertikaali)
  /sahkosopimukset/sopimus/[slug]   sopimussivut
  /sahkosopimukset/[topic]          SEO-laskeutumissivut
/luottokortit + /kortit/[slug]
/blogi + /blogi/[slug]
/tietoa, /tietosuoja, /kayttoehdot
```

## Sisällönhallinta

Kaikki sisältö on `data/`-kansion JSON-tiedostoissa, eikä sen muuttaminen
vaadi koodia:

| Tiedosto | Sisältö |
|---|---|
| `data/electricity.json` | sähkösopimukset, hinnat, affiliate-linkit |
| `data/cards.json` | luottokortit |
| `data/energy-topics.json` | SEO-laskeutumissivut |
| `data/posts.json` | blogiartikkelit |
| `data/faq.json` | usein kysytyt kysymykset |

Muokkaa tiedostoa, committaa ja pushaa — Vercel julkaisee muutoksen.

**Admin-paneeli `/admin` toimii vain paikallisessa devissä.** Se kirjoittaa
suoraan `data/`-kansioon, ja Vercelin serverless-ympäristössä
tiedostojärjestelmä on vain luku -tilassa. Paneeli on siksi estetty
tuotannossa (`ADMIN_ENABLED`-ympäristömuuttuja). Jos sisällönhallinta
halutaan joskus selaimeen tuotannossa, tallennus on vaihdettava
tietokantaan tai headless CMS:ään — rajapinta `app/api/admin/cards/route.ts`
on valmis laajennettavaksi.

## Sähkön hintalaskenta

`lib/energy.ts` laskee vuosikustannuksen kaavalla
`perusmaksu × 12 + energiahinta × kulutus / 100`. Pörssisopimuksilla
energiahinta on `assumedSpotAverage + spotMargin`; oletuskeskihinta ja sen
päivämäärä tulevat `data/electricity.json`-tiedostosta ja kerrotaan
käyttäjälle avoimesti. Asumismuotojen kulutusarviot (1 000 / 3 500 / 7 000 /
18 000 kWh/v) ovat vakiossa `DWELLINGS`. Ne ovat tarkoituksella haarukoiden
alalaidassa; perustelu ja julkaistut vertailuluvut on kirjoitettu auki
`DWELLINGS`in kommenttiin. Siellä on myös syy siihen, miksi näitä lukuja ei
saa käyttöliittymässä kutsua keskiarvoiksi.

## Affiliate

Linkit vaihdetaan yhdestä paikasta per vertikaali: `data/electricity.json` ja
`data/cards.json` → `affiliateUrl`. Jokainen klikkaus lähettää
`affiliate_click`-tapahtuman gtag/dataLayeriin sekä `/api/track`-päätepisteeseen
(`lib/track.ts`). Kaikissa affiliate-linkeissä `rel="nofollow sponsored
noopener"`, ja affiliate disclosure on footerissa.

## SEO

Schema.org JSON-LD (Organization, Product, FAQPage, Article, BreadcrumbList),
Open Graph + Twitter Cards, canonicalit, `sitemap.xml`, `robots.txt`,
dynaamiset title/description-tagit, murupolut, sisäinen linkitys, staattisesti
generoidut sivut ja `next/font`.

## Keskeneräistä

Sähkösopimusten ja korttien luvut ovat **esimerkinomaista placeholder-dataa**
ja affiliate-linkit ovat muotoa `https://example.com/aff/...`. Ennen
markkinointia on päivitettävä todelliset, ajantasaiset ehdot palveluntarjoajien
sivuilta — virheelliset hinta-, korko- ja kulutiedot ovat kuluttajansuojan ja
markkinointisäännösten kannalta riski.

## Monivertikaalialusta

Sähkö ja luottokortit ovat ensimmäiset vertikaalit. Lainat, vakuutukset ja
nettiliittymät näkyvät etusivulla "tulossa"-tilassa. Uusi vertikaali syntyy
samasta pohjasta: oma `data/`-tiedosto ja laskentakerros `lib/`-kansioon,
design-järjestelmä ja Kettu-maskotti pysyvät samana.
