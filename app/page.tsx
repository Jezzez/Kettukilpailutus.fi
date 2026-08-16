import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, GraduationCap, Home, TrendingUp, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FoxPaw from "@/components/FoxPaw";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import ServiceGrid from "@/components/ServiceGrid";
import CtaSection from "@/components/CtaSection";
import TailSweep from "@/components/fox/TailSweep";
import { getEnergyTopics, getPlans } from "@/lib/energy";
import { OG_IMAGE, SITE } from "@/lib/data";
import { FEATURES } from "@/lib/features";
import { ENERGY_COMPARE } from "@/lib/nav";

/*
  ETUSIVU ON HUB, EI VERTAILUSIVU.

  Sähkövertailu asui täällä 17.8.2026 asti. Se siirrettiin osoitteeseen
  `/sahkosopimukset`, koska sen alla on jo 26 sopimussivua ja 4 aihesivua,
  joiden emosivu oli siihen asti pelkkä uudelleenohjaus.

  MITÄ TÄMÄN SIVUN PITÄÄ TEHDÄ: brändihaku ("kettukilpailutus") osuu aina
  siihen sivuun, joka on osoitteessa `/`. Tänne tulee siis ihminen, joka
  tietää nimen mutta ei välttämättä sitä, mitä palvelu tekee. Sivun ainoa
  tehtävä on vastata siihen yhdellä silmäyksellä ja päästää kävijä eteenpäin
  kahdella klikillä: sähköön tai lainoihin.

  MIKSI SIVU ON LYHYT: jokainen osio tällä sivulla on este ansainnan
  edessä. Tuotto syntyy vasta `/sahkosopimukset`-sivun laskurissa ja
  `/lainat`-sivun hakemuksessa, ei täällä. Hub, joka yrittää olla myös
  vertailusivu, vain hidastaa matkaa sinne. Jos tänne lisätään sisältöä,
  perustelun on oltava se, että se vie useamman kävijän noihin kahteen
  osoitteeseen — ei se, että sivu näyttää tyhjältä.

  ÄLÄ SIIRRÄ VERTAILUA TAKAISIN TÄNNE. Osoite on nyt vaihtunut kahdesti, ja
  jokainen vaihto nollaa hakukoneen kertyneen luottamuksen `/sahkosopimukset`
  -osoitteeseen. Kolmas kerta maksaisi enemmän kuin kaksi ensimmäistä
  yhteensä.
*/

export const metadata: Metadata = {
  /*
    `absolute` ohittaa layoutin "%s | Kettukilpailutus.fi" -mallin. Sivun
    otsikko on brändihaun ensimmäinen rivi, ja siinä pitää olla sekä nimi
    että se mitä palvelu tekee — nimi yksin ei kerro hakijalle mitään.
  */
  /*
    PITUUS ON OSA OTSIKKOA. Google katkaisee hakutuloksen otsikon noin
    600 pikseliin, mikä on suomeksi noin 60 merkkiä. Tässä oli 65 merkkiä
    ("… yhdessä paikassa"), eli loppu näkyi hakutuloksessa kolmena pisteenä.
    Katkaistu otsikko ei ole vain ruma: se on hakutuloksen ainoa rivi, jonka
    perusteella klikki syntyy, ja puolikas lause näyttää huolimattomalta
    juuri palvelussa, jonka myyntiväite on huolellisuus.

    "sähkösopimukset" täydessä muodossa eikä "sähkö": se on se sana, jota
    ihmiset hakevat, ja se mahtuu nyt kun turha loppu on poissa.
  */
  title: { absolute: "Kettukilpailutus.fi – kilpailuta sähkösopimukset ja lainat" },
  /*
    KUVAUS ALKAA VERBILLÄ, EI BRÄNDILLÄ. Brändinimi on jo otsikossa ja
    näkyvässä osoitteessa; sen toistaminen kuvauksen ensimmäisenä sanana
    vie tilan siltä, mikä hakijaa oikeasti kiinnostaa eli mitä hän saa.

    Mitta on 153 merkkiä. Google katkaisee noin 155:een, joten koko lause
    näkyy — myös se jälkimmäinen puolisko, joka kertoo lainoista. Aiempi
    versio päättyi lupaukseen "eikä sido mihinkään", joka piti sitä paitsi
    paikkansa vain sähkön osalta; lupaukset kuuluvat sivulle, jossa ne voi
    perustella, eivät hakutulokseen jossa niitä ei voi.
  */
  description:
    "Kilpailuta sähkösopimukset ja lainat yhdessä paikassa. Kettu laskee sähkön vuosihinnan omalla kulutuksellasi ja hakee lainatarjoukset yhdellä hakemuksella.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kettukilpailutus.fi – kilpailuta sähkösopimukset ja lainat",
    description:
      "Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi. Sähkösopimukset euroina, lainatarjoukset yhdellä hakemuksella.",
    url: "/",
    /*
      KUVA ON OLIOMUODOSSA, EI PELKKÄNÄ OSOITTEENA.

      Sivun oma `openGraph`-lohko korvaa juuritason lohkon kokonaan, joten
      kuva on pakko toistaa tässä. Aiemmin se toistettiin pelkkänä
      merkkijonona `[OG_IMAGE]`, jolloin mukana tuli vain osoite: layoutissa
      määritellyt `width`, `height` ja `alt` jäivät pois nimenomaan sillä
      sivulla, jota jaetaan eniten.

      Mitat merkitsevät, koska Facebook ja LinkedIn varaavat esikatselulle
      tilan ennen kuin kuva on latautunut. Ilman mittoja ne arvaavat, ja
      väärin arvattu suhde rajaa kortin logon poikki. `alt` taas on ainoa
      kuvateksti ruudunlukijalle ja niille chateille, jotka eivät lataa
      kuvaa lainkaan.
    */
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE.name + " – Ketuttaako maksaa liikaa? Anna Ketun kilpailuttaa puolestasi.",
      },
    ],
  },
};

