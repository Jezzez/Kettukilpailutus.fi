"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Kettu — Kettukilpailutuksen maskotti.
 * Kolme 3D-renderöityä asentoa, joita vaihdetaan tilanteen mukaan.
 * Asennonvaihto on ristiinhäivytys + pieni pomppu, jolloin hahmo
 * tuntuu elävältä ilman kehysanimaatiota.
 */
export type KettuPose = "kortti" | "osoittaa" | "peukku";

const ASSETS: Record<KettuPose, { src: string; w: number; h: number; alt: string }> = {
  kortti: {
    src: "/kettu-kortti.webp",
    w: 657,
    h: 1400,
    alt: "Kettu esittelee luottokorttia",
  },
  osoittaa: {
    src: "/kettu-osoittaa.webp",
    w: 416,
    h: 1000,
    alt: "Kettu osoittaa sormella ja neuvoo",
  },
  peukku: {
    src: "/kettu-peukku.webp",
    w: 425,
    h: 1000,
    alt: "Kettu näyttää peukkua",
  },
};

export default function Kettu({
  pose = "kortti",
  height = 520,
  priority = false,
  className = "",
  float = true,
}: {
  pose?: KettuPose;
  height?: number;
  priority?: boolean;
  className?: string;
  /** Kevyt leijunta = "hengitys". Pois, jos hahmo on pienessä roolissa. */
  float?: boolean;
}) {
  const reduce = useReducedMotion();
  const a = ASSETS[pose];
  const width = Math.round((a.w / a.h) * height);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ height, width }}
      animate={reduce || !float ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={pose}
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="absolute inset-0 flex items-end justify-center"
        >
          <Image
            src={a.src}
            alt={a.alt}
            width={a.w}
            height={a.h}
            priority={priority}
            className="h-full w-auto select-none drop-shadow-[0_24px_40px_rgba(38,32,26,0.16)]"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
