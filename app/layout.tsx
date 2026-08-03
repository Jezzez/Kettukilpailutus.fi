import type { Metadata } from "next";
import { Inter, Schibsted_Grotesk } from "next/font/google";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { SITE } from "@/lib/data";
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
    default: SITE.name + " – kilpailuta sähkö, kortit ja sopimukset",
    template: "%s | " + SITE.name,
  },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: SITE.name,
    title: "Kettukilpailutus – kilpailuta sopimuksesi minuutissa",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kettukilpailutus – kilpailuta sopimuksesi minuutissa",
    description: SITE.description,
  },
  robots: { index: true, follow: true },
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
        <main id="sisalto" className="pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
