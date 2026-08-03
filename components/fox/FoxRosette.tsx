import FoxPaw from "../FoxPaw";

/**
 * KETUN LEIMA — sakarareunainen rosetti.
 *
 * MIKSI TÄMÄ ON OLEMASSA: kilpailijoilla on sivuillaan sertifikaatin
 * näköisiä merkkejä, ja ne toimivat. Kilpailuttaja.fi:n vihreässä
 * sakaraleimassa lukee "Hyviä syitä valita juuri meidät" — se ei ole
 * kenenkään myöntämä sertifikaatti, vaan heidän oma väitteensä leiman
 * muodossa. Uskottavuustyön tekee MUOTO, ei myöntäjä: sakarareuna,
 * sisäkehä ja keskitetty ladonta ovat sinetin ja arvomerkin visuaalista
 * kielioppia, ja silmä lukee ne auktoriteetiksi ennen kuin ehtii lukea
 * tekstin.
 *
 * MIKSI TÄMÄ ON REHELLINEN: leima ei väitä olevansa ulkopuolisen
 * myöntämä, eikä siinä lue mitään mikä ei ole totta. Sen sisältö on aina
 * joko Ketun oma valintakriteeri kirjoitettuna auki ("hinta 72 % ·
 * arvio 28 %") tai tarkistettavissa oleva tosiasia palvelusta ("emme myy
 * tietojasi"). Juuri kriteerin näkyminen erottaa tämän valemerkistä:
 * käyttäjä voi tarkistaa väitteen sen sijaan että joutuisi uskomaan sen.
 * Keksittyä sertifikaattia ei sivustolle tule koskaan.
 *
 * MIKSI SE KANNATTAA TUOTON KANNALTA: 40–60-vuotias kävijä etsii
 * sivulta merkkejä siitä, että joku on nähnyt vaivaa. Leima on
 * halvin mahdollinen tapa näyttää siltä — se on puhdasta SVG:tä,
 * ei kuvatiedostoa, ja se toimii kaikilla pinnoilla.
 */

/** Sakarareunan polku. Jokainen sakara on puoliympyrä kahden kehäpisteen välillä. */
function scallopPath(cx: number, cy: number, r: number, teeth: number): string {
  const step = (Math.PI * 2) / teeth;
  // Jänteen puolikas = sakaran säde. Näin sakarat ovat aina täsmälleen
  // puoliympyröitä eivätkä litisty tai teräviydy hammasluvun mukana.
  const bump = r * Math.sin(step / 2);

  const pt = (i: number) => {
    const a = i * step - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };

  const [sx, sy] = pt(0);
  let d = `M ${sx.toFixed(2)} ${sy.toFixed(2)}`;
  for (let i = 1; i <= teeth; i++) {
    const [x, y] = pt(i);
    d += ` A ${bump.toFixed(2)} ${bump.toFixed(2)} 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d + " Z";
}

export default function FoxRosette({
  /** Pääväite. Pidä lyhyenä — 1–3 sanaa latoutuu kauneimmin. */
  label,
  /** Kriteeri tai peruste. Tämä on se rivi, joka tekee leimasta rehellisen. */
  sub,
  size = 108,
  /** Kallistus asteina. Pieni vinous erottaa leiman napista. */
  tilt = -7,
  className = "",
}: {
  label: string;
  sub?: string;
  size?: number;
  tilt?: number;
  className?: string;
}) {
  const teeth = 26;
  const outer = scallopPath(50, 50, 43, teeth);

  return (
    <div
      className={`relative shrink-0 select-none ${className}`}
      style={{ width: size, height: size, transform: `rotate(${tilt}deg)` }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* Sakarareuna. Täyttö on hyvin haalea, jotta leima toimii sekä
            tummalla että vaalealla pinnalla ilman erillistä varianttia. */}
        <path d={outer} fill="rgb(217 162 79 / 0.10)" stroke="rgb(217 162 79 / 0.55)" strokeWidth="1.1" />
        {/* Sisäkehä — arvomerkin tunnusomainen kaksoisviiva. */}
        <circle cx="50" cy="50" r="35.5" fill="none" stroke="rgb(217 162 79 / 0.40)" strokeWidth="0.8" />
      </svg>

      {/* Sisältö HTML:nä eikä SVG-tekstinä, jotta se käyttää samoja
          fontteja ja tavuttuu oikein eikä vaadi käsin laskettua ladontaa. */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-[13%] text-center text-goldInk"
        style={{ transform: `rotate(${-tilt}deg)` }}
      >
        <FoxPaw size={size * 0.13} className="mb-[3%] opacity-80" />
        <p
          className="font-display font-bold uppercase leading-[1.15] tracking-[0.06em]"
          style={{ fontSize: size * 0.108 }}
        >
          {label}
        </p>
        {sub && (
          <p
            className="mt-[4%] font-data font-semibold leading-tight opacity-75"
            style={{ fontSize: size * 0.082 }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
