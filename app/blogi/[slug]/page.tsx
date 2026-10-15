import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock } from "lucide-react";
import { getPost, getPosts, OG_IMAGE, SITE } from "@/lib/data";
import CtaSection from "@/components/CtaSection";
import FoxPaw from "@/components/FoxPaw";
import { FEATURES } from "@/lib/features";
import { ENERGY_COMPARE } from "@/lib/nav";

/*
  ARTIKKELIN LOPPUKEHOTTEET VERTIKAALEITTAIN.

  Sisältö on taulukossa eikä sisäkkäisissä ternäärilausekkeissa, koska
  vertikaaleja on nyt kolme ja tulossa lisää (vakuutukset, internet).
  Kolmiportainen ternääri jsx:n sisällä on se kohta, jossa neljäs
  vertikaali kirjoitetaan vahingossa väärään haaraan.

  Lainakehote poikkeaa sähköstä sanamuodoltaan tarkoituksella: emme
  vertaile lainoja itse vaan ohjaamme kumppanille, joten kehote ei saa
  luvata omaa vertailua. Väärä lupaus loppukehotteessa on kalliimpi kuin
  vaisumpi sanamuoto, koska pettynyt kävijä ei palaa.
*/
const CTA = {
  energy: {
    href: ENERGY_COMPARE,
    title: "Katso nyt, paljonko sinä maksat liikaa sähköstä",
    text: "Kerro asumismuotosi, niin Kettu laskee sopimukset euroina, ei sentteinä kilowattitunnilta.",
    button: "Kilpailuta sähkö ilmaiseksi",
  },
  loan: {
    href: "/lainat",
    title: "Älä ota ensimmäistä tarjousta",
    text: "Kettu pyytää lainatarjoukset useasta pankista yhdellä hakemuksella. Hakeminen on maksutonta eikä sido mihinkään.",
    button: "Vertaa lainatarjoukset",
  },
  cards: {
    href: "/luottokortit#vertailu",
    title: "Katso, mikä luottokortti sopii juuri sinun kulutukseesi",
    text: "Vastaa kolmeen kysymykseen, niin Kettu järjestää kortit sinun käyttösi mukaan.",
    button: "Aloita ilmainen vertailu",
  },
} as const;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blogi/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `${SITE.url}/blogi/${post.slug}`,
      // Pakko toistaa: sivun oma openGraph-lohko korvaa juuritason lohkon
      // kokonaan, jolloin kuva katoaisi. Ks. OG_IMAGE lib/data.ts.
      images: [OG_IMAGE],
    },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  /*
    ARTIKKELIN LOPPUKEHOTE SEURAA ARTIKKELIN AIHETTA.

    Kehote ei saa olla sama kaikille: lukija, joka on juuri lukenut
    luottokortista, ei klikkaa sähkösopimuksia. Aihe ja kehote on
    kohdattava, tai klikki jää tekemättä.

    Yhdeksän korttiaiheista artikkelia on yhä `data/posts.json`-tiedostossa,
    mutta korttidata on keksittyä eikä korttivertailua ole olemassa: opas,
    joka johtaa vertailuun jota ei ole, on lukijalle umpikuja ja
    hakukoneelle ohut sivu. Siksi ne päättyvät alla olevaan huomautukseen
    eivätkä kehotteeseen, ja oranssi vyö palaa niihin itsestään, kun
    FEATURES.cards kääntyy todeksi.
  */
  const isEnergy = post.category === "Sähkö";
  /*
    Lainaoppaat vievät /lainat-sivulle, eivät suoraan kumppanin
    hakemukseen. Syy on mitattavuus: kaikki neljä seurattua
    `placement`-arvoa ovat tuolla sivulla (lib/loans.ts), ja suora linkki
    ohittaisi ne kaikki. Lisäksi /lainat kertoo kumppanuudesta ennen
    siirtymää, mikä on sekä rehellisempää että vähentää poistumisia
    hakemuslomakkeelta.

    FEATURES.loans on ehdossa mukana, jotta lainavertikaalin sulkeminen
    yhdestä kytkimestä sulkee myös nämä kehotteet eikä jätä artikkeleita
    osoittamaan sivulle, jota ei enää ole.
  */
  const isLoan = post.category === "Lainat" && FEATURES.loans;
  /*
    Varasuunnitelma sen varalta, että ei-sähköinen artikkeli palaa
    ennen kuin sen vertikaali on auki: silloin loppukehote osoittaisi
    osoitteeseen, joka palauttaa 404. Aiheeseen liittymätön kehote
    tilalle olisi houkutteleva mutta väärä, ja juuri se ele saa
    vertailusivun näyttämään liidifarmilta.
  */
  const cardsHidden = !isEnergy && !isLoan && !FEATURES.cards;

  /*
    LUE MYÖS -NOSTOT.

    Artikkeli päättyi aiemmin umpikujaan: joko lukija klikkasi yhtä
    linkkiä tai poistui sivustolta. Hakukoneesta tullut kävijä on
    kuitenkin harvoin valmis vertailemaan heti ensimmäisellä sivulla —
    hän lukee ensin toisen ja kolmannen jutun. Jokainen luettu artikkeli
    on uusi näyttökerta loppukehotteelle, joten sisäinen linkitys ei ole
    tässä pelkkää SEO:ta vaan suora tuottovipu.

    Saman kategorian jutut ensin, ja jos niitä on alle kolme, lista
    täydennetään muista. Näin nosto ei koskaan jää vajaaksi eikä
    tyhjäksi riippumatta siitä, montako juttua kategoriassa on.
  */
  const others = getPosts().filter((p) => p.slug !== post.slug);
  const related = [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    articleSection: post.category,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blogi/${post.slug}`,
  };

  return (
    <>
    <article className="mx-auto max-w-3xl px-4 pb-16 pt-14 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Murupolku" className="flex items-center gap-1 text-[13px] text-ink/60">
        <Link href="/etusivu" className="hover:text-ink">Etusivu</Link>
        <ChevronRight size={13} aria-hidden />
        {/* "Oppaat" eikä "Blogi": valikossa ja listasivulla osio on
            nimeltään Oppaat, ja kaksi nimeä samalle paikalle saa
            palvelun näyttämään kootulta useasta sivustosta. */}
        <Link href="/blogi" className="hover:text-ink">Oppaat</Link>
        <ChevronRight size={13} aria-hidden />
        <span className="text-ink/85">{post.category}</span>
      </nav>

      <h1 className="mt-6 font-hero text-[2.1rem] leading-[1.08] text-ink sm:text-[2.6rem]">
        {post.title}
      </h1>
      <p className="mt-4 flex items-center gap-3 text-sm text-ink/60">
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("fi-FI")}</time>
        <span className="inline-flex items-center gap-1"><Clock size={13} aria-hidden /> {post.readMinutes} min lukuaika</span>
        <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold">{post.category}</span>
      </p>

      {/*
        VÄLIOTSIKOT: RIVI, JOKA ALKAA MERKEILLÄ "## ".

        Artikkelin body on JSON-tiedostossa merkkijonotaulukko, ja jokainen
        alkio piirtyi ennen kappaleeksi. Se rajasi jutut lyhyiksi: 1 500
        sanaa yhtenä pystysuorana tekstinauhana ei ole luettavissa, joten
        artikkelit oli pakko pitää 400 sanassa.

        MIKSI TÄMÄ ON SEO-KYSYMYS EIKÄ TYYLIKYSYMYS: Google poimii
        hakutuloksen nostot ja "muut kysyivät myös" -vastaukset
        väliotsikon ja sitä seuraavan kappaleen parista. Ilman h2-tasoa
        sivulla on täsmälleen yksi otsikko, eikä hakukoneella ole mitään,
        mitä nostaa. Väliotsikko on siis se paikka, johon hakusana
        kirjoitetaan siinä muodossa, jossa lukija sen kirjoittaa
        hakukenttään.

        MIKSI TUOTON KANNALTA: oppaat ovat sivuston halvin kävijälähde.
        Jokainen luettu artikkeli päättyy oranssiin kehotevyöhön, joka
        vie vertailuun — eli hakuliikenne muuttuu klikeiksi vain, jos
        artikkeli ylipäätään löytyy ja tulee luetuksi loppuun.

        MIKSI MERKKIJONOPREFIKSI EIKÄ UUSI KENTTÄ TYYPPIIN: `body` on
        `string[]` kolmessatoista olemassa olevassa artikkelissa. Uusi
        rakenne olisi vaatinut kaikkien muuntamisen, ja muunnos, joka ei
        ole pakollinen, tuottaa vain tilaisuuksia rikkoa vanhaa. Vanha
        artikkeli, jossa ei ole yhtään "## "-riviä, piirtyy täsmälleen
        kuten ennenkin.

        ID TULEE OTSIKOSTA, jotta osioon voi linkittää suoraan
        (`/blogi/juttu#sahkovero`). Se on myös se ankkuri, jonka Google
        näyttää hakutuloksen alla omana rivinään.

        TAULUKOT NOUDATTAVAT SAMAA SOPIMUSTA: kappale, joka alkaa "| ",
        on taulukon rivi, ja peräkkäiset rivit muodostavat yhden taulukon.
        Ensimmäinen rivi on otsikkorivi. Ks. `toBlocks` ja `BodyTable`.
      */}
      <div className="mt-10 space-y-6">
        {toBlocks(post.body).map((block, i) => {
          if (block.kind === "h2") {
            return (
              <h2
                key={i}
                id={headingId(block.text)}
                className="!mt-12 scroll-mt-24 font-display text-[1.45rem] font-bold leading-tight text-ink sm:text-[1.6rem]"
              >
                {block.text}
              </h2>
            );
          }
          if (block.kind === "table") {
            return <BodyTable key={i} rows={block.rows} />;
          }
          return (
            <p key={i} className="text-[17px] leading-[1.75] text-ink/85">
              <Prose text={block.text} />
            </p>
          );
        })}
      </div>

    </article>

    <section aria-label="Lue myös" className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6">
      <h2 className="font-display text-[22px] font-semibold text-ink">Lue myös</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((p) => (
          /* Nosto tulee yhteisestä `.lift`-luokasta — sama liike kuin
             kaikilla muillakin korteilla sivustolla. */
          <Link
            key={p.slug}
            href={`/blogi/${p.slug}`}
            className="lift group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card hover:border-accent/35"
          >
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-accentDark">
              {p.category}
            </span>
            <h3 className="mt-2 font-display text-[17px] font-semibold leading-snug text-ink group-hover:text-accentDark">
              {p.title}
            </h3>
            <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink/70">{p.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-ink/60">
              <Clock size={13} aria-hidden /> {p.readMinutes} min lukuaika
            </span>
          </Link>
        ))}
      </div>
    </section>

    {/*
      ARTIKKELI PÄÄTTYY ORANSSIIN VYÖHÖN, EI ALLEVIIVATTUUN LINKKIIN.

      Tässä oli hiekanvärinen laatikko ja tekstilinkki "Siirry
      vertailuun →". Se on koko sivuston heikoin kohta tuoton kannalta:
      hakukoneesta tuleva lukija on juuri antanut palvelulle viisi
      minuuttia lukuaikaa, on siis lämpimin mahdollinen kävijä — ja
      hänelle tarjottiin poistumishetkellä alleviivattua riviä, joka
      näyttää samalta kuin artikkelin sisäiset linkit.

      Sama vyö kuin etusivun ja sähkösivun lopussa. Toisto on
      tarkoituksellinen: kun kehote näyttää joka sivulla samalta,
      lukija tunnistaa sen kolmannella sivulla ilman lukemista.
    */}
    {cardsHidden ? (
      /*
        Huomautus, ei kehote. Tämä sivu ei tuota mitään sillä välin kun
        korttiosio on kiinni — mutta se ei myöskään lupaa mitään, mitä ei
        voi lunastaa, eikä vie lukijaa umpikujaan. Kun FEATURES.cards
        kääntyy todeksi, oranssi kehotevyö palaa itsestään tilalle.
      */
      <section aria-label="Korttivertailun tilanne" className="mx-auto max-w-3xl px-4 pb-4 sm:px-6">
        <div className="flex gap-3.5 rounded-2xl border border-line bg-mist p-6">
          <span className="mt-1 shrink-0 text-accentDark">
            <FoxPaw size={16} />
          </span>
          <div>
            <p className="font-display text-[15.5px] font-semibold text-ink">
              Korttivertailu on vielä työn alla
            </p>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink/70">
              Kettu kilpailuttaa toistaiseksi sähkösopimukset. Luottokorttien vertailu
              avataan vasta, kun jokainen korko, kulu ja etu on tarkistettu kortin
              myöntäjältä — arvaamalla kootusta taulukosta ei ole kenellekään hyötyä.
            </p>
          </div>
        </div>
      </section>
    ) : (
    <CtaSection {...CTA[isEnergy ? "energy" : isLoan ? "loan" : "cards"]} />
    )}

    </>
  );
}

