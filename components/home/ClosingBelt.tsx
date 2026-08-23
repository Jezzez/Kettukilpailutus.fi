import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
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

  KUVA ON OMASSA PALSTASSAAN eikä nouse vyön reunan yli. Aiemmin kuva
  työntyi negatiivisella marginaalilla ulos osiosta, jolloin ketun pää
  leikkautui edellisen osion pohjaan eikä leikkaus näyttänyt tahalliselta
  millään näyttöleveydellä.

  EMBER-ANSA: `bg-cream` + kiinteä `text-[#A83E0A]`, ei `text-accentDark`.
*/

export default function ClosingBelt() {
  return (
    <section className="theme-ember ember-surface relative overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        <Reveal>
          <h2 className="max-w-[14ch] font-hero text-[clamp(2.2rem,6.5vw,3.6rem)] leading-[0.98] text-onEmber">
            Anna Ketun kilpailuttaa.
          </h2>

          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-onEmber/85">
            Kysely vie noin viisi minuuttia, eikä se pyydä sinulta
            yhteystietoja. Päätöksen teet itse.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-onEmber/40 px-6 py-4 font-display text-[16px] font-bold text-onEmber transition-colors hover:bg-onEmber/12"
              >
                Vertaile lainoja
              </Link>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.07} className="order-last">
          <Image
            src="/kettu-muotokuva.webp"
            alt="Kettu tervehtii ja odottaa kilpailutuksen aloittamista"
            width={569}
            height={900}
            className="mx-auto h-auto max-h-[220px] w-auto object-contain md:max-h-[340px]"
          />
        </Reveal>
      </div>
    </section>
  );
}
