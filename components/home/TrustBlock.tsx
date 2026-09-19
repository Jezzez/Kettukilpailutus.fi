import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/home/SectionHead";
import { SITE } from "@/lib/data";
import { fiDate, type HomeFacts } from "@/lib/home";

/*
  LÄPINÄKYVYYS JA YRITYSTIEDOT — SIVUN AINOA KOHTA, JOSSA PUHUTAAN MEISTÄ.

  MIKSI ANSAINTAMALLI KERROTAAN ETUSIVULLA EIKÄ VAIN "TIETOA MEISTÄ"
  -SIVULLA: kukaan ei avaa sitä sivua. Epäilys syntyy juuri silloin, kun
  kävijä tajuaa vertailusivun ansaitsevan klikeistä, ja se hetki on ennen
  klikkiä, ei sen jälkeen. Jos vastaus on jo luettu etusivulla, epäilys ei
  ehdi muuttua poistumiseksi.

  =====================================================================
  TÄHÄN SULAUTETTIIN `AboutStrip` ("Kotimaisuus ja yritystiedot")
  =====================================================================

  Etusivulla oli kaksi peräkkäistä osiota, jotka molemmat vastasivat
  kysymykseen "voiko teihin luottaa": tämä neljällä numeroidulla sarakkeella
  ja sen jälkeen kotimaisuusosio kolmella. Yhteensä seitsemän tekstisaraketta
  ja noin 1 400 merkkiä, kaikki samasta aiheesta. Kaksi osiota samasta
  aiheesta ei kaksinkertaista luottamusta vaan puolittaa sen, että kumpikaan
  tulee luetuksi.

  Nyt neljä kohtaa. Kolme ensimmäistä ovat entisen läpinäkyvyysosion kohdat
  lyhennettyinä, ja neljäs on kotimaisuusosion ainoa kohta, joka oli aidosti
  tarkistettava tosiasia: Y-tunnus. Kaksi muuta ("tehty Suomessa, suomeksi"
  ja "virheen voi ilmoittaa") mahtuivat saman kohdan sisään.

  MIKSI Y-TUNNUS EI SAANUT KADOTA. Suomalainen kävijä tarkistaa sivuston
  aitouden yhdellä silmäyksellä, ja jos hän ei löydä Y-tunnusta, vertailusivu
  asettuu hänen mielessään samaan luokkaan ulkomaisten liidifarmien kanssa.
  Se päätös syntyy ennen "Tee sopimus" -nappia, joten tieto on oltava sitä
  ennen. Y-tunnus on suoraan tuottokysymys, ei muodollisuus.

  MIKSI TÄSSÄ EI OLE AVAINLIPPUA EIKÄ MITÄÄN SEN NÄKÖISTÄ. Avainlippu on
  Suomalaisen Työn Liiton rekisteröity yhteisömerkki, ja sen käyttöön
  tarvitaan liiton myöntämä käyttöoikeus, joka edellyttää jäsenyyttä sekä
  laskettua ja hyväksyttyä kotimaisuusastetta. Merkin laittaminen sivulle
  ilman myöntöä on tavaramerkkiloukkaus, ja se on lisäksi juuri se asia,
  jonka affiliate-ohjelman compliance-tarkastus huomaa ensimmäisenä.
  Kumppanuuden katkeaminen tarkoittaisi sivuston koko liikevaihtoa. Sama
  koskee omatekoista siniristilappua tai mitä tahansa merkkiä, joka on
  tarkoitettu luettavaksi viralliseksi sertifikaatiksi: jäljitelmä on
  huonompi kuin ei mitään. Kun Avainlippu on myönnetty, se tulee tähän
  osioon, ja vain liitolta saatua merkkitiedostoa käytetään.

  KOHTA 02 ON TÄRKEIN JA SE LASKETAAN DATASTA. Vertailussa on sopimuksia,
  joista ei makseta palkkiota, ja niiden määrä tulee suoraan
  `data/electricity.json`:n `partner`-kentästä. Se on ainoa väite tällä
  sivulla, jota kilpailija ei voi kopioida sanomalla samaa: joko rivit ovat
  listassa tai eivät. Jos luku menisi joskus nollaan, lause katoaa itsestään
  eikä jää valheeksi seisomaan.

  =====================================================================
  KOHTA 03 ON SIVUN AINOA COMPLIANCE-KATE. ÄLÄ POISTA SITÄ.
  =====================================================================

  Kumppanien nimet poistettiin 19.9.2026 Jessen pyynnöstä kaikkialta
  etusivulta, myös tästä kohdasta ja meta-kuvauksesta. Nappi lukee silti
  "Kilpailuta vakuutus", ja sen takana on yhden yhtiön oma tarjouspyyntö.

  Siksi tämän kohdan lause "vakuutuksia emme vertaile" on nyt koko etusivun
  ainoa paikka, jossa tuo rajaus sanotaan. Ilman sitä nappi on
  kuluttajansuojalain 2 luvun tarkoittama harhaanjohtava markkinointiväite,
  ja se on ensimmäinen asia, jonka affiliate-ohjelman compliance-tarkastus
  huomaa. Kumppanuuden katkeaminen tarkoittaisi sivuston koko liikevaihtoa.

  Lause saa muuttua muotoiluna, mutta rajaus ei saa kadota. Jos kohta 03
  joskus poistetaan, sama rajaus on kirjoitettava samalla liikkeellä johonkin
  muuhun etusivun kohtaan. Ks. `lib/services.ts` yläkommentti.

  MASKOTTIKUVA ON POISSA MOLEMMISTA OSIOISTA. Läpinäkyvyysosiossa oli iso
  ketunkuva otsikon vieressä ja kotimaisuusosiossa peukuttava kettu otsikon
  alla. Tämä on sivun ainoa osio, jonka koko tehtävä on tulla luetuksi, ja
  koriste vei siltä tilan. Kettu on herossa ja loppukehotuksessa, eli brändi
  ei häviä mihinkään.
*/