/**
 * Kappaleen sisäiset linkit merkinnällä `[teksti](/polku)`.
 *
 * MIKSI TÄMÄ ON TUOTTOKYSYMYS: hakukoneesta tuleva lukija laskeutuu
 * artikkeliin, ei etusivulle. Ilman linkkejä leipätekstissä hänen ainoa
 * tiensä vertailuun on artikkelin lopussa oleva oranssi vyö — eli hänen
 * on luettava 1 300 sanaa loppuun asti. Linkki oikeassa kohdassa
 * lausetta ottaa klikin siltä lukijalta, joka löysi vastauksensa jo
 * kolmannesta väliotsikosta ja olisi muuten poistunut.
 *
 * SEO: sisäinen linkitys kertoo Googlelle, mitkä sivut ovat sivuston
 * tärkeimpiä. Kymmenen opasta, joista jokainen linkittää vertailuun ja
 * pariin toiseen oppaaseen, nostaa nimenomaan vertailusivua — ei
 * artikkeleita. Ankkuriteksti on siksi kuvaileva ("sähkösopimusten
 * vertailu"), ei "klikkaa tästä".
 *
 * MIKSI OMA MINITULKKI EIKÄ MARKDOWN-KIRJASTO: koko tarve on yksi
 * merkintä. Kirjasto toisi mukanaan HTML:n läpipäästön ja sen myötä
 * riskin siitä, että data-tiedostoon kirjoitettu merkki päätyy sivulle
 * elementtinä. Tässä tulkissa mikään muu kuin linkki ei ole mahdollinen.
 *
 * Ulkoiset osoitteet (`http`) piirtyvät tavallisena ankkurina ja saavat
 * `nofollow`in: lähdeviitteet ovat lukijaa varten, eikä sivuston
 * linkkiarvoa ole syytä vuotaa niihin.
 */
