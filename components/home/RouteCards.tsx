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

  KAKSI TÄYSIN IDENTTISTÄ KORTTIA, VIERI VIEREN MYÖS PUHELIMESSA.
  Molemmat rakennetaan samasta `ROUTES`-taulukosta, jolloin niitä ei voi
  vahingossa päästää eri näköisiksi myöhemmissä muokkauksissa.

  MIKSI RINNAKKAIN EIKÄ ALLEKKAIN. Allekkain ladotut kortit eivät ole
  valinta vaan lista: ylempi luetaan oletukseksi ja alempi ohitetaan.
  Vierekkäin ne ovat kysymys, johon on pakko vastata — ja hubin koko
  tuotto syntyy siitä, että kävijä vastaa siihen eikä poistu.

  MIKSI OTSIKOT OVAT "SÄHKÖ" JA "LAINAT". 390 pikselin näytöllä kortin
  sisäleveydeksi jää 141 px. "Sähkösopimukset" katkeaisi kahdelle
  riville ja korttien otsikot olisivat eri korkuiset, jolloin ne eivät
  enää lue pariksi. Lyhyt sana mahtuu, ja yhden sanan pari lukee
  nopeammin kuin kaksi eri mittaista.

  PAINALLUSVIHJE ILMAN HOVERIA. Puhelimessa ei ole hoveria, joten
  klikattavuus pitää näyttää muuten: napissa kulkee hidas kiilto
  (`.sheen`), nuoli nykäisee (`.nudge`), ja kosketuksessa koko kortti
  painuu kasaan (`.press`). Kaikki kolme ovat CSS:ää ja liikuttavat vain
  `transform`ia, eivätkä ne käynnisty lainkaan jos käyttäjällä on
  `prefers-reduced-motion`.

  KOKO KORTTI ON LINKKI, ei vain nappi. Puhelimella kävijä osuu johonkin
  kohtaan korttia paljon todennäköisemmin kuin nappiin, ja ohi mennyt
  klikki hubin ainoassa reittivalinnassa on suoraan menetetty kävijä.
*/

export default function RouteCards({ facts }: { facts: HomeFacts }) {
  /*
    Sähkökortin teksti on ainoa, joka riippuu datasta: sopimusmäärä
    tulee `data/electricity.json`-tiedostosta eikä sitä kirjoiteta käsin.
  */
  const ROUTES = [
    {
      href: ENERGY_COMPARE,
      Icon: Zap,
      title: "Sähkö",
      lead: `${facts.planCount} sopimusta, vuosihinta euroina omalla kulutuksellasi.`,
      note: "Ei yhteystietoja.",
      cta: "Kilpailuta",
    },
    {
      href: "/lainat",
      Icon: HandCoins,
      title: "Lainat",
      lead: "Yksi hakemus, useita pankkeja, tarjoukset rinnakkain.",
      /*
        REHELLINEN RAJAUS HETI KORTISSA. Kettu ohjaa lainoissa
        kumppanille eikä laske mitään itse. Jos kortti antaisi ymmärtää
        muuta, ero paljastuisi heti seuraavalla klikillä, ja
        vertailupalvelun ainoa pääoma on se, ettei mikään paljastu
        myöhemmin.
      */
      note: "Vertailun tekee Sortter.",
      cta: "Vertaile",
    },
  ].filter((r) => r.href === ENERGY_COMPARE || FEATURES.loans);

  return (
    <section className="theme-light bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          <Eyebrow>Mitä kilpailutetaan</Eyebrow>
          <h2 className="mt-4 max-w-[18ch] font-hero text-[clamp(2rem,6vw,3.2rem)] leading-[0.98]">
            Valitse, mitä haluat kilpailuttaa.
          </h2>
        </Reveal>

        {/*
          Ruudukko on kaksisarakkeinen vain jos reittejä on kaksi. Jos
          `FEATURES.loans` sammutetaan, yksinäinen kortti jäisi muuten
          puolikkaan levyiseksi ja näyttäisi siltä, että viereinen on
          jäänyt lataamatta.
        */}
        <div
          className={`mt-10 grid gap-3 sm:gap-5 ${
            ROUTES.length > 1 ? "grid-cols-2" : "max-w-md grid-cols-1"
          }`}
        >
          {ROUTES.map(({ href, Icon, title, lead, note, cta }, i) => (
            <Reveal key={href} delay={i * 0.06} className="h-full">
              <Link
                href={href}
                className="lift press group flex h-full flex-col rounded-2xl border border-line bg-white p-4 shadow-lift sm:p-7 md:p-9"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-peach text-accentDark sm:h-11 sm:w-11">
                  <Icon size={20} strokeWidth={2.2} aria-hidden />
                </span>

                <h3 className="mt-4 font-hero text-[clamp(1.5rem,6.5vw,2.4rem)] leading-tight sm:mt-6">
                  {title}
                </h3>

                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink/70 sm:mt-3 sm:text-[15px]">
                  {lead}{" "}
                  <span className="text-ink/50">{note}</span>
                </p>

                {/*
                  Nappi on `w-full`, jotta molempien korttien napit ovat
                  saman levyiset riippumatta tekstin pituudesta. Eri
                  levyiset napit rikkoisivat parin juuri siinä kohdassa,
                  jossa silmä vertaa vaihtoehtoja.
                */}
                <span className="btn-ember sheen mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-3 font-display text-[14px] font-bold text-onEmber sm:mt-8 sm:gap-2 sm:px-5 sm:py-3.5 sm:text-[15px]">
                  {cta}
                  <ArrowRight
                    size={16}
                    aria-hidden
                    className="nudge transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
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
