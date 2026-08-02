import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Kettukilpailutus – kilpailuta sähkö, kortit ja sopimukset";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Jaettavan linkin esikatselukuva samalla tummalla ilmeellä kuin sivusto. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0A0807",
          backgroundImage:
            "radial-gradient(60% 80% at 15% 0%, rgba(232,105,27,0.28) 0%, rgba(232,105,27,0) 60%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#D9A24F", fontSize: 24, letterSpacing: 4 }}>
          KETTUKILPAILUTUS
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 24, fontSize: 78, fontWeight: 700, color: "#F7F1E8", lineHeight: 1.05 }}>
          Halvin sähkö löytyy laskemalla.
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "rgba(247,241,232,0.6)" }}>
          Vertaa sopimukset omalla kulutuksellasi — ilmaiseksi.
        </div>
        <div style={{ display: "flex", marginTop: 40, alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", width: 56, height: 6, backgroundColor: "#E8691B", borderRadius: 3 }} />
          <div style={{ display: "flex", fontSize: 26, color: "#E8691B", fontWeight: 700 }}>
            kettukilpailutus.fi
          </div>
        </div>
      </div>
    ),
    size
  );
}
