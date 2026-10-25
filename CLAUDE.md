# Kettukilpailutus — projektiohjeet

Tämä tiedosto latautuu automaattisesti jokaisessa sessiossa. Se on ainoa
totuuden lähde työtavoista; `DESIGN.md` on totuuden lähde ilmeestä.
Jos jesse sanoo että tee muutos joka olisi väärin, mainitse siitä että se on väärin ja perustele miksi mutta tee se jos niin käsketään sen jälkeen.
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
/                            hub: esittelee sähkön ja lainat, ei vertailua
/sahkosopimukset             sähkövertailu (päävertikaali) — TÄSSÄ ansaitaan
  /sahkosopimukset/sopimus/[slug]   24 sopimussivua (yksi per näkyvä sopimus)
  /sahkosopimukset/[topic]          4 SEO-laskeutumissivua
/lainat                      ohjaus Sortterille (ei omaa vertailua)
/luottokortit                korttivertailu — PIILOSSA, ks. lib/features.ts
/kortit/[slug]               8 korttisivua — PIILOSSA
/blogi, /blogi/[slug]        14 artikkelia (kaikki sähköaiheisia)
/tietoa, /tietosuoja, /kayttoehdot
/admin                       sisällönhallinta (ks. varoitus alla)
tulossa: /vakuutukset /internet
```

Vertikaalien näkyvyys on `lib/features.ts`-kytkimien takana: `cards: false`,
`loans: true`. Kytkin ohjaa navigaatiota, footeria, etusivua ja sivukarttaa
yhdestä paikasta — älä piilota osioita muualta käsin.

Sähkösivun osoite on `lib/nav.ts`-vakioissa (`ENERGY_PATH`,
`ENERGY_COMPARE`) ja "ollaanko sähkösivulla" on `isEnergyPath()`. Älä
kirjoita polkua käsin komponentteihin. Osoite on ehtinyt vaihtua kahdesti
(`/sahkosopimukset` → `/` → `/sahkosopimukset`), ja joka kerta käsin
kirjoitetuista poluista osa on jäänyt osoittamaan vanhaan paikkaan.

**Etusivu ei ole sähkösivu.** Juuressa on hub, joka esittelee sähkön ja
lainat. `isEnergyPath("/")` palauttaa siksi epätoden: muuten navigaation
aktiivimerkki näyttäisi "Sähkö" valittuna hubilla ja footer tarjoaisi
siellä sähkölinkkejä muiden palveluiden sijaan. **Älä siirrä vertailua
takaisin juureen** — kolmas osoitteenvaihto maksaisi enemmän kuin kaksi
ensimmäistä yhteensä.

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

0. **Sopimuksia ei näytetä ennen kuin kysely on täytetty.**
   `/sahkosopimukset`-sivun tuloslista on portin takana
   (`gated = withHero`), ja se on Jessen
   nimenomainen päätös 16.8.2026, ei optimoitava muuttuja. Prop
   `resultsVisibleFromStart`, joka päästi listan HTML:ään heti, luotiin ja
   poistettiin samana päivänä. Älä ehdota sitä uudelleen, älä ehdota
   "kolme halvinta heti" -osittaista porttia äläkä sumennettua listaa.

   **Tiedostettu hinta:** portin takana oleva sisältö ei ole sivun
   HTML:ssä, joten Googlebot ei näe sieltä yhtään sopimusta. Siksi
   aihesivut `/sahkosopimukset/[topic]` ajavat saman komponentin
   `withHero={false}`, jolloin vertailu on niillä ilman porttia. **Niille
   ei saa lisätä porttia:** ne ja 24 sopimussivua ovat ainoa paikka, jossa
   hakukone näkee sopimusdatan.

   Cloaking — sisällön renderöinti robotille ja piilottaminen kävijältä —
   ei ole vaihtoehto missään muodossa.

1. **Laskuri on heron sisällä** — työkalu ennen myyntipuhetta
2. **Asumismuoto → kWh** → jokainen hinta on henkilökohtainen euromäärä, ei c/kWh
3. **Vapaaehtoinen "nykyinen hintani"** → säästö lasketaan omaan sopimukseen,
   ei listan kalleimpaan
4. **Rehellinen "älä vaihda" -tila** — jos asiakkaan nykyinen sopimus on jo
   halvempi, se sanotaan suoraan. **Sivun tärkein luottamussignaali.**
5. **Pörssi vai kiinteä -suosittelija** — kaksi kysymystä, suositus + suodatus
6. **"Ketun valinta" -merkki** — pelkkä hinta, ei arvioita. Kaksi sääntöä:
   ehdokkaaksi pääsee vain sopimus, joka voittaa kävijän nykyisen hinnan jo
   kampanjahinnalla, ja ehdokkaista valitaan halvin listan
   järjestysperusteella (`rankCost`, lib/energy.ts). **Jessen päätös
   25.10.2026:** pörssisopimukset (ja toistaiseksi voimassa olevat)
   järjestetään tämän hetken hinnan mukaan kampanjoineen, kiinteät 24 kk:n
   kokonaishinnan mukaan. Molemmat ovat €/kk, joten sekalista toimii.
   Tiedostettu hinta: pörssin kärkeen nousee lyhyin kampanja, vaikka se
   olisi kampanjan jälkeen kallis (Aalto Luotsi, Sähkötytöt Pörssi).
   Kortin "sitten X €/kk" -rivi on siksi pakollinen.
   **Kulutusraja:** `kwhLimit` piilottaa sopimuksen, jota ei myydä kävijän
   kulutukselle (VAE:n kiinteät alle 7 000, Aalto Ankkuri ja Sähkötytöt
   Kiinteä alle 10 000 kWh). Tarkista raja hintatarkistuksen yhteydessä. Arviotähtiä ei käytetä, koska yhdelläkään
   sopimuksella ei ole riippumatonta arviolähdettä — `rating` on `null`
   kaikilla, eikä keksittyä tähtilukua julkaista.
7. **Hintapalkit korteissa** — silmä vertaa palkkeja nopeammin kuin lukuja
8. **Läpinäkyvyysosio** — laskukaava ja ansaintamalli auki
9. **Ei tarvikelistaa ennen nappia** — "ota nämä esiin" -tarkistuslista
   poistettiin askelosiosta: se muutti viiden minuutin asian kotitehtäväksi
   juuri ennen kilpailutusnappia. Sama tieto on heron "Vie noin 5 minuuttia"
   -kohdan takana, jonka lukija avaa halutessaan.

## Blogiohjeistus — koskee jokaista `data/posts.json`-artikkelia

Jessen pysyvä ohje, joka koskee sekä olemassa olevien tekstien parantamista
että kaikkia uusia artikkeleita. Tavoite: teksti on niin hyödyllinen ja
omaperäinen, että se ansaitsisi hyvän Google-sijoituksen ilman että se
tuntuu SEO:ta varten kirjoitetulta.

**Sisältö**

- Vastaa hakuintenttiin mahdollisimman suoraan. H1/H2/H3-rakenne
  rakennetaan intentin, ei avainsanojen mukaan.
- Säilytä hyvä olemassa oleva sisältö, kirjoita vain heikot kohdat uusiksi.
  Vanhaa tekstiä ei heitetä pois vain siksi, että sitä ei itse kirjoittanut.
- Konkreettisia esimerkkejä ja **Kettukilpailutuksen omaa vertailudataa**
  (`data/electricity.json`) aina kun sitä on saatavilla. Oma laskettu
  euromäärä on se, mitä kilpailijoiden oppaissa ei ole.
- Tarkista jokainen hinta, laki, tilasto ja faktaväite ajantasaisesta
  luotettavasta lähteestä ja merkitse lähde näkyviin.
- **Älä keksi dataa tai lähteitä.** Sama sääntö kuin sopimushinnoissa:
  tämän sivuston koko ansaintamalli on se, että lukuihin luotetaan.
- Sisäiset linkit vain sinne, missä ne aidosti auttavat: vertailuun,
  laskuriin tai toiseen oppaaseen. CTA vain kohtaan, jossa lukija oikeasti
  on valmis toimimaan, ei jokaisen väliotsikon perään.

**Kieli**

- Luonnollista, asiantuntevaa suomea. Ei geneeristä AI- tai SEO-tekstiä.
- **Ei ajatusviivoja (`—`, `–`, `--`) tekstin sisällä.** Ne huutavat
  konekirjoitusta. Käytä pistettä, pilkkua tai kaksoispistettä.
  (Koodikommenteissa ja tässä tiedostossa ne ovat sallittuja, kielto koskee
  julkaistavaa artikkelitekstiä.)
- Ei toistoa, täytelauseita, kliseitä eikä perusteettomia väitteitä.
- Älä pidennä tekstiä turhaan. Pituus tulee asiasta, ei tavoitteesta.

**Muoto**

- URL-osoitteita (`slug`) ei muuteta ilman hyvää syytä: vanha osoite on jo
  Googlen indeksissä ja vaihto nollaa sen.
- `body` on taulukko kappaleita. Väliotsikko on kappale, joka alkaa `## `
  tai `### `. Linkit ovat markdown-muodossa.

