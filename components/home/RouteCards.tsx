import Link from "next/link";
import { ArrowRight, Zap, HandCoins } from "lucide-react";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/home/Eyebrow";
import { FEATURES } from "@/lib/features";
import { ENERGY_COMPARE } from "@/lib/nav";
import type { HomeFacts } from "@/lib/home";

/*
  REITIT — HUBIN VARSINAINEN TEHTÄVÄ.

  Juuressa oleva sivu ei vertaile mitään. Sen ainoa työ on kysyä "kumpi
  sinua koskee" ja päästää kävijä eteenpäin yhdellä klikillä. Siksi tämä
  osio on heti heron alla, ennen yhtäkään perustelua: kävijä, joka jo
  tietää haluavansa kilpailuttaa sähkön, ei saa joutua selaamaan
  myyntipuheen läpi päästäkseen sinne.

  KAKSI SAMANKOKOISTA KORTTIA. Aiempi versio oli epäsymmetrinen (3:2) ja
  se työntyi negatiivisella marginaalilla heron oranssin reunan yli. Ele
  näytti virheeltä, ei valinnalta: kortit leikkasivat vyön rajan
  epätasaisesti eikä kumpikaan reuna ollut suora. Sama painotus saadaan
  ilman temppuja — sähkökortti on valkoinen ja siinä on oranssi nappi,
  lainakortti on hillitty ja siinä on tekstilinkki. Silmä lukee painotuksen
  kontrastista, ei koosta.

  KOKO KORTTI ON LINKKI, ei vain nappi. Puhelimella kävijä osuu johonkin
  kohtaan korttia paljon todennäköisemmin kuin nappiin, ja ohi mennyt
  klikki hubin ainoassa reittivalinnassa on suoraan menetetty kävijä.
*/

export default function RouteCards({ facts }: { facts: HomeFacts }) {
  return (
    <section className="theme-light bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          <Eyebrow>Mitä kilpailutetaan</Eyebrow>
          <h2 className="mt-4 max-w-[18ch] font-hero text-[clamp(2rem,6vw,3.2rem)] leading-[0.98]">
            Valitse, mitä haluat kilpailuttaa.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal>
            <Link
              href={ENERGY_COMPARE}
              className="lift group flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-lift sm:p-9"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-peach text-accentDark">
                <Zap size={20} strokeWidth={2.2} aria-hidden />
              </span>

              <h3 className="mt-6 font-hero text-[clamp(1.6rem,4.5vw,2.1rem)] leading-tight">
                Sähkösopimukset
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/70">
                Kerro asumismuoto, niin Kettu laskee {facts.planCount} sopimuksen
                vuosihinnan euroina omalla kulutuksellasi. Ei yhteystietoja,
                ei puhelinsoittoja.
              </p>

              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-5 py-3.5 font-display text-[15px] font-bold text-onEmber shadow-ember">
                Kilpailuta sähkö
                <ArrowRight
                  size={17}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Reveal>

          {FEATURES.loans && (
            <Reveal delay={0.06}>
              <Link
                href="/lainat"
                className="lift group flex h-full flex-col rounded-2xl border border-line bg-mist p-7 shadow-card sm:p-9"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-goldInk">
                  <HandCoins size={20} strokeWidth={2.2} aria-hidden />
                </span>

                <h3 className="mt-6 font-hero text-[clamp(1.6rem,4.5vw,2.1rem)] leading-tight">
                  Lainat
                </h3>
                {/*
                  REHELLINEN RAJAUS HETI KORTISSA. Kettu ohjaa lainoissa
                  kumppanille eikä laske mitään itse. Jos kortti antaisi
                  ymmärtää muuta, ero paljastuisi heti seuraavalla klikillä,
                  ja vertailupalvelun ainoa pääoma on se, ettei mikään
                  paljastu myöhemmin.
                */}
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/70">
                  Yksi hakemus, useita pankkeja, tarjoukset rinnakkain. Kettu
                  ohjaa sinut Sortterin lainavertailuun eikä vertaile lainoja
                  itse.
                </p>

                <span className="mt-8 inline-flex w-fit items-center gap-2 font-display text-[15px] font-bold text-accentDark">
                  Tutustu lainavertailuun
                  <ArrowRight
                    size={17}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          )}
        </div>

        {/*
          TULOSSA-RIVI. Kaksi vertikaalia näyttää kapealta, ja kapea
          valikoima lukee keskeneräiseltä. Tämä rivi kertoo suunnan
          käyttämättä pystytilaa kokonaiseen osioon, eikä lupaa
          päivämäärää, jota ei ole.
        */}
        <Reveal delay={0.1}>
          <p className="mt-7 text-[13px] text-ink/50">
            Tulossa: vakuutukset ja laajakaista.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
