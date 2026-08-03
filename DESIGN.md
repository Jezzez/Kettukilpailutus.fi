# Kettukilpailutus — design-järjestelmä "Ketun kolo"

## Periaate

Sivusto on **lämpimän vaalea, ja sen rytmin tekevät täysleveät oranssit
vyöt.** Syvyys tehdään valoarvoilla, ei väreillä: pinta on sitä vaaleampi
mitä lähempänä käyttäjää se on. Värejä on tarkoituksella vain kaksi —
kettuoranssi ja kulta. Kaikki muu on lämpimän hiekan sävyjä.

**Miksi ei enää tumma.** Tumma versio vei brändiltä sen ainoan aseen. Kettu
on oranssi, ja oranssi loistaa vaaleaa vasten; mustalla pohjalla oranssi
hehkuu, mutta niin hehkuu kaikki muukin — eikä yksikään nappi erotu. Tumma
jää käyttöön vain alatunnisteessa ja yksittäisissä korostuslaatikoissa.

**Miksi vyöt.** Vaalea pinta yksinään on sekin ongelma: jos koko ruutu on
välillä 92–100 % vaaleutta, silmä ei löydä mitään mihin laskeutua. Siksi
vaaleus on porrastettu (paperi → hiekka → kortti) ja sivun tärkeimmät
kohdat — hero ja loppukehotus — on maalattu täyteen brändiväriin. Täysi
väripinta on voimakkain mahdollinen ankkuri, eikä se maksa latausaikaa.

**Reunat ovat pakollisia.** Ryhmittelyä ei tehdä pelkillä väleillä. Väli
kertoo mikä on erillään, ei mikä kuuluu yhteen — siksi reunaton sivu
tuntuu sekalaiselta vaikka jokainen osio olisi erikseen siisti.

Luottamus syntyy selkeydestä ja johdonmukaisuudesta. Jokainen elementti joko
auttaa käyttäjää vertailemaan tai se poistetaan.

## Väripaletti

Tokenit ovat `tailwind.config.ts`-tiedostossa, arvot CSS-muuttujina
`app/globals.css`-tiedostossa. Arvot ovat RGB-kolmikkoja ilman `rgb()`-
kääreitä, jotta Tailwindin läpinäkyvyysmerkinnät (`text-ink/70`) toimivat.

### Pinnat, vaaleimmasta tummimpaan (`.theme-light`, oletus)

| Token | RGB | Käyttö |
|---|---|---|
| `white` | `255 253 249` | **Ylikirjoitettu.** Kortin pinta, vaalein taso |
| `paper` | `251 246 237` | Sivun pohja (`body`) — luonnonvalkoinen, ei valkoinen |
| `mist` | `247 240 229` | Kohotettu paneeli |
| `night` | `244 234 217` | Hiekka — vyöhykerytmin keskitaso |
| `peach` | `253 235 220` | Oranssin haalein taso: "tämä liittyy Kettuun" |
| `navy` | `236 223 201` | Hover kohotetulla pinnalla |
| `line` | `226 212 189` | Reunaviiva — tarkoituksella NÄKYVÄ |
| `lineDark` | `199 178 145` | Vahvempi reunaviiva |

> **Tailwindin `white` on ylikirjoitettu.** Se osoittaa CSS-muuttujaan
> `--c-card`, joten sama `bg-white` piirtyy vaaleana, tummana tai
> oranssina sen mukaan, minkä teemaluokan sisällä se on. Älä "korjaa"
> tätä kiinteäksi valkoiseksi.

### Tekstit

| Token | Käyttö |
|---|---|
| `ink` | Ensisijainen teksti |
| `cream` | Kirkkain/tummin ääripää — kääntyy teeman mukana |

Toissijainen teksti tehdään opasiteetilla: `text-ink/70` leipätekstille,
`text-ink/55` vaimennetulle. Oranssilla vyöllä nostetaan `/85`:een, koska
kylläinen pohja syö kontrastia. Ei erillisiä harmaita tokeneita.

### Korosteet

| Token | Hex | Käyttö |
|---|---|---|
| `accent` | `#E8691B` | Kettuoranssi — ainoa varsinainen väri. Kiinteä, ei käänny |
| `gold` | `#D9A24F` | Vain hiusviivat, reunat ja taustasävytykset. Kiinteä |
| `accentDark` | vaihtuva | Oranssi **tekstinä**. Tummenee vaalealla |
| `goldInk` | vaihtuva | Kulta **tekstinä**. Tummenee vaalealla |
| `accentSoft` | vaihtuva | Oranssin sävytetty pohja chipeille |
| `onEmber` | `#FFF3E9` | Teksti oranssin napin päällä. Kiinteä |
| `den` | `#0A0807` | Aina tumma — alatunnisteen pohja |
| `star` | `#E8B04A` | Arviotähdet |

