import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import PawTrail from "@/components/fox/PawTrail";
import { FEATURES } from "@/lib/features";
import { ENERGY_COMPARE } from "@/lib/nav";
import { euro, fiDate, type HomeFacts } from "@/lib/home";

/*
  HERO — SIVUSTON ENSIMMÄINEN RUUTU.

  KAKSI ASIAA, EI ENEMPÄÄ. Brändihaku tuo tänne ihmisen, joka tietää nimen
  mutta ei sitä, mitä palvelu tekee. Hänelle on vastattava yhdellä
  silmäyksellä ja päästettävä eteenpäin. Siksi herossa ei ole työkalua,
  laskuria eikä tuloslistaa: hub, joka yrittää olla myös vertailusivu,
  hidastaa matkaa sinne missä ansainta oikeasti on.

  MIKSI SLOGAN ON H1. Vaihtoehto oli avainsanarivi ("Kilpailuta
  sähkösopimukset ja lainat"), mutta se sana on jo sivun titlessä ja
  ingressissä, eli hakukone saa sen joka tapauksessa. Ihminen ei saa
  avainsanarivistä mitään: se kertoo mitä sivu myy, ei miksi hän jäisi.
  Slogan on brändin ainoa lause, joka jää mieleen, ja paluukävijä on
  hubin halvin liikenne.

  MIKSI KOLME LUKUA JA MIKSI JUURI NÄMÄ. Rivi ei lupaa mitään, se kertoo
  mitä on jo tehty: sopimusten määrä, tarkistuspäivä ja hinta. Jokainen on
  tarkistettavissa ja jokainen tulee datasta, ei tästä tiedostosta. Luvattu
  hyöty ("säästä satoja") kuuluisi tähän huonosti, koska sitä ei tällä
  sivulla voi vielä perustella — ja perustelematon lupaus vertailusivulla
  maksaa enemmän kuin se tuo.
*/

export default function HomeHero({ facts }: { facts: HomeFacts }) {
  return (
    <section className="theme-ember ember-surface relative isolate overflow-hidden">
      {/*
        MASKOTTI ON TAUSTA, EI PALSTA — MOBIILISSA.

        Iso kettu omalla rivillään vei puhelimessa kokonaisen näytöllisen
        ennen ensimmäistäkään nappia, eli käyttäjän piti selata koristeen ohi
        päästäkseen eteenpäin. Nyt hahmo on tekstin takana alareunaan
        ankkuroituna: brändi näkyy, mutta se ei maksa yhtään pystypikseliä
        ennen kilpailutusnappia.

        Opasiteetti on 22 %. Sitä korkeammalla ingressin teksti alkaa lukea
        turkin päällä, ja kylläinen oranssi pohja syö kontrastia jo
        valmiiksi.
      */}
      <Image
        src="/kettu-etusivu-mobiili.webp"
        alt=""
        width={941}
        height={1672}
        priority
        aria-hidden
        className="pointer-events-none absolute -right-[26%] bottom-0 z-0 h-[72%] w-auto max-w-none opacity-[0.22] md:hidden"
      />
      <Image
        src="/kettu-rantatuoli.webp"
        alt="Kettu istuu rantatuolissa ja hoitaa sopimusten kilpailutuksen puolestasi"
        width={1432}
        height={1016}
        priority
        className="pointer-events-none absolute -right-16 bottom-0 z-0 hidden h-[86%] w-auto max-w-none object-contain object-bottom md:block lg:-right-4"
      />

      <div className="relative z-10 mx-auto max-w-[1180px] px-5 pb-36 pt-14 sm:px-8 sm:pb-40 md:pb-48 md:pt-20 lg:px-10">
        <Reveal>
          <div className="max-w-[19ch] md:max-w-[16ch]">
            <p className="flex items-center gap-3 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-onEmber/80 sm:text-[12px]">
              Kilpailutuspalvelu
              <PawTrail count={4} size={9} className="text-onEmber/45" />
            </p>

            <h1 className="mt-5 font-hero text-[clamp(2.9rem,10.5vw,5.6rem)] leading-[0.92] text-onEmber">
              Ketuttaako maksaa liikaa?
            </h1>

            <p className="mt-6 max-w-[36ch] text-[17px] leading-relaxed text-onEmber/85 sm:text-[19px]">
              Anna Ketun kilpailuttaa. Sähkösopimukset ja lainat samasta
              paikasta, ilmaiseksi ja selvällä suomella.
            </p>
          </div>

          {/*
            NAPIT OVAT MOBIILISSA TÄYSLEVEÄT JA PINOSSA. Vierekkäin ne
            jäisivät 390 pikselin leveydellä alle 44 pikselin
            kosketusalueeseen, ja väärin osunut klikki heron ainoassa
            napissa on suoraan menetetty kävijä.

            ENSISIJAINEN NAPPI ON KERMANVALKOINEN, ei oranssi. Oranssilla
            vyöllä oranssi nappi on sama väri kuin pohja; vaalea nappi on
            ruudun ainoa vaalea piste, ja juuri se on koko vyön tarkoitus.
          */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-onEmber/40 bg-onEmber/10 px-6 py-4 font-display text-[16px] font-bold text-onEmber transition-colors hover:bg-onEmber/20"
              >
                Vertaile lainoja
              </Link>
            )}
          </div>
        </Reveal>

        {/*
          LUOTTAMUSRIVI ON YKSI RIVI KULTAISEN VIIVAN ALLA, EI KOLME CHIPPIÄ.
          Chipit muodostivat oman laatikkorivinsä ja veivät saman
          pystytilan kuin kokonainen kappale. Viivan alle ladottu rivi
          lukee allekirjoituksena: se on siellä, mutta se ei kilpaile
          napin kanssa.
        */}
        <Reveal delay={0.08}>
          <div className="mt-12 max-w-[640px] md:mt-16">
            <div className="gold-rule" />
            <dl className="mt-5 grid grid-cols-3 gap-4 sm:gap-8">
              <div>
                <dt className="font-hero text-[1.7rem] leading-none text-onEmber sm:text-[2.1rem]">
                  {facts.planCount}
                </dt>
                <dd className="mt-2 text-[12px] leading-snug text-onEmber/70 sm:text-[13px]">
                  sopimusta {facts.providerCount} yhtiöltä
                </dd>
              </div>
              <div>
                <dt className="font-hero text-[1.7rem] leading-none text-onEmber sm:text-[2.1rem]">
                  {euro(facts.maxSpread)}
                </dt>
                <dd className="mt-2 text-[12px] leading-snug text-onEmber/70 sm:text-[13px]">
                  suurin ero halvimman ja kalleimman välillä
                </dd>
              </div>
              <div>
                <dt className="font-hero text-[1.7rem] leading-none text-onEmber sm:text-[2.1rem]">
                  0 €
                </dt>
                <dd className="mt-2 text-[12px] leading-snug text-onEmber/70 sm:text-[13px]">
                  vertailu maksaa, hinnat {fiDate(facts.priceDate)}
                </dd>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
