import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import TailSweep from "@/components/fox/TailSweep";
import PawTrail from "@/components/fox/PawTrail";
import { FEATURES } from "@/lib/features";
import { ENERGY_COMPARE } from "@/lib/nav";

/*
  LOPPUKEHOTUS — SIVUN VIIMEINEN VYÖ.

  MIKSI SAMA KEHOTUS TOISTUU: kävijä, joka on selannut tänne asti, ei
  palaa ylös etsimään nappia. Sivun viimeinen ruutu ennen alatunnistetta on
  halvin mahdollinen paikka toiselle klikille, ja ilman sitä koko selaus
  päättyy alatunnisteen linkkilistaan.

  MIKSI TÄSSÄ EI OLE UUTTA ARGUMENTTIA: kaikki perustelut on jo esitetty.
  Uusi väite tässä kohdassa pakottaisi lukemaan uudelleen juuri silloin,
  kun hän on jo päättänyt. Kehotus toistaa sloganin ja tarjoaa napin.

  EMBER-ANSA: `bg-cream` + kiinteä `text-[#A83E0A]`, ei `text-accentDark`.
*/

export default function ClosingBelt() {
  return (
    <section className="theme-ember ember-surface relative isolate">
      {/* Yläreunan hännänveto: `fill` on edellisen vyöhykkeen väri (usva). */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 rotate-180">
        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-mist))" height={64} />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-10 px-5 pb-20 pt-24 sm:px-8 md:grid-cols-[1.2fr_0.8fr] md:pb-24 md:pt-32 lg:px-10">
        <Reveal>
          <p className="flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-onEmber/80">
            Viisi minuuttia
            <PawTrail count={4} size={9} className="text-onEmber/45" />
          </p>

          <h2 className="mt-5 max-w-[13ch] font-hero text-[clamp(2.5rem,9vw,5rem)] leading-[0.94] text-onEmber">
            Anna Ketun kilpailuttaa.
          </h2>

          <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-onEmber/85 sm:text-[18px]">
            Kysely vie noin viisi minuuttia, eikä se pyydä sinulta
            yhteystietoja. Päätöksen teet itse.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={ENERGY_COMPARE}
              className="lift inline-flex items-center justify-center gap-2 rounded-xl bg-cream px-6 py-4 font-display text-[16px] font-bold text-[#A83E0A] shadow-lift"
            >
              Kilpailuta sähkö
              <ArrowRight size={18} aria-hidden />
            </Link>
            {FEATURES.loans && (
              <Link
                href="/lainat"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-onEmber/40 bg-onEmber/10 px-6 py-4 font-display text-[16px] font-bold text-onEmber transition-colors hover:bg-onEmber/20"
              >
                Vertaile lainoja
              </Link>
            )}
          </div>
        </Reveal>

        {/*
          MASKOTTI NOUSEE VYÖN YLÄREUNAN YLI. Kuva on rajaamattomassa
          osiossa (`isolate`, ei `overflow-hidden`), joten korvat menevät
          hännänvedon päälle. Se on ainoa kohta sivulla, jossa jokin
          rikkoo vyön reunan, ja siksi se lukee tahalliselta.
        */}
        <Reveal delay={0.07} className="relative mx-auto -mt-10 w-full max-w-[260px] md:-mt-24 md:max-w-[320px]">
          <div className="halo-glow relative">
            <Image
              src="/kettu-muotokuva.webp"
              alt="Kettu tervehtii ja odottaa kilpailutuksen aloittamista"
              width={569}
              height={900}
              className="relative mx-auto h-auto max-h-[380px] w-auto object-contain md:max-h-[460px]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
