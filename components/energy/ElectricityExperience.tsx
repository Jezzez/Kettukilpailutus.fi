"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  Building2, Flame, Home, House, Info, Leaf, Plug, RefreshCw, ShieldCheck, Timer, TrendingDown, Wallet, X,
} from "lucide-react";
import type { ElectricityPlan } from "@/lib/energy";
import { annualCost, ASSUMED_SPOT_AVG, DWELLINGS, PRICE_DATE } from "@/lib/energy";
import PlanCard, { type PlanBadge } from "./PlanCard";
import SpotCurve from "./SpotCurve";
import SpotPriceLive from "./SpotPriceLive";
import BrushRule from "../BrushRule";

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
  const [kwh, setKwh] = useState(initialKwh);
  const [dwelling, setDwelling] = useState<string | null>(
    DWELLINGS.find((d) => d.kwh === initialKwh)?.key ?? null
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

  const cheapestId = filtered.length > 1
    ? [...filtered].sort((a, b) => annualCost(a, kwh) - annualCost(b, kwh))[0].id
    : null;

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
  const headlineSaving = useCountUp(savingsBase === null ? 0 : Math.max(0, savingsBase - cheapestCost));
  const cheapestMonthly = useCountUp(cheapestCost / 12);

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

  const estimator = (dark: boolean) => (
    <div
      className={
        dark
          ? "rounded-2xl border border-line bg-white p-5 shadow-lift sm:rounded-[20px] sm:p-7"
          : "rounded-2xl border border-line bg-white p-5 shadow-card sm:rounded-[20px] sm:p-7"
      }
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-display text-[15.5px] font-bold text-ink">Millaisessa asunnossa asut?</p>
        <span className="hidden font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45 sm:block">
          Askel 1 / 2
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
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

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-4">
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
            onChange={(e) => { setKwh(Math.max(0, Number(e.target.value))); setDwelling(null); }}
            className="w-28 rounded-xl border border-lineDark bg-mist px-3 py-2 text-right font-data text-[15px] font-bold text-ink transition-colors focus:border-accent focus:outline-none"
          />
          <span className="text-[13px] font-medium text-ink/60">kWh / v</span>
        </div>
        <span className="text-[12px] text-ink/55">Luku löytyy sähkölaskustasi.</span>
      </div>

      {/* Nykyinen sopimus: tekee säästöluvusta oman, ei markkinointiluvun */}
      <div className="mt-4 border-t border-line pt-4">
        {!showCurrent ? (
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
              <p className="font-display text-[13px] font-bold text-ink/85">Nykyinen sopimuksesi</p>
              <button
                onClick={() => { setShowCurrent(false); setCurPrice(""); setCurBasic(""); }}
                className="inline-flex items-center gap-1 text-[12px] text-ink/60 hover:text-ink"
              >
                <X size={13} aria-hidden /> Piilota
              </button>
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
                  className="w-24 rounded-xl border border-lineDark bg-mist px-3 py-2 text-right font-data text-[15px] font-bold text-ink placeholder:font-normal placeholder:text-ink/35 focus:border-accent focus:outline-none"
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
                  className="w-24 rounded-xl border border-lineDark bg-mist px-3 py-2 text-right font-data text-[15px] font-bold text-ink placeholder:font-normal placeholder:text-ink/35 focus:border-accent focus:outline-none"
                />
                <span className="text-[13px] text-ink/60">€/kk perusmaksu</span>
              </div>
            </div>
            <p className="mt-2 text-[12px] text-ink/55">
              Molemmat luvut näkyvät sähkölaskusi erittelyssä kohdassa &quot;sähköenergia&quot;.
            </p>
          </div>
        )}
      </div>
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
        <section className="theme-light dawn-surface relative overflow-hidden pb-28 pt-9 md:pb-28 md:pt-12">
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
                <h1 className="mt-4 max-w-[13ch] font-hero text-[2.5rem] leading-[1.03] text-ink sm:max-w-[14ch] sm:text-[3.3rem] md:text-[3.75rem]">
                  Halvin sähkö löytyy{" "}
                  <em className="text-accentDark">laskemalla</em>, ei
                  arvaamalla.
                </h1>

                <p className="mt-5 max-w-[46ch] text-[15.5px] leading-relaxed text-ink/70 sm:text-[16.5px]">
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
                  <ul className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-5">
                    {[
                      { icon: Plug, text: "Sähkö ei katkea" },
                      { icon: RefreshCw, text: "Vanha sopimus irtisanotaan puolestasi" },
                      { icon: Timer, text: "Vie noin 5 minuuttia" },
                    ].map((t) => (
                      <li key={t.text} className="flex items-center gap-2 text-[13.5px] font-medium text-ink/70">
                        <t.icon size={15} className="shrink-0 text-ink/40" aria-hidden />
                        {t.text}
                      </li>
                    ))}
                  </ul>
                  <div className="dawn-glow relative -mb-10 -mt-3 shrink-0 md:hidden">
                    <Image
                      src="/kettu-osoittaa.webp"
                      alt="Kettu, Kettukilpailutuksen maskotti"
                      width={416}
                      height={1000}
                      priority
                      className="relative h-[152px] w-auto drop-shadow-[0_14px_24px_rgba(60,45,30,0.22)]"
                    />
                  </div>
                </div>

                {/*
                  Mobiilissa herossa ei ollut lainkaan näkyvää toimintakehotusta.
                  Nappi on koko leveydeltä, koska peukalo osuu siihen varmasti.
                */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <a
                    href="#vertailu"
                    className="btn-ember inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-[15.5px] font-bold text-onEmber md:hidden"
                  >
                    Laske oma hintani
                    <TrendingDown size={16} aria-hidden />
                  </a>
                  <p className="text-[12.5px] text-ink/55">
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
                  className="dawn-glow order-1 hidden shrink-0 md:order-2 md:flex"
                >
                  {/*
                    Poosi "osoittaa", ei "kortti": sähkösivulla maskotti ei voi
                    pidellä luottokorttia — se kertoo väärästä vertikaalista.
                  */}
                  <Image
                    src="/kettu-osoittaa.webp"
                    alt="Kettu, Kettukilpailutuksen maskotti"
                    width={416}
                    height={1000}
                    priority
                    className="relative h-[400px] w-auto drop-shadow-[0_26px_40px_rgba(60,45,30,0.20)] lg:h-[430px]"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          <SpotCurve className="pointer-events-none absolute inset-x-0 bottom-0 opacity-40" />
        </section>

        {/*
          Laskuri on puhtaan valkoinen kortti kermanvärisen heron päällä.
          Se on ruudun kirkkain pinta, joten katse osuu työkaluun eikä
          otsikkoon — ja työkalun käyttö on ainoa polku palkkioklikkiin.
        */}
        <div
          id="vertailu"
          className="theme-light relative z-10 mx-auto -mt-20 max-w-[1180px] scroll-mt-24 px-4 sm:px-6 md:-mt-24"
        >
          {estimator(true)}
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

      <section className={`theme-light bg-paper ${withHero ? "pt-14" : "pt-10"}`}>
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          {/* Tulos */}
          <div className="flex flex-wrap items-end justify-between gap-6 rounded-2xl border border-line bg-white px-5 py-6 shadow-card sm:rounded-[20px] sm:px-8 sm:py-7">
            <div>
              <p className="flex items-center gap-2 font-display text-[11.5px] font-bold uppercase tracking-[0.16em] text-accentDark">
                <TrendingDown size={14} aria-hidden /> Askel 2 / 2 · tuloksesi
              </p>
              <p className="mt-3 font-hero text-[2rem] leading-[1.1] text-ink sm:text-[2.5rem]">
                Edullisin sopimus{" "}
                <span className="font-display font-data font-extrabold tracking-tight text-accent">
                  {cheapestMonthly.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} €
                </span>
                /kk
              </p>
              <p className="mt-2 text-[14px] text-ink/60">
                {kwh.toLocaleString("fi-FI")} kWh vuosikulutuksella · {plans.length} sopimusta laskettu
              </p>
            </div>
            {alreadyGood ? (
              <div className="pelt-surface w-full max-w-sm rounded-2xl border border-gold/35 px-6 py-5 shadow-card sm:rounded-[20px]">
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
                    <button
                      onClick={() => setType(advice.type)}
                      className="btn-ember shrink-0 rounded-xl px-5 py-2.5 font-display text-[13.5px] font-bold text-onEmber transition-all active:scale-[0.98]"
                    >
                      Näytä nämä sopimukset
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

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13.5px] text-ink/70" aria-live="polite">
              {filtered.length} sopimusta
            </p>
            <label className="flex items-center gap-2 text-[13px] text-ink/70">
              Järjestä
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-xl border border-line bg-white px-3 py-2 font-display text-[13px] font-semibold text-ink transition-colors hover:border-lineDark focus:border-accent focus:outline-none"
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
                {filtered.map((plan) => {
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
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {filtered.length === 0 && (
            <div className="mt-4 rounded-3xl border border-dashed border-line bg-white p-12 text-center">
              <p className="font-display text-lg font-bold text-ink">
                Näillä rajauksilla ei löydy sopimuksia
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-[14.5px] text-ink/70">
                Poista uusiutuva-rajaus tai valitse toinen sopimustyyppi.
              </p>
              <button
                onClick={() => { setType(null); setGreenOnly(false); }}
                className="btn-ember mt-5 rounded-xl px-6 py-3 font-display text-[14px] font-bold text-onEmber transition-all active:scale-[0.98]"
              >
                Näytä kaikki sopimukset
              </button>
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
