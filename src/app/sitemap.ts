import { MetadataRoute } from "next";
import { connectDB, isUsingMockDB, readMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";

export const revalidate = 86400; // Cache sitemap for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahajwayimpex.com";

  // Core public marketing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      images: [`${baseUrl}/logo.png`],
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  // Query products dynamically to map pages in sitemap
  let products: any[] = [];

  if (isUsingMockDB) {
    const db = readMockDB();
    products = (db.products || []).filter((p: any) => p.status);
  } else {
    try {
      const conn = await connectDB();
      if (conn) {
        const dbProducts = await ProductModel.find({ status: true })
          .select("slug updatedAt images")
          .lean();
        products = JSON.parse(JSON.stringify(dbProducts));
      } else {
        const db = readMockDB();
        products = (db.products || []).filter((p: any) => p.status);
      }
    } catch {
      const db = readMockDB();
      products = (db.products || []).filter((p: any) => p.status);
    }
  }

  const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
    images: prod.images && prod.images.length > 0 ? prod.images : undefined,
  }));

  return [...staticRoutes, ...productRoutes];
}
