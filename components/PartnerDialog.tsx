"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { trackAffiliateClick } from "@/lib/track";
import { trackEvent } from "@/lib/analytics";

/*
  VÄLI-ILMOITUS ENNEN SIIRTYMÄÄ KUMPPANILLE.

  MITÄ TÄMÄ ON. Kun kävijä painaa "Vakuutukset", hän ei enää lennä suoraan
  POP Vakuutuksen lomakkeelle vaan näkee pienen ikkunan: otsikko, yksi
  kappale siitä minne ollaan menossa, ja kaksi nappia. Jessen pyyntö
  19.9.2026.

  =====================================================================
  TÄMÄ MAKSAA KLIKKEJÄ. SANOTTU JESSELLE, KIRJATAAN MYÖS TÄNNE.
  =====================================================================

  Jokainen väliaskel siirtymän ja palkkion välissä pudottaa osan
  kävijöistä. Ikkuna ei voi lisätä siirtymiä, se voi vain vähentää niitä,
  ja jokainen "Peruuta" on palkkio jota ei tule. Tämä on siis suora kulu,
  ei optimointi.

  MIKSI SE SILTI KANNATTAA OLLA OLEMASSA. Kaksi syytä, joista jälkimmäinen
  on painavampi:

  1. Kävijä, joka luulee jäävänsä Kettukilpailutukseen ja huomaa olevansa
     toisen yhtiön lomakkeella, painaa takaisin. Peruutettu siirtymä
     näyttää kumppanin raportissa samalta kuin klikki joka ei koskaan
     johtanut mihinkään, ja se on sekin palkkio jota ei tule. Odotettu
     siirtymä luetaan loppuun useammin kuin yllättävä.

  2. `lib/services.ts`:n yläkommentti kuvaa sivuston yhden avoimen riskin:
     nappi lukee "Kilpailuta vakuutus", mutta sen takana on yhden yhtiön
     oma tarjouspyyntö eikä usean yhtiön vertailu. Jesse pyysi samana
     päivänä poistamaan kumppanien nimet etusivun palvelukohdista, joten
     rajaus jäi sanotuksi vain `TrustBlock`in kohdassa 03. Tämä ikkuna
     sanoo sen uudelleen siinä ainoassa hetkessä, jossa sillä on
     merkitystä: juuri ennen kuin kävijä siirtyy. Se on se sama asia,
     jonka affiliate-ohjelman compliance-tarkastus etsii, ja kumppanuuden
     katkeaminen maksaisi enemmän kuin yksikään menetetty klikki.

  MITTAAMINEN ON OSA TÄTÄ, EI LISÄ. Koska ikkuna on tiedostettu kulu, sen
  hinta on voitava lukea GA4:stä eikä arvata. Siksi tapahtumia on kaksi:
  `partner_interstitial` (ikkuna avattiin) ja vasta vahvistuksesta
  `affiliate_click` (kävijä siirtyi). Näiden suhde on ikkunan läpäisyaste.
  Jos se on matala, ikkuna on liian raskas tai sen teksti pelottaa, ja
  silloin korjataan teksti eikä poisteta mittaria.

  ÄLÄ SIIRRÄ `affiliate_click`-TAPAHTUMAA AUKEAMISEEN. Se rikkoisi koko
  mittauksen: klikkiluku paisuisi niillä, jotka eivät koskaan siirtyneet,
  eikä sitä voisi enää verrata kumppanin omaan raporttiin.
*/

/*
  LOGOKÄSITTELY POISTETTU KOKONAAN (Jesse, 19.9.2026).

  Tässä oli `logo`-kenttä ja `PartnerLogo`-komponentti, joka piirsi
  kumppanin logon ikkunan yläreunaan ja putosi takaisin yhtiön nimeen
  tekstinä, jos tiedostoa ei löytynyt. Kumppanin nimi luetaan nyt
  `note`-tekstistä ja vahvistusnapista, eli tieto siitä minne ollaan
  menossa ei kadonnut mihinkään.

  Jos logo joskus palaa, muista miksi siinä oli varareitti: kumppanin
  logo on lainattu merkki, joka elää repon ulkopuolella. Puuttuva
  tiedosto ei saa näkyä kävijälle rikkinäisenä kuvana juuri siinä
  ikkunassa, jonka koko tehtävä on kertoa että kohde on luotettava.
*/
export type Partner = {
  /** Tunniste GA4:n `affiliate_click`-tapahtumassa. */
  id: string;
  /** Yhtiön nimi sellaisena kuin se ikkunassa luetaan. */
  name: string;
  /** Yksi lause siitä, mitä kumppanin sivulla tapahtuu. Ei lupauksia. */
  note: string;
  /** Vahvistusnapin teksti. Sijamuoto kirjoitetaan käsin: suomea ei taivuteta koodissa. */
  confirmLabel: string;
};

