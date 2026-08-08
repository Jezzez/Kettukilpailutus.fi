"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Building2, Check, ChevronDown, Flame, Home, House, Info, Leaf,
  Lock, Pencil, Plug, RefreshCw, ShieldCheck, Timer, TrendingDown, Wallet, X,
} from "lucide-react";
import type { ElectricityPlan } from "@/lib/energy";
import {
  annualCost,
  ASSUMED_SPOT_AVG,
  campaignSaving,
  DWELLINGS,
  IS_EXAMPLE_DATA,
  normalAnnualCost,
  PRICE_DATE,
} from "@/lib/energy";
import PlanCard, { type PlanBadge } from "./PlanCard";
import AffiliateButton from "../AffiliateButton";
import SpotCurve from "./SpotCurve";
import SpotPriceLive from "./SpotPriceLive";
import EnergyStickyBar from "./EnergyStickyBar";
import FoxPaw from "../FoxPaw";
import TailSweep from "../fox/TailSweep";
import PawTrail from "../fox/PawTrail";
import FoxSlot from "../fox/FoxSlot";
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
    why: "Sähkö tulee kotiisi samaa verkkoa pitkin kuin ennenkin. Siirtoyhtiösi pysyy samana, ja vaihtuu vain se yhtiö, joka laskuttaa sinua myydystä sähköstä. Katkoa ei synny missään vaiheessa.",
  },
  {
    icon: RefreshCw,
    text: "Vanha sopimus irtisanotaan puolestasi",
    why: "Uusi yhtiö hoitaa irtisanomisen, joten vanhalle ei tarvitse soittaa. Yksi poikkeus: jos sinulla on kesken määräaikainen sopimus, sen purkamisesta voi tulla kuluja. Tarkista päättymispäivä laskustasi ennen kuin vaihdat.",
  },
  {
    icon: Timer,
    text: "Vie noin 5 minuuttia",
    why: "Tarvitset sähkölaskusi 17-numeroisen käyttöpaikkatunnuksen ja pankkitunnukset tunnistautumiseen. Sopimus syntyy sähköisesti, ja etämyynnissä sinulla on aina 14 vuorokauden peruutusoikeus.",
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
    /*
      PIILOTETUSSA VÄLILEHDESSÄ EI ANIMOIDA VAAN ASETETAAN LUKU SUORAAN.

      Selain pysäyttää `requestAnimationFrame`-silmukan kokonaan, kun
      välilehti ei ole näkyvissä. Ilman tätä ehtoa laskuri jää siihen
      lukuun, jossa se oli välilehden vaihtuessa: käyttäjä palaa
      välilehteen ja näkee otsikossa hinnan, jota ei ole yhdessäkään
      kortissa. Juuri se on sivun pahin virhe — koko lupaus on
      "näytämme laskutoimituksen", ja otsikkoluku, joka ei täsmää
      listaan, saa lukijan olettamaan loputkin luvut sepitetyiksi.

      Animaatio on kuitenkin sitä varten, että luvun muuttuminen
      huomataan. Piilotetussa välilehdessä sitä ei ole kukaan
      katsomassa, joten animaatiosta ei menetetä mitään.
    */
    if (typeof document !== "undefined" && document.hidden) {
      from.current = target;
      setValue(target);
      return;
    }
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
  /*
    ASUMISMUODON VALINTA VIE SUORAAN KYSYMYKSEEN 2.

    Vain ensimmäinen kysymys toimii näin. Muissa vaiheissa edetään
    "Jatka"-napilla kuten ennenkin.

    MIKSI JUURI TÄMÄ KYSYMYS: se on ainoa, jossa vaihtoehdot ovat
    toisensa poissulkevia ja valinta on lopullinen heti — kerrostalo tai
    omakotitalo, ei mitään harkittavaa jälkikäteen. Kysymyksissä 3 ja 4
    käyttäjä voi hyvinkin epäröidä vastaustaan, ja silloin ruudun
    vaihtuminen alta veisi häneltä mahdollisuuden muuttaa mieltään ennen
    etenemistä. Kysymys 2 on tekstikenttä, jossa automaattinen siirtymä
    ei ole edes mahdollinen.

    MIKSI TUOTON KANNALTA: ensimmäinen napinpainallus on koko kyselyn
    kriittisin. Siinä kohtaa käyttäjä ei ole vielä sitoutunut mihinkään,
    ja jokainen ylimääräinen ele ennen ensimmäistä edistymisen tunnetta
    on tilaisuus poistua. Kun ruutu vaihtuu heti, hän on jo matkalla.

    VIIVE ON TARKOITUKSELLINEN, EI VIRHE. Tässä oli aiemmin kommentti,
    joka perusteli miksi automaattista siirtymää EI tehdä: iäkkäälle
    käyttäjälle itsestään vaihtuva ruutu on hetki, jolloin hän ei tiedä
    mitä äsken tapahtui. Perustelu ei ollut väärä, ja siksi valinta ehtii
    näkyä rastina ennen siirtymää. 260 ms riittää siihen, että silmä
    rekisteröi rastin, mutta on liian lyhyt tuntuakseen odottamiselta.
  */
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  /*
    JOKAINEN VAIHE ALKAA KYSELYN YLAREUNASTA.

    Ilman tata puhelin jai siihen kohtaan sivua, jossa "Jatka"-nappi oli:
    uusi kysymys vaihtui ruudun ylapuolelle ja kayttaja katsoi keskelta
    alkavaa vaihtoehtolistaa tietamatta mihin oli vastaamassa. Kysymys on
    ruudun tarkein teksti, joten sen on oltava nakyvissa silla sekunnilla
    kun se vaihtuu.

    Vieritys ajetaan jokaisella vaiheen muutoksella, myos taaksepain, jotta
    liike on aina sama eika kayttajan tarvitse arvata milloin sivu hyppaa.
    Ensimmaisella renderoinnilla sita EI ajeta: silloin se repisi kavijan
    pois herosta heti sivun auettua.

    `reduce` kunnioittaa jarjestelman "vahenna liiketta" -asetusta.
  */
  const quizTopRef = useRef<HTMLDivElement>(null);
  const quizMounted = useRef(false);
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
  /*
    "PARAS ARVIO" POISTUI LAJITTELUSTA, TILALLE "PARAS KAMPANJA".

    Tähtiarvioita ei ole enää olemassa: kumppaniyhtiöille ei löydy
    riippumatonta arviolähdettä, joten arvio olisi keksitty luku.
    Lajitteluvalinta, joka järjestää listan keksityn luvun mukaan, on
    pahempi kuin puuttuva valinta — se antaa keksitylle luvulle
    työkalun aseman.

    Tilalla on lajittelu, jolle on oikea aineisto: kampanjaetu euroina
    ensimmäiseltä vuodelta. Se on myös se lajittelu, jota kampanjoita
    metsästävä kävijä oikeasti etsii, ja se nostaa esiin juuri ne
    sopimukset, joissa klikki on kumppanille arvokkain.
  */
  const [sort, setSort] = useState<"cost" | "basic" | "campaign">("cost");

  /*
    KUUSI KORTTIA HETI, LOPUT NAPIN TAKAA.

    Kaikki 21 korttia kerralla teki mobiilisivusta noin 30 ruudullista.
    Kukaan ei vertaile kahtakymmentä sähkösopimusta — käytännössä valinta
    tehdään kärjestä, ja loppupää on siellä vain todistamassa, ettei listaa
    ole karsittu. Kuusi korttia riittää siihen, että valinta tuntuu
    valinnalta eikä yhden vaihtoehdon esittelyltä.

    Loput EI piiloteta pysyvästi vaan yhden napin taakse, ja napissa lukee
    montako on jäljellä. Se on koko ero: kävijä näkee että lista jatkuu ja
    voi tarkistaa sen itse. Piilotettu loppupää ilman lukumäärää lukisi
    karsituksi listaksi, ja karsitulta vertailulta ei kysytä neuvoa.

    Tila ei palaudu järjestystä vaihdettaessa. Kerran auki avattu lista,
    joka sulkeutuu itsestään käyttäjän toisen valinnan takia, luetaan
    virheeksi.
  */
  const NAYTA_ALUKSI = 6;
  const [naytaKaikki, setNaytaKaikki] = useState(false);

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

  /*
    YKSI KYSYMYS KAHDEN SIJASTA.

    Aiemmin sopimustyyppi pääteltiin kahdesta kysymyksestä: "voitko
    ajoittaa kulutusta halvoille tunneille" ja "kumpi on tärkeämpää".
    Molemmat olettavat, että vastaaja tietää mitä pörssisähkö on ja
    miksi tunnin ajoituksella olisi väliä. Kohderyhmän vanhin pää ei
    tiedä, ja tuntematon kysymys ei jää väliin vaan pysäyttää koko
    kyselyn — vastaamatta jättäminen tuntuu virheeltä.

    Nyt kysytään yksi asia, jonka jokainen osaa vastata omasta
    elämästään: haluatko tietää laskun etukäteen vai haluatko halvimman.
    Sähkötermi ei esiinny kysymyksessä lainkaan, vaan vasta vastauksen
    perusteluna. "En osaa sanoa" on tarkoituksella oikea vastaus, koska
    arvattu vastaus rajaisi listan väärin.
  */
  const [pricePref, setPricePref] = useState<"steady" | "cheapest" | "unsure" | null>(null);
  /** Tietääkö käyttäjä nykyisen hintansa. `null` = ei vastattu vielä. */
  const [knowsCurrent, setKnowsCurrent] = useState<boolean | null>(null);

  const reduce = useReducedMotion();

  useEffect(() => {
    if (!quizMounted.current) { quizMounted.current = true; return; }
    if (!gated || submitted) return;
    quizTopRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [step, gated, submitted, reduce]);

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
          if (sort === "campaign") {
            const d = campaignSaving(b, kwh) - campaignSaving(a, kwh);
            /* Tasatilanteessa (esim. kaksi kampanjatonta) halvin ensin,
               jotta lista ei näytä satunnaiselta. */
            if (d !== 0) return d;
            return annualCost(a, kwh) - annualCost(b, kwh);
          }
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

  /*
    KETUN VALINTA LASKETAAN NYT KAHDESTA HINNASTA, EI HINNASTA JA TÄHDESTÄ.

    Vanha kaava oli hinta 72 % + käyttäjäarvio 28 %. Arvio-osuus on
    poissa, koska kumppaniyhtiöille ei ole riippumatonta arviolähdettä
    eikä tähtiä keksitä. Pelkkä hinta ei kuitenkaan kelpaa merkin
    perusteeksi: silloin "Ketun valinta" olisi sama kortti kuin
    "Edullisin", eli merkki ei kertoisi mitään uutta.

    Toinen akseli on nyt kampanjan JÄLKEINEN hinta. Se on oikea ja
    tärkeä ero: yhdeksän neljästätoista kampanjasta on kolmen kuukauden
    perusmaksuetu, ja kolmen kuukauden etu voi nostaa sopimuksen
    ensimmäisen vuoden vertailun kärkeen, vaikka sen pysyvä hinta olisi
    listan kalliimmasta päästä. Asiakas asuu sopimuksessa neljä vuotta,
    ei kolme kuukautta.

    Työnjako on siis selvä ja lukijalle kerrottavissa yhdellä lauseella:
    "Edullisin" = halvin ensimmäinen vuosi kampanjoineen, "Ketun
    valinta" = paras kokonaisuus, kun myös kampanjan jälkeinen hinta
    lasketaan mukaan. Painotus on 50/50, koska mikään aineisto ei
    perustele tarkempaa lukua — ja keksitty tarkkuus ("57 %") olisi taas
    yksi luku, jota ei voi puolustaa.
  */
  const cheapestNormalCost = useMemo(
    () => Math.min(...plans.map((p) => normalAnnualCost(p, kwh))),
    [plans, kwh]
  );

  const foxId = useMemo(() => {
    if (filtered.length < 3) return null;
    const scored = filtered.map((p) => ({
      id: p.id,
      score:
        0.5 * (cheapestCost / annualCost(p, kwh)) +
        0.5 * (cheapestNormalCost / normalAnnualCost(p, kwh)),
    }));
    return scored.sort((a, b) => b.score - a.score)[0].id;
  }, [filtered, kwh, cheapestCost, cheapestNormalCost]);

  /*
    KETUN SUOSITUS = YKSI NIMETTY SOPIMUS.

    Kyselyn jälkeen ruudulla on kuusi korttia, ja kuusi vaihtoehtoa on
    juuri se määrä, jossa päätös lykkääntyy. Vertailusivun tuotto syntyy
    vasta klikistä, joten listan yläpuolella pitää olla yksi vastaus
    kysymykseen "no mikä minun pitäisi ottaa".

    Ensisijaisesti Ketun valinta (ensimmäinen vuosi 50 % · kampanjan
    jälkeinen hinta 50 %), koska se on sama kaava kuin korttien
    merkissä — kaksi eri suositusta samalla sivulla lukisi
    sekaannukseksi. Jos aineisto on niin pieni, ettei valintaa lasketa
    (alle 3 sopimusta), suositellaan halvinta.
  */
  const recommendedPlan = useMemo(
    () => (foxId ? filtered.find((p) => p.id === foxId) ?? cheapestPlan : cheapestPlan),
    [foxId, filtered, cheapestPlan]
  );
  const recommendedIsCheapest = recommendedPlan !== null && recommendedPlan.id === cheapestId;

  /*
    KETUN VALINTA NOSTETAAN AINA TOISEKSI KORTIKSI.

    Ketun valinta on koko sivun vastaus kysymykseen "mikä minun pitäisi
    ottaa", mutta hintajärjestyksessä se saattoi pudota viidenneksi tai
    kahdeksanneksi — eli kohtaan, jota mobiilikävijä ei näe koskaan.
    Suositus, joka ei ole ruudulla, ei tuota klikkiä.

    Ykköspaikkaa se ei saa. Halvin sopimus on ainoa väite, jonka kävijä voi
    tarkistaa kortin omista luvuista sekunnissa, ja jos listan kärjessä on
    jokin muu, koko järjestys lukee ostetuksi. Toinen paikka on ensimmäinen,
    jonka voi antaa menettämättä sitä.

    Nosto tehdään VAIN hintajärjestyksessä. Muissa järjestyksissä (pienin
    perusmaksu, suurin kampanjaetu) korttien merkit on jo kytketty pois,
    koska Ketun valinta lasketaan hinnasta — nosto ilman merkkiä olisi
    selittämätön hyppy järjestyksessä.

    Järjestys ei muuta numerointia: nostettu kortti saa tassun numeron
    tilalle ja muut kortit numeroidaan juoksevasti. Ks. PlanCard.tsx.
  */
  const { jarjestetyt, nostettuId } = useMemo(() => {
    if (sort !== "cost" || !foxId) return { jarjestetyt: filtered, nostettuId: null };
    const i = filtered.findIndex((p) => p.id === foxId);
    // Jo kärjessä (esim. halvin on myös Ketun valinta) — ei siirrettävää.
    if (i < 2) return { jarjestetyt: filtered, nostettuId: null };
    const kopio = filtered.slice();
    kopio.splice(1, 0, kopio.splice(i, 1)[0]);
    return { jarjestetyt: kopio, nostettuId: foxId };
  }, [filtered, foxId, sort]);

  /*
    VAHVUUSLAUSE MERKITTÖMILLE KORTEILLE.

    Kaksi korttia kuudesta saa merkin (Edullisin, Ketun valinta). Lopuilla
    merkkipalkin vasen puoli jäi tyhjäksi, ja tyhjä palkki luki keskeneräiseltä
    — sitä pahemmin, mitä alemmas listassa mentiin. Sivun alkuperäinen vika
    oli juuri se, että kortit näyttivät tuhannelta samalta kortilta; merkitön
    kortti on niistä kaikkein anonyymein.

    Lause LASKETAAN, ei kirjoiteta käsin. Jokainen kortti saa sen tiedon,
    jossa se on koko suodatetun listan ainoa kärki:

      · pienin perusmaksu    · pienin marginaali (vain pörssisopimukset)
      · pisin hintatakuu

    "Ainoa kärki" tarkoittaa tässä aidosti ainoaa: jos kaksi sopimusta on
    tasan samassa luvussa, kumpikaan ei saa lausetta. Tasapelissä annettu
    "pienin perusmaksu" olisi kirjaimellisesti valhe, ja tällä sivustolla
    yksi kiinni jäänyt väite maksaa kaikkien muidenkin lukujen uskottavuuden.

    Kärki lasketaan koko suodatetusta listasta eikä näkyvistä kuudesta.
    Muuten lause vaihtuisi sillä sekunnilla, kun käyttäjä painaa "Näytä
    loput" — ja liikkuva väite näyttää siltä, että sitä sovitellaan.

    Loput saavat varalauseen (ero halvimpaan, ks. kutsukohta). Se on
    tarkoituksella pieni luku eikä varoitus: 45 euron kuukausilaskussa
    +0,70 € ei ole syy hylätä yhtiötä, jonka kävijä muuten haluaisi. Ilman
    lukua hän joutuisi arvaamaan eron ja arvaus on aina liioitteleva.
  */
  const vahvuudet = useMemo(() => {
    const nimet = new Map<string, string>();

    /** Ainoan kärjen id, tai null jos kärkeä ei ole tai siitä on tasapeli. */
    const ainoaKarki = (
      joukko: ElectricityPlan[],
      arvo: (p: ElectricityPlan) => number | null,
      suunta: "min" | "max"
    ): string | null => {
      const kelpaavat = joukko.filter((p) => arvo(p) !== null);
      if (kelpaavat.length < 2) return null;
      const luvut = kelpaavat.map((p) => arvo(p) as number);
      const karki = suunta === "min" ? Math.min(...luvut) : Math.max(...luvut);
      const voittajat = kelpaavat.filter((p) => arvo(p) === karki);
      return voittajat.length === 1 ? voittajat[0].id : null;
    };

    const aseta = (id: string | null, teksti: string) => {
      if (id && !nimet.has(id)) nimet.set(id, teksti);
    };

    aseta(
      ainoaKarki(filtered, (p) => p.basicFee, "min"),
      "Pienin perusmaksu"
    );
    aseta(
      ainoaKarki(
        filtered.filter((p) => p.type === "spot"),
        (p) => p.spotMargin,
        "min"
      ),
      "Pienin marginaali"
    );
    aseta(
      ainoaKarki(filtered, (p) => p.fixedTermMonths, "max"),
      "Pisin hintatakuu"
    );

    return nimet;
  }, [filtered]);

  /*
    "MIKSI JUURI TÄMÄ?" — NELJÄ PERUSTELUA, KAIKKI LASKETTUJA.

    Suositus vastasi tähän asti kysymykseen "mikä", muttei kysymykseen
    "miksi". Juuri se kysymys on viimeinen este ennen "Tee sopimus"
    -nappia: kävijä ei epäröi hintaa vaan sitä, onko valinta tehty
    hänen puolestaan oikein perustein. Neljä rastia vastaa siihen
    nopeammin kuin kappale tekstiä, koska luettelon voi silmäillä.

    JOKAINEN RIVI LUETAAN DATASTA, EI KIRJOITETA KÄSIN. Kiinteä lista
    ("halvin", "ei määräaikaisuutta", "hyvät arviot") olisi väärässä
    joka kerta kun suositus on jokin muu kuin halvin tai kun sopimus
    on määräaikainen — ja väärä perustelu maksaa enemmän kuin puuttuva.
    Siksi määräaikainen sopimus kertoo määräajan pituuden eikä piilota
    sitä, ja arvio näytetään lukuna eikä sanana "hyvät".
  */
  const recommendedReasons = recommendedPlan
    ? [
        recommendedIsCheapest
          ? "Halvin arvioitu vuosihinta"
          : "Paras hinta myös kampanjan jälkeen",
        recommendedPlan.fixedTermMonths
          ? `Hinta lukossa ${recommendedPlan.fixedTermMonths} kk`
          : "Ei määräaikaisuutta",
        /* Neljäs rivi oli asiakasarvio. Arvioita ei ole enää olemassa
           (ks. foxId-kommentti), joten tilalla on tieto, joka on: joko
           kampanjaetu euroina tai — jos kampanjaa ei ole — kampanjan
           jälkeinen kuukausihinta, joka on juuri se luku, jolla tämä
           sopimus voitti vertailun toisella akselilla. */
        recommendedPlan.campaign
          ? `Kampanjaetu ${Math.round(
              campaignSaving(recommendedPlan, kwh)
            ).toLocaleString("fi-FI")} € ensimmäisenä vuonna`
          : `Sama hinta myös ensimmäisen vuoden jälkeen`,
        `Laskettu kulutuksellasi ${kwh.toLocaleString("fi-FI")} kWh`,
      ]
    : [];

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
  const headlineSaving = useCountUp(savingsBase === null ? 0 : Math.max(0, savingsBase - bestVisibleCost));
  const cheapestMonthly = useCountUp(bestVisibleCost / 12);

  /**
   * Suositus sopimustyypistä. `unsure` ei tuota suositusta eikä rajaa
   * listaa: se on rehellinen vastaus, ja rehelliseen "en tiedä" -vastaukseen
   * keksitty suositus olisi arvaus käyttäjän puolesta.
   */
  const advice =
    pricePref === null || pricePref === "unsure"
      ? null
      : pricePref === "steady"
        ? {
            type: "fixed" as const,
            title: "Kettu suosittelee kiinteää hintaa",
            why: "Halusit tietää laskun etukäteen. Kiinteässä sopimuksessa hinta lukitaan koko kaudeksi, joten tammikuu ei yllätä. Varmuudesta maksetaan yleensä pieni lisä, ja se on rehellistä sanoa ääneen.",
          }
        : {
            type: "spot" as const,
            title: "Kettu suosittelee pörssisähköä",
            why: "Halusit halvimman etkä säikähdä vaihtelua. Pörssisähkön hinta seuraa pörssiä tunneittain ja on pitkällä aikavälillä ollut keskimäärin halvempi, koska et maksa hintasuojasta. Yksittäinen pakkaskuukausi voi silti olla kallis.",
          };

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
            Tiedän nykyisen hintani, laske todellinen säästö
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
              {alwaysOpen && " Voit myös jättää kentät tyhjiksi. Silloin säästölukua ei näytetä lainkaan."}
            </p>
          </div>
        )}
      </div>
  );

  /*
    HINTATOIVE — KYSELYN AINOA "VAIKEA" KYSYMYS, KIRJOITETTUNA AUKI.

    Pörssi vai kiinteä on asiakkaan vaikein päätös, ja vastaamattomana se
    jää roikkumaan koko listan yli — silloin ei paineta mitään. Siksi
    siihen vastataan työkalussa eikä oppaassa jossain muualla.

    Kysymys ei kysy sopimustyyppiä vaan elämäntapaa: haluatko tietää
    laskun etukäteen vai haluatko halvimman. Sähkötermi mainitaan vasta
    vaihtoehdon perustelurivillä, eli vastaaja ei joudu tietämään
    termiä vastatakseen. Kolmas vaihtoehto ("En osaa sanoa") ei ole
    kohteliaisuus vaan välttämättömyys: pakotettu vastaus arvataan, ja
    arvattu vastaus rajaisi listan väärin.
  */
  const PREFS = [
    {
      key: "steady" as const,
      icon: Lock,
      title: "Haluan tietää etukäteen, paljonko lasku on",
      hint: "Sama hinta joka tunti koko kauden. Tammikuu ei yllätä.",
    },
    {
      key: "cheapest" as const,
      icon: TrendingDown,
      title: "Haluan mahdollisimman halvan",
      hint: "Hinta elää pörssin mukaan. Keskimäärin halvempi, mutta yksittäinen kuukausi voi olla kallis.",
    },
    {
      key: "unsure" as const,
      icon: Info,
      title: "En osaa sanoa",
      hint: "Ei haittaa. Silloin Kettu näyttää kaikki sopimukset.",
    },
  ];

  const prefBlock = (
    <div className="grid gap-2.5">
      {PREFS.map((o) => (
        <BigOption
          key={o.key}
          icon={o.icon}
          title={o.title}
          hint={o.hint}
          selected={pricePref === o.key}
          onClick={() => setPricePref(o.key)}
        />
      ))}
    </div>
  );

  /* ── Kyselyn isot vaihenäkymät ─────────────────────────────────────────
     Nämä ovat kyselyä varten kirjoitetut versiot samoista kysymyksistä,
     jotka `fullForm` näyttää tuloslistan yhteydessä tiiviinä. Ero on
     tarkoituksellinen: kyselyssä ruudulla on YKSI kysymys, joten
     kosketuskohteet ovat vähintään 64 px korkeita ja teksti 17 px, kun
     taas tuloslistan vieressä samat kentät ovat säätimiä ja saavat olla
     pieniä. Kaksi eri kokoa samasta kysymyksestä on halvempaa kuin yksi
     kompromissikoko, joka on kummassakin paikassa väärä. */

  const dwellingBig = (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {DWELLINGS.map((d) => (
        <BigOption
          key={d.key}
          icon={DWELLING_ICONS[d.key as keyof typeof DWELLING_ICONS]}
          title={d.label}
          hint={`Yleensä noin ${d.kwh.toLocaleString("fi-FI")} kWh vuodessa`}
          selected={dwelling === d.key}
          onClick={() => {
            setDwelling(d.key);
            setKwh(d.kwh);
            setKwhTouched(false);
            if (advanceTimer.current) clearTimeout(advanceTimer.current);
            advanceTimer.current = setTimeout(() => setStep((cur) => (cur === 1 ? 2 : cur)), 260);
          }}
        />
      ))}
    </div>
  );

  /** Vaiheessa 1 valitun asumismuodon arvio — käytetään vaiheen 2 ohjeessa. */
  const dwellingGuess = DWELLINGS.find((d) => d.key === dwelling) ?? null;

  const kwhBig = (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          id="kwh-quiz"
          type="number"
          inputMode="numeric"
          min={500}
          max={40000}
          step={100}
          value={kwh}
          onChange={(e) => { setKwh(Math.max(0, Number(e.target.value))); setKwhTouched(true); }}
          aria-label="Vuosikulutus kilowattitunteina"
          className="w-44 rounded-2xl border-2 border-lineDark bg-mist px-4 py-3.5 text-right font-data text-[26px] font-bold text-ink transition-colors focus:border-accent focus:outline-none"
        />
        <span className="font-display text-[16px] font-semibold text-ink/70">kWh vuodessa</span>
      </div>

      {/*
        ARVIO ON JO KENTÄSSÄ, JA SE SANOTAAN ÄÄNEEN.

        Kenttä on esitäytetty vaiheen 1 vastauksen perusteella. Ilman tätä
        riviä esitäyttö näyttää siltä, että palvelu tietää käyttäjän
        kulutuksen jostain — mikä on juuri se vaikutelma, joka saa
        varovaisen kävijän poistumaan. Kun arvio kerrotaan arvioksi,
        sama luku muuttuu epäilyttävästä avuliaaksi.
      */}
      {dwellingGuess && !kwhTouched && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/[0.07] px-3.5 py-2.5 text-[14px] leading-relaxed text-ink/80">
          <Check size={15} className="mt-0.5 shrink-0 text-goldInk" aria-hidden />
          <span>
            Tähän on laitettu valmiiksi arvio ({dwellingGuess.label.toLowerCase()}).
            <strong className="font-semibold"> Voit jatkaa suoraan.</strong> Jos lasku on
            käsillä, tarkka luku tarkentaa tuloksen.
          </span>
        </p>
      )}

      <p className="mt-3 text-[14px] leading-relaxed text-ink/65">
        Tarkka luku on sähkölaskusi erittelyssä kohdassa &quot;kulutus&quot; tai
        &quot;sähköenergia&quot;, muodossa esimerkiksi 5 200 kWh.
      </p>
    </div>
  );

  /*
    NYKYINEN HINTA KYSYTÄÄN KAHDESSA OSASSA.

    Aiemmin vaiheessa 2 oli suoraan kaksi numerokenttää otsikolla
    "Nykyinen sopimuksesi (vapaaehtoinen)". Se, joka ei tiennyt lukujaan,
    näki kaksi tyhjää kenttää eikä tiennyt saako niistä jatkaa —
    tyhjä pakollisen näköinen kenttä pysäyttää kyselyn varmemmin kuin
    vaikea kysymys. Nyt ensin kysytään tiedätkö, ja kentät ilmestyvät
    vasta myöntävän vastauksen jälkeen. "En tiedä" on yhtä iso ja yhtä
    laillinen vastaus kuin "kyllä".

    Tämä kysymys kannattaa kysyä, vaikka se pidentää kyselyä: se on
    ainoa lähde sivun rehellisimmälle hetkelle ("älä vaihda, sinulla on
    jo halvempi") ja ainoa tapa näyttää säästö euroina keksimättä sitä.
  */
  const currentChoiceBlock = (
    <div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <BigOption
          icon={Wallet}
          title="Kyllä, lasku on käsillä"
          hint="Kaksi lukua laskusta riittää."
          selected={knowsCurrent === true}
          onClick={() => { setKnowsCurrent(true); setShowCurrent(true); }}
        />
        <BigOption
          icon={X}
          title="En tiedä juuri nyt"
          hint="Ei haittaa. Hinnat näkyvät silti."
          selected={knowsCurrent === false}
          onClick={() => { setKnowsCurrent(false); setCurPrice(""); setCurBasic(""); }}
        />
      </div>

      <AnimatePresence initial={false}>
        {knowsCurrent === true && (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-2xl border border-line bg-mist p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="block font-display text-[14.5px] font-bold text-ink">
                    1. Sähkön hinta
                  </span>
                  <span className="mt-0.5 block text-[13px] text-ink/60">
                    Laskussa senttiä kilowattitunnilta
                  </span>
                  <span className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="8,90"
                      value={curPrice}
                      onChange={(e) => setCurPrice(e.target.value)}
                      className="w-32 rounded-xl border-2 border-lineDark bg-white px-3 py-3 text-right font-data text-[20px] font-bold text-ink placeholder:font-normal placeholder:text-ink/30 focus:border-accent focus:outline-none"
                    />
                    <span className="font-display text-[14px] font-semibold text-ink/65">c/kWh</span>
                  </span>
                </label>
                <label className="block">
                  <span className="block font-display text-[14.5px] font-bold text-ink">
                    2. Perusmaksu
                  </span>
                  <span className="mt-0.5 block text-[13px] text-ink/60">
                    Kiinteä kuukausimaksu laskussa
                  </span>
                  <span className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="4,50"
                      value={curBasic}
                      onChange={(e) => setCurBasic(e.target.value)}
                      className="w-32 rounded-xl border-2 border-lineDark bg-white px-3 py-3 text-right font-data text-[20px] font-bold text-ink placeholder:font-normal placeholder:text-ink/30 focus:border-accent focus:outline-none"
                    />
                    <span className="font-display text-[14px] font-semibold text-ink/65">€/kk</span>
                  </span>
                </label>
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/65">
                Molemmat luvut ovat sähkölaskusi erittelyssä otsikon
                &quot;sähköenergia&quot; alla. Jos toinen ei löydy, jätä se tyhjäksi.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
            "Sinulle ilmainen",
            "Ei tunnuksia, ei yhteystietoja",
            "Laskukaava on näkyvissä",
          ].map((t) => (
            <li key={t} className="flex items-center gap-1.5 text-[12px] font-medium text-ink/70">
              <ShieldCheck size={13} className="shrink-0 text-accentDark" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </div>
  );

  /* ── Kyselyn ohjaus ───────────────────────────────────────────────────

     VIISI VAIHETTA, YKSI KYSYMYS RUUDULLA.

     Kysely oli kolmivaiheinen, mutta vaiheet 2 ja 3 sisälsivät kaksi
     kysymystä kumpikin — eli ruudulla oli kaksi päätöstä yhtä aikaa,
     eri kokoisina ja eri muotoisina (numerokenttä + nappipari). Se on
     täsmälleen se tilanne, jossa iäkkäämpi käyttäjä ei tiedä mihin
     vastata ensin eikä siihen, onko tyhjä kenttä virhe.

     Pidempi kysely EI ole tässä huonompi. Poistumista ei aiheuta
     vaiheiden määrä vaan epätietoisuus siitä, mitä pitäisi tehdä:
     viisi ruutua, joilla kullakin on yksi selvä kysymys ja yksi iso
     oranssi nappi, täytetään loppuun useammin kuin kolme ruutua, joilla
     on kaksi kysymystä ja epäselvä eteneminen. Jokainen vaihe kertoo
     lisäksi lyhyesti MIKSI kysytään — perusteltu kysymys ei tunnu
     tietojen keräämiseltä.

     Vaihe 5 on yhteenveto. Se ei kysy mitään, vaan näyttää vastaukset
     ja antaa muuttaa niitä. Se on tämän kyselyn tärkein yksittäinen
     ruutu iäkkäälle käyttäjälle: se poistaa pelon siitä, että jotain
     tuli vastattua väärin eikä sitä enää saa korjattua. */

  const STEPS_Q = [
    {
      n: 1,
      title: "Valitse kotisi tyyppi",
      hint: "Tästä Kettu päättelee kulutuksen. Arvio riittää, tarkennat sen seuraavaksi.",
    },
    {
      n: 2,
      title: "Paljonko käytät sähköä vuodessa?",
      hint: "Valmis arvio on jo kentässä. Jatka suoraan tai korjaa luku tarkaksi.",
    },
    {
      n: 3,
      title: "Mikä näistä on sinulle tärkeintä?",
      hint: "Tämä ratkaisee, millaisia sopimuksia Kettu ehdottaa.",
    },
    {
      n: 4,
      title: "Tiedätkö, paljonko maksat sähköstä nyt?",
      hint: "Ilman tätä lukua säästöä ei voi laskea. Kettu ei arvaa sitä puolestasi.",
    },
    {
      n: 5,
      title: "Tarkista vastauksesi",
      hint: "Korjaa mitä tahansa kohtaa. Sen jälkeen Kettu näyttää sopimukset.",
    },
  ] as const;

  const LAST_STEP = STEPS_Q.length;

  const stepValid =
    step === 1 ? dwelling !== null || kwhTouched
    : step === 2 ? kwh >= 500
    : step === 3 ? pricePref !== null
    : step === 4 ? knowsCurrent !== null
    : true;

  /** Miksi "Jatka" ei vielä toimi. Sanotaan ääneen — harmaa nappi ilman
   *  selitystä on iäkkäälle käyttäjälle rikkinäinen nappi.
   *
   *  Vaiheet 1 ja 3 saavat saman lauseen tarkoituksella: molemmissa
   *  tehtävä on täsmälleen sama, ja sama tehtävä eri sanoilla luetaan
   *  uudestaan. Vaiheet 2 ja 4 pysyvät omissaan, koska niissä tehtävä
   *  on eri — kentässä kirjoitetaan luku, ja vaiheessa 4 on tärkeää
   *  sanoa että myös "en" vie eteenpäin. Ilman sitä osa arvaa, että
   *  vain "kyllä" kelpaa, ja keksii luvun. Keksitty lähtöhinta tuottaa
   *  keksityn säästön, ja se on tämän sivun pahin virhe. */
  const stepBlocker =
    stepValid ? null
    : step === 2 ? "Kirjoita kulutus, vähintään 500 kWh. Tai palaa taaksepäin valitsemaan koti."
    : step === 4 ? "Valitse kyllä tai en. Kumpikin vie eteenpäin."
    : "Valitse yksi vaihtoehto jatkaaksesi.";

  const activeStep = STEPS_Q[step - 1];

  const submitQuiz = () => {
    setSubmitted(true);
    /* Jos kyselyssä syötettiin nykyinen hinta, kenttä jää auki myös
       tuloksissa. Muuten säästöluku näkyisi ruudulla ilman että sen
       lähtöarvo olisi missään näkyvissä — eli tarkistamattomana. */
    if (curPrice.trim() !== "") setShowCurrent(true);
    /*
      Suositus VAIKUTTAA heti (lista rajautuu vastauksen mukaan), mutta
      paneeli pysyy kiinni. Auki avautuva paneeli työnsi sopimuskortit
      ruudun alareunan taakse juuri sillä sekunnilla, kun kysely vihdoin
      lupasi näyttää ne — ja odotettu palkinto jäi vierityksen päähän.
      Suositus on silti näkyvissä omassa oranssissa laatikossaan tulosten
      yläpuolella, joten vastaus ei katoa mihinkään.
      "En osaa sanoa" ei rajaa listaa.
    */
    if (advice) setType(advice.type);
  };

  /** Yhteenvetorivi vaiheessa 6. */
  const summaryRow = (n: number, label: string, value: string) => (
    <div
      key={label}
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line py-3 last:border-b-0"
    >
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-ink/55">{label}</p>
        <p className="mt-0.5 font-display text-[16px] font-bold text-ink">{value}</p>
      </div>
      <button
        onClick={() => setStep(n)}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 font-display text-[13.5px] font-semibold text-ink/75 transition-colors hover:border-accent/50 hover:text-ink"
      >
        <Pencil size={13} aria-hidden /> Muuta
      </button>
    </div>
  );

  const summaryBlock = (
    <div>
      <div className="rounded-2xl border border-line bg-mist px-4 py-1 sm:px-5">
        {summaryRow(1, "Kotisi", dwellingGuess ? dwellingGuess.label : "Kerroit kulutuksen suoraan")}
        {summaryRow(2, "Sähkön kulutus", `${kwh.toLocaleString("fi-FI")} kWh vuodessa`)}
        {summaryRow(
          3,
          "Tärkeintä sinulle",
          pricePref === "steady" ? "Ennustettava lasku"
            : pricePref === "cheapest" ? "Halvin mahdollinen"
            : "Et osannut sanoa, joten Kettu näyttää kaikki"
        )}
        {summaryRow(
          4,
          "Nykyinen hintasi",
          currentAnnual !== null
            ? `${currentAnnual.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} € vuodessa`
            : "Et kertonut, joten säästöä ei lasketa"
        )}
      </div>

      {advice && (
        <p className="mt-4 flex items-start gap-2.5 rounded-2xl border border-gold/30 bg-gold/[0.07] px-4 py-3.5 text-[14.5px] leading-relaxed text-ink/85">
          <FoxPaw className="mt-0.5 shrink-0 text-goldInk" />
          <span>
            Vastaustesi perusteella Kettu näyttää ensin{" "}
            <strong className="font-semibold text-goldInk">
              {advice.type === "fixed" ? "kiinteähintaiset sopimukset" : "pörssisopimukset"}
            </strong>
            . Muut näet yhdellä napilla.
          </span>
        </p>
      )}
    </div>
  );

  /** Kysely: yksi vaihe kerrallaan, portin takana. */
  const wizard = (
    <>
      {/* `scroll-mt-24` pitaa kysymyksen tarttuvan headerin alapuolella,
          kun vaiheen vaihto vierittaa tanne. Ks. efekti ylempana. */}
      <div ref={quizTopRef} className="scroll-mt-24">
        <div className="relative">
          <p className="flex items-center gap-2.5 font-display text-[12px] font-bold uppercase tracking-[0.18em] text-accentDark">
            Kysymys {step} / {LAST_STEP}
          </p>

          {/*
            KYSYMYS ON RUUDUN SUURIN TEKSTI.

            Se oli 19 px lihavoitua leipätekstiä, eli samaa kokoluokkaa
            kuin sen alla olevat vastausvaihtoehdot. Kun kysymys ja
            vastaus näyttävät samalta, ruudulta ei näe mikä on kysymys —
            ja juuri se on se hetki, jossa iäkkäämpi käyttäjä lopettaa.
            25/30 px erottaa kysymyksen yksiselitteisesti kaikesta
            muusta ruudulla.
          */}
          <h3 className="mt-2 font-display text-[24px] font-bold leading-[1.15] text-ink sm:mt-2.5 sm:text-[30px]">
            {activeStep.title}
          </h3>
          {/* Alaotsikko on puhelimessa 14,5 px ja tiukemmalla rivivalilla.
              Kysymyksen ja vastausten valissa oli kolme erillista
              tekstiriviä ennen ensimmaista vaihtoehtoa. */}
          <p className="mt-1.5 max-w-[46ch] text-[14.5px] leading-snug text-ink/70 sm:mt-2 sm:text-[15px] sm:leading-relaxed">
            {activeStep.hint}
          </p>

          {/* Edistymispalkki. Paloista näkee yhdellä silmäyksellä montako
              on jäljellä; liukuva viiva ei kerro sitä. */}
          <div className="mt-3.5 flex gap-1.5 sm:mt-4" aria-hidden>
            {STEPS_Q.map((sq) => (
              <span
                key={sq.n}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  sq.n < step ? "bg-accent" : sq.n === step ? "bg-accent" : "bg-line"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 sm:mt-6">
        {step === 1 && dwellingBig}
        {step === 2 && kwhBig}
        {step === 3 && prefBlock}
        {step === 4 && currentChoiceBlock}
        {step === 5 && summaryBlock}
      </div>

      {/*
        NAVIGOINTI ON AINA SAMASSA PAIKASSA JA SAMAN NÄKÖINEN.

        Iso oranssi nappi oikealla vie eteenpäin, harmaampi vasemmalla
        taakse — joka ainoalla ruudulla, myös ensimmäisellä. Vaiheessa 1
        "Takaisin" oli aiemmin kokonaan piilossa, jolloin napit siirtyivät
        paikaltaan heti ensimmäisen klikin jälkeen. Liikkuva nappi on
        pahin mahdollinen asia käyttäjälle, joka etsii sitä katseella.
        Nyt se on ensimmäisellä ruudulla näkyvissä mutta pois käytöstä.
      */}
      <div className="mt-6 border-t border-line pt-4 sm:mt-7 sm:pt-5">
        {/*
          ESTOTEKSTI ON NAPIN YLÄPUOLELLA, EI ALLA.

          Alla se luettiin vasta sen jälkeen, kun käyttäjä oli jo
          ehtinyt painaa reagoimatonta nappia — eli vasta kun ruutu
          oli jo tuntunut rikkinäiseltä. Yläpuolella lause osuu
          silmään matkalla vaihtoehdoista nappiin, eli juuri siinä
          järjestyksessä kuin ruutua luetaan.
        */}
        <div className="mb-3 flex min-h-[22px] items-center sm:mb-3.5" role="status" aria-live="polite">
          {stepBlocker && (
            <p className="flex items-center gap-2 text-[14.5px] font-medium text-ink/70">
              <Info size={15} className="shrink-0 text-accentDark" aria-hidden />
              {stepBlocker}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 font-display text-[15px] font-semibold text-ink/75 transition-colors hover:border-lineDark hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={16} aria-hidden /> Takaisin
          </button>

          {step < LAST_STEP ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!stepValid}
              className={`btn-ember inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-7 py-4 font-display text-[16.5px] font-bold text-onEmber transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none ${
                stepValid ? "btn-ready" : ""
              }`}
            >
              Jatka <ArrowRight size={17} aria-hidden />
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              /* Yhteenvedon nappi on aina käytettävissä, joten se on aina
                 valmiissa tilassa. Ilman tätä kyselyn viimeinen ja tärkein
                 nappi näyttäisi vaisummalta kuin sitä edeltäneet neljä. */
              className="btn-ember btn-ready inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-7 py-4 font-display text-[16.5px] font-bold text-onEmber transition-all active:scale-[0.98] sm:flex-none"
            >
              Näytä sopimukset <ArrowRight size={17} aria-hidden />
            </button>
          )}
        </div>

        {/*
          OHITUS TULEE NÄKYVIIN VASTA VAIHEESTA 3.

          Vaiheet 1–2 tuottavat ne kaksi lukua, joilla koko tuloslista
          lasketaan; ilman niitä ohitus veisi käyttäjän hintataulukkoon,
          jota vain selataan. Vaiheesta 3 eteenpäin loput kysymykset ovat
          tarkennuksia, ja silloin ulospääsy on tuoton kannalta parempi
          kuin umpikuja: ohittanut kävijä näkee silti omilla luvuillaan
          lasketun listan ja voi painaa "Tee sopimus". Loukkuun jäänyt
          poistuu sivustolta.
        */}
        {step >= 3 && (
          <button
            onClick={() => setSubmitted(true)}
            className="mt-3 text-[13.5px] font-medium text-ink/55 underline underline-offset-4 hover:text-ink"
          >
            Ohita loput kysymykset ja näytä sopimukset
          </button>
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
          Säädä lukuja, tulokset päivittyvät
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
          ? "rounded-2xl border border-line bg-white p-4 shadow-lift sm:rounded-[20px] sm:p-7"
          : "rounded-2xl border border-line bg-white p-4 shadow-card sm:rounded-[20px] sm:p-7"
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
          <div
  aria-hidden
  className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[74%] overflow-hidden md:hidden"
>
  <Image
    src="/kettu-seisoo.webp"
    alt=""
    width={432}
    height={1325}
    priority
    className="absolute bottom-0 right-[0%] h-[92%] w-auto max-w-none object-contain opacity-40"
    style={{
      WebkitMaskImage: "linear-gradient(to left, #000 14%, transparent 100%)",
      maskImage: "linear-gradient(to left, #000 14%, transparent 100%)",
    }}
  />
</div>
          <div className="relative z-[1] mx-auto max-w-[1180px] px-5 sm:px-6">
            <div className="grid items-center gap-6 md:grid-cols-[1.08fr_0.92fr] md:gap-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-accentDark">
                    Ketuttaako maksaa liikaa?
                  </span>
                </div>

                {/*
                  Otsikko on antiikvaa ja normaalipainoista tarkoituksella.
                  Kun otsikko ei ole lihava, sivun painavin elementti on
                  oranssi nappi — ja katse menee sinne, mistä palkkio tulee.
                  Kursivoitu "laskemalla" on sivun ainoa koristeellinen ele.
                */}
                <h1 className="mt-4 max-w-[19ch] font-hero text-[2.1rem] leading-[1.05] text-cream sm:text-[3.1rem] sm:leading-[1.03] md:text-[3.5rem]">
                  Halvin sähkösopimus löytyy{" "}
                  {/* Korostus on lämmintä kultaa, ei toista oranssia:
                      oranssilla pohjalla oranssi korostus ei erotu. */}
                  <em className="text-goldInk">laskemalla</em>, ei
                  arvaamalla.
                </h1>

                <p className="mt-5 max-w-[48ch] text-[15.5px] leading-relaxed text-ink/85 sm:text-[16.5px]">
                  Kettu kilpailuttaa jokaisen sähkösopimuksen todellisen vuosihinnan
                  juuri sinun kulutuksellasi ja näyttää, kuinka paljon voit säästää
                  vaihtamalla.
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
                    Aloita kysely – neljä kysymystä
                    <TrendingDown size={16} aria-hidden />
                  </a>
                  {/*
                    ALARIVI ON KOLME ESTETTÄ POIS ALTA, EI KOLME KEHUA.

                    Rivi seisoo heti kilpailutusnapin vieressä, eli juuri
                    siinä kohdassa jossa epäröinti syntyy. Jokainen kolmesta
                    vastaa yhteen kysymykseen, joka pysäyttää suomalaisen
                    kävijän vertailusivulla: maksaako tämä, joudunko
                    luovuttamaan tietoni, ja onko järjestys ostettu.

                    Erotin on kultaa, jotta kolme väitettä lukee kolmena
                    eikä yhtenä harmaana rivinä. Teksti pysyy pienenä ja
                    vaimeana tarkoituksella — sen tehtävä on poistaa este,
                    ei kilpailla napin kanssa katseesta.
                  */}
                  <p className="text-[13px] font-medium text-ink/80">
                    Ilmainen
                    <span className="mx-2 text-goldInk/70" aria-hidden>·</span>
                    Ei tunnistautumista
                    <span className="mx-2 text-goldInk/70" aria-hidden>·</span>
                    Puolueeton vertailu
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
                <SpotPriceLive className="order-2 mt-6 hidden md:order-1 md:mb-1 md:mt-0 md:block md:w-[19rem] md:shrink-0" />

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  className="order-1 hidden shrink-0 md:order-2 md:flex"
                >
                  {/*
                    Poosi on seisova kettu, ei luottokorttia pitelevä: tällä
                    sivulla maskotti ei voi pidellä korttia, se kertoisi
                    väärästä vertikaalista.

                    EI HEHKUA TYÖPÖYTÄNÄKYMÄSSÄ. Tässä oli `halo-glow`,
                    kermanvaalea kehä maskotin takana. Perustelu oli, että
                    hahmo irtoaa oranssista vyöstä valoarvolla. Leveällä
                    ruudulla se ei toiminut: vyö on siinä niin korkea, että
                    kehä mahtui kokonaan näkyviin pyöreänä vaaleana läiskänä
                    hahmon takana, eikä lukenut valona vaan taustagrafiikkana.
                    Kettu irtoaa vyöstä jo pelkällä varjolla.

                    MOBIILISSA HEHKU JÄÄ (ks. `md:hidden`-versio ylempänä).
                    Kapealla ruudulla kehä leikkautuu reunoista, jolloin se
                    lukee valona eikä muotona — ja siellä hahmo on isompi
                    suhteessa vyöhön, joten irtoaminen tarvitsee apua.

                    Varjo on tummanruskea, ei musta: musta varjo oranssilla
                    lukisi likana.
                  */}
                  <Image
                    src="/kettu-seisoo.webp"
                    alt="Kettu, Kettukilpailutuksen maskotti"
                    width={432}
                    height={1325}
                    priority
                    className="relative h-[430px] w-auto drop-shadow-[0_26px_44px_rgba(80,28,2,0.5)] lg:h-[470px]"
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
        vastaan näihin".

        Tässä oli aiemmin kolme sinettimerkkiä. Ne poistettiin, koska
        niiden kolme väitettä lukevat jo sanoina samassa ruudussa: kaksi
        vieressä olevassa kappaleessa ja kaikki kolme laskurin
        lupausrivillä. Sama lupaus kolmesti yhdellä ruudulla ei vahvista
        sitä vaan alkaa kuulostaa vakuuttelulta. Tilalla on Kettu, joka
        on ainoa merkki, jonka takana tällä sivustolla oikeasti ollaan.
      */}
      {!showResults && (
        <section className="theme-light bg-paper pt-14">
          {/*
            KETTU SYTYTTÄÄ LAMPUN PANEELIN SISÄLLÄ, REUNASTA REUNAAN.

            Tässä oli aiemmin vaakakuva, jossa Kettu kurkisti paneelin
            reunan yli. Kuva oli siksi paneelin ULKOPUOLELLA sisaruksena
            ja asemoitu sen päälle — `.pelt-surface` asettaa CSS:ssä
            `overflow: hidden`, joten mikään sisältä ei voi ylittää reunaa.

            Uusi kuva on pystykuva, jossa hahmo kurkottaa YLÖS. Sitä ei voi
            pudottaa vanhaan paikkaan: 240 pikselin korkuisena kohotettu
            käsi ja kipinät kutistuisivat tunnistamattomiksi, eikä seisova
            hahmo nojaa mihinkään. Kuva on siksi nyt paneelin SISÄLLÄ
            normaalina taittoelementtinä.

            KAKSI LEIKKAUSKOHTAA OSUU TARKALLEEN PANEELIN REUNOIHIN.
            Kuvan ylin kymmenys on pelkkää riippujohtoa ja alareuna on
            leikattu reidestä. `-mt-10` kumoaa paneelin `pt-10`:n, jolloin
            johto lähtee ylhäältä paneelin reunasta — lamppu näyttää
            roikkuvan katosta paneelin yläpuolelta. Paneelista poistettiin
            alapehmuste kokonaan (`pb` on nyt tekstisarakkeella), jolloin
            hahmon alaleikkaus osuu alareunaan ja hän nousee paneelin
            takaa. Vapaasti leijuessaan kumpikin pää näyttäisi katkaistulta.

            MIKSI NÄIN YLIPÄÄTÄÄN: tämä paneeli on portti. Se kertoo, ettei
            hintoja näytetä ennen vastauksia, ja se on hetki jolloin osa
            kävijöistä poistuu näkemättä yhtään hintaa. Sytytetty lamppu ja
            työkaluvyö kertovat sekunnissa, että kyse on sähköstä ja että
            joku hoitaa homman puolestasi — kurkistava kettu ei kertonut
            kumpaakaan.

            Mobiilissa hahmo on tekstin alla ja matalampi, jottei se vie
            koko ruutua ennen kuin lukija on lukenut miksi hänen kannattaa
            vastata.
          */}
          <div className="relative mx-auto max-w-[1180px] px-4 sm:px-6">
            <div className="pelt-surface overflow-hidden rounded-3xl border border-gold/30 px-6 pt-10 sm:px-10">
              <div className="relative z-[1] flex flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
                <div className="max-w-md pb-10 text-center lg:self-center lg:text-left">
                  <p className="flex items-center justify-center gap-2.5 font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-accentDark lg:justify-start">
                    <Lock size={13} aria-hidden /> Sopimukset avautuvat vastausten jälkeen
                  </p>
                  <p className="mt-3 font-hero text-[1.7rem] leading-[1.12] text-ink sm:text-[2rem]">
                    Kettu ei näytä hintataulukkoa. Se näyttää sinun hintasi.
                  </p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink/75">
                    Neljä kysymystä, noin minuutti. Sen jälkeen jokainen ruudulla
                    näkyvä euromäärä on laskettu sinun kulutuksellasi. Yhteystietoja
                    ei kysytä missään vaiheessa.
                  </p>
                  <p className="mt-4 font-data text-[13px] font-semibold text-goldInk">
                    {plans.length} sopimusta odottaa vertailua
                  </p>
                </div>

                {/*
                  `!h-` on tarkoituksellinen: FoxSlot asettaa korkeuden
                  tyylimääreenä, ja vain !important-luokka voi kääntää sen
                  näyttökoon mukaan. Korkeus 470 on valittu niin, että
                  hahmo täyttää paneelin ylhäältä alas kun `-mt-10` on
                  kumonnut yläpehmusteen.
                */}
                <FoxSlot
                  id="laskuri"
                  height={470}
                  className="pointer-events-none -mt-6 shrink-0 !h-[340px] drop-shadow-[0_10px_24px_rgba(90,45,10,0.14)] lg:-mt-10 lg:!h-[470px]"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {showResults && (
      <section ref={resultsTopRef} className={`theme-light scroll-mt-20 bg-paper ${withHero ? "pt-14" : "pt-10"}`}>
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          {/* Tulos */}
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-line bg-white px-5 py-6 shadow-card sm:rounded-[20px] sm:px-8 sm:py-7">
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
              <div className="pelt-surface w-full max-w-[17.5rem] rounded-2xl border border-gold/35 px-4 py-3.5 shadow-card sm:rounded-[18px]">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-goldInk">
                  <Wallet size={13} aria-hidden /> Säästösi euroina
                </p>
                <p className="mt-1.5 text-[12.5px] leading-snug text-ink/80">
                  Kettu ei arvaa säästöäsi. Kerro nykyinen hintasi, niin saat luvun.
                </p>
                <button
                  onClick={() => {
                    setShowCurrent(true);
                    document.getElementById("vertailu")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
                  }}
                  className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-gold/50 px-3.5 py-1.5 font-display text-[12.5px] font-bold text-goldInk transition-colors hover:bg-gold/15"
                >
                  Syötä nykyinen hintani
                </button>
              </div>
            )}
          </div>

          {/*
            KETUN SUOSITUS — kyselyn palkinto.

            MIKSI TÄMÄ ON OLEMASSA: kysely kysyy nyt neljä kertaa jotain.
            Jos vastauksena on pelkkä lajiteltu lista, käyttäjä on tehnyt
            työtä eikä saanut mitään takaisin — ja seuraavalla käynnillä
            hän ohittaa kyselyn. Yksi nimetty sopimus perusteluineen on se
            vastaus, jota neljä kysymystä lupasi.

            MIKSI SE ON TUOTON KANNALTA SIVUN TÄRKEIN LAATIKKO: kuusi
            korttia on juuri se määrä vaihtoehtoja, jossa päätös
            lykkääntyy "mietin illalla" -tilaan. Tämä paneeli tekee
            päätöksen valmiiksi ja tarjoaa napin samaan ruutuun.

            MIKSI SE ON REHELLINEN: valintaperuste luetellaan tässä auki
            (ensimmäinen vuosi 50 % · kampanjan jälkeinen hinta 50 %),
            se on sama kaava kuin korttien
            merkissä, ja halvin vaihtoehto on aina merkitty erikseen. Jos
            asiakkaan oma sopimus on jo halvempi, tätä paneelia ei
            näytetä lainkaan — silloin ruudulla on "älä vaihda", eikä sen
            viereen kuulu ostokehotus.

            ANIMAATIO: pelkkä sisääntulo, ei odotusta eikä laskennan
            teatteria. Tekaistu "Kettu miettii…" -viive on käytetty
            temppu, mutta se on valehtelua sekunneista ja iäkkäälle
            käyttäjälle se näyttää jumittuneelta sivulta.
          */}
          {recommendedPlan && !alreadyGood && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="theme-ember ember-surface relative mt-4 overflow-hidden rounded-3xl border border-line shadow-lift"
            >
              <div className="relative z-[1] flex flex-col gap-6 p-5 sm:p-7 md:flex-row md:items-center">
                {/* Kettu tulee mukaan omalla ajoituksellaan: sama suunta,
                    hitusen myöhemmin, jotta katse osuu ensin tekstiin ja
                    vasta sitten hahmoon. */}
                <motion.div
                  initial={reduce ? false : { opacity: 0, scale: 0.9, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: reduce ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="shrink-0"
                >
                  {/* `width`/`height` ovat kuvan todelliset mitat (432×1325).
                      Aiemmin tässä luki 520×640, mikä ei vastannut mitään
                      tiedostoa — Next laski varausalueen väärässä
                      kuvasuhteessa, ja kortti nytkähti kun kuva latautui. */}
                  <Image
                    src="/kettu-seisoo.webp"
                    alt=""
                    width={432}
                    height={1325}
                    className="mx-auto h-32 w-auto object-contain md:h-40"
                  />
                </motion.div>

                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2.5 font-display text-[12px] font-bold uppercase tracking-[0.18em] text-goldInk">
                    <FoxPaw /> Ketun suositus sinulle
                  </p>

                  <h3 className="mt-3 font-hero text-[1.7rem] leading-[1.12] text-cream sm:text-[2.1rem]">
                    {recommendedPlan.provider} — {recommendedPlan.name}
                  </h3>

                  {/*
                    Perustelut KORVAAVAT aiemman kappaleen, eivät tule
                    sen lisäksi. Kappale sanoi saman asian proosana, ja
                    kaksi versiota samasta perustelusta olisi kasvattanut
                    paneelin korkeutta ilman että kävijä saa mitään uutta.
                    Kaksi saraketta pitää neljä riviä kahden rivin tilassa.
                  */}
                  <p className="mt-3 font-display text-[12px] font-bold uppercase tracking-[0.18em] text-goldInk">
                    Miksi Kettu suosittelee tätä?
                  </p>
                  <ul className="mt-2.5 grid max-w-[54ch] gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {recommendedReasons.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-[14.5px] leading-snug text-ink/85">
                        <Check size={15} className="mt-[3px] shrink-0 text-goldInk" aria-hidden />
                        {r}
                      </li>
                    ))}
                  </ul>

                  {/* Luvut nostetaan omaksi rivikseen: suosituksen pitää
                      kestää tarkistus samassa ruudussa, jossa se annetaan. */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-goldInk">
                        Arvio sinulle
                      </p>
                      <p className="mt-0.5 font-display font-data font-price text-[2rem] font-extrabold leading-none tracking-tight text-cream">
                        {(annualCost(recommendedPlan, kwh) / 12).toLocaleString("fi-FI", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}{" "}
                        €
                        <span className="ml-1 text-[15px] font-semibold text-ink/75">/ kk</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-goldInk">
                        Vuodessa
                      </p>
                      <p className="mt-0.5 font-display font-data text-[1.35rem] font-bold leading-none text-cream">
                        {annualCost(recommendedPlan, kwh).toLocaleString("fi-FI", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        €
                      </p>
                    </div>
                    {currentAnnual !== null && currentAnnual > annualCost(recommendedPlan, kwh) && (
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-goldInk">
                          Säästö nykyiseesi
                        </p>
                        <p className="mt-0.5 font-display font-data text-[1.35rem] font-bold leading-none text-cream">
                          {(currentAnnual - annualCost(recommendedPlan, kwh)).toLocaleString("fi-FI", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          € / v
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {/* `theme-light` kääre: kermanapin sisällä `bg-white`
                        pitää piirtyä vaaleana eikä oranssina. Ks. CLAUDE.md
                        huomautus ember-ansasta. */}
                    <div className="theme-light">
                      <AffiliateButton
                        href={recommendedPlan.affiliateUrl}
                        cardId={recommendedPlan.id}
                        placement="energy-suositus"
                        variant="inverse"
                      >
                        Tee sopimus
                      </AffiliateButton>
                    </div>
                    <a
                      href={`/sahkosopimukset/sopimus/${recommendedPlan.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cream/40 px-5 py-3.5 font-display text-[14.5px] font-bold text-cream transition-colors hover:bg-cream/10"
                    >
                      Tutustu sopimukseen <ArrowRight size={15} aria-hidden />
                    </a>
                  </div>

                  {/*
                    Mihin nappi vie. Epäselvyys siitä, mitä klikin
                    takana tapahtuu, on tässä kohdassa yleisin syy jättää
                    painamatta: osa pelkää tekevänsä sitovan sopimuksen
                    vertailusivulla. Yksi lause poistaa sen — ja se on
                    myös totta, sopimus syntyy vasta yhtiön omilla
                    sivuilla.
                  */}
                  <p className="mt-3 text-[13px] text-ink/70">
                    Sopimus tehdään sähköyhtiön omilla sivuilla.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

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
                  {advice ? "Vaihda hintatoivettasi" : "Epäröitkö, kumpi sopii: pörssisähkö vai kiinteä?"}
                </span>
                {/* Kyselyyn vastannut on jo kertonut toiveensa. Jos tässä
                    lukisi silti "vastaa yhteen kysymykseen", palvelu
                    näyttäisi unohtaneen juuri annetun vastauksen. */}
                <span className="mt-0.5 block text-[13px] text-ink/70">
                  {advice
                    ? "Lista on rajattu vastauksesi mukaan. Avaa, jos haluat muuttaa sitä."
                    : "Vastaa yhteen kysymykseen, niin Kettu suosittelee ja rajaa listan."}
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
            {/* SAMA PALIKKA KUIN KYSELYN VAIHEESSA 4. Kaksi eri versiota
                samasta kysymyksestä tuottaisi kaksi totuuden lähdettä:
                kyselyssä annettu vastaus ei näkyisi täällä valittuna, ja
                käyttäjä vastaisi samaan asiaan kahdesti eri sanoilla. */}
            <div className="mt-4">{prefBlock}</div>

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
                <option value="campaign">Suurin kampanjaetu</option>
              </select>
            </label>
          </div>

          <LayoutGroup>
            <motion.div layout={!reduce} className="mt-4 grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {(naytaKaikki ? jarjestetyt : jarjestetyt.slice(0, NAYTA_ALUKSI)).map((plan, i) => {
                  const cost = annualCost(plan, kwh);
                  const isCheapest = plan.id === cheapestId;
                  const isFox = plan.id === foxId;
                  /* Nostettu kortti ei ole omalla paikallaan hintajärjestyksessä,
                     joten sille ei anneta numeroa vaan tassu. Koska se on
                     poissa numeroinnista, muut kortit numeroidaan juoksevasti
                     eikä listaan jää aukkoa kohtaan, josta se nostettiin. */
                  const nostettu = nostettuId !== null && plan.id === nostettuId;
                  const numero = nostettu ? undefined : nostettuId !== null && i >= 2 ? i : i + 1;
                  const badge: PlanBadge = isCheapest
                    ? {
                        kind: "cheapest",
                        note: isFox
                          ? "Myös Ketun valinta: halvin sekä ensimmäisenä vuonna että kampanjan jälkeen."
                          : undefined,
                      }
                    : isFox
                      ? {
                          kind: "fox",
                          note: "Ei halvin ensimmäisenä vuonna, mutta paras kokonaisuus kun kampanjan jälkeinen hinta lasketaan mukaan.",
                        }
                      : null;
                  /* Vahvuuslause vain merkittömille korteille: merkin rinnalla
                     se veisi tilaa siltä tiedolta, jonka takia kortti klikataan.
                     Jos kortilla ei ole omaa kärkeä, kerrotaan ero halvimpaan
                     — laskettu luku eikä mainoslause. Ks. vahvuudet-kommentti. */
                  const eroKk = cheapestCost === null ? 0 : (cost - cheapestCost) / 12;
                  const vahvuus = badge
                    ? undefined
                    : (vahvuudet.get(plan.id) ??
                      (eroKk >= 0.05
                        ? `+${eroKk.toLocaleString("fi-FI", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} € / kk halvimpaan`
                        : /* Alle viisi senttiä kuussa on pyöristysvirheen kokoinen
                             ero — alle 60 senttiä vuodessa. "+0,02 € / kk" olisi
                             tosi mutta typerä: se saisi kortin näyttämään
                             kalliimmalta ilman että se on sitä.

                             "Sama hinta" ei ole liioittelua vaan sama väite, jonka
                             kortin oma luku jo tekee: molemmissa korteissa lukee
                             yhden desimaalin tarkkuudella sama €/kk. Jos teksti
                             sanoisi jotain muuta, se olisi ristiriidassa kortin
                             oman hintaluvun kanssa. */
                          "Sama hinta kuin halvin"));
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
                        compareDiff={savingsBase === null ? null : savingsBase - cost}
                        minCost={cheapestCost}
                        maxCost={maxShown}
                        rank={numero}
                        pinned={nostettu}
                        strength={sort === "cost" ? vahvuus : vahvuudet.get(plan.id)}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {/*
            NAPPI KERTOO LUKUMÄÄRÄN, EI PELKKÄÄ "NÄYTÄ LISÄÄ".

            "Näytä lisää" ei kerro, onko takana kolme vai kolmekymmentä
            sopimusta, joten kävijä ei tiedä kannattaako painaa. Luku
            vastaa siihen ja samalla todistaa, ettei listaa ole karsittu.

            Nappi on vaimea reunanappi eikä oranssi täyttönappi: sen
            vieressä on kuusi "Tee sopimus" -nappia, ja kirkas laajennusnappi
            veisi klikkejä juuri siltä napilta, joka tuottaa.
          */}
          {!naytaKaikki && filtered.length > NAYTA_ALUKSI && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setNaytaKaikki(true)}
                className="lift flex items-center gap-2 rounded-xl border border-lineDark bg-white px-6 py-3 font-display text-[14.5px] font-bold text-ink"
              >
                Näytä loput {filtered.length - NAYTA_ALUKSI} sopimusta
                <ChevronDown size={16} aria-hidden />
              </button>
              <p className="text-[12.5px] text-ink/55">
                Mikään sopimus ei ole piilossa — lista jatkuu samassa järjestyksessä.
              </p>
            </div>
          )}

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
                  Näillä rajauksilla ei ole yhtään sopimusta
                </p>
                <p className="mt-1.5 max-w-sm text-[14.5px] text-ink/70">
                  Kettu etsi, mutta valitsemasi rajaukset sulkevat kaikki kuusi pois.
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
              {/*
                Tämä varoitus siirtyi tähän, kun läpinäkyvyysosio poistettiin.
                Se on pakko olla siinä ruudussa, jossa euromäärät näkyvät:
                luvut ovat toistaiseksi keksittyjä, ja keksityllä luvulla
                markkinointi on kuluttajansuoja-asia, ei tyylikysymys.
                Rivi katoaa itsestään, kun `isExampleData` käännetään
                epätodeksi oikean datan myötä.
              */}
              {IS_EXAMPLE_DATA && (
                <>
                  {" "}
                  <strong className="font-bold text-ink/75">
                    Hinnat ovat toistaiseksi esimerkkilukuja; tarkista lopullinen hinta
                    sähköyhtiön omilta sivuilta.
                  </strong>
                </>
              )}
            </span>
          </p>
        </div>
      </section>
      )}

      {/*
        PALKISSA ON KETUN VALINTA, EI HALVIN.

        Palkki naytti aiemmin `cheapestPlan`in. Se oli ristiriita sivun
        oman logiikan kanssa: listan ylapuolella Kettu nimeaa YHDEN
        sopimuksen ja perustelee sen nelja kertaa, ja korteissa on sama
        merkki. Jos ruudun alareunassa roikkuva nappi vei eri sopimukseen,
        sivu antoi kaksi eri vastausta samaan kysymykseen — ja kavijalle,
        joka on jo lukenut suosituksen, se nakyy siina etta halvin ja
        suositeltu ovat eri hintaisia ilman selitysta.

        Tuoton kannalta tama on se nappi, jota puhelimessa oikeasti
        painetaan: se on ainoa, joka on peukalon ulottuvilla koko
        vertailun ajan. Sen on vietava siihen sopimukseen, jonka sivu on
        perustellut.
      */}
      {showResults && <EnergyStickyBar plan={recommendedPlan} kwh={kwh} anchor={resultsRef} />}
    </>
  );
}

/**
 * ISO VALINTAPAINIKE — kyselyn koko käytettävyys lepää tämän varassa.
 *
 * MIKSI NÄIN ISO: kohderyhmän vanhin pää käyttää sivua puhelimella
 * ilman lukulaseja. Vanha vaihtoehtonappi oli 13 px tekstiä 2,5 rivin
 * korkuisessa laatikossa — luettavissa, mutta juuri ja juuri, ja
 * kosketuskohde jäi alle suositellun 44 px:n. Tässä rivin korkeus on yli
 * 68 px, otsikko 17 px ja perustelu 14 px.
 *
 * MIKSI RASTI OIKEASSA REUNASSA: pelkkä värinvaihto ei riitä kertomaan
 * valintaa. Osa käyttäjistä ei erota persikkaa hiekasta, ja moni epäilee
 * ylipäätään menikö klikki perille. Erillinen rastiympyrä sanoo saman
 * asian muodolla eikä värillä — se on sekä esteettömyyssääntö että syy
 * sille, ettei käyttäjä klikkaa samaa nappia kolmesti.
 *
 * SIIRTYMÄSTÄ EI PÄÄTETÄ TÄÄLLÄ. Tämä nappi vain ilmoittaa valinnasta;
 * mahdollisen automaattisen siirtymän käynnistää kutsuva kohta omassa
 * `onClick`-käsittelijässään. Näin sama nappi kelpaa sekä kysymykseen 1,
 * jossa valinta vie suoraan eteenpäin, että kysymyksiin 3 ja 4, joissa
 * edetään "Jatka"-napilla.
 *
 * Kummassakin tapauksessa rasti ehtii näkyä ennen kuin mitään muuta
 * tapahtuu — se on tämän napin tehtävä. Ruutu, joka vaihtuu ennen kuin
 * käyttäjä on nähnyt valintansa rekisteröityneen, jättää hänet
 * epätietoiseksi siitä mitä äsken tapahtui, ja se koskee erityisesti
 * kohderyhmän vanhinta päätä.
 */
function BigOption({
  icon: Icon, title, hint, selected, onClick,
}: {
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  title: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      /* Puhelimessa tiiviimpi: gap-3, py-3.5 ja 40 px ikoni. Nelja
         vaihtoehtoa allekkain oli 88 px kappale, eli listan loppu jai
         ruudun alareunan taakse eika kayttaja nahnyt etta valinta on
         tehty. Kosketuskohde on tiivistettynakin yli 60 px korkea. */
      className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all active:scale-[0.99] sm:gap-4 sm:px-5 sm:py-4 ${
        selected
          ? "border-accent bg-accentSoft shadow-card"
          : "border-line bg-mist hover:border-lineDark hover:bg-night"
      }`}
    >
      {Icon && (
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors sm:h-12 sm:w-12 ${
            selected ? "bg-accent text-onEmber shadow-ember" : "border border-line bg-white text-ink/45"
          }`}
        >
          <Icon size={22} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className={`block font-display text-[16px] font-bold leading-tight sm:text-[17px] ${
            selected ? "text-accentDark" : "text-ink"
          }`}
        >
          {title}
        </span>
        {hint && (
          <span className="mt-0.5 block text-[13.5px] leading-snug text-ink/60 sm:mt-1 sm:text-[14px]">{hint}</span>
        )}
      </span>
      <span
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors sm:h-7 sm:w-7 ${
          selected ? "border-accent bg-accent text-onEmber" : "border-lineDark bg-white"
        }`}
        aria-hidden
      >
        {selected && <Check size={15} strokeWidth={3} />}
      </span>
    </button>
  );
}
