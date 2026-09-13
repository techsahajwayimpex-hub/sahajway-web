import React from "react";
import DestinationCMSClient from "@/components/admin/DestinationCMSClient";
import { connectDB, readMockDB, isUsingMockDB } from "@/lib/db";
import DestinationModel from "@/lib/models/Destination";

export const revalidate = 0;

async function getDestinations() {
  if (isUsingMockDB) {
    const db = readMockDB();
    return (db.destinations || []).sort(
      (a: any, b: any) => a.displayOrder - b.displayOrder
    );
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      const db = readMockDB();
      return (db.destinations || []).sort(
        (a: any, b: any) => a.displayOrder - b.displayOrder
      );
    }
    const destinations = await DestinationModel.find()
      .sort({ displayOrder: 1 })
      .lean();
    return JSON.parse(JSON.stringify(destinations));
  } catch (err) {
    console.error("Failed to query destinations, using mock fallback:", err);
    const db = readMockDB();
    return (db.destinations || []).sort(
      (a: any, b: any) => a.displayOrder - b.displayOrder
    );
  }
}

export default async function AdminDestinationsPage() {
  const destinations = await getDestinations();

  return <DestinationCMSClient initialDestinations={destinations} />;
}