export default function PartnerLink({
  href,
  partner,
  placement,
  className,
  children,
  onNavigate,
}: {
  /** Kumppanin seurantaosoite. Pysyy `<a href>`:ssä, ks. `avaa` alla. */
  href: string;
  partner: Partner;
  /** Mistä kohtaa sivua klikattiin. GA4:n `placement`-kenttä. */
  placement: string;
  className: string;
  children: ReactNode;
  /** Esim. mobiilivalikon sulkeminen. Ajetaan vasta vahvistuksesta. */
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLAnchorElement>(null);

  /*
    PORTAALI ODOTTAA ENSIMMÄISTÄ SELAINRENDERÖINTIÄ.

    `createPortal` tarvitsee `document.body`:n, jota palvelimella ei ole.
    Vaihtoehto olisi piirtää portaali vasta `open`:n mukana, mutta silloin
    koko puu purkautuisi sulkemishetkellä eikä `AnimatePresence` ehtisi
    ajaa poistumisanimaatiota: ikkuna katoaisi nykäisten. Tyhjä portaali ei
    maksa mitään, koska `AnimatePresence` ei piirrä suljettuna yhtään
    solmua.
  */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /*
    FOKUS SIIRTYY VAHVISTUSNAPPIIN, EI IKKUNAN REUNAAN.

    Tämä tehdään efektissä eikä `autoFocus`-määreellä: React käsittelee
    `autoFocus`in eri tavoin eri elementeillä, ja ankkuri ei ole
    lomake-elementti. Efekti tekee saman asian tavalla, jonka voi lukea ja
    todeta oikeaksi.
  */
  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
  }, [open]);

  /*
    FOKUS PALAA SIIHEN LINKKIIN, JOSTA IKKUNA AVATTIIN.

    Näppäimistöllä liikkuva kävijä olisi muuten pudonnut takaisin sivun
    alkuun joka kerta kun hän sulkee ikkunan, eli "Peruuta" olisi
    rangaissut häntä koko navigaation uudelleenselaamisella.
  */
  const sulje = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sulje();
        return;
      }

      /*
        SARKAIN KIERTÄÄ IKKUNAN SISÄLLÄ.

        Ilman tätä sarkain karkaa ikkunan takana olevaan sivuun, jolloin
        näppäimistökävijä "täyttää" lomaketta jota ei näe. Ikkunassa on
        kolme kohdistettavaa elementtiä, joten kierto riittää: erillistä
        `inert`-käsittelyä taustalle ei tarvita.
      */
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, sulje]);

  /*
    LINKKI SÄILYY OIKEANA LINKKINÄ.

    `href`, `target` ja `rel` pysyvät paikoillaan, vaikka tavallinen klikki
    avaakin ikkunan. Syy on kolmiosainen: hiiren keskinäppäin ja
    `ctrl`/`cmd`-klikki avaavat kohteen uuteen välilehteen kuten kävijä
    odottaa, "avaa uuteen välilehteen" -valikko toimii, ja hakukone näkee
    `rel="nofollow sponsored"` -merkinnän. Jos tämä olisi `<button>`, kohde
    katoaisi kaikilta kolmelta.

    Muokkausnäppäimillä tehty klikki menee siis ikkunan ohi suoraan
    kumppanille. Se on tarkoituksellista: kävijä, joka osaa avata linkin
    uuteen välilehteen, tietää jo lähtevänsä sivustolta.
  */
  const avaa = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(true);
    trackEvent("partner_interstitial", { card_id: partner.id, placement });
  };

  const vahvista = () => {
    trackAffiliateClick(partner.id, placement);
    setOpen(false);
    onNavigate?.();
  };

  const otsikkoId = `partner-dialog-${partner.id}-${placement}`;

  return (
    <>
      <a
        ref={triggerRef}
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        className={className}
        onClick={avaa}
      >
        {children}
      </a>

      {/*
        IKKUNA PIIRRETÄÄN `document.body`:yn, EI TÄHÄN PUUHUN.

        Tämä ei ole tyylivalinta vaan pakko. Header on `glass-light`, jossa
        on `backdrop-filter` (app/globals.css). `backdrop-filter` luo
        elementistä sisältävän lohkon myös `position: fixed` -lapsille, eli
        headerin sisään piirretty ikkuna asettuisi headerin mittoihin eikä
        ruudun. Sama koskisi mitä tahansa tulevaa `transform`-animoitua
        osiota. Portaali on ainoa tapa, joka pysyy oikeana riippumatta
        siitä, mihin linkki jonain päivänä laitetaan.

        `mounted` pitää `document`in ulottumattomissa palvelinrenderöinnin
        ja ensimmäisen hydraation ajan.
      */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                /*
                  PYSTYVIERITYS ON VARAUS MATALAA RUUTUA VARTEN. Ikkuna on
                  noin 380 pikselin korkuinen, eli se mahtuu pystyasennossa
                  joka puhelimeen mutta ei vaakaan käännettyyn 375 pikselin
                  ruutuun. `overflow-y-auto` yhdessä sisemmän
                  `min-h-full`-kääreen kanssa on ainoa keskitys, joka ei
                  leikkaa ikkunan yläreunaa silloin kun se ei mahdu: pelkkä
                  `place-items-center` työntäisi otsikon ruudun yläpuolelle,
                  eikä sinne pääsisi vierittämään.
                */
                className="fixed inset-0 z-[90] overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.18 }}
              >
                {/*
                  TAUSTAHÄIVYTYS ON VYÖN OMA TUMMA PÄÄ, EI MUSTA.

                  Musta `rgba(0,0,0,…)` on ainoa väri, jota tällä sivustolla
                  ei ole missään: `DESIGN.md` sallii kaksi väriä ja lämpimän
                  hiekan sävyt. Kylmä musta kalvo lämpimän oranssin päällä
                  lukee järjestelmäilmoitukseksi, eli juuri siksi mitä tämä
                  ikkuna ei saa olla.

                  `fixed` EIKÄ `absolute`: kääre on `overflow-y-auto`, joten
                  absoluuttinen kalvo venyisi vain vieritettävän sisällön
                  mittaan. Kiinteä kalvo peittää ruudun myös silloin, kun
                  ikkunaa on vieritetty.
                */}
                {/*
                  `aria-hidden` ja `tabIndex={-1}`: kalvo on hiirelle, ei
                  ruudunlukijalle. Ilman näitä ikkunassa olisi kaksi
                  "Sulje"-kontrollia (kalvo ja rasti), ja niistä
                  ensimmäinen olisi koko ruudun kokoinen nimetön painike.
                  Sarkainkierto ei osu tähän muutenkaan, koska se rajataan
                  `panelRef`:iin.
                */}
                <button
                  type="button"
                  aria-hidden
                  tabIndex={-1}
                  onClick={sulje}
                  className="fixed inset-0 cursor-default bg-[rgba(74,26,2,0.55)]"
                />

                <div className="relative flex min-h-full items-center justify-center p-4">
                  <motion.div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={otsikkoId}
                    initial={{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: reduce ? 1 : 0.96, y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                    /*
                      PIENI JA LÄHES NELIÖ (Jessen sanoin "pieni neliö pop up").
                      `max-w-[360px]` pitää ikkunan pienempänä kuin sisältö sen
                      takana, jolloin se luetaan välihuomautukseksi eikä uudeksi
                      sivuksi. `theme-light` on pakollinen: linkki voi olla
                      oranssilla vyöllä, jossa `bg-white` olisi oranssi ja
                      `text-accentDark` vaaleaa kermaa (CLAUDE.md, ember-ansa).
                    */
                    className="theme-light relative w-full max-w-[360px] rounded-3xl border border-accent/12 bg-white px-6 pb-6 pt-9 text-center shadow-[0_30px_70px_-28px_rgba(74,26,2,0.55)] sm:px-7 sm:pb-7"
                  >
                    <button
                      type="button"
                      onClick={sulje}
                      aria-label="Sulje"
                      className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-ink/40 transition-colors hover:bg-peach hover:text-accentDark"
                    >
                      <X size={16} strokeWidth={2.4} aria-hidden />
                    </button>

                    {/*
                      OTSIKKO ON IKKUNAN ENSIMMÄINEN ASIA.

                      Tässä yläpuolella oli kumppanin logo omalla valkoisella
                      pinnallaan. Kun se poistui, otsikko nousi ylimmäksi, ja
                      siksi paneelin yläreunassa on nyt enemmän täytettä kuin
                      alareunassa: sulkurasti istuu oikeassa yläkulmassa, ja
                      ilman lisätilaa keskitetty otsikko alkaisi samalta
                      riviltä sen kanssa.
                    */}
                    <h2
                      id={otsikkoId}
                      className="font-hero text-[21px] leading-tight text-accentDark"
                    >
                      Siirryt kumppanimme sivustolle
                    </h2>

                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink/70">{partner.note}</p>

                    {/*
                      NAPIT ALLEKKAIN, VAHVISTUS PÄÄLLIMMÄISENÄ.

                      Vierekkäin ne olisivat 360 pikselin ikkunassa kaksi noin
                      150 pikselin nappia, eli kumpikaan ei mahduta verbiä ja
                      yhtiön nimeä samalle riville. Allekkain vahvistus on koko
                      leveydeltään ruudun kirkkain kohta ja peruutus lukee
                      toissijaisena sen alla, mikä on myös oikea järjestys:
                      ikkuna on huomautus, ei kysymys johon oletusvastaus on ei.
                    */}
                    <a
                      ref={confirmRef}
                      href={href}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      onClick={vahvista}
                      /*
                        VAHVISTUS ON OIKEA LINKKI, EI `window.open`.
                        Skriptistä avattu ikkuna on se, jonka selaimen
                        ponnahdusesto pysäyttää. Kävijän oma klikki ankkurissa
                        ei ole koskaan ponnahdusikkuna.
                      */
                      className="btn-ember lift press sheen mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 font-display text-[15px] font-bold text-onEmber"
                    >
                      {partner.confirmLabel}
                    </a>

                    <button
                      type="button"
                      onClick={sulje}
                      className="mt-2.5 w-full rounded-xl px-5 py-2.5 font-display text-[13.5px] font-semibold text-ink/55 transition-colors hover:text-ink"
                    >
                      Palaa takaisin
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