export default function TrustBlock({ facts }: { facts: HomeFacts }) {
  const points = [
    {
      title: "Palkkio tulee yhtiöltä, ei sinulta",
      body: "Kun teet sopimuksen tai hakemuksen vertailun kautta, kumppani maksaa meille välityspalkkion. Sinulle palvelu on ilmainen, eikä hinta ole meidän kauttamme senttiäkään korkeampi.",
    },
    {
      title: "Palkkio ei vaikuta järjestykseen",
      body: `Sopimukset järjestyvät ensimmäisen vuoden hinnan mukaan sinun kulutuksellasi. Vertailun ${facts.planCount} sopimuksesta ${facts.nonPartnerCount} on sellaisia, joista emme saa euroakaan, ja ne ovat listassa siitä huolimatta.`,
    },
    {
      title: "Kerromme, mitä laskemme itse",
      body: "Sähkön hinnat laskemme itse tarkistetusta datasta, ja vertailu on meidän. Lainoissa hakemuksen käsittelee siihen erikoistunut palvelu, ja vakuutuksissa pyydät tarjouksen yhdeltä vakuutusyhtiöltä: vakuutuksia emme vertaile.",
    },
    {
      title: "Takana on oikea suomalainen yritys",
      body: `Palvelusta vastaa ${SITE.operator.legalName}, Y-tunnus ${SITE.operator.businessId}. Hinnat on viimeksi tarkistettu ${fiDate(facts.priceDate)}. Jos jokin luku on väärin, kerro siitä osoitteeseen ${SITE.operator.email}.`,
    },
  ];

  return (
    <section className="theme-light sand-surface py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        {/*
          "Läpinäkyvyys" on sana, jonka jokainen vertailusivu kirjoittaa
          itsestään, eikä se siksi kerro lukijalle mitään. Väite siitä, mistä
          raha tulee, kertoo saman asian tavalla, jonka voi tarkistaa.
        */}
        <SectionHead
          eyebrow="Miksi lukuihin voi luottaa"
          title="Kettu kertoo, mistä se saa palkkansa."
          lead="Vertailu, joka ei kerro omasta rahastaan, pyytää luottamaan lukuihin ilman perustetta. Neljä asiaa, jotka voit tarkistaa."
        />

        {/*
          NELJÄ SARAKETTA, EI KORTTEJA. Perustelut ovat tekstiä, ja teksti
          laatikon sisällä luetaan mainokseksi. Numero ja hiusviiva riittävät
          erottamaan kohdat toisistaan.
        */}
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <li className="border-t border-lineDark/60 pt-5">
                <span className="font-hero text-[13px] tabular-nums text-goldInk">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-hero text-[1.3rem] leading-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                  {p.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>

        {/*
          LINKKI TIETOA-SIVULLE TULI KOTIMAISUUSOSION MUKANA. Se on osion
          ainoa ulospääsy, ja se on tarkoitettu sille pienelle osalle
          kävijöistä, joille neljä kohtaa ei riitä. Ilman linkkiä heidän
          vaihtoehtonsa on poistuminen.
        */}
        <Reveal delay={0.3}>
          <p className="mt-10 text-center text-[14px] text-ink/60">
            Lisää palvelusta ja sen laskentaperiaatteista:{" "}
            <Link
              href="/tietoa"
              className="font-semibold text-accentDark underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
            >
              Tietoa palvelusta
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
