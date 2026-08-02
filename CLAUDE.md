# Kettukilpailutus — projektiohjeet

Tämä tiedosto latautuu automaattisesti jokaisessa sessiossa. Se on ainoa
totuuden lähde työtavoista; `DESIGN.md` on totuuden lähde ilmeestä.

## Omistaja ja kieli

Jesse, suomalainen yrittäjä. **Vastaa aina suomeksi.** Kerro *miksi* ehdotat
jotain, älä vain mitä. Sano suoraan jos idea on huono. Yksi asia kerrallaan —
Jesse ideoi mielellään moneen suuntaan yhtä aikaa, joten ohjaa takaisin
fokukseen.

## Mikä tämä on

Kettukilpailutus on suomalainen kilpailutusalusta, jonka tavoite on kasvaa
Suomen vahvimmaksi vertailubrändiksi. Brändin ydin on **Kettu-maskotti**:
3D-renderöity, karismaattinen, älykäs, premium — ei koskaan lapsellinen.

Slogan: **"Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi!"**

## Julkaisuketju — lue ennen kuin kosket gitiin

Kansio `~/Downloads/korttivertailu` **on git-repo**, kytketty osoitteeseen
`github.com/Jezzez/Kettukilpailutus.fi` (haara `main`). **Vercel julkaisee
automaattisesti jokaisen pushin jälkeen** — push tarkoittaa suoraan tuotantoa.

**Älä koskaan poista kansiota tai lataa sitä uudelleen.** Se katkaisisi
git-yhteyden. Muokkaa aina suoraan tätä kansiota.

```
git add -A
git commit -m "kuvaus"
git push
```

**Ennen pushia: näytä Jesselle mitä muutit ja odota hyväksyntää.** Isommissa
muutoksissa aja `npm run dev`, jotta hän tarkistaa tuloksen osoitteessa
localhost:3000 ennen julkaisua.

## Tekninen pino

Next.js 14 (App Router), TypeScript, Tailwind 3.4, Framer Motion,
lucide-react. Ei tietokantaa — kaikki sisältö on `data/`-kansion
JSON-tiedostoissa, joten sivut generoituvat staattisesti.

## Sivukartta

```
/                            hub — kategoriavalitsin
/sahkosopimukset             sähkövertailu (päävertikaali)
  /sahkosopimukset/sopimus/[slug]   6 sopimussivua
  /sahkosopimukset/[topic]          4 SEO-laskeutumissivua
/luottokortit                korttivertailu
/kortit/[slug]               8 korttisivua
/blogi, /blogi/[slug]        13 artikkelia
/tietoa, /tietosuoja, /kayttoehdot
/admin                       sisällönhallinta (ks. varoitus alla)
tulossa: /lainat /vakuutukset /internet
```

## Keskeiset tiedostot

| Tiedosto | Sisältö |
|---|---|
| `data/electricity.json` | sähkösopimukset, hinnat, affiliate-linkit |
| `data/cards.json` | luottokortit |
| `data/energy-topics.json` | SEO-laskeutumissivut |
| `data/posts.json` | blogiartikkelit |
| `lib/energy.ts` | hintalaskenta |
| `lib/data.ts` | korttien ja sisällön lukukerros, `SITE`-vakio |
| `components/energy/ElectricityExperience.tsx` | vertailun ydin |
| `components/energy/PlanCard.tsx` | sopimuskortti |
| `tailwind.config.ts` | värit ja design-tokenit |

## Design — älä riko tätä

Sivusto on **kokonaan tumma**. Syvyys tehdään valoarvoilla, ei väreillä.
Vain kaksi väriä: **kettuoranssi `#E8691B` ja kulta `#D9A24F`**. Kaikki muu on
lämpimän harmaan sävyjä. Uusien värien lisääminen tekee ilmeestä halvan.

**Huom:** Tailwindin `white` on tarkoituksella ylikirjoitettu tummaksi
(`#1A1512`). `bg-white` tarkoittaa tässä projektissa kortin tummaa pintaa —
älä "korjaa" sitä.

Täydet tokenit, apuluokat ja perustelut: `DESIGN.md`.

## Sähkösivun CRO-logiikka — älä poista näitä

1. **Laskuri on heron sisällä** — työkalu ennen myyntipuhetta
2. **Asumismuoto → kWh** → jokainen hinta on henkilökohtainen euromäärä, ei c/kWh
3. **Vapaaehtoinen "nykyinen hintani"** → säästö lasketaan omaan sopimukseen,
   ei listan kalleimpaan
4. **Rehellinen "älä vaihda" -tila** — jos asiakkaan nykyinen sopimus on jo
   halvempi, se sanotaan suoraan. **Sivun tärkein luottamussignaali.**
5. **Pörssi vai kiinteä -suosittelija** — kaksi kysymystä, suositus + suodatus
6. **"Ketun valinta" -merkki** — hinta 72 % + käyttäjäarvio 28 %, kaava avoin
7. **Hintapalkit korteissa** — silmä vertaa palkkeja nopeammin kuin lukuja
8. **Läpinäkyvyysosio** — laskukaava ja ansaintamalli auki
9. **"Ota nämä esiin" -tarkistuslista** — käyttöpaikkatunnus, osoite, pankkitunnukset

## Keskeneräiset asiat

**Affiliate-linkit ovat paikkamerkkejä** muotoa `https://example.com/aff/...`
sekä `data/electricity.json`- että `data/cards.json`-tiedostoissa. Jesse on
liittynyt **Adtractioniin** (kanavatyyppi: content marketing, fokus:
comparison). Kun oikeat linkit tulevat, ne vaihdetaan näihin kahteen
tiedostoon. Tämä on ainoa asia, joka erottaa sivun testiversiosta
julkaisukelpoisesta.

**Sähkö- ja korttidata on keksittyä esimerkkidataa.** Korko-, kulu- ja
hintatiedot on päivitettävä todellisiksi ennen kuin sivustoa markkinoidaan —
virheelliset luvut ovat kuluttajansuojariski.

**Admin-paneeli `/admin` ei tallenna Vercelissä.** Serverless-ympäristön
tiedostojärjestelmä on vain luku -tilassa, joten muokkaukset katoavat.
Toimii vain paikallisessa devissä. Sisältöä muokataan tuotannossa
editoimalla `data/`-JSONeja ja pushaamalla.
