import Reveal from "@/components/Reveal";
import CountUp from "@/components/home/CountUp";

/*
  LUKURIVI — KOLME LUKUA, JOTKA JUOKSEVAT PAIKOILLEEN.

  MUOTO ON KILPAILUTTAJA.FI:STÄ (Jessen pyyntö 19.9.2026): keskitetty
  otsikko, sen alla kolme isoa lukua rinnakkain, jokaisen alla lyhyt viiva
  ja yhden rivin selite. Aiheet ovat samat kolme: välitetyt sopimukset,
  vuodet ja kilpailutusten määrä. Värit ja kirjasimet ovat meidän omamme,
  koska DESIGN.md sallii kaksi väriä eikä heidän vihreänsä ole kumpikaan.

  =====================================================================
  LUVUT OVAT PAIKKAMERKKEJÄ. NÄITÄ EI SAA JULKAISTA SELLAISENAAN.
  =====================================================================

  Jesse pyysi luvut paikkamerkkeinä ja vaihtaa ne itse heti. Sanoin tämän
  jo kerran ja se on kirjattava myös tänne, koska tiedosto elää kauemmin
  kuin keskustelu:

  1. Numeerinen menekkiväite ("600 000 välitettyä sähkösopimusta") on
     markkinointiväite, joka on kuluttajansuojalain 2 luvun mukaan
     kyettävä näyttämään toteen. Tällä sivustolla ei ole järjestelmää,
     joka laskisi välitettyjä sopimuksia: GA4 näkee vain klikin ulos
     (`affiliate_click`, lib/track.ts), ja se mitä kumppanin sivulla
     tapahtuu sen jälkeen näkyy vain Adtractionin raportissa.
  2. Affiliate-ohjelmat tarkastavat julkaisijan sivun ennen hyväksyntää ja
     sen jälkeen pistokokein. Todentamaton menekkiväite on tyypillisin
     yksittäinen syy, jolla kumppanuus katkaistaan, ja kumppanuus on
     sivuston koko liikevaihto. Väärä luku tässä kohdassa maksaa siis
     enemmän kuin mitä yksikään luku tässä kohdassa voi tuoda.
  3. Vuosiluku on ainoa kolmesta, jonka voi tarkistaa ulkopuolelta:
     Mucho Vendo Oy:n rekisteröintipäivä näkyy YTJ:stä. Jos se ei täsmää
     tähän lukuun, ero on kenen tahansa löydettävissä minuutissa.

  MITÄ TÄSTÄ POISTUI JA MISSÄ SE ON YHÄ. Tässä oli kaksi lukua, jotka
  laskettiin `data/electricity.json`:sta: sopimusten määrä (25) ja
  hintojen tarkistuspäivä (18.9.2026). Ne olivat sivuston ainoat luvut,
  jotka kävijä pystyi tarkistamaan avaamalla vertailun ja laskemalla
  rivit. Tarkistuspäivä sanotaan yhä `WhyCompare`-osiossa ja jokaisen
  sopimuksen kohdalla vertailussa, joten se ei kadonnut sivustolta.
  Sopimusten lukumäärä ei ole enää etusivulla missään.

  Jos haluat ne takaisin tämän rivin viereen, ne tulevat `lib/home.ts`:n
  `HomeFacts`-tyypistä (`facts.planCount`, `facts.priceDate`), ja
  `app/page.tsx` välittää sen jo muille osioille.
*/

/**
 * PAIKKAMERKKILUVUT — VAIHDA NÄMÄ.
 *
 * `value` on se luku, johon laskuri juoksee. `suffix` ladotaan sen perään
 * sellaisenaan, joten "+"-merkki ja "milj." eivät ole osa lukua eivätkä
 * riko laskuria. Luku muotoillaan `fi-FI`-erottimilla, eli 600000 piirtyy
 * muodossa "600 000" ilman että sitä kirjoitetaan tähän välilyönnillä.
 *
 * Jos jokin luvuista ei ole tosi, poista koko rivi. Kaksi tarkistettavaa
 * lukua on vahvempi kuin kolme, joista yhtä ei voi näyttää toteen.
 */
