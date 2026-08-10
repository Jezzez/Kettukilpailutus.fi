# Kettukilpailutus — projektiohjeet

Tämä tiedosto latautuu automaattisesti jokaisessa sessiossa. Se on ainoa
totuuden lähde työtavoista; `DESIGN.md` on totuuden lähde ilmeestä.

## Omistaja ja kieli

Jesse, suomalainen yrittäjä. **Vastaa aina suomeksi.** Kerro *miksi* ehdotat
jotain, älä vain mitä. Sano suoraan jos idea on huono. Yksi asia kerrallaan —
Jesse ideoi mielellään moneen suuntaan yhtä aikaa, joten ohjaa takaisin
fokukseen.

## Ratkaisujen mittari: tuotto

**Perustele jokainen muutos sillä, miten se vaikuttaa tuottoon.** Sivusto
ansaitsee affiliate-palkkiona vasta kun käyttäjä painaa "Tee sopimus" ja tekee
sopimuksen. Kaikki ilme- ja UX-valinnat arvioidaan siltä kannalta: vieko tämä
useamman kävijän tuohon nappiin asti.

Se ei tarkoita painostavaa myyntiä. Kilpailutuspalvelun tuotto syntyy siitä,
että käyttäjä *luottaa* lukuihin — epäluotettava sivu menettää klikin kokonaan
ja lisäksi paluukäynnit. Rehellisyys on tässä bisnesmalli, ei vain periaate.
Siksi keksittyjä lukuja tai väitteitä ei palauteta sivustolle koskaan.

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

Tyyppitarkistus on `./node_modules/.bin/tsc --noEmit`. ESLint-konfiguraatiota
ei ole, joten `next lint` ei kerro mitään — tsc on ainoa automaattinen
tarkistus, ja se kannattaa ajaa aina ennen pushia. **Älä aja `next build`:iä
Jessen dev-palvelimen rinnalla:** ne jakavat `.next`-hakemiston ja build
kaataa käynnissä olevan devin.

## Tekninen pino

Next.js 14 (App Router), TypeScript, Tailwind 3.4, Framer Motion,
lucide-react. Ei tietokantaa — kaikki sisältö on `data/`-kansion
JSON-tiedostoissa, joten sivut generoituvat staattisesti.

## Sivukartta

```
/                            hub — kategoriavalitsin
/sahkosopimukset             sähkövertailu (päävertikaali)
  /sahkosopimukset/sopimus/[slug]   26 sopimussivua (yksi per näkyvä sopimus)
  /sahkosopimukset/[topic]          4 SEO-laskeutumissivua
/lainat                      ohjaus Sortterille (ei omaa vertailua)
/luottokortit                korttivertailu — PIILOSSA, ks. lib/features.ts
/kortit/[slug]               8 korttisivua — PIILOSSA
/blogi, /blogi/[slug]        13 artikkelia
/tietoa, /tietosuoja, /kayttoehdot
/admin                       sisällönhallinta (ks. varoitus alla)
tulossa: /vakuutukset /internet
```

Vertikaalien näkyvyys on `lib/features.ts`-kytkimien takana: `cards: false`,
`loans: true`. Kytkin ohjaa navigaatiota, footeria, etusivua ja sivukarttaa
yhdestä paikasta — älä piilota osioita muualta käsin.

## Keskeiset tiedostot

| Tiedosto | Sisältö |
|---|---|
| `data/electricity.json` | sähkösopimukset, hinnat, affiliate-linkit |
| `data/cards.json` | luottokortit |
| `data/energy-topics.json` | SEO-laskeutumissivut |
| `data/posts.json` | blogiartikkelit |
| `lib/energy.ts` | hintalaskenta |
| `lib/data.ts` | korttien ja sisällön lukukerros, `SITE`-vakio |
| `lib/features.ts` | vertikaalien näkyvyyskytkimet |
| `lib/track.ts`, `lib/analytics.ts` | klikkiseuranta ja GA4-tunnus |
| `components/energy/ElectricityExperience.tsx` | vertailun ydin |
| `components/energy/PlanCard.tsx` | sopimuskortti |
| `components/CookieConsent.tsx` | evästesuostumus + Consent Mode |
| `tailwind.config.ts` | värit ja design-tokenit |

