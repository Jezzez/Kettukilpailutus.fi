import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/home/Eyebrow";

/*
  OSION OTSIKKO — YKSI KESKITETTY KUORI, JOTA JOKAINEN OSIO KÄYTTÄÄ.

  MIKÄ ONGELMA TÄMÄ RATKAISEE. Etusivun jokainen osio kirjoitti oman
  otsikkonsa itse: yksi latoi pikkuotsikon ja otsikon vasemmalle, toinen
  asetti otsikon ja "Kaikki oppaat" -linkin riviin, kolmas rajasi leveyden
  `max-w-[20ch]`:llä ja neljäs `max-w-[18ch]`:llä. Yksikään ero ei ollut
  päätös. Ne syntyivät siitä, että osiot kirjoitettiin eri päivinä, ja
  lopputulos oli sivu, jossa joka osio alkaa hieman eri kohdasta ja hieman
  eri kokoisena. Juuri se lukee kävijälle "tehty eri käsillä", ja se on
  sama arvio kuin "en luota näihin lukuihin".

  MIKSI KESKITETTY. Keskitetty otsikko antaa osiolle selvän alun: silmä
  löytää sen ilman etsimistä, koska se on aina samassa kohdassa vaakasuunnassa
  riippumatta siitä, kuinka pitkä otsikko on. Vasemmalle ladottu otsikko
  alkaa samasta kohdasta, mutta sen *paino* siirtyy tekstin pituuden mukaan,
  eikä osioiden rajaa lue yhtä nopeasti.

  MITÄ TÄSTÄ EI TEHDÄ KESKITETTYNÄ. Vain pikkuotsikko, iso otsikko ja
  lyhyt johdantolause. Leipätekstikappaleet, listat ja taulukot latoutuvat
  osioissa vasemmalle. Keskitetyssä kappaleessa jokaisen rivin alku on eri
  kohdassa, joten silmän on etsittävä se joka rivillä uudestaan. Otsikossa
  se ei haittaa, koska rivejä on yksi tai kaksi; neljän rivin kappaleessa
  se on mitattavaa hidastetta. Tämä raja on tarkoituksellinen, ei unohdus.

  `max-w` ON `ch`-YKSIKÖISSÄ JA OTSIKOSSA ITSESSÄÄN, ei kääreessä.
  `ch` laskee vanhemman fonttikoon mukaan, joten kääreeseen kirjoitettuna
  se laskettaisiin leipätekstistä ja rajaisi ison otsikon aivan liian
  kapeaksi.
*/

export default function SectionHead({
  eyebrow,
  title,
  lead,
  onEmber = false,
  children,
}: {
  /** Kultainen versaalirivi otsikon yllä. Kertoo mistä osiosta on kyse. */
  eyebrow: string;
  /** Osion iso otsikko. Yksi lause, korkeintaan kaksi. */
  title: ReactNode;
  /** Vapaaehtoinen johdantolause. Lyhyt: tämä on keskitetty. */
  lead?: ReactNode;
  /** Oranssilla vyöllä värit kääntyvät. Ks. ember-ansa (DESIGN.md). */
  onEmber?: boolean;
  /** Otsikon alle tuleva vapaa sisältö, esim. painike. Keskitetty. */
  children?: ReactNode;
}) {
  return (
    <Reveal>
      <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
        <Eyebrow onEmber={onEmber}>{eyebrow}</Eyebrow>

        {/*
          OTSIKON KOKO ON SAMA JOKA OSIOSSA. `clamp(2rem, 6vw, 3.2rem)` oli
          jo kolmessa osiossa neljästä, joten tämä ei ole uusi skaala vaan
          se, joka oli enemmistössä. Neljäs osio oli 0,4rem isompi ilman
          syytä, ja isompi otsikko lukee tärkeämmäksi osioksi.
        */}
        <h2
          className={`mt-4 max-w-[22ch] font-hero text-[clamp(2rem,6vw,3.2rem)] leading-[0.98] ${
            onEmber ? "text-onEmber" : ""
          }`}
        >
          {title}
        </h2>

        {lead && (
          <p
            className={`mt-5 max-w-[56ch] text-[17px] leading-relaxed ${
              onEmber ? "text-onEmber/85" : "text-ink/70"
            }`}
          >
            {lead}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>
    </Reveal>
  );
}