/*
  HERON LUOTTAMUSRIVI. Kolme kohtaa, ei enempää: rivi luetaan yhdellä
  silmäyksellä vain jos se mahtuu kahdelle riville puhelimessa. Jokainen
  kohta on tosi ja tarkistettavissa — keksitty lupaus tällä sivulla
  maksaisi juuri sen luottamuksen, jonka varassa koko ansaintamalli on.

  KAIKKI KOLME KERTOVAT SAMASTA ASIASTA: siitä ettei tämä maksa sinulle
  mitään, ei aikaa, ei rahaa eikä rauhaa. Se on heron koko lupaus, ja
  luottamusrivin tehtävä on toistaa se konkreettisina niin että lukija
  uskoo sen ennen kuin painaa nappia.
*/
const HERO_CHECKS = ["Noin 5 minuuttia", "Ei yhteystietoja", "Täysin ilmainen"];

/*
  AIHERUUTUJEN IKONIT JA RIVIT — AVAIMENA AIHESIVUN `slug`.

  MIKSI SLUG EIKÄ JÄRJESTYSNUMERO: aiheiden järjestys `energy-topics.json`
  -tiedostossa voi vaihtua, ja indeksiin sidottu lista antaisi silloin
  omakotitalolle opiskelijan ikonin kenenkään huomaamatta. Slug on ainoa
  kenttä, joka ei muutu ilman että osoite muuttuu.

  RIVIT ON KIRJOITETTU TÄHÄN, EI LUETTU `intro`-KENTÄSTÄ. Aihesivun ingressi
  on kirjoitettu sivun ensimmäiseksi kappaleeksi: se on kolme riviä pitkä ja
  sisältää ajatusviivoja. Ruutuun tarvitaan yksi rivi, joka kertoo kenelle
  sivu on. Jos tähän tulee uusi aihe ilman omaa riviä, koodi näyttää
  varalta ingressin — ruutu on silloin ruma mutta ei rikki.

  JOKAINEN LUKU ON AIHESIVULTA, EI KEKSITTY. 15 000–25 000 kWh ja
  1 500–2 500 kWh ovat samat luvut, jotka lukevat kohdesivujen ingresseissä.
  Jos ne muuttuvat siellä, ne on muutettava myös tässä.
*/
const TOPIC_ICON: Record<string, LucideIcon> = {
  porssisahko: TrendingUp,
  "maaraaikainen-sahkosopimus": CalendarClock,
  "omakotitalon-sahkosopimus": Home,
  "opiskelijan-sahkosopimus": GraduationCap,
};

const TOPIC_BLURB: Record<string, string> = {
  porssisahko:
    "Hinta seuraa pörssiä. Vertailussa ratkaisee kaksi lukua: marginaali ja perusmaksu.",
  "maaraaikainen-sahkosopimus":
    "Kiinteä hinta 12 tai 24 kuukaudeksi. Sähkölasku pysyy ennustettavana myös talvella.",
  "omakotitalon-sahkosopimus":
    "Sähkölämmittäjällä kuluu 15 000–25 000 kWh vuodessa. Sentin ero maksaa satoja euroja.",
  "opiskelijan-sahkosopimus":
    "Yksiössä kuluu 1 500–2 500 kWh vuodessa. Silloin perusmaksu on laskun suurin erä.",
};

