/*
  OSIOMERKKI — ETUSIVUN SELKÄRANKA.

  Etusivun vika ei ollut yksittäisissä osioissa vaan siinä, ettei mikään
  sitonut niitä yhteen: sivu luki pinona toisilleen vieraita laatikoita.
  Tämä merkki on halvin mahdollinen korjaus. Sama kaksinumeroinen indeksi,
  sama kultainen hiusviiva ja sama välistys toistuvat jokaisen osion
  alussa, jolloin silmä oppii heti ensimmäisen kahden osion jälkeen, mistä
  uusi osio alkaa — ja lukija tietää koko ajan olevansa yhä samalla sivulla.

  Numero ei ole koriste vaan lupaus pituudesta. Kun lukija näkee "02 / 05",
  hän tietää sivun loppuvan pian. Hubilla se on suoraan tuottoa: kävijä,
  joka ei tiedä paljonko sivua on jäljellä, poistuu aiemmin kuin se, joka
  tietää.
*/

export default function SectionMark({
  index,
  total,
  children,
  /** Oranssilla vyöllä värit kääntyvät: kulta vaaleaksi, viiva kermaksi. */
  onEmber = false,
}: {
  index: string;
  total: string;
  children: React.ReactNode;
  onEmber?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span
        className={`font-hero text-[13px] tabular-nums tracking-[0.04em] ${
          onEmber ? "text-[#FFE2A8]" : "text-goldInk"
        }`}
      >
        {index}
        <span className={onEmber ? "text-onEmber/40" : "text-ink/30"}>/{total}</span>
      </span>
      <span
        className={`h-px w-6 shrink-0 sm:w-10 ${onEmber ? "bg-onEmber/35" : "bg-lineDark"}`}
        aria-hidden
      />
      <p
        className={`font-display text-[11px] font-bold uppercase tracking-[0.18em] sm:text-[12px] ${
          onEmber ? "text-onEmber/85" : "text-accentDark"
        }`}
      >
        {children}
      </p>
    </div>
  );
}
