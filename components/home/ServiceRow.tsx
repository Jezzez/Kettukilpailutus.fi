"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { trackAffiliateClick } from "@/lib/track";
import PartnerLink, { type Partner } from "@/components/PartnerDialog";

/*
  PALVELURIVI — TÄYSLEVEÄ VAIHTOEHTO, EI LAATTA.

  MIKSI TÄMÄ KORVASI KOLMEN SARAKKEEN LAATAT. Heron laatat olivat kolme
  pientä ruutua rinnakkain, ja ne hylättiin kahdesti. Syy ei ollut
  yksityiskohdissa vaan muodossa: 390 pikselin ruudulla kolme saraketta on
  noin 112 px kukin, eli laatan sisään mahtui vain kuvake ja yksi sana.
  Kolme yhden sanan ruutua ei kerro kävijälle mitä klikistä seuraa, joten
  ne lukevat koristeeksi otsikon alla eikä valikoksi.

  Täysleveä rivi mahtuu samalle ruudulle kolme kertaa ja siinä on tilaa
  verbille ("Kilpailuta sähkö") ja toiselle riville, joka kertoo mitä kävijä
  saa. Sama muoto on kilpailuttaja.fi:n herossa, ja se on siellä samasta
  syystä: rivi on tarpeeksi iso ollakseen painike ja tarpeeksi kertova
  ollakseen vastaus.

  RIVI VIE SUORAAN KOHTEESEEN, EI SIVUN OSIOON. Laatat liu'uttivat aiemmin
  osioon (`#sahko`), koska vakuutuslinkin takana on kumppanin sivu eikä
  kävijän pitänyt joutua sinne kuulematta siitä. Kumppanin nimeä ei enää
  sanota heron riveillä (Jessen pyyntö 19.9.2026), joten välipysähdys on
  turha: se ei enää kertoisi kävijälle mitään, mitä rivi ei kerro. Ulkoinen
  kohde on silti merkitty `target="_blank"`-uudella välilehdellä, ja rajaus
  luetaan `TrustBlock`in kohdasta 03. Ero on yksi klikki vähemmän matkalla
  palkkioon; perustelut ja riski `lib/services.ts`:n yläkommentissa.

  MIKSI ASIAKASKOMPONENTTI. Vakuutusrivi menee POP:n seurantaosoitteeseen,
  ja siitä klikistä maksetaan palkkio. Ilman `onClick`-seurantaa emme näe
  GA4:stä kuinka moni etusivun kävijä siirtyy, ja mittaamaton siirtymä on
  sama kuin ei siirtymää, koska sitä ei voi parantaa. Sisäiset rivit eivät
  tarvitsisi tätä, mutta ne kulkevat saman komponentin läpi, jotta ulkoasu
  ei voi eriytyä.

  KUVAKE TULEE PROPINA REACT-ELEMENTTINÄ. `Service.Icon` on funktio, eikä
  funktiota voi välittää palvelinkomponentista asiakaskomponentille. Valmiiksi
  piirretty elementti kulkee, funktio ei.
*/

export default function ServiceRow({
  name,
  href,
  label,
  note,
  external,
  partner,
  placement,
  icon,
}: {
  /** Palvelun nimi. Menee GA4:een klikin tunnisteena. */
  name: string;
  href: string;
  /** Rivin iso teksti. Verbi, `Service.cta`. */
  label: string;
  /** Pieni toinen rivi. Kertoo kuka työn tekee. */
  note: string;
  /** Vieko rivi kumppanin sivulle. */
  external?: true;
  /** Jos annettu, rivi avaa väli-ilmoituksen ennen siirtymää. */
  partner?: Partner;
  /** Mistä kohtaa sivua klikattiin. GA4:n `placement`-kenttä. */
  placement: string;
  icon: ReactNode;
}) {
  /*
    `theme-light` PALAUTTAA TOKENIT VAALEIKSI. Rivi on oranssin vyön päällä,
    jossa `bg-white` on oranssi ja `text-accentDark` vaaleaa kermaa
    (CLAUDE.md: ember-ansa). Ilman kääreluokkaa rivi olisi oranssi laatikko
    oranssilla pinnalla.
  */
  const className =
    "theme-light lift press group flex w-full items-center gap-4 rounded-2xl bg-white px-4 py-4 text-left shadow-lift sm:px-5";

  const inner = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-peach text-accentDark">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-[16px] font-bold leading-tight text-accentDark sm:text-[17px]">
          {label}
        </span>
        <span className="mt-1 block text-[13px] leading-snug text-ink/60">
          {note}
        </span>
      </span>

      <ChevronRight
        size={20}
        strokeWidth={2.4}
        aria-hidden
        className="shrink-0 text-accentDark/40 transition-transform group-hover:translate-x-0.5"
      />
    </>
  );

  /*
    KUMPPANIRIVI KYSYY ENSIN.

    `PartnerLink` hoitaa `href`:n, `target`:n, `rel`:n ja seurannan itse,
    joten tähän haaraan ei jää niitä toiseen kertaan. Seuranta siirtyi
    samalla klikistä vahvistukseen: `affiliate_click` tarkoittaa nyt
    siirtymää eikä aikomusta. Ks. `components/PartnerDialog.tsx`.
  */
  if (partner) {
    return (
      <PartnerLink href={href} partner={partner} placement={placement} className={className}>
        {inner}
      </PartnerLink>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        onClick={() => trackAffiliateClick(name, placement)}
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
