"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BookOpen,
  CreditCard,
  Info,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import FoxMark from "./FoxMark";
import AffiliateButton from "./AffiliateButton";
import { FEATURES } from "@/lib/features";
import { LOAN_PARTNER } from "@/lib/loans";
import { POP_INSURANCE_URL, POP_PARTNER } from "@/lib/services";
import PartnerLink, { type Partner } from "@/components/PartnerDialog";
import { ENERGY_COMPARE, ENERGY_PATH, isEnergyPath } from "@/lib/nav";
import { trackAffiliateClick } from "@/lib/track";

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
/*
  IKONI JOKAISELLE RIVILLE.

  MIKSI: vertailupalvelussa navigaatio on palveluvalikko, ei sivukartta.
  Kävijä ei lue riviä vaan tunnistaa sen, ja merkki tunnistuu nopeammin
  kuin sana. Sekunti nopeampi tunnistus on yksi epäröinti vähemmän ennen
  sitä osiota, jossa "Tee sopimus" on.

  MIKSI NÄMÄ MERKIT: jokainen kuvaa sitä, mitä kävijä saa, ei sitä mitä
  osio on. Salama on sähkö, seteli on raha, kirja on lukeminen. Älä vaihda
  abstraktimpaan (esim. "Lainat" → kaavio): abstrakti merkki pitää opetella,
  eikä navigaatiossa ole tilaa opettaa mitään.

  MERKIT EIVÄT NÄY TABLETILLA. Ks. `NAV_NAKYVYYS` alla.
*/
type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: (pathname: string) => boolean;
  /**
   * Vieko rivi kumppanin sivulle. Vakuutuksilla ei ole omaa sivua, koska
   * emme vertaile vakuutuksia — rivi on suora siirtymä POP Vakuutukseen.
   * Ks. `POP_INSURANCE_URL` (lib/services.ts).
   */
  external?: true;
  /** Kumppanin tunniste GA4:n `affiliate_click`-tapahtumassa. */
  partnerId?: string;
  /**
   * Jos annettu, rivi avaa väli-ilmoituksen ennen siirtymää sen sijaan
   * että veisi kumppanille suoraan. Ks. `components/PartnerDialog.tsx`.
   */
  partner?: Partner;
};

const NAV: NavItem[] = [
  { href: ENERGY_PATH, label: "Sähkö", icon: Zap, active: isEnergyPath },
  /* Korttilinkki palaa tähän itsestään, kun FEATURES.cards kääntyy
     todeksi. Piilotettuna se ei vain veisi kävijää 404:ään vaan myös
     jakaisi navigaation huomion kahtia — ja navigaatiossa jokainen
     ylimääräinen vaihtoehto on pois päävertikaalin klikeistä. */
  ...(FEATURES.cards
    ? [
        {
          href: "/luottokortit",
          label: "Luottokortit",
          icon: CreditCard,
          active: (p: string) => p.startsWith("/luottokortit") || p.startsWith("/kortit"),
        },
      ]
    : []),
  ...(FEATURES.loans
    ? [
        {
          href: "/lainat",
          label: "Lainat",
          icon: Banknote,
          active: (p: string) => p.startsWith("/lainat"),
        },
      ]
    : []),
  /*
    VAKUUTUKSET ON SUORA SIIRTYMÄ, EI SIVU.

    Rivi vie POP Vakuutuksen seurantaosoitteeseen eikä omaan
    `/vakuutukset`-sivuun. Perustelu on `lib/services.ts`:ssä: emme
    vertaile vakuutuksia, joten oma laskeutumissivu olisi sivu, jolla ei
    ole mitään näytettävää. Se lisäisi yhden klikin matkalle ja antaisi
    vastineeksi nolla uutta tietoa.

    RIVI EI VOI OLLA "AKTIIVINEN", koska kävijä ei päädy millekään meidän
    polullemme. `active` palauttaa siksi aina epätoden, eikä liukuva
    oranssi palkki koskaan pysähdy tähän.

    KUN VAKUUTUSDATAA JOSKUS ON, vaihda `href` sisäiseksi poluksi, poista
    `external` ja `partnerId` ja anna `active`-predikaatille oikea ehto.
    Muuta ei tarvitse koskea.
  */
  {
    href: POP_INSURANCE_URL,
    label: "Vakuutukset",
    icon: ShieldCheck,
    active: () => false,
    external: true,
    partnerId: "pop-vakuutus",
    partner: POP_PARTNER,
  },
  { href: "/blogi", label: "Oppaat", icon: BookOpen, active: (p: string) => p.startsWith("/blogi") },
  { href: "/tietoa", label: "Tietoa", icon: Info, active: (p: string) => p.startsWith("/tietoa") },
];

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

