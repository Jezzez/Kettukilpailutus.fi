import FoxPaw from "./FoxPaw";

/**
 * Kettukilpailutuksen logomerkki: tassunjälki oranssissa laatassa.
 *
 * MIKSI TASSU EIKÄ KETUN NAAMA: naama piirtyi 30 pikselin kokoisena
 * kolmesta mustasta kolmiosta ja kahdesta pisteestä. Se on tunnistettava
 * vasta kun sitä katsoo, ja headerissa logoa ei katsota — se vilahtaa
 * silmäkulmassa. Tassu on yksi selkeä siluetti, joka kestää pienenemisen
 * ja selaimen välilehden 16 pikseliä.
 *
 * MIKSI SE KANNATTAA TUOTON KANNALTA: sama tassu on jo sopimuskorttien
 * luettelomerkki, "Ketun valinta" -merkki ja Ketun lupausrivi. Kun logo on
 * sama muoto, jokainen noista kohdista alkaa lukea allekirjoituksena:
 * tämän väitteen takana on Kettu, ei sähköyhtiö. Se on juuri se luottamus,
 * jonka varassa "Tee sopimus" -klikki tehdään.
 *
 * MIKSI LAATTA EIKÄ PALJAS TASSU: paljas tassu olisi sama merkki kuin
 * luettelomerkki, ja logo katoaisi omaan toistoonsa. Täytetty laatta
 * erottaa "tämä on brändi" -esiintymän "tämä on kohta listassa"
 * -esiintymästä, ja tuo samalla headeriin oranssin ankkurin.
 *
 * MIKSI KALLELLAAN: pystysuora tassu näyttää ikonilta, hieman kallellaan
 * oleva jäljeltä. Kettu on kulkenut tästä.
 *
 * MUOTO ON YHDESSÄ PAIKASSA: se tulee `FoxPaw`-komponentista, joten
 * logo ja luettelomerkki eivät voi ajautua eri muotoisiksi.
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
      <FoxPaw size={Math.round(size * 0.6)} className="-rotate-[10deg]" />
    </span>
  );
}
