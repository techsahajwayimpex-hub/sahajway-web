"use server";

import { revalidatePath } from "next/cache";
import { connectDB, isUsingMockDB, readMockDB, writeMockDB } from "@/lib/db";
import DestinationModel from "@/lib/models/Destination";
import { getAdminSession } from "@/lib/auth";

// Auth verification
async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isAuthenticated) {
    throw new Error("Unauthorized access. Admin privileges required.");
  }
}

/**
 * Creates a new Trade Destination
 */
export async function createDestination(data: {
  name: string;
  country: string;
  lat: number;
  lon: number;
  displayOrder: number;
  active: boolean;
}) {
  await checkAuth();

  if (isUsingMockDB) {
    const db = readMockDB();
    const newDest = {
      _id: `dest_${Date.now()}`,
      name: data.name,
      country: data.country,
      lat: Number(data.lat),
      lon: Number(data.lon),
      displayOrder: Number(data.displayOrder) || 0,
      active: data.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.destinations.push(newDest);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      const dest = new DestinationModel({
        name: data.name,
        country: data.country,
        lat: Number(data.lat),
        lon: Number(data.lon),
        displayOrder: Number(data.displayOrder) || 0,
        active: data.active ?? true,
      });

      await dest.save();
    } catch (err: any) {
      console.error("Database error creating destination:", err);
      return {
        success: false,
        message: err.message || "Failed to create trade destination",
      };
    }
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/");
  return { success: true };
}

/**
 * Updates an existing Trade Destination
 */
export async function updateDestination(
  id: string,
  data: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    displayOrder: number;
    active: boolean;
  }
) {
  await checkAuth();

  if (isUsingMockDB) {
    const db = readMockDB();
    const idx = db.destinations.findIndex((d: any) => d._id === id);
    if (idx === -1) {
      return { success: false, message: "Destination not found" };
    }

    db.destinations[idx] = {
      ...db.destinations[idx],
      name: data.name,
      country: data.country,
      lat: Number(data.lat),
      lon: Number(data.lon),
      displayOrder: Number(data.displayOrder) || 0,
      active: data.active,
      updatedAt: new Date().toISOString(),
    };
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      await DestinationModel.findByIdAndUpdate(id, {
        name: data.name,
        country: data.country,
        lat: Number(data.lat),
        lon: Number(data.lon),
        displayOrder: Number(data.displayOrder) || 0,
        active: data.active,
      });
    } catch (err: any) {
      console.error("Database error updating destination:", err);
      return {
        success: false,
        message: err.message || "Failed to update trade destination",
      };
    }
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/");
  return { success: true };
}

/**
 * Deletes a Trade Destination
 */
export async function deleteDestination(id: string) {
  await checkAuth();

  if (isUsingMockDB) {
    const db = readMockDB();
    db.destinations = db.destinations.filter((d: any) => d._id !== id);
    writeMockDB(db);
  } else {
    try {
      await connectDB();
      await DestinationModel.findByIdAndDelete(id);
    } catch (err: any) {
      console.error("Database error deleting destination:", err);
      return {
        success: false,
        message: err.message || "Failed to delete destination",
      };
    }
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/");
  return { success: true };
}

/**
 * Toggles active status of a Trade Destination
 */
export async function toggleDestinationStatus(id: string, active: boolean) {
  await checkAuth();

  if (isUsingMockDB) {
    const db = readMockDB();
    const dest = db.destinations.find((d: any) => d._id === id);
    if (dest) {
      dest.active = active;
      writeMockDB(db);
    }
  } else {
    try {
      await connectDB();
      await DestinationModel.findByIdAndUpdate(id, { active });
    } catch (err: any) {
      console.error("Failed to toggle destination status:", err);
      return { success: false, message: "Failed to update status" };
    }
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/");
  return { success: true };
}
