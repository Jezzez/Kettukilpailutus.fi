# Kettukilpailutus — design-järjestelmä "Ketun kolo"

## Periaate

Sivusto on kokonaan tumma. Syvyys tehdään **valoarvoilla, ei väreillä**:
pinta on sitä vaaleampi mitä lähempänä käyttäjää se on. Värejä on
tarkoituksella vain kaksi — kettuoranssi ja kulta. Kaikki muu on lämpimän
harmaan sävyjä, ja juuri se pitää ilmeen asiallisena. Uuden värin lisääminen
tekee ilmeestä halvan, joten sitä ei tehdä.

Luottamus syntyy selkeydestä ja johdonmukaisuudesta. Jokainen elementti joko
auttaa käyttäjää vertailemaan tai se poistetaan.

## Väripaletti

Kaikki tokenit määritellään `tailwind.config.ts`-tiedostossa.

### Pinnat, tummimmasta vaaleimpaan

| Token | Hex | Käyttö |
|---|---|---|
| `den` | `#0A0807` | Syvin — herot, footer, upotetut laatikot |
| `paper` | `#0D0A08` | Sivun pohja (`body`) |
| `white` | `#1A1512` | **Ylikirjoitettu.** Kortin pinta |
| `mist` | `#241C16` | Kohotettu paneeli |
| `peach` | `#2A1D13` | Lämmin sävytetty paneeli |
| `night` | `#312619` | Chipit, ikonilaatat |
| `navy` | `#342820` | Hover kohotetulla pinnalla |
| `line` | `#332A21` | Reunaviivat |
| `lineDark` | `#43372B` | Vahvempi reunaviiva |

> **Tailwindin `white` on ylikirjoitettu tummaksi.** Se on tarkoituksellinen
> ratkaisu: koko olemassa oleva `bg-white`-koodi kääntyi kerralla tummaksi.
> `bg-white` = kortin tumma pinta. Älä "korjaa" tätä vaaleaksi.

### Tekstit

| Token | Hex | Käyttö |
|---|---|---|
| `ink` | `#F2EADF` | Ensisijainen teksti (lämmin kerma) |
| `cream` | `#F7F1E8` | Kirkkain teksti tummalla |

Toissijainen teksti tehdään opasiteetilla: `text-ink/72` leipätekstille,
`text-ink/58` ja `text-ink/55` vaimennetulle. Ei erillisiä harmaita tokeneita.

### Korosteet

| Token | Hex | Käyttö |
|---|---|---|
| `accent` | `#E8691B` | Kettuoranssi — ainoa varsinainen väri. CTA:t, valitut tilat, fokusrengas |
| `accentDark` | `#FF8C3C` / `#B84D08` | Tekstioranssi. Tummenee vaalealla pinnalla |
| `accentSoft` | `#2E1C0E` / `#FDEEE2` | Oranssin sävytetty pohja chipeille |
| `gold` | `#D9A24F` | Vain hiusviivat, reunat ja taustasävytykset |
| `goldInk` | `#D9A24F` / `#7A5214` | Kulta **tekstinä**. Tummenee vaalealla |
| `onEmber` | `#FFF3E9` | Teksti oranssin napin päällä. Kiinteä, ei käänny |
| `star` | `#E8B04A` | Arviotähdet |

`ok` ja `mint` osoittavat molemmat oranssiin — vihreää ei ole paletissa,
joten myös "hyvä"-tilat käyttävät kettuoranssia.

### Miksi kolme "kaksoistokenia"

Brändikulta `#D9A24F` ja vaalea oranssi `#FF8C3C` on suunniteltu tummalle
pinnalle. Valkoisella ne jäävät noin 2:1 kontrastiin eli lukukelvottomiksi.
Siksi `goldInk` ja `accentDark` ovat CSS-muuttujia, jotka tummenevat
`.theme-light`-osion sisällä — kyse on saman värin tummemmasta valoarvosta,
ei uudesta väristä. `onEmber` taas on kiinteä, koska nappi on oranssi
molemmilla pinnoilla eikä sen teksti saa koskaan kääntyä tummaksi.

## Kaksi pintaa: `.theme-light` ja `.theme-dark`

Sivusto on oletuksena tumma. `app/globals.css` määrittelee pinnat ja tekstit
CSS-muuttujina, joten sama luokka (`bg-white`, `text-ink`, `border-line`)
piirtyy tummana tai vaaleana sen mukaan, onko esivanhemmassa `.theme-light`.

**Sähkösivun tuloslista on vaalea.** Perustelu on tuotto: palkkio syntyy
"Tee sopimus" -klikistä, ja se nappi on tuloslistassa. Lista on tiheää
numeroiden silmäilyä, joka on nopeampaa tummalla tekstillä vaalealla
pohjalla. Hero ja footer pysyvät tummina, koska ne kantavat brändin.

**`.theme-dark` on pakollinen jokaisessa pysyvästi tummassa laatikossa, joka
on vaalean osion sisällä** (`.den-surface`-paneelit, `bg-den`-tuloslaatikot).
Ilman sitä `text-cream` kääntyy tummaksi ja teksti katoaa pohjaan.

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

- `.den-surface` — syvin pinta. Kohinatekstuuri estää tumman latistumisen
  litteäksi mustaksi; lämpimät hehkut nurkissa antavat tilalle valonlähteen.
- `.btn-ember` — ensisijainen nappi. Kevyt pystygradientti `#F0752A → #DC5A11`
  tekee napista veistetyn; tasainen täyttöväri näyttää tummalla halvalta.
- `.ember-glow` — oranssi hehku maskotin taakse.
- `.gold-rule` — kultainen hiusviiva, häivytys molemmista päistä.
- `.glass-dark` — headerin tumma lasi (blur + saturaatio).
- `.scrollbar-none` — piilottaa vaakavierityksen palkin.

## Muodot ja varjot

4 px -ruudukko. Kortit `rounded-2xl` tai `rounded-3xl`, napit `rounded-xl`,
chipit täyspyöreät. Sisältö `max-w-[1180px]`.

Tummalla varjo yksin ei riitä syvyyteen, joten jokaisessa varjossa on
**yläreunan valojuova** (`inset 0 1px 0`), joka saa pinnat näyttämään
veistetyiltä eikä litteiltä laatikoilta.

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
automaattisia ponnahduksia sisällön päälle, `ember-glow` taakse kun hahmo on
tummalla pinnalla.
