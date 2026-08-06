"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import AffiliateButton from "../AffiliateButton";
import { LOAN_PARTNER } from "@/lib/loans";

/**
 * MOBIILIN KIINTEÄ OHJAUSPALKKI.
 *
 * MIKSI: lainasivulla ei ole työkalua eikä tuloslistaa — ainoa asia,
 * joka tuottaa, on siirtymä kumppanille. Mobiilissa sivun oma nappi
 * katoaa näkyvistä heti ensimmäisellä pyyhkäisyllä, ja sen jälkeen
 * kävijän pitäisi vierittää takaisin ylös tai loppuun asti löytääkseen
 * napin uudelleen. Kiinteä palkki pitää napin ruudulla koko ajan.
 *
 * MIKSI PALKKI PIILOUTUU VÄLILLÄ: se näkyy vain silloin, kun mikään
 * sivun omista napeista ei ole ruudulla. Ilman tätä palkki liukuu
 * suoraan sivun oman ison napin päälle vierityksen aikana — kaksi
 * samaa kehotetta päällekkäin lukee rikkinäiseksi sivuksi, ei
 * tarjoukseksi, ja peittää juuri sen napin jota kävijä oli painamassa.
 *
 * Kohteet merkitään sivulla `data-loan-cta` -määreellä, jotta tämä
 * komponentti ei tarvitse tietoa siitä montako nappia sivulla on.
 *
 * VAIN MOBIILISSA (`md:hidden`): työpöydällä sivu on niin lyhyt, että
 * seuraava nappi on aina alle ruudullisen päässä, eikä kelluva palkki
 * toisi mitään mutta veisi tilaa.
 */
export default function LoanStickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll("[data-loan-cta]"));
    if (targets.length === 0) return;

    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setShow(visible.size === 0);
      },
      /* Pieni marginaali alareunaan: palkki ehtii kadota ennen kuin
         sivun oma nappi nousee sen alta esiin. */
      { rootMargin: "0px 0px -96px 0px" }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  if (!show) return null;

  return (
    <div
      className="theme-light fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-white/95 px-4 py-3 shadow-lift backdrop-blur md:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[13px] font-bold text-ink">
          Tarjoukset usealta pankilta
        </p>
        <p className="truncate text-[11.5px] text-ink/65">Maksuton eikä sido mihinkään</p>
      </div>
      <AffiliateButton
        href={LOAN_PARTNER.url}
        cardId={LOAN_PARTNER.id}
        placement="lainat-sticky"
        className="shrink-0 !px-5 !py-3"
      >
        Hae tarjoukset
        <ArrowRight size={16} aria-hidden />
      </AffiliateButton>
    </div>
  );
}
