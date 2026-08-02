import type { Config } from "tailwindcss";

/**
 * Kettukilpailutus design tokens — tumma "ketun kolo" -teema.
 *
 * Koko sivusto on tumma. Syvyys tehdään VALOARVOILLA, ei väreillä:
 *   den    #0A0807  syvin — herot, footer, upotetut laatikot
 *   paper  #100C0A  sivun pohja
 *   white  #17120F  kortin pinta (Tailwindin white on tarkoituksella ylikirjoitettu,
 *                   jotta koko olemassa oleva bg-white-koodi muuttuu kerralla)
 *   mist   #1E1712  kohotettu paneeli
 *   night  #2A2018  chipit ja ikonilaatat
 * Värejä on tarkoituksella vain kaksi: kettuoranssi ja kulta. Kaikki muu on
 * lämpimän harmaan sävyjä — se pitää ilmeen asiallisena.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pinnat, tummimmasta vaaleimpaan
        den: "#0A0807",
        paper: "#0D0A08",
        white: "#1A1512",     // ylikirjoitettu: kortin pinta
        mist: "#241C16",
        peach: "#2A1D13",     // lämmin sävytetty paneeli
        night: "#312619",     // ikonilaatat, chipit
        navy: "#342820",      // hover kohotetulla
        line: "#332A21",
        lineDark: "#43372B",

        // Tekstit
        ink: "#F2EADF",       // ensisijainen teksti (lämmin kerma)
        cream: "#F7F1E8",     // kirkkain teksti tummalla

        // Kettuoranssi — ainoa varsinainen väri
        accent: "#E8691B",
        accentDark: "#FF8C3C", // sekä tekstioranssi tummalla että napin hover
        accentSoft: "#2E1C0E", // oranssin sävytetty pohja chipeille

        // Kulta vain hiusviivoihin ja pieniin merkkeihin
        gold: "#D9A24F",
        star: "#E8B04A",
        ok: "#E8691B",
        mint: "#E8691B",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        data: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Tummalla varjo ei riitä syvyyteen — mukana yläreunan valojuova,
        // joka saa pinnat näyttämään veistetyiltä eikä litteiltä laatikoilta.
        card: "inset 0 1px 0 rgba(255,244,235,0.04), 0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
        cardHover: "inset 0 1px 0 rgba(255,244,235,0.07), 0 2px 6px rgba(0,0,0,0.45), 0 22px 48px rgba(0,0,0,0.45)",
        lift: "inset 0 1px 0 rgba(255,244,235,0.06), 0 28px 70px -14px rgba(0,0,0,0.75)",
        ember: "0 10px 32px -8px rgba(232,105,27,0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
