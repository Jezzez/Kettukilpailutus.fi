import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Admin-API: lukee ja kirjoittaa data/cards.json- ja data/posts.json-tiedostoja.
 * Toimii dev-ympäristössä ja omalla Node-palvelimella. Serverless-alustalla
 * (esim. Vercel) tiedostojärjestelmä on vain luku -tilassa – vaihda silloin
 * tallennus tietokantaan tai headless CMS:ään (rajapinta pysyy samana).
 *
 * Suojaus: x-admin-token-otsake, arvo ADMIN_TOKEN-ympäristömuuttujasta.
 */
const DATA_DIR = path.join(process.cwd(), "data");

function authorized(req: Request): boolean {
  const token = req.headers.get("x-admin-token");
  return token === (process.env.ADMIN_TOKEN ?? "kettu-admin");
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const [cards, posts] = await Promise.all([
    fs.readFile(path.join(DATA_DIR, "cards.json"), "utf8"),
    fs.readFile(path.join(DATA_DIR, "posts.json"), "utf8"),
  ]);
  return NextResponse.json({ cards: JSON.parse(cards).cards, posts: JSON.parse(posts).posts });
}

export async function PUT(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
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
  return NextResponse.json({ ok: true });
}