export default function HomePage() {
  const plans = getPlans();
  const topics = getEnergyTopics();

  /*
    ORGANIZATION-MERKINTÄ ASUU TÄÄLLÄ, EI ALASIVULLA.

    Merkintä kuvaa koko sivustoa ja sen `url` osoittaa juureen, joten se
    kuuluu juuren sivulle. Se oli aiemmin sähkövertailun sivulla, koska
    vertailu oli etusivu; siirron jälkeen se olisi siellä ristiriita.
    Merkintää EI saa olla kahdessa paikassa: kaksi Organization-lohkoa
    samalla sivustolla on ristiriitainen signaali eikä kaksinkertainen.
    Juurilayoutissa oli 17.8.2026 asti toinen, karsitumpi lohko — se on
    poistettu, ks. `app/layout.tsx`.

    KAKSI OLIOTA, YKSI LOHKO. `@graph` sitoo Organizationin ja WebSiten
    yhteen `@id`-viittauksella. Kaksi erillistä script-tagia jättäisi
    hakukoneen päättelemään itse, ovatko ne sama toimija; nyt `publisher`
    sanoo sen suoraan. WebSite on tässä siksi, että se on entiteetti, jonka
    varassa brändihaun sitelinkit ja tietopaneelin nimi ovat — ja brändihaku
    on tämän sivun ainoa oma hakuliikenne.

    SEARCHACTIONIA EI OLE. Se kertoisi Googlelle, että sivustolla on haku
    johon voi ohjata suoraan hakutuloksesta. Hakua ei ole, joten merkintä
    olisi valhe ja johtaisi rikkinäiseen osoitteeseen.
  */
  const orgId = `${SITE.url}/#organisaatio`;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE.name,
        url: SITE.url,
        /*
          LOGO OSOITTI AIEMMIN OSOITTEESEEN `/icon.svg`, JOKA EI OLE OLEMASSA.
          Tiedosto poistettiin repositoriosta, kun favicon vaihdettiin PNG:ksi,
          mutta tämä rivi jäi. Google haki siis sivuston virallista logoa ja sai
          404:n, eli merkintä oli rikki koko ajan.

          Osoite on nyt `public/`-kansion tiedosto, joka tarjoillaan
          sellaisenaan. Älä osoita tätä `app/icon.png`:hen: se on Nextin
          metadatatiedosto, joka tarjoillaan välimuistitunnisteen kanssa
          (`/icon.png?<hash>`), eikä sen osoite ole pysyvä. Rakenteinen data
          tarvitsee pysyvän osoitteen.

          Tässä käytetään logoa, jossa on nimi mukana, ei pelkkää ketunpäätä:
          tämä kenttä ruokkii tietopaneelia, ja siinä brändi pitää pystyä
          lukemaan, ei vain tunnistamaan.
        */
        logo: `${SITE.url}/isokettulogo.png`,
        description:
          "Suomalainen kilpailutuspalvelu: sähkösopimukset ja lainat puolueettomasti vertailtuna.",
        /*
          VIRALLISET TIEDOT OVAT TÄSSÄ, KOSKA NE OVAT TOTTA JA TARKISTETTAVISSA.

          Y-tunnus on julkinen ja löytyy YTJ:stä, joten se on hakukoneelle
          ainoa kenttä tässä merkinnässä, jonka se voi varmistaa ulkopuolelta.
          Rahaa liikuttavassa vertailupalvelussa "onko takana oikea yritys" on
          se kysymys, joka ratkaisee luottamuksen — ja sama kysymys ratkaisee
          sen, kohdellaanko sivustoa hakutuloksissa yrityksenä vai
          nimettömänä affiliate-sivuna.

          Arvot tulevat `SITE.operator`-vakiosta, ei tähän kirjoitettuna: ne
          näkyvät jo alatunnisteessa, ja kahteen paikkaan kirjoitettu y-tunnus
          ehtii erkaantua.
        */
        legalName: SITE.operator.legalName,
        taxID: SITE.operator.businessId,
        email: SITE.operator.email,
        areaServed: "FI",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#sivusto`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "fi-FI",
        publisher: { "@id": orgId },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      {/*
        HERO ON ORANSSI VYÖ, KUTEN LAINASIVULLA JA 404:SSÄ.

        Sivuston rytmi on vaalea pohja ja täysleveät oranssit vyöt. Etusivun
        ensivaikutelma on se paikka, jossa brändin on näytettävä eniten
        itseltään, joten vyö alkaa heti ylhäältä ilman vaaleaa esikaistaa.

        KUVA JA TEKSTI KERTOVAT SAMAN ASIAN. Rantatuolikettu ei ole
        koriste vaan sivun väite: sinä otat rennosti, Kettu tekee työn.
        Jos otsikko puhuisi säästämisestä ja kuva lomasta, ne kilpailisivat
        keskenään eikä kumpikaan menisi perille. Siksi otsikko, ingressi ja
        luottamusrivi on kirjoitettu vaivattomuudesta, ei euroista —
        eurot ovat laskurin asia, ja laskuri on yhden klikin päässä.
      */}
      <section className="theme-ember ember-surface relative overflow-hidden pb-28 pt-9 md:pb-24 md:pt-14">
        {/*
          MOBIILISSA KUVA ON TAUSTA, KUTEN LAINASIVULLA.

          Puhelimessa hahmo ei ole oma palstansa vaan himmennetty ja
          häivytetty tausta tekstin takana. Se on sivuston yhtenäinen tapa,
          ja syy on tuotossa: täysikokoisena kuva vie pystysuunnassa saman
          tilan kuin otsikko ja molemmat napit yhteensä, eli se työntäisi
          ainoat tuottavat linkit taitteen alle. Taustana se antaa saman
          tunnelman ilman että vie riviäkään.

          MITOITUS ON ERI KUIN LAINASIVULLA, KOSKA KUVA ON ERI MUOTOA.
          `rahakettu` on pystykuva ja mitoitetaan korkeudella; tämä on
          vaakakuva (1432 × 1016), joten korkeusmitoitus levittäisi sen
          moninkertaiseksi ruudun leveyteen nähden. Leveys on siis se, mitä
          ohjataan, ja kuva ankkuroidaan alareunaan.

          HÄIVYTYS ON YLÖSPÄIN, EI VASEMMALLE KUTEN LAINASIVULLA. Sekin
          seuraa kuvan muodosta: pystykuva mahtuu tekstin viereen, joten
          lainasivulla riittää häivyttää sen vasen reuna. Vaakakuva täyttää
          koko leveyden, joten se on väistämättä tekstin ALLA, ja ainoa
          suunta, johon se voi väistyä, on ylös. Kuva on siis kirkkaimmillaan
          alareunassa ja liukenee oranssiin ennen kuin osuu otsikkoon.

          Käytännössä tekstirivit ja ingressi ovat puhtaalla oranssilla,
          napit ja luottamusrivi kuvan haaleimman kohdan päällä. Se on
          tarkistettu tältä leveydeltä: jos kuvaa nostaa tai häivytystä
          lyhentää, kermanvalkoinen otsikko menee ketun vaalean puvun päälle
          ja kontrasti putoaa luettavuuden rajalle.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden md:hidden"
        >
          <Image
            src="/kettu-rantatuoli.webp"
            alt=""
            width={1432}
            height={1016}
            priority
            /*
              `sizes` ALKAA TYÖPÖYTÄEHDOLLA, VAIKKA KUVA ON MOBIILIN.

              Tässä luki pelkkä "130vw". `md:hidden` piilottaa elementin
              työpöydällä, mutta se on silti DOM:issa, ja `priority` lisää
              sivun `<head>`:iin esilatauksen. Selain ei tiedä mitään
              CSS-näkyvyydestä esilatausta tehdessään: se laski 130 % 1440
              pikselistä ja latasi 1872 pikselin levyisen version kuvasta,
              jota työpöydällä ei piirretä lainkaan. Se oli satoja kilotavuja
              hukkalatausta joka ainoalla työpöytäkäynnillä — ja koska se
              tapahtui esilatauksena, se kilpaili kaistasta juuri sen kuvan
              kanssa, joka näkyy.

              Nyt 768 pikselistä ylöspäin `sizes` on 1px, jolloin selain
              valitsee pienimmän srcset-vaihtoehdon. Kuvaa ei voi jättää
              lataamatta kokonaan, mutta muutaman kilotavun pikkukuva on
              se hinta, jonka `md:hidden`-ratkaisu maksaa.

              Sama temppu toisin päin on työpöytäkuvassa alempana
              (`(min-width: 768px) 560px, 1px`). Jos muutat toista, muuta
              molemmat — ne ovat pari.
            */
            sizes="(min-width: 768px) 1px, 130vw"
            className="absolute bottom-0 left-[-13%] w-[130%] max-w-none opacity-40"
            style={{
              WebkitMaskImage: "linear-gradient(to top, #000 55%, transparent 100%)",
              maskImage: "linear-gradient(to top, #000 55%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative z-[1] mx-auto max-w-[1180px] px-4 sm:px-6">
          <div className="grid items-center gap-6 md:grid-cols-[1.04fr_0.96fr] md:gap-8">
            <div>
              <Reveal>
                <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.18em] text-goldInk">
                  Suomalainen kilpailutuspalvelu
                </span>

                {/*
                  OTSIKKO ON LUPAUS VAIVATTOMUUDESTA, EI SÄÄSTÖSTÄ.

                  Säästölupaus ("säästä satoja euroja") on se, minkä
                  kohdeyleisö on nähnyt sadassa mainoksessa, ja se luetaan
                  liioitteluksi ennen kuin sitä on ehditty tarkistaa.
                  Vaivattomuus on väite, jonka sivu pystyy heti
                  todistamaan: laskuri ei kysy yhteystietoja, ja se näkyy
                  yhdellä klikillä. Todistettava lupaus vie nappiin asti,
                  liioiteltu ei.

                  Koko slogania ei käytetä otsikkona: se on kaksi virkettä
                  ja kolmirivinen jokaisella puhelimella. Kysymysmuoto
                  ("Ketuttaako maksaa liikaa?") on sivun loppukehotuksessa,
                  jossa sille on tilaa.

                  TOISELLA RIVILLÄ ON SUBSTANTIIVIT, EIKÄ SE OLE KORISTE.
                  H1 on sivun vahvin yksittäinen signaali hakukoneelle, ja
                  pelkkä "Ota iisisti. Kettu kilpailuttaa." ei kerro
                  koneelle mitä kilpailutetaan. Sanat "sähkön ja lainat"
                  ovat siinä siksi, että ne ovat ne kaksi asiaa, joita
                  palvelu oikeasti tekee.

                  MITÄ TÄHÄN EI SAA LAITTAA: hakusanaotsikkoa tyyliin
                  "Sähkön kilpailutus 2026". Se kilpailisi suoraan
                  `/sahkosopimukset`-sivun kanssa samasta hausta, ja kun
                  kaksi oman sivuston sivua tavoittelee samaa hakua,
                  Google valitsee niistä toisen eikä yleensä sitä, jolla
                  ansaitaan. Hubin tehtävä haussa on brändinimi; sähköhaut
                  kuuluvat vertailusivulle ja aihesivuille.

                  `clamp` on sama suoja kuin lainasivulla: hero-osiolla on
                  `overflow-hidden`, joten liian leveä rivi ei rivity vaan
                  leikkautuu pois. Kiinteä `vw`-koko ilman ylä- ja
                  alarajaa katkaisi otsikon 320 px:n näytöllä.
                */}
                <h1 className="mt-4 font-hero text-[clamp(1.9rem,8.4vw,2.7rem)] leading-[1.06] text-cream sm:text-[3rem]">
                  Ota iisisti.
                  <br />
                  Kettu <em className="text-goldInk">kilpailuttaa</em> sähkön ja lainat.
                </h1>

                {/*
                  INGRESSI ON SIVUN ENTITEETTILAUSE.

                  Tämä kappale on ensimmäinen leipäteksti sivun HTML:ssä, eli
                  se on se virke, josta hakukone päättelee mikä palvelu tämä
                  on. Siksi siinä sanotaan brändinimi ja molemmat vertikaalit
                  omilla nimillään: "sähkösopimukset" ja "lainatarjoukset",
                  ei "arjen laskut" tai muuta kiertoilmausta. Kiertoilmaus
                  kuulostaa paremmalta ja kertoo koneelle vähemmän.

                  Loppu on silti vaivattomuuslupaus, koska se on se, mikä
                  saa ihmisen painamaan nappia. Molemmat mahtuvat samaan
                  kappaleeseen; kumpaakaan ei tarvitse uhrata.
                */}
                <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink/90 sm:text-[17.5px]">
                  Kettukilpailutus vertailee sähkösopimukset omalla kulutuksellasi ja hakee lainatarjoukset yhdellä hakemuksella. Ei soittoja, ei papereita, ei yhteystietoja.
                </p>
              </Reveal>

              {/*
                KAKSI NAPPIA, SELVÄ ETUSIJA.

                Sähkö on kermanvalkoinen eli vyön ainoa vaalea piste, lainat
                ovat ääriviivanappi. Se ei ole makuasia: sähkö on ainoa
                vertikaali, jossa Kettu tekee vertailun itse ja jossa on 20
                toimivaa affiliate-linkkiä. Lainat ohjaavat kumppanille
                yhdellä linkillä. Kaksi samanarvoista nappia pakottaisi
                kävijän valitsemaan, ja valinta hidastaa jokaista — myös
                sitä, joka olisi joka tapauksessa mennyt sähköön.

                MOLEMPIEN ON NÄYTETTÄVÄ PAINETTAVALTA. Sekundäärinappi oli
                aiemmin 45 %:n läpinäkyvä hiusviiva oranssilla, ja sellainen
                luetaan koristeeksi eikä painikkeeksi: napin ainoa merkki
                oli reuna, joka melkein katosi taustaansa. Nyt kummallakin
                on kolme painikkeen tunnusmerkkiä: oma pinta, ylävalo ja
                varjo, joka nostaa napin irti vyöstä. Etusija säilyy silti
                selvänä, koska kerma on täysi väri ja lainanapin pinta
                läpikuultava.

                Napit ovat puhelimessa täysleveitä (`w-full sm:w-auto`),
                kuten lainasivun päänappi. Suurin osa liikenteestä on
                mobiilissa, ja täysleveä nappi on sekä isompi osumapinta
                että ainoa muoto, joka luetaan painikkeeksi ilman epäröintiä.

                Lainanappi näkyy vain kytkimen ollessa päällä. Ilman
                tarkistusta sivu tarjoaisi 404:n heti ensimmäisellä
                klikillä, jos vertikaali joskus suljetaan.
              */}
              <Reveal delay={0.1}>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href={ENERGY_COMPARE}
                    /* Kiinteä `#A83E0A`: `text-accentDark` kääntyy
                       ember-teemassa kermaksi ja teksti katoaisi
                       kermanvalkoisen napin sisään. Sama koskee hoveria,
                       joten se on kiinteä valkoinen eikä `hover:bg-white`.

                       `shadow-[...]` on tässä käsin kirjoitettu eikä
                       `shadow-lift`: ember-teeman `--sh-lift` on pelkkä
                       leveä pehmeä varjo, ja kermanapin pitää saada myös
                       ylävalo (`inset 0 1px 0`) sekä tiukempi lähivarjo.
                       Ne kaksi tekevät pinnasta kohollaan olevan. */
                    className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-cream px-9 py-[18px] font-display text-[16.5px] font-bold text-[#A83E0A] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_5px_rgba(74,26,2,0.28),0_16px_34px_-12px_rgba(74,26,2,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#FFFFFF] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_3px_7px_rgba(74,26,2,0.3),0_22px_44px_-12px_rgba(74,26,2,0.65)] active:translate-y-0 active:scale-[0.98] sm:w-auto"
                  >
                    <Zap size={19} aria-hidden />
                    Kilpailuta sähkösopimukset
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>

                  {FEATURES.loans && (
                    <Link
                      href="/lainat"
                      /* Läpikuultava kermapinta + kunnon reuna. Pinta on se,
                         mikä erottaa napin taustastaan; pelkkä reuna ei
                         riitä, kun taustalla on kuviollinen vyö. */
                      className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-cream/70 bg-cream/[0.14] px-9 py-[18px] font-display text-[16.5px] font-bold text-cream shadow-[inset_0_1px_0_rgba(255,244,235,0.28),0_10px_26px_-14px_rgba(74,26,2,0.7)] transition-all hover:-translate-y-0.5 hover:border-cream hover:bg-cream/25 active:translate-y-0 active:scale-[0.98] sm:w-auto"
                    >
                      Kilpailuta lainatarjoukset
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  )}
                </div>

                <ul className="mt-5 flex max-w-lg flex-wrap gap-2">
                  {HERO_CHECKS.map((c) => (
                    <li
                      key={c}
                      className="flex items-center gap-2 rounded-full border border-line/60 px-3 py-1.5 text-[13.5px] font-semibold text-ink/85"
                    >
                      <FoxPaw size={12} className="text-goldInk" />
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/*
              RANTATUOLIKETTU TYÖPÖYDÄLLÄ — OMANA PALSTANAAN.

              `hidden md:block`, koska sama kuva piirretään puhelimessa
              taustana osion yläreunassa. Ilman piilotusta kuva olisi
              mobiilissa kahdesti: kerran taustana ja kerran palstana.

              MITAT: 1432 × 1016, eli VAAKAKUVA (1,41:1). Se on koko
              kuvastossa poikkeus — `kettu-tuolissa` on 0,72:1 ja
              `kettu-seisoo` 0,33:1 — ja siksi tätä ei mitoiteta
              korkeudella niin kuin muita hahmoja. Korkeudella mitoitettuna
              tämä kuva levittäytyy lähes kaksi kertaa leveämmäksi kuin
              mihin heron kuvapalsta riittää. Mitoitus on siis leveydellä
              (`w-full`), ja korkeus seuraa perässä.

              KUVASSA ON VALMIS PEHMEÄ HEHKU (alfa nousee 0:sta reunoilla
              254:ään keskellä), joten `halo-glow`-luokkaa EI lisätä.
              Kaksi hehkua päällekkäin tekee hahmon ympärille selvän
              vaalean renkaan, eli juuri sen leikkausreunan, jonka hehkun
              on tarkoitus piilottaa.

              `priority`, koska tämä on sivun suurin kuva ruudun yläosassa.
              Ilman sitä hero näyttää ensimmäisen sekunnin puolivalmiilta —
              ja ensivaikutelma on tämän sivun koko tehtävä.

              `sizes` kertoo, että tätä versiota tarvitaan vain 768 pikselistä
              ylöspäin ja silloinkin noin 560 pikselin levyisenä. Mobiilin
              taustakuva on oma elementtinsä omalla `sizes`-arvollaan.
            */}
            <Reveal delay={0.12} className="hidden md:block">
              <Image
                src="/kettu-rantatuoli.webp"
                /*
                  ALT KUVAILEE KUVAN, EI TUNGE HAKUSANOJA.

                  Houkutus olisi kirjoittaa tähän "sähkön ja lainojen
                  kilpailutus Suomessa". Se olisi hakusanojen tunkemista
                  alt-tekstiin: Google tunnistaa sen, eikä ruudunlukijan
                  käyttäjä saisi tietää mitä kuvassa on. Brändinimi on
                  mukana siksi, että se on totta — tämä on Kettukilpailutuksen
                  maskotti, ei kuvapankin kettu — ja koska maskotti on se,
                  jolla brändi tunnistetaan kuvahaussa.

                  Mobiiliversiolla samasta kuvasta on `alt=""` ja
                  `aria-hidden`. Se on tarkoituksellista: kaksi elementtiä
                  samasta kuvasta luettaisiin ääneen kahdesti, ja mobiilissa
                  kuva on pelkkä himmennetty tausta.
                */
                alt="Kettukilpailutuksen kettu-maskotti ottaa rennosti rantatuolissa"
                width={1432}
                height={1016}
                priority
                sizes="(min-width: 768px) 560px, 1px"
                className="h-auto w-full select-none drop-shadow-[0_26px_44px_rgba(80,28,2,0.42)]"
                draggable={false}
              />
            </Reveal>
          </div>
        </div>

        {/* `theme-light`-kääre on pakollinen: ilman sitä `--c-paper`
            luetaan ember-teemasta, jossa se on oranssi, eikä kaari osuisi
            alla olevaan paperiin lainkaan. */}
        <div className="theme-light">
          <TailSweep fill="rgb(var(--c-paper))" height={64} />
        </div>
      </section>

      <div className="theme-light bg-paper">
        {/*
          PALVELUVALIKOIMA ON TÄMÄN SIVUN YDIN.

          Se vastaa juuri siihen kysymykseen, jota varten brändihakija
          tuli: mitä Kettu kilpailuttaa. Ruutujen tila tulee
          `lib/features.ts`-kytkimistä, joten uusi vertikaali ilmestyy
          tähän itsestään.

          Osio on sivun yläosassa eikä lopussa. Sähkösivulla se oli
          lopussa, koska siellä se oli ainoa linkki ulos sähkösuppilosta.
          Täällä tilanne on päinvastainen: kävijä ei ole vielä valinnut
          mitään, ja ruudukko ON se valinta.
        */}
        <ServiceGrid planCount={plans.length} />

        {/*
          AIHESIVUT — TÄSSÄ OLI AIEMMIN "KOLME ASKELTA".

          MIKSI ASKELEET POISTETTIIN: ne kuvasivat prosessia, jota lukija ei
          ollut vielä aloittanut, eivätkä ne vieneet mihinkään. Osio ilman
          yhtäkään linkkiä on hubilla kuollut tila: se pidentää matkaa
          alaspäin eikä siirrä ketään eteenpäin. Sama tieto ("ei
          yhteystietoja, muutama minuutti") on jo heron luottamusrivissä,
          jonka lukija näkee ennen kuin ehtii vierittää.

          MIKSI JUURI TÄMÄ TILALLE — KAKSI SYYTÄ.

          1. KÄVIJÄLLE: brändihaun kautta tullut ei tiedä mitä valita, mutta
             hän tietää millaisessa asunnossa asuu ja onko pörssi vai kiinteä
             mielessä. Neljä ruutua antaa hänen valita sen sijaan että hän
             joutuisi lukemaan yleisen esittelyn.

          2. HAKUKONEELLE: nämä neljä sivua ovat niitä, jotka voivat oikeasti
             nousta sähköhauissa, ja ennen tätä ne eivät saaneet yhtään
             linkkiä sivuston vahvimmalta sivulta. Alatunniste tarjoaa ne
             vain silloin kun ollaan jo sähköpolulla, eli ei koskaan täällä.
             Linkin teksti on sivun oma H1, koska ankkuriteksti ja kohteen
             otsikko yhdessä kertovat hakukoneelle mistä sivu kertoo.

             Tämä ei kilpaile `/sahkosopimukset`-sivun kanssa: hub linkittää
             aihesivuille, se ei yritä sijoittua niiden hauilla itse.

          RUUDUT LUETAAN DATASTA, EI KIRJOITETA KÄSIN. Kun `energy-topics.json`
          saa viidennen aiheen, se ilmestyy tähän itsestään. Lisää samalla
          sille lyhyt rivi `TOPIC_BLURB`-listaan; ilman sitä ruutu näyttää
          aihesivun oman ingressin, joka on tähän liian pitkä.
        */}
        <section className="pb-16 md:pb-20">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <Reveal>
              {/*
                OTSIKOSSA ON "SÄHKÖSOPIMUS", EI PELKKÄ KEHOTUS.

                Tässä luki "Aloita omasta tilanteestasi." Kehotus on hyvä
                mutta sanaton: se ei kerro hakukoneelle eikä silmäilijälle,
                minkä asian tilanteesta puhutaan. Yläotsikko ("eyebrow") on
                `<p>`, ei otsikkoelementti, joten siinä ollut sana
                "sähkösopimukset" ei painanut mitään — H2 on ainoa rivi
                tästä lohkosta, joka luetaan otsikkona.

                Sivun otsikkorakenne on nyt: H1 kertoo mitä palvelu tekee,
                ensimmäinen H2 nimeää vertikaalit ja tämä toinen H2 nimeää
                sähkösopimuksen valintaperusteen. Kolme tasoa, ei yhtään
                hyppyä — ja jokaisessa on sana, jolla joku hakee.
              */}
              <SectionHead
                eyebrow="Sähkösopimukset tilanteen mukaan"
                title="Löydä oikea sähkösopimus omaan tilanteeseesi."
                lead="Kulutus ja sopimustyyppi ratkaisevat, mikä sähkösopimus on sinulle halvin. Valitse lähin tilanne, niin vertailu on valmiiksi rajattu."
              />
            </Reveal>

            <Reveal delay={0.08}>
              {/*
                NELJÄ RUUTUA: 2 × 2 tabletilla, yksi rivi työpöydällä.
                Ruudut ovat vaaleita, koska heti yläpuolella on oranssit
                palveluruudut. Kaksi peräkkäistä oranssia ruudukkoa
                luettaisiin samaksi osioksi, eikä lukija huomaisi että
                kysymys vaihtui ("mitä kilpailutetaan" → "mikä on tilanteesi").
              */}
              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {topics.map((t) => {
                  const Icon = TOPIC_ICON[t.slug] ?? Zap;
                  return (
                    <Link
                      key={t.slug}
                      href={`/sahkosopimukset/${t.slug}`}
                      className="lift group flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-accentSoft text-accentDark">
                        <Icon size={20} aria-hidden />
                      </span>
                      <h3 className="mt-4 font-display text-[16.5px] font-bold leading-snug text-ink">
                        {t.h1}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
                        {TOPIC_BLURB[t.slug] ?? t.intro}
                      </p>
                      <span className="mt-auto flex items-center gap-1.5 pt-5 font-display text-[13.5px] font-bold text-accentDark">
                        Katso vertailu
                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                          aria-hidden
                        />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/*
        LOPPUKEHOTUS TARJOAA MOLEMMAT VERTIKAALIT, EI PELKKÄÄ SÄHKÖÄ.

        Tässä luki aiemmin sähkösivun oma kehote ("Kerro asumismuotosi,
        niin Kettu laskee..."). Se on oikea teksti sähkösivun lopussa,
        jossa lukija on jo valinnut sähkön, mutta väärä täällä: tämä on
        se sivu, jolle tullaan brändihaulla valitsematta mitään, ja jos
        sivun viimeinen kehotus puhuu pelkästä sähköstä, lainaa etsivä
        kävijä lukee koko palvelun sähköpalveluksi ja poistuu.

        TEKSTI EROTTAA VERTIKAALIT TOISISTAAN, EIKÄ SE OLE SAIVARTELUA.
        Sähkön Kettu vertailee itse; lainoissa se ohjaa kumppanille. Jos
        kehote lupaisi molemmista saman, ero paljastuisi ensimmäisellä
        klikillä — eli kalleimmalla hetkellä, kun kävijä on jo liikkeellä.
        Sama sääntö kuin palveluruuduissa, ks. `components/ServiceGrid.tsx`.

        Sähkö on ensisijainen nappi, koska siellä on 20 toimivaa
        affiliate-linkkiä ja oma laskuri; lainat on yksi ohjaus. Lainanappi
        on kytkimen takana, jottei suljettu vertikaali jätä tähän 404:ää.

        `href` jätetään pois: `CtaSection`in oletus on `ENERGY_COMPARE`.
        Hubin loppukehote, joka veisi hubille, olisi silmukka.
      */}
      <CtaSection
        title="Ketuttaako maksaa liikaa?"
        text="Sähkösopimukset Kettu vertailee itse omalla kulutuksellasi ja näyttää vuosihinnan euroina. Lainatarjoukset haet yhdellä hakemuksella kumppanin kautta. Molemmat ovat maksuttomia."
        button="Kilpailuta sähkö"
        secondaryHref={FEATURES.loans ? "/lainat" : undefined}
        secondaryButton={FEATURES.loans ? "Kilpailuta laina" : undefined}
      />
    </>
  );
}
