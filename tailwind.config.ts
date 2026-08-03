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
      /**
       * Läpinäkyvyysasteikko 0–100 yhden yksikön välein.
       *
       * MIKSI: Tailwindin oletusasteikko sisältää vain viiden monikerrat.
       * Koodissa oli 133 luokkaa muotoa `text-ink/72`, `text-cream/68`,
       * `text-ink/62` — eli arvoja, joita asteikolla ei ole. Tailwind ei
       * generoinut niille sääntöä lainkaan, joten teksti peri hiljaisesti
       * vanhempansa värin. Vaalealla pohjalla virhe ei näkynyt (peritty
       * väri sattui olemaan tumma), mutta tummissa paneeleissa leipäteksti
       * muuttui lähes lukukelvottomaksi — juuri läpinäkyvyysosiossa, jonka
       * koko tehtävä on rakentaa luottamus ennen "Tee sopimus" -klikkiä.
       */
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)])
      ),
      colors: {
        // Pinnat ja tekstit tulevat CSS-muuttujista (ks. globals.css).
        // Tumma on oletus; `.theme-light` kääntää saman koodin vaaleaksi.
        den: "#0A0807",       // syvin — pysyy AINA tummana (hero, footer)
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        white: "rgb(var(--c-card) / <alpha-value>)",  // ylikirjoitettu: kortin pinta
        mist: "rgb(var(--c-mist) / <alpha-value>)",
        peach: "rgb(var(--c-peach) / <alpha-value>)",
        night: "rgb(var(--c-night) / <alpha-value>)",
        navy: "rgb(var(--c-navy) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        lineDark: "rgb(var(--c-line-dark) / <alpha-value>)",

        // Tekstit
        ink: "rgb(var(--c-ink) / <alpha-value>)",     // ensisijainen teksti
        cream: "rgb(var(--c-cream) / <alpha-value>)", // vahvin kontrasti

        // Kettuoranssi — ainoa varsinainen väri, sama molemmilla pinnoilla
        accent: "#E8691B",
        accentDark: "rgb(var(--c-accent-dark) / <alpha-value>)", // tekstioranssi, tummenee vaalealla
        accentSoft: "rgb(var(--c-accent-soft) / <alpha-value>)",
        // Teksti oranssin napin PÄÄLLÄ. Kiinteä arvo, ei muuttuja: nappi on
        // oranssi molemmilla pinnoilla, joten teksti ei saa kääntyä tummaksi
        // vaalean osion sisällä (text-cream kääntyisi).
        onEmber: "#FFF3E9",

        // Kulta vain hiusviivoihin ja pieniin merkkeihin
        gold: "#D9A24F",
        // Kulta tekstinä — tummenee vaalealla pinnalla, ks. globals.css
        goldInk: "rgb(var(--c-gold-ink) / <alpha-value>)",
        star: "#E8B04A",
        ok: "#E8691B",
        mint: "#E8691B",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        data: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Vain isot otsikot. Ei koskaan nappeihin tai chippeihin.
      },
      boxShadow: {
        // Varjot vaihtuvat pinnan mukana: tummalla mukana yläreunan valojuova,
        // vaalealla pelkkä pehmeä varjo (ks. globals.css).
        card: "var(--sh-card)",
        cardHover: "var(--sh-card-hover)",
        lift: "var(--sh-lift)",
        ember: "0 10px 32px -8px rgba(232,105,27,0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
