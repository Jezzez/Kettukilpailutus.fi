/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  compress: true,

  /*
    VANHAT OSOITTEET EIVÄT SAA KUOLLA.

    Sähkövertailu siirtyi osoitteesta /sahkosopimukset etusivulle.
    Ilman ohjausta jokainen ulkoinen linkki, kirjanmerkki ja Googlen
    indeksissä oleva osoite osuisi 404:ään, ja sivun ansaitsema
    hakukonepainoarvo katoaisi sen sijaan että se siirtyisi uuteen
    osoitteeseen.

    `permanent: true` on 308, eli 301:n moderni vastine. Google käsittelee
    ne samoin: vanha osoite poistuu indeksistä ja linkkiarvo siirtyy
    kohteeseen.

    LÄHDE ON TÄSMÄLLEEN `/sahkosopimukset`, EI `/sahkosopimukset/:path*`.
    Alasivut ovat yhä olemassa ja tuottavat: sopimussivut osoitteessa
    /sahkosopimukset/sopimus/[slug] ja neljä laskeutumissivua
    /sahkosopimukset/[topic]. Jos ohjaus koskisi koko haaraa, ne kaikki
    valuisivat etusivulle ja katoaisivat hakutuloksista.
  */
  async redirects() {
    return [
      { source: "/sahkosopimukset", destination: "/", permanent: true },
    ];
  },
};
export default nextConfig;
