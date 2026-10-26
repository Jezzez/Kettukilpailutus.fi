"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/*
  KETTU KIERTÄÄ LAMPUN KIINNI — JA SE SYTTYY, KUN SOPIMUKSET OVAT VALMIIT.

  Työpöydän latauspaneelin video (Jessen pyyntö 26.10.2026). Kettu kiertää
  lamppua kantaansa, lamppu syttyy, ja kettu innostuu. Ele sanoo saman kuin
  koko palvelu: Kettu tekee työn, ja tulos on valmis kun valo syttyy.

  VIDEO. Gemini (Veo) teki sen kuvituksesta `kettu-lamppu.webp`.
  Alkuperäinen oli 10 s 720x1280 äänen kanssa. Siitä on rajattu kohta
  1,3–6,5 s: alussa kettu vasta nostaa lamppua, ja 6,5 s jälkeen kettu
  vain seisoo ihmeissään. Lamppu syttyy rajatussa videossa noin 3,16 s
  kohdalla, sen jälkeen tulee innostunut reaktio. Ääni on poistettu,
  koko 540x960, H.264, noin 900 kt. Latauksen kesto (`RESULT_LOADING_MS`
  5 500 ms) on mitoitettu tälle 5,2 s videolle.

  MYÖHÄSTYNYT KÄYNNISTYS. Jos video pääsee käyntiin myöhässä (hidas
  yhteys), se hypätään kohtaan, jossa sen pitäisi jo olla, jotta lamppu
  ehtii syttyä ja reaktio näkyä ennen kuin tulokset tulevat.

  TAUSTA. Videon tausta on noin #F7EFE3, käytännössä sivuston `mist`.
  Paneelin palsta ja mobiilin latausruutu ovat latauksen ajan `bg-mist`.
  Sävyt eroavat silti parin askeleen verran, mikä näkyi heikkona
  suorakulmiona, joten videon reunat häivytetään maskilla taustaan
  (`EDGE_FADE`).

  VARAKUVAT: `kettu-lamppu-video-alku.jpg` on poster, joka näkyy kunnes
  video toistuu. Vähemmän liikettä pyytäneelle näytetään suoraan
  `kettu-lamppu-video-loppu.jpg`, jossa lamppu jo palaa.
*/

const VIDEO = "/kettu-lamppu.mp4";
/** Reunojen häivytys: kaksi gradienttia leikataan toisiinsa, jolloin
 *  kaikki neljä reunaa sulautuvat taustaan. */
const EDGE_FADE = {
  maskImage:
    "linear-gradient(to bottom, transparent, #000 7%, #000 88%, transparent), linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent, #000 7%, #000 88%, transparent), linear-gradient(to right, transparent, #000 9%, #000 91%, transparent)",
  WebkitMaskComposite: "source-in",
} as const;
const POSTER = "/kettu-lamppu-video-alku.jpg";
const END_FRAME = "/kettu-lamppu-video-loppu.jpg";

let preloaded = false;
/**
 * Hakee videon ja kuvat välimuistiin kyselyn aikana. Lataus kestää vain
 * 4 sekuntia: jos video haettaisiin vasta paneelin auetessa, se ei ehtisi
 * ensikäynnillä perille ja lamppu syttyisi myöhässä tai ei lainkaan.
 */
export function preloadLampFox() {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;
  fetch(VIDEO).catch(() => {});
  for (const src of [POSTER, END_FRAME]) new window.Image().src = src;
}

export default function LampFox({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const t0 = performance.now();
    const start = () => {
      const shouldBeAt = (performance.now() - t0) / 1000;
      if (shouldBeAt > 0.15 && Number.isFinite(v.duration)) {
        v.currentTime = Math.min(shouldBeAt, v.duration - 0.05);
      }
      v.play().catch(() => {});
    };
    if (v.readyState >= 2) start();
    else v.addEventListener("canplay", start, { once: true });
    return () => v.removeEventListener("canplay", start);
  }, [reduce]);

  return (
    <div
      className={`pointer-events-none relative aspect-[540/960] ${className}`}
      style={EDGE_FADE}
      aria-hidden
    >
      {reduce ? (
        <img src={END_FRAME} alt="" className="h-full w-full object-contain" />
      ) : (
        <video
          ref={ref}
          src={VIDEO}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
}
