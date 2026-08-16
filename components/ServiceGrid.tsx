import Link from "next/link";
import { ArrowRight, Plug, Wallet, CreditCard } from "lucide-react";
import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import { FEATURES } from "@/lib/features";
import { ENERGY_COMPARE } from "@/lib/nav";

/**
 * PALVELUVALIKOIMA — ETUSIVUN OSIO, EI OMA SIVU.
 *
 * MIKSI OSIO EIKÄ `/palvelut`: brändihaulla ("kettukilpailutus") Google
 * näyttää sen sivun, joka on osoitteessa `/`. Alasivu ei nouse etusivun
 * ohi omalla brändinimellä, joten erillinen hub-sivu ei olisi ratkaissut
 * sitä ongelmaa jota varten se olisi tehty. Sen sijaan se olisi vienyt
 * sähkövertailun pois vahvimmasta osoitteesta ja lisännyt yhden klikin
 * jokaisen kävijän ja laskurin väliin.
 *
 * MIKSI TÄMÄ ON SIVUN LOPUSSA EIKÄ ALUSSA: tämä on ainoa etusivun osio,
 * joka linkittää pois sähkösuppilosta. Ylhäällä se kilpailisi laskurin
 * kanssa ja maksaisi klikkejä. Täällä se tavoittaa lukijan, joka on jo
 * ohittanut laskurin, askeleet ja UKK:n — eli ihmisen, joka ei ole
 * tänään vaihtamassa sähkösopimusta. Hänelle vaihtoehto on poistuminen,
 * ei klikki, joten mikään ei mene hukkaan.
 *
 * MIKSI TÄMÄ ON MYÖS HAKUKONEASIA: etusivun tuloslista on kyselyn
 * takana, joten palvelimen palauttamassa HTML:ssä ei ole sopimusdataa.
 * Tämä osio on aina näkyvää tekstiä samalla sivulla sekä kävijälle että
 * robotille. Se ei ole cloakingia eikä täytesisältöä: se kertoo mitä
 * palvelu tekee, mikä on juuri se mitä brändihakija tuli tarkistamaan.
 *
 * TILA TULEE `lib/features.ts`-KYTKIMISTÄ, EI KÄSIN. Jos lisäät tähän
 * ruudun, joka ei lue kytkintä, sivustolle syntyy toinen totuus siitä
 * mitkä vertikaalit ovat auki — ja seuraava avaus unohtuu tästä
 * osiosta. Luottokortit ilmestyvät tähän itsestään sinä päivänä kun
 * `FEATURES.cards` kääntyy todeksi.
 */

type Service = {
  icon: typeof Plug;
  title: string;
  text: string;
  href?: string;
  cta?: string;
};

/*
  TEKSTIT MUOKATAAN TÄSTÄ: `live`-lista sisältää jokaisen ruudun. Kentät
  ovat `title` (ruudun otsikko), `text` (kuvaus) ja `cta` (alarivin
  linkkiteksti).

  KUVAUKSET PIDETÄÄN YHDESSÄ LAUSEESSA. Ruudut ovat rinnakkain, ja silmä
  lukee ruudukon vertailuna: jos yhdessä on kolme riviä tekstiä ja
  toisessa yksi, pitkä ruutu ei näytä perusteellisemmalta vaan
  sekavalta, ja koko rivi jää lukematta. Tämä osio on sivun lopussa
  eikä sen tehtävä ole myydä mitään loppuun asti, vaan kertoa mitä
  palvelu kattaa. Sen jälkeen linkki tekee loput.
*/

