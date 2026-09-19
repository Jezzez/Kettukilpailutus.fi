"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/lib/types";

/*
  UKK-HAITARI — YKSI KOMPONENTTI, SEITSEMÄN SIVUA.

  Tämä komponentti on käytössä sähkösivulla, jokaisella 24 sopimussivulla,
  aihesivuilla, lainasivulla, korttisivuilla ja etusivulla. Siksi jokainen
  muutos tähän on halpa ja jokainen virhe tässä on kallis.

  =====================================================================
  MIKSI VASTAUKSET OVAT AINA DOM:SSA, VAIKKA NE EIVÄT NÄY
  =====================================================================

  Aiempi versio renderöi vastauksen `AnimatePresence`-lohkon sisällä ehdolla
  `{isOpen && ...}`. Se tarkoittaa, että suljetun kysymyksen vastausta ei ole
  sivun HTML:ssä lainkaan. Samaan aikaan sivun JSON-LD kertoi Googlelle
  kaikkien kysymysten vastaukset.

  Se on kaksi erillistä ongelmaa:

  1. HAKUKONE. Rakennedatassa luvattu vastaus, jota ei löydy sivun
     sisällöstä, on Googlen rikastettujen tulosten ohjeissa nimenomaan
     kielletty ("sisällön on oltava näkyvissä käyttäjälle"). Riski on
     rikastetun tuloksen menetys, ja UKK-tulos vie hakutuloksessa
     moninkertaisen tilan tavalliseen siniseen linkkiin nähden.
  2. SIVUN SISÄINEN HAKU. Selaimen Ctrl+F ei löydä tekstiä, jota ei ole
     DOM:ssa. Kävijä, joka etsii sanaa "irtisanominen", saa nolla osumaa
     sivulta, jolla vastaus on.

  Ratkaisu on CSS-ruudukko: kääre on `grid`, jonka `grid-template-rows`
  animoituu arvosta `0fr` arvoon `1fr`. Sisältö on koko ajan olemassa ja
  koko ajan mitattu, joten selain osaa animoida korkeuden ilman että
  kukaan laskee pikseleitä JavaScriptillä. Tämä on myös syy siihen, että
  framer-motion lähti tästä tiedostosta kokonaan: haitari ei enää tarvitse
  JS-animaatiota, eikä seitsemän sivua lataa kirjastoa tämän takia.

  `visibility: hidden` suljetussa tilassa estää sen, että piilotettu teksti
  saisi näppäimistökohdistuksen tai tulisi ruudunlukijalle luetuksi. Se
  periytyy lapsille, eikä se poista tekstiä DOM:sta, eli kohta 1 ja 2
  säilyvät.

  =====================================================================
  MIKSI USEA VASTAUS SAA OLLA AUKI YHTÄ AIKAA
  =====================================================================

  Aiemmin avaus sulki edellisen. Se on tyylikästä ja väärin: kävijä, joka
  vertaa kahta vastausta ("mitä palvelu maksaa" ja "mistä te ansaitsette"),
  joutui avaamaan ne vuorotellen ja muistamaan ensimmäisen ulkoa. UKK on
  viimeinen paikka, jossa epäröivä lukija etsii syytä olla tekemättä
  sopimusta, eikä sen pidä työllistää muistia.

  Sivun ensimmäinen kysymys on auki heti. Suljettu lista näyttää tyhjältä,
  ja tyhjä osio ohitetaan.

  =====================================================================
  JSON-LD TULEE SAMASTA TAULUKOSTA KUIN NÄKYVÄ LISTA
  =====================================================================

  Ei koskaan omasta kopiostaan. Jos merkintä ja teksti erkanevat, Google
  näkee eri vastauksen kuin kävijä, ja se on juuri se tilanne, jonka
  yläpuolella oleva kohta 1 kieltää.
*/

