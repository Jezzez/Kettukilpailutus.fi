"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CreditCard, Info, Zap } from "lucide-react";

const ITEMS = [
  { href: "/sahkosopimukset", label: "Sähkö", icon: Zap },
  { href: "/luottokortit", label: "Kortit", icon: CreditCard },
  { href: "/blogi", label: "Oppaat", icon: BookOpen },
  { href: "/tietoa", label: "Tietoa", icon: Info },
];

/** Mobiilin alanavigaatio — sovellusmainen tuntuma, safe-area huomioitu. */
export default function MobileNav() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Alanavigaatio"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md">
        {ITEMS.map((item, i) => (
          <li key={item.label} className="flex-1">
            <Link
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                pathname?.startsWith(item.href) ? "text-accentDark" : "text-ink/60 hover:text-ink"
              }`}
            >
              <item.icon size={20} strokeWidth={1.9} aria-hidden />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
