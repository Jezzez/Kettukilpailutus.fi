import type { Metadata, Viewport } from "next";
import { Inter, Schibsted_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OG_IMAGE, SITE } from "@/lib/data";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Schibsted Grotesk = pohjoismainen mediagrotesk: tiivis, luottamusta herättävä.
// Jos build valittaa fontista, vaihda tämä rivi: Manrope samoilla asetuksilla.
// Otsikot käyttävät samaa perhettä painolla 800 (ks. .font-hero globals.css).
// Antiikva poistettu: kaksi kirjaintyyppiä riitti näyttämään koristeelliselta,
// ja yksi hyvin käytetty groteski lukee ammattimaisemmalta.
const display = Schibsted_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-display", display: "swap" });


export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name + " – kilpailuta sopimuksesi ja säästä",
    template: "%s | " + SITE.name,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  /*
    JAETUN LINKIN ESIKATSELUKUVA.

    Tässä ei ollut aiemmin kuvaa lainkaan. Silloin Snapchat, WhatsApp ja
    Facebook eivät jätä esikatselua tyhjäksi vaan poimivat mitä löytävät —
    käytännössä selaimen välilehti-ikonin. Siksi jaetussa linkissä näkyi
    pelkkä pieni tunnus.

    MIKSI TÄMÄ ON TUOTON KANNALTA ISO ASIA: sähkövertailu leviää siellä,
    missä hinnoista puhutaan — perhechatissa ja kaverille lähetettynä
    linkkinä. Kuvaton linkki näyttää keskeneräiseltä, ja
    kilpailutuspalvelussa epäilys on suoraan pois klikkauksista. Oikea
    1200 × 630 -kortti, jossa on Kettu, nimi ja lupaus, on se ensivaikutelma,
    jonka vastaanottaja näkee ennen kuin on käynyt sivulla kertaakaan.

    MIKSI EI `app/opengraph-image.png` (Nextin oma nimikäytäntö): se toimii
    kyllä, mutta on näkymätön koodissa, eikä dev-palvelin edes huomaa sitä
    ilman uudelleenkäynnistystä. Tämä tiedosto on se paikka, josta kuvan
    olemassaolo pitää pystyä toteamaan. Polku on suhteellinen, koska
    `metadataBase` yllä muuttaa sen absoluuttiseksi — some-botit vaativat
    absoluuttisen osoitteen.

    KUVAN NIMEÄ EI SAA KIERRÄTTÄÄ. Jos kortti vaihtuu, anna tiedostolle
    uusi nimi: sekä CDN että somepalvelut välimuistittavat vanhan kuvan,
    ja saman nimen alle vaihdettu uusi kortti ei näy jaetuissa linkeissä.

    OSOITE TULEE `OG_IMAGE`-VAKIOSTA, EI TÄSTÄ. Polku oli aiemmin
    kirjoitettuna tähän kahdesti (og ja twitter) ja lisäksi viidellä
    alasivulla. Kun tiedostonimi vaihtuu — ja sen ON pakko vaihtua joka
    kerta, ks. yllä — käsin ylläpidetty seitsemän paikan lista päivittyy
    varmasti puolittain, ja puoliksi päivittynyt esikatselukuva on
    tasan yhtä rikki kuin päivittämätön.
  */
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: SITE.name,
    title: SITE.name + " – Kilpailuta ja säästä",
    description: SITE.description,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE.name + " – Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name + " – kilpailuta sopimuksesi minuutissa",
    description: SITE.description,
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

/**
 * VIEWPORT — mobiilin tärkein yksittäinen asetus.
 *
 * ONGELMA: ilman omaa määrittelyä Next.js antaa vain
 * `width=device-width, initial-scale=1`. Silloin selain sallii nipistyksen
 * ulospäin aina 25 %:iin asti, jolloin sivu kutistuu ruudun keskelle ja
 * ympärille jää tyhjää — käyttäjästä näyttää siltä, että hän "zoomasi pois
 * sivustolta". Se on hämmentävä hetki, ja hämmentynyt kävijä ei paina
 * "Tee sopimus" -nappia.
 *
 * minimumScale: 1 lukitsee alarajan ruudun leveyteen: sivu ei voi enää
 * kutistua taustaa vasten.
 *
 * maximumScale: 5 jätetään TARKOITUKSELLA. Zoomausta ei saa estää: kohde-
 * yleisö on 40–60-vuotiaita, joista moni suurentaa tekstiä lukeakseen
 * korkoprosentin. `user-scalable: no` olisi sekä saavutettavuusvirhe että
 * suora tapa menettää juuri se lukija, joka on lähimpänä päätöstä.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  /*
   * THEME-COLOR = SELAIMEN OMA PINTA.
   *
   * Safari värittää tällä koko välilehtipalkin ja ikkunan yläreunan,
   * Chrome ja Safari puhelimessa osoiterivin. Arvo oli hiekka #F0EEE9,
   * joka on käytännössä valkoinen: selain näytti täsmälleen samalta kuin
   * millä tahansa sivulla, eikä väri tehnyt mitään.
   *
   * Nyt arvo on `.theme-ember`-pohjan oranssi #A83E0A — sama kuin heron
   * vyön pohja.
   *
   * HEADER JÄÄ TARKOITUKSELLA VAALEAKSI. Oranssi header kokeiltiin, ja se
   * teki jokaisen sivun yläreunasta värillisen myös silloin, kun sivulla
   * ei ole oranssia vyötä. Vaalea palkki oranssin kehyksen alla ei ole
   * sauma vaan tavallinen otsikkopalkki — selaimen kehys on selaimen, ei
   * sivun, ja lukija erottaa ne toisistaan itsestään.
   *
   * MIKSI TUOTON KANNALTA: puhelimessa oranssi osoiterivi on ensimmäinen
   * asia, joka latautuu — ennen kuin yksikään kuva on paikallaan. Se on
   * ainoa brändielementti, joka ehtii näkyä ennen sisältöä.
   *
   * ÄLÄ laita tähän kirkasta #E8691B: se on maskotin turkin väri, ja
   * selaimen kehyksen pitää olla sitä tummempi, jotta kettu erottuu — ja
   * kirkas oranssi selainpalkki lukee halvalta.
   */
  themeColor: "#A83E0A",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi" className={`${inter.variable} ${display.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a
          href="#sisalto"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:font-bold focus:text-onEmber"
        >
          Siirry sisältöön
        </a>
        <Header />
        <main id="sisalto">{children}</main>
        <Footer />
        {/*
          VERCEL WEB ANALYTICS.

          Tämä oli aiemmin `app/sitemap.ts`:ssä pelkkänä importtina, jota ei
          käytetty missään: sitemap ei renderöi mitään selaimeen, joten
          skriptiä ei koskaan ladattu eikä yksikään käyntä kirjautunut.
          Komponentin on oltava juurilayoutin bodyssa, jotta se on mukana
          jokaisella sivulla.

          MIKSI TÄMÄ ON TUOTON KANNALTA OLENNAINEN: sivusto ansaitsee vasta
          affiliate-klikistä, ja ilman kävijädataa ei tiedä, kaatuuko
          suppilo laskuriin, korttilistaan vai nappiin. Analytiikka ei tuo
          euroakaan itsessään, mutta ilman sitä jokainen CRO-muutos on
          arvaus.

          HUOM: mittaus toimii vain Vercelissä ja vasta kun Web Analytics on
          kytketty päälle projektin asetuksista. Paikallisessa devissä
          komponentti ei lähetä mitään.
        */}
        <Analytics />
      </body>
    </html>
  );
}