## Design — älä riko tätä

Sivusto on **lämpimän vaalea, ja rytmin tekevät täysleveät oranssit vyöt**
(hero, loppukehotus, 404). Ainoa tumma pinta on alatunniste. Syvyys tehdään
valoarvoilla, ei väreillä. Vain kaksi väriä: **kettuoranssi `#E8691B` ja
kulta `#D9A24F`**. Kaikki muu on lämpimän hiekan sävyjä. Uusien värien
lisääminen tekee ilmeestä halvan.

**Huom 1:** Tailwindin `white` osoittaa CSS-muuttujaan, ei kiinteään
valkoiseen. `bg-white` piirtyy vaaleana, tummana tai oranssina sen mukaan,
minkä teemaluokan sisällä se on — älä "korjaa" sitä kiinteäksi.

**Huom 2 — ember-ansa:** `.theme-ember`-vyöllä `bg-white` on **oranssi** ja
`text-accentDark` on **vaalea kerma**. Kumpikin siis kääntyy päinvastoin.
Kun pudotat vaalealle suunnitellun komponentin oranssille vyölle, tarkista
aina nämä kaksi. Kermanapin teksti on kiinteä `text-[#A83E0A]`, ja vaalea
kortti oranssin päällä kääritään `theme-light`-luokkaan.

**Huom 3:** korttien hover-nosto tulee yhteisestä `.lift`-luokasta. Älä
kirjoita komponenttikohtaisia `transition-all duration-300` -sääntöjä — eri
nopeuksilla liikkuva sivu tuntuu tehdyltä eri käsillä.

Täydet tokenit, apuluokat ja perustelut: `DESIGN.md`.

## Sähkösivun CRO-logiikka — älä poista näitä

1. **Laskuri on heron sisällä** — työkalu ennen myyntipuhetta
2. **Asumismuoto → kWh** → jokainen hinta on henkilökohtainen euromäärä, ei c/kWh
3. **Vapaaehtoinen "nykyinen hintani"** → säästö lasketaan omaan sopimukseen,
   ei listan kalleimpaan
4. **Rehellinen "älä vaihda" -tila** — jos asiakkaan nykyinen sopimus on jo
   halvempi, se sanotaan suoraan. **Sivun tärkein luottamussignaali.**
5. **Pörssi vai kiinteä -suosittelija** — kaksi kysymystä, suositus + suodatus
6. **"Ketun valinta" -merkki** — pelkkä hinta, ei arvioita. Kaksi sääntöä:
   ehdokkaaksi pääsee vain sopimus, joka voittaa kävijän nykyisen hinnan jo
   kampanjahinnalla, ja ehdokkaista valitaan paras **ensimmäinen vuosi**
   (kampanja mukaan luettuna). Arviotähtiä ei käytetä, koska yhdelläkään
   sopimuksella ei ole riippumatonta arviolähdettä — `rating` on `null`
   kaikilla, eikä keksittyä tähtilukua julkaista.
7. **Hintapalkit korteissa** — silmä vertaa palkkeja nopeammin kuin lukuja
8. **Läpinäkyvyysosio** — laskukaava ja ansaintamalli auki
9. **Ei tarvikelistaa ennen nappia** — "ota nämä esiin" -tarkistuslista
   poistettiin askelosiosta: se muutti viiden minuutin asian kotitehtäväksi
   juuri ennen kilpailutusnappia. Sama tieto on heron "Vie noin 5 minuuttia"
   -kohdan takana, jonka lukija avaa halutessaan.

## Datan tila — mikä on oikeaa ja mikä ei

**Sähködata on oikeaa.** `data/electricity.json` sisältää 47 riviä, joista
**26 on näkyvissä**. Jokaisella näkyvällä on tarkistettu hinta, `checkedAt`
(elokuu 2026) ja `sourceUrl` yhtiön omalle sivulle. Loput ovat piilossa
kahdesta eri syystä, ja **syyt on pidettävä erillään**:

