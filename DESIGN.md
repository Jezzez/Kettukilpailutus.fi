# Kortio — Design System v3 "Clarity"

## Periaate

Yksi paletti. Yksi kirjasin. Ei koristeita. Jokainen elementti joko auttaa
käyttäjää vertailemaan tai se on poistettu. Luottamus syntyy selkeydestä,
ilmavuudesta ja johdonmukaisuudesta — ei tehosteista.

## Väripaletti

Täsmälleen viisi väriä. Mitään muuta ei käytetä missään — ei kirjavia
korttilogoja, ei kultaa, ei vihreää, ei keltaisia tähtiä.

| Token        | Hex       | Käyttö |
|--------------|-----------|--------|
| valkoinen    | `#FFFFFF` | Pääpinta |
| `mist`       | `#F6F8FA` | Vaihtoehtoinen pinta (hero, tilastot, footer) |
| `line`       | `#E6EAEF` | Reunaviivat |
| `ink`        | `#0F1B2D` | Teksti, tumma päätösblokki. Sävyt opasiteetilla 45/55/60/75 % |
| `accent`     | `#2563EB` | Ainoa korosteväri: CTA:t, valitut tilat, mittari, tähdet, linkkikorostukset. Tumma hover `#1D4ED8`, vaalea tausta `#EFF4FF` |

Korttien kuvakkeet piirretään sinisen-slaten sävyillä samasta perheestä,
jotta ruudukko pysyy rauhallisena.

## Typografia

Yksi perhe: **Inter**, kolme painoa.
- Bold + `tracking-tight`: otsikot (48/36/28/20)
- Semibold: painikkeet, korostukset, nimet
- Regular/Medium: leipäteksti 15–16/1.6, toissijainen teksti opasiteetilla

Kaikki numerot tabulaarisina (`font-variant-numeric: tabular-nums`), jolloin
hinnat ja korot pysyvät sarakkeissa linjassa.

## Spacing, muodot, varjot

- 4 px -ruudukko. Sektiot `py-20 md:py-28`, sisältö `max-w-6xl`.
- Kortit `rounded-2xl`, napit täyspyöreät, sirut täyspyöreät.
- Kaksi varjoa: `card` (lepo) ja `cardHover` (nosto). Ei muita.
- Reunaviiva + kevyt varjo yhdessä — ei koskaan kovaa varjoa.

## Motion

Vähän ja luonnollisesti: 150–250 ms mikrointeraktiot, nappien
`active:scale-98`, korttien uudelleenjärjestys jousella (320/32),
polun siirtymät 250 ms, mittarin kaari jousella. `prefers-reduced-motion`
poistaa kaiken.

## Vertailukokemus

1. **Polku** (3 kysymystä valkoisella kortilla, sininen eteneminen) täyttää
   suodattimet käyttäjän puolesta.
2. **Kortit järjestyvät** animoiden; paras osuma saa sinisen reunuksen ja
   "Sinun valintasi" -merkinnän.
3. **Sopivuus-mittari** (yksi sininen kaari, 0–100) päivittyy jokaisesta
   valinnasta.
4. **Hienosäätösirut** samalla logiikalla: valittu = sininen, muu = valkoinen.

## Saavutettavuus

Fokus: 2 px sininen rengas kaikkialla. Kontrastit: ink/valkoinen 15.4:1,
accent/valkoinen 4.9:1 (AA). Tila ei koskaan pelkän värin varassa
(✓/– -soluissa sr-only-tekstit). Kosketusalueet ≥ 44 px.

## Repo — maskotti

**Hahmo:** Repo on itsevarma ja fiksu kettu, joka pitelee luottokorttia.
Turkki on täsmälleen brändioranssi (#EA6A1F), yksityiskohdat navya —
Repo *on* paletti, joten se ei koskaan riitele muun ilmeen kanssa.
Tunnisteet: navy-huivi, itsevarmat kulmakarvat, valkokärkinen häntä.

**Persoona:** puhuu lyhyesti, sinuttelee, opastaa mutta ei tuputa.
Ei huutomerkkejä hintoihin, ei myyntipuhetta — Repo on opas, ei myyjä.

**Käyttäytyminen sivustolla:**
- Istuu vasemmassa alakulmassa; häntä heiluu, silmät räpsyvät.
- Scrollatessa Repo juoksee (nopea pomppu + häntä hulmuaa) ja kupla piiloutuu.
- Pysähtyessä kupla kertoo osiokohtaisen vinkin (hero/vertailu/taulukko/UKK).
- Klikkaus vie seuraavaan osioon — Repo kirjaimellisesti näyttää mihin mennä.
- Aina suljettavissa; piilossa mobiilissa ja admin-sivulla;
  `prefers-reduced-motion` pysäyttää kaiken liikkeen.

**Säännöt:** yksi Repo per näkymä, ei koskaan CTA:n päällä, ei ääntä,
ei automaattisia ponnahduksia sisällön päälle.
