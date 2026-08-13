import type { Metadata } from "next";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tietosuojaseloste",
  description: "Kettukilpailutuksen tietosuojaseloste: mitä tietoja keräämme ja miten niitä käsittelemme.",
  alternates: { canonical: "/tietosuoja" },
};

/*
  REKISTERINPITÄJÄ LUETAAN SITE.operatorISTA, EI KIRJOITETA TÄHÄN KÄSIN.

  Tiedot näkyvät jo alatunnisteessa (`components/Footer.tsx`,
  `OperatorDetails`). Jos ne kirjoitettaisiin tähän toiseen kertaan, ne
  ehtisivät joskus erota toisistaan — ja kaksi eri yritysnimeä samalla
  sivustolla on juuri se havainto, jonka jälkeen kävijä ei paina
  "Tee sopimus" -nappia. Yksi lähde, kaksi näyttöpaikkaa.

  Tässä luki aiemmin myös sähköpostiosoite `kettu@kettukilpailutus.fi`,
  jota ei ole olemassa: alatunnisteessa on `info@`. Tietosuojaselosteessa
  ilmoitettu osoite on se, johon rekisteröidyn pyyntö lain mukaan
  lähetetään, joten väärä osoite ei ole kirjoitusvirhe vaan puuttuva
  yhteyskanava.
*/
/*
  TEKSTIN TYYPPI ON ReactNode, EI string — ks. sama muutos käyttöehdoissa.
  Sortterin ehto on, että heidän selosteeseensa ja ehtoihinsa on linkit
  meidän vastaavilta sivuiltamme, eikä linkkiä voi kirjoittaa merkkijonoon.
*/
const LINK = "font-semibold text-accentDark underline underline-offset-4";

const SECTIONS: [string, React.ReactNode][] = [
  [
    "Rekisterinpitäjä",
    `${SITE.operator.legalName} (Y-tunnus ${SITE.operator.businessId}), joka ylläpitää sivustoa ${SITE.name}. Yhteydenotot: ${SITE.operator.email}.`,
  ],
  ["Mitä tietoja keräämme", "Sivusto ei vaadi rekisteröitymistä eikä kerää nimeä, henkilötunnusta tai yhteystietoja. Keräämme käyttöanalytiikkaa sivujen katseluista ja vertailulinkkien klikkauksista palvelun kehittämiseksi."],
  ["Evästeet ja analytiikka", "Vercel Web Analytics tuottaa evästeetöntä, koottua kävijätilastoa. Google Analytics 4 käyttää analytiikkaevästeitä vain, jos hyväksyt ne evästeasetuksissa. Ilman hyväksyntää Google Analytics toimii rajoitetussa evästeettömässä tilassa. Mainonnan tallennus ja personointi on estetty."],
  /* "Pankin sivulle" oli jäänne korttivertailun ajalta. Sivusto vertailee
     nyt sähkösopimuksia, eikä lakisivu saa puhua palvelusta, jota siellä
     ei ole — se on ensimmäinen paikka, josta epäilevä lukija tarkistaa
     onko sivusto oikeasti se, joka se väittää olevansa. */
  ["Affiliate-linkit", "Kun siirryt palveluntarjoajan sivulle linkkiemme kautta, kumppani voi asettaa oman evästeensä komission kohdistamiseksi. Tämä tapahtuu kumppanin sivustolla ja sen omien ehtojen mukaisesti."],
  /*
    MIKSI TÄMÄ ON OMANA KOHTANAAN JA NIMENOMAAN TÄSSÄ JÄRJESTYKSESSÄ.

    Yllä lukee, ettemme kerää nimeä tai yhteystietoja. Lainojen
    hakemussivulla niitä kuitenkin kysytään, ja sivulla on meidän
    logomme. Ilman tätä kohtaa selosteemme ja kävijän kokemus olisivat
    näennäisesti ristiriidassa, ja tietosuojaseloste on juuri se sivu,
    jolta epäilevä kävijä käy tarkistamassa onko sivusto rehellinen.

    Toinen puoli on tarkkuus: emme välitä hakemuksen tietoja, koska
    kävijä syöttää ne suoraan Sortterille. Me lähetämme mukana vain
    lainasumman ja takaisinmaksuajan, jotka ovat kävijän itsensä
    valitsemia lukuja eivätkä yksilöi ketään. Se sanotaan tässä, jottei
    "esitäytetty hakemus" jää tarkoittamaan jotain suurempaa.
  */
  [
    "Lainahakemus ja Sortter",
    <>
      Emme kerää emmekä välitä lainahakemuksen tietoja. Kun siirryt lainojen
      kilpailutukseen, annat tiedot suoraan kumppanillemme Sortterille, joka toimii
      palvelun tarjoajana ja niiden tietojen käsittelijänä. Hakemussivulla on
      Kettukilpailutuksen tunnukset, mutta palvelun tarjoaa Sortter. Sivustomme välittää
      mukana ainoastaan laskurissa valitsemasi lainasumman ja takaisinmaksuajan, jotka
      eivät ole henkilötietoja. Sortterin omat ehdot:{" "}
      <a href="https://sortter.fi/tietosuojaseloste/" target="_blank" rel="noopener" className={LINK}>
        tietosuojaseloste
      </a>{" "}
      ja{" "}
      <a href="https://sortter.fi/kayttoehdot/" target="_blank" rel="noopener" className={LINK}>
        käyttöehdot
      </a>
      .
    </>,
  ],
  ["Tietojen käsittelijät", "Emme myy käyttäjätietoja. Sivuston käyttöanalytiikkaa käsittelevät palveluntarjoajinamme Vercel ja Google niiden omien tietosuojaehtojen mukaisesti."],
  [
    "Oikeutesi",
    `Sinulla on oikeus saada tieto sinua koskevista tiedoista sekä pyytää niiden oikaisua tai poistoa. Voit myös milloin tahansa peruuttaa antamasi evästesuostumuksen alatunnisteen Evästeasetukset-linkistä. Ota yhteyttä osoitteeseen ${SITE.operator.email}.`,
  ],
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-hero text-[2rem] leading-[1.1] text-ink sm:text-[2.4rem]">Tietosuojaseloste</h1>
      <p className="mt-2 text-sm text-ink/60">Päivitetty viimeksi: elokuu 2026</p>
      <div className="mt-8 space-y-7">
        {SECTIONS.map(([h, t]) => (
          <section key={h}>
            <h2 className="font-display text-lg font-semibold text-ink">{h}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{t}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
