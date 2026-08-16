import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import TailSweep from "./fox/TailSweep";
import FoxSlot from "./fox/FoxSlot";
import { ENERGY_COMPARE } from "@/lib/nav";

export default function CtaSection({
  /* Oletuskohde on sähkövertailu, koska se on ainoa auki oleva
     vertikaali. Aiempi oletus vei korttivertailuun, joka palauttaa
     nyt 404 — ja loppukehote on sivuston viimeinen mahdollisuus
     ansaita, joten sen ei kuulu koskaan osoittaa umpikujaan. */
  href = ENERGY_COMPARE,
  title = "Löydä sinulle paras luottokortti tänään",
  text = "Vastaa kolmeen kysymykseen – Kettu järjestää kortit puolestasi.",
  button = "Aloita ilmainen vertailu",
  /*
    TOINEN NAPPI ON VALINNAINEN JA TARKOITETTU VAIN ETUSIVULLE.

    Vertikaalisivuilla loppukehotuksessa saa olla täsmälleen yksi kohde:
    sähkösivun lukija on jo valinnut sähkön, ja toinen nappi tarjoaisi
    hänelle ulospääsyn juuri siinä kohdassa, jossa hänen pitäisi painaa
    ainoaa tuottavaa linkkiä.

    Etusivulla tilanne on päinvastainen. Sinne tullaan brändihaulla
    valitsematta mitään, ja jos sivun viimeinen kehotus puhuu pelkästä
    sähköstä, lainoja etsivä kävijä lukee koko palvelun sähköpalveluksi
    ja poistuu. Siksi molemmat kohteet ovat tässä nimeltä mainittuina.

    `undefined`-oletus tarkoittaa, ettei yksikään olemassa oleva
    kutsupaikka muutu.
  */
  secondaryHref,
  secondaryButton,
}: {
  href?: string;
  title?: string;
  text?: string;
  button?: string;
  secondaryHref?: string;
  secondaryButton?: string;
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
    /*
      EI `overflow-hidden`. Se rajasi aiemmin kaiken vyön sisään, mutta
      nyt Ketun korvat nousevat vyön yläreunan yli hännänvedon päälle.
      Vyön oma taustakuvio on `inset-0`-kerroksessa, joten se ei vuoda
      minnekään ilman rajausta.
    */
    <section className="theme-ember ember-surface relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 rotate-180">
        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={64} />
        </div>
      </div>

      <Reveal>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-24 text-center sm:px-6 md:flex-row md:py-28 md:text-left">
          <div className="flex-1">
            <h2 className="mx-auto max-w-xl font-hero text-[2rem] leading-[1.08] text-cream sm:text-[2.6rem] md:mx-0">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink/85 md:mx-0">
              {text}
            </p>
            {/*
              Napit ovat samat kuin heron napit: kerma = ensisijainen,
              läpikuultava kerma + reuna = toissijainen. Kun sivun
              ensimmäinen ja viimeinen kehotus näyttävät samalta, lukija
              tunnistaa alalaidassa saman valinnan jonka ohitti ylhäällä.

              Puhelimessa napit ovat täysleveitä ja allekkain, koska
              kaksi vierekkäistä nappia kapealla ruudulla kutistuu niin,
              ettei kumpikaan näytä painikkeelta.
            */}
            {/* `justify-center md:justify-start` seuraa emon tekstin
                tasausta (`text-center ... md:text-left`). Ilman sitä
                640–768 px:n välissä otsikko olisi keskellä ja napit
                vasemmassa reunassa. */}
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap md:justify-start">
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
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-cream px-8 py-[18px] font-display text-[16px] font-bold text-[#A83E0A] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_5px_rgba(74,26,2,0.28),0_16px_34px_-12px_rgba(74,26,2,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#FFFFFF] active:translate-y-0 active:scale-[0.98] sm:w-auto"
              >
                {button}
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>

              {secondaryHref && secondaryButton && (
                <Link
                  href={secondaryHref}
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-cream/70 bg-cream/[0.14] px-8 py-[18px] font-display text-[16px] font-bold text-cream shadow-[inset_0_1px_0_rgba(255,244,235,0.28),0_10px_26px_-14px_rgba(74,26,2,0.7)] transition-all hover:-translate-y-0.5 hover:border-cream hover:bg-cream/25 active:translate-y-0 active:scale-[0.98] sm:w-auto"
                >
                  {secondaryButton}
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              )}
            </div>
          </div>

          {/*
            Ketun loppuallekirjoitus.

            EI `halo-glow`-HEHKUA. Se oli tarpeen aiemmalle, kapealle
            asennolle, joka olisi muuten sulanut oranssiin. Tämä rintakuva
            erottuu jo itse: kermanvaalea takki ja valkoinen paita ovat
            vyön vaaleimmat pinnat muutenkin, ja niiden takana hehku näkyi
            vain sumeana laikkuna hahmon ympärillä.

            KAKSI NEGATIIVISTA MARGINAALIA, ERI SYISTÄ. Alamarginaali
            asettaa leikkauskohdan vyön alareunaan (alla). Ylämarginaali
            taas pienentää sitä tilaa, jonka kuva varaa taitossa: ilman
            sitä iso hahmo vain kasvattaisi vyön korkeutta eikä ylittäisi
            sen yläreunaa koskaan. Nyt korvat nousevat hännänvedon yli.

            ALAMARGINAALI ON TARKOITUKSELLINEN. Kuva on
            rintakuva, joka päättyy rintaan — vapaasti leijuessaan se
            näyttäisi poikki leikatulta. Kun se vedetään vyön oman
            alapehmusteen verran alas (`py-24` = `-mb-24`, `md:py-28` =
            `md:-mb-28`), leikkauskohta osuu tasan vyön alareunaan ja
            hahmo lukee siltä, että se nousee vyön takaa esiin.
          */}
          <div className="relative z-20 -mb-24 shrink-0 self-end md:-mb-28 md:-mt-40">
            {/*
              `!h-` on tarkoituksellinen: FoxSlot asettaa korkeuden
              tyylimääreenä, ja vain !important-luokka voi kääntää sen
              näyttökoon mukaan. Mobiilissa hahmo pysyy maltillisena,
              leveällä ruudulla se nousee vyön yli.
            */}
            <FoxSlot id="footer" height={500} className="!h-[300px] md:!h-[500px]" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
