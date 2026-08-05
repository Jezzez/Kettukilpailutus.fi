"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf, Star, Tag, TrendingDown, TrendingUp, Zap } from "lucide-react";
import type { ElectricityPlan } from "@/lib/energy";
import { annualCost, normalAnnualCost, TYPE_LABEL } from "@/lib/energy";
import AffiliateButton from "../AffiliateButton";
import FoxPaw from "../FoxPaw";

export type PlanBadge = { kind: "cheapest" | "fox"; note?: string } | null;

/**
 * Hintarivien luvut aina kahdella desimaalilla.
 *
 * `toLocaleString` pudottaa turhat nollat, joten sama kortti saattoi näyttää
 * "0,40 c/kWh" ominaisuuslistassa ja "0,4 c/kWh" hintataulukossa. Vertailussa
 * epätasainen desimaali luetaan huolimattomuutena, ja huolimaton hintataulukko
 * on juuri se, joka saa kävijän tarkistamaan luvut muualta.
 */
function money(n: number): string {
  return n.toLocaleString("fi-FI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

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
  compareDiff = null,
  minCost,
  maxCost,
  rank,
}: {
  plan: ElectricityPlan;
  kwh: number;
  badge?: PlanBadge;
  /**
   * Ero käyttäjän nykyiseen sopimukseen euroina vuodessa.
   * Positiivinen = tämä on halvempi. `null` = käyttäjä ei ole kertonut
   * nykyistä hintaansa, jolloin vertailua ei ole olemassa eikä sitä
   * keksitä listan kalleimmasta.
   */
  compareDiff?: number | null;
  /** Listan halvin vuosihinta. Hintapalkin nollakohta. */
  minCost: number;
  maxCost: number;
  /** Sijaluku valitussa järjestyksessä. Ks. perustelu logopalkin kommentissa. */
  rank?: number;
}) {
  const yearly = annualCost(plan, kwh);
  const monthly = yearly / 12;

  /*
    HINTAPALKKI KÄÄNNETTIIN: PITKÄ PALKKI = HALPA.

    Palkki näytti aiemmin hinnan osuutta kalleimmasta, eli KALLEIN kortti
    sai pisimmän palkin. Jokaisessa muussa käyttöliittymässä maailmassa
    täysi palkki tarkoittaa hyvää tulosta, joten palkki luki päinvastoin
    kuin se oli tarkoitettu — ja väärinpäin luettu kaavio on huonompi
    kuin ei kaaviota lainkaan, koska se johtaa harhaan sekunnin ajan.

    Nyt palkki on halvimman hinnan suhde tämän kortin hintaan: halvin
    saa täyden palkin, kaksi kertaa kalliimpi puolikkaan. Kun lista on
    hintajärjestyksessä, palkit lyhenevät alaspäin mentäessä — silloin
    palkkia ei tarvitse selittää, se opettaa itsensä kahdessa
    sekunnissa. Sitä varten palkki on olemassa: silmä vertaa pituuksia
    nopeammin kuin kuutta euromäärää.
  */
  const barWidth = Math.max(8, Math.round((minCost / yearly) * 100));

  /*
    ERO NYKYISEEN NÄKYY JOKAISESSA KORTISSA — MYÖS SILLOIN KUN SE ON HUONO.

    Aiemmin luku näytettiin vain jos sopimus oli halvempi kuin asiakkaan
    nykyinen. Se tarkoitti kahta ongelmaa. Ensinnäkin luku oli vain
    osassa kortteja, jolloin korttien sisältö oli eri korkeudella eikä
    hintoja voinut enää silmäillä vaakasuoraan. Toiseksi kalliimman
    sopimuksen kortti oli hiljaa juuri siitä tiedosta, joka asiakasta
    kiinnostaa — ja vaikeneminen huomataan.

    Kun kaikki 24 korttia kertovat eron samassa kohdassa, listasta tulee
    työkalu eikä myyntiesite. Se on tämän sivuston ainoa kilpailuetu:
    kävijä uskoo luvut, koska ne eivät kaikki osoita samaan suuntaan.
  */
  const diffMonthly = compareDiff === null ? null : compareDiff / 12;

  /*
    KAIKKI KORTIT OVAT ORANSSEJA — JÄRJESTYS TEHDÄÄN NAUHALLA, EI POHJAVÄRILLÄ.

    Aiemmin vain halvin kortti oli oranssi ja loput vaaleita. Kun koko
    ruudukko on oranssi, pohjaväri ei enää erota mitään, joten kortin
    rooli on siirrettävä johonkin muuhun. Se on nyt kortin ylin nauha:
    kerma = edullisin, kulta = Ketun valinta, ei nauhaa = tavallinen.
    Kaksi nauhaa kahdellakymmenellänejällä kortilla erottuu oranssista
    yhtä hyvin kuin yksi oranssi kortti erottui vaaleista — ja lisäksi
    nauhassa lukee SYY, jota pelkkä väri ei kertonut.

    OSTONAPPI: oranssi nappi oranssilla kortilla katoaisi pohjaansa,
    joten jokaisen kortin nappi on nyt kermanvalkoinen (`inverse` +
    `theme-light`). Se on kortin kirkkain piste, eli juuri se, mihin
    silmä päätyy. Tämä on koko muutoksen ainoa oikea riski: kun kaikki
    napit ovat yhtä kirkkaita, mikään ei ohjaa ylöspäin listalla.
    Sijaluku logon vieressä ja hintapalkki tekevät sen työn nyt yksin.

    EMBER-ANSA: `theme-ember` kääntää `bg-white`-luokan oranssiksi ja
    `text-accentDark`-luokan vaaleaksi kermaksi. Koska kortteja ei ole
    enää yhtään vaaleaa, jokainen aidosti valkoista pohjaa tarvitseva
    kohta — yhtiön logo, kettukuva, ostonappi — on käärittävä
    `theme-light`-luokkaan.
  */
  const cheapest = badge?.kind === "cheapest";
  const foxPick = badge?.kind === "fox";

  /*
    KAMPANJA — KUMPPANIN OMA TARJOUS KORTIN YLÄKULMASSA.

    Kampanja on ainoa tieto kortissa, jolla on takaraja. Hinta, marginaali
    ja määräaika ovat voimassa ensi kuussakin, mutta "perusmaksu 0 € kolme
    kuukautta" on syy tehdä sopimus tänään eikä joskus. Vertailusivun
    tuotto syntyy vasta klikistä, ja klikin suurin este on lykkääminen —
    siksi juuri tämä tieto ansaitsee kortin näkyvimmän kohdan.

    Merkki on kumppanin oma tarjous, ei Ketun kannanotto. Siksi siinä ei
    ole tassua: tassu on varattu Ketun omille väitteille, ja jos sama
    merkki esiintyisi sähköyhtiön mainoksessa, koko tassun merkitys
    laimenisi. Lipputikku (Tag) lukee tarjoukseksi ilman selitystä.
  */
  const campaign = plan.campaign ?? null;

  /* Kampanjan jälkeinen kuukausihinta. Iso euroluku kortissa on
     ENSIMMÄISEN VUODEN keskiarvo kampanja mukaan luettuna, eli se on
     kampanjakorteissa pienempi kuin pysyvä hinta. Ilman tätä lukua
     kortti lupaisi hinnan, joka nousee ilman varoitusta — ja juuri se
     on se pettymys, joka menettää asiakkaan ja tuo valituksen. */
  const normalMonthly = campaign ? normalAnnualCost(plan, kwh) / 12 : null;

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
      /*
        KÄRKIKORTIN KEHYS.

        Kaikki kortit ovat oranssia, joten ykkösen piti erottua jollain
        muulla kuin pohjavärillä. Kermanvalkoinen rengas kehyksen
        ulkopuolella on kirkkain arvo koko ruudukossa heti ostonapin
        jälkeen, eikä se muuta kortin kokoa — reunan paksuntaminen olisi
        siirtänyt ykköskortin sisällön pikselin muita alemmas ja
        rikkonut sen vaakalinjan, jolla hintoja verrataan.

        Rengas seuraa SIJAA eikä merkkiä: se kertoo "tämä on ensimmäinen
        valitsemassasi järjestyksessä". Uusia värejä ei tullut yhtään.
      */
      className={`lift theme-ember ember-surface group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-cardHover ${
        rank === 1 ? "ring-2 ring-cream/45" : ""
      } ${
        cheapest
          ? "border-cream/70 hover:border-cream"
          : foxPick
            ? "border-gold hover:border-gold"
            : "border-line hover:border-cream/55"
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

        YKSI PALKKI, KAKSI TIETOA: MERKKI VASEMMALLA, KAMPANJA OIKEALLA.

        Palkkeja oli aiemmin yksi kolmesta vaihtoehdosta (kerma, kulta,
        tyhjä). Kampanjamerkki ei mahtunut niiden rinnalle omaksi
        neljänneksi palkiksi rikkomatta 44 pikselin sääntöä, joten palkki
        on nyt yksi rivi, jonka vasen puoli kertoo Ketun merkin ja oikea
        kumppanin tarjouksen. Korkeus pysyy samana kaikissa neljässä
        yhdistelmässä.

        Kun kortissa on sekä merkki että kampanja, vasen teksti lyhenee
        ("Edullisin"), koska katkaistu merkki lukee virheenä. Kampanja ei
        lyhene: se on se lause, jonka takia kortti klikataan.
      */}
      <div
        className={`flex h-10 items-center gap-2 px-3.5 sm:px-4 ${
          cheapest ? "bg-cream" : foxPick ? "bg-gold" : "border-b border-white/10 bg-black/10"
        }`}
      >
        {/* Kermanauha, ei kirkkaanoranssi: oranssi nauha oranssilla
            kortilla olisi kaksi lähes samaa sävyä päällekkäin. */}
        {cheapest && (
          <p className="flex min-w-0 items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-[#A83E0A]">
            <Zap size={12} className="shrink-0" aria-hidden />
            <span className="truncate">{campaign ? "Edullisin" : "Edullisin kulutuksellasi"}</span>
          </p>
        )}
        {foxPick && (
          <div className="flex min-w-0 items-center gap-2.5">
            {/*
              KULTAINEN TASSU TUMMALLA LAATALLA — EI TASSUA SUORAAN NAUHALLE.

              Nauha on kultaa, joten kultainen tassu suoraan sen päällä olisi
              kaksi samaa sävyä päällekkäin eli näkymätön. Tumma pyöreä laatta
              antaa tassulle taustan, ja samalla merkki alkaa lukea sinettinä
              eikä ikonina — juuri sitä se on. Kilpailijat rakentavat saman
              luottamuksen kolmannen osapuolen sertifikaateilla (TÜV, eKomi),
              joita Ketulla ei ole eikä niitä keksitä. Oma sinetti on ainoa
              rehellinen tapa saada sama visuaalinen paino.

              Tassu on sivuston yleinen allekirjoitus: sama muoto toistuu
              jokaisen kortin ominaisuusriveillä, joten lukija on jo oppinut,
              että tassun vieressä oleva väite on Ketun oma kannanotto eikä
              sähköyhtiön markkinointitekstiä.
            */}
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#4A2E06] text-gold shadow-[0_1px_2px_rgba(74,26,2,0.4)]">
              <FoxPaw size={15} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-[11px] font-bold uppercase leading-none tracking-[0.14em] text-[#4A2E06]">
                Ketun valinta
              </p>
              {/*
                PERUSTELU HETI MERKIN ALLA, EI RIVIN OIKEASSA REUNASSA.

                Oikeassa reunassa se katosi mobiilissa kokonaan ja työpöydällä
                se luki niin kaukana merkistä, ettei sitä yhdistetty siihen.
                Vertailusivun yleisin epäily on "onko tämä nosto ostettu?", ja
                siihen pitää vastata siinä sekunnissa kun epäily syntyy.

                Tässä lukee lopputulos, ei kaava. Painotus (ensimmäinen vuosi
                50 %, kampanjan jälkeinen hinta 50 %) on auki sivun
                läpinäkyvyysosiossa — se on se paikka, josta epäilevä lukija
                sen etsii, ja kahden luvun lukeminen kortin merkistä hidasti
                kaikkia muita.
              */}
              <p className="mt-1 truncate font-data text-[10.5px] font-bold leading-none text-[#5C3A08]">
                Halvin myös kampanjan jälkeen
              </p>
            </div>
          </div>
        )}
        {campaign && (
          /*
            KERMANVALKOINEN LAATTA TUMMALLA PALKILLA, TUMMA VAALEALLA.

            Tyhjä palkki on tarkoituksella tummennettu, jotta merkitön
            kortti ei saisi merkkiä. Kampanjamerkki saa silti olla kirkas:
            se EI ole koristeraita vaan kortin ainoa aikarajattu tieto,
            joten sen lukeminen merkiksi on oikein.
          */
          <span
            className={`ml-auto flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-display text-[10.5px] font-bold leading-none ${
              cheapest || foxPick ? "bg-[#4A2E06] text-cream" : "bg-cream text-[#A83E0A]"
            }`}
            title={campaign.limit ? `Tarjous: ${campaign.limit}` : "Kumppanin oma tarjous"}
          >
            <Tag size={11} className="shrink-0" aria-hidden />
            {campaign.label}
          </span>
        )}
      </div>

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
      <div className="flex items-center gap-2.5 border-b border-line bg-black/10 px-3.5 py-2.5 sm:px-4">
        {rank !== undefined && (
          /*
            KOLME KÄRKISIJAA EROTTUVAT — VALOARVOLLA, EI MITALEILLA.

            Palkintopallin idea on oikea: kolmen kärki pitää lukea
            palkintosijoina eikä juoksevana numerointina. Mitaliemojit
            🥇🥈🥉 eivät silti käy. Ne ovat käyttöjärjestelmän omia
            värikuvakkeita, eli ne näyttävät erilaisilta jokaisella
            laitteella eikä niiden väreihin voi vaikuttaa — punaiset
            nauhat ja harmaa hopea toisivat sivulle kolme uutta väriä
            kahden sallitun rinnalle. Emoji lukee myös leikkisänä, ja
            21 numeroa kolmen emojin perässä näyttäisi virheeltä.

            Sama järjestys tehdään siis kirkkaudella: 1. täysi kerma,
            2. vahva kermareunus, 3. himmeä kermareunus, loput vaimeat.
            Kolme kärkeä erottuu yhdellä silmäyksellä, ilme pysyy
            aikuisena eikä uusia värejä tule yhtään.
          */
          <span
            className={`grid shrink-0 place-items-center rounded-lg font-data font-extrabold tabular-nums ${
              rank === 1
                ? "h-7 w-7 bg-cream text-[13px] text-[#A83E0A] shadow-[0_1px_3px_rgba(74,26,2,0.35)]"
                : rank === 2
                  ? "h-6 w-6 border border-cream/60 bg-black/15 text-[12px] text-cream"
                  : rank === 3
                    ? "h-6 w-6 border border-cream/35 bg-black/15 text-[12px] text-cream/85"
                    : "h-6 w-6 border border-cream/15 bg-black/15 text-[12px] text-cream/60"
            }`}
            aria-hidden
          >
            {rank}
          </span>
        )}
        <ProviderLogo provider={plan.provider} logo={plan.logo} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-[15px] font-bold leading-tight text-ink">
            <Link href={`/sahkosopimukset/sopimus/${plan.slug}`} className="underline-offset-4 hover:underline">
              {plan.provider}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-[12px] text-ink/60">{plan.name}</p>
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
      <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-3.5 py-2 sm:px-4">
        <span className="whitespace-nowrap rounded-md border border-cream/25 bg-black/15 px-2 py-0.5 text-[10.5px] font-semibold text-ink/80">
          {TYPE_LABEL[plan.type]}
          {plan.fixedTermMonths ? ` · ${plan.fixedTermMonths} kk` : ""}
        </span>
        {plan.green && (
          /* `theme-light`: ilman sitä tausta ja teksti olisivat ember-vyöllä
             molemmat vaaleaa kermaa, eli merkki olisi tyhjä laatikko. */
          <span className="theme-light inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-accent/25 bg-accentSoft px-2 py-0.5 text-[10.5px] font-semibold text-accentDark">
            <Leaf size={11} aria-hidden /> Uusiutuva
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
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
          {/* Ero nykyiseen ENNEN hintaa: se on ainoa luku, jota ei voi
              päätellä muualta kortista, ja se on syy lukea loput. */}
          {diffMonthly !== null && (
            <p
              className={`mb-2 inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[12px] ${
                diffMonthly > 0.5
                  ? "border-cream/45 bg-black/15 text-cream"
                  : "border-cream/15 bg-black/10 text-ink/65"
              }`}
            >
              {diffMonthly > 0.5 ? (
                <>
                  <TrendingDown size={13} className="shrink-0" aria-hidden />
                  <span>
                    Säästät{" "}
                    <strong className="font-data font-bold">
                      {diffMonthly.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} €
                    </strong>{" "}
                    / kk nykyiseen verrattuna
                  </span>
                </>
              ) : diffMonthly < -0.5 ? (
                <>
                  <TrendingUp size={13} className="shrink-0" aria-hidden />
                  <span>
                    <strong className="font-data font-bold">
                      {Math.abs(diffMonthly).toLocaleString("fi-FI", { maximumFractionDigits: 0 })} €
                    </strong>{" "}
                    / kk kalliimpi kuin nykyinen
                  </span>
                </>
              ) : (
                <span>Käytännössä sama hinta kuin nyt</span>
              )}
            </p>
          )}

          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-data font-price text-[30px] font-extrabold leading-none tracking-[-0.03em] text-ink">
              {monthly.toLocaleString("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} €
            </span>
            <span className="font-display text-[13px] font-semibold text-ink/60">/ kk</span>
          </div>

          <div
            className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-black/20"
            role="img"
            aria-label={`Hinta suhteessa listan halvimpaan: mitä pidempi palkki, sitä halvempi sopimus. Tämä ${barWidth} prosenttia täydestä.`}
            title="Mitä pidempi palkki, sitä halvempi sopimus"
          >
            <div
              className="h-full rounded-full bg-cream transition-all duration-500"
              style={{ width: `${barWidth}%` }}
            />
          </div>

          {/* Vuosihinta JA sen alkuperä samalla rivillä. Pelkkä
              "168 € vuodessa" luetaan yleisenä listahintana; ilman
              lukua taas katoaa se summa, jolla sopimuksia oikeasti
              vertaillaan. Rivi sanoo molemmat eikä vie ylimääräistä
              korkeutta. */}
          <p className="mt-2 text-[12px] text-ink/60">
            {yearly.toLocaleString("fi-FI", { maximumFractionDigits: 0 })} € vuodessa
            <span className="mx-1.5 text-cream/40" aria-hidden>·</span>
            {campaign ? "ensimmäinen vuosi kampanjoineen" : "laskettu kulutuksellasi"}
          </p>

          {/*
            KAMPANJAN JÄLKEINEN HINTA SANOTAAN HETI ISON LUVUN ALLA.

            Iso euroluku on ensimmäisen vuoden keskiarvo, jossa kampanja
            on mukana. Kampanjakortissa se on siis pienempi kuin hinta,
            jonka asiakas maksaa vuoden kuluttua. Jos kortti näyttäisi
            pelkän kampanjaluvun, se voittaisi vertailun tarjouksella ja
            asiakas huomaisi eron vasta laskusta — se on yksi peruutus,
            yksi menetetty palkkio ja yksi asiakas, joka ei palaa. Kolmen
            kuukauden tarjous ei saa ostaa ykköspaikkaa hiljaisuudella.

            Rajoitus ("vain uusille asiakkaille") on samalla rivillä:
            se on ainoa asia, joka voi tehdä koko tarjouksesta lukijalle
            mahdottoman, ja sen lukeminen vasta kumppanin sivulta on
            hukkaan mennyt klikki molemmille osapuolille.
          */}
          {campaign && normalMonthly !== null && (
            <p className="mt-1 text-[12px] text-ink/60">
              Kampanjan jälkeen{" "}
              <span className="font-data font-bold text-ink/80">
                {normalMonthly.toLocaleString("fi-FI", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}{" "}
                €
              </span>{" "}
              / kk
              {campaign.limit ? (
                <>
                  <span className="mx-1.5 text-cream/40" aria-hidden>·</span>
                  {campaign.limit}
                </>
              ) : null}
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

        <dl className="mt-3.5 space-y-1.5 rounded-xl border border-line bg-black/10 p-3">
          <div className="flex justify-between text-[12px]">
            <dt className="text-ink/60">{plan.type === "spot" ? "Marginaali" : "Energia"}</dt>
            <dd className="font-data font-bold text-ink">
              {plan.type === "spot"
                ? `${money(plan.spotMargin ?? 0)} c/kWh + pörssi`
                : `${money(plan.energyPrice ?? 0)} c/kWh`}
            </dd>
          </div>
          <div className="flex justify-between text-[12px]">
            <dt className="text-ink/60">Perusmaksu</dt>
            <dd className="font-data font-bold text-ink">{money(plan.basicFee)} €/kk</dd>
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
        <ul className="mt-3 flex-1 space-y-1">
          {plan.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-2 text-[12.5px] leading-snug text-ink/80">
              <span className="mt-[3px] shrink-0 text-cream/75" aria-hidden>
                <FoxPaw />
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/*
          TÄHTIRIVI NÄKYY VAIN JOS ARVIO ON OLEMASSA.

          Kumppaniyhtiöille ei ole riippumatonta arviolähdettä, joten
          niiden `rating` on `null`. Keksitty 4,6 tähteä olisi kortin
          halvin tapa näyttää luotettavalta ja samalla ainoa väite, jonka
          lukija voi kumota yhdellä haulla — ja kun yksi luku paljastuu
          keksityksi, myös hinnat lakkaavat kelpaamasta. Sivuston koko
          ansaintalogiikka on siinä, että luvut kestävät tarkistuksen.

          Kun arviota ei ole, rivin vasen puoli jää tyhjäksi ja "Tiedot"
          siirtyy oikeaan reunaan `justify-between`-säännön mukaan. Rivin
          korkeus säilyy, joten korttien vaakalinja ei liiku.
        */}
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
          {plan.rating !== null ? (
            <p className="flex items-center gap-1 text-[12px] text-ink/60">
              <Star size={13} className="fill-star text-star" aria-hidden />
              <span className="font-data font-bold text-ink">{plan.rating.toFixed(1)}</span>
              {plan.reviews !== null ? ` (${plan.reviews})` : ""}
            </p>
          ) : (
            /* Tarkistuspäivä arvion tilalla: se on tieto, joka on
               oikeasti olemassa, ja se vastaa kortin toiseksi yleisimpään
               epäilyyn ("onko tämä hinta vanha?"). */
            <p className="text-[12px] text-ink/55">
              {plan.checkedAt
                ? `Hinta tarkistettu ${new Date(plan.checkedAt).toLocaleDateString("fi-FI")}`
                : ""}
            </p>
          )}
          <Link
            href={`/sahkosopimukset/sopimus/${plan.slug}`}
            className="text-[12.5px] font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
          >
            Tiedot
          </Link>
        </div>

        {/*
          NAPIN TEKSTI KERTOO, MITÄ KLIKKI OIKEASTI TEKEE.

          "Tee sopimus" on kumppanilinkki, josta Kettu saa palkkion.
          Sopimukselle, jonka yhtiön kanssa ei ole kumppanuutta, sama
          teksti lupaisi tilausputken, jota linkin päässä ei ole.
          Neutraali teksti pitää listan avoinna myös yhtiöille, jotka
          eivät maksa — ja juuri se on ainoa syy uskoa, ettei järjestystä
          ole ostettu. Vertailu, joka näyttää vain maksavat yhtiöt, on
          mainos, ja mainokselta ei kysytä neuvoa toista kertaa.
        */}
        <div className="theme-light mt-2.5">
          <AffiliateButton
            href={plan.affiliateUrl}
            cardId={plan.id}
            placement="energy-grid"
            variant="inverse"
            className="w-full"
          >
            {plan.partner ? "Tee sopimus" : "Siirry palveluntarjoajalle"}
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
      <span className="theme-light grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white p-1.5">
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
      className="theme-light grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-mist font-display text-[13px] font-bold tracking-tight text-ink/55"
      title={provider}
      aria-hidden
    >
      {initials}
    </span>
  );
}
