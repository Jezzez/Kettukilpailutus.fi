import type { Metadata } from "next";
import Link from "next/link";
import TrustSection from "@/components/TrustSection";
import Reveal from "@/components/Reveal";
import Kettu from "@/components/mascot/Kettu";

export const metadata: Metadata = {
  title: "Tietoa meistä – näin Kettukilpailutus.fi toimii",
  description:
    "Kettukilpailutus on riippumaton suomalainen kilpailutuspalvelu. Kerromme avoimesti, miten laskenta toimii, miten sopimukset järjestetään ja miten palvelu ansaitsee.",
  alternates: { canonical: "/tietoa" },
};

export default function AboutPage() {
  return (
    <div className="pb-4">
      {/*
        TIETOA-SIVU ON KESKITETTY, EI KAKSIPALSTAINEN.

        MIKSI: tämä on sivuston ainoa sivu, jolla ei myydä mitään — sen
        tehtävä on vastata kysymykseen "keitä te olette ja miksi uskoisin
        teitä". Vasemmalle liimattu tekstipalsta ja oikealla leijuva kettu
        oli sama asettelu kuin vertailusivujen herossa, jossa oikea palsta
        on työkalun tai napin paikka. Täällä siinä ei ollut mitään, joten
        puolet ruudusta oli tyhjää juuri sillä sivulla, jonka pitäisi
        vakuuttaa.

        Keskitetty pylväs lukee toisin: se on lausunto, ei myyntinäkymä.
        Kettu siirtyi tekstin yläpuolelle, jolloin katse kulkee suoraan
        alas hahmosta otsikkoon ja lopulta nappiin — yksi linja, ei kahta
        kilpailevaa.
      */}
      <div className="mx-auto max-w-[1180px] px-4 pt-10 sm:px-6">
        <Reveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            {/*
              KETTU ON 200 PX, EI 300. Kuva on otsikon yläpuolella, joten
              jokainen sen pikseli työntää h1:tä alaspäin. 300 pikselillä
              "Kettu on sinun puolellasi" jäi taitteen alle — sivun ainoa
              lupaus oli piilossa siihen asti, kunnes kävijä vieritti. 200
              pitää sekä hahmon että otsikon ensimmäisessä ruudussa.
            */}
            <div className="mb-5 hidden md:block">
              <Kettu pose="peukku" height={200} priority />
            </div>
            <div>
              <h1 className="font-hero text-[2.25rem] leading-[1.08] text-ink sm:text-[2.75rem]">
                Kettu on sinun puolellasi.
              </h1>
              <p className="mt-5 text-[17px] leading-relaxed text-ink/80">
                Sähkösopimusten, lainojen ja muiden arjen palveluiden vertaileminen on yllättävän vaikeaa. Hinnat ilmoitetaan eri tavoilla, tarjoukset näyttävät hyviltä mutta eivät aina kerro koko totuutta, ja vertailu vie helposti enemmän aikaa kuin pitäisi.
              </p>
              {/*
                KOLME ERILLISTÄ <p>:tä, EI YHTÄ. Tyhjä rivi JSX:n sisällä ei
                tee kappaletta vaan katoaa väliyönniksi, joten yhdessä
                elementissä nämä olisivat renderöityneet yhdeksi pötköksi ja
                viimeinen rivi olisi jäänyt roikkumaan edellisen virkkeen
                perään. Se rivi on sivun iskulause, ja iskulause toimii vain
                jos sen ympärillä on tilaa.
              */}
              <p className="mt-4 text-[17px] leading-relaxed text-ink/80">
                Meidän tavoitteemme on tehdä vertailusta yksinkertaista. Emme halua näyttää
                pelkkiä hintoja tai mainoslauseita – haluamme näyttää, mitä palvelu oikeasti
                maksaa juuri sinun tilanteessasi.
              </p>
              <p className="mt-4 text-[17px] leading-relaxed text-ink/80">
                Jokainen laskelma perustuu samoihin tietoihin, jotta eri vaihtoehtoja voi
                vertailla reilusti.
              </p>
              <p className="mt-4 font-display text-[17px] font-bold leading-relaxed text-accentDark">
                Kettu ei arvaa. Se laskee.
              </p>
              <Link
                href="/"
                className="btn-ember mt-7 inline-flex rounded-xl px-7 py-3.5 font-display text-[15px] font-bold text-onEmber transition-all active:scale-[0.98]"
              >
                Aloita kilpailutus
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-6">
        <TrustSection />
      </div>

      <div className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6">
        <Reveal>
          {/* Sama keskitetty pylväs kuin sivun yläosassa — muuten sivu
              vaihtaisi asettelua puolivälissä. */}
          <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-peach p-7 text-center shadow-card">
            <h2 className="font-display text-xl font-semibold text-ink">Yhteystiedot</h2>
            {/* Osoite oli linkissä eri kuin näkyvässä tekstissä: mailto vei
                osoitteeseen kettu@, vaikka lukija näki info@. Klikkaajan
                viesti olisi mennyt väärään laatikkoon. */}
            <p className="mt-2 text-[15px] leading-relaxed text-ink/80">
              Palaute, korjausehdotukset ja yhteistyötiedustelut:{" "}
              <a href="mailto:info@kettukilpailutus.fi" className="font-semibold text-accentDark underline underline-offset-4">
                info@kettukilpailutus.fi
              </a>
              . Jos huomaat vertailussa vanhentuneen tiedon, kerro siitä niin korjaamme sen.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
