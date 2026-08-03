import type { Metadata } from "next";
import BlogList from "@/components/BlogList";
import Reveal from "@/components/Reveal";
import Kettu from "@/components/mascot/Kettu";
import BrushRule from "@/components/BrushRule";
import TailSweep from "@/components/fox/TailSweep";
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
    <>
      {/*
        OPPAIDEN OTSIKKO ON KAPEA ORANSSI VYÖ.

        MIKSI: oppaat ovat sivuston SEO-sisääntulo. Hakukoneesta tuleva
        kävijä ei ole valinnut brändiä — hän on valinnut aiheen, ja hänen
        täytyy tunnistaa ensimmäisessä sekunnissa mihin palveluun hän
        laskeutui, jotta artikkelin lopun vertailulinkki tuntuisi saman
        talon jatkoksi eikä mainokselta. Vaalea otsikko vaalealla listalla
        ei tehnyt sitä työtä lainkaan.

        MIKSI KAPEA: tämä ei ole myyntisivu vaan lukemisen alku. Vyön
        tehtävä on merkitä sisääntulo ja luovuttaa tila artikkeleille —
        korkea vyö vain työntäisi ensimmäisen otsikon taitteen alle.
      */}
      <section className="theme-ember ember-surface relative overflow-hidden">
        <div className="relative z-[1] mx-auto flex max-w-[1180px] flex-wrap items-end justify-between gap-6 px-4 pb-14 pt-12 sm:px-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                Ketun oppaat
              </span>
              <BrushRule className="text-goldInk/70" width={64} />
            </div>
            <h1 className="mt-4 font-hero text-[2.25rem] leading-[1.08] text-cream sm:text-[2.75rem]">
              Selvällä suomella, ilman myyntipuhetta
            </h1>
            <p className="mt-3 max-w-xl text-ink/85">
              Kettu lukee pienellä präntätyt puolestasi ja kertoo mitä ne
              tarkoittavat sinun euroissasi.
            </p>
          </div>
          <div className="halo-glow relative hidden shrink-0 sm:block">
            <Kettu pose="osoittaa" height={150} />
          </div>
        </div>

        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={64} />
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-4 pb-16 pt-8 sm:px-6">
        <Reveal>
          <BlogList posts={posts} />
        </Reveal>
      </div>
    </>
  );
}
