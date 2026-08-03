import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Käyttöehdot",
  description: "Kettukilpailutuksen käyttöehdot.",
  alternates: { canonical: "/kayttoehdot" },
};

const SECTIONS: [string, string][] = [
  ["Palvelun luonne", "Kettukilpailutus on riippumaton vertailupalvelu. Emme myönnä luottoja emmekä toimi luotonvälittäjänä — ohjaamme käyttäjän pankin omaan hakuprosessiin."],
  ["Tietojen oikeellisuus", "Pyrimme pitämään korttien tiedot ajan tasalla, mutta ehdot voivat muuttua nopeasti. Tarkista aina lopulliset ehdot pankin sivuilta ennen hakemista. Vertailu ei ole sijoitus- tai luottoneuvontaa."],
  ["Sopivuus-luku", "Sopivuus-luku on laskennallinen apuväline (70 % osuvuus valintoihisi, 30 % käyttäjäarviot). Se ei ole suositus ottaa luottoa eikä takaa luoton myöntämistä."],
  ["Kumppanuudet", "Voimme saada korvauksen, kun siirryt kumppanin palveluun linkkiemme kautta. Korvaus ei vaikuta vertailun sisältöön tai järjestykseen."],
  ["Vastuunrajoitus", "Emme vastaa kolmansien osapuolten palveluista, niiden saatavuudesta tai päätöksistä, jotka teet vertailun perusteella. Luotto tulee aina mitoittaa omaan maksukykyyn."],
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-hero text-[2rem] leading-[1.1] text-ink sm:text-[2.4rem]">Käyttöehdot</h1>
      <p className="mt-2 text-sm text-ink/60">Päivitetty viimeksi: heinäkuu 2026</p>
      <div className="mt-8 space-y-7">
        {SECTIONS.map(([h, t]) => (
          <section key={h}>
            <h2 className="font-display text-lg font-semibold text-ink">{h}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{t}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 rounded-xl bg-mist p-4 text-xs leading-relaxed text-ink/70">
        Huomio julkaisijalle: tämä on ehtojen pohja — tarkistuta juristilla ennen julkaisua.
      </p>
    </div>
  );
}
