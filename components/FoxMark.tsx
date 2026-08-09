import Image from "next/image";

/**
 * Kettukilpailutuksen logomerkki: oranssi tassunjälki.
 *
 * MERKKI ON PALJAS, EI LAATASSA. Tässä oli aiemmin ketunpää täytetyn
 * oranssin laatan sisällä, ja laatan perustelu oli se, että paljas
 * viivapiirros hukkuu vaalealle headerille. Se perustelu koski ohutta
 * viivapiirrosta. Tämä tassu on umpinainen täysvärimuoto, jolla on oma
 * selvä siluetti — se erottuu vaalealta pohjalta ilman laattaa, ja laatta
 * vain rajaisi sen neliöön, jota Jesse ei halunnut.
 *
 * MIKSI PNG EIKÄ SVG: tämä on Jessen oma logotiedosto
 * (`public/kettulogo.png`), eikä sitä piirretä uusiksi poluiksi. Jäljennetty
 * vektori olisi aina jonkin verran eri muoto kuin alkuperäinen, ja logon
 * koko arvo on siinä, että se on joka paikassa täsmälleen sama merkki.
 *
 * `public/kettulogo-merkki.png` on sama kuva ilman läpinäkyviä reunuksia ja
 * 512 pikselin korkuisena. Alkuperäisessä on noin 23 % tyhjää joka reunalla,
 * jolloin 34 pikselin logo piirtyisi todellisuudessa 26 pikselin kokoisena,
 * ja 1,1 megatavun tiedosto on headerissa, joka latautuu joka sivulla,
 * suoraan pois latausnopeudesta — ja hidas ensivaikutelma maksaa klikkejä
 * ennen kuin kukaan ehtii nähdä hintoja.
 *
 * SUHDE 0,904 (830 × 918) tulee tassun omista mitoista. Mitoita korkeuden
 * mukaan, leveys seuraa.
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
  const width = Math.round(size * 0.904);

  return (
    <Image
      src="/kettulogo-merkki.png"
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