Vihreää ei ole paletissa: myös "hyvä"-tilat käyttävät kettuoranssia.

### Miksi kaksoistokenit

Brändikulta `#D9A24F` ja brändioranssi `#E8691B` jäävät vaalealla noin
3:1 kontrastiin eli liian heikoiksi leipätekstiin. Siksi `goldInk` ja
`accentDark` ovat CSS-muuttujia, jotka tummenevat vaalealla — kyse on
saman värin tummemmasta valoarvosta, ei uudesta väristä.

## Kolme teemaa: `.theme-light`, `.theme-ember`, `.theme-dark`

Sama luokka (`bg-white`, `text-ink`, `border-line`) piirtyy eri värisenä
sen mukaan, minkä teemaluokan sisällä se on. `.theme-light` on oletus.

- **`.theme-ember`** — täysleveä oranssi vyö. Käytössä heroissa,
  loppukehotuksessa ja 404-sivulla. Käyttöpari on aina
  `theme-ember ember-surface`.
- **`.theme-dark`** — vain alatunniste ja yksittäiset korostuslaatikot
  vaalean osion sisällä. Ilman luokkaa `text-cream` kääntyy vääriin päin
  ja teksti katoaa pohjaan.

### Ember-ansa — lue tämä ennen kuin lisäät mitään oranssille vyölle

Ember-teemassa kaksi muuttujaa **vaihtavat merkityksensä**:

| Luokka | Merkitys vaalealla | Merkitys ember-vyöllä |
|---|---|---|
| `bg-white` | lähes valkoinen kortti | **oranssi** `rgb(199 76 14)` |
| `text-accentDark` | tumma oranssi teksti | **vaalea kerma** |

Siksi jokainen vaalealle pinnalle suunniteltu komponentti on tarkistettava
näiden kahden varalta, kun se pudotetaan oranssille vyölle. Kaksi
vakioratkaisua:

1. **Kermanapin teksti on kiinteä `text-[#A83E0A]`**, ei `text-accentDark`.
   Sama sävy kuin `.ember-surface`-pohjassa, eli ei uutta väriä palettiin.
2. **Vaalea kortti oranssin päällä kääritään `theme-light`-luokkaan**,
   jolloin `bg-white` ratkeaa taas vaaleaksi.

### Vyöhykkeiden rajat

Oranssi vyö ei lopu suoraan viivaan vaan `TailSweep`-kaareen. Kaaren
`fill` on **naapurivyöhykkeen** väri, ja se saadaan käärimällä kaari
naapurin teemaluokkaan:

```tsx
<div className="theme-light">
  <TailSweep fill="rgb(var(--c-paper))" height={64} />
</div>
```

Näin väri on määritelty vain yhdessä paikassa eikä kahdesti kovakoodattuna.

### Miksi tuloslistat ovat vaaleita

Palkkio syntyy "Tee sopimus" -klikistä, ja se nappi on tuloslistassa.
Lista on tiheää numeroiden silmäilyä, joka on nopeampaa tummalla tekstillä
vaalealla pohjalla.

## Typografia

Kaksi perhettä, molemmat `next/font/google`-latauksella `layout.tsx`:ssä.

- **Schibsted Grotesk** (`font-display`) — otsikot, napit, korostukset.
  Pohjoismainen mediagrotesk: tiivis ja luottamusta herättävä.
  Painot 500/600/700/800.
- **Inter** (`font-body`) — leipäteksti ja numerot.

Otsikoissa `letter-spacing: -0.02em` (globals.css). Numerot tabulaarisina
`.font-data`-luokalla, jolloin hinnat pysyvät sarakkeissa linjassa.

## Apuluokat

Nämä ovat `app/globals.css`-tiedostossa, eivät Tailwind-tokeneita:

- `.ember-surface` — oranssi vyö. Pohja on brändioranssia **tummempi**
  (`#A83E0A`) tarkoituksella: maskotti on kirkkaan oranssi, ja samalla
  kirkkaudella se katoaisi pohjaan. Nyt Kettu on vyön vaalein kohta.
  Kohinakalvo `::after` estää suuren väripinnan latistumisen.
- `.den-surface` — syvin tumma pinta (alatunniste). Kohinatekstuuri estää
  tumman latistumisen litteäksi mustaksi. `::after`-kohinakalvo piirtyy
  asemoimattomien lasten päälle, joten lapset tarvitsevat `relative`.
- `.pelt-surface` — lämmin turkinsävyinen laatikko vaalealla.
- `.btn-ember` — oranssi nappi. **Vain vaalealla pinnalla.** Oranssilla
  vyöllä ensisijainen nappi on kermanvalkoinen (`bg-cream`), koska nappi
  on siellä ruudun ainoa vaalea piste — se on koko vyön tarkoitus.
