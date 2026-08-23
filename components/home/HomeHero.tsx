import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { FEATURES } from "@/lib/features";
import { ENERGY_COMPARE } from "@/lib/nav";
import { euro, fiDate, type HomeFacts } from "@/lib/home";

/*
  HERO — SIVUSTON ENSIMMÄINEN RUUTU.

  KAKSI PALSTAA, EI PÄÄLLEKKÄISYYTTÄ. Aiempi versio ankkuroi maskotin
  absoluuttisesti heron oikeaan reunaan ja skaalasi sen heron korkeuden
  mukaan. Koska hero kasvoi sisällön myötä, kuvasta tuli valtava ja se
  valui otsikon päälle: teksti luki turkin päällä eikä kumpaakaan pystynyt
  lukemaan. Nyt kuva on omassa ruudukkopalstassaan ja sillä on kiinteä
  enimmäiskorkeus, joten se ei voi kasvaa tekstin päälle millään
  näyttökoolla.

  OTSIKON LEVEYS RAJATAAN OTSIKOSTA, EI KÄÄREESTÄ. `ch`-yksikkö laskee
  vanhemman fonttikoon mukaan. Kun `max-w-[16ch]` oli kääreessä, se
  laskettiin 16 pikselin leipätekstistä eli noin 160 pikseliksi, ja koko
  tekstipalsta kutistui siihen 90 pikselin otsikon alla. Raja kuuluu siis
  h1-elementille itselleen.

  MIKSI TÄSSÄ EI OLE LASKURIA. Juuressa on hub, ei vertailusivu. Kysely ja
  tuloslista ovat `/sahkosopimukset`-sivulla portin takana (ks. CLAUDE.md),
  ja hubin tehtävä on saattaa kävijä sinne, ei kilpailla sen kanssa.
*/

export default function HomeHero({ facts }: { facts: HomeFacts }) {
  const stats = [
    { value: String(facts.planCount), label: `sopimusta ${facts.providerCount} yhtiöltä` },
    { value: euro(facts.maxSpread), label: "suurin ero halvimman ja kalleimman välillä" },
    { value: "0 €", label: `vertailu maksaa, hinnat ${fiDate(facts.priceDate)}` },
  ];

  return (
    <section className="theme-ember ember-surface relative overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-[1180px] items-center gap-10 px-4 pb-16 pt-14 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:gap-8 md:pb-20 md:pt-20">
        <Reveal>
          <p className="font-display text-[12px] font-bold uppercase tracking-[0.18em] text-onEmber/70">
            Kilpailutuspalvelu
          </p>

          <h1 className="mt-4 max-w-[11ch] font-hero text-[clamp(2.6rem,7.5vw,4.6rem)] leading-[0.95] text-onEmber">
            Ketuttaako maksaa liikaa?
          </h1>

          <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-onEmber/85 sm:text-[19px]">
            Anna Ketun kilpailuttaa. Sähkösopimukset ja lainat samasta
            paikasta, ilmaiseksi ja selvällä suomella.
          </p>

          {/*
            ENSISIJAINEN NAPPI ON KERMANVALKOINEN, EI ORANSSI. Oranssilla
            vyöllä oranssi nappi on sama väri kuin pohja. Vaalea nappi on
            ruudun ainoa vaalea piste, ja juuri se on koko vyön tarkoitus.

            Mobiilissa napit ovat pinossa ja täysleveät: vierekkäin ne
            jäisivät 390 pikselin leveydellä alle 44 pikselin
            kosketusalueeseen.
          */}
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

        {/*
          MASKOTTI OMASSA PALSTASSAAN. Mobiilissa kuva tulee tekstin ALLE
          eikä sen taakse, ja se on matala (maks. 240 px): vaakakuva vie
          puhelimessa vähemmän pystytilaa kuin pystykuva, joten napin ja
          seuraavan osion väliin ei synny tyhjää ruudullista.
        */}
        <Reveal delay={0.08} className="order-last">
          <Image
            src="/kettu-rantatuoli.webp"
            alt="Kettu istuu rantatuolissa ja hoitaa kilpailutuksen puolestasi"
            width={1432}
            height={1016}
            priority
            className="mx-auto h-auto max-h-[240px] w-auto object-contain md:max-h-[420px]"
          />
        </Reveal>
      </div>

      {/*
        LUKURIVI ON HERON POHJALLA, KULTAISEN VIIVAN ALLA.

        MIKSI EI CHIPPEINÄ: chipit muodostivat oman laatikkorivinsä ja
        veivät saman pystytilan kuin kokonainen kappale. Viivan alle
        ladottu rivi lukee allekirjoituksena — se on siellä, mutta se ei
        kilpaile napin kanssa.

        LUVUT TULEVAT DATASTA, EIVÄT TÄSTÄ TIEDOSTOSTA. Rivi ei lupaa
        mitään, se kertoo mitä on jo tehty, ja jokainen luku on
        tarkistettavissa.
      */}
      <div className="relative z-10 mx-auto max-w-[1180px] px-4 pb-16 sm:px-6 md:pb-20">
        <Reveal delay={0.12}>
          <div className="gold-rule" />
          <dl className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-hero text-[1.9rem] leading-none text-onEmber sm:text-[2.2rem]">
                  {s.value}
                </dt>
                <dd className="mt-2 max-w-[26ch] text-[13px] leading-snug text-onEmber/70">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
