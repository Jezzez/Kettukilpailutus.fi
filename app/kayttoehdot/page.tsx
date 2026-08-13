import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Käyttöehdot",
  description: "Kettukilpailutuksen käyttöehdot.",
  alternates: { canonical: "/kayttoehdot" },
};

/*
  TEKSTIN TYYPPI ON ReactNode, EI string.

  Sortterin ehto jälleenmyyjäkumppaneille on, että heidän käyttöehtoihinsa
  ja tietosuojaselosteeseensa on linkit meidän vastaavilta sivuiltamme.
  Linkkiä ei voi kirjoittaa merkkijonoon, joten osion sisältö on nyt
  JSX:ää. Muut osiot ovat yhä pelkkää tekstiä eikä niitä tarvinnut koskea.
*/
const LINK = "font-semibold text-accentDark underline underline-offset-4";

const SECTIONS: [string, React.ReactNode][] = [
  ["Palvelun luonne", "Kettukilpailutus on riippumaton vertailupalvelu. Emme myönnä luottoja emmekä toimi luotonvälittäjänä, vaan ohjaamme käyttäjän palveluntarjoajan omaan hakuprosessiin."],
  ["Tietojen oikeellisuus", "Pyrimme pitämään korttien tiedot ajan tasalla, mutta ehdot voivat muuttua nopeasti. Tarkista aina lopulliset ehdot pankin sivuilta ennen hakemista. Vertailu ei ole sijoitus- tai luottoneuvontaa."],
  ["Vertailun järjestys", "Sopimukset järjestetään hinnalla, joka lasketaan ilmoittamallasi kulutuksella ja sisältää kampanjaedun ensimmäiseltä vuodelta. Ketun valinta -merkin saa se sopimus, jonka vuosihinta on tällä laskennalla pienin. Kyseessä on laskennallinen apuväline, ei suositus tehdä sopimusta."],
  ["Kumppanuudet", "Voimme saada korvauksen, kun siirryt kumppanin palveluun linkkiemme kautta. Korvaus ei vaikuta vertailun sisältöön tai järjestykseen."],
  /*
    LAINAOSIO ON OMA KOHTANSA, EI LISÄYS "KUMPPANUUDET"-KOHTAAN.

    Lainojen hakemussivulla on Kettukilpailutuksen logo, joten kävijä voi
    perustellusti luulla olevansa yhä meidän palvelussamme ja antavansa
    tietonsa meille. Se on ainoa kohta sivustolla, jossa oma brändi voi
    johtaa harhaan, ja siksi se sanotaan tässä erikseen eikä yleisen
    kumppanuuslauseen jatkona.
  */
  [
    "Lainahakemus ja Sortter",
    <>
      Kettukilpailutus ei vertaile lainoja eikä ota vastaan lainahakemuksia. Lainojen
      kilpailutuksen tarjoaa kumppanimme Sortter, joka toimii palvelun tarjoajana ja
      hakemuksessa antamiesi tietojen käsittelijänä. Hakemussivulla on Kettukilpailutuksen
      tunnukset, mutta palvelun tarjoaa Sortter ja siihen sovelletaan Sortterin ehtoja:{" "}
      <a href="https://sortter.fi/kayttoehdot/" target="_blank" rel="noopener" className={LINK}>
        Sortterin käyttöehdot
      </a>{" "}
      ja{" "}
      <a href="https://sortter.fi/tietosuojaseloste/" target="_blank" rel="noopener" className={LINK}>
        Sortterin tietosuojaseloste
      </a>
      .
    </>,
  ],
  ["Vastuunrajoitus", "Emme vastaa kolmansien osapuolten palveluista, niiden saatavuudesta tai päätöksistä, jotka teet vertailun perusteella. Luotto tulee aina mitoittaa omaan maksukykyyn."],
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-hero text-[2rem] leading-[1.1] text-ink sm:text-[2.4rem]">Käyttöehdot</h1>
      <p className="mt-2 text-sm text-ink/60">Päivitetty viimeksi: elokuu 2026</p>
      <div className="mt-8 space-y-7">
        {SECTIONS.map(([h, t]) => (
          <section key={h}>
            <h2 className="font-display text-lg font-semibold text-ink">{h}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{t}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 rounded-xl bg-mist p-4 text-xs leading-relaxed text-ink/70">
        Huomio julkaisijalle: tämä on ehtojen pohja — tarkistuta juristilla ennen julkaisua.
      </p>
    </div>
  );
}
