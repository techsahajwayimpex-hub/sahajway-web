import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB, isUsingMockDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let mongoStatus = "disconnected";

  if (!isUsingMockDB) {
    try {
      const conn = await connectDB();
      if (conn && mongoose.connection.readyState === 1) {
        mongoStatus = "connected";
      }
    } catch {
      mongoStatus = "error";
    }
  } else {
    mongoStatus = "mock_mode";
  }

  const cloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== "dummy_cloud" &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== "dummy_key"
  );

  const clerkConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder"
  );

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      mongodb: {
        status: mongoStatus,
        database: process.env.DATABASE_NAME || "sahajwayimpex",
      },
      cloudinary: {
        status: cloudinaryConfigured ? "configured" : "mock_mode",
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "not_set",
      },
      clerkAuth: {
        status: clerkConfigured ? "configured" : "mock_mode",
      },
    },
  });
}
