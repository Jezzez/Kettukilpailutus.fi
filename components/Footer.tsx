"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COOKIE_SETTINGS_EVENT } from "@/lib/analytics";
import { getCards, SITE } from "@/lib/data";
import { getPlans, getEnergyTopics } from "@/lib/energy";
import FoxMark from "./FoxMark";
import { FEATURES } from "@/lib/features";
import { ENERGY_PATH, isEnergyPath } from "@/lib/nav";
import { trackAffiliateClick } from "@/lib/track";

/**
 * Alatunnisteen linkki. `partner` erottaa affiliate-linkin sisäisestä:
 * ne renderöidään eri elementillä (`<a>` vs. `<Link>`), ne saavat
 * `rel="nofollow sponsored"` ja ne lähettävät `affiliate_click`-tapahtuman.
 *
 * MIKSI TYYPPI EIKÄ VAIN URL-TARKISTUS: `nofollow sponsored` ei ole
 * kosmetiikkaa vaan Googlen vaatimus maksetusta linkistä. Jos sen
 * lisääminen jäisi sen varaan, että joku muistaa katsoa alkaako osoite
 * "https", ensimmäinen unohdus veisi koko domainin luotettavuutta.
 */
type FooterLink = { href: string; label: string; partner?: true };

/**
 * Footer seuraa kontekstia: sähköä kilpailuttavalle ei tarjota
 * luottokorttilinkkejä. Väärän vertikaalin linkit vievät huomiota
 * ja saavat palvelun näyttämään linkkifarmilta.
 */
