import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock } from "lucide-react";
import { getPost, getPosts, SITE } from "@/lib/data";
import CtaSection from "@/components/CtaSection";

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
    },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  /*
    ARTIKKELIN LOPPUKEHOTE SEURAA ARTIKKELIN AIHETTA.

    Aiemmin jokainen artikkeli päättyi samaan linkkiin sähkövertailuun —
    myös ne kolmetoista, jotka kertovat luottokorteista. Se on suoraan
    pois tuotosta: lukija, joka on juuri lukenut opiskelijan
    luottokortista, ei klikkaa sähkösopimuksia. Aihe ja kehote on
    kohdattava, tai klikki jää tekemättä.

    Sähköartikkelit vievät sähkövertailuun, kaikki muut kortteihin.
    Sähkö on päävertikaali, joten se on nimetty erikseen ja loput
    menevät toiseen — jos kategorioita tulee lisää, tämä pitää katsoa
    uudelleen eikä laajentaa arvauksella.
  */
  const isEnergy = post.category === "Sähkö";

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
        <Link href="/" className="hover:text-ink">Etusivu</Link>
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

      <div className="mt-10 space-y-6">
        {post.body.map((para, i) => (
          <p key={i} className="text-[17px] leading-[1.75] text-ink/85">{para}</p>
        ))}
      </div>

    </article>

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
    <CtaSection
      href={isEnergy ? "/sahkosopimukset#vertailu" : "/luottokortit#vertailu"}
      title={
        isEnergy
          ? "Katso nyt, paljonko sinä maksat liikaa sähköstä"
          : "Katso, mikä luottokortti sopii juuri sinun kulutukseesi"
      }
      text={
        isEnergy
          ? "Kerro asumismuotosi — Kettu laskee sopimukset euroina, ei sentteinä kilowattitunnilta."
          : "Vastaa kolmeen kysymykseen, niin Kettu järjestää kortit sinun käyttösi mukaan."
      }
      button={isEnergy ? "Kilpailuta sähkö ilmaiseksi" : "Aloita ilmainen vertailu"}
    />

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
    </>
  );
}
