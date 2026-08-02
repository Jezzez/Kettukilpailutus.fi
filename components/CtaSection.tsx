import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function CtaSection({
  href = "/luottokortit#vertailu",
  title = "Löydä sinulle paras luottokortti tänään",
  text = "Vastaa kolmeen kysymykseen – Kettu järjestää kortit puolestasi.",
  button = "Aloita ilmainen vertailu",
}: {
  href?: string;
  title?: string;
  text?: string;
  button?: string;
}) {
  return (
    <section className="pb-20 pt-4 md:pb-28">
      <Reveal>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="den-surface overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-10 md:py-20">
            <span className="gold-rule mx-auto mb-8 block w-24" aria-hidden />
            <h2 className="mx-auto max-w-xl font-display text-[2rem] font-extrabold leading-tight text-cream sm:text-[2.6rem]">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-cream/68">{text}</p>
            <Link
              href={href}
              className="group mt-8 inline-flex items-center gap-2.5 btn-ember rounded-xl px-8 py-4 font-display text-[15.5px] font-bold text-cream transition-all active:scale-[0.98]"
            >
              {button}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
