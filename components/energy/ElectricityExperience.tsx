"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Building2, Flame, Home, House, Info, Leaf, Lock, Plug, RefreshCw,
  ShieldCheck, Timer, TrendingDown, Wallet, X,
} from "lucide-react";
import type { ElectricityPlan } from "@/lib/energy";
import { annualCost, ASSUMED_SPOT_AVG, DWELLINGS, PRICE_DATE } from "@/lib/energy";
import PlanCard, { type PlanBadge } from "./PlanCard";
import SpotCurve from "./SpotCurve";
import SpotPriceLive from "./SpotPriceLive";
import EnergyStickyBar from "./EnergyStickyBar";
import BrushRule from "../BrushRule";
import FoxPaw from "../FoxPaw";
import TailSweep from "../fox/TailSweep";
import PawTrail from "../fox/PawTrail";
import FoxSlot from "../fox/FoxSlot";
import FoxRosette from "../fox/FoxRosette";
import FoxComputing, { useFoxComputing } from "../fox/FoxComputing";

/**
 * Heron kolme lupausta ja niiden perustelut.
 *
 * Jokainen `why` on tarkistettavissa oleva tosiasia, ei markkinointilause.
 * Toinen kohta kertoo tarkoituksella myös poikkeuksen: määräaikaisen
 * sopimuksen purkaminen voi maksaa. Jos lukija törmää siihen vasta
 * sähköyhtiön sivulla, hän palaa takaisin tuntien tulleensa vedätetyksi —
 * ja se on menetetty palkkio sekä menetetty paluukävijä. Sanottuna se on
 * sivun uskottavin lause.
 *
 * ÄLÄ lisää tähän lupausta, jota et voi perustella yhdellä lauseella.
 */
const HERO_CLAIMS = [
  {
    icon: Plug,
    text: "Sähkö ei katkea",
    why: "Sähkö tulee kotiisi täsmälleen samaa verkkoa pitkin kuin ennenkin — vaihtuu vain yhtiö, joka laskuttaa sinua myydystä sähköstä. Siirtoyhtiösi pysyy samana eikä vaihdosta synny katkoa.",
  },
  {
    icon: RefreshCw,
    text: "Vanha sopimus irtisanotaan puolestasi",
    why: "Uusi sähköyhtiö hoitaa irtisanomisen, eli sinun ei tarvitse soittaa vanhalle yhtiölle. Yksi poikkeus: jos sinulla on kesken määräaikainen sopimus, sen purkamisesta voi tulla kuluja — tarkista päättymispäivä laskustasi ennen vaihtoa.",
  },
  {
    icon: Timer,
    text: "Vie noin 5 minuuttia",
    why: "Tarvitset sähkölaskustasi 17-numeroisen käyttöpaikkatunnuksen sekä pankkitunnukset tunnistautumiseen. Sopimus syntyy sähköisesti, ja etämyynnissä sillä on aina 14 vuorokauden peruutusoikeus.",
  },
] as const;

/**
 * Sähkön koko kokemus.
 *
 * Kolme asiakaslähtöistä ratkaisua ohjaavat rakennetta:
 * 1. Laskuri on heron sisällä — työkalu ennen myyntipuhetta.
 * 2. Säästö lasketaan ensisijaisesti käyttäjän OMAAN nykyiseen sopimukseen.
 *    Vertailu listan kalleimpaan on vertailusivujen vanha temppu, jonka
 *    asiakas aistii; oma hinta tekee luvusta tarkistettavan ja rehellisen.
 * 3. "Pörssi vai kiinteä" on asiakkaan vaikein päätös, joten siihen
 *    vastataan työkalussa eikä oppaassa jossain muualla.
 */

const TYPE_TABS = [
  { key: null, label: "Kaikki" },
  { key: "spot", label: "Pörssisähkö" },
  { key: "fixed", label: "Kiinteä hinta" },
  { key: "open", label: "Toistaiseksi" },
] as const;

const DWELLING_ICONS = { kerrostalo: Building2, rivitalo: Home, omakotitalo: House, sahkolammitys: Flame } as const;

function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setValue(target); return; }
    const start = performance.now();
    const origin = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(origin + (target - origin) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce]);

  return value;
}

