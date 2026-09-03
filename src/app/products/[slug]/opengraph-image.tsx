import { ImageResponse } from "next/og";
import { connectDB, isUsingMockDB, readMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";

export const runtime = "nodejs";
export const alt = "Sahajway Impex Product Specification";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function getProduct(slug: string) {
  if (isUsingMockDB) {
    const data = readMockDB();
    return (data.products || []).find((p: any) => p.slug === slug) || null;
  }
  try {
    await connectDB();
    const product = await ProductModel.findOne({ slug, status: true }).lean();
    if (!product) {
      const data = readMockDB();
      return (data.products || []).find((p: any) => p.slug === slug) || null;
    }
    return JSON.parse(JSON.stringify(product));
  } catch {
    const data = readMockDB();
    return (data.products || []).find((p: any) => p.slug === slug) || null;
  }
}

export default async function ProductOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  const title = product?.name || "B2B Export Product Specification";
  const category = product?.category || "Textiles & Apparel";
  const shortDesc =
    product?.shortDescription ||
    "Premium export-grade craftsmanship manufactured in Gujarat, India.";

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
            "linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(3, 8, 16, 1) 70%)",
          padding: "70px",
          fontFamily: "system-ui, sans-serif",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(0, 212, 255, 0.15)",
              border: "1px solid rgba(0, 212, 255, 0.4)",
              color: "#00d4ff",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
          <div
            style={{
              color: "#d4af37",
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            SAHAJWAY IMPEX
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "1000px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "#ffffff",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "22px",
              lineHeight: 1.4,
              color: "rgba(255, 255, 255, 0.75)",
            }}
          >
            {shortDesc}
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
          <div style={{ display: "flex", gap: "24px" }}>
            <span style={{ color: "#d4af37" }}>ORIGIN: ANAND, GUJARAT</span>
            <span style={{ color: "#00d4ff" }}>INCOTERMS: FOB / CIF</span>
            <span>CUSTOM PACKAGING AVAILABLE</span>
          </div>
          <span style={{ color: "#ffffff" }}>B2B Wholesale Catalog</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
