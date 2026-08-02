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
    <footer className="border-t border-line bg-den">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="flex items-center gap-2.5 font-display text-lg font-bold uppercase tracking-wide text-cream">
            <FoxMark size={30} /> Kettukilpailutus
          </p>
          <p className="mt-3 font-display text-[15px] font-bold text-accentDark">
            Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi.
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/72">{SITE.description}</p>
          <p className="mt-5 max-w-sm rounded-xl border border-cream/[0.07] bg-cream/[0.04] p-4 text-xs leading-relaxed text-cream/72">
            <strong className="text-cream/85">Mainostajan ilmoitus:</strong> Saamme korvauksen, kun
            teet sopimuksen kumppanin palvelussa linkkiemme kautta. Korvaus ei vaikuta vertailun
            sisältöön eikä järjestykseen. Hinnat ovat esimerkinomaisia — tarkista ajantasaiset
            ehdot palveluntarjoajan sivuilta.
          </p>
        </div>

        <nav aria-label={contextNav.title}>
          <p className="font-display text-sm font-bold text-cream">{contextNav.title}</p>
          <ul className="mt-3 space-y-2">
            {contextNav.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-cream/72 transition-colors hover:text-accentDark">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Sivusto">
          <p className="font-display text-sm font-bold text-cream">Sivusto</p>
          <ul className="mt-3 space-y-2">
            {[
              ["/", "Etusivu"],
              ["/blogi", "Ketun oppaat"],
              ["/tietoa", "Tietoa meistä"],
              ["/tietosuoja", "Tietosuoja"],
              ["/kayttoehdot", "Käyttöehdot"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-cream/72 transition-colors hover:text-accentDark">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/62">
        © {new Date().getFullYear()} {SITE.name}. Vertailu on tiedoksi, ei henkilökohtaista neuvontaa.
      </div>
    </footer>
  );
}