/**
 * MISTÄ LEVEYDESTÄ NAVIGAATIO NÄKYY — LASKETTU, EI ARVATTU.
 *
 * Neljä linkkiä, logo ja kehote ovat 768 pikselin ruudulla yhteensä noin
 * 695 px, eli ne mahtuvat 720 px käytettävään tilaan noin 25 pikselin
 * varalla. Viides linkki ("Luottokortit") on noin 113 px, joten se rikkoisi
 * rivin heti. Kytkin `FEATURES.cards` voi kääntyä todeksi minä päivänä
 * tahansa, ja rikkoutunut header näkyisi vasta tuotannossa.
 *
 * Siksi kynnys tulee linkkien määrästä. Molemmat vaihtoehdot on
 * kirjoitettava tänne kokonaisina merkkijonoina: Tailwind lukee
 * lähdekoodin tekstinä eikä osaa koostaa luokkanimeä muuttujasta, joten
 * `hidden ${bp}:flex` ei generoisi sääntöä lainkaan.
 *
 * SAMASTA SYYSTÄ IKONIT NÄKYVÄT VASTA 1024:STÄ. Ikoni ja sen väli vievät
 * noin 22 px riviltä, eli neljä ikonia syö 88 px — enemmän kuin se 25 px,
 * joka 768 pikselin ruudulla oli vapaana. Vaihtoehdot olivat piilottaa
 * navigaatio tabletilta kokonaan tai antaa ikonien ilmestyä vasta kun
 * tilaa on. Jälkimmäinen on parempi: tabletilla linkit ovat silti
 * näkyvissä, eikä kukaan kaipaa merkkiä jota ei ole koskaan nähnyt.
 */
const MONTA_LINKKIA = NAV.length > 4;
const NAV_NAKYVYYS = MONTA_LINKKIA ? "hidden lg:flex" : "hidden md:flex";
const VALIKKO_NAKYVYYS = MONTA_LINKKIA ? "lg:hidden" : "md:hidden";

/**
 * HEADERIN KORKEUS ON VAKIO.
 *
 * Tässä oli aiemmin kutistuva header: 74 px → 62 px vieritettäessä, ja sen
 * ympärillä 40 riviä kommenttia siitä, miksi kynnyksiä tarvitaan kaksi.
 * Syy oli tämä: header on `sticky`, eli dokumentin normaalissa virrassa.
 * Kun korkeus muuttuu, kaikki alapuolinen sisältö nousee 12 px, Chromen
 * scroll anchoring korjaa `scrollY`:n takaisin saman verran, ja korjaus
 * heittää vierityksen kynnyksen yli. Header jäi värisemään, ja hysteresis
 * oli laastari oireeseen.
 *
 * Kiinteä korkeus poistaa koko ongelmaluokan: `height` ei animoidu, joten
 * selain ei laske taittoa uudelleen eikä anchoringilla ole mitään
 * korjattavaa. Yksi kynnys riittää, ja vierityksellä muuttuvat vain
 * reunaviiva ja varjo — ominaisuuksia, jotka selain piirtää
 * kompositorissa ilman taittoa. Juuri tämä on se ero, joka tuntuu
 * sulavuutena: nykivä palkki lukee halvaksi sivuksi, ja halpa sivu ei
 * saa kävijää syöttämään omia lukujaan laskuriin.
 *
 * ÄLÄ PALAUTA KUTISTUMISTA. Se maksoi kaksi korjauskierrosta eikä tuonut
 * mitään, mitä kävijä olisi pyytänyt.
 *
 * ITSE LUKU ON `--header-h` (app/globals.css), koska etusivun hero ja hubin
 * osioankkurit laskevat sen varassa. Ks. muuttujan kommentti.
 */
