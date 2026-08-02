import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Kettu from "@/components/mascot/Kettu";

export default function NotFound() {
  return (
    <section className="den-surface relative overflow-hidden">
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-8 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-gold">
              Virhe 404
            </span>
            <span className="gold-rule w-16" aria-hidden />
          </div>
          <h1 className="mt-4 font-display text-[2.4rem] font-extrabold leading-[1.06] tracking-tight text-cream sm:text-[3rem]">
            Tätä sivua Kettu ei löydä.
          </h1>
          <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-cream/72">
            Osoite on voinut muuttua tai sivu on poistettu. Kilpailutus onnistuu silti —
            aloita alta.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sahkosopimukset"
              className="btn-ember group inline-flex items-center gap-2.5 rounded-xl px-7 py-4 font-display text-[15.5px] font-bold text-cream transition-all active:scale-[0.98]"
            >
              <Zap size={18} aria-hidden /> Kilpailuta sähkö
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-xl border border-cream/15 bg-cream/5 px-7 py-4 font-display text-[15.5px] font-bold text-cream backdrop-blur transition-all hover:bg-cream/10"
            >
              Etusivulle
            </Link>
          </div>
        </div>
        <div className="ember-glow relative mx-auto hidden md:block">
          <Kettu pose="osoittaa" height={380} />
        </div>
      </div>
    </section>
  );
}