export default function ServiceGrid({ planCount }: { planCount: number }) {
  const live: Service[] = [
    {
      icon: Plug,
      title: "Sähkösopimukset",
      text: `${planCount} sopimusta vertailussa, hinnat tarkistettu yhtiöiden omilta sivuilta.`,
      href: ENERGY_COMPARE,
      cta: "Kilpailuta sähkö",
    },
    ...(FEATURES.loans
      ? [
          {
            icon: Wallet,
            title: "Lainat",
            /* "Kumppanin kautta" on lyhyin mahdollinen tapa sanoa se, minkä
               /lainat sanoo pidemmin: Kettu ei vertaile lainoja itse. Sitä
               ei saa jättää pois lyhentämisen nimissä. Jos ruutu lupaisi
               vertailun ja sivu kertoisi ohjauksesta, lukija huomaisi eron
               heti ensimmäisellä klikillä — kalleimmalla hetkellä, eli
               silloin kun kävijä on jo liikkeellä. */
            text: "Yksi hakemus, tarjoukset usealta pankilta kumppanin kautta.",
            href: "/lainat",
            cta: "Katso lainan kilpailutus",
          } as Service,
        ]
      : []),
    ...(FEATURES.cards
      ? [
          {
            icon: CreditCard,
            title: "Luottokortit",
            text: "Vuosimaksu, korko ja edut samassa taulukossa.",
            href: "/luottokortit",
            cta: "Vertaa kortteja",
          } as Service,
        ]
      : []),
  ];

  /*
    TÄSSÄ OLI "TULOSSA" -RUUDUT (Vakuutukset, Internet). POISTETTU.

    Ne nimesivät osioita, joita ei ole, eivätkä ne voineet olla linkkejä.
    Ruudukossa, jossa puolet ruuduista ei tee mitään, koko rivi lakkaa
    näyttämästä painettavalta — myös ne kaksi, jotka ovat auki. Tyhjä
    lupaus ei myöskään kasvata luottamusta vaan kertoo, että palvelu on
    kesken.

    Kun uusi vertikaali oikeasti aukeaa, se lisätään `live`-listaan
    kytkimen taakse samalla tavalla kuin lainat, ei "tulossa"-ruutuna.
  */

  /*
    RUUDUKON LEVEYS SEURAA RUUTUJEN MÄÄRÄÄ. Tailwindin luokkanimiä ei voi
    koota merkkijonosta ajossa, koska kääntäjä lukee ne lähdekoodista, eli
    `lg:grid-cols-${n}` jäisi kokonaan pois tyylitiedostosta. Siksi tässä
    on kaksi valmista vaihtoehtoa: kaksi ruutua puolikkaina, kolme
    kolmanneksina.
  */
  const cols = live.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    /*
      EI REUNAVIIVAA EIKÄ OMAA TAUSTAA. Osio istuu samalla paperilla kuin
      sen yläpuolinen aihelinkkirivi, ja erottelun tekevät oranssit
      kortit. Kun pinta oli hiekkaa ja ympärillä oli viivat, sivun
      alaosassa oli kolme peräkkäistä vaakaviivaa parin sadan pikselin
      matkalla: aihelinkkien viiva, tämän yläreuna ja tämän alareuna.
      Silmä lukee sellaisen sarjan katkoksena, ei ryhmittelynä.
    */
    <section id="palvelut" className="scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        <Reveal>
          <SectionHead
            eyebrow="Mitä Kettu kilpailuttaa"
            title="Yksi kettu, monta sopimusta."
            lead="Kettukilpailutus vertailee arjen toistuvia laskuja: niitä, jotka veloitetaan joka kuukausi ja joita tulee harvoin tarkistettua."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className={`mt-9 grid gap-4 ${cols}`}>
            {live.map((s) => (
              /*
                KORTTI ON ORANSSI, JA SE TEHDÄÄN `theme-ember`-LUOKALLA,
                EI KIINTEÄLLÄ VÄRILLÄ. Teemaluokan sisällä `bg-white`
                ratkeaa oranssiksi ja `text-ink` kermaksi, eli kortti
                kääntyy kokonaan ilman että yhtäkään hex-koodia
                kirjoitetaan tähän. Juuri se ansa, josta DESIGN.md
                varoittaa, on tässä se mekanismi joka tekee työn.

                `ember-surface`-luokkaa EI käytetä. Siinä on kolme
                radiaalista liukua, jotka on mitoitettu täysleveälle
                vyölle; puolen ruudun levyisessä kortissa niistä näkyisi
                vain sattumanvarainen pala, ja kaksi vierekkäistä korttia
                olisivat eri sävyisiä. Tasainen väri on myös se, mikä
                pitää pinnan rauhallisena.

                Reunaviivaa ei ole: täysi väripinta on itsessään raja.
              */
              <Link
                key={s.title}
                href={s.href!}
                className="lift group theme-ember relative flex h-full flex-col rounded-2xl bg-white p-6 shadow-card sm:p-7"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-peach text-accentDark">
                  <s.icon size={20} aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-[17px] font-bold text-cream">{s.title}</h3>
                {/* Oranssilla pinnalla vaimennettu teksti nostetaan /85:een:
                    kylläinen pohja syö kontrastia, ja /70 luki jo harmaana. */}
                <p className="mt-2 text-[14px] leading-relaxed text-ink/85">{s.text}</p>
                {/* `mt-auto` pitää kehotteen kortin alareunassa, vaikka
                    tekstit ovat eri pituisia. Ilman sitä ne hyppivät eri
                    korkeuksille ja ruudukko näyttää hajoavan. */}
                <span className="mt-auto flex items-center gap-1.5 pt-5 font-display text-[13.5px] font-bold text-cream">
                  {s.cta}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
