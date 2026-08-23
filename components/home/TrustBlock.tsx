import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionMark from "@/components/home/SectionMark";
import FoxPaw from "@/components/FoxPaw";
import type { HomeFacts } from "@/lib/home";

/*
  LÄPINÄKYVYYS — SIVUN AINOA KOHTA, JOSSA PUHUTAAN MEISTÄ.

  MIKSI ANSAINTAMALLI KERROTAAN ETUSIVULLA EIKÄ VAIN "TIETOA MEISTÄ"
  -SIVULLA: kukaan ei avaa sitä sivua. Epäilys syntyy juuri silloin, kun
  kävijä tajuaa vertailusivun ansaitsevan klikeistä, ja se hetki on ennen
  klikkiä, ei sen jälkeen. Jos vastaus on jo luettu etusivulla, epäilys ei
  ehdi muuttua poistumiseksi.

  KOLMAS KOHTA ON TÄRKEIN JA SE ON LASKETTU DATASTA. Vertailussa on
  sopimuksia, joista ei makseta palkkiota, ja niiden määrä tulee suoraan
  `data/electricity.json`:n `partner`-kentästä. Se on ainoa väite tällä
  sivulla, jota kilpailija ei voi kopioida sanomalla samaa: joko rivit ovat
  listassa tai eivät. Jos luku menisi joskus nollaan, lause katoaa
  itsestään eikä jää valheeksi seisomaan.
*/

export default function TrustBlock({ facts }: { facts: HomeFacts }) {
  const points = [
    {
      title: "Palkkio tulee yhtiöltä, ei sinulta",
      body: "Kun teet sopimuksen vertailun kautta, sähköyhtiö maksaa meille välityspalkkion. Sinulle vertailu on ilmainen, eikä hinta ole meidän kauttamme senttiäkään korkeampi.",
    },
    {
      title: "Palkkio ei vaikuta järjestykseen",
      body: "Lista järjestyy ensimmäisen vuoden hinnan mukaan sinun kulutuksellasi. Emme nosta ketään maksua vastaan emmekä käytä arviotähtiä, koska yhdellekään sopimukselle ei ole riippumatonta arviolähdettä.",
    },
    {
      title: "Mukana on myös yhtiöitä, jotka eivät maksa meille",
      body: `Vertailun ${facts.planCount} sopimuksesta ${facts.nonPartnerCount} on sellaisia, joista emme saa euroakaan. Ne ovat listassa siksi, että vertailu, jossa näkyvät vain maksavat yhtiöt, on mainos.`,
    },
  ];

  return (
    <section className="theme-light bg-paper px-5 py-20 sm:px-8 md:py-28 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <SectionMark index="03" total="04">
            Läpinäkyvyys
          </SectionMark>
        </Reveal>

        <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-[0.85fr_1.15fr] md:gap-14">
          <Reveal>
            <h2 className="max-w-[13ch] font-hero text-[clamp(2.3rem,8vw,4.2rem)] leading-[0.96]">
              Kettu kertoo, mistä se saa palkkansa.
            </h2>

            {/*
              MASKOTTI ON TÄSSÄ PIENENÄ JA TEKSTIN VIERESSÄ, ei omalla
              rivillään. Mobiilissa hahmo ei saa omaa ruudullistaan, ks.
              DESIGN.md — brändi näkyy, mutta ei maksa pystytilaa.
            */}
            <div className="dawn-glow relative mt-8 hidden w-full max-w-[280px] md:block">
              <Image
                src="/kettu-naama.webp"
                alt="Kettu katsoo suoraan lukijaan"
                width={852}
                height={935}
                className="relative h-auto w-full object-contain"
              />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <ol className="grid gap-3">
              {points.map((p, i) => (
                <li
                  key={p.title}
                  className="lift rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-peach text-accentDark">
                      <FoxPaw size={15} />
                    </span>
                    <span className="font-hero text-[13px] tabular-nums text-ink/35">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-hero text-[clamp(1.2rem,4.5vw,1.6rem)] leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                    {p.body}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