export default function ElectricityExperience({
  plans,
  initialType = null,
  initialKwh = 5000,
  withHero = true,
  heading,
  intro,
}: {
  plans: ElectricityPlan[];
  initialType?: "spot" | "fixed" | "open" | null;
  initialKwh?: number;
  withHero?: boolean;
  heading?: string;
  intro?: string;
}) {
  /*
    KYSELY EDELTÄÄ TULOKSIA — MUTTA VAIN PÄÄVERTAILUSSA.

    MIKSI PORTTI: sopimuslista ilman käyttäjän lukuja on hintataulukko,
    ja hintataulukkoa selataan. Kun samat kortit näytetään vasta sen
    jälkeen kun käyttäjä on itse kertonut asuntonsa ja kulutuksensa,
    jokainen euromäärä ruudulla on HÄNEN lukunsa. Se on sama ele kuin
    suomalaisilla kilpailijoilla, ja se toimii kahdesta syystä:
    hinnat ovat henkilökohtaisia (ei enää c/kWh-abstraktio), ja
    vastaamiseen käytetty puoli minuuttia sitoo käyttäjän tulokseen —
    listaa ei enää selata vaan luetaan.

    MIKSI VAIN `withHero`: aihesivut (`/sahkosopimukset/[topic]`) ovat
    hakukoneen laskeutumissivuja, joille tullaan tarkalla kysymyksellä
    ("pörssisähkö kerrostaloon"). Ne saavat kulutuksen ja sopimustyypin
    valmiiksi propseina, eli perustiedot ovat jo tiedossa — portti
    kysyisi uudelleen jotain, minkä käyttäjä juuri kertoi hakusanallaan,
    ja veisi vastauksen pois heti latautuvalta sivulta. Siellä lista
    näkyy suoraan.

    HUOM. hakukonenäkyvyys: tällä sivulla sopimuslista ei ole enää
    palvelimen palauttamassa HTML:ssä. Yksittäiset sopimussivut
    (`/sahkosopimukset/sopimus/[slug]`) ja aihesivut kantavat sen
    sisällön indeksiin — älä poista niitä.
  */
  const gated = withHero;
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const showResults = !gated || submitted;

  const [kwh, setKwh] = useState(initialKwh);
  /** Tosi heti kun kulutus on kirjoitettu käsin — ks. `kwhBlockEl`. */
  const [kwhTouched, setKwhTouched] = useState(false);
  const [dwelling, setDwelling] = useState<string | null>(
    /* Portin takana asumismuoto EI ole valmiiksi valittuna: valmiiksi
       täytetty ensimmäinen kysymys tekee kyselystä muodollisuuden, eikä
       tuloslistan luku ole silloin käyttäjän omaa. */
    gated ? null : DWELLINGS.find((d) => d.kwh === initialKwh)?.key ?? null
  );
  const [type, setType] = useState<"spot" | "fixed" | "open" | null>(initialType);
  const [greenOnly, setGreenOnly] = useState(false);
  const [sort, setSort] = useState<"cost" | "basic" | "rating">("cost");

  // Nykyinen sopimus (vapaaehtoinen) — tekee säästöluvusta todellisen
  const [showCurrent, setShowCurrent] = useState(false);
  const [curPrice, setCurPrice] = useState<string>("");
  const [curBasic, setCurBasic] = useState<string>("");

  /**
   * Suosittelija on oletuksena kiinni. Se ratkaisee asiakkaan vaikeimman
   * päätöksen, mutta suljettuna se ei ole enää kolmas päätös hintojen ja
   * käyttäjän välissä. Auki yhdellä klikillä sille, joka epäröi.
   */
  /** Mikä heron lupauksista on auki. Ks. perustelu HERO_CLAIMS-listan yllä. */
  const [openClaim, setOpenClaim] = useState<number | null>(null);
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [canShift, setCanShift] = useState<boolean | null>(null);
  const [wantsSteady, setWantsSteady] = useState<boolean | null>(null);

  const reduce = useReducedMotion();

  const currentAnnual = useMemo(() => {
    const p = parseFloat(curPrice.replace(",", "."));
    if (!p || p <= 0) return null;
    const b = parseFloat(curBasic.replace(",", ".")) || 0;
    return b * 12 + (p * kwh) / 100;
  }, [curPrice, curBasic, kwh]);

  const filtered = useMemo(
    () =>
      plans
        .filter((p) => (type ? p.type === type : true))
        .filter((p) => (greenOnly ? p.green : true))
        .sort((a, b) => {
          if (sort === "basic") return a.basicFee - b.basicFee;
          if (sort === "rating") return b.rating - a.rating;
          return annualCost(a, kwh) - annualCost(b, kwh);
        }),
    [plans, type, greenOnly, kwh, sort]
  );

  const cheapestCost = useMemo(() => Math.min(...plans.map((p) => annualCost(p, kwh))), [plans, kwh]);
  const maxShown = Math.max(...filtered.map((p) => annualCost(p, kwh)), 1);

  /*
    OTSIKKOLUKU SEURAA NÄKYVÄÄ LISTAA, EI KOKO AINEISTOA.

    "Kettu löysi X €/kk" laskettiin kaikista sopimuksista, myös niistä,
    jotka suodatin oli piilottanut. Niin kauan kuin suodatinta käytti
    harva, luku sattui yleensä osumaan listan ensimmäiseen korttiin.
    Kysely asettaa suosituksen nyt suodattimeksi automaattisesti, joten
    tilanne on tavallinen — ja silloin sivun suurin luku olisi hinta,
    jota ei näy yhdessäkään kortissa.

    Se on pahin mahdollinen virhe juuri tällä sivulla: koko lupaus on
    "näytämme laskutoimituksen", ja lukija, joka ei löydä otsikon
    euromäärää listasta, olettaa loputkin luvut sepitetyiksi. Tyhjällä
    listalla `Math.min` palauttaisi lisäksi Infinityn.

    `alreadyGood` käyttää edelleen KOKO aineiston halvinta: "älä vaihda"
    saa sanoa vain, jos asiakkaan sopimus voittaa kaikki sopimukset,
    ei vain sattumalta valittua tyyppiä.
  */
  const bestVisibleCost = useMemo(
    () => (filtered.length ? Math.min(...filtered.map((p) => annualCost(p, kwh))) : cheapestCost),
    [filtered, kwh, cheapestCost]
  );

  /** Halvin näkyvissä oleva sopimus. Sama olio kelpaa sekä merkin
   *  tunnistukseen että mobiilin tulospalkin kohteeksi. */
  const cheapestPlan = filtered.length > 0
    ? [...filtered].sort((a, b) => annualCost(a, kwh) - annualCost(b, kwh))[0]
    : null;
  const cheapestId = filtered.length > 1 ? cheapestPlan!.id : null;

  /** Ankkuri, jonka ohittaminen näyttää mobiilin tulospalkin. */
  const resultsRef = useRef<HTMLDivElement>(null);
  /** Tulososion yläreuna — tänne vieritetään heti kun kysely on täytetty. */
  const resultsTopRef = useRef<HTMLElement>(null);

  /*
    VIERITYS TULOKSIIN TEHDÄÄN EFEKTISSÄ, EI KLIKKIKÄSITTELIJÄSSÄ.

    Klikin hetkellä tulososiota ei ole vielä DOM:issa, joten
    `scrollIntoView` osuisi tyhjään. Efekti ajetaan vasta kun React on
    kirjoittanut osion sivulle.

    EI `requestAnimationFrame`-kääreitä. Selain pysäyttää rAF:n
    kokonaan, kun välilehti ei ole näkyvissä, ja jäädyttää sen myös
    taustalle jääneissä välilehdissä. Silloin kääreen sisällä oleva
    vieritys ei tapahtuisi koskaan, ja käyttäjä palaisi välilehdelle
    tilanteeseen, jossa hän on juuri painanut "Näytä sopimukset" mutta
    ruudulla on yhä lomake — eli näyttää siltä, ettei nappi toiminut.
    Efekti ajetaan DOM-muutosten jälkeen, joten kohde on jo mitattavissa
    ilman ylimääräistä ruutupäivitystä.
  */
  useEffect(() => {
    if (!submitted) return;
    resultsTopRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [submitted, reduce]);

  /*
    "Kettu laskee" -tila. Laukeaa aina kun jokin laskennan lähtöarvo
    muuttuu: kulutus, sopimustyyppi, vihreä suodatin tai järjestys.
    Ilman tätä hinnat vain vaihtuvat, eikä käyttäjä näe että työtä
    tehtiin — ja koko sloganin lupaus ("Kettu kilpailuttaa puolestasi")
    jää käyttöliittymässä lunastamatta. Ks. FoxComputing.tsx.
  */
  const computing = useFoxComputing(`${kwh}|${type}|${greenOnly}|${sort}`);

  /** Ketun valinta: hinta 72 %, käyttäjäarvio 28 %. Kaava kerrotaan avoimesti. */
  const foxId = useMemo(() => {
    if (filtered.length < 3) return null;
    const scored = filtered.map((p) => ({
      id: p.id,
      score: 0.72 * (cheapestCost / annualCost(p, kwh)) + 0.28 * (p.rating / 5),
    }));
    return scored.sort((a, b) => b.score - a.score)[0].id;
  }, [filtered, kwh, cheapestCost]);

  /** Rehellisyys ennen konversiota: jos asiakkaan oma sopimus voittaa, se sanotaan. */
  const alreadyGood = currentAnnual !== null && currentAnnual <= cheapestCost;
  /**
   * Säästö lasketaan VAIN asiakkaan omaan sopimukseen. Vertailu listan
   * kalleimpaan on vertailusivujen vanha temppu: se tuottaa ison oranssin
   * luvun jokaiseen korttiin riippumatta siitä, maksaako asiakas oikeasti
   * liikaa. Ennen kuin oma hinta on annettu, säästölukua ei näytetä
   * lainkaan — sen tilalla on kehotus syöttää oma hinta.
   */
  const savingsBase = currentAnnual;
  const savingsLabel = "vuodessa nykyiseen sopimukseesi verrattuna";
  const headlineSaving = useCountUp(savingsBase === null ? 0 : Math.max(0, savingsBase - bestVisibleCost));
  const cheapestMonthly = useCountUp(bestVisibleCost / 12);

  /** Suosituksen tulos — vain kun molempiin on vastattu. */
  const advice = canShift === null || wantsSteady === null
    ? null
    : wantsSteady && !canShift
      ? { type: "fixed" as const, title: "Kettu suosittelee kiinteää hintaa", why: "Haluat ennustettavan laskun etkä pysty siirtämään kulutusta halvoille tunneille — silloin hintasuoja on rahan arvoinen." }
      : canShift && !wantsSteady
        ? { type: "spot" as const, title: "Kettu suosittelee pörssisähköä", why: "Pystyt ajoittamaan kulutusta ja kestät vaihtelun. Pörssi on pitkällä aikavälillä ollut keskimäärin edullisempi, koska et maksa hintasuojasta." }
        : canShift && wantsSteady
          ? { type: "fixed" as const, title: "Kettu suosittelee kiinteää hintaa", why: "Pystyisit hyödyntämään halpoja tunteja, mutta arvostat ennustettavuutta enemmän. Kiinteä antaa mielenrauhan pienellä lisähinnalla." }
          : { type: "spot" as const, title: "Kettu suosittelee pörssisähköä", why: "Et kaipaa hintalukkoa etkä halua maksaa siitä. Katso silti, ettei talven piikki yllätä — laskurin arvio on vuosikeskiarvo." };

  /* ── Kyselyn palaset ────────────────────────────────────────────────
     Samat kentät esiintyvät kahdessa tilassa: portin takana yksi vaihe
     kerrallaan, ja tulosten näkyessä kaikki kerralla auki, jotta lukuja
     voi säätää ilman kyselyn uusimista. Siksi ne on nostettu omiksi
     paloikseen eikä kirjoitettu kahteen kertaan. */

  const dwellingBlock = (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
        {DWELLINGS.map((d) => {
          const Icon = DWELLING_ICONS[d.key as keyof typeof DWELLING_ICONS];
          const on = dwelling === d.key;
          return (
            <button
              key={d.key}
              onClick={() => { setDwelling(d.key); setKwh(d.kwh); }}
              aria-pressed={on}
              className={`group rounded-xl border px-3.5 py-3.5 text-left transition-all active:scale-[0.98] ${
                on
                  ? "border-accent bg-accentSoft"
                  : "border-line bg-mist hover:border-lineDark hover:bg-night"
              }`}
            >
              <Icon size={18} className={on ? "text-accentDark" : "text-ink/40"} aria-hidden />
              <p className={`mt-2 font-display text-[13.5px] font-bold leading-tight ${on ? "text-accentDark" : "text-ink"}`}>
                {d.label}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-ink/55">{d.hint}</p>
            </button>
          );
        })}
    </div>
  );

  /*
    HUOM. syöttökenttien 16 px: iOS Safari zoomaa sivun automaattisesti
    sisään, jos kosketettu kenttä on alle 16 px. Käyttäjä ei tiedä
    aiheuttaneensa sitä, joten hän nipistää ulospäin — ja päätyy pois
    sivun kohdalta. Juuri nämä kentät ovat sivun tärkein toiminto
    (niistä syntyy euromäärä), joten virhe osui pahimpaan mahdolliseen
    paikkaan. 15 → 16 px poistaa ilmiön kokonaan eikä näy silmällä.
  */
  /*
    `withHint` on epätosi kyselyssä. Vaiheen 2 oma alaotsikko sanoo jo
    "Luku löytyy sähkölaskusi erittelystä", ja tämä rivi toisti saman
    asian sadan pikselin päässä. Kaksi kertaa peräkkäin sanottu ohje
    lukee epävarmuutena — kuin palvelu pelkäisi, ettei käyttäjä
    ymmärtänyt ensimmäisellä kerralla. Tuloslistan puolella
    (`fullForm`) yläotsikkoa ei ole, joten siellä rivi jää.
  */
  const kwhBlockEl = (withHint: boolean) => (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <label htmlFor="kwh" className="font-display text-[13px] font-bold text-ink/80">
          Tarkka vuosikulutus
        </label>
        <div className="flex items-center gap-2">
          <input
            id="kwh"
            type="number"
            inputMode="numeric"
            min={500}
            max={40000}
            step={100}
            value={kwh}
            onChange={(e) => {
              setKwh(Math.max(0, Number(e.target.value)));
              setDwelling(null);
              /*
                KÄSIN SYÖTETTY LUKU ON PÄTEVÄ VASTAUS VAIHEESEEN 1.

                Kentän muokkaus nollaa asumismuodon, koska tarkka luku
                kumoaa arvion. Kyselyssä se johti ansaan: käyttäjä
                kirjoitti oman kulutuksensa, painoi "Takaisin"
                tarkistaakseen valintansa — ja vaihe 1 vaati taas
                valinnan, joka ylikirjoitti juuri syötetyn luvun
                oletusarvolla. Käyttäjän oma, tarkin mahdollinen tieto
                katosi napin painalluksesta. Tämä lippu pitää vaiheen 1
                hyväksyttynä, kun kulutus on annettu käsin.
              */
              setKwhTouched(true);
            }}
            className="w-28 rounded-xl border border-lineDark bg-mist px-3 py-2.5 text-right font-data text-[16px] font-bold text-ink transition-colors focus:border-accent focus:outline-none"
          />
          <span className="text-[13px] font-medium text-ink/60">kWh / v</span>
        </div>
        {withHint && (
          <span className="text-[12px] text-ink/55">Luku löytyy sähkölaskustasi.</span>
        )}
      </div>
  );

  /*
    Nykyinen sopimus: tekee säästöluvusta oman, ei markkinointiluvun.

    `alwaysOpen` on käytössä kyselyssä. Napin takana kentät täytti vain
    murto-osa, ja juuri nämä kaksi lukua ratkaisevat sivun tärkeimmän
    yksittäisen luvun: ilman niitä säästöä ei näytetä lainkaan (emme
    keksi sitä), eli suurin ostoperuste jää kokonaan piiloon. Kyselyssä
    kenttä on luonteva — käyttäjä on jo vastaamassa kysymyksiin — joten
    se on auki, mutta merkitty vapaaehtoiseksi ja ohitettavissa.
    Tuloslistan yhteydessä kenttä pysyy napin takana, koska siellä
    ruudulla on jo hinnat eikä kysymyksiä.
  */
  const currentBlockEl = (alwaysOpen: boolean) => (
      <div>
        {!showCurrent && !alwaysOpen ? (
          <button
            onClick={() => setShowCurrent(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 font-display text-[13px] font-semibold text-ink/85 transition-all hover:border-accent/50 hover:text-ink active:scale-[0.98]"
          >
            <Wallet size={15} className="text-ink/40" aria-hidden />
            Tiedän nykyisen hintani — laske todellinen säästö
          </button>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-display text-[13px] font-bold text-ink/85">
                <Wallet size={15} className="text-ink/40" aria-hidden />
                Nykyinen sopimuksesi
                {alwaysOpen && (
                  <span className="rounded-full border border-line bg-mist px-2 py-0.5 text-[11px] font-semibold text-ink/55">
                    vapaaehtoinen
                  </span>
                )}
              </p>
              {!alwaysOpen && (
                <button
                  onClick={() => { setShowCurrent(false); setCurPrice(""); setCurBasic(""); }}
                  className="inline-flex items-center gap-1 text-[12px] text-ink/60 hover:text-ink"
                >
                  <X size={13} aria-hidden /> Piilota
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="8,90"
                  value={curPrice}
                  onChange={(e) => setCurPrice(e.target.value)}
                  aria-label="Nykyinen energian hinta senttiä kilowattitunnilta"
                  className="w-24 rounded-xl border border-lineDark bg-mist px-3 py-2.5 text-right font-data text-[16px] font-bold text-ink placeholder:font-normal placeholder:text-ink/35 focus:border-accent focus:outline-none"
                />
                <span className="text-[13px] text-ink/60">c/kWh</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="4,50"
                  value={curBasic}
                  onChange={(e) => setCurBasic(e.target.value)}
                  aria-label="Nykyinen perusmaksu euroa kuukaudessa"
                  className="w-24 rounded-xl border border-lineDark bg-mist px-3 py-2.5 text-right font-data text-[16px] font-bold text-ink placeholder:font-normal placeholder:text-ink/35 focus:border-accent focus:outline-none"
                />
                <span className="text-[13px] text-ink/60">€/kk perusmaksu</span>
              </div>
            </div>
            <p className="mt-2 text-[12px] text-ink/55">
              Molemmat luvut näkyvät sähkölaskusi erittelyssä kohdassa &quot;sähköenergia&quot;.
              {alwaysOpen && " Voit myös jättää tyhjäksi — silloin emme näytä säästölukua lainkaan."}
            </p>
          </div>
        )}
      </div>
  );

  /*
    KYSELYN KOLMAS VAIHE ON SAMA KAKSI KYSYMYSTÄ KUIN SUOSITTELIJASSA.

    Ne olivat aiemmin tuloslistan yläpuolella suljettuna paneelina, jonka
    avasi vain se, joka jo tiesi epäröivänsä. Pörssi vai kiinteä on
    kuitenkin asiakkaan vaikein päätös, ja vastaamattomana se jää
    roikkumaan koko listan yli — silloin ei paineta mitään. Kyselyn
    vaiheena siihen vastaa lähes jokainen, ja vastaus tuottaa
    suosituksen, joka rajaa listan. Rajattu lista on lyhyempi ja
    lyhyemmästä listasta valitaan useammin.

    Ohitus on tarkoituksella näkyvissä: pakotettu vastaus arvataan, ja
    arvattu vastaus rajaisi listan väärin.
  */
  const prefBlock = (
    <div className="grid gap-4 sm:grid-cols-2">
      <Question
        label="Voitko ajoittaa kulutusta yölle tai halvoille tunneille?"
        value={canShift}
        onChange={setCanShift}
        yes="Kyllä, onnistuu"
        no="En käytännössä"
      />
      <Question
        label="Kumpi on sinulle tärkeämpää?"
        value={wantsSteady}
        onChange={setWantsSteady}
        yes="Ennustettava lasku"
        no="Pienin mahdollinen hinta"
      />
    </div>
  );

  const trustStrip = (
      /*
        LUOTTAMUSSINETTI — laskurin sisällä, ei sivun lopussa.

        MIKSI TÄSSÄ: epäröinti syntyy juuri siinä hetkessä, kun käyttäjä on
        naputtelemassa kulutustaan kenttään ja miettii "mitä tästä seuraa,
        kuka tähän tietoon pääsee käsiksi". Sivun alalaidan luottamusosio
        vastaa siihen kymmenen ruudullista myöhemmin, eli liian myöhään.
        Kilpailijoilla (esim. Verivox) sertifikaattisinetti on samasta
        syystä nimenomaan laskuripaneelin sisällä.

        MIKSI NÄMÄ KOLME VÄITETTÄ: jokainen on tarkistettavissa tältä
        sivulta käsin, eikä yksikään vaadi kolmannen osapuolen sertifikaattia,
        asiakasmääriä tai tähtiarvioita — niitä ei ole, eikä niitä keksitä.
        Keskimmäinen on samalla suurin ero lomakepohjaisiin
        kilpailutuspalveluihin: täällä ei jätetä yhteystietoja, joten
        vertailusta ei seuraa myyntipuheluita. Se on kohderyhmän (40–60 v.)
        yleisin syy jättää kilpailuttamatta.

        MIKSI TÄMÄ ON KYSELYN AIKANA ENTISTÄKIN TÄRKEÄMPI: portti pyytää
        nyt vastauksia ENNEN kuin mitään on näytetty. Se herättää juuri
        sen epäilyn, jonka kaikki lomakepohjaiset kilpailutuspalvelut
        ovat kohderyhmälle opettaneet: "tästä seuraa puhelinsoittoja".
        Keskimmäinen rivi vastaa siihen samassa ruudussa kuin kysymykset.
      */
      <div className="-mx-5 -mb-5 mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line bg-mist px-5 py-3 sm:-mx-7 sm:-mb-7 sm:px-7">
        <span className="flex items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-goldInk">
          <FoxPaw /> Ketun lupaus
        </span>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {[
            "Ilmainen sinulle",
            "Ei tunnuksia, ei yhteystietoja",
            "Laskukaava julkinen",
          ].map((t) => (
            <li key={t} className="flex items-center gap-1.5 text-[12px] font-medium text-ink/70">
              <ShieldCheck size={13} className="shrink-0 text-accentDark" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </div>
  );

  /* ── Kyselyn ohjaus ─────────────────────────────────────────────────── */

  const STEPS_Q = [
    { n: 1, title: "Millaisessa asunnossa asut?", hint: "Arvio riittää — tarkennat kulutuksen seuraavaksi." },
    { n: 2, title: "Paljonko käytät sähköä vuodessa?", hint: "Luku löytyy sähkölaskusi erittelystä." },
    { n: 3, title: "Mikä on sinulle tärkeintä?", hint: "Kaksi kysymystä, joilla Kettu rajaa listan." },
  ] as const;

  const stepValid =
    step === 1 ? dwelling !== null || kwhTouched : step === 2 ? kwh >= 500 : true;
  const activeStep = STEPS_Q[step - 1];

  const submitQuiz = () => {
    setSubmitted(true);
    /* Jos kyselyssä syötettiin nykyinen hinta, kenttä jää auki myös
       tuloksissa. Muuten säästöluku näkyisi ruudulla ilman että sen
       lähtöarvo olisi missään näkyvissä — eli tarkistamattomana. */
    if (curPrice.trim() !== "") setShowCurrent(true);
    /* Jos suositukseen vastattiin, se avataan valmiiksi tuloksissa —
       muuten vastaus katoaisi eikä käyttäjä näkisi mitä siitä seurasi. */
    if (canShift !== null && wantsSteady !== null) {
      setShowAdvisor(true);
      setType(advice!.type);
    }
  };

  /** Kysely: yksi vaihe kerrallaan, portin takana. */
  const wizard = (
    <>
      {/*
        JÄTTINUMERO ON VAIHEEN ANKKURI.

        Vaihenumero oli aiemmin 11 px versaali harmaalla ("Askel 1 / 2"),
        eli tismalleen se elementti, jonka silmä ohittaa. Portin takana
        vaihe on kuitenkin tärkein yksittäinen tieto ruudulla: se kertoo
        että kysymyksiä on kolme eikä kolmekymmentä. Se on suora syy
        siihen, aloittaako käyttäjä täyttämisen vai vierittääkö ohi.

        Numero on haalea (`text-accent/[0.14]`) ja `aria-hidden`:
        ruudunlukija saa saman tiedon viereisestä tekstistä, ja silmälle
        riittää iso muoto — täysvahva oranssi numero kilpailisi
        "Näytä sopimukset" -napin kanssa, ja se on väärä voittaja.
      */}
      <div className="relative overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 right-0 select-none font-hero text-[92px] leading-none text-accent/[0.14] sm:text-[112px]"
        >
          {step}
        </span>

        <div className="relative">
          <p className="flex items-center gap-2.5 font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-accentDark">
            Ketun kysely · vaihe {step} / 3
            <BrushRule className="text-accent/70" width={40} />
          </p>
          <p className="mt-2 font-display text-[19px] font-bold leading-snug text-ink sm:text-[21px]">
            {activeStep.title}
          </p>
          <p className="mt-1 text-[13px] text-ink/65">{activeStep.hint}</p>

          {/* Edistymispalkki. Kolme palaa, ei liukuva viiva: paloista
              näkee yhdellä silmäyksellä montako on jäljellä. */}
          <div className="mt-4 flex gap-1.5">
            {STEPS_Q.map((s) => (
              <span
                key={s.n}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s.n <= step ? "bg-accent" : "bg-line"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        {step === 1 && dwellingBlock}
        {step === 2 && (
          <div className="space-y-4">
            {kwhBlockEl(false)}
            <div className="border-t border-line pt-4">{currentBlockEl(true)}</div>
          </div>
        )}
        {step === 3 && prefBlock}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-3 font-display text-[13.5px] font-semibold text-ink/75 transition-colors hover:border-lineDark hover:text-ink"
          >
            <ArrowLeft size={15} aria-hidden /> Takaisin
          </button>
        )}

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!stepValid}
            className="btn-ember inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-[15px] font-bold text-onEmber transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none"
          >
            Jatka <ArrowRight size={16} aria-hidden />
          </button>
        ) : (
          <button
            onClick={submitQuiz}
            className="btn-ember inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-display text-[15.5px] font-bold text-onEmber transition-all active:scale-[0.98] sm:flex-none"
          >
            Näytä sopimukset <ArrowRight size={16} aria-hidden />
          </button>
        )}

        {step === 3 && (
          <button
            onClick={() => { setCanShift(null); setWantsSteady(null); setSubmitted(true); }}
            /*
              `basis-full` kapealla ruudulla: kolme elementtiä samalla
              rivillä puristi "Näytä sopimukset" -napin kahdelle
              riville jo 500 px:ssä. Sivun tärkein nappi ei saa olla se,
              joka joustaa, kun tilaa on vähän — ohituslinkki saa oman
              rivinsä, ja nappi säilyttää täyden leveytensä.
            */
            className="basis-full text-center text-[13px] font-medium text-ink/60 underline underline-offset-4 hover:text-ink sm:basis-auto sm:text-left"
          >
            Ohita ja näytä kaikki
          </button>
        )}

        {step === 1 && !stepValid && (
          <span className="basis-full text-[12.5px] text-ink/55 sm:basis-auto">
            Valitse yksi vaihtoehto jatkaaksesi.
          </span>
        )}
      </div>
    </>
  );

  /** Kaikki kentät auki — käytössä tulosten näkyessä ja aihesivuilla. */
  const fullForm = (
    <>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-[15.5px] font-bold text-ink">Millaisessa asunnossa asut?</p>
        <span className="hidden font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45 sm:block">
          Säädä lukuja — tulokset päivittyvät
        </span>
      </div>
      <div className="mt-4">{dwellingBlock}</div>
      <div className="mt-4 border-t border-line pt-4">{kwhBlockEl(true)}</div>
      <div className="mt-4 border-t border-line pt-4">{currentBlockEl(false)}</div>
    </>
  );

  const estimator = (dark: boolean) => (
    <div
      className={
        dark
          ? "rounded-2xl border border-line bg-white p-5 shadow-lift sm:rounded-[20px] sm:p-7"
          : "rounded-2xl border border-line bg-white p-5 shadow-card sm:rounded-[20px] sm:p-7"
      }
    >
      {gated && !submitted ? wizard : fullForm}
      {trustStrip}
    </div>
  );

  return (
    <>
      {withHero && (
        <>
        {/*
          Hero on tarkoituksella matala: laskurin pitää näkyä ilman
          vieritystä myös 900 px korkealla näytöllä (CRO-sääntö 1 —
          työkalu ennen myyntipuhetta). Älä kasvata pystypaddingeja
          tai otsikon kokoa tarkistamatta taitetta uudelleen.
        */}
        {/*
          HERO ON ORANSSI VYÖ.

          Tumma hero kokeiltiin ja hylättiin: se hehkui kokonaisuudessaan,
          jolloin oranssi nappi lakkasi olemasta ruudun kuumin piste eikä
          katse pysähtynyt mihinkään. Vaalea hero taas katosi vaaleaan
          sivuun. Täyteen brändiväriin maalattu vyö ratkaisee molemmat:
          se on suurin mahdollinen väripinta-ala, se lukkoaa katseen
          välittömästi, ja se erottuu jyrkästi sen alla alkavasta
          luonnonvalkoisesta sisältöalueesta.

          Pohja on maskottia tummempi (ks. `.theme-ember` globals.css:ssä),
          jotta kettu on vyön vaalein kohta eikä sulaudu siihen.
        */}
        <section className="theme-ember ember-surface relative overflow-hidden pb-28 pt-9 md:pb-28 md:pt-12">
          <div className="relative z-[1] mx-auto max-w-[1180px] px-5 sm:px-6">
            <div className="grid items-center gap-6 md:grid-cols-[1.08fr_0.92fr] md:gap-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-accentDark">
                    Ketuttaako maksaa liikaa?
                  </span>
                  <BrushRule className="text-accent/70" width={64} />
                </div>

                {/*
                  Otsikko on antiikvaa ja normaalipainoista tarkoituksella.
                  Kun otsikko ei ole lihava, sivun painavin elementti on
                  oranssi nappi — ja katse menee sinne, mistä palkkio tulee.
                  Kursivoitu "laskemalla" on sivun ainoa koristeellinen ele.
                */}
                <h1 className="mt-4 max-w-[13ch] font-hero text-[2.5rem] leading-[1.03] text-cream sm:max-w-[14ch] sm:text-[3.3rem] md:text-[3.75rem]">
                  Halvin sähkö löytyy{" "}
                  {/* Korostus on lämmintä kultaa, ei toista oranssia:
                      oranssilla pohjalla oranssi korostus ei erotu. */}
                  <em className="text-goldInk">laskemalla</em>, ei
                  arvaamalla.
                </h1>

                <p className="mt-5 max-w-[46ch] text-[15.5px] leading-relaxed text-ink/85 sm:text-[16.5px]">
                  Kerro kulutuksesi, niin laskemme jokaisen sopimuksen todellisen
                  vuosihinnan — ja kerromme euroina, paljonko vaihtaminen tuo takaisin.
                </p>

                {/*
                  Mobiilissa Kettu ja luottamusrivi vierekkäin, jotta CTA mahtuu
                  alle. `items-start`, koska Kettu on lähes kaksi kertaa listan
                  korkuinen: `items-end` pudotti listan alas ja jätti ingressin
                  alle ison tyhjän aukon, jolloin teksti näytti katkeavan.
                  Negatiivinen alamarginaali antaa Ketun roikkua CTA-rivin
                  suuntaan, ettei kuva kasvata osiota turhaan.
                */}
                <div className="mt-6 flex items-start gap-3">
                  {/*
                    LUPAUKSET, JOTKA VOI AVATA.

                    Aiemmin nämä kolme olivat pelkkää tekstiä. Kolme perustelematonta
                    lupausta näyttää samalta kuin minkä tahansa myyntisivun luvut,
                    ja epäluuloinen lukija ohittaa ne — pahimmillaan ne heikentävät
                    luottamusta sen sijaan että kasvattaisivat sitä.

                    Kun jokaisen perässä on ⓘ, joka avaa perustelun, väitteestä
                    tulee tarkistettava. Se on koko sivun idea pienoiskoossa: kettu
                    näyttää laskutoimituksensa. Erityisen tärkeä on keskimmäisen
                    perustelu, joka kertoo poikkeuksen (määräaikaisen purku voi
                    maksaa) — myönnetty poikkeus ostaa uskottavuutta kaikelle
                    muulle sivulla sanotulle. Kohderyhmä on 40–60-vuotiaat, jotka
                    ovat nähneet tarpeeksi liian hyviä lupauksia.

                    Toteutus on painallus eikä hover, koska puolet kävijöistä on
                    mobiilissa eikä hoveria ole olemassa.
                  */}
                  <ul className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
                    {HERO_CLAIMS.map((t, i) => {
                      const open = openClaim === i;
                      return (
                        <li key={t.text}>
                          <button
                            onClick={() => setOpenClaim(open ? null : i)}
                            aria-expanded={open}
                            /*
                              Lupaukset ovat nyt reunustettuja pillereitä.
                              Pelkkänä tekstirivinä ne lukivat luettelona,
                              jonka silmä ohittaa; reunus tekee niistä
                              kosketeltavia, ja juuri se saa lukijan
                              avaamaan perustelun. Avattu perustelu on
                              sivun uskottavin hetki, joten sen avaamisen
                              todennäköisyys on suoraan tuottoa.
                            */
                            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-left text-[13.5px] font-semibold transition-colors ${
                              open
                                ? "border-goldInk/70 bg-cream/15 text-cream"
                                : "border-line/60 text-ink/85 hover:border-line hover:bg-cream/10 hover:text-cream"
                            }`}
                          >
                            <t.icon size={15} className={`shrink-0 ${open ? "text-goldInk" : "text-ink/65"}`} aria-hidden />
                            {t.text}
                            <Info size={12} className={`shrink-0 ${open ? "text-goldInk" : "text-ink/55"}`} aria-hidden />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="halo-glow relative -mb-10 -mt-3 shrink-0 md:hidden">
                    <Image
                      src="/kettu-osoittaa.webp"
                      alt="Kettu, Kettukilpailutuksen maskotti"
                      width={416}
                      height={1000}
                      priority
                      className="relative h-[152px] w-auto drop-shadow-[0_14px_24px_rgba(80,28,2,0.38)]"
                    />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {openClaim !== null && (
                    <motion.div
                      key={openClaim}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 max-w-[52ch] rounded-r-lg border-l-[3px] border-goldInk bg-cream/12 py-2.5 pl-3.5 pr-3 text-[13px] leading-relaxed text-ink/90">
                        {HERO_CLAIMS[openClaim].why}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/*
                  Mobiilissa herossa ei ollut lainkaan näkyvää toimintakehotusta.
                  Nappi on koko leveydeltä, koska peukalo osuu siihen varmasti.
                */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <a
                    href="#vertailu"
                    className="btn-ember inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-[15.5px] font-bold text-onEmber md:hidden"
                  >
                    Aloita kysely – kolme kysymystä
                    <TrendingDown size={16} aria-hidden />
                  </a>
                  <p className="text-[12.5px] text-ink/75">
                    Ilmainen ja puolueeton · ei vaadi tunnuksia
                  </p>
                </div>
              </div>

              {/*
                Oikea palsta: Kettu ja reaaliaikainen pörssihinta vierekkäin.
                Elävä luku maskotin vieressä sitoo brändin ja tosiasian yhteen
                — hupaisa kettu, ammattimainen data. Mobiilissa Kettu on jo
                ingressin vieressä, joten tässä on vain hintalaatikko.

                MIKSI EI ABSOLUUTTISTA ASETTELUA: hintalaatikko oli aiemmin
                `absolute` Ketun päällä ja leikkasi maskotin rinnasta poikki.
                Puoliksi laatikon taakse jäävä maskotti näyttää rikkinäiseltä,
                ei kerrokselliselta — ja rikkinäinen hero on suoraan pois
                klikeistä. Nyt palsta on tavallinen flex-rivi: elementit eivät
                voi mennä päällekkäin millään näytön leveydellä.
              */}
              <div className="mx-auto flex w-full max-w-[420px] flex-col md:max-w-none md:flex-row md:items-end md:justify-end md:gap-4">
                <SpotPriceLive className="order-2 mt-6 md:order-1 md:mb-1 md:mt-0 md:w-[19rem] md:shrink-0" />

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  className="halo-glow order-1 hidden shrink-0 md:order-2 md:flex"
                >
                  {/*
                    Poosi "osoittaa", ei "kortti": sähkösivulla maskotti ei voi
                    pidellä luottokorttia — se kertoo väärästä vertikaalista.

                    HEHKU ON KERMAA, EI ORANSSIA. Aiemmin maskotin takana
                    oli oranssi `ember-glow`. Oranssilla vyöllä se ei tee
                    mitään — hehku on samaa väriä kuin pohja. `halo-glow`
                    on kermanvaalea, eli kettu irtoaa vyöstä valoarvolla.
                    Varjo on tummanruskea samasta syystä: musta varjo
                    oranssilla lukisi likana.
                  */}
                  <Image
                    src="/kettu-osoittaa.webp"
                    alt="Kettu, Kettukilpailutuksen maskotti"
                    width={416}
                    height={1000}
                    priority
                    className="relative h-[400px] w-auto drop-shadow-[0_26px_44px_rgba(80,28,2,0.5)] lg:h-[430px]"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          <SpotCurve className="pointer-events-none absolute inset-x-0 bottom-0 opacity-40" />

          {/* Oranssi vyö kaartuu vaaleaan vertailuun ketunhännän muotoisena.
              `theme-light` kääreessä, jotta `--c-paper` ratkeaa alapuolisen
              vyöhykkeen vaaleaksi eikä tämän osion oranssiksi. */}
          <div className="theme-light">
            <TailSweep fill="rgb(var(--c-paper))" height={64} />
          </div>
        </section>

        {/*
          Laskuri on puhtaan valkoinen kortti TUMMAN heron päällä, ja se
          istuu tarkoituksella vyöhykkeiden rajan päällä.

          MIKSI NÄIN: tämä on koko sivun vahvin ankkuri. Kirkas kortti
          tummaa vasten on suurin valoarvoero, mitä sivulla on, joten katse
          osuu työkaluun ennen kuin se ehtii lukea otsikkoa — ja työkalun
          käyttö on ainoa polku palkkioklikkiin. Sama laite on käytössä
          sahkon-kilpailutus.fi:llä (valkoinen logokortti tumman heron
          rajalla), ja se on heidän sivunsa toimivin yksittäinen elementti:
          rajan päälle asetettu kortti sitoo kaksi vyöhykettä yhteen sen
          sijaan että ne näyttäisivät kahdelta eri sivulta.

          `theme-light` tekee kortista vaalean saarekkeen tummalla sivulla.
          Ulompi `bg-paper`-kääre kantaa vaalean taustan siitä eteenpäin;
          `pt-px` estää negatiivista marginaalia romahtamasta kääreen läpi,
          jolloin kortti nousee heron päälle mutta tausta pysyy paikallaan.
        */}
        <div className="theme-light bg-paper pt-px">
          <div
            id="vertailu"
            className="relative z-20 mx-auto -mt-20 max-w-[1180px] scroll-mt-24 px-4 sm:px-6 md:-mt-24"
          >
            {estimator(true)}
          </div>
        </div>
        </>
      )}

      {!withHero && (
        <div id="vertailu" className="mx-auto max-w-[1180px] scroll-mt-24 px-4 sm:px-6">
          {heading && <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{heading}</h2>}
          {intro && <p className="mt-2 max-w-2xl text-ink/70">{intro}</p>}
          <div className={heading ? "mt-5" : ""}>{estimator(false)}</div>
        </div>
      )}

      {/*
        PORTIN TAKANA: MITÄ RUUDULLA ON, KUN SOPIMUKSIA EI VIELÄ NÄYTETÄ.

        Tyhjä väli kyselyn alla olisi pahin mahdollinen ratkaisu: käyttäjä
        näkisi lomakkeen ja sen alla ei-mitään, eikä hänellä olisi yhtään
        syytä täyttää sitä. Tähän tulee siis vastaus kysymykseen "miksi
        vastaan näihin" — leimoina, koska leiman muoto luetaan takuuksi
        ennen kuin tekstiä ehditään lukea (ks. FoxRosette.tsx).

        Jokainen leima on oma tarkistettava väitteemme, ei kenenkään
        myöntämä sertifikaatti. Keskimmäinen on tässä kohtaa tärkein: se
        on ainoa asia, joka erottaa tämän lomakkeen niistä
        kilpailutuslomakkeista, joihin kohderyhmä on oppinut olemaan
        koskematta.
      */}
      {!showResults && (
        <section className="theme-light bg-paper pt-14">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <div className="pelt-surface overflow-hidden rounded-3xl border border-gold/30 px-6 py-10 sm:px-10">
              <div className="relative z-[1] flex flex-col items-center gap-9 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-md text-center lg:text-left">
                  <p className="flex items-center justify-center gap-2.5 font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-accentDark lg:justify-start">
                    <Lock size={13} aria-hidden /> Sopimukset avautuvat vastausten jälkeen
                  </p>
                  <p className="mt-3 font-hero text-[1.7rem] leading-[1.12] text-ink sm:text-[2rem]">
                    Kettu ei näytä hintataulukkoa. Se näyttää sinun hintasi.
                  </p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink/75">
                    Kolme kysymystä, noin puoli minuuttia. Sen jälkeen jokainen
                    ruudulla näkyvä euromäärä on laskettu sinun kulutuksellasi —
                    eikä yhtään yhteystietoa ole kysytty.
                  </p>
                  <p className="mt-4 font-data text-[13px] font-semibold text-goldInk">
                    {plans.length} sopimusta odottaa vertailua
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-5 sm:gap-x-7">
                  <FoxRosette label="Ilmainen" sub="aina · ei tilejä" tilt={-7} />
                  <FoxRosette label="Ei yhteystietoja" sub="ei myyntipuheluita" size={122} tilt={4} />
                  <FoxRosette label="Kaava auki" sub="hinta 72 % · arvio 28 %" tilt={-4} />
                  <FoxSlot id="laskuri" height={170} className="hidden shrink-0 xl:block" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {showResults && (
      <section ref={resultsTopRef} className={`theme-light scroll-mt-20 bg-paper ${withHero ? "pt-14" : "pt-10"}`}>
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          {/* Tulos */}
          <div className="flex flex-wrap items-end justify-between gap-6 rounded-2xl border border-line bg-white px-5 py-6 shadow-card sm:rounded-[20px] sm:px-8 sm:py-7">
            <div>
              {/*
                OVELA TEKSTILINJA. Tässä luki aiemmin "Askel 2 / 2 · tuloksesi"
                ja "Edullisin sopimus". Molemmat ovat totta mutta persoonattomia:
                ne kuulostavat siltä, että taulukko lajitteli itsensä.

                Kun sama asia sanotaan Ketun tekemänä työnä ("Kettu löysi",
                "Kettu nuuski läpi kuusi sopimusta"), lupaus ja tuote menevät
                vihdoin yksiin — slogan lupaa, että Kettu kilpailuttaa
                käyttäjän puolesta, ja nyt käyttöliittymä näyttää hänen
                tekevän sen. Tämä on koko sivuston halvin kettuisuuden lähde:
                se ei maksa yhtään pikseliä eikä latausaikaa.

                Luku on yhä sama laskettu luku; vain tekijä on nimetty.
              */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="flex items-center gap-2 font-display text-[11.5px] font-bold uppercase tracking-[0.16em] text-accentDark">
                  <TrendingDown size={14} aria-hidden /> Ketun löytö sinun luvuillasi
                </p>
                <FoxComputing show={computing} />
              </div>
              <p className="mt-3 font-hero text-[2rem] leading-[1.1] text-ink sm:text-[2.5rem]">
                Kettu löysi{" "}
                <span className="font-display font-data font-price font-extrabold tracking-tight text-accent">
                  {/* Sama tarkkuus kuin korteissa — ks. perustelu PlanCard.tsx */}
                  {cheapestMonthly.toLocaleString("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} €
                </span>
                /kk
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-ink/60">
                <PawTrail count={3} size={9} className="text-accent/55" />
                Nuuski läpi {plans.length} sopimusta {kwh.toLocaleString("fi-FI")} kWh kulutuksellasi
              </p>
            </div>
            {alreadyGood ? (
              /*
                SIVUN TÄRKEIN LUOTTAMUSHETKI. Tässä palvelu sanoo "älä osta"
                — eli luopuu omasta palkkiostaan. Juuri siksi tämä on ainoa
                paikka, jossa käyttäjä oikeasti uskoo kaiken muunkin sivulla
                sanotun. Kettu tulee mukaan kämmen ylöspäin: kuva tekee
                kieltäytymisestä lupauksen sijaan luonteenpiirteen, ja se on
                se asia, jonka takia käyttäjä palaa ensi vuonna takaisin.
              */
              <div className="pelt-surface flex w-full max-w-md items-center gap-5 rounded-2xl border border-gold/35 px-6 py-5 shadow-card sm:rounded-[20px]">
                <FoxSlot id="alaVaihda" height={150} className="hidden shrink-0 sm:block" />
                <div>
                  <p className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-goldInk">
                    <ShieldCheck size={14} aria-hidden /> Ketun rehellinen vastaus
                  </p>
                  <p className="mt-2 font-display text-[16px] font-bold leading-snug text-ink">
                    Nykyinen sopimuksesi on jo edullisempi kuin yksikään vertailun sopimus.
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink/70">
                    Älä vaihda nyt. Tarkista tilanne uudelleen, kun sopimuksesi lähestyy loppuaan.
                  </p>
                </div>
              </div>
            ) : currentAnnual ? (
              <div className="pelt-surface w-full rounded-2xl border border-gold/35 px-6 py-5 shadow-card sm:w-auto sm:rounded-[20px] sm:text-right">
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-goldInk">
                  Säästö nykyiseen sopimukseesi
                </p>
                <p className="mt-1.5 font-display text-[2.4rem] font-extrabold leading-none tracking-tight text-ink">
                  <span className="font-data">
                    {headlineSaving.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} €
                  </span>
                  <span className="ml-1 text-[15px] font-semibold text-ink/65">/ vuosi</span>
                </p>
              </div>
            ) : (
              /* Ei omaa hintaa vielä — kehotus, ei keksitty säästöluku. */
              <div className="pelt-surface w-full max-w-sm rounded-2xl border border-gold/35 px-6 py-5 shadow-card sm:rounded-[20px]">
                <p className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-goldInk">
                  <Wallet size={14} aria-hidden /> Säästösi euroina
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink/80">
                  Emme arvaa säästöäsi. Syötä nykyinen hintasi, niin näet todellisen
                  eron omaan sopimukseesi — myös silloin, jos vaihtaminen ei kannata.
                </p>
                <button
                  onClick={() => {
                    setShowCurrent(true);
                    document.getElementById("vertailu")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
                  }}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-2 font-display text-[13px] font-bold text-goldInk transition-colors hover:bg-gold/15"
                >
                  Syötä nykyinen hintani
                </button>
              </div>
            )}
          </div>

          {/* Suosittelija: kiinni oletuksena, auki yhdellä klikillä */}
          {!showAdvisor ? (
            <button
              onClick={() => setShowAdvisor(true)}
              className="mt-4 flex w-full items-center gap-4 rounded-3xl border border-line bg-white p-4 text-left transition-all hover:border-accent/40 hover:shadow-cardHover active:scale-[0.995] sm:p-5"
            >
              <Image
                src="/kettu-naama.webp"
                alt=""
                width={852}
                height={935}
                className="h-12 w-12 shrink-0 object-contain"
              />
              <span className="flex-1">
                <span className="block font-display text-[15px] font-bold text-ink">
                  Epäröitkö, kumpi sopii: pörssisähkö vai kiinteä?
                </span>
                <span className="mt-0.5 block text-[13px] text-ink/70">
                  Vastaa kahteen kysymykseen, niin Kettu suosittelee ja rajaa listan.
                </span>
              </span>
              <span className="shrink-0 font-display text-[13.5px] font-bold text-accentDark">Avaa</span>
            </button>
          ) : (
          <div className="mt-4 rounded-3xl border border-line bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-[15px] font-bold text-ink">
                Epäröitkö, kumpi sopii: pörssisähkö vai kiinteä hinta?
              </p>
              <button
                onClick={() => setShowAdvisor(false)}
                className="inline-flex shrink-0 items-center gap-1 text-[12px] text-ink/60 hover:text-ink"
              >
                <X size={13} aria-hidden /> Sulje
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Question
                label="Voitko ajoittaa kulutusta yölle tai halvoille tunneille?"
                value={canShift}
                onChange={setCanShift}
                yes="Kyllä, onnistuu"
                no="En käytännössä"
              />
              <Question
                label="Kumpi on sinulle tärkeämpää?"
                value={wantsSteady}
                onChange={setWantsSteady}
                yes="Ennustettava lasku"
                no="Pienin mahdollinen hinta"
              />
            </div>

            <AnimatePresence>
              {advice && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduce ? undefined : { opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/25 bg-gold/[0.08] p-4">
                    <div>
                      <p className="font-display text-[14.5px] font-bold text-goldInk">{advice.title}</p>
                      <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-ink/80">{advice.why}</p>
                    </div>
                    {/*
                      Kysely asettaa suosituksen suodattimeksi jo
                      lähetyshetkellä, joten tässä napissa luki
                      lähes aina "näytä nämä" silloin kun ne olivat
                      jo näkyvissä — nappi, joka ei tee mitään, syö
                      luottamusta koko osiosta. Nyt se vaihtaa
                      suuntaa sen mukaan, onko rajaus päällä, eli
                      käyttäjä pääsee myös purkamaan sen.
                    */}
                    <button
                      onClick={() => setType(type === advice.type ? null : advice.type)}
                      className="btn-ember shrink-0 rounded-xl px-5 py-2.5 font-display text-[13.5px] font-bold text-onEmber transition-all active:scale-[0.98]"
                    >
                      {type === advice.type ? "Näytä myös muut sopimukset" : "Näytä nämä sopimukset"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          )}

          {/* Suodattimet */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <div className="scrollbar-none -mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1">
              {TYPE_TABS.map((t) => {
                const on = type === t.key;
                return (
                  <button
                    key={t.label}
                    onClick={() => setType(t.key as typeof type)}
                    aria-pressed={on}
                    className={`shrink-0 rounded-xl px-4 py-2.5 font-display text-[13.5px] font-semibold transition-all active:scale-[0.97] ${
                      /*
                        Aktiivinen suodatin on TUMMA, ei oranssi. Oranssi
                        laatta suodatinrivissä kilpaili "Tee sopimus"
                        -napin kanssa samasta katseesta aivan sen
                        yläpuolella, vaikka suodatin ei tuota palkkiota.
                        Tumma erottuu yhtä selvästi ja jättää oranssin
                        yksin sinne, mistä raha tulee.
                      */
                      on ? "bg-ink text-paper shadow-card" : "border border-line bg-white text-ink/70 hover:border-lineDark hover:text-ink"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setGreenOnly(!greenOnly)}
              aria-pressed={greenOnly}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2.5 font-display text-[13.5px] font-semibold transition-all active:scale-[0.97] ${
                greenOnly ? "border-accent bg-accentSoft text-accentDark" : "border-line bg-white text-ink/70 hover:border-lineDark"
              }`}
            >
              <Leaf size={14} aria-hidden /> Vain uusiutuva
            </button>
          </div>

          {/*
            Tuloslistan ankkuri. Aiemmin tässä luki vain "6 sopimusta"
            harmaalla — lista alkoi ilman mitään, mihin silmä olisi
            tarttunut, ja suodattimien jälkeen oli epäselvää, mistä tulokset
            alkavat. Sama kolmiosainen ele kuin muissa osioissa (oranssi
            yläotsikko + ketunhäntä) merkitsee rajan, ja lukumäärä nousee
            omaksi väitteekseen: se kertoo, että vertailu oikeasti laskettiin
            juuri annetuilla luvuilla.
          */}
          <div
            ref={resultsRef}
            className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-5"
          >
            <div>
              <p className="flex items-center gap-2.5 font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-accentDark">
                Tulokset kulutuksellasi
                <BrushRule className="text-accent/70" width={44} />
              </p>
              <p className="mt-1.5 font-display text-[17px] font-bold text-ink" aria-live="polite">
                {filtered.length} sopimusta järjestyksessä
              </p>
            </div>
            <label className="flex items-center gap-2 text-[13px] text-ink/70">
              Järjestä
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                /* 16 px: alle sen iOS zoomaa sivun sisään heti kun valikkoa
                   kosketetaan, ja käyttäjä jää zoomatulle sivulle. */
                className="rounded-xl border border-line bg-white px-3 py-2 font-display text-[16px] font-semibold text-ink transition-colors hover:border-lineDark focus:border-accent focus:outline-none"
              >
                <option value="cost">Edullisin vuosihinta</option>
                <option value="basic">Pienin perusmaksu</option>
                <option value="rating">Paras arvio</option>
              </select>
            </label>
          </div>

          <LayoutGroup>
            <motion.div layout={!reduce} className="mt-4 grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((plan, i) => {
                  const cost = annualCost(plan, kwh);
                  const isCheapest = plan.id === cheapestId;
                  const isFox = plan.id === foxId;
                  const badge: PlanBadge = isCheapest
                    ? { kind: "cheapest", note: isFox ? "Myös Ketun valinta: paras hinnan ja käyttäjäarvion yhdistelmä." : undefined }
                    : isFox
                      ? { kind: "fox", note: "Ei halvin, mutta paras kokonaisuus hinnan ja käyttäjäarvion perusteella." }
                      : null;
                  return (
                    <motion.div
                      key={plan.id}
                      layout={!reduce}
                      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    >
                      <PlanCard
                        plan={plan}
                        kwh={kwh}
                        badge={sort === "cost" ? badge : null}
                        savings={savingsBase === null ? 0 : Math.max(0, savingsBase - cost)}
                        savingsLabel={savingsLabel}
                        maxCost={maxShown}
                        rank={i + 1}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {filtered.length === 0 && (
            /*
              TYHJÄ TULOS ON POISTUMISKOHTA. Käyttäjä on juuri rajannut
              listan tyhjäksi, eikä ruudulla ole mitään mihin klikata —
              se on sivun todennäköisin poistumishetki heti ennen "Tee
              sopimus" -nappia. Siksi tähän tulee Kettu etsimässä: kuva
              kertoo että haku oli tosissaan tehty eikä sivu ole rikki,
              ja katse ohjautuu vieressä olevaan nollausnappiin.
            */
            <div className="mt-4 flex flex-col items-center gap-8 rounded-3xl border border-dashed border-line bg-white p-12 text-center sm:flex-row sm:justify-center sm:text-left">
              <FoxSlot id="tyhja" height={168} className="shrink-0" />
              <div>
                <p className="font-display text-lg font-bold text-ink">
                  Näillä rajauksilla ei löydy sopimuksia
                </p>
                <p className="mt-1.5 max-w-sm text-[14.5px] text-ink/70">
                  Poista uusiutuva-rajaus tai valitse toinen sopimustyyppi.
                </p>
                <button
                  onClick={() => { setType(null); setGreenOnly(false); }}
                  className="btn-ember mt-5 rounded-xl px-6 py-3 font-display text-[14px] font-bold text-onEmber transition-all active:scale-[0.98]"
                >
                  Näytä kaikki sopimukset
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 flex items-start gap-2 text-[12px] leading-relaxed text-ink/60">
            <Info size={13} className="mt-0.5 shrink-0" aria-hidden />
            <span>
              Pörssisopimusten arviot laskettu {ASSUMED_SPOT_AVG.toLocaleString("fi-FI")} c/kWh
              keskihinnalla; toteutunut hinta vaihtelee tunneittain. Hinnat tarkistettu{" "}
              {new Date(PRICE_DATE).toLocaleDateString("fi-FI")}. Arviot eivät sisällä
              siirtomaksua, joka on sama sopimuksesta riippumatta.
            </span>
          </p>
        </div>
      </section>
      )}

      {showResults && <EnergyStickyBar plan={cheapestPlan} kwh={kwh} anchor={resultsRef} />}
    </>
  );
}

/** Kahden vaihtoehdon kysymys suosittelijaan. */
function Question({
  label, value, onChange, yes, no,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  yes: string;
  no: string;
}) {
  return (
    <div>
      <p className="text-[13px] leading-snug text-ink/80">{label}</p>
      <div className="mt-2 flex gap-2">
        {[[true, yes], [false, no]].map(([v, text]) => {
          const on = value === v;
          return (
            <button
              key={String(v)}
              onClick={() => onChange(v as boolean)}
              aria-pressed={on}
              className={`flex-1 rounded-xl border px-3 py-2.5 font-display text-[13px] font-semibold transition-all active:scale-[0.98] ${
                on ? "border-accent bg-accentSoft text-accentDark" : "border-line bg-mist text-ink/70 hover:border-lineDark hover:text-ink"
              }`}
            >
              {text as string}
            </button>
          );
        })}
      </div>
    </div>
  );
}
