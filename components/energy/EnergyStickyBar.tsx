"use client";

import { useEffect, useState } from "react";
import type { ElectricityPlan } from "@/lib/energy";
import { annualCost } from "@/lib/energy";
import AffiliateButton from "../AffiliateButton";
import FoxPaw from "../FoxPaw";

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
 * laskettu — suositellun sopimuksen kuukausihinta hänen kulutuksellaan.
 *
 * MIKSI PALKISSA ON KETUN VALINTA EIKÄ HALVIN: palkki on sivun ainoa nappi,
 * joka on peukalon ulottuvilla koko vertailun ajan, joten sen on vietävä
 * samaan sopimukseen kuin listan yläpuolella oleva suositus. Kaksi eri
 * vastausta samaan kysymykseen samalla sivulla ei ole valinnanvaraa vaan
 * epäjohdonmukaisuus. Otsikko sanoo sen suoraan: "Ketun valinta", ei
 * "edullisin" — sillä silloin, kun valinta ei ole halvin, väärä otsikko
 * olisi suoraan valheellinen ja kävijä huomaisi sen listaa selatessaan.
 * Ketun valinta on halvin aina kun aineisto on liian pieni valinnan
 * laskemiseen, joten otsikko ei koskaan lupaa liikaa.
 *
 * MIKSI PALKKI ON ORANSSI EIKÄ VAALEA: palkki oli aiemmin läpikuultavan
 * valkoinen, ja vaalealla sivulla se luki selaimen omalta työkalupalkilta —
 * samalta vaalealta reunalta kuin osoiterivi ruudun toisessa päässä. Sivun
 * tärkein nappi ei saa näyttää selaimen osalta. Oranssi pohja on sama
 * #A83E0A kuin heron vyössä ja `themeColor`issa, joten ruudun ylä- ja
 * alareuna kehystävät vertailun samalla värillä ja palkki lukee sivun
 * omaksi pinnaksi.
 *
 * MIKSI SIINÄ ON SAMA SINETTI KUIN KORTISSA: kultainen tassumerkki on se
 * muoto, jonka kävijä on juuri oppinut tunnistamaan listan yläpuolella. Kun
 * palkissa on sama sinetti, se ei ole uusi mainos vaan sama suositus, joka
 * seuraa mukana. Pelkkä versaaliteksti ei tehnyt sitä yhteyttä.
 *
 * MIKSI "KULUTUKSELLASI" PUTOSI POIS: sinetin kanssa rivi kiertyi
 * puhelimessa kahdelle riville ja palkki kasvoi. Sana ei ole tässä
 * välttämätön: palkki ilmestyy vasta kun kävijä on itse syöttänyt
 * asumismuotonsa, ja listan jokainen kortti sanoo sen hänelle jo.
 *
 * MIKSI NAPPI ON KERMA EIKÄ ORANSSI: oranssi nappi oranssilla pohjalla on
 * kaksi lähes samaa sävyä päällekkäin. Nappi kääritään `theme-light`
 * -luokkaan, jolloin `bg-white` piirtyy kermana ja `text-accentDark`
 * tummana oranssina — sama kermanappi kuin sivun muilla oransseilla vöillä
 * (ks. DESIGN.md, ember-ansa).
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

  if (!plan) return null;

  const monthly = annualCost(plan, kwh) / 12;

  return (
    <div
      className={`theme-ember fixed inset-x-0 bottom-0 z-40 bg-paper shadow-[0_-10px_28px_-14px_rgba(74,26,2,0.55)] transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!show}
    >
      {/* Kultainen hiusviiva yläreunassa: sama väri kuin sinetissä, joten
          palkin reuna ja merkki kuuluvat näkyvästi yhteen. Se erottaa palkin
          sisällöstä ilman toista pintaa tai varjoa. */}
      <div className="h-[2px] w-full bg-gold/70" />
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5">
            {/* Sama tumma laatta ja kultainen tassu kuin kortin nauhassa —
                ks. perustelu PlanCard.tsx. */}
            <span className="grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full bg-[#4A2E06] text-gold">
              <FoxPaw size={10} />
            </span>
            <span className="font-display text-[10.5px] font-bold uppercase leading-none tracking-[0.14em] text-goldInk">
              Ketun valinta · arvio
            </span>
          </p>
          <p className="mt-1 flex items-baseline gap-1.5 truncate">
            <span className="font-display font-data font-price text-[21px] font-extrabold leading-tight text-ink">
              {/* Sama tarkkuus kuin kortissa — ks. perustelu PlanCard.tsx */}
              {monthly.toLocaleString("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} €
            </span>
            <span className="text-[12px] font-semibold text-ink/75">/ kk</span>
            <span className="truncate text-[12px] text-ink/70">· {plan.provider}</span>
          </p>
        </div>
        <span className="theme-light shrink-0">
          <AffiliateButton
            href={plan.affiliateUrl}
            cardId={plan.id}
            placement="energy-stickybar"
            variant="inverse"
            className="px-5 py-2.5 text-[14px]"
            /* Palkissa lukee sama teksti kuin kortin napissa. Eri sanamuoto
               saisi kävijän epäilemään, vieko nappi eri paikkaan. */
          >
            Tee sopimus
          </AffiliateButton>
        </span>
      </div>
    </div>
  );
}
