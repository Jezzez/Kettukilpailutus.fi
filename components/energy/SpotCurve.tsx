"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Signature-elementti: pörssisähkön vuorokauden tuntikäyrä.
 *
 * Miksi tämä eikä koristegradientti: käyrä on sähkömarkkinan oma
 * artefakti. Se kertoo yhdellä katsauksella sen tärkeimmän asian,
 * jota kilpailuttaja ei tiedä — sähkön hinta ei ole yksi luku, vaan
 * vuorokauden mittainen aalto. Halvimmat tunnit hehkuvat kultaisina.
 */
const HOURS = [
  3.1, 2.6, 2.3, 2.2, 2.5, 3.4, 5.8, 8.4, 9.6, 8.1, 6.9, 6.2,
  5.8, 5.5, 5.9, 6.8, 8.9, 11.2, 10.4, 8.2, 6.4, 5.1, 4.2, 3.5,
];

const W = 1200;
const H = 150;
const MAX = 12;

function point(i: number, v: number) {
  return [(i / (HOURS.length - 1)) * W, H - (v / MAX) * (H - 18) - 6] as const;
}

/** Pehmeä katmull-rom-tyylinen käyrä pisteiden läpi. */
function smoothPath(values: number[]): string {
  const pts = values.map((v, i) => point(i, v));
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

export default function SpotCurve({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const avg = HOURS.reduce((a, b) => a + b, 0) / HOURS.length;
  const line = smoothPath(HOURS);
  const area = `${line} L ${W},${H} L 0,${H} Z`;
  const cheapest = HOURS.indexOf(Math.min(...HOURS));

  return (
    <div className={className} aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="spotArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2691A" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#F2691A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="spotLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E9B25A" />
            <stop offset="45%" stopColor="#F2691A" />
            <stop offset="100%" stopColor="#E9B25A" />
          </linearGradient>
        </defs>

        <path d={area} fill="url(#spotArea)" />
        <motion.path
          d={line}
          fill="none"
          stroke="url(#spotLine)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />

        {/* Keskiarvoviiva antaa käyrälle mittakaavan */}
        <line
          x1="0" x2={W}
          y1={point(0, avg)[1]} y2={point(0, avg)[1]}
          stroke="#E9B25A" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="5 7"
        />

        {/* Halvat tunnit: kultaiset pisteet */}
        {HOURS.map((v, i) =>
          v < avg * 0.75 ? (
            <circle
              key={i}
              cx={point(i, v)[0]}
              cy={point(i, v)[1]}
              r={i === cheapest ? 5 : 3}
              fill="#E9B25A"
              fillOpacity={i === cheapest ? 1 : 0.55}
            />
          ) : null
        )}
      </svg>
    </div>
  );
}
