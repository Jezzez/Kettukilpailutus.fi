import Image from "next/image";
import Reveal from "@/components/Reveal";

/*
  TIETOA KETTUKILPAILUTUKSESTA — YKSI KORTTI, EI OSIOTA.

  MITÄ TÄMÄ KORVASI. Tässä kohdassa oli `GuideRail`, eli osio "Etkö ole
  vielä valmis vertailemaan?" ja sen kolme blogikorttia. Jesse pyysi
  poistamaan sen ja korvaamaan tällä kortilla, ja muoto on otettu
  kilpailuttaja.fi:n "Tietoa Kilpailuttajasta" -laatikosta: kapea
  pyöristetty kortti, ohut reunaviiva, otsikko, yksi kappale ja keskitetty
  merkki kappaleen alla.

  =====================================================================
  MIKÄ TÄSSÄ ON MUOTO JA MIKÄ EI
  =====================================================================

  MUOTO ON IDENTTINEN, SISÄLTÖ EI VOI OLLA. Referenssin teksti kertoo
  Energy Brokers Finland Oy:stä, sen omistuspohjasta ja pankkien
  e-tunnistepalveluista. Yksikään noista ei ole meistä totta: palvelun
  tuottaa toinen yhtiö, emmekä käytä vahvaa tunnistautumista missään.
  Kopioitu kappale olisi siis sekä valheellinen väite omasta yrityksestä
  että toisen sivuston tekstin suora jäljennös. Tämän kortin jokainen
  lause on meidän omamme ja tarkistettavissa.

  =====================================================================
  AVAINLIPPU ON OIKEA MERKKI. SE ON KÄYTTÖOIKEUDEN VARASSA.
  =====================================================================

  Kappaleen alla on Suomalaisen Työn Liiton Avainlippu (Made in Finland).
  Merkkitiedosto on Jessen 19.9.2026 toimittama, eli se on liitolta saatu
  eikä jäljennös. Merkki on rekisteröity tavaramerkki, ja sen käyttö on
  sallittua vain niin kauan kuin liiton myöntämä käyttöoikeus on voimassa.

  MITÄ SE TARKOITTAA KÄYTÄNNÖSSÄ:

  - Jos käyttöoikeus päättyy tai jää uusimatta, merkki on poistettava
    tästä kortista samalla. Voimassaolon päättyminen ei näy koodista
    mitenkään, joten tämä on kalenteriasia eikä koodiasia.
  - Merkkiä ei saa venyttää, rajata, värittää uudelleen eikä yhdistää
    toiseen merkkiin. Tiedostoa `public/avainlippu-made-in-finland.png`
    ei siis muokata, se vain mitoitetaan.
  - Liiton omat käyttöohjeet menevät tämän tiedoston ja DESIGN.md:n edelle.

  SININEN ON POIKKEUS VÄRISÄÄNTÖÖN. DESIGN.md sallii kaksi väriä,
  kettuoranssin ja kullan. Avainlipun sininen on kolmas, eikä se ole
  tyylivalinta: sertifikaattimerkki käytetään siinä muodossa kuin se on
  myönnetty. Tästä ei seuraa lupaa lisätä sinistä muualle.

  Y-TUNNUS EI OLE ENÄÄ TÄSSÄ KAPPALEESSA (Jessen muokkaus). Se lukee
  läpinäkyvyysosion kohdassa 04, eli se on sivulla yhä kerran.
*/

export default function AboutCard() {
  return (
    <section className="theme-light bg-mist py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          {/*
            KORTTI ON OSION LEVYINEN, KUTEN REFERENSSISSÄ. Laatikko täyttää
            koko sisältöpalstan (`max-w-[1180px]`) eikä ole kapea
            sivuhuomautus. Kapea versio kokeiltiin ensin, ja se latoi tekstin
            keskelle omaksi saarekkeekseen, jolloin sivun vasen linja katkesi:
            jokainen muu osio alkaa samasta kohdasta kuin tämä palsta.
          */}
          <div className="rounded-2xl border border-line bg-paper p-7 shadow-card sm:p-10 md:p-14">
            {/*
              TYÖPÖYDÄLLÄ KAKSI PALSTAA, PUHELIMESSA PINO. Referenssissä
              teksti on vasemmalla ja merkki oikean puoliskon keskellä, eli
              merkki ei ole tekstin alla vaan sen vieressä. `md:items-center`
              pitää merkin pystysuunnassa tekstin keskikohdalla riippumatta
              siitä, kuinka monelle riville kappale kiertyy.

              TEKSTIPALSTAA KAVENNETAAN `max-w-[46ch]`:LLA. Ilman sitä
              kappale venyisi puolikkaan palstan levyiseksi vasta 1180
              pikselissä, ja sitä kapeammilla työpöydillä rivistä tulisi yli
              90 merkkiä pitkä. Luettava rivi on 45–75 merkkiä.
            */}
            <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-12">
              <div>
                <h2 className="font-hero text-[1.35rem] leading-tight text-accentDark">
                  Tietoa Kettukilpailutuksesta
                </h2>

                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink/70">
                  Kettukilpailutus.fi on maksuton palvelu, jolla voit vertailla
                  sähkösopimuksia ja pyytää tarjouksen lainasta tai
                  vakuutuksista. Voit solmia uuden sopimuksen palvelumme kautta.
                  Kettukilpailutus.fi-palvelun tuottaa Mucho Vendo Oy. Palvelu
                  on ideoitu, kehitetty ja ylläpidetty 100% suomalaisin voimin.
                </p>
              </div>

              {/*
                MITAT TULEVAT TIEDOSTOSTA: 1641 × 1772, eli suhde 0,926.
                Korkeus 120 px antaa leveydeksi 111 px. Merkkiä ei saa
                venyttää eikä rajata, joten jos vaihdat kokoa, laske leveys
                uudelleen samasta suhteesta.

                `alt` ON OIKEA TEKSTI EIKÄ `aria-hidden`. Tämä ei ole koriste
                vaan sertifikaatti, ja se on ainoa asia kortissa, jota
                ruudunlukijan käyttäjä ei muuten saisi tietää.
              */}
              <div className="flex justify-center">
                <Image
                  src="/avainlippu-made-in-finland.png"
                  alt="Avainlippu, Suomalaisen Työn Liiton myöntämä merkki suomalaiselle palvelulle"
                  width={111}
                  height={120}
                  style={{ width: 111, height: 120 }}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
