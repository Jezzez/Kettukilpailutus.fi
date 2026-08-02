import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Admin-API: lukee ja kirjoittaa data/cards.json- ja data/posts.json-tiedostoja.
 *
 * TÄRKEÄÄ: tämä toimii vain ympäristössä, jossa tiedostojärjestelmään voi
 * kirjoittaa — käytännössä paikallisessa devissä tai omalla Node-palvelimella.
 * Vercelin serverless-ympäristössä levy on vain luku -tilassa, joten paneeli
 * on siellä oletuksena kokonaan pois päältä (ks. adminEnabled).
 *
 * Ympäristömuuttujat:
 *   ADMIN_ENABLED=true   kytkee paneelin päälle tuotannossa (älä aseta Verceliin)
 *   ADMIN_TOKEN=...      pakollinen tuotannossa, ei oletusarvoa
 */
const DATA_DIR = path.join(process.cwd(), "data");
const isDev = process.env.NODE_ENV !== "production";

/** Devissä päällä automaattisesti, tuotannossa vain nimenomaisella luvalla. */
function adminEnabled(): boolean {
  return isDev || process.env.ADMIN_ENABLED === "true";
}

/**
 * Tuotannossa token luetaan vain ympäristömuuttujasta. Kovakoodattu
 * oletusarvo julkisessa repossa ei ole suojaus, joten sellaista ei ole.
 */
function authorized(req: Request): boolean {
  const expected = process.env.ADMIN_TOKEN ?? (isDev ? "kettu-admin" : undefined);
  if (!expected) return false;
  return req.headers.get("x-admin-token") === expected;
}

/** Pois kytketty paneeli ei paljasta olemassaoloaan. */
const notFound = () => NextResponse.json({ error: "not found" }, { status: 404 });

export async function GET(req: Request) {
  if (!adminEnabled()) return notFound();
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [cards, posts] = await Promise.all([
    fs.readFile(path.join(DATA_DIR, "cards.json"), "utf8"),
    fs.readFile(path.join(DATA_DIR, "posts.json"), "utf8"),
  ]);
  return NextResponse.json({ cards: JSON.parse(cards).cards, posts: JSON.parse(posts).posts });
}

export async function PUT(req: Request) {
  if (!adminEnabled()) return notFound();
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();

  try {
    if (Array.isArray(body.cards)) {
      await fs.writeFile(
        path.join(DATA_DIR, "cards.json"),
        JSON.stringify({ cards: body.cards }, null, 2),
        "utf8"
      );
    }
    if (Array.isArray(body.posts)) {
      await fs.writeFile(
        path.join(DATA_DIR, "posts.json"),
        JSON.stringify({ posts: body.posts }, null, 2),
        "utf8"
      );
    }
  } catch (err) {
    // Serverless-alustan levy on vain luku -tilassa (EROFS/EACCES).
    // Kerrotaan se suoraan sen sijaan, että tallennus epäonnistuisi hiljaisesti.
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES") {
      return NextResponse.json(
        {
          error: "readonly",
          message:
            "Tiedostojärjestelmä on vain luku -tilassa. Muokkaa data/-tiedostoja paikallisesti ja pushaa muutokset.",
        },
        { status: 503 }
      );
    }
    throw err;
  }

  return NextResponse.json({ ok: true });
}
