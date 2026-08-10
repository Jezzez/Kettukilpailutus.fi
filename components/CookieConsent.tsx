"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import FoxPaw from "./FoxPaw";
import {
  COOKIE_SETTINGS_EVENT,
  GA_CONSENT_STORAGE_KEY,
  type GoogleAnalyticsConsent,
} from "@/lib/analytics";

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

function clearGoogleAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name.startsWith("_ga"));

  const hostname = window.location.hostname;
  const hostnameParts = hostname.split(".");
  const rootDomain =
    hostnameParts.length > 2 ? hostnameParts.slice(-2).join(".") : hostname;
  const domains = new Set([hostname, `.${hostname}`, rootDomain, `.${rootDomain}`]);

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;

    for (const domain of Array.from(domains)) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    }
  }
}

function updateGoogleConsent(choice: GoogleAnalyticsConsent) {
  (window as GtagWindow).gtag?.("consent", "update", {
    analytics_storage: choice,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (choice === "denied") clearGoogleAnalyticsCookies();
}

export default function CookieConsent() {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let storedChoice: GoogleAnalyticsConsent | null = null;

    try {
      const stored = window.localStorage.getItem(GA_CONSENT_STORAGE_KEY);
      if (stored === "granted" || stored === "denied") storedChoice = stored;
    } catch {
      // Jos tallennustila ei ole käytettävissä, kysytään valinta uudelleen.
    }

    if (storedChoice) {
      updateGoogleConsent(storedChoice);
    } else {
      setOpen(true);
    }

    setReady(true);

    /*
      KELLUVA "EVÄSTEET"-NAPPI POISTETTIIN, MUTTA VALINNAN PITÄÄ SILTI
      OLLA PERUUTETTAVISSA.

      Nappi roikkui jokaisella sivulla vasemmassa alakulmassa senkin
      jälkeen, kun kävijä oli jo vastannut — eli se muistutti evästeistä
      juuri sinä hetkenä, jona kävijän pitäisi katsoa hintoja. Sen tilalle
      tuli alatunnisteen "Evästeasetukset"-linkki, joka lähettää tämän
      tapahtuman. Tietosuoja-asetuksen peruuttamisen on oltava yhtä helppoa
      kuin antamisen (GDPR 7 art. 3), joten linkkiä ei saa poistaa
      alatunnisteesta ilman korvaavaa tapaa avata tämä ikkuna.
    */
    const reopen = () => setOpen(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  const saveChoice = (nextChoice: GoogleAnalyticsConsent) => {
    try {
      window.localStorage.setItem(GA_CONSENT_STORAGE_KEY, nextChoice);
    } catch {
      // Suostumus vaikuttaa silti nykyiseen sivuun, vaikka sitä ei voi muistaa.
    }

    updateGoogleConsent(nextChoice);
    setOpen(false);
  };

  /*
    LIIKE ON HITAAMPI JA PEHMEÄMPI KUIN SIVUN MUISSA ELEISSÄ.

    Kortin nosto (`.lift`) kestää 140 ms, koska se on vastaus hiiren
    liikkeeseen ja saa tuntua välittömältä. Tämä paneeli sen sijaan ilmestyy
    itsestään, kutsumatta, keskelle sitä hetkeä jolloin kävijä on juuri
    alkanut lukea. Nopea sisääntulo luetaan silloin ponnahdusikkunaksi ja
    torjutaan refleksinä. Puoli sekuntia pehmeällä hidastuksella ehtii
    rekisteröityä osaksi sivua eikä sen päälle heitettynä esteenä — ja
    valintaikkuna, jota ei torjuta refleksinä, saa myös oikean vastauksen.
  */
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.52, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <>
      <AnimatePresence>
        {ready && open && (
          <motion.div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:bottom-4 sm:px-5 sm:pb-0"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            transition={transition}
          >
            {/*
              TÄMÄ ON EVÄSTEILMOITUS, EI SIVUSTON ESITTELY.

              Aiemmin tässä oli otsikko, kolmen kohdan "ei nimeä · ei
              yhteystietoja" -rivi ja selitys siitä, mitä analytiikalla
              tehdään. Se söi puhelimessa kolmanneksen ruudusta juuri
              siinä kohtaa, jossa kävijän pitäisi nähdä hinnat — eli se
              maksoi mainosrahalla ostettuja kävijöitä. Lisäksi pitkä
              perustelu kääntyy itseään vastaan: mitä enemmän ikkuna
              selittää, sitä enemmän siitä tulee myyntipuhe ja sitä
              vahvemmin se torjutaan.

              Nyt: yksi rivi tekstiä, kaksi nappia, linkki tietosuojaan.
              Tekniikan nimeä ei mainita — se kuuluu tietosuojasivulle,
              jonne lukija hakeutuu itse jos haluaa tietää.

              `glass-light` on sama materiaali kuin headerissa, eli sama
              "kelluu sisällön päällä" -merkintä. Tuttu pinta lukee saman
              talon osaksi eikä ulkopuoliseksi työkaluksi.
            */}
            <section
              role="dialog"
              aria-label="Evästeet"
              className="theme-light glass-light pointer-events-auto mx-auto flex max-w-[560px] flex-col gap-3 overflow-hidden rounded-2xl border border-accent/15 p-3.5 shadow-[0_18px_50px_-24px_rgba(74,26,2,0.4)] sm:flex-row sm:items-center sm:gap-3.5 sm:py-3 sm:pl-4 sm:pr-3"
            >
              <span className="hidden h-8 w-8 shrink-0 place-items-center rounded-xl bg-accentSoft text-accentDark ring-1 ring-inset ring-accent/20 sm:grid">
                <FoxPaw size={16} />
              </span>

              <p className="min-w-0 flex-1 text-[12.5px] leading-snug text-ink/70">
                Käytämme evästeitä kävijämäärän mittaamiseen.{" "}
                <Link
                  href="/tietosuoja"
                  /* `whitespace-nowrap`: ilman tätä rivinvaihto osui linkin
                     keskelle ja sana jäi roikkumaan yksin viimeiselle
                     riville. Linkki näyttää yhdeltä kohteelta. */
                  className="whitespace-nowrap font-semibold text-accentDark underline decoration-accent/35 underline-offset-2 transition-colors hover:decoration-accent"
                >
                  Tietosuoja
                </Link>
              </p>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => saveChoice("denied")}
                  className="flex-1 rounded-lg border border-line bg-white/70 px-3.5 py-2 font-display text-[12.5px] font-bold text-ink/75 transition-colors hover:border-accent/35 hover:bg-white hover:text-ink active:scale-[0.98] sm:flex-none"
                >
                  Vain välttämättömät
                </button>
                <button
                  type="button"
                  onClick={() => saveChoice("granted")}
                  className="btn-ember flex-1 rounded-lg px-4 py-2 font-display text-[12.5px] font-bold text-onEmber transition-all active:scale-[0.98] sm:flex-none"
                >
                  Hyväksy
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