/**
 * VÄLIOTSIKON ANKKURI. Erotettu omaksi funktioksi, koska `toBlocks` teki
 * render-lausekkeesta liian pitkän luettavaksi. Logiikka on sama kuin
 * ennen: ä/å → a, ö → o, muut merkit viivoiksi.
 */
function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äå]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "table"; rows: string[][] };

/**
 * `body`-TAULUKOSTA LOHKOIHIN — ryhmittely, jota `map` ei yksin osaa.
 *
 * MIKSI TÄMÄ VAIHE ON OLEMASSA: taulukko on monta `body`-alkiota mutta
 * yksi `<table>`. Alkiokohtainen `map` ei näe seuraavaa riviä, joten
 * peräkkäiset "| "-rivit on kerättävä yhteen ennen renderöintiä. Kaikki
 * muu käyttäytyy täsmälleen kuten ennen: artikkeli, jossa ei ole yhtään
 * "| "-riviä, tuottaa saman lohkojonon kuin vanha suora `map`.
 *
 * MIKSI TAULUKOITA TARVITAAN: lainaoppaassa lukijan varsinainen kysymys
 * on vertailu (kolme laina-aikaa, kaksi vakuusvaihtoehtoa, takauksen
 * ehdot). Kappaleena kirjoitettu vertailu vaatii lukijan pitämään neljä
 * lukua päässään; taulukossa silmä tekee vertailun itse. Sama peruste
 * kuin sopimuskorttien hintapalkeissa.
 *
 * MIKSI EI MARKDOWN-KIRJASTOA: ks. `Prose`n perustelu. Koko merkintä on
 * kaksi sopimusta ("## " ja "| "), ja kirjasto tuo mukanaan HTML:n
 * läpipäästön. Tässä tulkissa data-tiedostoon kirjoitettu merkki ei voi
 * päätyä sivulle elementtinä.
 *
 * MUOTO: `"| Solu | Solu | Solu"`. Reunapystyviivat ovat vapaaehtoisia,
 * tyhjät solut karsitaan päistä. Erotinrivi (`| --- | --- |`) EI ole
 * tarpeen eikä sitä tueta: ensimmäinen rivi on aina otsikkorivi.
 */
