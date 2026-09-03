import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Sahajway Impex - Premium Indian B2B Export House";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
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
            "radial-gradient(circle at 25px 25px, rgba(212, 175, 55, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(0, 212, 255, 0.1) 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top Tag & Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(212, 175, 55, 0.15)",
              border: "1px solid rgba(212, 175, 55, 0.4)",
              color: "#d4af37",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            B2B Global Export Partner
          </div>
          <div
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "18px",
              fontFamily: "monospace",
            }}
          >
            Anand, Gujarat, India (IN-GJ)
          </div>
        </div>

        {/* Main Title & Value Prop */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "1000px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#ffffff",
            }}
          >
            SAHAJWAY IMPEX
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 500,
              lineHeight: 1.3,
              color: "#d4af37",
            }}
          >
            Connecting Indian Craftsmanship With Global Markets
          </div>
          <div
            style={{
              fontSize: "22px",
              lineHeight: 1.4,
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Handcrafted Organic Textiles • Jaipuri Bedding • Quilted Bags • Baby Bathrobes
          </div>
        </div>

        {/* Bottom Bar Details */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "32px", fontSize: "18px", color: "#00d4ff", fontFamily: "monospace" }}>
            <span>PORTS: MUNDRA / KANDLA / JNPT</span>
            <span>INCOTERMS: FOB / CIF / CFR</span>
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: "monospace",
            }}
          >
            sahajwayimpex.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
