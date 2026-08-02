import { NextResponse } from "next/server";

/**
 * Affiliate-klikkausten palvelinpuolen kirjaus.
 * Tuotannossa tämä ohjataan haluttuun analytiikkaan tai tietokantaan;
 * oletuksena tapahtuma kirjataan palvelimen lokiin.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("[affiliate_click]", JSON.stringify(data));
  } catch {
    // Tyhjä body sendBeaconista ei ole virhe.
  }
  return NextResponse.json({ ok: true });
}
