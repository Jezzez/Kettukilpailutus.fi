"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCards, SITE } from "@/lib/data";
import { getPlans, getEnergyTopics } from "@/lib/energy";
import FoxMark from "./FoxMark";

/**
 * Footer seuraa kontekstia: sähköä kilpailuttavalle ei tarjota
 * luottokorttilinkkejä. Väärän vertikaalin linkit vievät huomiota
 * ja saavat palvelun näyttämään linkkifarmilta.
 */
export default function Footer() {
  const pathname = usePathname() ?? "/";
  const onEnergy = pathname.startsWith("/sahkosopimukset");
  const onCards = pathname.startsWith("/luottokortit") || pathname.startsWith("/kortit");

  const contextNav = onEnergy
    ? {
        title: "Sähkösopimukset",
        links: [
          ...getEnergyTopics().map((t) => ({ href: `/sahkosopimukset/${t.slug}`, label: t.h1 })),
          ...getPlans().slice(0, 3).map((p) => ({
            href: `/sahkosopimukset/sopimus/${p.slug}`,
            label: `${p.provider} ${p.name}`,
          })),
        ],
      }
    : onCards
      ? {
          title: "Luottokortit",
          links: getCards().slice(0, 6).map((c) => ({ href: `/kortit/${c.slug}`, label: c.name })),
        }
      : {
          title: "Kilpailuta",
          links: [
            { href: "/sahkosopimukset", label: "Sähkösopimukset" },
            { href: "/luottokortit", label: "Luottokortit" },
            { href: "/blogi", label: "Ketun oppaat" },
          ],
        };

  return (
    /*
      Footer on tarkoituksella VIILEIN ja vaalein pinta koko sivulla.

      MIKSI: aiemmin läpinäkyvyysosio, loppu-CTA ja footer olivat kaikki
      samaa lämmintä persikkaa peräkkäin. Kolme samanlaista pintaa sulautuu
      yhdeksi puuroksi, jolloin viimeinen "Kilpailuta sähkösopimus" -nappi
      hukkuu — ja juuri se nappi on sivun viimeinen tilaisuus ansaita.
      Nyt lämmin pinta on varattu CTA:lle ja footer sammuttaa sivun
      rauhallisesti. Ylhäällä kultaviiva erottaa footerin selvästi omaksi
      tasokseen, jotta lukija tietää saapuneensa loppuun.
    */
    <footer className="border-t-2 border-gold/35 bg-mist">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="flex items-center gap-2.5 font-display text-lg font-bold uppercase tracking-wide text-ink">
            <FoxMark size={30} /> Kettukilpailutus
          </p>
          <p className="mt-3 font-display text-[15px] font-bold text-accentDark">
            Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi.
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/70">{SITE.description}</p>
          <p className="mt-5 max-w-sm rounded-xl border border-line bg-white/60 p-4 text-xs leading-relaxed text-ink/70">
            <strong className="text-ink/85">Mainostajan ilmoitus:</strong> Saamme korvauksen, kun
            teet sopimuksen kumppanin palvelussa linkkiemme kautta. Korvaus ei vaikuta vertailun
            sisältöön eikä järjestykseen. Hinnat ovat esimerkinomaisia — tarkista ajantasaiset
            ehdot palveluntarjoajan sivuilta.
          </p>

          <OperatorDetails />
        </div>

        <nav aria-label={contextNav.title}>
          <p className="font-display text-sm font-bold text-ink">{contextNav.title}</p>
          <ul className="mt-3 space-y-2">
            {contextNav.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-ink/70 transition-colors hover:text-accentDark">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Sivusto">
          <p className="font-display text-sm font-bold text-ink">Sivusto</p>
          <ul className="mt-3 space-y-2">
            {[
              ["/", "Etusivu"],
              ["/blogi", "Ketun oppaat"],
              ["/tietoa", "Tietoa meistä"],
              ["/tietosuoja", "Tietosuoja"],
              ["/kayttoehdot", "Käyttöehdot"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-ink/70 transition-colors hover:text-accentDark">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-ink/12 py-5 text-center text-xs text-ink/65">
        © {new Date().getFullYear()} {SITE.name}. Vertailu on tiedoksi, ei henkilökohtaista neuvontaa.
      </div>
    </footer>
  );
}

/**
 * Sivuston ylläpitäjä — footerin luottamuslohko.
 *
 * MIKSI TÄMÄ ON TÄRKEÄ TUOTOLLE: kilpailutussivun epäilyttävin piirre on
 * anonymiteetti. Kun kävijä ei löydä mistään, kuka sivua pyörittää, hän
 * olettaa pahinta — että kyseessä on yhteystietoja keräävä liidifarmi —
 * eikä paina "Tee sopimus" -nappia. Y-tunnus ja oikea sähköpostiosoite
 * ovat halvin mahdollinen tapa kumota se epäilys, ja ne ovat samalla
 * asioita, jotka affiliate-verkosto (Adtraction) tarkistaa hakemuksesta.
 *
 * MIKSI OMANA KOMPONENTTINA: lohko piilottaa itsensä kokonaan, jos
 * `SITE.operator` on vielä täyttämättä. Puolityhjä yhteystietolaatikko
 * olisi pahempi kuin ei lohkoa lainkaan — se näyttäisi keskeneräiseltä
 * juuri siinä kohdassa, jonka tehtävä on vakuuttaa.
 *
 * SÄHKÖPOSTI EI OLE mailto-linkki vaan pelkkää tekstiä: mailto avaa
 * mobiilissa sähköpostisovelluksen ja vie kävijän pois sivulta kesken
 * vertailun. Osoitteen tehtävä tässä on todistaa tavoitettavuus, ei
 * kerätä viestejä.
 */
function OperatorDetails() {
  const { legalName, businessId, domicile, email } = SITE.operator;
  const rows = [
    legalName,
    businessId ? `Y-tunnus ${businessId}` : "",
    domicile,
    email,
  ].filter(Boolean);

  if (rows.length === 0) return null;

  return (
    <div className="mt-5 max-w-sm">
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-goldInk">
        Sivuston ylläpitäjä
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-ink/70">
        {rows.map((r, i) => (
          <span key={r}>
            {i > 0 && <span className="text-ink/30"> · </span>}
            {r}
          </span>
        ))}
      </p>
    </div>
  );
}
