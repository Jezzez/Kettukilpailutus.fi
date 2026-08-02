"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import type { Card, Post } from "@/lib/types";

/**
 * Kevyt admin-paneeli: kortit (lisää, poista, muokkaa, järjestä,
 * affiliate-linkit) ja blogitekstien lisäys. Kirjoittaa suoraan
 * JSON-sisältövarastoon /api/admin/cards-rajapinnan kautta.
 */
export default function AdminPage() {
  const [token, setToken] = useState("");
  const [cards, setCards] = useState<Card[] | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState("");

  async function load() {
    setStatus("Ladataan…");
    const res = await fetch("/api/admin/cards", { headers: { "x-admin-token": token } });
    if (res.status === 404) {
      return setStatus(
        "Hallinta ei ole käytössä tässä ympäristössä. Paneeli toimii vain paikallisessa devissä — tuotannossa sisältö päivitetään muokkaamalla data/-tiedostoja ja pushaamalla."
      );
    }
    if (!res.ok) return setStatus("Väärä tunnus. Tarkista admin-token.");
    const data = await res.json();
    setCards(data.cards);
    setPosts(data.posts);
    setStatus("");
  }

  async function save() {
    setStatus("Tallennetaan…");
    const res = await fetch("/api/admin/cards", {
      method: "PUT",
      headers: { "x-admin-token": token, "Content-Type": "application/json" },
      body: JSON.stringify({ cards, posts }),
    });
    if (res.ok) {
      return setStatus("Tallennettu. Muutokset näkyvät seuraavassa buildissa/uudelleenlatauksessa.");
    }
    // Serverless-ympäristö kertoo itse, miksi tallennus ei onnistu.
    const data = await res.json().catch(() => null);
    setStatus(data?.message ?? "Tallennus epäonnistui.");
  }

  const update = (i: number, patch: Partial<Card>) =>
    setCards((prev) => prev!.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  const move = (i: number, dir: -1 | 1) =>
    setCards((prev) => {
      const next = [...prev!];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev!;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const addCard = () =>
    setCards((prev) => [
      {
        id: `uusi-${Date.now()}`, slug: `uusi-kortti-${Date.now()}`, name: "Uusi kortti",
        issuer: "Pankki", network: "Visa", rating: 4.0, reviews: 0,
        annualFee: "0 €", annualFeeNumeric: 0, interest: "10 %", interestNumeric: 10,
        creditLimit: "1 000 – 5 000 €", creditLimitMax: 5000, interestFreeDays: "Jopa 30 pv",
        cashback: "–", hasCashback: false, bonuses: "–", travelInsurance: false,
        applePay: true, googlePay: true, bonusProgram: false, tags: [], featured: false,
        affiliateUrl: "https://example.com/aff/uusi", gradient: ["#334155", "#64748B"],
        summary: "", pros: [], cons: [], bestFor: "", fees: [], faq: [],
      } as Card,
      ...(prev ?? []),
    ]);

  const addPost = () =>
    setPosts((prev) => [
      {
        slug: `uusi-artikkeli-${Date.now()}`, title: "Uusi artikkeli", category: "Luottokortit",
        date: new Date().toISOString().slice(0, 10), readMinutes: 3,
        excerpt: "", body: ["Kirjoita sisältö tähän."],
      },
      ...prev,
    ]);

  const input =
    "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-accent";

  if (!cards) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24">
        <h1 className="text-2xl font-semibold text-ink">Kettukilpailutus · Hallinta</h1>
        <p className="mt-2 text-sm text-ink/72">Syötä admin-token (oletus dev-ympäristössä: <code className="font-data">kettu-admin</code>).</p>
        <input
          type="password" value={token} onChange={(e) => setToken(e.target.value)}
          placeholder="Admin-token" className={`mt-4 ${input}`} aria-label="Admin-token"
        />
        <button onClick={load} className="mt-3 w-full rounded-full bg-ink py-2.5 text-sm font-semibold text-cream hover:bg-navy">
          Kirjaudu
        </button>
        <p className="mt-3 text-sm text-ink/72" aria-live="polite">{status}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ink">Kettukilpailutus · Hallinta</h1>
        <div className="flex gap-2">
          <button onClick={addCard} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-ink/30">
            <Plus size={15} aria-hidden /> Lisää kortti
          </button>
          <button onClick={addPost} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-ink/30">
            <Plus size={15} aria-hidden /> Lisää blogi
          </button>
          <button onClick={save} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-cream hover:bg-accentDark">
            <Save size={15} aria-hidden /> Tallenna kaikki
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-ink/72" aria-live="polite">{status}</p>

      <h2 className="mt-8 text-lg font-bold text-ink">Kortit ({cards.length})</h2>
      <div className="mt-4 space-y-4">
        {cards.map((card, i) => (
          <div key={card.id} className="rounded-[16px] border border-line bg-white p-4 shadow-card">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-medium text-ink/72">Nimi
                <input className={input} value={card.name} onChange={(e) => update(i, { name: e.target.value })} />
              </label>
              <label className="text-xs font-medium text-ink/72">Vuosimaksu
                <input className={input} value={card.annualFee} onChange={(e) => update(i, { annualFee: e.target.value })} />
              </label>
              <label className="text-xs font-medium text-ink/72">Korko
                <input className={input} value={card.interest} onChange={(e) => update(i, { interest: e.target.value })} />
              </label>
              <label className="text-xs font-medium text-ink/72">Luottoraja
                <input className={input} value={card.creditLimit} onChange={(e) => update(i, { creditLimit: e.target.value })} />
              </label>
              <label className="text-xs font-medium text-ink/72 md:col-span-2 lg:col-span-3">Affiliate-linkki
                <input className={`${input} font-data`} value={card.affiliateUrl} onChange={(e) => update(i, { affiliateUrl: e.target.value })} />
              </label>
              <label className="flex items-end gap-2 pb-2 text-sm text-ink/80">
                <input type="checkbox" checked={card.featured} onChange={(e) => update(i, { featured: e.target.checked })} className="h-4 w-4 accent-[#E8691B]" />
                Suosituin-merkintä
              </label>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={() => move(i, -1)} aria-label="Siirrä ylös" className="rounded-lg border border-line p-1.5 text-ink/72 hover:text-ink"><ArrowUp size={15} /></button>
              <button onClick={() => move(i, 1)} aria-label="Siirrä alas" className="rounded-lg border border-line p-1.5 text-ink/72 hover:text-ink"><ArrowDown size={15} /></button>
              <button
                onClick={() => confirm(`Poistetaanko ${card.name}?`) && setCards((p) => p!.filter((_, x) => x !== i))}
                className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={15} aria-hidden /> Poista
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold text-ink">Blogit ({posts.length})</h2>
      <div className="mt-4 space-y-4">
        {posts.map((post, i) => (
          <div key={post.slug} className="rounded-[16px] border border-line bg-white p-4 shadow-card">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-xs font-medium text-ink/72 md:col-span-2">Otsikko
                <input className={input} value={post.title}
                  onChange={(e) => setPosts((p) => p.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))} />
              </label>
              <label className="text-xs font-medium text-ink/72">Kategoria
                <input className={input} value={post.category}
                  onChange={(e) => setPosts((p) => p.map((x, idx) => (idx === i ? { ...x, category: e.target.value } : x)))} />
              </label>
            </div>
            <button
              onClick={() => confirm("Poistetaanko artikkeli?") && setPosts((p) => p.filter((_, x) => x !== i))}
              className="mt-3 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={15} aria-hidden /> Poista
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
