import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionMark from "@/components/home/SectionMark";
import TailSweep from "@/components/fox/TailSweep";

/*
  LAINAT — ORANSSI VYÖ SIVUN PUOLIVÄLISSÄ.

  MIKSI TÄMÄ ON VYÖ EIKÄ KORTTI. Sivun rytmi tehdään täysleveillä oransseilla
  vöillä, ja ilman keskimmäistä vyötä heron ja loppukehotuksen väliin jää
  yhtenäinen vaalea jakso, jossa silmällä ei ole mitään mihin laskeutua. Sama
  ele tekee kaksi työtä kerralla: se rytmittää sivun ja nostaa toisen
  vertikaalin näkyviin ilman että se kilpailee sähkön kanssa vaaleilla
  korteilla.

  MIKSI TEKSTI SANOO SUORAAN, ETTEMME VERTAILE ITSE. Kettu ohjaa lainoissa
  kumppanille eikä laske mitään omaa. Jos sivu antaisi ymmärtää muuta, ero
  paljastuisi heti seuraavalla klikillä — ja vertailupalvelun ainoa pääoma on
  se, ettei mikään paljastu myöhemmin. Rehellinen rajaus maksaa tässä
  muutaman klikin ja säästää koko brändin.

  EMBER-ANSA: `text-accentDark` olisi tällä vyöllä vaalea kerma ja `bg-white`
  oranssi. Siksi nappi on `bg-cream` ja sen teksti kiinteä `#A83E0A`.
*/

export default function LoansBelt() {
  return (
    <section className="theme-ember ember-surface relative isolate overflow-hidden px-5 pb-32 pt-24 sm:px-8 md:pb-40 md:pt-32 lg:px-10">
      {/*
        YLÄREUNAN HÄNNÄNVETO. Kaari on käännetty 180 astetta, jolloin se
        piirtyy vyön yläreunaan, ja `fill` on EDELLISEN vyöhykkeen väri
        (hiekka). `theme-light`-kääre pakottaa muuttujan ratkeamaan
        vaaleaksi, vaikka osio itse on ember.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 rotate-180">
        <div className="theme-light">
          <TailSweep fill="#F4EAD9" height={64} />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-8">
        <Reveal>
          <SectionMark index="02" total="04" onEmber>
            Lainat
          </SectionMark>

          <h2 className="mt-6 max-w-[15ch] font-hero text-[clamp(2.3rem,8vw,4.4rem)] leading-[0.96] text-onEmber">
            Älä hae pankki kerrallaan.
          </h2>

          <p className="mt-6 max-w-[50ch] text-[17px] leading-relaxed text-onEmber/85 sm:text-[18px]">
            Yksi hakemus, useita pankkeja, tarjoukset rinnakkain. Kettu ohjaa
            sinut Sortterin lainavertailuun eikä vertaile lainoja itse. Emme
            myönnä lainaa emmekä kysy sinulta mitään tietoja.
          </p>

          <div className="mt-9">
            <Link
              href="/lainat"
              className="lift inline-flex items-center justify-center gap-2 rounded-xl bg-cream px-6 py-4 font-display text-[16px] font-bold text-[#A83E0A] shadow-lift"
            >
              Tutustu lainavertailuun
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </Reveal>

        {/*
          MASKOTTI ON MOBIILISSA PIILOSSA. Rahakettu on 1024×1536, eli
          pystykuva: puhelimessa se veisi lähes koko näytöllisen kesken
          osion, ja lukija joutuisi selaamaan kuvan ohi päästäkseen
          seuraavaan. Desktopissa tilaa on vieressä, joten siellä se on.
        */}
        <Reveal delay={0.07} className="relative mx-auto hidden w-full max-w-[380px] md:block">
          <div className="halo-glow relative">
            <Image
              src="/rahakettu-v2.png"
              alt="Kettu punnitsee lainatarjouksia"
              width={1024}
              height={1536}
              className="relative mx-auto h-auto max-h-[460px] w-auto object-contain"
            />
          </div>
        </Reveal>
      </div>

      <div className="theme-light">
        <TailSweep fill="rgb(var(--c-paper))" height={64} />
      </div>
    </section>
  );
}
