import { NextResponse } from "next/server";
import { connectDB, readMockDB, isUsingMockDB, writeMockDB } from "@/lib/db";
import DestinationModel from "@/lib/models/Destination";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/destinations
 * Fetches all active trade destinations for 3D globe and public showcase
 */
export async function GET() {
  if (isUsingMockDB) {
    const data = readMockDB();
    const destinations = (data.destinations || [])
      .filter((d: any) => d.active)
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
    return NextResponse.json(destinations);
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      const data = readMockDB();
      const destinations = (data.destinations || [])
        .filter((d: any) => d.active)
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder);
      return NextResponse.json(destinations);
    }

    const destinations = await DestinationModel.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();

    return NextResponse.json(destinations);
  } catch (error: any) {
    console.error("Failed to fetch destinations:", error);
    const data = readMockDB();
    return NextResponse.json(
      (data.destinations || []).filter((d: any) => d.active)
    );
  }
}

/**
 * POST /api/destinations
 * Admin API to create a new destination
 */
export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, country, lat, lon, displayOrder, active } = body;

    if (!name || !country || lat === undefined || lon === undefined) {
      return NextResponse.json(
        { error: "Name, country, latitude, and longitude are required." },
        { status: 400 }
      );
    }

    if (isUsingMockDB) {
      const db = readMockDB();
      const newDest = {
        _id: `dest_${Date.now()}`,
        name,
        country,
        lat: Number(lat),
        lon: Number(lon),
        displayOrder: Number(displayOrder) || (db.destinations?.length || 0) + 1,
        active: active ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.destinations = db.destinations || [];
      db.destinations.push(newDest);
      writeMockDB(db);
      return NextResponse.json(newDest, { status: 201 });
    }

    await connectDB();
    const destination = await DestinationModel.create({
      name,
      country,
      lat: Number(lat),
      lon: Number(lon),
      displayOrder: Number(displayOrder) || 0,
      active: active ?? true,
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error: any) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create destination" },
      { status: 500 }
    );
  }
}
