"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Kettu, { type KettuPose } from "./Kettu";
import { ENERGY_COMPARE, isEnergyPath } from "@/lib/nav";

/**
 * Kettu-opas — hillitty versio.
 * Puhuu vain kahdesti: tervehtii kerran saapuessa ja muistuttaa kerran
 * sivun lopussa. Muuten se vain elää mukana: pehmeä jousiliike
 * scrollatessa, kevyt leijunta levossa. Klikkaus vie vertailuun
 * (peukku kiitokseksi). Ei jatkuvaa ohjeistusta.
 */
export default function MascotGuide() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [pose, setPose] = useState<KettuPose>("kortti");
  const [mobile, setMobile] = useState(false);
  const stopTimer = useRef<ReturnType<typeof setTimeout>>();
  const saidBottom = useRef(false);
  const poseTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const u = () => setMobile(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);

  // Tervehdys kerran
  useEffect(() => {
    const greeting = isEnergyPath(window.location.pathname)
      ? "Moi! Olen Kettu – lasken sähkön hinnat kulutuksellasi."
      : window.location.pathname.startsWith("/luottokortit")
        ? "Moi! Olen Kettu – autan löytämään parhaan kortin."
        : "Moi! Olen Kettu – valitse, mitä kilpailutetaan.";
    const t1 = setTimeout(() => setBubble(greeting), 1600);
    const t2 = setTimeout(() => setBubble(null), 6400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Scroll: pehmeä reagointi + yksi muistutus lopussa
  useEffect(() => {
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(stopTimer.current);
      stopTimer.current = setTimeout(() => setScrolling(false), 220);

      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 320;
      if (nearBottom && !saidBottom.current) {
        saidBottom.current = true;
        setBubble(isEnergyPath(window.location.pathname)
          ? "Edullisin sopimuksesi odottaa vertailussa."
          : "Paras osumasi odottaa vertailussa.");
        setTimeout(() => setBubble(null), 5200);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(stopTimer.current);
    };
  }, []);

  useEffect(() => () => clearTimeout(poseTimer.current), []);

  if (dismissed || pathname?.startsWith("/admin")) return null;

  const goCompare = () => {
    setPose("peukku");
    clearTimeout(poseTimer.current);
    poseTimer.current = setTimeout(() => setPose("kortti"), 1600);
    const el = document.getElementById("vertailu");
    if (el) {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    } else {
      // Sivulla ei ole vertailua (blogi, infosivut) → ohjaa päävertikaaliin.
      window.location.href = ENERGY_COMPARE;
    }
  };

  return (
    <div
      className="pointer-events-none fixed left-1 z-40 sm:left-4"
      style={{ bottom: mobile ? "calc(3.8rem + env(safe-area-inset-bottom))" : "0.5rem" }}
    >
      <div className="pointer-events-auto relative">
        <AnimatePresence>
          {bubble && !scrolling && (
            <motion.div
              key={bubble}
              initial={reduce ? false : { opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`absolute left-[58%] rounded-2xl rounded-bl-md border border-line bg-white/95 p-3.5 shadow-cardHover backdrop-blur ${
                mobile ? "bottom-14 w-44" : "bottom-[5.5rem] w-52"
              }`}
            >
              <button
                onClick={() => setDismissed(true)}
                aria-label="Piilota Kettu"
                className="absolute -right-2.5 -top-2.5 grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-ink/60 shadow-sm hover:text-ink"
              >
                <X size={13} />
              </button>
              <p className="text-[12.5px] font-medium leading-snug text-ink/85">{bubble}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={goCompare}
          aria-label="Kettu: siirry vertailuun"
          className="block opacity-95 transition-opacity hover:opacity-100"
          animate={reduce ? undefined : { y: scrolling ? -5 : 0, rotate: scrolling ? -1.2 : 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          whileTap={{ scale: 0.96 }}
          style={{ touchAction: "manipulation" }}
        >
          <Kettu pose={pose} height={mobile ? 104 : 148} float={!scrolling} />
        </motion.button>
      </div>
    </div>
  );
}