## Datan tila — mikä on oikeaa ja mikä ei

**Sähködata on oikeaa.** `data/electricity.json` sisältää 49 riviä, joista
**25 on näkyvissä**. Jokaisella näkyvällä on tarkistettu hinta, `checkedAt`
ja `sourceUrl` yhtiön omalle sivulle. Loput ovat piilossa kahdesta eri
syystä, ja **syyt on pidettävä erillään**:

| Kenttä | Merkitys | Mitä siitä seuraa |
|---|---|---|
| `example: true` | hinta on yhä keksitty | 19 riviä, ei saa näyttää ennen tarkistusta |
| `hidden: true` | hinta on oikea, mutta rivi ei tuota | 5 riviä: Aalto Huoleton, Helen Pörssisähkö, Vaasan Sähkö ×2, Oomi Aktiivinen |

**Nämä luvut vanhenevat.** Tarkista ne datasta äläkä luota tähän
taulukkoon muistinvaraisesti:

```
python3 -c "import json;d=json.load(open('data/electricity.json'));v=[p for p in d['plans'] if not p.get('hidden') and not p.get('example')];print(len(d['plans']),len(v),sum(1 for p in v if not p.get('partner')),d['priceDate'])"
```

Älä käytä `example`-lippua piilottamiseen. Se tarkoittaa nimenomaan
"lukua ei ole tarkistettu", ja väärä lippu johtaa siihen, että tarkistettu
hinta tarkistetaan turhaan uudelleen — tai pahempaa, tarkistamaton
julkaistaan.

