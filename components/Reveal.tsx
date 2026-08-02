"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll reveal -kääre: sisältö nousee pehmeästi näkyviin,
 * kun elementti tulee näyttöön. Kunnioittaa reduced motion -asetusta.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  /*
   * Laukaisu 40 px ENNEN kuin elementti on ruudussa (positiivinen margin),
   * jotta sisältö on jo paikallaan kun katse osuu siihen. Aiempi -80px +
   * 0,6 s + porrastus tarkoitti, että nopeasti vierittävä näki tyhjää tilaa
   * siinä missä sisällön piti olla. Liike on nyt lyhyempi ja matalampi.
   */
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "40px" }}
      transition={{ duration: 0.4, delay: Math.min(delay, 0.18), ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
