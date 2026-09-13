import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Sahajway Impex - Global B2B Indian Export House";
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: "#030810",
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.12) 0%, transparent 60%)",
          padding: "70px",
          fontFamily: "system-ui, sans-serif",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 18px",
            borderRadius: "9999px",
            backgroundColor: "rgba(0, 212, 255, 0.15)",
            border: "1px solid rgba(0, 212, 255, 0.4)",
            color: "#00d4ff",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Direct Sourcing From Gujarat, India
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              fontSize: "58px",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "#ffffff",
            }}
          >
            SAHAJWAY IMPEX
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#d4af37",
              fontWeight: 600,
            }}
          >
            Luxury B2B Cotton Textiles, Jaipuri Quilts & Custom Apparel
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.65)",
            }}
          >
            Global Shipping • Mundra / JNPT Ports • Full Export Clearance Documentation
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "20px",
            fontFamily: "monospace",
            fontSize: "16px",
            color: "#8892b0",
          }}
        >
          <span>HQ: Anand, Gujarat, India</span>
          <span style={{ color: "#d4af37" }}>sahajwayimpex.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
