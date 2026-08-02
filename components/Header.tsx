"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
      className={`glass-dark sticky top-0 z-50 transition-[border-color,box-shadow] duration-300 ${
        scrolled ? "border-b border-line shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]" : "border-b border-transparent"
      }`}
    >
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
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/58">
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
                  active ? "text-ink" : "text-ink/72 hover:text-ink"
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
            className="hidden btn-ember rounded-xl px-6 py-2.5 font-display text-sm font-bold text-cream transition-all sm:inline-flex"
          >
            Aloita vertailu
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink lg:hidden"
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
                    pathname.startsWith(item.match) ? "bg-accentSoft text-accentDark" : "text-ink/82 hover:bg-mist"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
