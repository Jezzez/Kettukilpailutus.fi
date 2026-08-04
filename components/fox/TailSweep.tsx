/**
 * HÄNNÄNVETO — vyöhykkeiden välinen raja.
 *
 * MIKSI EI SUORAA REUNAA: kun tumma hero vaihtuu vaaleaan vertailuun
 * suoralla vaakaviivalla, sivu näyttää kahdelta eri sivustolta liimattuna
 * yhteen. Muotoiltu raja sitoo vyöhykkeet toisiinsa ja saa vaihdon
 * näyttämään suunnitellulta.
 *
 * MIKSI EI VINOLEIKKAUSTA: vinoleikkaus on vertailusivujen vakiokalustoa
 * (mm. sahkon-kilpailutus.fi). Se toimii, mutta se on täsmälleen se ele,
 * josta kävijä ei muista sivua jälkeenpäin. Hännänveto tekee saman työn
 * ja on samalla brändin ele: ketun hännän kaari arkkitehtuurin kokoisena.
 * Kun sama kaari toistuu osioiden rajoilla, sivusto alkaa näyttää yhden
 * käden piirtämältä.
 *
 * KÄYTTÖ: laita tämä vyöhykkeen VIIMEISEKSI lapseksi ja anna `fill`-arvoksi
 * SEURAAVAN vyöhykkeen taustaväri. Komponentti asettuu itse alareunaan.
 *
 *   <section className="den-surface relative">
 *     …sisältö…
 *     <TailSweep fill="rgb(var(--c-paper))" />
 *   </section>
 */
export default function TailSweep({
  /** Seuraavan vyöhykkeen taustaväri. Mikä tahansa CSS-väri. */
  fill,
  /** Korkeus pikseleinä. Matalampi = hillitympi. */
  height = 64,
  /** Kaaren suunta. Oletuksena nousee oikealle. */
  flip = false,
  className = "",
}: {
  fill: string;
  height?: number;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 ${className}`}
      style={{ height, transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {/*
          Kaari on TARKOITUKSELLA epäsymmetrinen: se nousee loivasti
          vasemmalta, kaartuu ylimmilleen noin kahden kolmasosan kohdalla
          ja laskee jyrkemmin oikealle. Symmetrinen aalto lukisi vedeksi;
          epäsymmetria on se, mikä tekee siitä hännänvedon.
        */}
        <path
          d="M0 64 L0 34 C 240 6, 520 0, 760 14 C 1010 28, 1210 52, 1440 40 L1440 64 Z"
          fill={fill}
        />
        {/*
          Kultainen hiusviiva kaaren päällä. Ilman sitä raja on pelkkä
          värinvaihdos; viivan kanssa se on piirretty ele. Häivytys
          molemmista päistä estää viivaa katkeamasta tylysti reunoihin.
        */}
        <defs>
          <linearGradient id="tailsweep-rule" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgb(217 162 79)" stopOpacity="0" />
            <stop offset="28%" stopColor="rgb(217 162 79)" stopOpacity="0.5" />
            <stop offset="72%" stopColor="rgb(217 162 79)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(217 162 79)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 34 C 240 6, 520 0, 760 14 C 1010 28, 1210 52, 1440 40"
          fill="none"
          stroke="url(#tailsweep-rule)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
