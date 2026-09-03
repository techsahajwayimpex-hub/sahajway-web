import { NextResponse } from "next/server";
import { connectDB, isUsingMockDB, readMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahajwayimpex.com";

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

  const feedItems = products
    .map((product) => {
      const productUrl = `${baseUrl}/products/${product.slug}`;
      const pubDate = new Date(product.updatedAt || product.createdAt || Date.now()).toUTCString();
      const description = (product.shortDescription || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const title = (product.name || "").replace(/&/g, "&amp;");

      return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${productUrl}</link>
      <guid isPermaLink="true">${productUrl}</guid>
      <description><![CDATA[${description}]]></description>
      <category><![CDATA[${product.category || "Textiles"}]]></category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sahajway Impex - B2B Export Catalog &amp; Trade Announcements</title>
    <link>${baseUrl}</link>
    <description>Latest Indian handcrafted cotton textiles, Jaipuri quilts, canvas bags, and export products available for international procurement.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${feedItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
