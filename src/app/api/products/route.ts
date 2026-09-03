import { NextResponse } from "next/server";
import { connectDB, isUsingMockDB, readMockDB } from "@/lib/db";
import ProductModel from "@/lib/models/Product";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  if (isUsingMockDB) {
    const db = readMockDB();
    let products = (db.products || []).filter((p: any) => p.status);
    if (category) {
      products = products.filter((p: any) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }
    return NextResponse.json({ success: true, count: products.length, data: products.slice(0, limit) });
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      const db = readMockDB();
      return NextResponse.json({ success: true, count: db.products.length, data: db.products.slice(0, limit) });
    }

    const query: any = { status: true };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const products = await ProductModel.find(query).limit(limit).lean();
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (err: any) {
    console.error("API /api/products error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