function toBlocks(body: string[]): Block[] {
  const blocks: Block[] = [];
  for (const para of body) {
    if (para.startsWith("## ")) {
      blocks.push({ kind: "h2", text: para.slice(3) });
      continue;
    }
    if (para.startsWith("| ")) {
      const cells = para
        .split("|")
        .map((c) => c.trim())
        .filter((c, i, a) => !(c === "" && (i === 0 || i === a.length - 1)));
      const last = blocks[blocks.length - 1];
      if (last && last.kind === "table") {
        last.rows.push(cells);
      } else {
        blocks.push({ kind: "table", rows: [cells] });
      }
      continue;
    }
    blocks.push({ kind: "p", text: para });
  }
  return blocks;
}

/**
 * LEIPÄTEKSTIN TAULUKKO.
 *
 * MIKSI `overflow-x-auto` KÄÄREENÄ: yli puolet lukijoista tulee
 * puhelimella, ja nelisarakkeinen taulukko ei mahdu 360 pikseliin.
 * Ilman vaakavieritystä taulukko venyttäisi koko sivun leveyttä, mikä
 * rikkoo myös artikkelin muun tekstin. Vieritys rajautuu tähän kääreeseen.
 *
 * MIKSI EI UUSIA VÄREJÄ: otsikkorivi on `bg-night` (hiekkavyö) ja
 * viivat `border-line`. Nämä ovat samoja tokeneita kuin korteissa, joten
 * taulukko näyttää saman käden tekemältä myös oranssilla vyöllä, jossa
 * molemmat kääntyvät teeman mukana.
 *
 * Solut ajetaan `Prose`n läpi, jotta taulukkoon voi laittaa linkin
 * vertailuun tai lähteeseen samalla merkinnällä kuin leipätekstiin.
 */
function BodyTable({ rows }: { rows: string[][] }) {
  if (rows.length === 0) return null;
  const [head, ...body] = rows;
  return (
    <div className="!mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full border-collapse text-left text-[15px]">
        <thead>
          <tr className="bg-night">
            {head.map((cell, i) => (
              <th
                key={i}
                scope="col"
                className="whitespace-nowrap px-4 py-3 font-semibold text-ink"
              >
                <Prose text={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className="border-t border-line">
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={
                    c === 0
                      ? "px-4 py-3 font-medium text-ink"
                      : "px-4 py-3 text-ink/80"
                  }
                >
                  <Prose text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Prose({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (!m) return part;
        const [, label, href] = m;
        const cls =
          "font-semibold text-accentDark underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent";
        if (href.startsWith("http")) {
          return (
            <a key={i} href={href} target="_blank" rel="noopener nofollow" className={cls}>
              {label}
            </a>
          );
        }
        return (
          <Link key={i} href={href} className={cls}>
            {label}
          </Link>
        );
      })}
    </>
  );
}
