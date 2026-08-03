"use client";

import Link from "next/link";
import { ArrowRight, Check, Plane, Sparkles, Star } from "lucide-react";
import type { Card } from "@/lib/types";
import AffiliateButton from "./AffiliateButton";

/** Kortin tuotekuva: kortin omalla värillä piirretty maksukortti. */
export function CardMark({ card, size = 44 }: { card: Card; size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 63) / 100}
      viewBox="0 0 100 63"
      role="img"
      aria-label={`${card.name} -kortin kuva`}
      className="rounded-[7px] shadow-md"
    >
      <defs>
        <linearGradient id={`mark-${card.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={card.gradient[0]} />
          <stop offset="100%" stopColor={card.gradient[1]} />
        </linearGradient>
      </defs>
      <rect width="100" height="63" rx="7" fill={`url(#mark-${card.id})`} />
      <rect x="9" y="17" width="15" height="11" rx="2.5" fill="#E9C87E" />
      <path d="M9 22h15M16.5 17v11" stroke="rgba(90,70,20,0.35)" strokeWidth="0.9" />
      <circle cx="79" cy="46" r="7.5" fill="rgba(255,255,255,0.45)" />
      <circle cx="88" cy="46" r="7.5" fill="rgba(255,255,255,0.25)" />
      <text x="9" y="52" fill="rgba(255,255,255,0.9)" fontSize="8" fontFamily="system-ui" fontWeight="700">
        {card.issuer.toUpperCase().slice(0, 12)}
      </text>
    </svg>
  );
}

export default function CardTile({
  card,
  score,
  topMatch = false,
}: {
  card: Card;
  score?: number;
  topMatch?: boolean;
}) {
  const perks = [
    card.hasCashback ? card.cashback : null,
    card.travelInsurance ? "Matkavakuutus" : null,
    card.bonusProgram ? card.bonuses : null,
    card.annualFeeNumeric === 0 ? "Ei vuosimaksua" : null,
  ]
    .filter(Boolean)
    .slice(0, 4) as string[];

  const badge = topMatch ? "Sinun valintasi" : card.featured ? "Suosituin" : null;

  return (
    <article className="lift group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card hover:border-accent/35">
      {/* Nimi + merkintä */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-[17px] font-semibold leading-tight text-ink">
          <Link href={`/kortit/${card.slug}`} className="hover:underline underline-offset-4">
            {card.name}
          </Link>
        </h3>
        {badge ? (
          <span className="shrink-0 rounded-full bg-accentSoft px-2.5 py-1 text-[11px] font-semibold text-accentDark">
            {badge}
          </span>
        ) : card.travelInsurance ? (
          <Plane size={16} className="mt-1 shrink-0 text-ink/30" aria-hidden />
        ) : (
          <Sparkles size={16} className="mt-1 shrink-0 text-ink/30" aria-hidden />
        )}
      </div>

      {/* Kortin kuva */}
      <div className="mt-4 flex justify-center rounded-xl bg-mist/70 py-5">
        <CardMark card={card} size={148} />
      </div>

      {/*
        Edut. `flex-1` on tarkoituksellinen: se työntää vuosimaksun ja
        CTA:n kortin pohjaan, jolloin kaikkien korttien oranssit napit ovat
        samalla vaakalinjalla. Porrastetut napit näyttivät ruudukossa
        keskeneräiseltä ja hajottivat katseen — nyt silmä löytää napit yhtenä
        rivinä.
      */}
      <ul className="mt-4 flex-1 space-y-1.5">
        {perks.map((p) => (
          <li key={p} className="flex items-start gap-2 text-[13px] leading-snug text-ink/85">
            <Check size={14} strokeWidth={3} className="mt-0.5 shrink-0 text-ink/35" aria-hidden />
            <span className="line-clamp-2">{p}</span>
          </li>
        ))}
      </ul>

      {/* Vuosimaksu + arvosana */}
      <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-ink/60">Vuosimaksu</p>
          <p className="font-display text-xl font-bold text-ink">{card.annualFee}</p>
        </div>
        <p className="flex items-center gap-1 text-[12px] text-ink/70">
          <Star size={13} className="fill-star text-star" aria-hidden />
          <span className="font-data font-semibold text-ink">{card.rating.toFixed(1)}</span> / 5 (
          {card.reviews})
        </p>
      </div>

      {/* CTA */}
      <div className="mt-4">
        <AffiliateButton
          href={card.affiliateUrl}
          cardId={card.id}
          placement="card-grid"
          className="w-full"
        >
          Katso kortti
          <ArrowRight size={16} aria-hidden />
        </AffiliateButton>
      </div>

      {score !== undefined && (
        <p className="mt-3 text-center text-[11px] text-ink/55">
          Sopivuus <span className="font-data font-semibold text-accentDark">{score}</span>/100
        </p>
      )}
    </article>
  );
}
