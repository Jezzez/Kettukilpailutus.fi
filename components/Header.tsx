"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import FoxMark from "./FoxMark";
import AffiliateButton from "./AffiliateButton";
import { FEATURES } from "@/lib/features";
import { LOAN_PARTNER } from "@/lib/loans";
import { ENERGY_COMPARE, ENERGY_PATH, isEnergyPath } from "@/lib/nav";

/*
  AKTIIVISUUS ON FUNKTIO, EI ETULIITE.

  Ennen jokaisella rivillä oli `match`-merkkijono, jota verrattiin
  `startsWith`illä. Se hajosi sinä aikana, kun vertailu asui etusivulla:
  "/" on jokaisen polun alku, joten sähkölinkki oli korostettuna ihan
  joka sivulla. Predikaatti antaa jokaiselle riville oman ehdon ilman
  että muut rivit muuttuvat.

  Vertailu on nyt taas omassa osoitteessaan, eli `startsWith` toimisi
  jälleen — mutta rakennetta ei palauteta. Osoite on ehtinyt vaihtua
  kahdesti, ja predikaatti on se, mikä teki jälkimmäisestä vaihdosta
  yhden rivin muutoksen `lib/nav.ts`:ssä eikä kymmenen tiedoston
  läpikäyntiä.
*/
type NavItem = { href: string; label: string; active: (pathname: string) => boolean };

const NAV: NavItem[] = [
  { href: ENERGY_PATH, label: "Sähkö", active: isEnergyPath },
  /* Korttilinkki palaa tähän itsestään, kun FEATURES.cards kääntyy
     todeksi. Piilotettuna se ei vain veisi kävijää 404:ään vaan myös
     jakaisi navigaation huomion kahtia — ja navigaatiossa jokainen
     ylimääräinen vaihtoehto on pois päävertikaalin klikeistä. */
  ...(FEATURES.cards
    ? [
        {
          href: "/luottokortit",
          label: "Luottokortit",
          active: (p: string) => p.startsWith("/luottokortit") || p.startsWith("/kortit"),
        },
      ]
    : []),
  ...(FEATURES.loans
    ? [{ href: "/lainat", label: "Lainat", active: (p: string) => p.startsWith("/lainat") }]
    : []),
  { href: "/blogi", label: "Oppaat", active: (p: string) => p.startsWith("/blogi") },
  { href: "/tietoa", label: "Tietoa", active: (p: string) => p.startsWith("/tietoa") },
];

/** Kontekstirivi logon alla kertoo, missä alustan osassa ollaan. */
function contextLabel(pathname: string): string {
  if (isEnergyPath(pathname)) return "Sähkösopimukset";
  if (FEATURES.cards && (pathname.startsWith("/luottokortit") || pathname.startsWith("/kortit")))
    return "Luottokortit";
  if (FEATURES.loans && pathname.startsWith("/lainat")) return "Lainat";
  if (pathname.startsWith("/blogi")) return "Oppaat";
  return "Kilpailutuspalvelu";
}

/** Pääkehote ohjaa aina lähimpään vertailuun. */
function ctaHref(pathname: string): string {
  if (FEATURES.cards && (pathname.startsWith("/luottokortit") || pathname.startsWith("/kortit")))
    return "/luottokortit#vertailu";
  return ENERGY_COMPARE;
}

/**
 * Ollaanko lainasivulla. Headerin kehote on erikoistapaus siellä:
 * lainasivulla ei ole omaa vertailua, johon kehote voisi vierittää,
 * joten sisäinen "Aloita vertailu" veisi kävijän sähkövertailuun —
 * eli pois sivulta, jonka ainoa ansaintatapa on siirtymä Sortterille.
 * Ruudun kirkkain nappi osoittaisi silloin väärään suuntaan.
 */
