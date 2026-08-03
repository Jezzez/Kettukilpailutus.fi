"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

/**
 * Pörssisähkön hinta reaaliajassa.
 *
 * MIKSI TÄMÄ ON SIVUSTOLLA:
 * Elävä, tarkistettavissa oleva luku on vahvin luottamussignaali mitä
 * vertailusivulla voi olla — se todistaa yhdellä silmäyksellä, että sivu on
 * ajan tasalla eikä vuoden vanha SEO-roska. Käyrä opettaa lisäksi
 * pörssisähkön logiikan sekunnissa: hinta heiluu, ja sopimuksen valinta
 * ratkaisee paljonko heilunnasta jää maksettavaksi. Juuri se ymmärrys saa
 * kävijän kilpailuttamaan.
 *
 * REHELLISYYSSÄÄNNÖT — ÄLÄ RIKO NÄITÄ:
 * 1. Jos haku epäonnistuu, komponentti ei renderöi mitään. Ei koskaan
 *    varalukua, keskiarvoa muistista tai "noin"-arviota. Väärä hintaluku on
 *    kuluttajansuojariski ja tuhoaa juuri sen luottamuksen, jonka varassa
 *    affiliate-klikki on.
 * 2. Näytetty luku on pörssin hinta sisältäen alv:n. Se EI ole se, mitä
 *    asiakas maksaa: päälle tulevat myyjän marginaali ja siirtomaksu. Tämä
 *    sanotaan komponentissa ääneen, ei alaviitteessä.
 *
 * LÄHDE: spot-hinta.fi:n avoin rajapinta. Palauttaa vuorokauden hinnat
 * 15 minuutin tarkkuudella (96 riviä), hinnat €/kWh.
 */

type Slot = {
  DateTime: string;
  PriceNoTax: number;
  PriceWithTax: number;
};

type Hour = { hour: number; price: number };

/** €/kWh -> c/kWh suomalaisittain, kaksi desimaalia. */
const toCents = (eurPerKwh: number) =>
  (eurPerKwh * 100).toFixed(2).replace(".", ",");

export default function SpotPriceLive({ className = "" }: { className?: string }) {
  const [hours, setHours] = useState<Hour[] | null>(null);
  const [now, setNow] = useState<{ price: number; hour: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch("https://api.spot-hinta.fi/Today");
        if (!res.ok) throw new Error("http " + res.status);
        const data: Slot[] = await res.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error("tyhjä");

        // 15 min -> tunnit. Tuntikeskiarvo on luettavampi kuin 96 piikkiä,
        // eikä kadota käyrän muotoa, joka on tässä koko pointti.
        const buckets: Record<number, number[]> = {};
        for (const s of data) {
          const h = new Date(s.DateTime).getHours();
          (buckets[h] ||= []).push(s.PriceWithTax);
        }
        const byHour: Hour[] = Object.keys(buckets)
          .map((k) => {
            const hour = Number(k);
            const xs = buckets[hour];
            return { hour, price: xs.reduce((a, b) => a + b, 0) / xs.length };
          })
          .sort((a, b) => a.hour - b.hour);

        // Nykyhetki luetaan tarkasta 15 min rivistä, ei tuntikeskiarvosta.
        const t = Date.now();
        const current =
          data.find((s) => {
            const start = new Date(s.DateTime).getTime();
            return t >= start && t < start + 15 * 60 * 1000;
          }) ?? null;

        if (!alive) return;
        setHours(byHour);
        setNow(
          current
            ? { price: current.PriceWithTax, hour: new Date(current.DateTime).getHours() }
            : null
        );
        setFailed(false);
      } catch {
        if (alive) setFailed(true);
      }
    };

    load();
    // Hinta vaihtuu vartin välein; viiden minuutin väli riittää pitämään
    // luvun oikeana ilman että rajapintaa hakataan turhaan.
    const timer = setInterval(load, 5 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  // Rehellisyyssääntö 1: ei dataa -> ei laatikkoa.
  if (failed || !hours || !now) return null;

  const prices = hours.map((h) => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const cheapest = hours.find((h) => h.price === min)!;
  const belowAvg = now.price < avg;

  return (
    <div
      className={`rounded-2xl border border-line bg-white/80 p-4 shadow-card backdrop-blur ${className}`}
    >
      {/*
        Otsikko omalle rivilleen, hinta ja merkki vasta sen alle.
        MIKSI: aiemmin otsikko ja merkki olivat samalla rivillä, jolloin
        "Alle päivän keskiarvon" leikkautui laatikon reunan yli kapealla
        palstalla. Ulos valuva teksti kertoo lukijalle, ettei sivustoa ole
        viimeistelty — ja juuri tämän laatikon tehtävä on todistaa
        päinvastaista.
      */}
      <p className="flex items-center gap-1.5 whitespace-nowrap font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink/50">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        Pörssisähkö juuri nyt
      </p>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
        <p className="font-data text-[2rem] font-bold leading-none text-ink">
          {toCents(now.price)}
          <span className="ml-1 font-display text-[15px] font-semibold text-ink/55">
            c/kWh
          </span>
        </p>

        <p
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[11.5px] font-bold ${
            belowAvg ? "bg-ok/12 text-ok" : "bg-mist text-ink/70"
          }`}
        >
          {belowAvg ? <TrendingDown size={13} aria-hidden /> : <TrendingUp size={13} aria-hidden />}
          {belowAvg ? "Alle" : "Yli"} keskiarvon
        </p>
      </div>

      {/* 24 h käyrä. Nykyinen tunti oranssina — se on ainoa oranssi elementti
          laatikossa, jotta katse löytää nykyhetken heti. */}
      <div className="mt-4 flex h-14 items-end gap-[3px]" aria-hidden>
        {hours.map((h) => {
          const span = max - min || 1;
          const pct = 18 + ((h.price - min) / span) * 82;
          const isNow = h.hour === now.hour;
          return (
            <span
              key={h.hour}
              style={{ height: `${pct}%` }}
              className={`flex-1 rounded-[2px] transition-colors ${
                isNow ? "bg-accent" : h.price === min ? "bg-ok/45" : "bg-ink/15"
              }`}
            />
          );
        })}
      </div>
      <p className="sr-only">
        Vuorokauden pörssisähkön tuntihinnat. Halvin tunti klo {cheapest.hour}, hinta{" "}
        {toCents(min)} senttiä kilowattitunnilta. Kallein {toCents(max)} senttiä.
      </p>

      <div className="mt-2 flex items-center justify-between font-data text-[11.5px] text-ink/55">
        <span>klo 0</span>
        <span>
          halvin klo {String(cheapest.hour).padStart(2, "0")} · {toCents(min)} c
        </span>
        <span>klo 23</span>
      </div>

      {/*
        Rehellisyyssääntö 2. Tämä rivi on pakollinen: ilman sitä luku lupaa
        halvempaa sähköä kuin kukaan oikeasti maksaa.
      */}
      <p className="mt-3 border-t border-line pt-3 text-[11.5px] leading-relaxed text-ink/55">
        Pörssin hinta sisältää alv:n. Päälle tulevat myyjän marginaali ja
        siirtomaksu — ne näkyvät alla olevassa vertailussa. Lähde: spot-hinta.fi
      </p>
    </div>
  );
}