const HEADER_H = "h-[var(--header-h)]";

/**
 * NAVIGAATIORIVIN KUORI — YKSI PAIKKA, JOSSA SISÄINEN JA ULKOINEN EROAVAT.
 *
 * MIKSI TÄMÄ ON OMA KOMPONENTTI. Sama `NAV`-taulukko piirretään kahdesti:
 * työpöytärivinä ja mobiilivalikon listana. Jos `external`-haara
 * kirjoitettaisiin molempiin, ne eriytyisivät ensimmäisessä muutoksessa —
 * ja se, kummasta `rel`- tai seurantamääre puuttuu, selviäisi vasta kun
 * palkkioita jää saamatta. Kuori pakottaa molemmat samaan sääntöön.
 *
 * MIKSI `<a>` EIKÄ `<Link>`. `next/link` on tarkoitettu sovelluksen
 * sisäiseen reititykseen. Kumppanin seurantaosoitteelle se olisi väärä
 * työkalu: Next yrittäisi esiladata osoitetta, jota se ei voi reitittää,
 * eikä `target`/`rel` tulisi mukana ilman erikseen kirjoittamista.
 *
 * MIKSI `rel="nofollow sponsored noopener"`. `sponsored` on Googlen vaatimus
 * kaupallisille linkeille, ja se on sivustolla sama joka paikassa
 * (ks. `components/home/ServiceCta.tsx`). Yksi merkitsemätön affiliate-linkki
 * riittää siihen, että koko sivuston linkkiprofiilia katsotaan eri silmin —
 * eli hakukonenäkyvyys on tässä se, mikä on pelissä, ei kohteliaisuus.
 *
 * MIKSI SEURANTA KLIKISSÄ. Ilman `trackAffiliateClick`ia navigaatiosta
 * lähtevä kävijä on GA4:ssä näkymätön: siirtymä tapahtuisi, mutta emme
 * tietäisi tulevatko vakuutusklikit navigaatiosta vai etusivun osiosta.
 * Sitä tietoa tarvitaan, kun päätetään kannattaako rivi pitää täällä.
 * `lib/track.ts` nielee omat virheensä, joten seuranta ei voi estää
 * siirtymää.
 */
