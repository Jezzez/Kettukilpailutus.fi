import type { Metadata } from "next";
import BlogList from "@/components/BlogList";
import Reveal from "@/components/Reveal";
import Kettu from "@/components/mascot/Kettu";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ketun oppaat – luottokortit, säästäminen ja henkilökohtainen talous",
  description:
    "Ketun oppaat: selkeitä, myyntipuheettomia artikkeleita luottokorteista, koroista, matkustamisesta ja rahan säästämisestä.",
  alternates: { canonical: "/blogi" },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 md:py-18">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-hero text-[2.25rem] leading-[1.08] text-ink sm:text-[2.75rem]">
              Ketun oppaat
            </h1>
            <p className="mt-3 max-w-xl text-ink/70">
              Selkeitä, myyntipuheettomia oppaita rahasta ja maksamisesta. Kettu lukee pienellä
              präntätyt puolestasi.
            </p>
          </div>
          <Kettu pose="osoittaa" height={150} className="hidden sm:block" />
        </div>
      </Reveal>

      <div className="mt-8">
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
