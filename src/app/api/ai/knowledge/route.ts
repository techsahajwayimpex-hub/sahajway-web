import { NextResponse } from "next/server";
import { connectDB, isUsingMockDB, readMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import { defaultExportFAQs } from "@/lib/seo/schemas";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahajwayimpex.com";

  let products: any[] = [];
  if (isUsingMockDB) {
    const db = readMockDB();
    products = (db.products || []).filter((p: any) => p.status);
  } else {
    try {
      await connectDB();
      const dbProducts = await ProductModel.find({ status: true }).lean();
      products = JSON.parse(JSON.stringify(dbProducts));
    } catch {
      const db = readMockDB();
      products = (db.products || []).filter((p: any) => p.status);
    }
  }

  const payload = {
    schemaVersion: "1.0",
    generatedAt: new Date().toISOString(),
    company: {
      name: "Sahajway Impex",
      legalName: "Sahajway Impex Private Limited",
      established: "August 2025",
      headquarters: {
        locality: "Anand",
        region: "Gujarat",
        country: "India",
        countryCode: "IN",
        postalCode: "388001",
        coordinates: {
          latitude: 22.5645,
          longitude: 72.9289,
        },
      },
      website: siteUrl,
      contact: {
        email: "contact@sahajwayimpex.com",
        phone: "+91 96380 07789",
        inquiryUrl: `${siteUrl}/contact`,
      },
      primaryExportMarkets: [
        "United States",
        "United Kingdom",
        "European Union",
        "Canada",
        "Australia",
        "Japan",
        "United Arab Emirates",
      ],
    },
    logistics: {
      portsOfLoading: [
        { name: "Mundra Port", code: "INMUN1", mode: "Sea Freight" },
        { name: "Kandla Port", code: "INIXY1", mode: "Sea Freight" },
        { name: "Nhava Sheva (JNPT) Mumbai", code: "INNSA1", mode: "Sea Freight" },
        { name: "Ahmedabad International Airport", code: "AMD", mode: "Air Freight" },
      ],
      incotermsSupported: ["FOB", "CIF", "CFR", "EXW"],
      acceptedCurrencies: ["USD", "EUR", "GBP", "AUD", "INR", "CAD"],
      paymentTerms: [
        "Irrevocable Letter of Credit (L/C at sight)",
        "Telegraphic Transfer (T/T)",
        "Wire Transfer",
      ],
    },
    faqs: defaultExportFAQs,
    products: products.map((p) => ({
      name: p.name,
      slug: p.slug,
      url: `${siteUrl}/products/${p.slug}`,
      category: p.category,
      shortDescription: p.shortDescription,
      specifications: p.specifications || [],
      features: p.features || [],
      exportInformation: p.exportInformation || "",
      images: p.images || [],
    })),
  };

  return NextResponse.json(payload, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
