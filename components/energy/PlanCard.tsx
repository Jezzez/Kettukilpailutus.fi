"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf, Star, Zap } from "lucide-react";
import type { ElectricityPlan } from "@/lib/energy";
import { annualCost, TYPE_LABEL } from "@/lib/energy";
import AffiliateButton from "../AffiliateButton";
import FoxPaw from "../FoxPaw";

export type PlanBadge = { kind: "cheapest" | "fox"; note?: string } | null;

/**
 * Sähkösopimuskortti.
 *
 * Hintapalkki on ymmärrettävyyden ydin: silmä vertaa palkkien pituuksia
 * hetkessä, kun taas kuuden euromäärän vertailu vaatii lukemista.
 * Säästöluku kertoo ensisijaisesti eron KÄYTTÄJÄN nykyiseen sopimukseen —
 * vertailu listan kalleimpaan on vain varajärjestely.
 */
export default function PlanCard({
  plan,
  kwh,
  badge = null,
  savings = 0,
  savingsLabel = "",
  maxCost,
  rank,
}: {
  plan: ElectricityPlan;
  kwh: number;
  badge?: PlanBadge;
  savings?: number;
  savingsLabel?: string;
  maxCost: number;
  /** Sijaluku valitussa järjestyksessä. Ks. perustelu logopalkin kommentissa. */
  rank?: number;
}) {
  const yearly = annualCost(plan, kwh);
  const monthly = yearly / 12;
  const barWidth = Math.max(8, Math.round((yearly / maxCost) * 100));

  /*
    YKSI KORTTI KUUDESTA ON ORANSSI — EI KAIKKI.

    Oranssi kortti on listan vahvin katseankkuri, ja siksi se annetaan
    sille kortille, jonka haluamme klikattavan: halvimmalle käyttäjän
    omalla kulutuksella. Kun kaikki kuusi olisivat oransseja, väri ei
    enää erottaisi mitään — ja pahempaa: "Tee sopimus" -nappi on
    oranssi, joten oranssilla kortilla se katoaisi pohjaansa. Sivun
    ainoa ostonappi vaihdettaisiin heikommaksi vain, jotta lista
    näyttäisi värikkäämmältä. Väärä vaihtokauppa.

    Tällä kortilla nappi on siis kermanvalkoinen (`inverse` +
    `theme-light`), jolloin se on koko listan kirkkain piste — juuri
    siinä kortissa, jonka klikkaus tuottaa eniten.

    EMBER-ANSA: `theme-ember` kääntää `bg-white`-luokan oranssiksi ja
    `text-accentDark`-luokan vaaleaksi kermaksi. Alla merkityt kohdat
    ovat ne, joissa käännös olisi rikkonut jotain: yhtiön logo tarvitsee
    aidosti valkoisen pohjan, ja "Uusiutuva"-merkki olisi ollut kermaa
    kermalla eli näkymätön.
  */
  const ember = badge?.kind === "cheapest";

  return (
    /*
      Nosto tulee yhteisestä `.lift`-säännöstä (globals.css), ei kortin
      omasta `transition-all duration-300` -määrittelystä. Kortilla oli
      oma ajoitus, laskurilla toinen ja oppailla kolmas — eri nopeuksilla
      liikkuva sivu tuntuu tehdyltä eri käsillä, ja juuri se on se
      "ei ole sulava" -vaikutelma. Yksi sääntö, yksi nopeus, koko sivusto.
      `.lift` kunnioittaa myös `prefers-reduced-motion`-asetusta.
    */
    <article
      className={`lift group relative flex h-full flex-col overflow-hidden rounded-2xl border ${
        ember
          ? "theme-ember ember-surface border-line shadow-cardHover hover:border-cream/55"
          : badge?.kind === "fox"
            ? "bg-white border-lineDark shadow-cardHover hover:border-accent/35"
            : "bg-white border-line shadow-card hover:border-accent/35"
      }`}
    >
      {/*
        MERKKIPALKKI ON AINA 44 PIKSELIÄ KORKEA — MYÖS TYHJÄNÄ.

        Kaksi korttia kuudesta saa merkin. Jos merkitön kortti jättää
        palkin kokonaan pois, sen sisältö nousee palkin verran ylemmäs,
        ja kuuden kortin hintaluvut asettuvat kolmelle eri vaakalinjalle.
        Vertailu tehdään pyyhkäisemällä katse rivin yli: kun luvut ovat
        samalla linjalla, erot lukee pysähtymättä; kun eivät, jokainen
        kortti pitää lukea erikseen. Tyhjä palkki maksaa 44 pikseliä
        korkeutta ja ostaa sillä koko listan luettavuuden.
      */}
      {ember ? (
        /* Kermanauha, ei kirkkaanoranssi: oranssi nauha oranssilla
           kortilla olisi kaksi lähes samaa sävyä päällekkäin. */
        <div className="flex h-11 items-center bg-cream px-5">
          <p className="flex items-center gap-1.5 font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#A83E0A]">
            <Zap size={12} aria-hidden /> Edullisin kulutuksellasi
          </p>
        </div>
      ) : badge?.kind !== "fox" ? (
        <div className="h-11 border-b border-line bg-mist/40" aria-hidden />
      ) : null}
      {/*
        "KETUN VALINTA" -SINETTI.

        MIKSI SINETIN MUOTOINEN: kilpailijoilla (Verivox, sahkon-kilpailutus.fi)
        luottamus rakennetaan kolmannen osapuolen sertifikaateilla — TÜV, eKomi,
        tähtiarviot. Kettu ei voi näyttää niitä, koska niitä ei ole, eikä niitä
        keksitä. Ainoa rehellinen tapa saada sama visuaalinen paino on antaa
        Ketulle OMA sinetti ja painaa sen kriteeri näkyviin viereen.

        MIKSI KRITEERI ON SINETISSÄ ITSESSÄÄN: sertifikaatti, jonka mittari
        lukee merkin vieressä, on vahvempi kuin sertifikaatti, jonka mittarin
        joutuu etsimään. Se vastaa vertailusivujen yleisimpään epäilyyn —
        "onko tämä nosto ostettu?" — siinä sekunnissa kun epäily syntyy, eikä
        vasta sivun alalaidan läpinäkyvyysosiossa. Mobiilissa kaava jää pois,
        koska siellä tila menisi yhtiön nimeltä; sama kaava on auki
        läpinäkyvyysosiossa.

        Kultareunus erottaa merkin oranssista "Edullisin" -merkistä. Ne
        tarkoittavat eri asiaa, joten ne eivät saa näyttää samalta: oranssi on
        laskennan tulos, kulta on Ketun oma kannanotto.
      */}
      {badge?.kind === "fox" && (
        <div className="flex h-11 items-center gap-2.5 border-b border-gold/30 bg-gold/[0.09] px-4 sm:px-5">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold/55 bg-white text-goldInk">
            <FoxPaw size={12} />
          </span>
          <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.14em] text-goldInk">
            Ketun valinta
          </p>
          <span className="ml-auto hidden whitespace-nowrap font-data text-[10.5px] font-semibold text-ink/50 sm:block">
            hinta 72 % · arvio 28 %
          </span>
        </div>
      )}

      {/*
        LOGOPALKKI — kortin ylin rivi.

        MIKSI OMANA PALKKINAAN: sähkövertailussa yhtiö tunnistetaan logosta
        nopeammin kuin nimestä, ja tunnistettu yhtiö madaltaa kynnystä painaa
        "Tee sopimus" -nappia. Tuntematon nimi taas saa kävijän poistumaan
        googlaamaan yhtiötä muualle — ja se kävijä ei useimmiten palaa.
        Omalla pinnalla ja alarajalla palkki toimii samalla ankkurina: kun
        kuusi korttia alkaa samalla vaakaraidalla, silmä löytää rivin alun
        ilman että sen tarvitsee lukea mitään.

        Logo on valkoisella laatalla ja `object-contain`: yhtiöiden logot on
        tehty valkoiselle pohjalle ja ne on säilytettävä sellaisina.
        Rajaaminen tai värjääminen olisi tavaramerkin vääristämistä.

        SIJALUKU logon edessä: ilman numeroa kuusi samannäköistä korttia
        näyttää sekalaiselta listalta, ja kävijä alkaa epäillä, onko järjestys
        maksettu. Numero tekee järjestyksen näkyväksi — ykkönen on ykkönen
        valitulla mittarilla, ja kutonen kertoo, ettei alaspäin selaamalla
        löydy halvempaa. Se lyhentää harkintaa ja vie klikin ylös listalle.
      */}
      <div className="flex items-center gap-3 border-b border-line bg-mist/70 px-4 py-3 sm:px-5">
        {rank !== undefined && (
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-data text-[13px] font-extrabold tabular-nums ${
              rank === 1
                ? ember
                  ? "bg-cream text-[#A83E0A]"
                  : "bg-accent text-onEmber"
                : "border border-line bg-white text-ink/45"
            }`}
            aria-hidden
          >
            {rank}
          </span>
        )}
        <ProviderLogo provider={plan.provider} logo={plan.logo} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-[16px] font-bold leading-tight text-ink">
            <Link href={`/sahkosopimukset/sopimus/${plan.slug}`} className="underline-offset-4 hover:underline">
              {plan.provider}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-[12.5px] text-ink/60">{plan.name}</p>
        </div>
      </div>

      {/*
        MERKKIRIVI omalla rivillään logopalkin alla.

        Tyyppimerkki oli aiemmin logopalkin oikeassa reunassa, ja se söi
        nimeltä niin paljon tilaa, että kolmen kortin rivillä luki
        "LämpöVoi…" ja "Vihreä Sä…". Katkaistu yhtiön nimi on pahempi kuin
        merkin siirtäminen: tunnistamaton yhtiö on juuri se, jonka kohdalla
        kävijä lähtee googlaamaan eikä palaa. Omalla rivillään merkit myös
        asettuvat samaan vaakalinjaan joka kortissa, jolloin sopimustyypin
        vertailu onnistuu silmäilemällä yhtä riviä.
      */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2.5 sm:px-5">
        <span className="whitespace-nowrap rounded-md border border-line bg-mist px-2 py-0.5 text-[11px] font-semibold text-ink/70">
          {TYPE_LABEL[plan.type]}
          {plan.fixedTermMonths ? ` · ${plan.fixedTermMonths} kk` : ""}
        </span>
        {plan.green && (
          /* `theme-light`: ilman sitä tausta ja teksti olisivat ember-vyöllä
             molemmat vaaleaa kermaa, eli merkki olisi tyhjä laatikko. */
          <span className="theme-light inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-accent/25 bg-accentSoft px-2 py-0.5 text-[11px] font-semibold text-accentDark">
            <Leaf size={11} aria-hidden /> Uusiutuva
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div>
          {/*
            YKSI DESIMAALI, EI PYÖRISTYSTÄ KOKONAISIIN EUROIHIN.

            Kokonaisina euroina 367 €/v ja 376 €/v näyttivät molemmat
            "31 €/kk". Silloin "Ketun valinta" -kortissa luki "ei halvin",
            vaikka sen hinta näytti täsmälleen samalta kuin halvimman —
            ja mobiilin tulospalkki väitti samaa lukua edullisimmaksi.
            Lukija, joka huomaa tuollaisen ristiriidan, ei enää usko
            muitakaan lukuja, ja juuri lukujen uskominen on tämän sivun
            koko ansaintalogiikka. Desimaali maksaa vähän silmää ja
            poistaa ristiriidan kokonaan.

            Sama tarkkuus on heron kärkiluvussa ja tulospalkissa —
            kolmen eri pyöristyksen näyttäminen olisi sama ongelma
            uudessa muodossa.
          */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-data font-price text-[38px] font-extrabold leading-none tracking-[-0.03em] text-ink">
              {monthly.toLocaleString("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} €
            </span>
            <span className="font-display text-[14px] font-semibold text-ink/60">/ kk</span>
          </div>

          <div className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${ember ? "bg-cream/25" : "bg-night"}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${ember ? "bg-cream" : "bg-ink/25"}`}
              style={{ width: `${barWidth}%` }}
            />
          </div>

          <p className="mt-2 text-[12.5px] text-ink/60">
            {yearly.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} € vuodessa
          </p>
          {savings > 0 && (
            <p className="mt-1 text-[12.5px] font-semibold text-accentDark">
              Säästät {savings.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} € {savingsLabel}
            </p>
          )}
        </div>

        {/*
          MERKIN PERUSTELU TULEE HINNAN JÄLKEEN, EI ENNEN SITÄ.

          Teksti oli aiemmin hintaluvun yläpuolella. Koska vain yhdessä
          kortissa kuudesta on perustelu, se työnsi juuri sen kortin
          hinnan noin kaksi riviä alemmas kuin naapureiden. Vertailu
          tehdään silmällä vaakasuoraan: kun kuusi jättinumeroa ovat
          samalla linjalla, hintaerot näkee pysähtymättä, ja poikkeava
          kortti luetaan eri kohdasta eli hitaammin. Hinta on kortin
          tärkein tieto, joten se lukitaan paikalleen ja perustelu
          siirtyy sen alle omaksi lainaukseksi.

          Reunaviiva vasemmalla erottaa perustelun laskennasta: se on
          Ketun mielipide, ei euromäärä.
        */}
        {badge?.note && (
          <p className="mt-3 border-l-2 border-gold/60 pl-3 text-[12px] leading-snug text-ink/70">
            {badge.note}
          </p>
        )}

        <dl className="mt-5 space-y-2 rounded-xl border border-line bg-mist p-3.5">
          <div className="flex justify-between text-[12.5px]">
            <dt className="text-ink/60">{plan.type === "spot" ? "Marginaali" : "Energia"}</dt>
            <dd className="font-data font-bold text-ink">
              {plan.type === "spot"
                ? `${plan.spotMargin?.toLocaleString("fi-FI")} c/kWh + pörssi`
                : `${plan.energyPrice?.toLocaleString("fi-FI")} c/kWh`}
            </dd>
          </div>
          <div className="flex justify-between text-[12.5px]">
            <dt className="text-ink/60">Perusmaksu</dt>
            <dd className="font-data font-bold text-ink">{plan.basicFee.toLocaleString("fi-FI")} €/kk</dd>
          </div>
        </dl>

        {/*
          Luettelomerkkinä ketun tassu, ei harmaa väkänen. Väkänen on sama
          merkki kuin jokaisella verkkokaupalla, joten silmä ohittaa sen.
          Tassu on brändin oma ele ja toistuu joka kortissa — se saa listan
          näyttämään Ketun suositukselta eikä tuotekuvauksen kopiolta.
          Sama tassu on "Ketun valinta" -merkissä, joten kahden välille
          syntyy yhteys ilman että sitä tarvitsee selittää.
        */}
        <ul className="mt-4 flex-1 space-y-1.5">
          {plan.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13px] leading-snug text-ink/80">
              <span className={`mt-[3px] shrink-0 ${ember ? "text-cream/75" : "text-accent/70"}`} aria-hidden>
                <FoxPaw />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
          <p className="flex items-center gap-1 text-[12px] text-ink/60">
            <Star size={13} className="fill-star text-star" aria-hidden />
            <span className="font-data font-bold text-ink">{plan.rating.toFixed(1)}</span> ({plan.reviews})
          </p>
          <Link
            href={`/sahkosopimukset/sopimus/${plan.slug}`}
            className="text-[13px] font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Tiedot
          </Link>
        </div>

        <div className={`mt-3 ${ember ? "theme-light" : ""}`}>
          <AffiliateButton
            href={plan.affiliateUrl}
            cardId={plan.id}
            placement="energy-grid"
            variant={ember ? "inverse" : "primary"}
            className="w-full"
          >
            Tee sopimus
          </AffiliateButton>
        </div>
      </div>
    </article>
  );
}

