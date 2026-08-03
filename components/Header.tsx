"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import FoxMark from "./FoxMark";

const NAV = [
  { href: "/sahkosopimukset", label: "Sähkö", match: "/sahkosopimukset" },
  { href: "/luottokortit", label: "Luottokortit", match: "/luottokortit" },
  { href: "/blogi", label: "Oppaat", match: "/blogi" },
  { href: "/tietoa", label: "Tietoa", match: "/tietoa" },
];

/** Kontekstirivi logon alla kertoo, missä alustan osassa ollaan. */
function contextLabel(pathname: string): string {
  if (pathname.startsWith("/sahkosopimukset")) return "Sähkösopimukset";
  if (pathname.startsWith("/luottokortit") || pathname.startsWith("/kortit")) return "Luottokortit";
  if (pathname.startsWith("/blogi")) return "Oppaat";
  return "Kilpailutuspalvelu";
}

/** Pääkehote ohjaa aina lähimpään vertailuun. */
function ctaHref(pathname: string): string {
  if (pathname.startsWith("/luottokortit") || pathname.startsWith("/kortit")) return "/luottokortit#vertailu";
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
    <header
      className={`glass-light sticky top-0 z-50 transition-[border-color,box-shadow] duration-300 ${
        scrolled ? "border-b border-line shadow-[0_8px_24px_-20px_rgba(20,18,15,0.6)]" : "border-b border-transparent"
      }`}
    >
      {/*
        ORANSSI VIIVA AIVAN YLÄREUNASSA.

        MIKSI: header on sivuston ainoa osa, joka on näkyvissä joka
        sivulla ja koko vierityksen ajan. Se oli kuitenkin täysin
        väritön — beige palkki beigen päällä. Kävijä, joka on
        vierittänyt puolivälin artikkeliin, ei enää näe ruudullaan
        yhtään brändiväriä, ja palvelu alkaa tuntua yleiseltä
        blogilta. Kolmen pikselin viiva pitää oranssin läsnä koko
        istunnon ajan ilman että se kilpailee heron vyön kanssa.

        MIKSI NIIN OHUT: paksumpi vyö tekisi headerista toisen
        oranssin kaistan heti oikean vyön päälle, jolloin kumpikaan
        ei enää erotu. Viivan tehtävä on merkitä omistajuus, ei
        kerätä katsetta.
      */}
      <div aria-hidden className="h-[3px] w-full bg-accent" />
      <div
        className={`mx-auto flex max-w-[1180px] items-center justify-between px-4 transition-[height] duration-300 sm:px-6 ${
          scrolled ? "h-[62px]" : "h-[74px]"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <FoxMark size={34} />
          <span className="leading-none">
            <span className="block font-display text-[15px] font-bold uppercase tracking-[0.02em] text-ink">
              Kettukilpailutus
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
                  <span className="absolute -bottom-1 left-0 h-[2.5px] w-full rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={ctaHref(pathname)}
            className="hidden btn-ember rounded-xl px-6 py-2.5 font-display text-sm font-bold text-onEmber transition-all sm:inline-flex"
          >
            Aloita vertailu
          </Link>
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
                    pathname.startsWith(item.match) ? "bg-accentSoft text-accentDark" : "text-ink/80 hover:bg-mist"
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
            className="btn-ember mt-3 flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-[15px] font-bold text-onEmber"
          >
            Aloita vertailu <ArrowRight size={17} aria-hidden />
          </Link>
        </nav>
      )}
    </header>
  );
}
