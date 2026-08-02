import { Star } from "lucide-react";
import Reveal from "./Reveal";

const REVIEWS = [
  {
    name: "Anni K.",
    city: "Helsinki",
    stars: 5,
    text: "Löysin viidessä minuutissa kortin, jossa ei ole vuosimaksua ja joka kerryttää bonusta. Suodattimet tekivät valinnasta naurettavan helppoa.",
  },
  {
    name: "Mikko T.",
    city: "Tampere",
    stars: 5,
    text: "Vertailutaulukko näytti suoraan, missä kortissa on matalin korko. Säästän arviolta pari sataa euroa vuodessa vanhaan korttiini verrattuna.",
  },
  {
    name: "Laura V.",
    city: "Oulu",
    stars: 4,
    text: "Selkeät korttisivut ja rehelliset miinukset – harvinaista vertailusivustolla. Hain kortin suoraan sivun kautta.",
  },
];

export default function Testimonials() {
  return (
    <section aria-label="Käyttäjien arviot" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                Käyttäjät luottavat Kettuun
              </h2>
              <p className="mt-3 max-w-md text-ink/72">
                Aitoja kokemuksia vertailun käyttäjiltä.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5">
              <span className="flex" aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-star text-star" />
                ))}
              </span>
              <span className="font-data text-sm text-ink">4,8/5</span>
              <span className="text-xs text-ink/62">· 1 400+ arviota</span>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card">
                <span className="flex gap-0.5" aria-label={`${r.stars} tähteä viidestä`}>
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s} size={15} aria-hidden
                      className={s < r.stars ? "fill-star text-star" : "text-line"}
                    />
                  ))}
                </span>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/82">
                  ”{r.text}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-semibold text-ink">
                  {r.name} <span className="font-normal text-ink/62">· {r.city}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