| Kenttä | Merkitys | Mitä siitä seuraa |
|---|---|---|
| `example: true` | hinta on yhä keksitty | 19 riviä, ei saa näyttää ennen tarkistusta |
| `hidden: true` | hinta on oikea, mutta rivi ei tuota | 2 riviä (Vaasan Sähkö) |

Älä käytä `example`-lippua piilottamiseen. Se tarkoittaa nimenomaan
"lukua ei ole tarkistettu", ja väärä lippu johtaa siihen, että tarkistettu
hinta tarkistetaan turhaan uudelleen — tai pahempaa, tarkistamaton
julkaistaan.

`IS_EXAMPLE_DATA` (lib/energy.ts) laukaisee sivun esimerkkidatavaroituksen.
Se katsoo puuttuvaa `checkedAt`-kenttää näkyvillä riveillä, koska se on ainoa
ehto, joka voi oikeasti laueta.

**Affiliate-linkit ovat oikeita** `data/electricity.json`-tiedostossa: 20
sopimusta menee Adtractionin kautta (`go.adtNNN.net` / `ion.fortum.com`),
Jessen affiliate-tunnus on `as=2098832052`. Kuudella näkyvällä sopimuksella
ei ole kumppanuutta (`partner: false`) — niiden nappi lukee "Siirry
palveluntarjoajalle" eikä "Tee sopimus", ja niistä ei tule palkkiota. Se on
tarkoituksellista: vertailu, jossa näkyy vain maksavat yhtiöt, on mainos.

**Korttidata `data/cards.json` on yhä keksittyä ja sen linkit ovat
`example.com/aff/...` -paikkamerkkejä.** Siksi koko korttiosio on piilossa
(`FEATURES.cards = false`).

## Analytiikka ja mainonta

GA4 on asennettu (`lib/analytics.ts`, mittaustunnus `G-0ML8LRVN1M`).
Suostumus kysytään `components/CookieConsent.tsx`:ssä ja se ohjaa Google
Consent Mode -asetuksia; mainosevästeet ovat aina `denied`. Affiliate-klikki
lähettää GA4:ään tapahtuman `affiliate_click` (`card_id`, `placement`) —
ks. `lib/track.ts`.

`/api/track` vain lokittaa konsoliin. Se ei ole varsinainen mittari eikä
siihen saa nojata.

Evästeikkuna kysytään **kerran**. Vastauksen jälkeen se katoaa kokonaan eikä
sivulle jää kelluvaa nappia. Suostumuksen voi silti perua alatunnisteen
**Evästeasetukset**-linkistä, joka lähettää `COOKIE_SETTINGS_EVENT`-tapahtuman
(`lib/analytics.ts`). **Sitä linkkiä ei saa poistaa** ilman korvaavaa tapaa
avata ikkuna — peruuttamisen on oltava yhtä helppoa kuin antamisen
(GDPR 7 art. 3).

## Keskeneräiset asiat

**Admin-paneeli `/admin` ei tallenna Vercelissä.** Serverless-ympäristön
tiedostojärjestelmä on vain luku -tilassa, joten muokkaukset katoavat.
Toimii vain paikallisessa devissä. Sisältöä muokataan tuotannossa
editoimalla `data/`-JSONeja ja pushaamalla.

**Kuudessa Adtraction-linkissä ei ole syvälinkkiä** (`&url=`-parametria):
Fortum Tarkka, Oomi ×2, Vattenfall ×2, Nordic Green. Kävijä laskeutuu yhtiön
omalle kampanjasivulle. Oomin kaksi sopimusta käyttävät lisäksi täsmälleen
samaa osoitetta. Deep-linkin saa Adtractionin omasta työkalusta — älä keksi
osoitetta itse, koska ohjelma voi hylätä sallimattoman kohteen ja silloin
klikki menettää seurannan.

**`components/energy/EnergyTrust.tsx` on kuollutta koodia** — sitä ei tuoda
mistään. Poista, kun joku ehtii varmistaa ettei sieltä tarvita mitään.
