import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/home/Eyebrow";
import ServiceCta from "@/components/home/ServiceCta";
import type { Service } from "@/lib/services";

/*
  VERTIKAALIOSION KUORI — KOLME PALVELUA, YKSI RAKENNE.

  MIKÄ ONGELMA TÄMÄ RATKAISEE. Etusivu esitteli aiemmin sähkön omalla
  osiollaan, lainat puolikkaalla kortilla ja vakuutukset ei ollenkaan.
  Se ei ollut päätös vaan kertymä: sähköstä oli eniten kerrottavaa, joten
  se sai eniten tilaa, ja tilasta tuli painotus. Kävijälle sivu näytti
  sähkövertailulta, jossa mainitaan laina — eikä kukaan, joka tuli
  kilpailuttamaan lainan, tunnistanut olevansa oikeassa paikassa.

  MITEN TASAVERTAISUUS PAKOTETAAN. Jokainen kolmesta osiosta on tämä sama
  komponentti: sama pystypadding, sama kaksipalstainen ruudukko, sama
  otsikkokoko, sama paneeli oikealla, sama nappi. Osiot eroavat vain
  sisällöltään. Yhtä osiota ei voi kasvattaa muokkaamatta kaikkia kolmea,
  ja juuri se on tarkoitus.

  MIKSI OIKEALLA ON PANEELI EIKÄ KUVA. Jokaisella palvelulla on eri määrä
  todistettavaa: sähköstä meillä on 24 tarkistettua hintaa, lainoista ei
  yhtään lukua (kuluttajansuojalain 7 luku, ks. lib/loans.ts) ja
  vakuutuksista ei mitään. Jos oikea palsta olisi "todiste", sähkö
  voittaisi sen joka kerta. Paneeli kysyy sen sijaan kysymyksen, johon
  jokaisella kolmella on yhtä hyvä vastaus: mitä täsmälleen tapahtuu, kun
  painan nappia. Sähkössä vastaus sattuu olemaan luku, muissa se on
  kolme askelta — mutta kehys on sama, joten painoarvo on sama.

  MIKSI ANKKURI JA `scroll-mt`. Heron kolme laattaa vievät tänne
  (`#sahko`, `#lainat`, `#vakuutukset`). Header on `sticky` ja 74 px
  korkea, joten ilman `scroll-mt-[74px]` osion otsikko jäisi sen alle
  juuri sillä hetkellä, kun kävijä on tullut lukemaan sen.

  MIKSI EI OMAA "NÄIN SE TOIMII" -OSIOTA. Sellainen kirjoitettiin
  26.8.2026 ja poistettiin samana päivänä tämän tieltä: se kuvasi kolmen
  palvelun kulun yhdellä yleisellä listalla, jolloin jokainen lause piti
  ensin kääntää omalle palvelulle. Askeleet ovat nyt sen palvelun
  vieressä, jota ne koskevat, eikä sivulla ole neljättä kolmen kohdan
  listaa.
*/

