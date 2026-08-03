import Image from "next/image";
import BrushRule from "./BrushRule";

/**
 * "Kettu sanoo" — maskotin väliintulo osioiden välissä.
 *
 * MIKSI TÄMÄ ON SIVUSTOLLA:
 * Kettu oli tähän asti vain kuva heroissa. Maskotti, joka ei sano mitään,
 * on koriste; maskotti, joka sanoo jotain hyödyllistä, on brändi. Nämä
 * repliikit ovat kuivaa asiantuntijahuumoria — ei vitsailua vaan
 * hyväntuulista suoruutta, jossa jokainen lause sisältää oikean tiedon.
 *
 * SÄVYSÄÄNTÖ (kohdeyleisö 40–60 v):
 * Kettu on kokenut ammattilainen, joka on nähnyt kaikki sopimusehdot eikä
 * enää hämmästy mistään. Ei huutomerkkejä, ei sanaleikkejä väkisin, ei
 * "hei sinä!" -myyntipuhetta. Jos repliikistä poistaa vitsin ja jäljelle
 * ei jää mitään hyödyllistä, repliikki on väärä.
 *
 * TUOTTO: tämä on luottamuselementti, ei myyntielementti. Se saa lukijan
 * uskomaan, että sivuston takana on joku joka tietää mistä puhuu — mikä on
 * juuri se, mikä erottaa klikin ja poistumisen toisistaan.
 */
export default function FoxSays({
  quote,
  note,
  className = "",
}: {
  quote: string;
  note?: string;
  className?: string;
}) {
  return (
    <aside className={`mx-auto max-w-[1180px] px-4 sm:px-6 ${className}`}>
      <div className="flex items-start gap-4 rounded-2xl border border-line bg-white/70 p-5 shadow-card backdrop-blur sm:gap-5 sm:p-6">
        {/*
          Kuva on läpinäkyvätaustainen kettu, ei valokuva. `object-cover`
          leikkasi korvat pois ja `rounded-full` ei rajannut mitään, koska
          taustaa ei ole — jälki näytti vahingossa rajatulta. Nyt kuvan takana
          on lämmin kiekko ja kettu on `object-contain`, jolloin korvat
          nousevat kiekon yli. Tarkoituksellinen ele, ei tapaturma.
        */}
        <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accentSoft ring-1 ring-accent/15 sm:h-16 sm:w-16">
          <Image
            src="/kettu-naama.webp"
            alt="Kettu"
            width={852}
            height={935}
            className="relative -mt-2 h-[3.7rem] w-auto object-contain drop-shadow-[0_6px_10px_rgba(60,45,30,0.18)] sm:-mt-2.5 sm:h-[4.3rem]"
          />
        </span>
        {/*
          Rivin pituus rajattu. Yli sadan merkin rivi on työläs lukea, ja juuri
          tämä repliikki on se kohta, jossa epäröivä lukija saa syyn luottaa
          lukuihin — sitä ei kannata haudata raskaaseen riviin.
        */}
        <div className="min-w-0 max-w-[68ch]">
          <p className="flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-accentDark">
            Kettu sanoo
            <BrushRule width={38} className="text-accent/60" />
          </p>
          <p className="mt-1.5 font-display text-[15.5px] font-semibold leading-snug text-ink sm:text-[16.5px]">
            {quote}
          </p>
          {note && (
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/70">{note}</p>
          )}
        </div>
      </div>
    </aside>
  );
}
