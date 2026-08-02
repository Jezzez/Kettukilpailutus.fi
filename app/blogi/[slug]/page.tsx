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
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Murupolku" className="flex items-center gap-1 text-[13px] text-ink/62">
        <Link href="/" className="hover:text-ink">Etusivu</Link>
        <ChevronRight size={13} aria-hidden />
        <Link href="/blogi" className="hover:text-ink">Blogi</Link>
        <ChevronRight size={13} aria-hidden />
        <span className="text-ink/85">{post.category}</span>
      </nav>

      <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 flex items-center gap-3 text-sm text-ink/62">
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("fi-FI")}</time>
        <span className="inline-flex items-center gap-1"><Clock size={13} aria-hidden /> {post.readMinutes} min lukuaika</span>
        <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold">{post.category}</span>
      </p>

      <div className="mt-10 space-y-6">
        {post.body.map((para, i) => (
          <p key={i} className="text-[17px] leading-[1.75] text-ink/85">{para}</p>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-line bg-mist/60 p-6">
        <p className="text-sm text-ink/80">
          <strong className="text-ink">Seuraava askel:</strong> vertaa Suomen suosituimmat
          luottokortit ja katso, mikä sopisi juuri sinun kulutukseesi.
        </p>
        <Link href="/sahkosopimukset#vertailu" className="mt-3 inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline">
          Siirry vertailuun →
        </Link>
      </div>
    </article>
  );
}
