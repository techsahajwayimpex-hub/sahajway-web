import React from "react";
import BannerCMSClient from "@/components/admin/BannerCMSClient";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import BannerModel from "@/lib/models/Banner";

export const revalidate = 0;

async function getBanners() {
  if (isUsingMockDB) {
    const db = readMockDB();
    return (db.banners || []).sort(
      (a: any, b: any) => a.displayOrder - b.displayOrder
    );
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      const db = readMockDB();
      return (db.banners || []).sort(
        (a: any, b: any) => a.displayOrder - b.displayOrder
      );
    }
    const banners = await BannerModel.find()
      .sort({ displayOrder: 1 })
      .lean();
    return JSON.parse(JSON.stringify(banners));
  } catch (err) {
    console.error("Failed to query banners, using mock fallback:", err);
    const db = readMockDB();
    return (db.banners || []).sort(
      (a: any, b: any) => a.displayOrder - b.displayOrder
    );
  }
}

export default async function AdminBannersPage() {
  const banners = await getBanners();

  return <BannerCMSClient initialBanners={banners} />;
}
