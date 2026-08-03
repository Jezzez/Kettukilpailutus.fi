import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import BrushRule from "./BrushRule";
import TailSweep from "./fox/TailSweep";
import FoxSlot from "./fox/FoxSlot";

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
    /*
      LOPPUKEHOTUS ON TÄYSLEVEÄ ORANSSI VYÖ.

      MIKSI MUUTETTIIN: tässä oli hiekanvärinen laatikko vaalealla
      pohjalla. Se katosi. Sivun viimeinen ostohetki näytti samalta kuin
      sitä edeltävät tietolaatikot, joten selaava silmä luki sen yhdeksi
      osioksi lisää eikä pysähtynyt. Sivun alaosassa ei ole enää
      vertailua tarjolla — joko käyttäjä painaa tästä tai poistuu.

      MIKSI VYÖ EIKÄ ISOMPI NAPPI: napin suurentaminen ei auta, jos
      ympäristö on samanvärinen. Kun koko kaista vaihtaa värin, muutos
      näkyy jo silmäkulmassa selatessa ja pysäyttää liikkeen. Vyön päällä
      nappi on kermanvalkoinen, koska oranssi nappi oranssilla pohjalla
      olisi taas näkymätön — tässä napin tehtävä on olla vyön ainoa
      vaalea piste.

      Reunat hoidetaan hännänvedolla: `fill` on naapurivyöhykkeen väri,
      ja `theme-light`-kääre pakottaa muuttujan ratkeamaan vaaleaksi
      vaikka itse osio on `theme-ember`.
    */
    <section className="theme-ember ember-surface relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 rotate-180">
        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={64} />
        </div>
      </div>

      <Reveal>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-24 text-center sm:px-6 md:flex-row md:py-28 md:text-left">
          <div className="flex-1">
            <BrushRule className="mx-auto mb-8 block text-goldInk md:mx-0" width={96} />
            <h2 className="mx-auto max-w-xl font-hero text-[2rem] leading-[1.08] text-cream sm:text-[2.6rem] md:mx-0">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink/85 md:mx-0">
              {text}
            </p>
            <Link
              href={href}
              /*
                Tekstin väri on KIINTEÄ arvo eikä `text-accentDark`.
                `accentDark` on teemamuuttuja, ja `.theme-ember` kääntää
                sen vaaleaksi kermaksi — oikein oranssia pohjaa vasten,
                mutta tämä nappi on kermanvalkoinen, joten teksti katosi
                napin sisään kokonaan. Sama sävy kuin `.ember-surface`-
                pohjassa, eli ei uutta väriä palettiin.
              */
              className="group mt-8 inline-flex items-center gap-2.5 rounded-xl bg-cream px-8 py-4 font-display text-[15.5px] font-bold text-[#A83E0A] shadow-lift transition-all hover:bg-white active:scale-[0.98]"
            >
              {button}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>

          {/* Ketun loppuallekirjoitus. `halo-glow` erottaa hahmon
              oranssista pohjasta ilman uutta väriä. */}
          <div className="halo-glow relative shrink-0">
            <FoxSlot id="footer" height={190} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
