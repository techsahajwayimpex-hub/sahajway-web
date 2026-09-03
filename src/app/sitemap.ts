import { MetadataRoute } from "next";
import { connectDB, isUsingMockDB, readMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";

export const revalidate = 86400; // Cache sitemap for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Core public marketing pages
  const staticRoutes = ["", "/products", "/about", "/team", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Query products dynamically to map pages in sitemap
  let products: any[] = [];

  if (isUsingMockDB) {
    const db = readMockDB();
    products = db.products.filter((p: any) => p.status);
  } else {
    try {
      await connectDB();
      const dbProducts = await ProductModel.find({ status: true })
        .select("slug updatedAt")
        .lean();
      products = JSON.parse(JSON.stringify(dbProducts));
    } catch (err) {
      console.error("Sitemap generation database connection failed, falling back to mock:", err);
      const db = readMockDB();
      products = db.products.filter((p: any) => p.status);
    }
  }

  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
