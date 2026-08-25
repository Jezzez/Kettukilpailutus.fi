import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/home/Eyebrow";
import type { HomeFacts } from "@/lib/home";

/*
  LÄPINÄKYVYYS — SIVUN AINOA KOHTA, JOSSA PUHUTAAN MEISTÄ.

  MIKSI ANSAINTAMALLI KERROTAAN ETUSIVULLA EIKÄ VAIN "TIETOA MEISTÄ"
  -SIVULLA: kukaan ei avaa sitä sivua. Epäilys syntyy juuri silloin, kun
  kävijä tajuaa vertailusivun ansaitsevan klikeistä, ja se hetki on ennen
  klikkiä, ei sen jälkeen. Jos vastaus on jo luettu etusivulla, epäilys ei
  ehdi muuttua poistumiseksi.

  KOLMAS KOHTA ON TÄRKEIN JA SE LASKETAAN DATASTA. Vertailussa on
  sopimuksia, joista ei makseta palkkiota, ja niiden määrä tulee suoraan
  `data/electricity.json`:n `partner`-kentästä. Se on ainoa väite tällä
  sivulla, jota kilpailija ei voi kopioida sanomalla samaa: joko rivit ovat
  listassa tai eivät. Jos luku menisi joskus nollaan, lause katoaa
  itsestään eikä jää valheeksi seisomaan.

  MIKSI TÄSTÄ POISTETTIIN MASKOTTIKUVA: osiossa oli iso ketunkuva otsikon
  vieressä, mikä työnsi kolme perustelua kapeaan oikeaan palstaan ja
  venytti osion korkeutta lähes kaksinkertaiseksi. Tämä on sivun ainoa
  osio, jonka koko tehtävä on tulla luetuksi, ja koriste vei siltä tilan.
  Kettu on herossa ja loppukehotuksessa, eli brändi ei häviä mihinkään.

  NELJÄS KOHTA LISÄTTIIN, KUN PALVELUITA TULI KOLME. Kolme kohtaa puhui
  vain sähköstä ja sähköyhtiön maksamasta palkkiosta, eli lainojen ja
  vakuutusten kohdalla osio jätti kysymyksen auki juuri siinä kohdassa,
  jossa se on tarkoitus sulkea. Uusi kohta 03 kertoo, kuka minkäkin työn
  tekee. Se on sama tieto, joka lukee jokaisen vertikaaliosion
  kumppanirivillä, mutta täällä se on koottuna: kävijä, joka epäilee
  koko liiketoimintamallia, lukee tämän osion eikä osioiden pikkuriviä.
*/

export default function TrustBlock({ facts }: { facts: HomeFacts }) {
  const points = [
    {
      title: "Palkkio tulee yhtiöltä, ei sinulta",
      body: "Kun teet sopimuksen tai hakemuksen vertailun kautta, kumppani maksaa meille välityspalkkion. Sinulle palvelu on ilmainen, eikä hinta ole meidän kauttamme senttiäkään korkeampi.",
    },
    {
      title: "Palkkio ei vaikuta järjestykseen",
      body: "Sähkösopimukset järjestyvät ensimmäisen vuoden hinnan mukaan sinun kulutuksellasi. Emme nosta ketään maksua vastaan emmekä käytä arviotähtiä, koska yhdellekään sopimukselle ei ole riippumatonta arviolähdettä.",
    },
    {
      title: "Kerromme, kuka laskee mitäkin",
      body: "Sähkön hinnat laskemme itse tarkistetusta datasta. Lainoissa kilpailutuksen tekee Sortter ja vakuutuksissa tarjouksen antaa POP Vakuutus. Emme esitä kumppanin työtä omanamme.",
    },
    {
      title: "Mukana on yhtiöitä, jotka eivät maksa meille",
      body: `Sähkövertailun ${facts.planCount} sopimuksesta ${facts.nonPartnerCount} on sellaisia, joista emme saa euroakaan. Ne ovat listassa siksi, että vertailu, jossa näkyvät vain maksavat yhtiöt, on mainos.`,
    },
  ];

  return (
    <section className="theme-light sand-surface py-16 md:py-24">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          {/*
            "Läpinäkyvyys" on sana, jonka jokainen vertailusivu kirjoittaa
            itsestään, eikä se siksi kerro lukijalle mitään. Kysymysmuoto
            kertoo, mihin osio vastaa, ja se on kysymys, joka kävijällä on
            oikeasti mielessä juuri ennen klikkiä.
          */}
          <Eyebrow>Miksi lukuihin voi luottaa</Eyebrow>
          <h2 className="mt-4 max-w-[20ch] font-hero text-[clamp(2rem,6vw,3.2rem)] leading-[0.98]">
            Kettu kertoo, mistä se saa palkkansa.
          </h2>
        </Reveal>

        {/*
          KOLME SARAKETTA, EI KORTTEJA. Perustelut ovat tekstiä, ja teksti
          laatikon sisällä luetaan mainokseksi. Numero ja hiusviiva riittävät
          erottamaan kohdat toisistaan.
        */}
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
