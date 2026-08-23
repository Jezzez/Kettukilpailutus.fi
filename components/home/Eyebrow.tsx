/*
  OSION PIKKUOTSIKKO.

  Yksi rivi kultaista versaalia otsikon yllä. Sen tehtävä on kertoa
  yhdellä silmäyksellä, mistä osiosta on kyse, ennen kuin lukija lukee
  ison otsikon.

  MIKSI TÄMÄ KORVASI NUMEROIDUN "01/04" -MERKIN: numerointi lupasi
  lukijalle listan, jota sivu ei ollut. Se myös rikkoutuu joka kerta kun
  osio lisätään tai poistetaan, ja rikkinäinen numerointi ("01, 02, 04")
  näyttää huolimattomalta juuri sivulla, jonka koko myyntiargumentti on
  huolellisuus.
*/

export default function Eyebrow({
  children,
  onEmber = false,
}: {
  children: React.ReactNode;
  onEmber?: boolean;
}) {
  return (
    <p
      className={`font-display text-[12px] font-bold uppercase tracking-[0.16em] ${
        onEmber ? "text-onEmber/70" : "text-goldInk"
      }`}
    >
      {children}
    </p>
  );
}