- `.lift` — **yksi yhteinen nostoefekti kaikille korteille** (140 ms,
  `translateY(-3px)` + `--sh-card-hover`). Älä kirjoita korteille omia
  `transition-all duration-300` -sääntöjä: eri nopeuksilla liikkuva sivu
  tuntuu tehdyltä eri käsillä, ja juuri se lukee "ei ole sulava".
  Kunnioittaa `prefers-reduced-motion`.
- `.halo-glow` — kermanvaalea hehku maskotin taakse **oranssilla** vyöllä.
- `.dawn-glow` / `.ember-glow` — hehkut vaalealla pinnalla.
- `.gold-rule` — kultainen hiusviiva, häivytys molemmista päistä.
- `.glass-light` / `.glass-dark` — headerin lasi (blur + saturaatio).
- `.font-hero`, `.font-data` (tabulaariset numerot), `.font-price`.
- `.scrollbar-none` — piilottaa vaakavierityksen palkin.

## Muodot ja varjot

4 px -ruudukko. Kortit `rounded-2xl` tai `rounded-3xl`, napit `rounded-xl`,
chipit täyspyöreät. Sisältö `max-w-[1180px]`.

Vaalealla syvyys tehdään **terävällä lähivarjolla**, ei laajalla usvalla:
ruskeaan taittava leveä varjo lukee likana. Tummalla (alatunniste) varjo
yksin ei riitä, joten siellä jokaisessa varjossa on **yläreunan valojuova**
(`inset 0 1px 0`), joka saa pinnat näyttämään veistetyiltä.

| Varjo | Käyttö |
|---|---|
| `card` | Lepotila |
| `cardHover` | Nosto |
| `lift` | Voimakas nosto, modaalit |
| `ember` | Oranssi hehku CTA:n alla |

## Motion

Vähän ja luonnollisesti: 150–250 ms mikrointeraktiot, nappien
`active:scale-[0.98]`, korttien uudelleenjärjestys jousella, maskotin
asennonvaihto jousella (stiffness 220 / damping 22). Framer Motion.

`prefers-reduced-motion` poistaa kaiken liikkeen — sekä globaalisti
(globals.css) että komponenteissa `useReducedMotion`-hookilla. Uusi animaatio
ei ole valmis ennen kuin se kunnioittaa tätä.

## Saavutettavuus

Fokus: 2 px kettuoranssi rengas kaikkialla (`:focus-visible`, globals.css).
Tila ei koskaan pelkän värin varassa — ✓/– -soluissa on `sr-only`-tekstit.
Kosketusalueet ≥ 44 px. Mobile-first. `color-scheme: dark` kerrotaan
selaimelle, jotta lomakekentät ja vierityspalkit noudattavat teemaa.

## Kettu — maskotti

**Hahmo:** 3D-renderöity kettu. Karismaattinen, älykäs, premium — **ei
koskaan lapsellinen.** Turkki on brändioranssi, joten Kettu *on* paletti
eikä koskaan riitele muun ilmeen kanssa.

**Persoona:** puhuu lyhyesti, sinuttelee, opastaa mutta ei tuputa. Ei
huutomerkkejä hintoihin, ei myyntipuhetta — Kettu on opas, ei myyjä.

**Slogan:** "Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi!"

**Tekninen toteutus** (`components/mascot/Kettu.tsx`): kolme asentoa —
`kortti`, `osoittaa`, `peukku` — WebP-kuvina `public/`-kansiossa. Asennon
vaihto on ristiinhäivytys + pieni pomppu, jolloin hahmo tuntuu elävältä
ilman kehysanimaatiota. Kevyt leijunta (`float`) toimii "hengityksenä".
Heron iso esiintyminen: `components/mascot/HeroKettu.tsx`.

**Säännöt:** yksi Kettu per näkymä, ei koskaan CTA:n päällä, ei ääntä, ei
automaattisia ponnahduksia sisällön päälle. Hehku valitaan pohjan mukaan:
`halo-glow` oranssilla vyöllä, `dawn-glow` vaalealla.

**Mobiilissa Kettu ei saa omaa ruudullistaan.** Iso maskotti vei puhelimessa
kokonaisen näytöllisen ennen ensimmäistäkään korttia, eli käyttäjän piti
selata koristeen ohi päästäkseen työkaluun. Mobiilissa hahmo on pienenä
tekstin vieressä: brändi näkyy, mutta ei maksa klikkiä.

**Placeholderit** (`components/fox/FoxSlot.tsx`): rekisteri kertoo jokaisen
paikan koon ja kuvausbriiffin. Kun `src` on `null`, paikalle piirtyy
kultainen katkoviivalaatikko, jossa lukee mitä kuvaa siihen odotetaan.
Kytkin `SHOW_PLACEHOLDERS` sammuttaa ne kerralla ennen julkaisua.