export default function Footer() {
  const pathname = usePathname() ?? "/";
  const onEnergy = isEnergyPath(pathname);
  const onCards =
    FEATURES.cards && (pathname.startsWith("/luottokortit") || pathname.startsWith("/kortit"));

  const contextNav: { title: string; links: FooterLink[] } = onEnergy
    ? {
        title: "Sähkösopimukset",
        /* Enintään viisi linkkiä. Aiemmin tässä oli neljä opassivua ja
           kolme sopimussivua, mikä venytti footerin korkeutta ilman että
           yksikään linkki sai enempää klikkejä: pitkä lista luetaan
           yhtenä harmaana massana. */
        links: [
          ...getEnergyTopics().map((t) => ({ href: `/sahkosopimukset/${t.slug}`, label: t.h1 })),
          ...getPlans().slice(0, 1).map((p) => ({
            href: `/sahkosopimukset/sopimus/${p.slug}`,
            label: `${p.provider} ${p.name}`,
          })),
        ].slice(0, 5),
      }
    : onCards
      ? {
          title: "Luottokortit",
          links: getCards().slice(0, 5).map((c) => ({ href: `/kortit/${c.slug}`, label: c.name })),
        }
      : {
          /*
            KILPAILUTA-LISTA ON AINOA PAIKKA ALATUNNISTEESSA, JOSTA TULEE
            RAHAA. Sähkö ja lainat vievät omille sivuilleen, Telia ja POP
            suoraan kumppanille — meillä ei ole niistä omaa vertailua, joten
            väliin rakennettu laskeutumissivu olisi tyhjä sivu, joka vain
            lisää yhden klikin matkalle.

            "Ketun oppaat" poistettiin tästä listasta: sama linkki on rivin
            verran oikealla Sivusto-sarakkeessa, eikä blogi ole
            kilpailutuskohde. Kaksi identtistä linkkiä vierekkäisissä
            sarakkeissa saa listan näyttämään täytteeltä.
          */
          title: "Kilpailuta",
          links: [
            { href: ENERGY_PATH, label: "Sähkösopimukset" },
            ...(FEATURES.cards ? [{ href: "/luottokortit", label: "Luottokortit" }] : []),
            ...(FEATURES.loans ? [{ href: "/lainat", label: "Lainat" }] : []),
            {
              href: "https://go.adt291.com/t/t?a=1553065612&as=2098832052&t=2&tk=1",
              label: "Telia",
              partner: true,
            },
            {
              href: "https://go.popvakuutus.fi/t/t?a=1710920255&as=2098832052&t=2&tk=1",
              label: "POP Vakuutus",
              partner: true,
            },
          ],
        };

  return (
    /*
      FOOTER ON KOKO SIVUSTON AINOA TUMMA PINTA.

      MIKSI TUMMA, KUN MUU SIVUSTO ON VAALEA: footerin tehtävä on olla
      piste, ei virke. Kun se oli hiekanvärinen, sivun alaosa oli yhtä
      yhtenäistä beigeä loppukehotuksesta tekijänoikeusriville asti —
      lukija ei saanut mistään merkkiä siitä, että sisältö loppui, ja
      selasi ohi myös viimeisen napin.

      MIKSI TÄMÄ NOSTAA TUOTTOA: tumma pohja alkaa heti oranssin
      loppukehotusvyön alta. Se on sivuston jyrkin valoraja, ja se tekee
      oranssista vyöstä ruudun kirkkaimman kohdan juuri silloin, kun
      käyttäjä on lopettamassa selaamisen. Sama tumma pinta antaa myös
      ylläpitäjätiedoille ja mainostajan ilmoitukselle oman, virallisen
      sävyn — ne luetaan asiakirjana, ei mainoksena.

      Teemaluokka kääntää muuttujat; yksikään alla oleva luokka ei muutu.
    */
    <footer className="theme-dark den-surface">
      {/* `relative` nostaa sisällön den-surfacen kohinakalvon yläpuolelle. */}
      {/*
        FOOTER PIDETÄÄN LYHYENÄ TARKOITUKSELLA.

        Footerissa ei ansaita mitään. Jokainen rivi, joka ei ole linkki
        eteenpäin tai lakisääteinen tieto, vain pidentää matkaa sivun
        loppuun ja saa palvelun näyttämään raskaammalta kuin se on.
        Tästä poistettiin sivuston yleiskuvaus (sama asia luki jo
        iskulauseessa riviä ylempänä) ja kotipaikka (ei vaadittu tieto).
        Mainostajan ilmoitus jäi, koska se on lakisääteinen — mutta
        laatikon kehys ja täyte poistettiin, koska teksti erottuu
        pienellä koolla ilmankin.
      */}
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="flex items-center gap-2.5 font-display text-[17px] font-bold uppercase tracking-wide text-ink">
            <FoxMark size={26} />
            {/* Pääte versaalina kuten headerissa — logotyyppi on yksi
                merkki, ei nimi + siihen liimattu osoite. Ks. Header.tsx. */}
            <span>Kettukilpailutus.fi</span>
          </p>
          <p className="mt-2.5 max-w-sm font-display text-[14.5px] font-bold leading-snug text-accentDark">
            Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi.
          </p>
          {/*
            "HINNAT OVAT ESIMERKINOMAISIA" POISTETTIIN ALATUNNISTEESTA.

            Alatunniste on joka sivulla. Kun sähkövertailun hinnat on
            tarkistettu yhtiöiden omilta sivuilta ja päivämäärä näkyy
            jokaisessa kortissa, sama alatunniste kumosi juuri sen työn:
            lukija näki kortissa tarkistetun hinnan ja sivun alalaidassa
            lauseen, jonka mukaan hinnat ovat esimerkkejä. Ristiriita
            luetaan aina huonompaan suuntaan.

            Varoitus ei kuitenkaan katoa sieltä, missä se on yhä totta:
            luottokorttien luvut ovat edelleen esimerkkidataa, ja niistä
            kerrotaan korttisivuilla erikseen. Yleinen kehotus tarkistaa
            ehdot palveluntarjoajalta jää tähän, koska se pitää paikkansa
            riippumatta siitä, kuinka tuore hinta on.
          */}
          <p className="mt-3.5 max-w-md text-[12px] leading-relaxed text-ink/60">
            <strong className="font-bold text-ink/80">Mainostajan ilmoitus:</strong> Saamme
            korvauksen, kun teet sopimuksen kumppanin palvelussa linkkiemme kautta. Korvaus ei
            vaikuta vertailun sisältöön eikä järjestykseen. Tarkista ajantasainen hinta ja ehdot
            aina palveluntarjoajan sivuilta ennen sopimuksen tekemistä.
          </p>

          <OperatorDetails />
        </div>

        <nav aria-label={contextNav.title}>
          <p className="font-display text-sm font-bold text-ink">{contextNav.title}</p>
          <ul className="mt-2.5 space-y-1.5">
            {contextNav.links.map((l) => (
              <li key={l.href}>
                {l.partner ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    onClick={() => trackAffiliateClick(l.label, "footer")}
                    className="text-sm text-ink/70 transition-colors hover:text-accentDark"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    href={l.href}
                    className="text-sm text-ink/70 transition-colors hover:text-accentDark"
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Sivusto">
          <p className="font-display text-sm font-bold text-ink">Sivusto</p>
          <ul className="mt-2.5 space-y-1.5">
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
            {/*
              EVÄSTEASETUKSET ON TÄÄLLÄ, EI KELLUVANA NAPPINA.

              Aiemmin sivun vasemmassa alakulmassa roikkui pieni
              "Evästeet"-nappi senkin jälkeen, kun kävijä oli jo vastannut.
              Se muistutti evästeistä juuri siinä hetkessä, jossa kävijän
              pitäisi katsoa hintoja, eikä sitä painanut kukaan.

              Linkkiä ei silti saa poistaa: suostumuksen peruuttamisen on
              oltava yhtä helppoa kuin sen antamisen (GDPR 7 art. 3).
              Alatunniste on oikea paikka — sieltä sitä osataan etsiä, ja
              se on poissa lukemisen tieltä.
            */}
            <li>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
                className="text-left text-sm text-ink/70 transition-colors hover:text-accentDark"
              >
                Evästeasetukset
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="relative border-t border-ink/15 py-3.5 text-center text-[11.5px] text-ink/60">
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
  const { legalName, businessId, email } = SITE.operator;

  /* Lohko piilottaa itsensä kokonaan, jos yhtään kenttää ei ole täytetty. */
  if (!legalName && !businessId && !email) return null;

  /*
    KOLME RIVIÄ ALLEKKAIN, EI PISTEELLÄ EROTELTUA RIVIÄ. Y-tunnus on luku,
    jota kävijä saattaa haluta tarkistaa PRH:n rekisteristä — omalla
    rivillään se on silmälle poimittavissa ja maalattavissa hiirellä
    ilman että mukaan tarttuu erotinmerkkejä.
  */
  return (
    <div className="mt-3.5 max-w-md">
      <div className="space-y-1 text-xs leading-relaxed text-ink/70">
        {legalName && <div>{legalName}</div>}
        {businessId && <div>Y-tunnus: {businessId}</div>}
        {email && <div>{email}</div>}
      </div>
    </div>
  );
}
