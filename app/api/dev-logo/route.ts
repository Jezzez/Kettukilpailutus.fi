/*
  VÄLIAIKAINEN KEHITYSREITTI — POISTETAAN KUN LOGOT ON HAETTU.

  Kolme tehtävää, koska logon matka yhtiön sivulta `public/logot/`-kansioon
  törmää kolmeen selaimen rajoitukseen:

  1. `?nouda` — palvelin lataa kuvan ja tallentaa sen. Selain ei voi:
     https-sivulta ei pääse localhostiin eikä localhost saa lukea toisen
     sivuston kuvatavuja ilman CORS-otsakkeita.
  2. `?teksti` — palvelin hakee SVG:n ja palauttaa sen tekstinä. Tarvitaan,
     koska SVG:tä ei voi muuttaa PNG:ksi palvelimella ilman `sharp`-kirjastoa,
     jota tähän projektiin ei asenneta.
  3. `?tallenna` — selain piirtää SVG:n canvakselle ja lähettää valmiin PNG:n
     base64-muodossa takaisin tallennettavaksi.

  Toimii VAIN kehitysympäristössä.
*/
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const EXT: Record<string, string> = {
  "image/svg+xml": "svg",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function kirjoita(name: string, ext: string, bytes: Buffer) {
  const dir = path.join(process.cwd(), "public", "logot");
  await mkdir(dir, { recursive: true });
  const file = `${name}.${ext}`;
  await writeFile(path.join(dir, file), bytes);
  return { ok: true, file, bytes: bytes.length };
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "vain devissä" }, { status: 404 });
  }

  const url = new URL(req.url);
  const body = (await req.json()) as { name?: string; url?: string; png?: string };

  // Nimi saa sisältää vain kirjaimia, numeroita ja väliviivan — ei polkuja.
  if (body.name && !/^[a-z0-9-]+$/.test(body.name)) {
    return NextResponse.json({ error: "virheellinen nimi" }, { status: 400 });
  }

  // 3. Selaimen canvaksella tekemä PNG talteen.
  if (url.searchParams.has("tallenna")) {
    if (!body.name || !body.png) {
      return NextResponse.json({ error: "nimi tai png puuttuu" }, { status: 400 });
    }
    const raw = body.png.replace(/^data:image\/png;base64,/, "");
    return NextResponse.json(await kirjoita(body.name, "png", Buffer.from(raw, "base64")));
  }

  if (!body.url) {
    return NextResponse.json({ error: "url puuttuu" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(body.url, {
      headers: { "User-Agent": UA, Accept: "image/svg+xml,image/png,image/webp,image/*,*/*;q=0.8" },
    });
  } catch (e) {
    return NextResponse.json({ error: `lataus epäonnistui: ${String(e)}` }, { status: 502 });
  }
  if (!res.ok) {
    return NextResponse.json({ error: `HTTP ${res.status}` }, { status: 502 });
  }

  const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();

  // 2. SVG tekstinä selaimelle piirrettäväksi.
  if (url.searchParams.has("teksti")) {
    return NextResponse.json({ ok: true, type, svg: await res.text() });
  }

  // 1. Suora tallennus.
  const ext = EXT[type];
  if (!ext) {
    return NextResponse.json({ error: `tuntematon tyyppi: ${type}` }, { status: 415 });
  }
  if (!body.name) {
    return NextResponse.json({ error: "nimi puuttuu" }, { status: 400 });
  }
  return NextResponse.json(await kirjoita(body.name, ext, Buffer.from(await res.arrayBuffer())));
}