export default function VerticalSection({
  service,
  headline,
  lead,
  panelTitle,
  panelNote,
  meta,
  surface,
  children,
}: {
  service: Service;
  /** Osion iso otsikko. Lyhyt, kaksi lausetta korkeintaan. */
  headline: string;
  /** Yksi kappale siitä, miksi tämä palvelu kannattaa kilpailuttaa. */
  lead: string;
  /** Paneelin yläotsikko: kertoo mitä paneelissa on. */
  panelTitle: string;
  /** Pieni lähdeteksti paneelin alla. Sähkössä laskuperuste. */
  panelNote?: string;
  /** Napin alla oleva rajaus: mitä kävijä sitoutuu tekemään ja mitä ei. */
  meta: string;
  /**
   * Taustapinta. Kolme peräkkäistä osiota samalla pinnalla sulautuisi
   * yhdeksi pitkäksi lohkoksi, joten keskimmäinen on usvaa. Ero on niin
   * pieni, ettei se lue arvojärjestykseksi — se erottaa vain rajan.
   */
  surface: "paper" | "mist";
  /** Paneelin rivit. Käytä `PanelList`-kuorta. */
  children: ReactNode;
}) {
  const { Icon } = service;

  return (
    <section
      id={service.key}
      className={`theme-light scroll-mt-[74px] py-16 md:py-24 ${
        surface === "paper" ? "bg-paper" : "bg-mist"
      }`}
    >
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* VASEN PALSTA: mitä tämä on ja mihin painetaan. */}
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-peach text-accentDark">
                <Icon size={21} strokeWidth={2.2} aria-hidden />
              </span>
              <Eyebrow>{service.name}</Eyebrow>
            </div>

            <h2 className="mt-5 max-w-[16ch] font-hero text-[clamp(2rem,6vw,3.2rem)] leading-[0.98]">
              {headline}
            </h2>

            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink/70">
              {lead}
            </p>

            {/*
              KUKA TYÖN TEKEE — SAMA RIVI JOKAISESSA OSIOSSA.

              Kettu laskee sähkön itse, mutta lainoissa kilpailutuksen
              tekee Sortter ja vakuutuksissa tarjouksen antaa POP. Jos
              tasavertainen esitys jättäisi tämän sanomatta, se antaisi
              ymmärtää että vertailemme kaikkia kolmea itse — ja ero
              paljastuisi kävijälle heti seuraavalla klikillä. Se on pahin
              mahdollinen paikka menettää luottamus, koska se on juuri se
              klikki, josta palkkio maksetaan.
            */}
            <p className="mt-4 flex items-start gap-2.5 font-display text-[14px] font-bold text-accentDark">
              <span
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                aria-hidden
              />
              {service.handledBy}
            </p>

            <div className="mt-8">
              <ServiceCta
                name={service.name}
                href={service.href}
                label={service.cta}
                external={service.external}
                placement={`etusivu_${service.key}`}
              />
              <p className="mt-3 text-[13px] text-ink/55">{meta}</p>
            </div>
          </Reveal>

          {/* OIKEA PALSTA: mitä napin takana tapahtuu. */}
          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
              {/*
                KULTAINEN HIUSVIIVA PANEELIN YLÄREUNASSA. Sama ele kuin
                heron lukupaneelissa, eli sivulla on yksi tapa merkitä
                "tässä on faktaa" eikä kolmea.
              */}
              <div className="gold-rule" />
              <div className="p-5 sm:p-7">
                <p className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-ink/45">
                  {panelTitle}
                </p>
                <div className="mt-5">{children}</div>
                {panelNote && (
                  <p className="mt-5 border-t border-lineDark/30 pt-4 text-[12px] leading-relaxed text-ink/50">
                    {panelNote}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Paneelin rivilista.
 *
 * Yhteinen kuori, jotta kolmen osion rivit ovat samalla rytmillä myös
 * silloin kun sisältö on eri (palkkeja vai askeleita). Ensimmäisellä
 * rivillä ei ole yläviivaa, koska paneelin oma reuna on jo siinä.
 */
export function PanelList({ children }: { children: ReactNode }) {
  return (
    <ol className="[&>li]:border-t [&>li]:border-lineDark/30 [&>li]:py-4 [&>li:first-child]:border-t-0 [&>li:first-child]:pt-0 [&>li:last-child]:pb-0">
      {children}
    </ol>
  );
}

/**
 * Askelrivi: numero, otsikko, yksi rivi tekstiä.
 *
 * Käytössä laina- ja vakuutusosiossa. Sähköosio käyttää samaa listaa
 * mutta omilla riveillään, koska siellä rivin oikea reuna on euromäärä.
 */
export function StepRow({
  index,
  title,
  text,
}: {
  index: number;
  title: string;
  text: string;
}) {
  return (
    <li>
      <div className="flex gap-3.5">
        <span className="font-hero text-[15px] tabular-nums leading-6 text-goldInk">
          0{index}
        </span>
        <div>
          <p className="font-display text-[15px] font-bold leading-6">{title}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-ink/65">{text}</p>
        </div>
      </div>
    </li>
  );
}
