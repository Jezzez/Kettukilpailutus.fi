"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Kettu, { type KettuPose } from "./Kettu";

/**
 * Heron Kettu: saapuu kerran ja elää sen jälkeen hillitysti.
 * Ei puhekuplia — maskotti on läsnä, ei äänessä.
 */
export default function HeroKettu({ height = 560 }: { height?: number }) {
  const reduce = useReducedMotion();
  const [pose, setPose] = useState<KettuPose>("kortti");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (reduce) return;
    const loop = setInterval(() => {
      setPose((p) => (p === "kortti" ? "osoittaa" : "kortti"));
      timers.current.push(setTimeout(() => setPose("kortti"), 4200));
    }, 14000);

    return () => {
      clearInterval(loop);
      timers.current.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <motion.div
      className="relative flex justify-center"
      initial={reduce ? false : { opacity: 0, x: 50, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.15 }}
    >
      <Kettu pose={pose} height={height} priority />
    </motion.div>
  );
}