const STATS: { value: number; suffix?: string; label: string }[] = [
  { value: 10000, suffix: "+", label: "välitettyä sähkösopimusta" },
  { value: 1000, suffix: "+", label: "laintarjousta lähetetty" },
  { value: 5, label: "vuotta kokemusta 2021 alkaen" },
];

/** PAIKKAMERKKIOTSIKKO — vaihda tämä samalla kun vaihdat luvut. */
const TITLE = "Säästöjä suomalaisille jo vuosien ajan";

export default function StatStrip() {
  return (
    <section className="theme-light bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          {/*
            OTSIKKO ON KAPEA JA KESKITETTY. `max-w-[20ch]` katkaisee sen
            kahdelle riville kuten referenssissä. Ilman rajausta otsikko
            venyy työpöydällä yhdeksi pitkäksi riviksi, jolloin se lukee
            väliotsikkona eikä lukurivin omana väitteenä.
          */}
          <h2 className="mx-auto max-w-[20ch] text-center font-hero text-[clamp(1.7rem,4.6vw,2.6rem)] leading-[1.1] text-accentDark">
            {TITLE}
          </h2>
        </Reveal>

        {/*
          PUHELIMESSA ALLEKKAIN, SIITÄ YLÖSPÄIN RINNAKKAIN.

          Vanha kahden luvun rivi oli `grid-cols-2` kaikilla leveyksillä,
          koska kaksi lyhyttä lukua mahtuu 390 pikselille. Kolme ei mahdu:
          "600 000" on seitsemän merkkiä, ja kolmeen sarakkeeseen jaettuna
          se on noin 120 pikselin levyinen palsta, jolloin luku joko
          kutistuu selitteen kokoiseksi tai katkeaa kahdelle riville.
          Kumpikin tuhoaa sen ainoan asian, jota varten iso luku on
          olemassa.

          `whitespace-nowrap` luvussa on varmistus samaan asiaan: luku ei
          saa katketa missään leveydessä.
        */}
        <dl className="mx-auto mt-10 grid max-w-[58rem] grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-8 md:mt-12">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="flex flex-col items-center text-center">
                <dt className="whitespace-nowrap font-hero font-price text-[clamp(2.4rem,6.6vw,3.6rem)] leading-none text-accentDark">
                  {/*
                    LASKURI JUOKSEE VASTA KUN LUKU TULEE RUUTUUN, ja se on
                    porrastettu 80 millisekunnin välein. Kolme lukua yhtä
                    aikaa käynnistettynä luetaan yhtenä nykäyksenä;
                    porrastettuna silmä käy ne läpi vasemmalta oikealle
                    siinä järjestyksessä, jossa ne on kirjoitettu.

                    Palvelin renderöi valmiin luvun eikä nollaa, joten
                    hakukone ei lue etusivulta nollia. Nollaus tehdään
                    vasta selaimessa. `prefers-reduced-motion` ohittaa
                    animaation kokonaan. Ks. `components/home/CountUp.tsx`.
                  */}
                  <CountUp value={s.value} suffix={s.suffix} delayMs={i * 80} />
                </dt>

                {/*
                  LYHYT KULTAVIIVA LUVUN JA SELITTEEN VÄLISSÄ. Referenssissä
                  sama viiva on vihreä. Se ei ole koriste: ilman sitä luku ja
                  selite ovat kaksi keskitettyä tekstiriviä peräkkäin, ja
                  silmä lukee ne yhdeksi kappaleeksi, jonka ensimmäinen rivi
                  sattuu olemaan iso. Viiva sanoo "tämä luku koskee tätä
                  riviä" ilman yhtään sanaa.
                */}
                <span aria-hidden className="mt-4 block h-[3px] w-10 rounded-full bg-gold" />

                <dd className="mt-4 max-w-[22ch] text-[14px] leading-snug text-ink/65 sm:text-[15px]">
                  {s.label}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
