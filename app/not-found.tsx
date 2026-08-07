import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Kettu from "@/components/mascot/Kettu";
import TailSweep from "@/components/fox/TailSweep";

/**
 * 404 ON PALUUSIVU, EI VIRHEILMOITUS.
 *
 * MIKSI TÄMÄKIN ON ORANSSI VYÖ: tälle sivulle tullaan yleensä Googlen
 * vanhentuneesta hakutuloksesta tai rikkinäisestä linkistä. Kävijä on
 * siis oikea, maksava kävijä, joka on jo osoittanut kiinnostuksensa —
 * mutta hän on yhden klikin päässä paluunapista. Vaalealla pohjalla
 * "Kilpailuta sähkö" oli yksi vaalea laatikko muiden joukossa; oranssi
 * vyö tekee kermanvalkoisesta napista ruudun ainoan kirkkaan pisteen,
 * eli sen mihin katse menee ennen kuin käsi ehtii selaimen nuoleen.
 *
 * Kettu on paikalla: virhesivu näyttää tehdyltä eikä rikkoutuneelta. Se on
 * brändin puolustus juuri siinä hetkessä, jossa palvelu näyttää huonoimmalta.
 * Asento on rauhallinen seisonta — aiemmin tässä oli osoittava kettu, jonka
 * ele luettiin virhesivulla helposti syyttäväksi ("sinä menit väärään
 * paikkaan"). Se on väärä sävy sivulla, jonka vika on meidän.
 */
export default function NotFound() {
  return (
    <section className="theme-ember ember-surface relative overflow-hidden">
      <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-8 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-goldInk">
              Virhe 404
            </span>
          </div>
          <h1 className="mt-4 font-hero text-[2.4rem] leading-[1.06] text-cream sm:text-[3rem]">
            Tätä sivua Kettu ei löydä.
          </h1>
          <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-ink/85">
            Osoite on voinut muuttua tai sivu on poistettu. Kilpailutus onnistuu silti —
            aloita alta.
          </p>
          {/* Kiinteä `#A83E0A`: `accentDark` kääntyy ember-teemassa kermaksi
              ja teksti katoaisi kermanvalkoisen napin sisään. */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sahkosopimukset"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-cream px-7 py-4 font-display text-[15.5px] font-bold text-[#A83E0A] shadow-lift transition-all hover:bg-[#FFFFFF] active:scale-[0.98]"
            >
              <Zap size={18} aria-hidden /> Kilpailuta sähkö
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-xl border border-cream/45 px-7 py-4 font-display text-[15.5px] font-bold text-cream transition-all hover:border-cream hover:bg-cream/10"
            >
              Etusivulle
            </Link>
          </div>
        </div>
        <div className="halo-glow relative mx-auto hidden md:block">
          <Kettu pose="seisoo" height={440} />
        </div>
      </div>

      <div className="theme-light">
        <TailSweep fill="rgb(var(--c-paper))" height={64} />
      </div>
    </section>
  );
}
