import Image from "next/image";

/**
 * Kettukilpailutuksen logomerkki: ketun pää liukuvärillä.
 *
 * LÄHDE ON `public/kettulogo1.png`, Jessen oma logotiedosto.
 *
 * MERKKI ON PALJAS, EI LAATASSA. Tässä oli aiemmin oranssi laatta, jonka
 * perustelu oli se, että ohut viivapiirros hukkuu vaalealle headerille.
 * Tämä merkki on umpinainen täysvärimuoto, jolla on oma selvä siluetti —
 * korvat ja häntä tunnistuvat myös ilman laattaa, ja laatta vain rajaisi
 * sen neliöön.
 *
 * SISÄKUVIO ON LÄPINÄKYVÄÄ, EI VALKOISTA. Silmät, poskiraidat ja kuono
 * ovat reikiä, eivät valkoista maalia. Se on hyvä valinta: merkki toimii
 * sekä vaalealla paperilla että alatunnisteen tummalla pohjalla, koska
 * reiästä paistaa kulloinenkin tausta. Älä siis "korjaa" taustaa
 * valkoiseksi — silloin merkki muuttuisi alatunnisteessa valkoiseksi
 * läiskäksi.
 *
 * MIKSI PNG EIKÄ SVG: merkissä on liukuväri ja pehmeät reunat, eikä sitä
 * piirretä uusiksi poluiksi. Jäljennetty vektori olisi aina jonkin verran
 * eri muoto kuin alkuperäinen, ja logon koko arvo on siinä, että se on
 * joka paikassa täsmälleen sama merkki.
 *
 * `public/kettu-logo-paa.png` on sama kuva ilman läpinäkyviä reunuksia ja
 * 512 pikselin korkuisena. Alkuperäisessä on tyhjää joka reunalla, jolloin
 * 34 pikselin logo piirtyisi todellisuudessa selvästi pienempänä, ja 1,3
 * megatavun tiedosto headerissa, joka latautuu joka sivulla, on suoraan
 * pois latausnopeudesta — hidas ensiruutu maksaa klikkejä ennen kuin
 * kukaan ehtii nähdä hintoja.
 *
 * SUHDE 0,829 (831 × 1002) tulee merkin omista mitoista. Mitoita korkeuden
 * mukaan, leveys seuraa.
 *
 * JOS VAIHDAT MERKIN, ANNA TIEDOSTOLLE UUSI NIMI. Selain ja Vercelin CDN
 * välimuistittavat kuvan polun perusteella, joten saman nimen alle
 * vaihdettu uusi kuva ei näy vanhoille kävijöille ollenkaan — ja se on
 * juuri se joukko, jonka pitäisi tunnistaa brändi. Uusi tiedostonimi on
 * uusi osoite, eikä välimuistia tarvitse mennä tyhjentämään mistään.
 *
 * Sama kuva on selaimen välilehdessä (`app/icon.png`) ja iOS:n
 * kotivalikossa (`app/apple-icon.png`). Jos vaihdat merkin, vaihda ne myös.
 */
export default function FoxMark({
  size = 30,
  priority = false,
}: {
  size?: number;
  /** Headerin logo on heti näkyvissä — se ei saa latautua laiskasti. */
  priority?: boolean;
}) {
  const width = Math.round(size * 0.829);

  return (
    <Image
      src="/kettu-logo-paa.png"
      alt=""
      aria-hidden
      width={width}
      height={size}
      priority={priority}
      className="shrink-0"
      style={{ width, height: size }}
    />
  );
}