function NavLinkki({
  item,
  active,
  placement,
  className,
  onNavigate,
  children,
}: {
  item: NavItem;
  active: boolean;
  /** Erottaa työpöytärivin ja valikon toisistaan GA4:ssä. */
  placement: string;
  className: string;
  /** Mobiilivalikossa: sulje valikko. Työpöydällä ei anneta. */
  onNavigate?: () => void;
  children: ReactNode;
}) {
  /*
    KUMPPANIRIVI KYSYY ENSIN.

    `PartnerLink` kirjoittaa `target`:n, `rel`:n ja seurannan itse, joten
    tähän ei jää kahta eri sääntöä samasta asiasta. `onNavigate` menee
    perille asti: mobiilivalikko suljetaan vasta kun kävijä vahvistaa
    siirtymän, koska valikon sulkeminen ikkunan avautuessa jättäisi
    peruuttavan kävijän tyhjälle sivulle ilman valikkoa.
  */
  if (item.partner) {
    return (
      <PartnerLink
        href={item.href}
        partner={item.partner}
        placement={placement}
        className={className}
        onNavigate={onNavigate}
      >
        {children}
      </PartnerLink>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="nofollow sponsored noopener"
        className={className}
        onClick={() => {
          trackAffiliateClick(item.partnerId ?? item.label, placement);
          onNavigate?.();
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={className}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}

/**
 * "TÄMÄ AVAUTUU MUUALLE" -MERKKI.
 *
 * Pieni vinonuoli ulkoisen rivin perässä. Kävijä, joka luulee jäävänsä
 * sivustolle ja päätyy toisen yhtiön lomakkeelle, palaa takaisin — ja
 * peruutettu siirtymä on menetetty palkkio. Merkki maksaa 13 pikseliä ja
 * poistaa sen yllätyksen.
 *
 * `hidden lg:block` samasta syystä kuin rivien ikonit: 768 pikselin
 * ruudulla navigaatiolla oli noin 25 px varaa, eikä nuolelle ole siellä
 * tilaa. Mobiilivalikossa se on aina näkyvissä, koska pystylistassa tilaa
 * on.
 */
function UlkoinenMerkki({ className }: { className: string }) {
  return <ArrowUpRight size={13} strokeWidth={2.4} aria-hidden className={className} />;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";
  const reduce = useReducedMotion();

  /* Yksi kynnys riittää, koska korkeus ei enää muutu. Ks. HEADER_H. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
    VALIKKO SULKEUTUU SIVUNVAIHDOSSA.

    Header elää `app/layout.tsx`:ssä, joten se ei purkaudu kun kävijä
    siirtyy sivulta toiselle — `open` jäi todeksi, ja uusi sivu avautui
    valikon alle. Kävijä näki listan, jonka juuri valitsi, eikä sivua,
    johon oli menossa.
  */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /*
    ESC SULKEE VALIKON.

    Näppäimistöllä liikkuva pääsi valikosta pois vain klikkaamalla.

    TÄHÄN EI LAITETA VIERITYSLUKKOA. Kokeilin `document.body.style.overflow
    = "hidden"` -lukkoa ja poistin sen: iOS:n Safari ei kunnioita sitä
    bodylla, eli se ei olisi toiminut juuri sillä laitteella, jolla tämä
    valikko avataan. Lisäksi `overflow: hidden` bodylla tekee bodysta
    vierityskehyksen, mikä on `sticky`-headerin kanssa turha riski. Lukkoa
    ei tarvita: valikko on kiinni headerissa, joka on `sticky`, joten se
    pysyy ruudulla vaikka taustaa vierittäisi.
  */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`glass-light sticky top-0 z-50 border-b transition-[border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-line shadow-[0_10px_24px_-18px_rgba(20,18,15,0.45)]"
          : "border-transparent shadow-none"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 ${HEADER_H}`}
      >
        {/*
          LOGO ON YKSI RIVI.

          Tässä oli logon alla toinen rivi: versaali mikroteksti 0,18em
          harvennuksella, joka kertoi missä osiossa ollaan
          ("Sähkösopimukset", "Kilpailutuspalvelu"). Poistettu kahdesta
          syystä.

          Ensimmäinen on toisto: saman tiedon kertoo navigaation
          aktiivimerkki, ja kun kaksi elementtiä kertoo saman asian, kävijä
          lukee ne erikseen ja palkki tuntuu täydeltä ilman että mikään
          niistä auttaa.

          Toinen on se, miltä lockup näyttää. Kaksi eri kokoista versaalia
          riviä merkin vieressä on template-ilme, ja se on ensimmäinen asia
          jonka kävijä näkee joka sivulla. Yksi rivi keskitettynä merkin
          kanssa pystysuunnassa on se, miltä rahoituspalvelu näyttää.

          PÄÄTE ON VERSAALINA, KOKO LOGOTYYPPI SAMASSA KOOSSA. Tässä oli
          aiemmin `normal-case`-poikkeus, joka piirsi päätteen pienellä:
          "KETTUKILPAILUTUS.fi". Kahdessa koossa piirretty logo näyttää
          siltä, että pääte on liimattu nimeen jälkikäteen. Verkko-
          osoitteeksi sen tunnistaa pisteestä, ei kirjasinkoosta.

          MIKSI TÄLLÄ ON VÄLIÄ TUOTON KANNALTA: logo on ainoa asia, joka
          toistuu jokaisella sivulla ja jokaisessa vierailussa.
          Kilpailutuspalvelussa klikki tehdään sille, jonka nimen muistaa
          toisellakin käynnillä.
        */}
        {/* Ei `aria-label`ia: logotyyppi on oikeaa tekstiä ja merkki on
            `aria-hidden`, joten ruudunlukija lukee jo nimen. Label vain
            korvaisi sen omalla sanamuodollaan. */}
        <Link href="/etusivu" className="flex shrink-0 items-center gap-2.5 rounded-lg">
          <FoxMark size={30} priority />
          <span className="font-display text-[16px] font-bold uppercase leading-none tracking-[0.01em] text-ink">
            Kettukilpailutus.fi
          </span>
        </Link>

        {/*
          NAVIGAATIO NÄKYY JO 768 PIKSELISTÄ, EI VASTA 1024:STÄ.

          Neljä linkkiä mahtuu tabletille vaivatta, ja aiemmin ne olivat
          siellä hampurilaisen takana. Jokainen valikon avaus on yksi
          ylimääräinen ele ennen vertailuun pääsyä, ja tabletti on laite,
          jolla suomalainen 40–60-vuotias selaa sohvalla — eli juuri se
          kävijä, jonka on tarkoitus päätyä "Tee sopimus" -nappiin.
        */}
        <nav className={`${NAV_NAKYVYYS} items-center gap-0.5`} aria-label="Päävalikko">
          {NAV.map((item) => {
            const active = item.active(pathname);
            const Ikoni = item.icon;
            return (
              <NavLinkki
                key={item.label}
                item={item}
                active={active}
                placement="header-nav"
                className={`relative flex h-10 items-center gap-2 rounded-lg px-3 font-display text-[15px] font-medium transition-colors ${
                  active ? "text-ink" : "text-ink/70 hover:bg-ink/4 hover:text-ink"
                }`}
              >
                {/*
                  Merkki on oma värinsä, ei tekstin väri. Himmeänä se on
                  tunnistemerkki eikä kilpaile sanan kanssa, ja aktiivisena
                  se on kettuoranssi — sama väri kuin alla liukuva palkki,
                  jolloin valittu osio luetaan yhtenä asiana eikä kahtena
                  merkkinä. Uutta väriä ei tule: oranssi ja hiekka, kuten
                  DESIGN.md vaatii.
                */}
                <Ikoni
                  size={16}
                  strokeWidth={2}
                  aria-hidden
                  className={`hidden shrink-0 transition-colors lg:block ${
                    active ? "text-accent" : "text-ink/40"
                  }`}
                />
                {item.label}
                {item.external && <UlkoinenMerkki className="hidden shrink-0 text-ink/35 lg:block" />}
                {/*
                  AKTIIVIMERKKI LIUKUU, EI VÄLÄHDÄ.

                  Merkki oli ennen tavallinen `<span>`, joka ilmestyi uuteen
                  paikkaan ilman siirtymää: vanha katosi, uusi pomppasi
                  esiin. Yhteinen `layoutId` tekee samasta merkistä yhden
                  kappaleen, joka siirtyy linkistä linkkiin. Header asuu
                  `app/layout.tsx`:ssä eikä purkaudu sivunvaihdossa, joten
                  Framer ehtii mitata molemmat paikat ja animoida välin.

                  Tämä on se yksittäinen ele, joka tekee navigaatiosta
                  sovelluksen eikä linkkilistan — ja se maksaa nolla
                  latausaikaa, koska Framer Motion on jo mukana.
                */}
                {active && (
                  <motion.span
                    layoutId="nav-aktiivi"
                    className="absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-accent"
                    transition={
                      reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                )}
              </NavLinkki>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {isLoanPage(pathname) ? (
            /* Lainasivulla headerin nappi menee suoraan kumppanille.
               Sama nappi, sama paikka — vain kohde vaihtuu siihen, mistä
               tämä sivu ansaitsee. Oma `placement`, jotta seurannasta
               näkee erikseen kuinka moni lähtee headerista. */
            <AffiliateButton
              href={LOAN_PARTNER.url}
              cardId={LOAN_PARTNER.id}
              placement="lainat-header"
              className="hidden !h-10 !rounded-xl !px-5 !py-0 !text-sm sm:inline-flex"
            >
              Hae lainatarjoukset
            </AffiliateButton>
          ) : (
            <Link
              href={ctaHref(pathname)}
              className="btn-ember hidden h-10 items-center rounded-xl px-5 font-display text-sm font-bold text-onEmber transition-transform active:scale-[0.98] sm:inline-flex"
            >
              Aloita vertailu
            </Link>
          )}
          {/*
            VALIKKONAPPI ON PALJAS TUMMA MERKKI, EI LAATIKKO.

            Tässä oli oranssisävyinen laatikko: `border-accent/25` ja
            `bg-accentSoft`. Perustelu oli, ettei beige laatikko beigellä
            palkilla näytä painikkeelta. Perustelu oli oikea laatikosta
            mutta ei merkistä: kolme tummaa viivaa headerin oikeassa
            reunassa on vakiintunein ele koko verkossa, eikä sitä tarvitse
            kehystää tunnistuakseen. Laatikko teki siitä 2015-napin.

            Viivat myös kääntyvät ristiksi eivätkä vaihdu toiseen kuvaan.
            Ristiinhäivytys kertoo "kuva vaihtui", kääntyminen kertoo
            "sama asia on nyt auki" — ja juuri se ero tuntuu sulavuutena.
          */}
          <button
            className={`grid h-10 w-10 place-items-center rounded-lg text-ink transition-colors hover:bg-ink/4 ${VALIKKO_NAKYVYYS}`}
            onClick={() => setOpen((n) => !n)}
            aria-expanded={open}
            aria-controls="mobiilivalikko"
            aria-label={open ? "Sulje valikko" : "Avaa valikko"}
          >
            <span className="relative block h-4 w-5" aria-hidden>
              {[0, 7, 14].map((top, i) => (
                <motion.span
                  key={top}
                  className="absolute left-0 h-[2px] w-full rounded-full bg-ink"
                  style={{ top }}
                  animate={
                    open
                      ? i === 1
                        ? { opacity: 0, scaleX: 0.4 }
                        : { y: i === 0 ? 7 : -7, rotate: i === 0 ? 45 : -45 }
                      : { opacity: 1, scaleX: 1, y: 0, rotate: 0 }
                  }
                  transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </span>
          </button>
        </div>
      </div>

      {/*
        MOBIILIVALIKKO AUKEAA, EI ILMESTY.

        Valikko oli `{open && <nav>}`, eli se napsahti olemassaoloon ja
        työnsi sisällön alas yhdessä ruudunpäivityksessä. Se on sivuston
        halvimman tuntuinen yksittäinen vuorovaikutus, ja se on myös
        puhelimen pääväylä navigaatioon. Korkeusanimaatio laskee taiton
        uudelleen, mutta tässä se on hyväksyttävää: kävijä itse käynnisti
        eleen ja odottaa liikettä, toisin kuin vieritettäessä.

        `prefers-reduced-motion` nollaa keston, ei poista valikkoa.
      */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobiilivalikko"
            key="mobiilivalikko"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={`overflow-hidden border-t border-line bg-white ${VALIKKO_NAKYVYYS}`}
            aria-label="Mobiilivalikko"
          >
            <div className="px-4 py-4">
              <ul className="space-y-1">
                {NAV.map((item) => {
                  const active = item.active(pathname);
                  const Ikoni = item.icon;
                  return (
                    <li key={item.label}>
                      <NavLinkki
                        item={item}
                        active={active}
                        placement="valikko-nav"
                        onNavigate={() => setOpen(false)}
                        className={`flex min-h-[48px] items-center gap-3 rounded-xl px-4 font-display text-[15px] font-medium ${
                          active ? "bg-accentSoft text-accentDark" : "text-ink/80 hover:bg-mist"
                        }`}
                      >
                        {/* Merkit ovat mobiilissa aina näkyvissä, toisin kuin
                            työpöytärivillä: pystylistassa niille on tilaa,
                            ja ne tekevät 48 pikselin rivistä valikon rivin
                            eivätkä pelkkää tekstiä. */}
                        <Ikoni
                          size={17}
                          strokeWidth={2}
                          aria-hidden
                          className={`shrink-0 ${active ? "text-accent" : "text-ink/40"}`}
                        />
                        {item.label}
                        {/* Nuoli ja aktiivipallo ovat molemmat `ml-auto`, mutta
                            ne eivät voi osua yhteen: ulkoinen rivi ei ole
                            koskaan aktiivinen (`active: () => false`). */}
                        {item.external && <UlkoinenMerkki className="ml-auto shrink-0 text-ink/35" />}
                        {active && (
                          <span
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"
                            aria-hidden
                          />
                        )}
                      </NavLinkki>
                    </li>
                  );
                })}
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
                  className="btn-ember mt-3 flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-[15px] font-bold text-onEmber active:scale-[0.98]"
                >
                  Aloita vertailu <ArrowRight size={17} aria-hidden />
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
