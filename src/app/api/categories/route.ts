import { NextResponse } from "next/server";
import { connectDB, isUsingMockDB, readMockDB } from "@/lib/db";
import CategoryModel from "@/lib/models/Category";

export async function GET() {
  if (isUsingMockDB) {
    const db = readMockDB();
    const categories = (db.categories || []).filter((c: any) => c.status);
    return NextResponse.json({ success: true, count: categories.length, data: categories });
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      const db = readMockDB();
      return NextResponse.json({ success: true, count: db.categories.length, data: db.categories });
    }

    const categories = await CategoryModel.find({ status: true }).lean();
    return NextResponse.json({ success: true, count: categories.length, data: categories });
  } catch (err: any) {
    console.error("API /api/categories error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