export default function Faq({ items }: { items: FaqItem[] }) {
  /*
    Avoimet rivit ovat `Set`, koska niitä voi olla monta. Ensimmäinen on
    auki alusta. `new Set([0])` luodaan alustusfunktiossa eikä suoraan
    argumenttina, jotta uutta joukkoa ei rakenneta jokaisella renderillä.
  */
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/*
        RIVIT EIVÄT OLE KORTTEJA VAAN YKSI KORTTI, JOSSA ON HIUSVIIVAT.
        Kahdeksan erillistä laatikkoa allekkain lukee listaksi vaihtoehtoja,
        joista pitää valita yksi. Yksi pinta hiusviivoilla lukee listaksi
        kysymyksiä, joita voi lukea missä järjestyksessä tahansa.
      */}
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        {items.map((item, i) => {
          const isOpen = open.has(i);
          const panelId = `faq-panel-${i}`;
          const buttonId = `faq-button-${i}`;

          return (
            <div
              key={item.q}
              className={isOpen ? "bg-mist" : "transition-colors hover:bg-mist/60"}
            >
              {/*
                KOKO RIVI ON NAPPI, EI PELKKÄ OTSIKKOTEKSTI. Kosketusnäytöllä
                kysymyksen viereen osuva sormi on yleisempi kuin kysymyksen
                päälle osuva, ja osumaton painallus luetaan rikkinäiseksi
                sivuksi eikä omaksi harha-askeleeksi.

                `border-l-[3px]` on myös suljetussa tilassa läpinäkyvänä.
                Jos reuna ilmestyisi vasta avattaessa, rivin sisältö
                siirtyisi kolme pikseliä sivuun juuri sillä hetkellä, kun
                katse on siinä.
              */}
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className={`flex w-full items-center justify-between gap-4 border-l-[3px] px-5 py-5 text-left transition-colors sm:px-6 ${
                    isOpen ? "border-accent" : "border-transparent"
                  }`}
                >
                  <span
                    className={`font-display text-[15px] font-bold sm:text-[16px] ${
                      isOpen ? "text-accentDark" : "text-ink"
                    }`}
                  >
                    {item.q}
                  </span>

                  {/*
                    PLUSSA, JOKA KÄÄNTYY MIINUKSEKSI. Nuoli kertoo suunnan
                    ("tästä avautuu jotain alaspäin"), plussa kertoo teon
                    ("tässä on lisää") ja miinus kertoo sen perumisen.
                    45 asteen kierto tekee muutoksen yhdellä elementillä
                    ilman että ikonia vaihdetaan kesken animaation.
                  */}
                  <span
                    aria-hidden
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-300 ease-out motion-reduce:transition-none ${
                      isOpen
                        ? "rotate-45 bg-accent text-onEmber"
                        : "bg-ink/6 text-ink/60"
                    }`}
                  >
                    <Plus size={16} strokeWidth={2.6} />
                  </span>
                </button>
              </h3>

              {/*
                HAITARIN LIIKE. Ulompi ruudukko animoi rivin korkeuden,
                sisempi `min-h-0` sallii sisällön kutistua nollaan (ilman
                sitä ruudukon rivin vähimmäiskorkeus on sisällön korkeus,
                eikä mikään liiku).

                `visibility` ON MUKANA SIIRTYMÄLUETTELOSSA, EIKÄ SE OLE
                TURHA. Ilman sitä selain vaihtaisi arvon heti, jolloin
                teksti katoaisi ensimmäisellä ruudunpäivityksellä ja
                laatikko kutistuisi tyhjänä sen jälkeen. Siirtymässä
                `visibility` käyttäytyy juuri oikein: näkyväksi se vaihtuu
                heti alussa ja piiloon vasta lopussa.

                MIKSI SITÄ TARVITAAN LAINKAAN: nollan korkuinen sisältö on
                yhä ruudunlukijan luettavissa, ja silloin lukija kuulisi
                kaikki vastaukset peräkkäin vaikka `aria-expanded` sanoo
                "suljettu". `visibility: hidden` periytyy lapsille eikä
                poista tekstiä DOM:sta, joten hakukone näkee sen yhä.
              */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-out motion-reduce:transition-none ${
                  isOpen
                    ? "visible grid-rows-[1fr] opacity-100"
                    : "invisible grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="border-l-[3px] border-accent px-5 pb-6 text-[15px] leading-relaxed text-ink/75 sm:px-6">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
