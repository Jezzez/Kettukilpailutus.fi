"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackAffiliateClick } from "@/lib/track";

/*
  PALVELUN PAINIKE — YKSI KOMPONENTTI, KOLME PALVELUA.

  MIKSI OMA KOMPONENTTI. Etusivulla on kaksi paikkaa, joissa kolme
  palvelua saavat oman nappinsa: vertikaaliosiot ja loppukehotus. Kun
  nappi kirjoitettiin molemmissa käsin, sähkön nappi oli kummassakin se
  täytetty ja lainojen pelkkä ääriviiva — ei päätöksestä vaan siitä, että
  sähkö kirjoitettiin ensin ja loput kopioitiin kiireessä. Nyt jokainen
  nappi tulee samasta funktiosta, eikä epätasapaino voi syntyä vahingossa.

  MIKSI TÄMÄ ON ASIAKASKOMPONENTTI. Vakuutuslinkki menee POP Vakuutuksen
  seurantaosoitteeseen, ja siitä klikistä maksetaan palkkio. Ilman
  `onClick`-seurantaa emme näe GA4:ssä, kuinka moni etusivun kävijä
  oikeasti siirtyy — ja mittaamaton siirtymä on sama kuin ei siirtymää,
  koska sitä ei voi parantaa. Sisäiset linkit eivät tarvitsisi tätä, mutta
  ne kulkevat saman komponentin läpi, jotta ulkoasu pysyy identtisenä.

  ULKOISEN LINKIN `rel` ON SAMA KUIN ALATUNNISTEESSA JA SOPIMUSKORTEISSA:
  `nofollow sponsored noopener`. `sponsored` on Googlen vaatimus
  kaupallisille linkeille, ja sen puuttuminen yhdestä paikasta riittää
  luokittelemaan koko sivuston linkityksen epäjohdonmukaiseksi.

  MIKSI TÄHÄN EI ANNETA KOKO `Service`-OLIOTA. Ensimmäinen versio otti
  propikseen palvelun sellaisenaan, ja etusivu kaatui heti: `Service`
  sisältää `Icon`-kentässä React-komponentin eli funktion, eikä funktiota
  voi välittää palvelinkomponentista asiakaskomponentille — se pitäisi
  sarjallistaa verkon yli. Nappi ei tarvitse kuvaketta lainkaan, joten se
  ottaa vain ne neljä kenttää, jotka se piirtää.
*/

export default function ServiceCta({
  name,
  href,
  label,
  external,
  placement,
  variant = "ember",
}: {
  /** Palvelun nimi. Menee GA4:een klikin tunnisteena. */
  name: string;
  href: string;
  /** Napin teksti, `Service.cta`. */
  label: string;
  /** Vieko nappi kumppanin sivulle. */
  external?: true;
  /** Mistä kohtaa sivua klikattiin. Näkyy GA4:ssä `placement`-kenttänä. */
  placement: string;
  /**
   * `ember` = oranssi nappi vaalealla pinnalla.
   * `cream` = kermanvaalea nappi oranssilla vyöllä (ember-ansa: teksti on
   * kiinteä `#A83E0A`, koska `text-accentDark` kääntyisi siellä vaaleaksi).
   */
  variant?: "ember" | "cream";
}) {
  const className =
    variant === "cream"
      ? "lift press sheen inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cream px-6 py-4 font-display text-[16px] font-bold text-[#A83E0A] shadow-lift"
      : "btn-ember lift press sheen inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-display text-[16px] font-bold text-onEmber sm:w-auto";

  const inner = (
    <>
      <span>{label}</span>
      <ArrowRight size={18} className="nudge" aria-hidden />
    </>
  );

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
