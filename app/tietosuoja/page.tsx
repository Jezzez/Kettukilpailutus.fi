import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tietosuojaseloste",
  description: "Kettukilpailutuksen tietosuojaseloste: mitä tietoja keräämme ja miten niitä käsittelemme.",
  alternates: { canonical: "/tietosuoja" },
};

const SECTIONS: [string, string][] = [
  ["Rekisterinpitäjä", "Kettukilpailutus (kettukilpailutus.fi). Yhteydenotot: kettu@kettukilpailutus.fi."],
  ["Mitä tietoja keräämme", "Sivusto ei vaadi rekisteröitymistä eikä kerää nimeä, henkilötunnusta tai yhteystietoja. Keräämme käyttöanalytiikkaa sivujen katseluista ja vertailulinkkien klikkauksista palvelun kehittämiseksi."],
  ["Evästeet ja analytiikka", "Vercel Web Analytics tuottaa evästeetöntä, koottua kävijätilastoa. Google Analytics 4 käyttää analytiikkaevästeitä vain, jos hyväksyt ne evästeasetuksissa. Ilman hyväksyntää Google Analytics toimii rajoitetussa evästeettömässä tilassa. Mainonnan tallennus ja personointi on estetty."],
  ["Affiliate-linkit", "Kun siirryt pankin sivulle linkkiemme kautta, kumppani voi asettaa oman evästeensä komission kohdistamiseksi. Tämä tapahtuu kumppanin sivustolla ja sen omien ehtojen mukaisesti."],
  ["Tietojen käsittelijät", "Emme myy käyttäjätietoja. Sivuston käyttöanalytiikkaa käsittelevät palveluntarjoajinamme Vercel ja Google niiden omien tietosuojaehtojen mukaisesti."],
  ["Oikeutesi", "Sinulla on oikeus saada tieto sinua koskevista tiedoista sekä pyytää niiden oikaisua tai poistoa. Ota yhteyttä sähköpostitse."],
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-hero text-[2rem] leading-[1.1] text-ink sm:text-[2.4rem]">Tietosuojaseloste</h1>
      <p className="mt-2 text-sm text-ink/60">Päivitetty viimeksi: elokuu 2026</p>
      <div className="mt-8 space-y-7">
        {SECTIONS.map(([h, t]) => (
          <section key={h}>
            <h2 className="font-display text-lg font-semibold text-ink">{h}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{t}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 rounded-xl bg-mist p-4 text-xs leading-relaxed text-ink/70">
        Huomio julkaisijalle: tämä on selosteen pohja. Tarkista sisältö ja täydennä
        yrityksen viralliset tiedot (Y-tunnus, osoite) ennen sivuston julkaisua.
      </p>
    </div>
  );
}
