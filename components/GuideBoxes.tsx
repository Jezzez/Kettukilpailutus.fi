import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPosts } from "@/lib/data";
import Reveal from "./Reveal";
import { ArrowRight } from "lucide-react";

/** Persikanväriset opaslaatikot — lämmin nosto blogisisältöihin. */
export default function GuideBoxes() {
  const posts = getPosts().slice(0, 3);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-semibold text-ink sm:text-4xl">
            Ketun oppaat ja vinkit
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <Link
                href={`/blogi/${post.slug}`}
                className="group flex h-full flex-col rounded-2xl bg-peach p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-cardHover"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                    {post.title}
                  </h3>
                  <ChevronRight
                    size={22}
                    className="mt-1 shrink-0 text-accent transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/80">{post.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15}>
          <div className="mt-8 flex justify-center">
            <Link
              href="/blogi"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3 font-display text-sm font-semibold text-ink/82 transition-colors hover:border-ink/25 hover:text-ink"
            >
              Kaikki oppaat <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
