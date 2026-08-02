"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Hero-kuvitus: kaksi maksukorttia samassa sävymaailmassa (slate + Kortio-
 * sininen). Kevyt leijunta, ei muita tehosteita.
 */
function CardSvg({ from, to, label }: { from: string; to: string; label: string }) {
  const id = label.replace(/\s/g, "");
  return (
    <svg viewBox="0 0 340 214" className="h-auto w-full" role="img" aria-label={`Kuvituskortti ${label}`}>
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="340" height="214" rx="18" fill={`url(#g-${id})`} />
      <rect x="28" y="56" width="44" height="32" rx="6" fill="rgba(255,255,255,0.9)" />
      <path d="M28 68h44M28 76h44M42 56v32M58 56v32" stroke="rgba(16,24,40,0.25)" strokeWidth="1.3" />
      <g stroke="rgba(255,255,255,0.8)" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M292 62a14 14 0 0 1 0 20" />
        <path d="M299 55a24 24 0 0 1 0 34" />
        <path d="M285 69a4 4 0 0 1 0 6" />
      </g>
      <text x="28" y="140" fill="rgba(255,255,255,0.9)" fontSize="19" fontFamily="system-ui" letterSpacing="3">
        •••• •••• •••• 2026
      </text>
      <text x="28" y="184" fill="rgba(255,255,255,0.65)" fontSize="12" fontFamily="system-ui" letterSpacing="1.5">
        {label.toUpperCase()}
      </text>
    </svg>
  );
}

export default function HeroCards() {
  const reduce = useReducedMotion();
  const float = (delay: number) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -8, 0] },
          transition: { duration: 6, delay, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-md" aria-hidden>
      <motion.div className="absolute right-0 top-4 w-[76%] rotate-[7deg] drop-shadow-xl" {...float(0.8)}>
        <CardSvg from="#1D2939" to="#344054" label="Platinum" />
      </motion.div>
      <motion.div className="absolute bottom-4 left-0 w-[82%] -rotate-3 drop-shadow-2xl" {...float(0)}>
        <CardSvg from="#2E5BFF" to="#1E46E0" label="Kortio" />
      </motion.div>
    </div>
  );
}
