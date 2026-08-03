"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Post } from "@/lib/types";

const CATEGORIES = ["Kaikki", "Sähkö", "Luottokortit", "Henkilökohtainen talous", "Säästäminen", "Matkustaminen", "Vertailut"];

/** Oppaiden listaus toimivalla kategoriasuodatuksella. */
export default function BlogList({ posts }: { posts: Post[] }) {
  const [cat, setCat] = useState("Kaikki");
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => (cat === "Kaikki" ? posts : posts.filter((p) => p.category === cat)),
    [posts, cat]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Suodata kategorioittain">
        {CATEGORIES.map((c) => {
          const on = cat === c;
          const count = c === "Kaikki" ? posts.length : posts.filter((p) => p.category === c).length;
          if (count === 0 && c !== "Kaikki") return null;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={on}
              className={`rounded-xl px-4 py-2.5 font-display text-[13px] font-semibold transition-all active:scale-[0.97] ${
                on ? "bg-ink text-paper" : "border border-line bg-white text-ink/70 hover:border-lineDark hover:text-ink"
              }`}
            >
              {c} <span className={on ? "text-paper/60" : "text-ink/50"}>({count})</span>
            </button>
          );
        })}
      </div>

      <LayoutGroup>
        <motion.div layout={!reduce} className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((post) => (
              <motion.div
                key={post.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
              >
                <Link
                  href={`/blogi/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-cardHover"
                >
                  <span className="inline-flex w-fit rounded-full bg-accentSoft px-3 py-1 text-[11px] font-semibold text-accentDark">
                    {post.category}
                  </span>
                  <h2 className="mt-4 font-display text-lg font-semibold leading-snug text-ink group-hover:underline underline-offset-4">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink/70">{post.excerpt}</p>
                  <p className="mt-5 flex items-center gap-3 text-xs text-ink/60">
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("fi-FI")}</time>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} aria-hidden /> {post.readMinutes} min
                    </span>
                  </p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
