/**
 * Ketunhäntä-viiva.
 *
 * Korvaa osioiden yläotsikoissa olleen tasapaksun `h-px`-viivan. Suora
 * viiva on neutraali eikä kerro mitään; tämä on kapeneva, hieman kaartuva
 * veto, joka lainaa muotonsa ketunhännästä.
 *
 * MIKSI TÄMÄ ON TÄRKEÄ: se on sivuston ainoa toistuva piirretty ele, ja
 * juuri toistuva ele erottaa suunnitellun brändin kootusta templaatista.
 * Kohdeyleisö (40–60 v) ei kaipaa kikkailua, mutta huomaa kyllä eron
 * geneerisen ja tehdyn välillä — ja se ero on osa sitä ammattimaisuutta,
 * jonka varassa käyttäjä uskaltaa klikata "Tee sopimus".
 *
 * Väri periytyy `currentColor`ista, joten viiva sopii sekä
 * kettuoranssiin että kultaan ilman erillistä varianttia.
 */
export default function BrushRule({
  className = "",
  width = 64,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 8"
      width={width}
      height={8}
      className={`shrink-0 ${className}`}
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* Runko: paksuimmillaan alussa, häviää olemattomiin lopussa. */}
      <path
        d="M0.5 4.4C10 2.1 21 1.5 33 2.6c9 0.8 17.5 2 30.5 3.1"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="0.72 1"
      />
      {/* Hännänpää: ohut jatke, joka antaa vedolle suunnan. */}
      <path
        d="M44 4.6c7 0.5 13 1 19.5 1.4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
