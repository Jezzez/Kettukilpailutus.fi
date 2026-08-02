"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 20, suffix: "+", label: "korttia vertailussa" },
  { value: 10000, suffix: "+", label: "kuukausittaista kävijää" },
  { value: 98, suffix: " %", label: "käyttäjistä löysi sopivan kortin" },
];

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-cream sm:text-5xl">
      {n.toLocaleString("fi-FI")}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section aria-label="Tilastot" className="px-4 py-4 sm:px-6">
      <div className="mx-auto grid max-w-[1180px] gap-10 rounded-3xl border border-line bg-den px-8 py-14 md:grid-cols-3 md:py-16">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="text-center"
          >
            <CountUp value={s.value} suffix={s.suffix} />
            <p className="mt-2 text-sm text-cream/72">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
