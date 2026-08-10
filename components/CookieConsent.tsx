"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import FoxPaw from "./FoxPaw";
import {
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
  const [choice, setChoice] = useState<GoogleAnalyticsConsent | null>(null);

  useEffect(() => {
    let storedChoice: GoogleAnalyticsConsent | null = null;

    try {
      const stored = window.localStorage.getItem(GA_CONSENT_STORAGE_KEY);
      if (stored === "granted" || stored === "denied") storedChoice = stored;
    } catch {
      // Jos tallennustila ei ole käytettävissä, kysytään valinta uudelleen.
    }

    if (storedChoice) {
      setChoice(storedChoice);
      updateGoogleConsent(storedChoice);
    } else {
      setOpen(true);
    }

    setReady(true);
  }, []);

  const saveChoice = (nextChoice: GoogleAnalyticsConsent) => {
    try {
      window.localStorage.setItem(GA_CONSENT_STORAGE_KEY, nextChoice);
    } catch {
      // Suostumus vaikuttaa silti nykyiseen sivuun, vaikka sitä ei voi muistaa.
    }

    updateGoogleConsent(nextChoice);
    setChoice(nextChoice);
    setOpen(false);
  };

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <>
      <AnimatePresence>
        {ready && open && (
          <motion.div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:bottom-3 sm:px-5 sm:pb-0"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            transition={transition}
          >
            <section
              role="dialog"
              aria-labelledby="cookie-consent-title"
              aria-describedby="cookie-consent-description"
              className="theme-light pointer-events-auto mx-auto max-w-[760px] rounded-3xl border border-line bg-white/95 p-4 shadow-[0_22px_70px_-24px_rgba(74,26,2,0.48)] backdrop-blur-xl sm:p-5"
            >
              <div className="flex items-start gap-3.5 sm:gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accentSoft text-accentDark sm:h-11 sm:w-11">
                  <FoxPaw size={20} />
                </span>

                <div className="min-w-0 flex-1">
                  <h2
                    id="cookie-consent-title"
                    className="font-display text-[17px] font-bold leading-snug text-ink sm:text-[18px]"
                  >
                    Saako Kettu käyttää analytiikkaa?
                  </h2>
                  <p
                    id="cookie-consent-description"
                    className="mt-1.5 text-[13px] leading-relaxed text-ink/70 sm:text-[13.5px]"
                  >
                    Google Analytics auttaa kehittämään vertailua. Hyväksymällä
                    sallit analytiikkaevästeet. Hylkääminen ei vaikuta sivuston
                    toimintaan tai affiliate-linkkeihin. {" "}
                    <Link
                      href="/tietosuoja"
                      className="font-semibold text-accentDark underline decoration-accent/35 underline-offset-2 hover:decoration-accent"
                    >
                      Lue lisää
                    </Link>
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:ml-[60px] sm:flex sm:justify-end">
                <button
                  type="button"
                  onClick={() => saveChoice("denied")}
                  className="min-h-12 rounded-xl border border-line bg-white px-4 py-3 font-display text-[14px] font-bold text-ink transition-colors hover:border-accent/40 hover:bg-mist active:scale-[0.98] sm:min-w-[140px]"
                >
                  Hylkää
                </button>
                <button
                  type="button"
                  onClick={() => saveChoice("granted")}
                  className="btn-ember min-h-12 rounded-xl px-4 py-3 font-display text-[14px] font-bold text-onEmber transition-all active:scale-[0.98] sm:min-w-[190px]"
                >
                  Hyväksy analytiikka
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ready && !open && choice && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Muuta evästeasetuksia"
            className="theme-light fixed bottom-24 left-3 z-[60] inline-flex items-center gap-2 rounded-full border border-line bg-white/95 px-3 py-2 font-display text-[12px] font-semibold text-ink/75 shadow-card backdrop-blur transition-colors hover:border-accent/40 hover:text-accentDark md:bottom-4 md:left-4"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
            transition={transition}
          >
            <FoxPaw size={13} className="text-accentDark" />
            Evästeet
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