`IS_EXAMPLE_DATA` (lib/energy.ts) laukaisee sivun esimerkkidatavaroituksen.
Se katsoo puuttuvaa `checkedAt`-kenttää näkyvillä riveillä, koska se on ainoa
ehto, joka voi oikeasti laueta.

**Affiliate-linkit ovat oikeita** `data/electricity.json`-tiedostossa: 20
sopimusta menee Adtractionin kautta (`go.adtNNN.net` / `ion.fortum.com`),
Jessen affiliate-tunnus on `as=2098832052`. Kolmella näkyvällä sopimuksella
ei ole kumppanuutta (`partner: false`): Turku Energia ×2 ja Helen Perussähkö.
Niiden nappi lukee "Siirry palveluntarjoajalle" eikä "Tee sopimus", ja niistä
ei tule palkkiota. Se on tarkoituksellista: vertailu, jossa näkyy vain
maksavat yhtiöt, on mainos.

**Korttidata `data/cards.json` on yhä keksittyä ja sen linkit ovat
`example.com/aff/...` -paikkamerkkejä.** Siksi koko korttiosio on piilossa
(`FEATURES.cards = false`).

## Hintojen tarkistus — toimintaohje

Jesse pyytää tämän säännöllisesti ("tarkista sähkösopimusten hinnat ja
korjaa ne, linkkien kautta"). Tehty 27.9., 10.10. ja 25.10.2026. Alla se,
mitä niistä opittiin, jotta samaa ei tarvitse päätellä uudelleen.

**Lähde on aina sopimuksen oma `sourceUrl`, ei mikään muu.** Ei Googlea,
ei vertailusivustoja, ei yhtiön muuta sivua ellei `sourceUrl` ohjaa sinne.
Jos luku ei löydy omasta linkistä, riviä ei päivitetä vaan asia raportoidaan.

**Suurin osa sivuista toimii `web_fetch`illä.** Nämä eivät:

| Kohde | Ongelma | Ratkaisu |
|---|---|---|
| Vattenfall (molemmat) | hintakentät tyhjiä HTML:ssä | selain, odota ~5 s |
| Nordic Green | "Product selector … enable JavaScript" | selain, odota ~7 s |
| Cheap Pörssisähkö (tilauslomake) | runko tyhjä | selain |
| Sähkötytöt Kiinteä | vain aktiivinen välilehti näkyy | selain, klikkaa **24 kk** |
| Turku Louna Lähi | oletusnäkymä on 24 kk | selain, klikkaa **6 kk** |

**Fortum on ansa.** Tuotekortissa lukee "Haetaan hintaa", mutta oikeat luvut
ovat `web_fetch`in palauttaman sivun LOPUSSA, korttien järjestyksessä:
Tarkka, Duo 24 kk, **Takuu 24 kk**, Duo 12 kk. Älä lue ensimmäistä lukua
Takuun hinnaksi. Varmista kahdelta Fortumin sivulta, jos luku muuttuu.

**Turku Energian sivulla on evästebanneri välilehtien päällä.** Se poistetaan
DOMista hyväksymättä mitään; "Salli kaikki" ei ole vaihtoehto. Synteettinen
`click()` ei vaihda välilehteä, tarvitaan oikea klikkaus koordinaatilla.

### Määräaikaiset tarjoukset — tämä meni jo kerran pieleen

Hehku merkitsi 10.10.2026 hintansa "voimassa rajoitetun ajan 6.–13.10.2026".
Luku (9,97) vietiin tuotantoon, tarjous umpeutui, eikä kukaan palannut
asiaan. 25.10. sivustolla luki 9,97 kun Hehku myi 10,59 — eli **vertailu
näytti kumppanin halvempana kuin se oli**, ja nimenomaan kumppanilinkin
takana. Se on pahin mahdollinen virhesuunta sekä kävijän luottamuksen että
kumppanuuden kannalta.

**Sääntö: jos lähde kertoo tarjoukselle päättymispäivän, sitä ei viedä
tuotantoon ilman että uusintatarkistus on sovittu samalla.** Vaihtoehdot
ovat (a) ajastettu tarkistus päättymispäivälle, (b) jätä edellinen
normaalihinta, (c) jätä rivi pois. Hiljainen (c-vaihtoehdon vastakohta)
"viedään nyt ja katsotaan sitten" ei ole vaihtoehto.

### Muutoksen jälkeen, joka kerta

1. Päivitä muuttuneiden rivien `checkedAt` ja tiedoston `priceDate`.
2. Kirjoita uusiksi ne `summary`/`features`/`pros`/`cons`/`faq`-tekstit,
   joissa vanha luku lukee sanoina. Luku on usein neljässä paikassa.
3. Aja jäännetarkistus: etsi vanhat luvut koko JSONista merkkijonona.
4. `./node_modules/.bin/tsc --noEmit` (kestää yli 2 min, käytä pitkää timeoutia).
5. Näytä Jesselle kenttädiff ja järjestysvaikutus 2 000 / 5 000 / 18 000 kWh
   kulutuksilla. Järjestyksen muutos on se, mikä oikeasti vaikuttaa klikkeihin.

### Tailwindin tarkistus — toistuva kompastus

Kun varmistat, että arbitrary-luokka syntyi `/tmp/out.css`:ään, `grep -c`
regexillä antaa helposti väärän nollan: Tailwind escapettaa `.` → `\.`,
`[` → `\[`, `,` → `\2c ` ja **`#` → `\#`**. Käytä `grep -oF ".luokka"` tai
`grep -o "ominaisuus[^;{]*" | sort -u`. Tämä on antanut väärän negatiivisen
kolmesti.

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
Se on ainoa varmistettu kuollut komponentti: `GuideRail`, `ClosingBelt` ja
`SpreadBar` ovat aiemmin olleet samalla listalla, mutta ne tuodaan
`app/etusivu/page.tsx`:stä. Tarkista tuojat ennen kuin poistat mitään:

```
grep -rln KomponentinNimi --include=*.tsx --include=*.ts app components lib
```

**Helenin perusmaksualennuksen kestoa ei tiedetä.** Helen ilmoittaa
"perusmaksut -70 %, vain 1,79 €/kk (norm. 5,99 €/kk)" kertomatta, kuinka
pitkään. Saman sivun pörssisopimuksessa kesto kerrotaan, joten puute ei ole
muotoseikka. Kirjattu `campaign.months = 24` eli koko sopimuskaudeksi, koska
se on sivun suora lukutapa, ja `features`-rivillä sanotaan ettei kestoa
kerrota. **Jos Helenin tilausputki näyttää lyhyemmän jakson, tämä on
korjattava.** Helen ei ole kumppani, joten pelissä on vain vertailun
uskottavuus, ei palkkio.

**Kaksi ympäristöväitettä ilman lähdettä.** `aalto-luotsi` sanoo
"Fossiilivapaa sähkö", mutta Aallon tuotekortilta on poistunut
fossiilivapaa-merkintä ja tilauslinkki vaihtui
`fossiilivapaa_porssisahko` → `porssisahko`. `sahkotytot-kiintea-24-kk`
sanoo "Hiilinegatiivisesti tuotettu sähkö", eikä Sähkötyttöjen Kiinteä-sivu
puhu alkuperästä mitään. Ympäristöväite on KSL 2 luvun alla samalla tavalla
kuin hintaväite: **joko lähde tai pois.** Odottaa Jessen päätöstä.

**`data/posts.json`:ssä on vanhoja sähkölukuja**, ja osa niistä on nyt
ristiriidassa korjatun vertailun kanssa. Noin 15 kohtaa. Kiireellisin:
useampi artikkeli sanoo Cheap Energyn 0,32 sentin marginaalin olevan
vertailun pienin ja pysyvän samana. 25.10.2026 alkaen Cheap on 0,39 kuusi
kuukautta ja sen jälkeen 0,78 c/kWh + 4,90 €/kk, eli väite on väärä. Sama sääntö kuin
sopimushinnoissa: luku joko tarkistetaan lähteestä tai poistetaan.

**Ajatusviivat `data/electricity.json`:ssä.** 38 sopimuksen
`summary`/`features`/`pros`/`cons`-teksteissä on `—`, vaikka blogiohje
kieltää ajatusviivat julkaistavassa tekstissä. Sama kielto koskee
sopimustekstejä, koska nekin ovat julkaistavaa tekstiä. Siivoamatta.
