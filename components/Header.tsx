"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import FoxMark from "./FoxMark";
import { FEATURES } from "@/lib/features";

const NAV = [
  { href: "/sahkosopimukset", label: "Sähkö", match: "/sahkosopimukset" },
  /* Korttilinkki palaa tähän itsestään, kun FEATURES.cards kääntyy
     todeksi. Piilotettuna se ei vain veisi kävijää 404:ään vaan myös
     jakaisi navigaation huomion kahtia — ja navigaatiossa jokainen
     ylimääräinen vaihtoehto on pois päävertikaalin klikeistä. */
  ...(FEATURES.cards
    ? [{ href: "/luottokortit", label: "Luottokortit", match: "/luottokortit" }]
    : []),
  { href: "/blogi", label: "Oppaat", match: "/blogi" },
  { href: "/tietoa", label: "Tietoa", match: "/tietoa" },
];

/** Kontekstirivi logon alla kertoo, missä alustan osassa ollaan. */
function contextLabel(pathname: string): string {
  if (pathname.startsWith("/sahkosopimukset")) return "Sähkösopimukset";
  if (FEATURES.cards && (pathname.startsWith("/luottokortit") || pathname.startsWith("/kortit")))
    return "Luottokortit";
  if (pathname.startsWith("/blogi")) return "Oppaat";
  return "Kilpailutuspalvelu";
}

/** Pääkehote ohjaa aina lähimpään vertailuun. */
function ctaHref(pathname: string): string {
  if (FEATURES.cards && (pathname.startsWith("/luottokortit") || pathname.startsWith("/kortit")))
    return "/luottokortit#vertailu";
  return "/sahkosopimukset#vertailu";
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";

  // Header tiivistyy vieritettäessä — pieni ele, joka saa navigaation
  // tuntumaan sovellukselta eikä staattiselta palkilta.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    /*
      HEADER ON ORANSSI, EI HIEKANVÄRINEN.

      MIKSI: selain värittää ikkunan kehyksen sivun `theme-color`-arvolla
      — Safarissa välilehtipalkin, puhelimessa osoiterivin. Kun se on
      kettuoranssi, myös sen alla olevan palkin on oltava oranssi, tai
      väliin jää vaakaraita, joka lukee virheeltä. Yhdessä ne tekevät
      ikkunan yläosasta yhden esineen: kehys, header ja heron vyö samaa
      väriä.

      MIKSI TÄMÄ NOSTAA TUOTTOA: brändiväri on nyt joka sivulla, myös
      niillä, joilla ei ole oranssia vyötä (oppaat, tietosuoja,
      sopimussivut). Vertailupalvelun suurin este on epäily siitä, onko
      sivu oikea yritys — ja tunnistettava, johdonmukainen väri koko
      ikkunan levyisenä on halvin tapa näyttää siltä, että on.

      MITÄ TÄMÄ MAKSAA: sivuston rytmi oli "vaalea sivu, oranssit vyöt".
      Nyt jokaisen sivun yläreuna on oranssi riippumatta siitä, onko
      siellä vyötä. `DESIGN.md`:n sääntö "ainoa pysyvä värillinen pinta
      on alatunniste" ei enää pidä paikkaansa.

      `theme-ember` kääntää `text-ink`-luokan kermaksi, joten navigaation
      luokkia ei tarvitse kirjoittaa uusiksi. Kaksi kohtaa kääntyy
      väärin päin (nappi ja `accentSoft`), ja ne on korjattu alla.
    */
    <header
      className={`theme-ember glass-ember sticky top-0 z-50 transition-[border-color,box-shadow] duration-300 ${
        scrolled ? "border-b border-line/40 shadow-[0_10px_28px_-22px_rgba(74,26,2,0.9)]" : "border-b border-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1180px] items-center justify-between px-4 transition-[height] duration-300 sm:px-6 ${
          scrolled ? "h-[62px]" : "h-[74px]"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <FoxMark size={34} tone="cream" />
          <span className="leading-none">
            {/* Pääte ei versaalina: "KETTUKILPAILUTUS.FI" lukee
                tuoteosanumerona, kun taas pieni ".fi" tunnistetaan
                verkko-osoitteeksi yhdellä silmäyksellä. */}
            <span className="block font-display text-[15px] font-bold uppercase tracking-[0.02em] text-ink">
              Kettukilpailutus<span className="normal-case">.fi</span>
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/60">
              {contextLabel(pathname)}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Päävalikko">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.match);
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
                  <span className="absolute -bottom-1 left-0 h-[2.5px] w-full rounded-full bg-cream" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/*
            EMBER-ANSA: tässä oli `btn-ember` eli oranssi gradienttinappi.
            Oranssilla palkilla se katosi kokonaan. Nappi on nyt palkin
            ainoa vaalea pinta, kuten loppukehotuksen vyössä — ja teksti on
            kiinteä `#A83E0A`, koska `text-accentDark` kääntyy emberissä
            kermaksi eli katoaisi kermanappiin.
          */}
          <Link
            href={ctaHref(pathname)}
            className="hidden rounded-xl bg-cream px-6 py-2.5 font-display text-sm font-bold text-[#A83E0A] shadow-[0_6px_18px_-10px_rgba(74,26,2,0.9)] transition-colors hover:bg-[#FFFFFF] sm:inline-flex"
          >
            Aloita vertailu
          </Link>
          {/*
            Alle 640 pikselin leveydellä headerin "Aloita vertailu" on
            piilotettu tilan vuoksi, joten tämä nappi on puhelimessa
            headerin ainoa painettava kohde. Sen on siis näytettävä
            painikkeelta.

            EMBER-ANSA: tässä oli `bg-accentSoft text-accentDark`. Ne ovat
            vaalealla pohjalla persikka ja tumma oranssi, mutta
            `.theme-ember` kääntää MOLEMMAT kermaksi — nappi olisi ollut
            kermaa kermalla eli täysin näkymätön. Nyt tausta on läpikuultava
            kerma ja ikoni umpikerma.
          */}
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-cream/30 bg-cream/15 text-cream transition-colors hover:bg-cream/25 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Sulje valikko" : "Avaa valikko"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        /* `bg-white` on emberissä kirkkaampi oranssi kuin palkki (199 76 14
           vs 168 62 10), joten auki vedetty paneeli erottuu itsestään
           ilman uutta väriä. Älä "korjaa" tätä valkoiseksi. */
        <nav className="border-t border-line/40 bg-white px-4 py-4 lg:hidden" aria-label="Mobiilivalikko">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 font-display text-[15px] font-medium ${
                    pathname.startsWith(item.match) ? "bg-cream text-[#A83E0A]" : "text-ink/80 hover:bg-mist"
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
          <Link
            href={ctaHref(pathname)}
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-cream px-6 py-3.5 font-display text-[15px] font-bold text-[#A83E0A]"
          >
            Aloita vertailu <ArrowRight size={17} aria-hidden />
          </Link>
        </nav>
      )}
    </header>
  );
}
