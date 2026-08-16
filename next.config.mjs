/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  compress: true,

  /*
    OHJAUKSIA EI OLE, EIKÄ `/sahkosopimukset` SAA OHJAUTUA MINNEKÄÄN.

    Täällä oli 17.8.2026 asti rivi
        { source: "/sahkosopimukset", destination: "/", permanent: true }
    siltä ajalta, jolloin sähkövertailu asui etusivulla. Kun vertailu
    palautettiin omaan osoitteeseensa, rivi oli pakko poistaa: se
    ohjaisi kävijän pois sivulta ennen kuin sivu ehtii renderöityä,
    eikä `app/sahkosopimukset/page.tsx` aukeaisi koskaan. Oire olisi
    hämäävä, koska tiedosto on paikallaan ja näyttää oikealta.

    Ohjaus toiseen suuntaan (`/` → `/sahkosopimukset`) olisi vielä
    pahempi: etusivu on nyt hub, ja sen ohjaaminen tekisi juuri sen
    virheen, joka täällä oli ennen — sivuston vahvin osoite olisi
    tyhjä uudelleenohjaus.

    Vanhat linkit ovat kunnossa ilman mitään sääntöä: `/` on olemassa
    (hub) ja `/sahkosopimukset` on olemassa (vertailu). Kumpikin
    palauttaa 200, joten mikään kirjanmerkki ei osu 404:ään.
  */
};
export default nextConfig;
