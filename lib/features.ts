/**
 * Vertikaalien näkyvyyskytkimet.
 *
 * MIKSI KYTKIN EIKÄ POISTO: korttivertailu on valmista työtä — kahdeksan
 * korttisivua, vertailutaulukko, suodattimet. Sen poistaminen tarkoittaisi,
 * että avaaminen olisi myöhemmin uusi projekti eikä yhden rivin muutos.
 * Kytkimellä koodi jää paikalleen, mutta sivusto ei paljasta sitä.
 *
 * MIKSI KORTIT OVAT NYT PIILOSSA: korttien affiliate-linkit ovat yhä
 * `example.com/aff/...` -paikkamerkkejä, joten osio ei tuota euroakaan.
 * Sillä välin se maksaa: etusivu tarjoaa kävijälle kaksi polkua, ja
 * valinta hidastaa. Kun näkyvissä on yksi vertikaali, jokainen kävijä
 * ohjautuu sinne missä ansainta oikeasti on. Lisäksi puolivalmis toinen
 * osio syö luottamusta koko sivustolta — vertailusivun ainoa pääoma.
 *
 * NÄIN KORTIT PALAAVAT: vaihda `cards` arvoon `true`. Navigaatio, footer,
 * etusivun kategoriaruudukko, sivukartta ja blogin loppukehotteet
 * palautuvat samalla, koska ne kaikki lukevat tätä samaa arvoa.
 *
 * MIKSI LAINAT OVAT NÄKYVISSÄ VAIKKA KORTIT EIVÄT: kyse on samasta
 * mittarista eli tuotosta. Korteilla ei ole toimivaa affiliate-linkkiä,
 * joten osio ei voi ansaita. Lainoilla on: Sortterin linkki on oikea ja
 * palkkio maksetaan hakemuksesta. Kettu ei vertaile lainoja itse eikä
 * teeskentele vertailevansa — sivu sanoo suoraan ohjaavansa kumppanille.
 */
export const FEATURES = {
  /** Näytetäänkö /luottokortit ja /kortit/[slug] sekä kaikki niihin vievät linkit. */
  cards: false,
  /** Näytetäänkö /lainat sekä kaikki siihen vievät linkit. */
  loans: true,
} as const;
