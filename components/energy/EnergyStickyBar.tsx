"use client";

import { useEffect, useState } from "react";
import type { ElectricityPlan } from "@/lib/energy";
import { annualCost } from "@/lib/energy";
import AffiliateButton from "../AffiliateButton";

/**
 * Mobiilin tulospalkki.
 *
 * MIKSI TÄMÄ ON OLEMASSA: puhelimessa kortit luetaan yksi kerrallaan, ja
 * laskurin tuottama euromäärä katoaa näkyvistä heti ensimmäisen kortin
 * jälkeen. Kun kävijä on kuudennen kortin kohdalla, hän ei enää muista,
 * paljonko halvin maksoi — eikä jaksa vierittää takaisin. Tuloksen
 * pitäminen ruudulla on juuri se, mitä tuottavat vertailusivut tekevät
 * (Compare the Market, sahkon-kilpailutus.fi): tärkein luku ja tärkein
 * nappi eivät koskaan poistu peukalon ulottuvilta.
 *
 * MIKSI SE KORVAA ALANAVIGAATION EIKÄ ASETU SEN PÄÄLLE: kaksi kiinteää
 * palkkia söisi noin 130 px eli viidenneksen puhelimen ruudusta, ja juuri
 * sen verran vähemmän vertailua näkyisi kerralla. Sitä paitsi alanavigaatio
 * tarjoaa tässä kohdassa neljä poistumistietä (Kortit, Oppaat, Tietoa)
 * juuri sillä hetkellä, kun kävijän pitäisi verrata sähkösopimuksia.
 * Vertailun sisällä navigaatio on siis suoraan pois tuotosta. Navigointi
 * on yhä saatavilla ylävalikosta ja footerista.
 *
 * MIKSI PALKISSA LUKEE HINTA EIKÄ SÄÄSTÖ: säästöluku on olemassa vain, jos
 * kävijä on syöttänyt oman hintansa. Keksittyä vertailukohtaa ("säästät
 * 340 €") ei käytetä, joten palkissa on aina se luku, joka on oikeasti
 * laskettu — halvimman sopimuksen kuukausihinta hänen kulutuksellaan.
 */
export default function EnergyStickyBar({
  plan,
  kwh,
  /** Elementti, jonka ohi vierittäminen näyttää palkin (tuloslistan alku). */
  anchor,
}: {
  plan: ElectricityPlan | null;
  kwh: number;
  anchor: React.RefObject<HTMLElement>;
}) {
  const [show, setShow] = useState(false);

  /*
    Näkyvyys mitataan vierityskuuntelijalla eikä IntersectionObserverilla.
    IO:n takaisinkutsu on selaimissa aikataulutettu löyhästi, ja taustalla
    olevassa välilehdessä se voi jäädä laukeamatta kokonaan — palkki jäisi
    silloin satunnaisesti pois näkyvistä. Yksi getBoundingClientRect
    animaatiokehystä kohti on tässä täysin merkityksetön kuorma, ja
    lopputulos on ennustettava.
  */
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = anchor.current;
      if (!el) return;
      // Palkki tulee esiin vasta kun tuloslistan otsikko on kadonnut ruudun
      // yläpuolelle. Näin se ei koskaan peitä laskuria sitä täytettäessä.
      setShow(el.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [anchor]);

  /*
    Alanavigaation piilotus tehdään dokumentin data-attribuutilla, koska
    MobileNav on eri puussa (layout) eikä jaettua tilaa ole. Sääntö on
    yhdessä paikassa globals.css:ssä, jotta tämä ei jää arvoitukseksi.
  */
  useEffect(() => {
    const root = document.documentElement;
    if (show) root.setAttribute("data-cta-bar", "on");
    else root.removeAttribute("data-cta-bar");
    return () => root.removeAttribute("data-cta-bar");
  }, [show]);

  if (!plan) return null;

  const monthly = annualCost(plan, kwh) / 12;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/50">
            Edullisin kulutuksellasi
          </p>
          <p className="flex items-baseline gap-1.5 truncate">
            <span className="font-display font-data font-price text-[21px] font-extrabold leading-tight text-ink">
              {/* Sama tarkkuus kuin kortissa — ks. perustelu PlanCard.tsx */}
              {monthly.toLocaleString("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} €
            </span>
            <span className="text-[12px] font-semibold text-ink/60">/ kk</span>
            <span className="truncate text-[12px] text-ink/55">· {plan.provider}</span>
          </p>
        </div>
        <AffiliateButton
          href={plan.affiliateUrl}
          cardId={plan.id}
          placement="energy-stickybar"
          className="shrink-0 px-5 py-2.5 text-[14px]"
          /* Palkissa lukee sama teksti kuin kortin napissa. Eri sanamuoto
             saisi kävijän epäilemään, vieko nappi eri paikkaan. */
        >
          Tee sopimus
        </AffiliateButton>
      </div>
    </div>
  );
}
