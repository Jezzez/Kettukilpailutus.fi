import BrushRule from "./BrushRule";

/**
 * Osion ankkuri: yläotsikko, ketunhäntäviiva, otsikko ja valinnainen ingressi.
 *
 * MIKSI TÄMÄ ON OLEMASSA:
 * Sivu oli pitkä ja tasainen: osiot alkoivat pelkällä H2:lla, joten silmällä
 * ei ollut mitään mihin pysähtyä vieritettäessä. Kun jokainen osio alkaa
 * samalla kolmiosaisella eleellä — pieni oranssi yläotsikko, ketunhäntä ja
 * vasta sitten otsikko — lukija tunnistaa osion rajan ennen kuin ehtii lukea
 * sanaakaan. Se on juuri se, mikä pitää kävijän vierityksessä eikä
 * takaisin-napissa.
 *
 * TUOTTO: pidempi selausmatka tarkoittaa useampaa kävijää, joka näkee
 * "Tee sopimus" -napin. Toistuva ele on myös ainoa halpa tapa saada sivusto
 * näyttämään suunnitellulta eikä kootulta.
 *
 * SÄVYSÄÄNTÖ: yläotsikko on luokitus, ei myyntilause. "Näin laskemme", ei
 * "Säästä satoja euroja!". Kohdeyleisö (40–60 v) lukee jälkimmäisen
 * mainokseksi ja ohittaa koko osion.
 */
export default function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <p
        className={`flex items-center gap-2.5 font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-accentDark ${
          centered ? "justify-center" : ""
        }`}
      >
        {eyebrow}
        <BrushRule className="text-accent/70" width={48} />
      </p>

      <h2
        className={`mt-3.5 font-hero text-[2rem] leading-[1.08] text-ink sm:text-[2.5rem] ${
          centered ? "mx-auto max-w-2xl" : "max-w-[20ch]"
        }`}
      >
        {title}
      </h2>

      {lead && (
        <p
          className={`mt-3.5 text-[15.5px] leading-relaxed text-ink/70 sm:text-[16.5px] ${
            centered ? "mx-auto max-w-xl" : "max-w-[52ch]"
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
