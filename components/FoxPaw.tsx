/**
 * Ketun tassunjälki — brändin oma luettelo- ja hyväksyntämerkki.
 *
 * MIKSI OMANA KOMPONENTTINA: tassu esiintyy nyt kolmessa paikassa
 * (sopimuskortin luettelomerkkinä, "Ketun valinta" -merkissä ja laskurin
 * lupausrivillä). Kun sama muoto toistuu, se alkaa toimia allekirjoituksena:
 * lukija oppii, että tassun vieressä oleva väite on Ketun oma lupaus eikä
 * sähköyhtiön markkinointitekstiä. Kopioitu SVG kolmessa tiedostossa ajautuisi
 * ennen pitkää eri muotoihin ja se yhteys katkeaisi.
 */
export default function FoxPaw({ size = 13, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <ellipse cx="12" cy="16" rx="5.2" ry="4.4" />
      <ellipse cx="5.6" cy="10.4" rx="2.2" ry="2.9" />
      <ellipse cx="18.4" cy="10.4" rx="2.2" ry="2.9" />
      <ellipse cx="9" cy="5.6" rx="2" ry="2.7" />
      <ellipse cx="15" cy="5.6" rx="2" ry="2.7" />
    </svg>
  );
}
