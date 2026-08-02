"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Sopivuusmittari: yksi sininen kaari, joka animoituu arvon muuttuessa. */
export default function ScoreRing({ value, label }: { value: number; label: string }) {
  const reduce = useReducedMotion();
  const r = 24;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center" title={`${label}: ${value}/100`}>
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 60 60" className="h-16 w-16 -rotate-90">
          <circle cx="30" cy="30" r={r} fill="none" stroke="#E7EAF0" strokeWidth="5" />
          <motion.circle
            cx="30" cy="30" r={r} fill="none"
            stroke="#EA6A1F" strokeWidth="5" strokeLinecap="round"
            strokeDasharray={c}
            initial={false}
            animate={{ strokeDashoffset: c - (c * value) / 100 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 20 }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-data text-sm font-semibold text-ink" aria-hidden>
          {value}
        </span>
      </div>
      <span className="mt-1 text-[11px] font-medium text-ink/58">{label}</span>
      <span className="sr-only">{label} {value} pistettä sadasta</span>
    </div>
  );
}
