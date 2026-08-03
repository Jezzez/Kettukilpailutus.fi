"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/types";

/** UKK-haitari + schema.org FAQPage JSON-LD hakukoneille. */
export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/*
        Avoin rivi merkitään omalla pinnalla ja oranssilla reunalla.
        Aiemmin avattu ja suljettu kysymys näyttivät samalta, joten pitkässä
        listassa katosi tieto siitä, mihin kysymykseen luettu vastaus kuuluu.
        UKK on viimeinen paikka, jossa epäröivä lukija etsii syytä olla
        tekemättä sopimusta — jos vastaus löytyy vaivatta, hän palaa nappiin
        eikä poistu hakukoneeseen.
      */}
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className={isOpen ? "bg-mist" : "transition-colors hover:bg-mist/60"}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between gap-4 border-l-[3px] px-6 py-5 text-left transition-colors ${
                  isOpen ? "border-accent" : "border-transparent"
                }`}
              >
                <span className={`font-display text-[15px] font-bold ${isOpen ? "text-accentDark" : "text-ink"}`}>
                  {item.q}
                </span>
                <ChevronDown
                  size={18} aria-hidden
                  className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-accentDark" : "text-ink/55"}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="border-l-[3px] border-accent px-6 pb-6 text-[15px] leading-relaxed text-ink/75">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
