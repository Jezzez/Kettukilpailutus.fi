import type { Metadata } from "next";
import Link from "next/link";
import TrustSection from "@/components/TrustSection";
import Reveal from "@/components/Reveal";
import Kettu from "@/components/mascot/Kettu";

export const metadata: Metadata = {
  title: "Tietoa meistä – näin Kettukilpailutus toimii",
  description:
    "Kettukilpailutus on riippumaton suomalainen kilpailutuspalvelu. Kerromme avoimesti, miten laskenta toimii, miten sopimukset järjestetään ja miten palvelu ansaitsee.",
  alternates: { canonical: "/tietoa" },
};

export default function AboutPage() {
  return (
    <div className="pb-4">
      <div className="mx-auto max-w-[1180px] px-4 pt-14 sm:px-6">
        <Reveal>
          <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="font-hero text-[2.25rem] leading-[1.08] text-ink sm:text-[2.75rem]">
                Kettu on sinun puolellasi.
              </h1>
              <p className="mt-5 max-w-prose text-[17px] leading-relaxed text-ink/80">
                Kettukilpailutus syntyi yksinkertaisesta havainnosta: arjen sopimusten
                vertailu on Suomessa tehty tarpeettoman vaikeaksi. Hinnat esitetään sentteinä
                kilowattitunnilta, ehdot ovat pitkiä ja vertailusivujen järjestykseen ei voi luottaa.
              </p>
              <p className="mt-4 max-w-prose text-[17px] leading-relaxed text-ink/80">
                Me teemme sen toisin: hinnat lasketaan euroina sinun omilla luvuillasi,
                laskukaava on nähtävissä ja kerromme suoraan, miten ansaitsemme. Sähkösopimukset
                ja luottokortit ovat ensimmäiset kilpailutuksemme — lainat, vakuutukset ja
                nettiliittymät seuraavat.
              </p>
              <Link
                href="/sahkosopimukset#vertailu"
                className="btn-ember mt-7 inline-flex rounded-xl px-7 py-3.5 font-display text-[15px] font-bold text-onEmber transition-all active:scale-[0.98]"
              >
                Kilpailuta sähkösopimus
              </Link>
            </div>
            <div className="hidden justify-center md:flex">
              <Kettu pose="peukku" height={360} />
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-6">
        <TrustSection />
      </div>

      <div className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-line bg-peach p-7 shadow-card">
            <h2 className="font-display text-xl font-semibold text-ink">Yhteystiedot</h2>
            <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-ink/80">
              Palaute, korjausehdotukset ja yhteistyötiedustelut:{" "}
              <a href="mailto:kettu@kettukilpailutus.fi" className="font-semibold text-accentDark underline underline-offset-4">
                kettu@kettukilpailutus.fi
              </a>
              . Jos huomaat vertailussa vanhentuneen tiedon, kerro siitä — korjaamme sen nopeasti.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
