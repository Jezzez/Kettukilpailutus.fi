import FoxLogoMark from "./FoxLogoMark";

/**
 * Kettukilpailutuksen logo: ketun pää oranssissa laatassa.
 *
 * MIKSI KETUN PÄÄ EIKÄ TASSU: tässä oli aiemmin tassunjälki, ja perustelu
 * oli se, ettei ketun naama kestä pienenemistä — vanha naamaversio piirtyi
 * kolmesta kolmiosta ja kahdesta pisteestä ja muuttui 30 pikselissä
 * mössöksi. Se perustelu koski sitä piirrosta, ei tätä. Nykyinen merkki on
 * yksi symmetrinen kärkikuvio, jonka siluetti on tunnistettava silloinkin,
 * kun sisäviivat sulavat yhteen. Tassu on yhä käytössä siellä, minne se
 * kuuluu: luettelomerkkinä, "Ketun valinta" -merkissä ja Ketun
 * lupausrivillä.
 *
 * MIKSI TÄMÄ ON TUOTON KANNALTA PAREMPI: logon tehtävä on tehdä brändistä
 * muistettava, ja tassunjälki on geneerinen — sen omistaa yhtä lailla
 * eläinlääkäri ja lemmikkikauppa. Ketun pää on tämän sivuston oma muoto ja
 * sanoo suoraan, kuka lukujen takana on. Kilpailutuspalvelussa klikki
 * tehdään sille, jonka lukuihin luotetaan, ja luottamus rakentuu
 * toistotunnistuksesta: sama merkki välilehdessä, headerissa, footerissa.
 *
 * MIKSI LAATTA EIKÄ PALJAS MERKKI: paljas oranssi viivapiirros hukkuisi
 * vaalealle headerille, ja välilehden 16 pikselissä siitä ei jäisi mitään.
 * Täytetty laatta antaa merkille aina saman taustan ja tuo headeriin sen
 * oranssin ankkurin, jonka varassa muu ilme on vaalea.
 *
 * MIKSI MERKKI TÄYTTÄÄ LAATASTA 78 %: pienemmällä osuudella viivat ohenevat
 * niin, että 16 pikselin välilehti-ikonissa ne sulavat yhdeksi täpläksi.
 * 78 % on suurin osuus, jolla laatta on yhä selvästi laatta.
 *
 * MUOTO ON YHDESSÄ PAIKASSA: se tulee `FoxLogoMark`-komponentista. Jos
 * muutat sitä, muista myös `app/icon.svg` ja `app/apple-icon.png` — ne ovat
 * saman muodon kopioita selaimen välilehteä ja iOS:n kotivalikkoa varten.
 */
export default function FoxMark({ size = 30 }: { size?: number }) {
  return (
    // Ei `shadow-ember`: se on napeille mitoitettu 32 pikselin pehmennys, ja
    // 34 pikselin laatan alla se olisi oranssi tahra eikä varjo.
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-[30%] bg-accent text-onEmber"
      style={{ width: size, height: size }}
    >
      <FoxLogoMark height={Math.round(size * 0.78)} />
    </span>
  );
}
