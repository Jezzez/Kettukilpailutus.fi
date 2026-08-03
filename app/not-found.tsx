import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Kettu from "@/components/mascot/Kettu";
import BrushRule from "@/components/BrushRule";

export default function NotFound() {
  return (
    <section className="theme-light dawn-surface relative overflow-hidden">
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-8 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-display text-[12px] font-bold uppercase tracking-[0.2em] text-goldInk">
              Virhe 404
            </span>
            <BrushRule className="text-gold" width={64} />
          </div>
          <h1 className="mt-4 font-hero text-[2.4rem] leading-[1.06] text-ink sm:text-[3rem]">
            Tätä sivua Kettu ei löydä.
          </h1>
          <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-ink/70">
            Osoite on voinut muuttua tai sivu on poistettu. Kilpailutus onnistuu silti —
            aloita alta.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sahkosopimukset"
              className="btn-ember group inline-flex items-center gap-2.5 rounded-xl px-7 py-4 font-display text-[15.5px] font-bold text-onEmber transition-all active:scale-[0.98]"
            >
              <Zap size={18} aria-hidden /> Kilpailuta sähkö
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-xl border border-lineDark bg-white px-7 py-4 font-display text-[15.5px] font-bold text-ink shadow-card transition-all hover:border-ink/30"
            >
              Etusivulle
            </Link>
          </div>
        </div>
        <div className="dawn-glow relative mx-auto hidden md:block">
          <Kettu pose="osoittaa" height={380} />
        </div>
      </div>
    </section>
  );
}