/**
 * Yhtiön logo — tai sen paikka, kunnes oikea logo on olemassa.
 *
 * Nykyiset yhtiöt ovat esimerkkidataa, joten logotiedostoja ei ole. Keksityn
 * logon piirtäminen olisi juuri sitä, mitä tämä sivusto ei tee: se antaisi
 * olemattomalle yhtiölle uskottavan ilmeen. Siksi ilman logoa näytetään
 * yhtiön nimikirjaimet neutraalilla laatalla — se on rehellinen paikanpitäjä
 * ja näyttää silti viimeistellyltä.
 *
 * Kun `logo`-kenttä täytetään `data/electricity.json`-tiedostoon, oikea kuva
 * ilmestyy tähän ilman muita muutoksia.
 */
function ProviderLogo({ provider, logo }: { provider: string; logo?: string }) {
  if (logo) {
    return (
      /* `theme-light`: yhtiöiden logot on tehty valkoiselle pohjalle. Ember-
         kortilla `bg-white` olisi oranssi ja logo vääristyisi — se olisi
         tavaramerkin väärinkäyttöä, ei tyylivalinta. */
      <span className="theme-light grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white p-1.5">
        <Image
          src={logo}
          alt={`${provider} logo`}
          width={96}
          height={96}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  const initials = provider
    .replace(/\b(Oy|Ab|Oyj)\b/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-mist font-display text-[15px] font-bold tracking-tight text-ink/45"
      title={provider}
      aria-hidden
    >
      {initials}
    </span>
  );
}