function isLoanPage(pathname: string): boolean {
  return FEATURES.loans && pathname.startsWith("/lainat");
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";

  /*
    Header tiivistyy vieritettäessä — pieni ele, joka saa navigaation
    tuntumaan sovellukselta eikä staattiselta palkilta.

    KAKSI KYNNYSTÄ, EI YHTÄ. Tämä ei ole tyylikysymys vaan korjaus.

    Header on `sticky`, eli se on dokumentin normaalissa virrassa. Kun sen
    korkeus muuttuu 74 → 62, kaikki sen alapuolinen sisältö nousee 12 px,
    ja Chromen scroll anchoring korjaa `scrollY`:n takaisin saman verran
    pitääkseen sisällön visuaalisesti paikallaan.

    Yhdellä kynnyksellä (aiemmin `scrollY > 12`) tuo korjaus heitti
    vierityksen kynnyksen yli joka kerta, ja header jäi värisemään:

      13 → kutistuu → anchoring vie ~1:een → 1 < 12 → laajenee
         → anchoring vie ~13:een → kutistuu → ...

    Silmukka oli mahdollinen, koska kynnys oli 12 px:n korkeusmuutoksen
    sisällä. Nyt kynnysten väli on 40 px eli yli kolminkertainen muutokseen
    nähden, joten yksikään anchoring-korjaus ei voi enää heittää tilaa
    takaisin: 65 → kutistuu → ~53, ja 53 > 24 eli tila pysyy. Vastaavasti
    23 → laajenee → ~35, ja 35 < 64 eli tila pysyy.

    Kynnys siirtyi samalla pois sivun yläreunasta. Se on tarkoituksellista:
    korkeuden muutos nykii koko sivua 12 px, ja juuri yläreunassa se nykäisy
    osuisi heron laskuriin — sivun ainoaan kohtaan, jonka pitää tuntua
    vakaalta ennen kuin kävijä uskaltaa syöttää omat lukunsa.
  */
  useEffect(() => {
    const KUTISTU_YLI = 64;
    const LAAJENNA_ALLE = 24;
    const onScroll = () =>
      setScrolled((nyt) => {
        const y = window.scrollY;
        if (y > KUTISTU_YLI) return true;
        if (y < LAAJENNA_ALLE) return false;
        return nyt;
      });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`glass-light sticky top-0 z-50 transition-[border-color,box-shadow] duration-300 ${
        scrolled ? "border-b border-line shadow-[0_8px_24px_-20px_rgba(20,18,15,0.6)]" : "border-b border-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1180px] items-center justify-between px-4 transition-[height] duration-300 sm:px-6 ${
          scrolled ? "h-[62px]" : "h-[74px]"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <FoxMark size={34} priority />
          <span className="leading-none">
            {/*
              PÄÄTE ON VERSAALINA, KOKO LOGOTYYPPI SAMASSA KOOSSA.

              Tässä oli aiemmin `normal-case`-poikkeus, joka piirsi päätteen
              pienellä: "KETTUKILPAILUTUS.fi". Perustelu oli, että pieni
              ".fi" tunnistetaan verkko-osoitteeksi nopeammin. Se ei
              kestänyt katsomista: kahdessa koossa piirretty logo näyttää
              siltä, että pääte on liimattu nimeen jälkikäteen, eikä osalta
              samaa merkkiä. Verkko-osoitteeksi sen tunnistaa pisteestä,
              ei kirjasinkoosta.

              MIKSI TÄLLÄ ON VÄLIÄ TUOTON KANNALTA: logo on ainoa asia,
              joka toistuu jokaisella sivulla ja jokaisessa
              vierailussa. Kilpailutuspalvelussa klikki tehdään sille,
              jonka nimen muistaa toisellakin käynnillä — ja yhtenäinen
              merkki jää mieleen, kahteen kokoon hajoava ei.
            */}
            <span className="block font-display text-[15px] font-bold uppercase tracking-[0.02em] text-ink">
              Kettukilpailutus.fi
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">
              {contextLabel(pathname)}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Päävalikko">
          {NAV.map((item) => {
            const active = item.active(pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative py-1 font-display text-[15px] font-medium transition-colors ${
                  active ? "text-ink" : "text-ink/70 hover:text-ink"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 h-[2.5px] w-full rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isLoanPage(pathname) ? (
            /* Lainasivulla headerin nappi menee suoraan kumppanille.
               Sama nappi, sama paikka — vain kohde vaihtuu siihen, mistä
               tämä sivu ansaitsee. Oma `placement`, jotta seurannasta
               näkee erikseen kuinka moni lähtee headerista. */
            <AffiliateButton
              href={LOAN_PARTNER.url}
              cardId={LOAN_PARTNER.id}
              placement="lainat-header"
              className="hidden !rounded-xl !px-6 !py-2.5 !text-sm sm:inline-flex"
            >
              Hae lainatarjoukset
            </AffiliateButton>
          ) : (
            <Link
              href={ctaHref(pathname)}
              className="hidden btn-ember rounded-xl px-6 py-2.5 font-display text-sm font-bold text-onEmber transition-all sm:inline-flex"
            >
              Aloita vertailu
            </Link>
          )}
          {/*
            Valikkonappi on oranssisävyinen, ei beige. Alle 640 pikselin
            leveydellä headerin "Aloita vertailu" on piilotettu tilan
            vuoksi, joten tämä nappi on puhelimessa headerin ainoa
            painettava kohde. Beige laatikko beigellä palkilla ei näytä
            painikkeelta lainkaan — sävytetty tausta ja oranssi ikoni
            kertovat sekunnissa, että tästä aukeaa jotain.
          */}
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-accent/25 bg-accentSoft text-accentDark transition-colors hover:border-accent/45 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Sulje valikko" : "Avaa valikko"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-4 py-4 lg:hidden" aria-label="Mobiilivalikko">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 font-display text-[15px] font-medium ${
                    item.active(pathname) ? "bg-accentSoft text-accentDark" : "text-ink/80 hover:bg-mist"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/*
            KEHOTE KUULUU MYÖS AUKI VEDETTYYN VALIKKOON.

            Valikko oli pelkkä neljän linkin lista. Käyttäjä, joka
            avaa sen, on juuri ilmaissut haluavansa jonnekin — ja
            listasta puuttui juuri se paikka, josta palvelu ansaitsee.
            Nyt vertailuun pääsee samalla eleellä kuin työpöydällä,
            eikä valikon avaaja joudu arvaamaan, kätkeytyykö
            kilpailutus "Sähkön" vai "Luottokorttien" taakse.
          */}
          {isLoanPage(pathname) ? (
            <AffiliateButton
              href={LOAN_PARTNER.url}
              cardId={LOAN_PARTNER.id}
              placement="lainat-valikko"
              className="mt-3 flex w-full !rounded-xl !px-6 !py-3.5"
            >
              Hae lainatarjoukset <ArrowRight size={17} aria-hidden />
            </AffiliateButton>
          ) : (
            <Link
              href={ctaHref(pathname)}
              onClick={() => setOpen(false)}
              className="btn-ember mt-3 flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-[15px] font-bold text-onEmber"
            >
              Aloita vertailu <ArrowRight size={17} aria-hidden />
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
